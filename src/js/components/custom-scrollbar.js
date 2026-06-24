(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  function throttle(fn, wait) {
    let last = 0;
    let timer = null;
    return function () {
      const now = Date.now();
      const remaining = wait - (now - last);
      if (remaining <= 0) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        last = now;
        fn();
      } else if (!timer) {
        timer = setTimeout(function () {
          last = Date.now();
          timer = null;
          fn();
        }, remaining);
      }
    };
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.classList.add('custom-scroll-ready');

    const hitArea = document.createElement('div');
    hitArea.className = 'custom-scroll-hit-area';

    const scrollbar = document.createElement('div');
    scrollbar.className = 'custom-scroll-global';

    const thumb = document.createElement('div');
    thumb.className = 'custom-scroll-thumb-global';

    scrollbar.appendChild(thumb);
    document.body.appendChild(hitArea);
    document.body.appendChild(scrollbar);

    let isDragging = false;
    let hideTimeout;

    function updateScrollbar() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      if (documentHeight <= windowHeight) {
        scrollbar.style.display = 'none';
        hitArea.style.display = 'none';
        return;
      }

      scrollbar.style.display = 'block';
      hitArea.style.display = 'block';

      const thumbHeight = Math.max(30, (windowHeight / documentHeight) * windowHeight);
      thumb.style.height = thumbHeight + 'px';

      const maxThumbTop = windowHeight - thumbHeight;
      const scrollPercent = scrollTop / (documentHeight - windowHeight);
      thumb.style.transform = 'translateY(' + scrollPercent * maxThumbTop + 'px)';
    }

    function showScrollbar() {
      clearTimeout(hideTimeout);
      scrollbar.classList.add('custom-scroll-global--visible');
    }

    function hideScrollbar() {
      if (isDragging) return;
      hideTimeout = setTimeout(function () {
        scrollbar.classList.remove('custom-scroll-global--visible');
      }, 500);
    }

    const onScroll = throttle(function () {
      updateScrollbar();
      showScrollbar();
      hideScrollbar();
    }, 16);

    const onResize = throttle(updateScrollbar, 100);

    function onMouseMove(event) {
      if (!isDragging) return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const thumbHeight = thumb.offsetHeight;
      const maxThumbTop = windowHeight - thumbHeight;

      let newThumbTop = event.clientY - thumbHeight / 2;
      newThumbTop = Math.max(0, Math.min(maxThumbTop, newThumbTop));

      const scrollPercent = newThumbTop / maxThumbTop;
      const target = scrollPercent * (documentHeight - windowHeight);

      if (window.lenis) {
        window.lenis.scrollTo(target, { immediate: true });
      } else {
        window.scrollTo(0, target);
      }
    }

    function onMouseUp() {
      isDragging = false;
      hideScrollbar();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    function onMouseDown(e) {
      e.preventDefault();
      isDragging = true;
      showScrollbar();
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    hitArea.addEventListener('mouseenter', showScrollbar);
    hitArea.addEventListener('mouseleave', hideScrollbar);
    scrollbar.addEventListener('mouseenter', showScrollbar);
    scrollbar.addEventListener('mouseleave', hideScrollbar);
    thumb.addEventListener('mousedown', onMouseDown);

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);

    const observer = new ResizeObserver(throttle(updateScrollbar, 100));
    observer.observe(document.body);

    updateScrollbar();
  });
})();
