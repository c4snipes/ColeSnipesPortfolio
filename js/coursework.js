// js/coursework.js
import { byId, fetchJSON, chip } from './main.js';

const STATE = { q: '', type: 'all', items: [] };

// Map your existing labels to the dropdown buckets
function normalizeType(t) {
  if (!t) return 'Other';
  const s = String(t).toLowerCase();
  if (s.includes('math')) return 'Math';
  if (s.includes('core') || s.includes('elective') || s.includes('capstone') || s.includes('cs') || s.includes('software') || s.includes('systems') || s.includes('network'))
    return 'CS';
  if (s.includes('science') || s.includes('physics')) return 'Other';
  return 'Other';
}

// Tiny helper to generate a one-liner description if missing
function autoDesc(c) {
  const bits = [];
  if (c.topics?.length) bits.push(c.topics.slice(0, 4).join(', '));
  if (c.term) bits.push(c.term);
  return bits.length ? `Covers ${bits[0]}${bits[1] ? ` • ${bits[1]}` : ''}.` : '';
}

function card(c) {
  const title = c.course || c.title || 'Untitled';
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <h3>${c.code ? `${c.code}: ` : ''}${title}</h3>
    <div class="meta">
      <span>${c.term || c.year || ''}</span>
      <span class="dot"></span>
      <span>${c.typeNorm}</span>
    </div>
    <p>${c.desc || autoDesc(c)}</p>
    ${c.topics?.length ? `<div class="chips">${c.topics.map(t => `<span class="chip">${t}</span>`).join('')}</div>` : ''}
  `;
  return el;
}

function matchesQuery(c, q) {
  if (!q) return true;
  const hay = [
    c.course, c.title, c.code, c.term, c.type, c.desc,
    ...(c.topics || [])
  ].filter(Boolean).join(' ').toLowerCase();
  return hay.includes(q.toLowerCase());
}

function draw() {
  const grid = byId('cwGrid');
  grid.innerHTML = '';

  let items = STATE.items;

  // Filter by dropdown type
  if (STATE.type !== 'all') {
    items = items.filter(c => c.typeNorm === STATE.type);
  }
  // Filter by search
  if (STATE.q) {
    items = items.filter(c => matchesQuery(c, STATE.q));
  }

  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.textContent = 'No courses found.';
    grid.appendChild(empty);
  } else {
    items.forEach(c => grid.appendChild(card(c)));
  }
}

async function init() {
  const data = await fetchJSON('data/coursework.json');
  if (!data) return;

  // Normalize + light enrichment
  STATE.items = data.map(c => ({
    ...c,
    title: c.title || c.course,     // tolerate either field
    typeNorm: normalizeType(c.type) // CS / Math / Other for the dropdown
  }));

  byId('cwQ').addEventListener('input', e => { STATE.q = e.target.value; draw(); });
  byId('typeFilter').addEventListener('change', e => { STATE.type = e.target.value; draw(); });
  draw();
}
document.addEventListener('DOMContentLoaded', init);
