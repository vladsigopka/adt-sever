(function () {
  const html = document.documentElement;
  const burger = document.querySelector('.js-menu-open');
  const menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  function open() {
    html.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  }

  function close() {
    html.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }

  function toggle() {
    if (html.classList.contains('menu-open')) {
      close();
    } else {
      open();
    }
  }

  burger.addEventListener('click', toggle);

  document.addEventListener('click', function (e) {
    if (e.target.closest('.js-menu-close')) close();
    if (e.target.closest('.mobile-menu__link')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && html.classList.contains('menu-open')) close();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024 && html.classList.contains('menu-open')) close();
  });
})();
