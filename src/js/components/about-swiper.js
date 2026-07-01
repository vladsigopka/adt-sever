(function () {
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof Swiper === 'undefined') return;
    const el = document.querySelector('[data-about-swiper]');
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    new Swiper(el, {
      loop: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      spaceBetween: 48,
      speed: 650,
      grabCursor: true,
      watchSlidesProgress: true,
      autoplay: reduce ? false : {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      navigation: {
        prevEl: '[data-about-prev]',
        nextEl: '[data-about-next]'
      }
    });
  });
})();
