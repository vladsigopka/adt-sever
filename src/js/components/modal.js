(function () {
  const html = document.documentElement;
  let active = null;
  let lastFocus = null;

  function open(modal, opener) {
    if (active) close();
    active = modal;
    lastFocus = opener || document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    html.classList.add('modal-open');
    if (window.lenis) window.lenis.stop();
    const focusTarget = modal.querySelector('[autofocus]') || modal.querySelector('.modal__close');
    if (focusTarget) focusTarget.focus();
  }

  function close() {
    if (!active) return;
    active.classList.remove('is-open');
    active.setAttribute('aria-hidden', 'true');
    html.classList.remove('modal-open');
    if (window.lenis) window.lenis.start();
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    active = null;
    lastFocus = null;
  }

  document.addEventListener('click', function (e) {
    const opener = e.target.closest('[data-modal-open]');
    if (opener) {
      const modal = document.getElementById(opener.getAttribute('data-modal-open'));
      if (modal) {
        e.preventDefault();
        open(modal, opener);
      }
      return;
    }
    if (e.target.closest('[data-modal-close]')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && active) close();
  });
})();
