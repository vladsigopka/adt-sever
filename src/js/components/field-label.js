(function () {
  function sync(input) {
    if (!input || !input.classList.contains('field__input')) return;
    const field = input.closest('.field');
    if (!field) return;
    field.classList.toggle('field--filled', input.value.trim() !== '');
  }

  document.addEventListener('input', function (e) {
    sync(e.target);
  });

  document.addEventListener('change', function (e) {
    sync(e.target);
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.field__input').forEach(sync);
  });
})();
