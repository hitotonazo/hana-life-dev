(() => {
  'use strict';

  const resetButton = document.querySelector('[data-exploration-reset]');
  resetButton?.addEventListener('click', () => {
    resetButton.disabled = true;
    try {
      localStorage.removeItem('whiteBloomArgProgress');
    } finally {
      window.location.replace('index.html');
    }
  });

  const button = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-site-nav]');
  if (!button || !nav) return;

  const setMenu = (open) => {
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    nav.dataset.open = String(open);
    document.body.classList.toggle('is-menu-open', open);
  };

  button.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      button.focus();
    }
  });
  matchMedia('(min-width: 981px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });
})();
