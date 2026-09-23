/* ══════════════════════════════════════════
   COUNTDOWN · Cuenta regresiva al gran día
   Edita la fecha objetivo aquí:
══════════════════════════════════════════ */

const WEDDING_DATE = new Date('2026-10-24T11:45:00').getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = WEDDING_DATE - now;

  const el = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds'),
  };

  if (!el.days) return;

  if (diff <= 0) {
    el.days.textContent = el.hours.textContent = el.minutes.textContent = el.seconds.textContent = '00';
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  el.days.textContent    = String(d).padStart(2, '0');
  el.hours.textContent   = String(h).padStart(2, '0');
  el.minutes.textContent = String(m).padStart(2, '0');
  el.seconds.textContent = String(s).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);