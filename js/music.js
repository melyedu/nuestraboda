/* ══════════════════════════════════════════
   MUSIC · Control de música de fondo
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');
  if (!audio || !btn) return;

  audio.volume = 0.35;

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => btn.classList.add('playing')).catch(() => {});
    } else {
      audio.pause();
      btn.classList.remove('playing');
    }
  });
});