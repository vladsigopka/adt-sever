(function () {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.js-field-clear');
    if (!btn) return;
    const field = btn.closest('.field');
    if (!field) return;
    const input = field.querySelector('.field__input');
    if (!input) return;
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  });
})();
