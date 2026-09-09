(() => {
  'use strict';
  const views = window.WhiteBloomPhaseViews;
  if (!views) return;

  const progressStore = window.WhiteBloomProgress;
  const STORAGE_KEY = progressStore?.STORAGE_KEY || 'whiteBloomArgProgress';
  const defaults = progressStore?.defaults || { phase: 1, phase1Triggered: false, phase1Discovered: false, phase1Revealed: false, whitened: [], dahliaTransitioning: false, dahliaWhitened: false, dahliaSettled: false, dahliaErrorSeen: false, phase3Discovered: false, converged: false, truthReached: false, endingReached: false, completed: false };
  const readState = () => progressStore?.read?.() || (() => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
    catch { return { ...defaults }; }
  })();
  let progress = readState();
  const save = () => { if (progressStore?.write) progressStore.write(progress); else try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch {} };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const page = document.body.dataset.page;
  let phaseTransitionLocked = false;
  const live = document.createElement('p');
  live.className = 'arg-live-region';
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('aria-atomic', 'true');
  document.body.append(live);

  const announce = (message) => {
    live.textContent = '';
    requestAnimationFrame(() => { live.textContent = message; });
  };
  const playAlteration = async () => {
    if (phaseTransitionLocked || window.SiteAlteration?.isPlaying()) return false;
    if (!window.SiteAlteration?.play) throw new Error('SiteAlteration module is not available.');
    phaseTransitionLocked = true;
    try { return await window.SiteAlteration.play({ message: 'サイトが改変されました' }); }
    finally { phaseTransitionLocked = false; }
  };

  const createPhase1Management = () => {
    if (document.querySelector('[data-home-management]')) return;
    const body = document.querySelector('.monthly .split-layout__body');
    if (!body) return;
    const record = document.createElement('section');
    record.className = 'home-management-record';
    record.dataset.homeManagement = '';
    record.innerHTML = '<h3>継続利用者評価区分</h3><dl><div><dt>対象</dt><dd>継続利用者</dd></div><div><dt>評価項目</dt><dd>感情安定度</dd></div><div><dt>目標値</dt><dd>72％</dd></div><div><dt>運用状況</dt><dd>実施中</dd></div></dl>';
    body.append(record);
  };

  const startHome = () => {
    document.body.dataset.phase = progress.phase === 1 ? 'phase1' : `phase${progress.phase}`;
    const frame = document.querySelector('[data-home-dahlia]');
    const normalImage = frame?.querySelector('img');
    if (!frame || !normalImage) return;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'home-dahlia-anomaly';
    trigger.dataset.phaseAction = 'home-dahlia';
    trigger.setAttribute('aria-label', '今月の花、ダリアの画像を確認する');
    normalImage.classList.add('home-dahlia-anomaly__normal');
    const prototypeImage = document.createElement('img');
    prototypeImage.className = 'home-dahlia-anomaly__prototype';
    prototypeImage.src = 'images/prototype-dahlia.jpg';
    prototypeImage.alt = '';
    prototypeImage.width = 1536;
    prototypeImage.height = 1024;
    const noise = document.createElement('span');
    noise.className = 'home-dahlia-anomaly__noise';
    noise.setAttribute('aria-hidden', 'true');
    frame.replaceChildren(trigger);
    trigger.append(normalImage, prototypeImage, noise);
    const anomalyPersisted = progress.phase >= 2;
    trigger.classList.toggle('is-active', progress.phase1Triggered || anomalyPersisted);
    trigger.classList.toggle('is-revealed', progress.phase1Revealed || anomalyPersisted);
    if (progress.phase1Revealed || anomalyPersisted) createPhase1Management();

    if (progress.phase !== 1) return;

    let enteredViewport = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) enteredViewport = true;
      else if (enteredViewport && !progress.phase1Triggered) {
        progress.phase1Triggered = true;
        progress.phase1Discovered = true;
        save();
        trigger.classList.add('is-active');
        announce('今月の花の画像に異常が発生しました');
      }
    }, { threshold: .25 });
    observer.observe(frame);

    trigger.addEventListener('click', async () => {
      if (!progress.phase1Triggered || progress.phase1Revealed || phaseTransitionLocked) return;
      if (await playAlteration()) {
        progress.phase1Revealed = true;
        progress.phase = 2;
        save();
        trigger.classList.add('is-revealed');
        createPhase1Management();
        document.body.dataset.phase = 'phase2-ready';
        announce('PHASE2が発動しました。お届けする花に異常が発生しています');
        document.querySelector('[data-home-management]')?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
      }
    });
  };

  const showDahliaError = () => {
    let dialog = document.querySelector('[data-dahlia-error]');
    if (!dialog) {
      dialog = document.createElement('div');
      dialog.className = 'dahlia-error';
      dialog.dataset.dahliaError = '';
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.setAttribute('aria-labelledby', 'dahlia-error-title');
      dialog.innerHTML = '<div class="dahlia-error__panel"><p>RECORD ERROR / DL-06</p><h2 id="dahlia-error-title">画像データの同期に失敗しました</h2><p>対象記録と表示個体の一致を確認できません。</p><button type="button" data-close-dahlia-error>閉じる</button></div>';
      document.body.append(dialog);
      dialog.querySelector('[data-close-dahlia-error]').addEventListener('click', () => {
        dialog.hidden = true;
        document.querySelector('[data-flower="dahlia"]')?.focus({ preventScroll: true });
      });
    }
    dialog.hidden = false;
    dialog.querySelector('button')?.focus();
  };

  const startFlowers = () => {
    const state = {
      phase: progress.phase >= 2 ? 'phase2' : 'phase0',
      whitened: progress.phase >= 3 ? ['sweetpea', 'lavender', 'lily', 'jasmine', 'geranium'] : [...progress.whitened],
      dahliaTransitioning: progress.dahliaTransitioning,
      dahliaWhitened: progress.phase >= 3 || progress.dahliaWhitened,
      dahliaSettled: progress.phase >= 3 || progress.dahliaSettled
    };
    let observer = null;
    const visible = new Set();
    const ordered = ['sweetpea', 'lavender', 'lily', 'jasmine', 'geranium'];
    const render = () => views.renderFlowers(state);
    const persistFlowerState = () => {
      progress.whitened = [...state.whitened];
      progress.dahliaTransitioning = state.dahliaTransitioning;
      progress.dahliaWhitened = state.dahliaWhitened;
      progress.dahliaSettled = state.dahliaSettled;
      save();
    };
    const beginDahlia = () => {
      if (state.dahliaTransitioning || state.dahliaWhitened || state.whitened.length < ordered.length || !visible.has('dahlia')) return;
      setTimeout(() => {
        state.dahliaTransitioning = true;
        persistFlowerState();
        render();
        setTimeout(() => {
          state.dahliaTransitioning = false;
          state.dahliaWhitened = true;
          persistFlowerState();
          render();
        }, reducedMotion.matches ? 50 : 2450);
      }, reducedMotion.matches ? 0 : 700);
    };
    const whitenNextVisible = () => {
      const next = ordered[state.whitened.length];
      if (!next) return beginDahlia();
      if (!visible.has(next)) return;
      state.whitened.push(next);
      persistFlowerState();
      render();
      setTimeout(whitenNextVisible, reducedMotion.matches ? 20 : 480);
    };
    const observePhase2 = () => {
      observer?.disconnect();
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.isIntersecting ? visible.add(entry.target.dataset.flower) : visible.delete(entry.target.dataset.flower));
        whitenNextVisible();
        beginDahlia();
      }, { threshold: .42, rootMargin: '0px 0px -8% 0px' });
      document.querySelectorAll('[data-flower]').forEach((card) => observer.observe(card));
    };
    document.addEventListener('click', async (event) => {
      const dahliaCard = event.target.closest('[data-flower="dahlia"]');
      if (!dahliaCard || state.phase !== 'phase2' || !state.dahliaWhitened || phaseTransitionLocked) return;
      if (!progress.dahliaErrorSeen) {
        progress.dahliaErrorSeen = true;
        state.dahliaSettled = true;
        persistFlowerState();
        render();
        showDahliaError();
        return;
      }
      if (!document.querySelector('[data-dahlia-error]')?.hidden) return;
      if (await playAlteration()) {
        progress.phase = Math.max(progress.phase, 3);
        save();
        announce('利用者記録へのアクセスが許可されました');
        location.href = 'voices.html';
      }
    });
    render();
    if (state.phase === 'phase2' && state.whitened.length === 0) {
      addEventListener('scroll', observePhase2, { once: true, passive: true });
    } else if (state.phase === 'phase2' && (!state.dahliaWhitened || state.whitened.length < ordered.length)) {
      setTimeout(observePhase2, 100);
    }
  };

  const startVoices = () => {
    const state = { phase: progress.phase >= 4 ? 'phase4' : progress.phase >= 3 ? 'phase3' : 'phase0', converged: progress.converged };
    const render = () => views.renderVoices(state);
    document.addEventListener('click', async (event) => {
      const action = event.target.closest('[data-phase-action]')?.dataset.phaseAction;
      if (!action || phaseTransitionLocked) return;
      if (action === 'phase3-anomaly' && state.phase === 'phase3') {
        if (await playAlteration()) {
          progress.phase3Discovered = true;
          progress.phase = 4;
          state.phase = 'phase4';
          save();
          render();
          document.querySelector('[data-voices-phase4]')?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
        }
      } else if (action === 'phase4-month18' && state.phase === 'phase4' && !state.converged) {
        state.converged = true;
        progress.converged = true;
        save();
        render();
        document.querySelector('[data-convergence-stage]')?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
      } else if (action === 'phase4-back-to-voices' && state.phase === 'phase4') {
        progress.phase = 3;
        progress.converged = false;
        state.phase = 'phase3';
        state.converged = false;
        save();
        render();
        document.querySelector('[data-voices-phase3]')?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      } else if (action === 'phase4-convergence-result' && state.phase === 'phase4' && state.converged) {
        if (await playAlteration()) {
          progress.phase = 5;
          progress.truthReached = true;
          save();
          location.href = 'truth.html';
        }
      }
    });
    render();
  };

  if (page === 'home') startHome();
  if (page === 'flowers') startFlowers();
  if (page === 'voices') startVoices();

  window.SiteAlterationDebug?.init({
    storagePrefix: 'whiteBloom',
    state: {
      phases: ['phase1', 'phase2', 'phase3', 'phase4'],
      getPhase: () => `phase${progress.phase}`,
      setPhase: (phase) => {
        const nextPhase = Number(phase.replace('phase', ''));
        if (!Number.isInteger(nextPhase) || nextPhase < 1 || nextPhase > 4) return;
        progress = { ...defaults, phase: nextPhase };
        save();
        location.href = nextPhase === 1 ? 'index.html' : nextPhase === 2 ? 'flowers.html' : 'voices.html';
      }
    }
  });
})();
