import { byId, fetchJSON, chip } from './main.js';

const STATE = { q:'', type:'all', items:[] };

function card(c){
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <h3>${c.code}: ${c.title}</h3>
    <div class="meta"><span>${c.term||c.year||''}</span><span class="dot"></span><span>${c.type||''}</span></div>
    <p>${c.desc||''}</p>
    ${c.topics?.length ? `<div class="chips">${c.topics.map(t=>`<span class='chip'>${t}</span>`).join('')}</div>` : ''}
  `;
  return el;
}

function matches(c){
  const q = STATE.q.toLowerCase();
  const okType = STATE.type==='all' || (c.type||'').toLowerCase()===STATE.type.toLowerCase();
  const inText = !q || [c.code, c.title, c.desc, ...(c.topics||[]), c.type||'', c.term||''].join(' ').toLowerCase().includes(q);
  return okType && inText;
}

function draw(){
  const grid = byId('cwGrid');
  const items = STATE.items.filter(matches);
  grid.innerHTML = '';
  if (!items.length){
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.innerHTML = `<p>No courses found.</p>`;
    grid.appendChild(empty);
  }else{
    items.forEach(c => grid.appendChild(card(c)));
  }
}

async function init(){
  const data = await fetchJSON('data/coursework.json');
  if(!data) return;
  STATE.items = data;
  byId('cwQ').addEventListener('input', e=>{ STATE.q = e.target.value; draw(); });
  byId('typeFilter').addEventListener('change', e=>{ STATE.type = e.target.value; draw(); });
  draw();
}
document.addEventListener('DOMContentLoaded', init);
