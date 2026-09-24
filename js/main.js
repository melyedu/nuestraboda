/* ══════════════════════════════════════════
   MAIN · Navegación, overlay, reveal, nav móvil
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Welcome overlay --- */
  const overlay = document.getElementById('welcome-overlay');
  const enterBtn = document.getElementById('enter-btn');
  enterBtn?.addEventListener('click', () => {
    overlay.classList.add('hidden');
    // Intentar reproducir música tras la interacción
    const audio = document.getElementById('bg-music');
    if (audio) {
      audio.volume = 0.35;
      audio.play().then(() => {
        document.getElementById('music-toggle')?.classList.add('playing');
      }).catch(() => {});
    }
    // Añadir clase visible a la nav
    document.getElementById('main-nav')?.classList.add('visible');
  });

  /* --- Nav toggle móvil --- */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  navToggle?.addEventListener('click', () => mainNav.classList.toggle('open'));

  // Cerrar menú al hacer clic en link
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });

  /* --- Mostrar/ocultar nav al hacer scroll --- */
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > window.innerHeight * 0.6) {
      mainNav.classList.add('visible');
    } else {
      mainNav.classList.remove('visible');
    }
    lastScroll = current;
  });

  /* --- Animaciones reveal --- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.section, .evento-card, .regalo-card, .timeline li, .g-item')
    .forEach(el => { el.classList.add('reveal'); observer.observe(el); });

  /* --- Año dinámico (opcional) --- */
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

 
});

 /* --- Cargar playlist --- */
fetch('data/playlist.json')
  .then(r => r.json())
  .then(songs => {
    const ul = document.getElementById('playlist-list');
    if (!ul) return;
    ul.innerHTML = songs.map(s => `
      <li>
        <span class="song-title">${s.titulo}</span>
        <span class="song-artist">${s.artista}</span>
      </li>
    `).join('');
  })
  .catch(() => {});