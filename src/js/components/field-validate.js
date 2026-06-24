(function () {
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(input) {
    const field = input.closest('.field[data-validate]');
    if (!field) return;
    const type = field.getAttribute('data-validate');
    const value = input.value.trim();
    let invalid = false;

    if (type === 'email') {
      invalid = value !== '' && !EMAIL.test(value);
    } else if (type === 'match') {
      const target = document.querySelector(field.getAttribute('data-match'));
      invalid = value !== '' && !!target && value !== target.value.trim();
    }

    field.classList.toggle('field--error', invalid);
  }

  function isFieldInput(el) {
    return el && el.classList && el.classList.contains('field__input');
  }

  document.addEventListener('blur', function (e) {
    if (isFieldInput(e.target)) validate(e.target);
  }, true);

  document.addEventListener('input', function (e) {
    if (!isFieldInput(e.target)) return;
    const field = e.target.closest('.field');
    if (field && field.classList.contains('field--error')) validate(e.target);
  });
})();
