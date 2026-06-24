(function () {
  function fieldValid(input) {
    input.dispatchEvent(new FocusEvent('blur'));
    const field = input.closest('.field');
    if (field && field.classList.contains('field--error')) return false;
    if (input.required && input.value.trim() === '') return false;
    return true;
  }

  function codeComplete(form) {
    const wrap = form.querySelector('[data-code]');
    if (!wrap) return true;
    return Array.prototype.every.call(wrap.querySelectorAll('.code__cell'), function (cell) {
      return cell.value.trim() !== '';
    });
  }

  document.addEventListener('submit', function (e) {
    const form = e.target.closest('form[data-redirect]');
    if (!form) return;
    e.preventDefault();

    let ok = true;

    form.querySelectorAll('.field__input').forEach(function (input) {
      if (!fieldValid(input)) ok = false;
    });

    const agree = form.querySelector('input[type="checkbox"][required]');
    if (agree && !agree.checked) {
      ok = false;
      const box = agree.closest('.checkbox');
      if (box) box.classList.add('is-invalid');
    }

    if (!codeComplete(form)) ok = false;

    if (ok) window.location.href = form.getAttribute('data-redirect');
  });

  document.addEventListener('change', function (e) {
    const cb = e.target.closest('.checkbox__input');
    if (cb && cb.checked) {
      const box = cb.closest('.checkbox');
      if (box) box.classList.remove('is-invalid');
    }
  });
})();
