(function () {
  document.addEventListener('click', function (e) {
    const toggle = e.target.closest('.js-password-toggle');
    if (!toggle) return;

    const field = toggle.closest('.field');
    const input = field && field.querySelector('.field__input');
    if (!input) return;

    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    toggle.setAttribute('aria-label', isHidden ? 'Скрыть пароль' : 'Показать пароль');
    toggle.classList.toggle('is-active', isHidden);
  });
})();
