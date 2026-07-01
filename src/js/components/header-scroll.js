(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastY = window.scrollY || 0;
    let ticking = false;
    const threshold = 8;

    function update() {
      const y = window.scrollY || 0;
      const headerH = header.offsetHeight;

      if (y <= headerH) {
        header.classList.remove('header--hidden');
        lastY = y;
      } else if (y > lastY + threshold) {
        header.classList.add('header--hidden');
        lastY = y;
      } else if (y < lastY - threshold) {
        header.classList.remove('header--hidden');
        lastY = y;
      }

      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
  });
})();
