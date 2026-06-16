(function () {
  document.addEventListener('click', function (e) {
    const head = e.target.closest('.js-faq-toggle');
    if (!head) return;

    const item = head.closest('.faq__item');
    if (!item) return;

    const isOpen = item.classList.toggle('is-open');
    head.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
})();
