(function () {
  function setup(chips) {
    const scope = chips.closest('.account__content') || document;
    const items = Array.prototype.slice.call(scope.querySelectorAll('[data-status]'));
    const buttons = Array.prototype.slice.call(chips.querySelectorAll('.chips__item'));
    if (!items.length || !buttons.length) return;

    buttons.forEach(function (btn) {
      const filter = btn.dataset.filter;
      const total = filter === 'all'
        ? items.length
        : items.filter(function (item) { return item.dataset.status === filter; }).length;
      const count = btn.querySelector('.chips__count');
      if (count) count.textContent = total;
    });

    function apply(filter) {
      items.forEach(function (item) {
        const match = filter === 'all' || item.dataset.status === filter;
        item.classList.remove('is-filter-in');
        if (match) {
          item.hidden = false;
          void item.offsetWidth;
          item.classList.add('is-filter-in');
        } else {
          item.hidden = true;
        }
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('chips__item--active')) return;
        buttons.forEach(function (other) {
          const active = other === btn;
          other.classList.toggle('chips__item--active', active);
          other.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        apply(btn.dataset.filter);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.chips[data-chips-filter]').forEach(setup);
  });
})();
