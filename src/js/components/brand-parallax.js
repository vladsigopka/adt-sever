(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const nodes = document.querySelectorAll('[data-parallax]');
    if (!nodes.length) return;

    nodes.forEach(function (el) {
      let raf = null;
      let mx = 0.5;
      let my = 0.5;

      function apply() {
        raf = null;
        el.style.setProperty('--mx', mx.toFixed(4));
        el.style.setProperty('--my', my.toFixed(4));
      }

      function schedule() {
        if (!raf) raf = requestAnimationFrame(apply);
      }

      el.addEventListener('pointermove', function (e) {
        const r = el.getBoundingClientRect();
        mx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        my = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
        schedule();
      });

      el.addEventListener('pointerenter', function () {
        el.classList.add('is-live');
      });

      el.addEventListener('pointerleave', function () {
        el.classList.remove('is-live');
        mx = 0.5;
        my = 0.5;
        schedule();
      });
    });
  });
})();
