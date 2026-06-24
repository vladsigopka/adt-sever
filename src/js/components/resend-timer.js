(function () {
  function render(btn, seconds) {
    const label = btn.getAttribute('data-resend-label') || 'Отправить код еще раз';
    if (seconds > 0) {
      btn.disabled = true;
      btn.textContent = label + ' — ' + seconds + ' сек.';
    } else {
      btn.disabled = false;
      btn.textContent = label;
    }
  }

  function start(btn) {
    let seconds = parseInt(btn.getAttribute('data-resend-seconds'), 10) || 30;
    render(btn, seconds);
    const timer = setInterval(function () {
      seconds -= 1;
      render(btn, seconds);
      if (seconds <= 0) clearInterval(timer);
    }, 1000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.js-resend').forEach(start);
  });

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.js-resend');
    if (!btn || btn.disabled) return;
    start(btn);
  });
})();
