import { $, $$, byId, fetchJSON, chip } from './main.js';

function skillRow(s){
  const row = document.createElement('div');
  row.className = 'card';
  const levelPct = Math.min(100, Math.max(0, (s.level||0) * 20));
  row.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px">
      <h3 style="margin:0">${s.name}</h3>
      <span class="small">Level ${s.level||0}/5</span>
    </div>
    <div class="progress" aria-label="Proficiency"><i style="width:${levelPct}%"></i></div>
    ${s.keywords?.length ? `<div class="chips" style="margin-top:10px">${s.keywords.map(k=>`<span class='chip'>${k}</span>`).join('')}</div>` : ''}
  `;
  return row;
}

function section(cat){
  const sec = document.createElement('section');
  sec.className = 'card';
  const id = `cat-${cat.category.toLowerCase().replace(/\s+/g,'-')}`;
  sec.innerHTML = `
    <h3 id="${id}" style="margin-bottom:8px">${cat.category}</h3>
    <div class="grid"></div>
  `;
  const grid = sec.querySelector('.grid');
  cat.items.forEach(s => grid.appendChild(skillRow(s)));
  return sec;
}

function filterCats(cats, q){
  if (!q) return cats;
  const t = q.toLowerCase();
  return cats.map(c => ({
    ...c,
    items: (c.items||[]).filter(s =>
      s.name.toLowerCase().includes(t) ||
      (s.keywords||[]).join(' ').toLowerCase().includes(t))
  })).filter(c => c.items.length);
}

async function init(){
  const data = await fetchJSON('data/skills.json');
  if(!data) return;
  const wrap = byId('skillsList');

  function draw(){
    const q = byId('skillQ').value.trim();
    wrap.innerHTML = '';
    filterCats(data, q).forEach(c => wrap.appendChild(section(c)));
  }

  byId('skillQ').addEventListener('input', draw);
  byId('expandAll').addEventListener('click', () => $$('details').forEach(d=>d.open=true));
  byId('collapseAll').addEventListener('click', () => $$('details').forEach(d=>d.open=false));
  draw();
}

document.addEventListener('DOMContentLoaded', init);
