const port = process.env.CDP_PORT || '9222';
const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173';
const widths = (process.env.TEST_WIDTHS || '1280,390,375,360').split(',').map(Number);

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

class Cdp {
  constructor(url) {
    this.id = 0;
    this.pending = new Map();
    this.errors = [];
    this.socket = new WebSocket(url);
  }
  async open() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data);
      if (message.method === 'Runtime.exceptionThrown') this.errors.push(message.params.exceptionDetails?.text || 'Uncaught browser exception');
      if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') this.errors.push('console.error');
      if (!message.id || !this.pending.has(message.id)) return;
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  close() { this.socket.close(); }
}

const pageTarget = async () => {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' });
  if (!response.ok) throw new Error(`Could not create browser target: ${response.status}`);
  return response.json();
};

const evaluate = async (cdp, expression) => {
  const result = await cdp.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Browser evaluation failed');
  return result.result.value;
};

const waitFor = async (cdp, expression, message, timeout = 8000) => {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(cdp, expression)) return;
    await sleep(100);
  }
  throw new Error(message);
};

const testWidth = async (width) => {
  const target = await pageTarget();
  const cdp = new Cdp(target.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width, height: width < 600 ? 780 : 900, deviceScaleFactor: 1, mobile: width < 600 });
  if (process.env.REDUCED_MOTION === '1') {
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  }
  await cdp.send('Page.navigate', { url: `${baseUrl}/index.html` });
  await waitFor(cdp, `document.readyState === 'complete'`, 'index.html did not initialize');
  await evaluate(cdp, `localStorage.removeItem('whiteBloomArgProgress'); location.reload()`);
  await waitFor(cdp, `document.readyState === 'complete' && document.querySelector('.home-dahlia-anomaly')`, 'index.html did not reset');

  assert(await evaluate(cdp, `document.body.dataset.phase === 'phase1'`), `${width}: PHASE1 did not start on the home page`);
  assert(await evaluate(cdp, `getComputedStyle(document.querySelector('.home-dahlia-anomaly__prototype')).animationName === 'none'`), `${width}: PHASE1 started before the monthly flower left the viewport`);
  await evaluate(cdp, `document.querySelector('[data-home-dahlia]').scrollIntoView({block:'center'})`);
  await sleep(500);
  await evaluate(cdp, `scrollTo(0, document.documentElement.scrollHeight)`);
  await waitFor(cdp, `document.querySelector('.home-dahlia-anomaly').classList.contains('is-active')`, `${width}: PHASE1 did not activate after leaving the viewport`);
  if (process.env.REDUCED_MOTION !== '1') {
    assert(await evaluate(cdp, `getComputedStyle(document.querySelector('.home-dahlia-anomaly__prototype')).animationName === 'home-dahlia-switch' && getComputedStyle(document.querySelector('.home-dahlia-anomaly__prototype')).animationDuration === '8s'`), `${width}: four-second image switching is not running`);
  }
  await evaluate(cdp, `document.querySelector('.home-dahlia-anomaly').click()`);
  await waitFor(cdp, `document.body.classList.contains('is-site-altering') && document.querySelector('[data-site-alteration-message] p').textContent === 'サイトが改変されました'`, `${width}: PHASE1 alteration did not play`);
  await waitFor(cdp, `!document.body.classList.contains('is-site-altering') && JSON.parse(localStorage.whiteBloomArgProgress).phase === 2`, `${width}: PHASE2への自動移行に失敗しました`, 6000);
  assert(await evaluate(cdp, `!document.body.textContent.includes('継続利用者評価区分')`), `${width}: PHASE1の削除対象が残っています`);
  assert(await evaluate(cdp, `location.pathname.endsWith('/index.html') && JSON.parse(localStorage.whiteBloomArgProgress).phase === 2`), `${width}: PHASE1 navigated automatically or failed to persist`);
  await cdp.send('Page.navigate', { url: `${baseUrl}/flowers.html` });
  await waitFor(cdp, `document.readyState === 'complete' && document.body.dataset.phase === 'phase2'`, `${width}: persisted PHASE2 did not load`, 6000);
  const phase2Opacities = await evaluate(cdp, `[...document.querySelectorAll('.flower-card__prototype-image')].map((image) => getComputedStyle(image).opacity)`);
  assert(phase2Opacities.every((opacity) => Number(opacity) === 0), `${width}: PHASE2 did not begin with six normal-color flowers (${phase2Opacities.join(', ')})`);

  for (const key of ['sweetpea', 'lavender', 'lily', 'jasmine', 'geranium']) {
    await evaluate(cdp, `document.querySelector('[data-flower="${key}"]').scrollIntoView({block:'center'})`);
    await sleep(850);
  }
  await waitFor(cdp, `['sweetpea','lavender','lily','jasmine','geranium'].every((key) => document.querySelector('[data-flower="'+key+'"]').classList.contains('is-whitened'))`, `${width}: first five flowers did not whiten in order`, 7000);
  await evaluate(cdp, `document.querySelector('[data-flower="dahlia"]').scrollIntoView({block:'center'})`);
  await waitFor(cdp, `document.querySelector('[data-flower="dahlia"]').classList.contains('is-dahlia-whitened')`, `${width}: dahlia did not finish whitening`, 7000);
  assert(await evaluate(cdp, `[...document.querySelectorAll('.internal-flower-record__stage')].map((node) => node.textContent).join('|') === '第1段階　緊張抑制|第2段階　警戒低下|第3段階　感情安定|第4段階　嗜好固定|第5段階　判断固定|第6段階　人格定着'`), `${width}: PHASE2の段階表示が正しくありません`);
  assert(await evaluate(cdp, `[...document.querySelectorAll('.flower-card__normal-copy')].every((node) => !node.hidden) && !document.querySelector('.internal-flower-record__details')`), `${width}: PHASE2の一般説明または削除対象情報が正しくありません`);
  assert(await evaluate(cdp, `[...document.querySelectorAll('.flower-card__month')].every((node) => node.hidden) && [...document.querySelectorAll('.internal-flower-record__stage')].every((node) => getComputedStyle(node).color === 'rgb(255, 255, 255)')`), `${width}: PHASE2の月表示または白文字指定が正しくありません`);
  assert(await evaluate(cdp, `[...document.querySelectorAll('.flower-card')].every((card) => getComputedStyle(card).borderTopWidth === '1px' && getComputedStyle(card.querySelector('.flower-card__body')).borderWidth === '0px')`), `${width}: PHASE2のカード枠が二重になっています`);
  await evaluate(cdp, `document.querySelector('[data-flower="dahlia"]').click()`);
  await waitFor(cdp, `document.querySelector('[data-phase-action="dahlia-stage"]').textContent === '第6段階　人格定着'`, `${width}: dahlia stage changed unexpectedly`);
  await waitFor(cdp, `document.querySelector('[data-dahlia-error]') && !document.querySelector('[data-dahlia-error]').hidden`, `${width}: first-click error did not appear`);
  await evaluate(cdp, `document.querySelector('[data-close-dahlia-error]').click()`);
  await evaluate(cdp, `document.querySelector('[data-flower="dahlia"]').click()`);
  await waitFor(cdp, `document.body.classList.contains('is-site-altering')`, `${width}: PHASE2 alteration did not play`);
  await waitFor(cdp, `location.pathname.endsWith('/voices.html') && document.readyState === 'complete' && document.body.dataset.phase === 'phase3'`, `${width}: PHASE3 did not load after PHASE2`, 6000);

  await cdp.send('Page.navigate', { url: `${baseUrl}/index.html` });
  await waitFor(cdp, `document.readyState === 'complete' && document.querySelector('.home-dahlia-anomaly.is-revealed')`, `${width}: returning home reset the dahlia anomaly`, 6000);
  await cdp.send('Page.navigate', { url: `${baseUrl}/voices.html` });
  await waitFor(cdp, `document.readyState === 'complete' && document.body.dataset.phase === 'phase3'`, `${width}: returning from home reset PHASE3`, 6000);
  await evaluate(cdp, `location.reload()`);
  await waitFor(cdp, `document.readyState === 'complete' && document.body.dataset.phase === 'phase3' && !document.querySelector('[data-voices-convergence]').hidden`, `${width}: PHASE3 reload failed`, 6000);
  await cdp.send('Runtime.evaluate', { expression: 'history.back()' });
  await waitFor(cdp, `location.pathname.endsWith('/index.html') && document.readyState === 'complete'`, `${width}: browser back failed`, 6000);
  await cdp.send('Runtime.evaluate', { expression: 'history.forward()' });
  await waitFor(cdp, `location.pathname.endsWith('/voices.html') && document.readyState === 'complete' && document.body.dataset.phase === 'phase3'`, `${width}: browser forward after back failed`, 6000);

  assert(await evaluate(cdp, `document.querySelectorAll('.phase-convergence__card').length === 26`), `${width}: 統合PHASEのレビュー件数が正しくありません`);
  assert(await evaluate(cdp, `(() => {
    const expected = [
      ['美咲さん', '30代・東京都／利用歴8か月', '02'],
      ['恵さん', '40代・神奈川県／利用歴1年2か月', '08'],
      ['直樹さん', '20代・大阪府／利用歴6か月', '01'],
      ['知子さん', '50代・長野県／利用歴1年5か月', '04'],
      ['梨花さん', '30代・福岡県／利用歴11か月', '06'],
      ['英一さん', '60代・京都府／利用歴2年', '07'],
      ['健一さん', '50代・愛知県／利用歴3年7か月', '03'],
      ['悠人さん', '30代・埼玉県／利用歴2年11か月', '05'],
      ['彩さん', '20代・千葉県／利用歴2年6か月', '09'],
      ['拓海さん', '30代・宮城県／利用歴3年', '10'],
      ['正人さん', '60代・長野県／利用歴4年8か月', '12'],
      ['沙織さん', '30代・広島県／利用歴2年9か月', '13'],
      ['透さん', '20代・静岡県／利用歴2年3か月', '14'],
      ['千鶴さん', '60代・奈良県／利用歴5年', '15'],
      ['一郎さん', '70代・石川県／利用歴5年6か月', '16'],
      ['文子さん', '20代・京都府／利用歴5年2か月', '11']
    ];
    return [...document.querySelectorAll('.phase-convergence__card:not(.phase-convergence__card--repeated)')].every((card, index) => {
      const [name, meta, image] = expected[index];
      return card.querySelector('.phase-convergence__person strong')?.textContent === name
        && card.querySelector('.phase-convergence__person span')?.textContent === meta
        && card.querySelector('img')?.src.endsWith('review-human-' + image + '.jpg');
    });
  })()`), `${width}: PHASE3 profile continuity is broken`);
  assert(await evaluate(cdp, `new Set([...document.querySelectorAll('.phase-convergence__card blockquote')].map((node) => node.textContent)).size === 1`), `${width}: reviews are not identical`);
  assert(await evaluate(cdp, `[...document.querySelectorAll('.phase-convergence__card--repeated')].length === 10 && [...document.querySelectorAll('.phase-convergence__card--repeated img')].every((image) => image.src.endsWith('review-human-11.jpg') && getComputedStyle(image).objectPosition === '50% 50%')`), `${width}: SUBJECT 16の連続部分が正しくありません`);
  assert(await evaluate(cdp, `document.querySelectorAll('.phase-convergence__card.is-anomaly-subject').length === 11 && !document.querySelector('.phase-convergence__trigger')`), `${width}: SUBJECT 16全件のノイズまたはクリック要素の削除が正しくありません`);
  assert(await evaluate(cdp, `!document.querySelector('.progress-card, .progress-metrics, .arg-voices__back')`), `${width}: 旧PHASE4 UIが残っています`);
  await evaluate(cdp, `document.querySelector('[data-convergence-end]').scrollIntoView({block:'end'})`);
  await waitFor(cdp, `document.body.dataset.phase === 'phase4' && !document.querySelector('[data-convergence-result]').hidden`, `${width}: 一覧末尾で収束結果が表示されません`, 5000);
  if (process.env.REDUCED_MOTION !== '1') {
    assert(await evaluate(cdp, `getComputedStyle(document.querySelector('.phase-convergence__card.is-anomaly-subject'), '::after').animationName === 'review-noise'`), `${width}: 最後から5番目のノイズが動作していません`);
  }
  assert(await evaluate(cdp, `document.querySelectorAll('.convergence-stage__photos img').length === 16 && document.querySelector('.convergence-stage__result strong').textContent === '第6段階　定着完了' && document.querySelector('.convergence-stage__result span').textContent === '基準人格モデルとの一致を確認'`), `${width}: 第6段階の収束演出が正しくありません`);
  if (process.env.REDUCED_MOTION !== '1') {
    assert(await evaluate(cdp, `getComputedStyle(document.querySelector('.convergence-stage__photos img')).animationName === 'gather-person' && getComputedStyle(document.querySelector('.convergence-stage__result')).animationName === 'convergence-result'`), `${width}: 第6段階のアニメーションが動作していません`);
  }
  assert(await evaluate(cdp, `document.documentElement.scrollWidth <= window.innerWidth`), `${width}: horizontal overflow detected`);
  await evaluate(cdp, `document.querySelector('[data-phase-action="convergence-result"]').click()`);
  await waitFor(cdp, `document.body.classList.contains('is-site-altering')`, `${width}: PHASE4 alteration did not play`);
  await waitFor(cdp, `location.pathname.endsWith('/truth.html')`, `${width}: truth.html was not reached`, 6000);
  assert(await evaluate(cdp, `document.querySelectorAll('.truth-section').length >= 7 && document.querySelectorAll('.truth-stages li').length === 6`), `${width}: TRUTH document is incomplete`);
  assert(await evaluate(cdp, `[...document.querySelectorAll('.truth-main img')].every((image) => image.complete && image.naturalWidth > 0)`), `${width}: TRUTH image failed to load`);
  assert(await evaluate(cdp, `document.documentElement.scrollWidth <= window.innerWidth`), `${width}: TRUTH has horizontal overflow`);
  assert(await evaluate(cdp, `document.querySelector('.truth-delivery__card img').complete && document.querySelector('.truth-delivery__card img').naturalWidth > 0`), `${width}: ending-sweetpea.jpg failed to load`);
  assert(await evaluate(cdp, `document.querySelector('.truth-delivery__record h3').textContent === '第1段階 緊張抑制'`), `${width}: first-stage record is missing`);
  assert(await evaluate(cdp, `decodeURIComponent(document.querySelector('.truth-share--delivery').href).includes('花のある生活が一番落ち着きます。\\nWHITE VEIL BLOOMのある今の生活がとても好きです。\\n#おかしなサイト')`), `${width}: X share text is incorrect`);
  assert(await evaluate(cdp, `document.querySelector('.truth-delivery__top').getAttribute('href') === 'index.html'`), `${width}: TOP return link is missing`);
  assert(await evaluate(cdp, `document.documentElement.scrollWidth <= window.innerWidth`), `${width}: Ending has horizontal overflow`);
  await evaluate(cdp, `document.querySelector('[data-exploration-reset]').click()`);
  await waitFor(cdp, `location.pathname.endsWith('/index.html') && document.readyState === 'complete' && document.querySelector('.home-dahlia-anomaly') && document.body.dataset.phase === 'phase1' && !localStorage.getItem('whiteBloomArgProgress')`, `${width}: exploration reset did not return to the initial state`, 6000);
  assert(await evaluate(cdp, `!document.querySelector('.home-dahlia-anomaly').classList.contains('is-active')`), `${width}: PHASE1 anomaly remained active after reset`);
  assert(cdp.errors.length === 0, `${width}: browser console errors: ${cdp.errors.join(', ')}`);
  cdp.close();
  return `${width}px: PASS`;
};

for (const width of widths) console.log(await testWidth(width));
