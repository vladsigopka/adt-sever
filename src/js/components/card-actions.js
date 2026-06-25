(function () {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.js-card-like, .js-card-compare');
    if (!btn) return;
    btn.classList.toggle('is-active');
  });
})();
