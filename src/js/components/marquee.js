(function () {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-marquee-track]').forEach(function (track) {
      const items = Array.prototype.slice.call(track.children);
      if (!items.length) return;

      items.forEach(function (item) {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.setAttribute('tabindex', '-1');
        track.appendChild(clone);
      });

      track.classList.add('is-ready');
    });
  });
})();
