(function () {
  document.addEventListener('click', function (e) {
    if (e.target.closest('.js-filters-open')) {
      document.documentElement.classList.add('filters-open');
      const panel = document.querySelector('.filters');
      if (panel) panel.classList.add('is-open');
      if (window.lenis) window.lenis.stop();
      return;
    }
    if (e.target.closest('.js-filters-close')) {
      document.documentElement.classList.remove('filters-open');
      const panel = document.querySelector('.filters');
      if (panel) panel.classList.remove('is-open');
      if (window.lenis) window.lenis.start();
      return;
    }
    const head = e.target.closest('.filters__head');
    if (!head) return;
    const group = head.closest('.filters__group');
    if (group) group.classList.toggle('is-collapsed');
  });

  function initRange(range) {
    const min = range.querySelector('[data-range-min]');
    const max = range.querySelector('[data-range-max]');
    const fill = range.querySelector('.filters__range-fill');
    if (!min || !max || !fill) return;

    const lo = Number(min.min);
    const hi = Number(min.max);
    const fieldMin = range.dataset.fieldMin ? document.querySelector(range.dataset.fieldMin) : null;
    const fieldMax = range.dataset.fieldMax ? document.querySelector(range.dataset.fieldMax) : null;

    function pct(v) {
      return ((v - lo) / (hi - lo)) * 100;
    }

    function format(v) {
      return Number(v).toLocaleString('ru-RU');
    }

    function update() {
      let a = Number(min.value);
      let b = Number(max.value);
      if (a > b) {
        if (document.activeElement === min) {
          a = b;
          min.value = a;
        } else {
          b = a;
          max.value = b;
        }
      }
      fill.style.left = pct(a) + '%';
      fill.style.width = (pct(b) - pct(a)) + '%';
      if (fieldMin && document.activeElement !== fieldMin) fieldMin.value = format(a);
      if (fieldMax && document.activeElement !== fieldMax) fieldMax.value = format(b);
    }

    min.addEventListener('input', update);
    max.addEventListener('input', update);

    if (fieldMin) {
      fieldMin.addEventListener('change', function () {
        min.value = fieldMin.value.replace(/\D/g, '') || lo;
        update();
      });
    }
    if (fieldMax) {
      fieldMax.addEventListener('change', function () {
        max.value = fieldMax.value.replace(/\D/g, '') || hi;
        update();
      });
    }

    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-range]').forEach(initRange);
  });
})();
