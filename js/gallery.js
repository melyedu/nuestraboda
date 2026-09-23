/* ══════════════════════════════════════════
   GALLERY · Lightbox para la galería
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.g-item');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');

  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      lbImg.src = item.href;
      lightbox.classList.add('active');
    });
  });

  const close = () => { lightbox.classList.remove('active'); lbImg.src = ''; };
  lbClose?.addEventListener('click', close);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
});