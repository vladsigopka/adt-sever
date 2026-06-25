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
    const head = compare.querySelector('.compare__row--head');
    const count = head ? head.querySelectorAll('.compare__cell').length : 0;
    compare.style.setProperty('--count', count || 1);
    if (countEl) countEl.textContent = count;
    if (wordEl) wordEl.textContent = plural(count, ['автомобиль', 'автомобиля', 'автомобилей']);
    compare.classList.toggle('compare--empty', count === 0);
  }

  function reindex() {
    compare.querySelectorAll('.compare__row').forEach(function (row) {
      row.querySelectorAll('.compare__cell').forEach(function (cell, i) {
        cell.dataset.col = i;
        const btn = cell.querySelector('.js-compare-remove');
        if (btn) btn.dataset.col = i;
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
      const col = remove.dataset.col;
      const cells = Array.prototype.slice.call(
        compare.querySelectorAll('.compare__cell[data-col="' + col + '"]')
      );
      removeCells(cells, function () {
        reindex();
        update();
      });
      return;
    }

    if (e.target.closest('[data-compare-clear]')) {
      const all = Array.prototype.slice.call(compare.querySelectorAll('.compare__cell'));
      removeCells(all, update);
    }
  });

  const diff = compare.querySelector('[data-compare-diff]');
  if (diff) {
    diff.addEventListener('change', function () {
      compare.classList.toggle('is-diff-only', diff.checked);
    });
  }

  update();
})();
