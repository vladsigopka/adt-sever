(function () {
  const modal = document.getElementById('reviewModal');
  if (!modal) return;

  const fields = {
    name: modal.querySelector('[data-modal-name]'),
    rating: modal.querySelector('[data-modal-rating]'),
    text: modal.querySelector('[data-modal-text]'),
    date: modal.querySelector('[data-modal-date]'),
    img: modal.querySelector('[data-modal-img]'),
    webp: modal.querySelector('[data-modal-webp]'),
  };

  document.addEventListener('click', function (e) {
    const card = e.target.closest('.review[data-modal-open="reviewModal"]');
    if (!card) return;

    const name = card.querySelector('.review__name');
    const rating = card.querySelector('.rating');
    const text = card.querySelector('.review__text');
    const date = card.querySelector('.review__date');
    const img = card.querySelector('.review__image');
    const source = card.querySelector('.review__photo source');

    if (fields.name && name) fields.name.textContent = name.textContent;
    if (fields.rating && rating) {
      fields.rating.innerHTML = rating.innerHTML;
      fields.rating.setAttribute('aria-label', rating.getAttribute('aria-label') || '');
    }
    if (fields.text && text) fields.text.textContent = text.textContent;
    if (fields.date && date) {
      fields.date.textContent = date.textContent;
      const dt = date.getAttribute('datetime');
      if (dt) fields.date.setAttribute('datetime', dt);
    }
    if (fields.img && img) {
      fields.img.src = img.getAttribute('src');
      fields.img.alt = img.getAttribute('alt') || '';
    }
    if (fields.webp && source) fields.webp.srcset = source.getAttribute('srcset');
  });
})();
