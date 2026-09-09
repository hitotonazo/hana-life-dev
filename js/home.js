(() => {
  'use strict';

  const root = document.querySelector('[data-hero]');
  if (!root) return;
  const slides = [...root.querySelectorAll('[data-hero-slide]')];
  const dots = [...root.querySelectorAll('[data-hero-dot]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let timer = null;

  const show = (index) => {
    current = index;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };
  const stop = () => { if (timer) clearInterval(timer); timer = null; };
  const start = () => {
    stop();
    if (!reducedMotion.matches) timer = setInterval(() => show((current + 1) % slides.length), 5500);
  };

  dots.forEach((dot, index) => dot.addEventListener('click', () => { show(index); start(); }));
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  reducedMotion.addEventListener('change', start);
  start();
})();
