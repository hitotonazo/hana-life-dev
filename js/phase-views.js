(() => {
  'use strict';

  const flowerRecords = [
    { key: 'sweetpea', prototype: 'prototype-sweetpea.jpg', stage: '第1段階　緊張抑制' },
    { key: 'lavender', prototype: 'prototype-lavender.jpg', stage: '第2段階　警戒低下' },
    { key: 'lily', prototype: 'prototype-lily.jpg', stage: '第3段階　感情安定' },
    { key: 'jasmine', prototype: 'prototype-jasmine.jpg', stage: '第4段階　嗜好固定' },
    { key: 'geranium', prototype: 'prototype-geranium.jpg', stage: '第5段階　判断固定' },
    { key: 'dahlia', prototype: 'prototype-dahlia.jpg', stage: '第6段階　人格定着' }
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
      internal.append(label);
      normalBody.insertBefore(internal, normalBody.firstChild);
    });
  };

  const buildConvergencePhase = () => {
    const normal = document.querySelector('.voices-page');
    if (!normal || document.querySelector('[data-voices-convergence]')) return;
    const section = element('section', 'section phase-convergence');
    section.hidden = true;
    section.dataset.voicesConvergence = '';
    const container = element('div', 'container');
    const heading = element('header', 'internal-heading');
    heading.append(element('p', 'internal-kicker', 'USER RECORD'), element('h2', '', '利用者記録'));
    const list = element('div', 'phase-convergence__list');
    const people = [...phase3People.slice(0, 10), ...phase3People.slice(11), phase3People[10]];
    const subject11 = phase3People[10];
    const appendCard = ({ name, meta, image }, position, repeated = false) => {
      const hasNoise = position >= 15;
      const card = element('article', `phase-convergence__card${repeated ? ' phase-convergence__card--repeated' : ''}${hasNoise ? ' is-anomaly-subject' : ''}`);
      card.style.setProperty('--record-delay', `${Math.min(position, 12) * 70}ms`);
      const portrait = element('img', 'phase-convergence__portrait');
      portrait.src = `images/review-human-${image}.jpg`;
      portrait.alt = repeated ? 'SUBJECT 11と同一の利用者写真' : `${name}の利用者写真`;
      portrait.width = 313;
      portrait.height = 313;
      const body = element('div', 'phase-convergence__body');
      body.append(element('p', 'phase-convergence__id', `SUBJECT ${String(repeated ? 16 : position + 1).padStart(2, '0')}`), element('blockquote', '', identicalReview));
      const person = element('p', 'phase-convergence__person');
      person.append(element('strong', '', name), element('span', '', meta));
      body.append(person);
      card.append(portrait, body);
      list.append(card);
    };
    people.forEach((person, index) => appendCard(person, index));
    for (let index = 0; index < 10; index += 1) appendCard(subject11, 16 + index, true);

    const result = element('section', 'convergence-stage');
    result.hidden = true;
    result.dataset.convergenceResult = '';
    const photos = element('div', 'convergence-stage__photos');
    people.forEach(({ image }, index) => {
      const imageNode = element('img');
      imageNode.src = `images/review-human-${image}.jpg`;
      imageNode.alt = '';
      imageNode.width = 313;
      imageNode.height = 313;
      imageNode.style.setProperty('--gather-index', index);
      photos.append(imageNode);
    });
    const resultButton = element('button', 'convergence-stage__result');
    resultButton.type = 'button';
    resultButton.dataset.phaseAction = 'convergence-result';
    result.type = 'button';
    const resultImage = element('img');
    resultImage.src = 'images/convergence-human-01.jpg';
    resultImage.alt = '収束後の代表利用者';
    resultImage.width = 409;
    resultImage.height = 768;
    resultButton.append(resultImage, element('strong', '', '第6段階　定着完了'), element('span', '', '基準人格モデルとの一致を確認'));
    result.append(photos, resultButton);
    const end = element('div', 'phase-convergence__end');
    end.dataset.convergenceEnd = '';
    end.setAttribute('aria-hidden', 'true');
    container.append(heading, list, end, result);
    section.append(container);
    normal.after(section);

    const cards = [...list.querySelectorAll('.phase-convergence__card')];
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
      const month = card.querySelector('.flower-card__month');
      if (month) month.hidden = phase === 'phase2';
      const normal = card.querySelector('.flower-card__normal-copy');
      if (normal) normal.hidden = false;
      const imageButton = card.querySelector('.arg-flower-image-button');
      if (imageButton) imageButton.disabled = !(isDahlia && (phase === 'phase1' || (phase === 'phase2' && options.dahliaWhitened)));
    });
    const dahlia = document.querySelector('[data-flower="dahlia"]');
    dahlia?.classList.toggle('is-phase1-revealed', phase === 'phase1' && Boolean(options.phase1Revealed));
    const stage = dahlia?.querySelector('[data-phase-action="dahlia-stage"]');
    if (stage) {
      stage.textContent = '第6段階　人格定着';
      stage.disabled = !(phase === 'phase2' && options.dahliaSettled);
    }
  };

  const renderVoices = (options = {}) => {
    if (typeof options === 'string') options = { phase: options };
    const phase = ['phase0', 'phase3', 'phase4'].includes(options.phase) ? options.phase : 'phase0';
    document.body.dataset.phase = phase;
    const normalSections = [document.querySelector('.voices-page'), document.querySelector('.voice-feature'), document.querySelector('.voice-feature + .cta')].filter(Boolean);
    normalSections.forEach((section) => { section.hidden = phase !== 'phase0'; });
    const convergence = document.querySelector('[data-voices-convergence]');
    if (convergence) convergence.hidden = phase === 'phase0';
    const result = document.querySelector('[data-convergence-result]');
    if (result) result.hidden = !(phase === 'phase4' && options.converged);
    convergence?.classList.toggle('is-converged', phase === 'phase4' && Boolean(options.converged));
  };

  const init = () => {
    enhanceFlowers();
    buildConvergencePhase();
    if (document.body.dataset.page === 'flowers') renderFlowers('phase0');
    if (document.body.dataset.page === 'voices') renderVoices('phase0');
  };

  window.WhiteBloomPhaseViews = { renderFlowers, renderVoices };
  init();
})();
