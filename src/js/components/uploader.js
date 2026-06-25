(function () {
  function init(uploader) {
    const input = uploader.querySelector('.uploader__input');
    const zone = uploader.querySelector('.uploader__dropzone');
    const preview = uploader.querySelector('[data-uploader-preview]');
    if (!input || !zone) return;

    function showFile(file) {
      if (!file || file.type.indexOf('image/') !== 0) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        uploader.classList.add('has-file');
        if (preview) preview.style.backgroundImage = 'url(' + e.target.result + ')';
      };
      reader.readAsDataURL(file);
    }

    input.addEventListener('change', function () {
      if (input.files && input.files[0]) showFile(input.files[0]);
    });

    ['dragenter', 'dragover'].forEach(function (type) {
      zone.addEventListener(type, function (e) {
        e.preventDefault();
        uploader.classList.add('is-dragover');
      });
    });

    ['dragleave', 'dragend', 'drop'].forEach(function (type) {
      zone.addEventListener(type, function (e) {
        e.preventDefault();
        uploader.classList.remove('is-dragover');
      });
    });

    zone.addEventListener('drop', function (e) {
      const files = e.dataTransfer && e.dataTransfer.files;
      if (files && files[0]) {
        input.files = files;
        showFile(files[0]);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-uploader]').forEach(init);
  });
})();
