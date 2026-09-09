(() => {
  'use strict';

  const STORAGE_KEY = 'whiteBloomArgProgress';
  const defaults = {
    phase: 1,
    phase1Triggered: false,
    phase1Discovered: false,
    phase1Revealed: false,
    whitened: [],
    dahliaTransitioning: false,
    dahliaWhitened: false,
    dahliaSettled: false,
    dahliaErrorSeen: false,
    phase3Discovered: false,
    converged: false,
    truthReached: false,
    endingReached: false,
    completed: false
  };

  const normalize = (saved) => {
    const state = { ...defaults, ...(saved && typeof saved === 'object' ? saved : {}) };
    if (!Number.isInteger(state.phase) || state.phase < 1 || state.phase > 5) state.phase = 1;
    if (!Array.isArray(state.whitened)) state.whitened = [];
    return state;
  };

  const read = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return normalize(saved);
    } catch {
      return { ...defaults };
    }
  };

  const write = (state) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(normalize(state))); } catch {}
  };

  const routeFor = (state = read()) => {
    if (state.truthReached || state.phase >= 5) return 'truth.html';
    if (state.phase >= 3) return 'voices.html';
    if (state.phase >= 2) return 'flowers.html';
    return 'index.html';
  };

  window.WhiteBloomProgress = { STORAGE_KEY, defaults, read, write, routeFor };

  const page = document.body.dataset.page;
  const state = read();
  const expected = routeFor(state);
  const current = page === 'home' ? 'index.html' : page === 'flowers' ? 'flowers.html' : page === 'voices' ? 'voices.html' : page === 'truth' ? 'truth.html' : '';
  const params = new URLSearchParams(location.search);
  const isNormalBrowse = params.get('browse') === '1' && (page === 'flowers' || page === 'voices');

  if (isNormalBrowse) {
    params.delete('browse');
    history.replaceState(null, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
  } else if (current && current !== 'index.html' && current !== expected) {
    location.replace(expected);
    return;
  }

  if (page === 'truth') {
    const reached = { ...state, phase: Math.max(state.phase, 5), truthReached: true, endingReached: true };
    write(reached);
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.truth-delivery__top')) return;
      write({ ...read(), completed: true, endingReached: true, truthReached: true, phase: 5 });
    });
  }
})();
