(function () {
  function setIndex(slider, index) {
    const track = slider.querySelector('.car-card__track');
    if (!track) return;
    const count = track.children.length;
    const i = Math.max(0, Math.min(count - 1, index));
    track.style.transform = 'translateX(-' + i * 100 + '%)';
    slider.dataset.index = i;
    const media = slider.closest('.car-card__media');
    const dots = media ? media.querySelectorAll('.car-card__dots span') : [];
    dots.forEach(function (dot, di) {
      dot.classList.toggle('is-active', di === i);
    });
  }

  document.addEventListener('mousemove', function (e) {
    const zone = e.target.closest('.car-card__zones span');
    if (!zone) return;
    const slider = zone.closest('[data-card-slider]');
    const zones = Array.prototype.slice.call(zone.parentElement.children);
    const i = zones.indexOf(zone);
    if (String(i) !== slider.dataset.index) setIndex(slider, i);
  });

  document.addEventListener('click', function (e) {
    const dot = e.target.closest('.car-card__dots span');
    if (!dot) return;
    const media = dot.closest('.car-card__media');
    const slider = media.querySelector('[data-card-slider]');
    const dots = Array.prototype.slice.call(dot.parentElement.children);
    setIndex(slider, dots.indexOf(dot));
  });

  document.addEventListener('mouseleave', function (e) {
    const media = e.target.closest && e.target.closest('.car-card__media');
    if (!media) return;
    const slider = media.querySelector('[data-card-slider]');
    if (slider) setIndex(slider, 0);
  }, true);
})();
