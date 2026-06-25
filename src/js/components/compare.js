(function () {
  const compare = document.querySelector('[data-compare]');
  if (!compare) return;

  const countEl = compare.querySelector('[data-compare-count]');
  const wordEl = compare.querySelector('[data-compare-word]');

  function plural(n, forms) {
    const n10 = n % 10;
    const n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return forms[0];
    if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
    return forms[2];
  }

  function update() {
    const count = compare.querySelectorAll('.compare-card').length;
    compare.style.setProperty('--count', count || 1);
    if (countEl) countEl.textContent = count;
    if (wordEl) wordEl.textContent = plural(count, ['автомобиль', 'автомобиля', 'автомобилей']);
    compare.classList.toggle('compare--empty', count === 0);
  }

  function reindex() {
    compare.querySelectorAll('.compare-card').forEach(function (card, i) {
      card.dataset.col = i;
    });
    compare.querySelectorAll('.compare__sticky-car').forEach(function (car, i) {
      car.dataset.col = i;
    });
    compare.querySelectorAll('.compare__row').forEach(function (row) {
      row.querySelectorAll('.compare__value').forEach(function (value, i) {
        value.dataset.col = i;
      });
    });
  }

  function removeCells(cells, done) {
    if (!cells.length) {
      if (done) done();
      return;
    }
    cells.forEach(function (cell) {
      cell.classList.add('is-removing');
    });
    setTimeout(function () {
      cells.forEach(function (cell) {
        cell.remove();
      });
      if (done) done();
    }, 320);
  }

  compare.addEventListener('click', function (e) {
    const remove = e.target.closest('.js-compare-remove');
    if (remove) {
      const holder = remove.closest('[data-col]');
      if (!holder) return;
      const col = holder.dataset.col;
      const cells = Array.prototype.slice.call(
        compare.querySelectorAll('[data-col="' + col + '"]')
      );
      removeCells(cells, function () {
        reindex();
        update();
      });
      return;
    }

    if (e.target.closest('[data-compare-clear]')) {
      const all = Array.prototype.slice.call(compare.querySelectorAll('[data-col]'));
      removeCells(all, update);
    }
  });

  const diff = compare.querySelector('[data-compare-diff]');
  if (diff) {
    diff.addEventListener('change', function () {
      compare.classList.toggle('is-diff-only', diff.checked);
    });
  }

  const cards = compare.querySelector('.compare__cards');
  const sticky = compare.querySelector('[data-compare-sticky]');
  if (cards && sticky) {
    function syncSticky() {
      const cardsBottom = cards.getBoundingClientRect().bottom;
      const sectionBottom = compare.getBoundingClientRect().bottom;
      const show = cardsBottom < 0 && sectionBottom > 140;
      sticky.classList.toggle('is-visible', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
    }
    window.addEventListener('scroll', syncSticky, { passive: true });
    window.addEventListener('resize', syncSticky);
    if (window.lenis && typeof window.lenis.on === 'function') {
      window.lenis.on('scroll', syncSticky);
    }
    syncSticky();
  }

  update();
})();
