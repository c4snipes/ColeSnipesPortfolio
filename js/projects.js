import { $, $$, byId, fetchJSON, chip, formatDate } from './main.js';

const STATE = { q:'', tag:null, sort:'newest', items:[] };

function collectTags(items){
  const set = new Set();
  items.forEach(p => (p.tags||[]).forEach(t => set.add(t)));
  return Array.from(set).sort((a,b)=>a.localeCompare(b));
}

function renderTags(tags){
  const wrap = byId('tags');
  wrap.innerHTML = '';
  tags.forEach(t => {
    const c = chip(t);
    if (STATE.tag === t) c.style.outline = '2px solid var(--accent)';
    c.tabIndex = 0;
    c.addEventListener('click', () => { STATE.tag = (STATE.tag===t ? null : t); draw(); });
    c.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') c.click(); });
    wrap.appendChild(c);
  })
}

function matches(p){
  const q = STATE.q.trim().toLowerCase();
  const inTag = STATE.tag ? (p.tags||[]).includes(STATE.tag) : true;
  const inText = !q || [p.title, p.desc, ...(p.tags||[])].join(' ').toLowerCase().includes(q);
  return inTag && inText;
}

function sortItems(arr){
  const k = STATE.sort;
  if (k==='title') return [...arr].sort((a,b)=>a.title.localeCompare(b.title));
  if (k==='oldest') return [...arr].sort((a,b)=> (a.date||'0000').localeCompare(b.date||'0000'));
  // newest
  return [...arr].sort((a,b)=> (b.date||'0000').localeCompare(a.date||'0000'));
}

function projectCard(p){
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <h3>${p.title}</h3>
    <div class="meta">
      <span>${formatDate(p.date||'')}</span>
      <span class="dot"></span>
      <a class="inline" href="${p.link}" target="_blank" rel="noopener">Source / Demo</a>
    </div>
    <p>${p.desc}</p>
    <div class="chips">${(p.tags||[]).map(t=>`<span class="chip">${t}</span>`).join('')}</div>
  `;
  return el;
}

function draw(){
  const grid = byId('projectGrid');
  const items = sortItems(STATE.items.filter(matches));
  grid.innerHTML = '';
  if (!items.length){
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.innerHTML = `<p>No projects match your filters.</p>`;
    grid.appendChild(empty);
  }else{
    items.forEach(p => grid.appendChild(projectCard(p)));
  }
  renderTags(collectTags(STATE.items));
}

async function init(){
  const data = await fetchJSON('data/projects.json');
  if(!data) return;
  STATE.items = data;
  byId('q').addEventListener('input', e=>{ STATE.q = e.target.value; draw(); });
  byId('sort').addEventListener('change', e=>{ STATE.sort = e.target.value; draw(); });
  byId('clear').addEventListener('click', ()=>{ STATE.q=''; STATE.tag=null; byId('q').value=''; draw(); });
  draw();
}
document.addEventListener('DOMContentLoaded', init);
