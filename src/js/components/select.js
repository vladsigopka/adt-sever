(function () {
  function closeAll(except) {
    document.querySelectorAll('[data-select].is-open').forEach(function (sel) {
      if (sel === except) return;
      sel.classList.remove('is-open');
      const trigger = sel.querySelector('.select__trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function select(root, option) {
    const value = root.querySelector('[data-select-value]');
    const input = root.querySelector('[data-select-input]');
    const options = root.querySelectorAll('.select__option');

    options.forEach(function (o) {
      o.classList.toggle('is-selected', o === option);
      o.setAttribute('aria-selected', o === option ? 'true' : 'false');
    });

    if (value) value.textContent = option.textContent;
    root.classList.add('is-filled');
    if (input) {
      input.value = option.dataset.value || option.textContent.trim();
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function open(root) {
    closeAll(root);
    root.classList.add('is-open');
    const trigger = root.querySelector('.select__trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }

  function close(root) {
    root.classList.remove('is-open');
    const trigger = root.querySelector('.select__trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('.select__trigger');
    if (trigger) {
      const root = trigger.closest('[data-select]');
      if (root.classList.contains('is-open')) close(root);
      else open(root);
      return;
    }

    const option = e.target.closest('.select__option');
    if (option) {
      const root = option.closest('[data-select]');
      select(root, option);
      close(root);
      return;
    }

    closeAll(null);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });
})();
