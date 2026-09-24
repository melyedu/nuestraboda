/* ══════════════════════════════════════════
   RSVP · Búsqueda de invitados + envío a Google Sheets
   ⚠️ Reemplaza la URL de APPS_SCRIPT_URL por la tuya
══════════════════════════════════════════ */

const APPS_SCRIPT_URL = 'https://script.google.com/u/0/home/projects/1A5lfmJl8JvtiM9YqOEMyDLBnR7F6aN1rHMMRQE9l1S4JPbpZC0KBp-DQ/edit';
const GUESTS_JSON = 'data/guests.json';

/* ---------- BÚSQUEDA DE INVITADO / PASES ---------- */
async function loadGuests() {
  try {
    const res = await fetch(GUESTS_JSON);
    if (!res.ok) throw new Error('No se pudo cargar guests.json');
    return await res.json();
  } catch (e) {
    console.warn('Error cargando invitados:', e);
    return [];
  }
}

function normalize(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function searchGuest(guests, query) {
  const q = normalize(query);
  if (!q) return null;
  return guests.find(g => {
    const nameMatch = normalize(g.nombre).includes(q);
    const codeMatch = normalize(g.codigo) === q;
    return nameMatch || codeMatch;
  }) || null;
}

document.addEventListener('DOMContentLoaded', async () => {
  const guests = await loadGuests();
  const searchBtn = document.getElementById('search-guest-btn');
  const searchInput = document.getElementById('guest-code');
  const resultBox = document.getElementById('guest-result');
  const form = document.getElementById('rsvp-form');

  /* --- Buscar pases --- */
  searchBtn?.addEventListener('click', () => {
    const found = searchGuest(guests, searchInput.value);
    if (!found) {
      resultBox.className = 'guest-result error';
      resultBox.textContent = 'No encontramos tu nombre. Verifica la escritura o usa tu código de invitación.';
      return;
    }
    const pases = found.pases || 1;
    resultBox.className = 'guest-result found';
    resultBox.innerHTML = `
      <strong>¡Bienvenido/a, ${found.nombre}!</strong><br>
      Tienes <strong>${pases} ${pases === 1 ? 'pase' : 'pases'}</strong> reservado(s).<br>
      ${found.mesa ? `Mesa asignada: <strong>${found.mesa}</strong>` : ''}
    `;

    // Autocompletar el formulario
    form.nombre.value = found.nombre;
    form.pases.value = pases;
    form.pases.max = pases;
  });

  /* --- Enviar RSVP --- */
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('rsvp-status');
    status.textContent = 'Enviando…';
    status.className = 'rsvp-status';

    const data = Object.fromEntries(new FormData(form).entries());
    data.timestamp = new Date().toISOString();

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script no envía CORS headers
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      // Con no-cors no podemos leer la respuesta; asumimos éxito si no lanza error
      status.textContent = '¡Gracias! Tu confirmación ha sido registrada 💛';
      status.className = 'rsvp-status success';
      form.reset();
    } catch (err) {
      console.error(err);
      status.textContent = 'Hubo un error al enviar. Intenta de nuevo o contáctanos directamente.';
      status.className = 'rsvp-status error';
    }
  });

  /* --- Cargar confirmados --- */
  const loadBtn = document.getElementById('load-confirmados');
  loadBtn?.addEventListener('click', async () => {
    const listBox = document.getElementById('confirmados-list');
    listBox.innerHTML = '<p style="text-align:center;grid-column:1/-1;">Cargando…</p>';
    try {
      const res = await fetch(APPS_SCRIPT_URL);
      const data = await res.json();
      listBox.innerHTML = '';
      if (!data.length) {
        listBox.innerHTML = '<p style="text-align:center;grid-column:1/-1;">Aún no hay confirmaciones.</p>';
        return;
      }
      data.forEach(g => {
        const chip = document.createElement('div');
        chip.className = 'guest-chip';
        chip.textContent = g.nombre;
        listBox.appendChild(chip);
      });
    } catch (err) {
      console.error(err);
      listBox.innerHTML = '<p style="text-align:center;grid-column:1/-1;">No se pudo cargar la lista.</p>';
    }
  });
});