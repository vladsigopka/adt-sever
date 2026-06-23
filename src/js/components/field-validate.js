(function () {
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function getTest(type) {
    if (type === 'email') return (v) => EMAIL.test(v);
    return null;
  }

  function validate(input) {
    const field = input.closest('.field[data-validate]');
    if (!field) return;
    const test = getTest(field.getAttribute('data-validate'));
    if (!test) return;
    const value = input.value.trim();
    const invalid = value !== '' && !test(value);
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
