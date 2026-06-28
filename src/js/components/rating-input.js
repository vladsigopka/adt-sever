(function () {
  function init(el) {
    const stars = Array.prototype.slice.call(el.querySelectorAll('[data-rating-star]'));
    const input = el.querySelector('[data-rating-value]');
    if (!stars.length) return;

    let value = (input && parseInt(input.value, 10)) || 0;

    function paint(n) {
      stars.forEach(function (star, i) {
        star.classList.toggle('is-active', i < n);
      });
    }

    paint(value);

    stars.forEach(function (star, i) {
      star.addEventListener('mouseenter', function () {
        paint(i + 1);
      });
      star.addEventListener('click', function () {
        value = i + 1;
        if (input) input.value = value;
        paint(value);
      });
    });

    el.addEventListener('mouseleave', function () {
      paint(value);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-rating-input]').forEach(init);
  });
})();
