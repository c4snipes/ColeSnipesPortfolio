import { byId, fetchJSON, slugify } from './main.js';

const STATE = { q:'', type:'all', items:[] };

// Normalize free-form types into dropdown buckets
function normalizeType(t){
  if (!t) return 'Other';
  const s = String(t).toLowerCase();
  if (s.includes('math')) return 'Math';
  if (s.includes('cs') || s.includes('core') || s.includes('software') || s.includes('systems') || s.includes('elective')) return 'CS';
  return 'Other';
}

// Auto generate description if missing
function autoDesc(c){
  const bits = [];
  if (c.topics?.length) bits.push(c.topics.slice(0,4).join(', '));
  if (c.term) bits.push(c.term);
  return bits.length ? `Covers ${bits[0]}${bits[1] ? ` • ${bits[1]}` : ''}.` : '';
}

function card(c){
  const title = c.title || c.course || 'Untitled';
  const chips = (c.topics||[]).map(t => `<a class="chip" href="skills.html#skill-${slugify(t)}" title="See skill: ${t}">${t}</a>`).join('');
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <h3>${c.code ? `${c.code}: ` : ''}${title}</h3>
    <div class="meta">
      <span>${c.term || c.year || ''}</span>
      <span class="dot"></span>
      <span>${c.typeNorm || c.type || ''}</span>
    </div>
    <p>${c.desc || autoDesc(c)}</p>
    ${chips ? `<div class="chips">${chips}</div>` : ''}
  `;
  return el;
}

function matches(c){
  const q = STATE.q.toLowerCase();
  const okType = STATE.type === 'all' || (c.typeNorm||c.type||'').toLowerCase() === STATE.type.toLowerCase();
  const hay = [c.code, c.title, c.course, c.term, c.type, c.desc, ...(c.topics||[])].filter(Boolean).join(' ').toLowerCase();
  return okType && (!q || hay.includes(q));
}

function draw(){
  const grid = byId('cwGrid');
  const items = STATE.items.filter(matches);
  grid.innerHTML = '';
  if (!items.length){
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.textContent = 'No courses found.';
    grid.appendChild(empty);
  }else{
    items.forEach(c => grid.appendChild(card(c)));
  }
}

async function init(){
  const data = await fetchJSON('data/coursework.json');
  if(!data) return;
  STATE.items = data.map(c => ({ ...c, typeNorm: normalizeType(c.type) }));
  byId('cwQ')?.addEventListener('input', e=>{ STATE.q = e.target.value; draw(); });
  byId('typeFilter')?.addEventListener('change', e=>{ STATE.type = e.target.value; draw(); });
  draw();
}

document.addEventListener('DOMContentLoaded', init);