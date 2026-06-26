(function () {
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function init(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    const spans = words.map(function (w) {
      const span = document.createElement('span');
      span.className = 'scroll-fill__word';
      span.textContent = w;
      el.appendChild(span);
      el.appendChild(document.createTextNode(' '));
      return span;
    });

    const head = 5;

    function update() {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const start = vh * 0.7;
      const end = vh * 0.2;
      const p = clamp((start - r.top) / (start - end), 0, 1);
      const fillPos = p * (spans.length + head);
      spans.forEach(function (span, i) {
        span.style.setProperty('--a', clamp(fillPos - i, 0, 1).toFixed(3));
      });
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    // Lenis инициализируется позже в smooth-scroll.js — подписываемся отложенно
    setTimeout(function () {
      if (window.lenis && typeof window.lenis.on === 'function') {
        window.lenis.on('scroll', update);
      }
    }, 0);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-scroll-fill]').forEach(init);
  });
})();
