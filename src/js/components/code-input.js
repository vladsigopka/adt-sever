(function () {
  function cells(wrap) {
    return Array.prototype.slice.call(wrap.querySelectorAll('.code__cell'));
  }

  function maybeAutosubmit(wrap) {
    if (!wrap.hasAttribute('data-autosubmit')) return;
    const complete = cells(wrap).every(function (c) {
      return c.value.trim() !== '';
    });
    if (!complete) return;
    const form = wrap.closest('form');
    if (form) form.requestSubmit();
  }

  document.addEventListener('focusin', function (e) {
    const cell = e.target.closest('.code__cell');
    if (!cell) return;
    const wrap = cell.closest('[data-code]');
    if (!wrap) return;
    const list = cells(wrap);
    const firstEmpty = list.find(function (c) {
      return c.value.trim() === '';
    });
    if (firstEmpty && list.indexOf(cell) > list.indexOf(firstEmpty)) {
      firstEmpty.focus();
    }
  });

  document.addEventListener('input', function (e) {
    const cell = e.target.closest('.code__cell');
    if (!cell) return;
    const wrap = cell.closest('[data-code]');
    if (!wrap) return;
    cell.value = cell.value.replace(/\D/g, '').slice(0, 1);
    cell.classList.toggle('is-filled', cell.value !== '');
    if (cell.value) {
      const list = cells(wrap);
      const next = list[list.indexOf(cell) + 1];
      if (next) next.focus();
      maybeAutosubmit(wrap);
    }
  });

  document.addEventListener('keydown', function (e) {
    const cell = e.target.closest('.code__cell');
    if (!cell) return;
    const wrap = cell.closest('[data-code]');
    if (!wrap) return;
    const list = cells(wrap);
    const i = list.indexOf(cell);
    if (e.key === 'Backspace' && cell.value === '' && list[i - 1]) {
      list[i - 1].focus();
    }
    if (e.key === 'ArrowLeft' && list[i - 1]) {
      e.preventDefault();
      list[i - 1].focus();
    }
    if (e.key === 'ArrowRight' && list[i + 1]) {
      e.preventDefault();
      list[i + 1].focus();
    }
  });

  document.addEventListener('paste', function (e) {
    const cell = e.target.closest('.code__cell');
    if (!cell) return;
    const wrap = cell.closest('[data-code]');
    if (!wrap) return;
    e.preventDefault();
    const data = (e.clipboardData || window.clipboardData).getData('text');
    const digits = data.replace(/\D/g, '').split('');
    const list = cells(wrap);
    let idx = list.indexOf(cell);
    digits.forEach(function (d) {
      if (idx < list.length) {
        list[idx].value = d;
        list[idx].classList.add('is-filled');
        idx++;
      }
    });
    list[Math.min(idx, list.length - 1)].focus();
    maybeAutosubmit(wrap);
  });
})();
