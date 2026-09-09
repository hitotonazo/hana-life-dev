(() => {
  'use strict';

  const flowerRecords = [
    { key: 'sweetpea', prototype: 'prototype-sweetpea.jpg', stage: '第1段階　緊張抑制', code: 'SP-04', note: '香気安定性：確認済' },
    { key: 'lavender', prototype: 'prototype-lavender.jpg', stage: '第2段階　警戒低下', code: 'LV-12', note: '第7世代培養株' },
    { key: 'lily', prototype: 'prototype-lily.jpg', stage: '第3段階　感情安定', code: 'LL-08', note: '作用安定性：92％' },
    { key: 'jasmine', prototype: 'prototype-jasmine.jpg', stage: '第4段階　嗜好固定', code: 'JM-05', note: '継続曝露推奨' },
    { key: 'geranium', prototype: 'prototype-geranium.jpg', stage: '第5段階　判断固定', code: 'GR-11', note: '反応固定率：88％' },
    { key: 'dahlia', prototype: 'prototype-dahlia.jpg', stage: '第6段階', code: 'DL-06', note: '' }
  ];

  const phase3People = [
    { name: '美咲さん', meta: '30代・東京都／利用歴8か月', image: '02' },
    { name: '恵さん', meta: '40代・神奈川県／利用歴1年2か月', image: '08' },
    { name: '直樹さん', meta: '20代・大阪府／利用歴6か月', image: '01' },
    { name: '知子さん', meta: '50代・長野県／利用歴1年5か月', image: '04' },
    { name: '梨花さん', meta: '30代・福岡県／利用歴11か月', image: '06' },
    { name: '英一さん', meta: '60代・京都府／利用歴2年', image: '07' },
    { name: '健一さん', meta: '50代・愛知県／利用歴3年7か月', image: '03' },
    { name: '悠人さん', meta: '30代・埼玉県／利用歴2年11か月', image: '05' },
    { name: '彩さん', meta: '20代・千葉県／利用歴2年6か月', image: '09' },
    { name: '拓海さん', meta: '30代・宮城県／利用歴3年', image: '10' },
    { name: '文子さん', meta: '20代・京都府／利用歴5年2か月', image: '11' },
    { name: '正人さん', meta: '60代・長野県／利用歴4年8か月', image: '12' },
    { name: '沙織さん', meta: '30代・広島県／利用歴2年9か月', image: '13' },
    { name: '透さん', meta: '20代・静岡県／利用歴2年3か月', image: '14' },
    { name: '千鶴さん', meta: '60代・奈良県／利用歴5年', image: '15' },
    { name: '一郎さん', meta: '70代・石川県／利用歴5年6か月', image: '16' }
  ];

  const identicalReview = '花のある生活が一番落ち着きます。\n今の生活がとても好きです。';
  const progressRecords = [
    ['00', '利用開始前'], ['01', '3か月'], ['02', '6か月'], ['03', '9か月'], ['04', '12か月'], ['05', '18か月']
  ];

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const enhanceFlowers = () => {
    const grid = document.querySelector('.flower-grid');
    if (!grid || grid.dataset.phaseReady) return;
    grid.dataset.phaseReady = 'true';

    [...grid.querySelectorAll('.flower-card')].forEach((card, index) => {
      const record = flowerRecords[index];
      if (!record) return;
      card.dataset.flower = record.key;
      const frame = card.querySelector('.flower-card__image');
      const normalImage = frame?.querySelector('img');
      const normalBody = card.querySelector('.flower-card__body');
      if (!frame || !normalImage || !normalBody) return;

      normalBody.classList.add('flower-card__normal-copy');
      normalImage.classList.add('flower-card__normal-image');
      const imageButton = element('button', 'arg-flower-image-button');
      imageButton.type = 'button';
      imageButton.disabled = true;
      imageButton.dataset.phaseAction = `${record.key}-image`;
      imageButton.setAttribute('aria-label', `${card.querySelector('h2')?.textContent || '花'}の記録画像`);
      frame.replaceChildren(imageButton);
      imageButton.append(normalImage);

      const prototypeImage = element('img', 'flower-card__prototype-image');
      prototypeImage.src = `images/${record.prototype}`;
      prototypeImage.alt = `内部管理用の白い${card.querySelector('h2')?.textContent || '原型株'}`;
      prototypeImage.width = 1536;
      prototypeImage.height = 1024;
      prototypeImage.setAttribute('aria-hidden', 'true');
      imageButton.append(prototypeImage);

      const internal = element('section', 'internal-flower-record');
      internal.hidden = true;
      internal.dataset.internalRecord = record.key;
      const label = element(record.key === 'dahlia' ? 'button' : 'h3', 'internal-flower-record__stage', record.stage);
      if (label instanceof HTMLButtonElement) {
        label.type = 'button';
        label.disabled = true;
        label.dataset.phaseAction = 'dahlia-stage';
      }
      internal.append(label, element('p', 'internal-flower-record__name', card.querySelector('h2')?.textContent));
      const details = element('dl', 'internal-flower-record__details');
      const addDetail = (term, value) => {
        const row = element('div');
        row.append(element('dt', '', term), element('dd', '', value));
        details.append(row);
      };
      addDetail('系統番号', record.code);
      if (record.note) addDetail('記録', record.note);
      internal.append(details);
      card.append(internal);
    });

    const dahlia = grid.querySelector('[data-flower="dahlia"]');
    if (dahlia) {
      const management = element('section', 'phase1-management');
      management.hidden = true;
      management.innerHTML = '<button type="button" data-phase-action="phase1-management" disabled>継続利用者評価区分</button><dl><div><dt>対象</dt><dd>継続利用者</dd></div><div><dt>評価項目</dt><dd>感情安定度</dd></div><div><dt>目標値</dt><dd>72％</dd></div><div><dt>運用状況</dt><dd>実施中</dd></div></dl>';
      dahlia.append(management);
    }
  };

  const buildPhase3 = () => {
    const normal = document.querySelector('.voices-page');
    if (!normal || document.querySelector('[data-voices-phase3]')) return;
    const section = element('section', 'section arg-voices arg-voices--phase3');
    section.hidden = true;
    section.dataset.voicesPhase3 = '';
    const container = element('div', 'container');
    const heading = element('header', 'internal-heading');
    heading.append(element('p', 'internal-kicker', 'USER RECORD'), element('h2', '', '利用者記録'));
    const grid = element('div', 'arg-review-grid');
    phase3People.forEach(({ name, meta, image }, index) => {
      const card = element('article', `arg-review-card${index === 10 ? ' is-anomaly-target' : ''}`);
      card.style.setProperty('--record-delay', `${index * 70}ms`);
      if (index === 10) card.dataset.phaseAction = 'phase3-anomaly';
      const portrait = element('img', 'arg-review-card__portrait');
      portrait.src = `images/review-human-${image}.jpg`;
      portrait.alt = `${name}の利用者写真`;
      portrait.width = 313;
      portrait.height = 313;
      const body = element('div', 'arg-review-card__body');
      body.append(element('p', 'arg-review-card__id', `SUBJECT ${String(index + 1).padStart(2, '0')}`), element('blockquote', '', identicalReview));
      const person = element('p', 'arg-review-card__person');
      person.append(element('strong', '', name), element('span', '', meta));
      body.append(person);
      card.append(portrait, body);
      if (index === 10) {
        const trigger = element('button', 'arg-review-card__trigger');
        trigger.type = 'button';
        trigger.dataset.phaseAction = 'phase3-anomaly';
        trigger.setAttribute('aria-label', `${name}さんの長期利用記録を確認する`);
        card.append(trigger);
      }
      grid.append(card);
    });
    container.append(heading, grid);
    section.append(container);
    normal.after(section);

    const revealCards = () => {
      const cards = [...grid.querySelectorAll('.arg-review-card')];
      if (!('IntersectionObserver' in window)) {
        cards.forEach((card) => card.classList.add('is-visible'));
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: .16, rootMargin: '0px 0px -5% 0px' });
      cards.forEach((card) => observer.observe(card));
    };
    revealCards();
  };

  const buildPhase4 = () => {
    const phase3 = document.querySelector('[data-voices-phase3]');
    if (!phase3 || document.querySelector('[data-voices-phase4]')) return;
    const section = element('section', 'section arg-voices arg-voices--phase4');
    section.hidden = true;
    section.dataset.voicesPhase4 = '';
    const container = element('div', 'container');
    const heading = element('header', 'internal-heading');
    heading.append(element('p', 'internal-kicker', 'LONGITUDINAL RECORD'), element('h2', '', '利用経過記録'));
    const progress = element('div', 'progress-grid');
    progressRecords.forEach(([code, label]) => {
      const isEighteenMonths = code === '05';
      const item = element('article', `progress-card progress-card--${code}${isEighteenMonths ? ' progress-card--18' : ''}`);
      const frame = element(isEighteenMonths ? 'button' : 'div', 'progress-card__image');
      if (frame instanceof HTMLButtonElement) {
        frame.type = 'button';
        frame.dataset.phaseAction = 'phase4-month18';
        frame.setAttribute('aria-label', '18か月時点の記録画像を確認する');
      }
      const base = element('img', 'progress-card__base');
      base.src = `images/progress-human-${code}.jpg`;
      base.alt = `${label}の利用者記録写真`;
      base.width = 354;
      base.height = 887;
      frame.append(base);
      if (isEighteenMonths) {
        for (let index = 1; index <= 5; index += 1) {
          const image = element('img', `progress-card__convergence progress-card__convergence--${index}`);
          image.src = `images/convergence-human-0${index}.jpg`;
          image.alt = '';
          image.width = 409;
          image.height = 768;
          frame.append(image);
        }
      }
      item.append(frame, element('h3', '', label));
      progress.append(item);
    });

    const metrics = element('dl', 'progress-metrics');
    [['感情安定度', '98％'], ['嗜好一致率', '94％'], ['判断一致率', '91％'], ['人格一致率', '96％']].forEach(([term, value]) => {
      const row = element('div');
      row.append(element('dt', '', term), element('dd', '', value));
      metrics.append(row);
    });

    const convergence = element('section', 'convergence-stage');
    convergence.hidden = true;
    convergence.dataset.convergenceStage = '';
    const photos = element('div', 'convergence-stage__photos');
    phase3People.forEach((_, index) => {
      const image = element('img');
      image.src = `images/review-human-${String(index + 1).padStart(2, '0')}.jpg`;
      image.alt = '';
      image.width = 313;
      image.height = 313;
      image.style.setProperty('--gather-index', index);
      photos.append(image);
    });
    const result = element('button', 'convergence-stage__result');
    result.type = 'button';
    result.dataset.phaseAction = 'phase4-convergence-result';
    const resultImage = element('img');
    resultImage.src = 'images/convergence-human-01.jpg';
    resultImage.alt = '収束後の代表利用者';
    resultImage.width = 409;
    resultImage.height = 768;
    result.append(resultImage, element('strong', '', '第6段階　定着完了'), element('span', '', '基準人格モデルとの一致を確認'));
    convergence.append(photos, result);

    const backButton = element('button', 'arg-voices__back', '利用者の声一覧へ戻る');
    backButton.type = 'button';
    backButton.dataset.phaseAction = 'phase4-back-to-voices';
    container.append(heading, progress, metrics, backButton, convergence);
    section.append(container);
    phase3.after(section);
  };

  const renderFlowers = (options = {}) => {
    if (typeof options === 'string') options = { phase: options };
    const phase = ['phase0', 'phase1', 'phase2'].includes(options.phase) ? options.phase : 'phase0';
    document.body.dataset.phase = phase;
    const cards = [...document.querySelectorAll('[data-flower]')];
    const whitened = new Set(options.whitened || []);
    cards.forEach((card) => {
      const isDahlia = card.dataset.flower === 'dahlia';
      card.classList.toggle('is-whitened', phase === 'phase2' && whitened.has(card.dataset.flower));
      card.classList.toggle('is-dahlia-transitioning', phase === 'phase2' && isDahlia && Boolean(options.dahliaTransitioning));
      card.classList.toggle('is-dahlia-whitened', phase === 'phase2' && isDahlia && Boolean(options.dahliaWhitened));
      card.classList.toggle('is-dahlia-settled', phase === 'phase2' && isDahlia && Boolean(options.dahliaSettled));
      const internal = card.querySelector('[data-internal-record]');
      if (internal) internal.hidden = phase !== 'phase2';
      const normal = card.querySelector('.flower-card__normal-copy');
      if (normal) normal.hidden = phase === 'phase2';
      const imageButton = card.querySelector('.arg-flower-image-button');
      if (imageButton) imageButton.disabled = !(isDahlia && (phase === 'phase1' || (phase === 'phase2' && options.dahliaWhitened)));
    });
    const management = document.querySelector('.phase1-management');
    if (management) {
      management.hidden = !(phase === 'phase1' && options.phase1Revealed);
      management.querySelector('button').disabled = management.hidden;
    }
    const dahlia = document.querySelector('[data-flower="dahlia"]');
    dahlia?.classList.toggle('is-phase1-revealed', phase === 'phase1' && Boolean(options.phase1Revealed));
    const stage = dahlia?.querySelector('[data-phase-action="dahlia-stage"]');
    if (stage) {
      stage.textContent = options.dahliaSettled ? '第6段階　定着' : '第6段階';
      stage.disabled = !(phase === 'phase2' && options.dahliaSettled);
    }
    const dahliaDetails = dahlia?.querySelector('.internal-flower-record__details');
    let stableNote = dahliaDetails?.querySelector('[data-dahlia-stable-note]');
    if (options.dahliaSettled && dahliaDetails && !stableNote) {
      stableNote = element('div');
      stableNote.dataset.dahliaStableNote = '';
      stableNote.append(element('dt', '', '記録'), element('dd', '', '誘導効果安定化個体'));
      dahliaDetails.append(stableNote);
    } else if (!options.dahliaSettled) stableNote?.remove();
  };

  const renderVoices = (options = {}) => {
    if (typeof options === 'string') options = { phase: options };
    const phase = ['phase0', 'phase3', 'phase4'].includes(options.phase) ? options.phase : 'phase0';
    document.body.dataset.phase = phase;
    const normalSections = [document.querySelector('.voices-page'), document.querySelector('.voice-feature'), document.querySelector('.voice-feature + .cta')].filter(Boolean);
    normalSections.forEach((section) => { section.hidden = phase !== 'phase0'; });
    const phase3 = document.querySelector('[data-voices-phase3]');
    const phase4 = document.querySelector('[data-voices-phase4]');
    if (phase3) phase3.hidden = phase !== 'phase3';
    if (phase4) phase4.hidden = phase !== 'phase4';
    const convergence = document.querySelector('[data-convergence-stage]');
    if (convergence) convergence.hidden = !(phase === 'phase4' && options.converged);
    phase4?.classList.toggle('is-converged', phase === 'phase4' && Boolean(options.converged));
  };

  const init = () => {
    enhanceFlowers();
    buildPhase3();
    buildPhase4();
    if (document.body.dataset.page === 'flowers') renderFlowers('phase0');
    if (document.body.dataset.page === 'voices') renderVoices('phase0');
  };

  window.WhiteBloomPhaseViews = { renderFlowers, renderVoices };
  init();
})();
