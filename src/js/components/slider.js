(function () {
  function initSlider(root) {
    const track = root.querySelector('[data-slider-track]');
    if (!track) return;
    const slides = Array.prototype.slice.call(track.children);
    if (slides.length < 1) return;

    const prevBtn = root.querySelector('[data-slider-prev]');
    const nextBtn = root.querySelector('[data-slider-next]');
    const dotsWrap = root.querySelector('[data-slider-dots]');
    const current = root.querySelector('[data-slider-current]');
    const total = root.querySelector('[data-slider-total]');
    const loop = root.dataset.sliderLoop !== 'false';
    const center = 'sliderCenter' in root.dataset;
    const autoplay = parseInt(root.dataset.sliderAutoplay, 10) || 0;

    let index = Math.min(slides.length - 1, parseInt(root.dataset.sliderStart, 10) || 0);
    let timer = null;
    let dir = 1;
    let dots = [];

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider-dot';
        dot.setAttribute('aria-label', 'Слайд ' + (i + 1));
        dot.addEventListener('click', function () {
          go(i);
          restart();
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    if (total) total.textContent = String(slides.length).padStart(2, '0');

    function maxScroll() {
      return Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
    }

    function render() {
      let target;
      if (center) {
        const vp = track.parentElement.clientWidth;
        target = slides[index].offsetLeft + slides[index].offsetWidth / 2 - vp / 2;
      } else {
        target = Math.min(slides[index].offsetLeft, maxScroll());
      }
      track.style.transform = 'translateX(' + -target + 'px)';
      slides.forEach(function (s, i) {
        s.classList.toggle('is-active', i === index);
        s.classList.toggle('is-prev', i === index - 1);
        s.classList.toggle('is-next', i === index + 1);
        s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === index);
      });
      if (current) current.textContent = String(index + 1).padStart(2, '0');
      if (!loop) {
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = center ? index === slides.length - 1 : target >= maxScroll() - 1;
      }
    }

    function go(i) {
      if (loop) index = (i + slides.length) % slides.length;
      else index = Math.max(0, Math.min(slides.length - 1, i));
      render();
    }

    function restart() {
      if (!autoplay) return;
      clearInterval(timer);
      timer = setInterval(function () {
        if (!loop) {
          if (index >= slides.length - 1) dir = -1;
          else if (index <= 0) dir = 1;
        }
        go(index + dir);
      }, autoplay);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { go(index - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(index + 1); restart(); });

    let startX = 0;
    let dragging = false;

    root.addEventListener('pointerdown', function (e) {
      if (e.target.closest('[data-slider-no-swipe]')) return;
      dragging = true;
      startX = e.clientX;
    });

    root.addEventListener('pointerup', function (e) {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 50) {
        go(index + (dx < 0 ? 1 : -1));
        restart();
      }
    });

    if (autoplay) {
      root.addEventListener('mouseenter', function () { clearInterval(timer); });
      root.addEventListener('mouseleave', restart);
    }

    window.addEventListener('resize', render);

    render();
    restart();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-slider]').forEach(initSlider);
  });
})();
