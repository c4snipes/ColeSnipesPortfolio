import { $, $$, byId, fetchJSON, slugify } from './main.js';

// Render a single skill row with progress and keywords
function skillRow(s){
  const row = document.createElement('div');
  row.className = 'card';
  row.id = `skill-${slugify(s.name)}`;
  // Determine if a valid level was provided. Only show level/progress if finite.
  const hasLevel = Number.isFinite(s.level);
  let level = null;
  let pct = null;
  if (hasLevel) {
    level = Math.min(5, Math.max(0, s.level));
    pct   = Math.round(level * 20);
  }
  // Build HTML sections conditionally.
  const headerHTML = `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px">
      <h3 style="margin:0">${s.name}</h3>
      ${hasLevel ? `<span class="small">Level ${level}/5</span>` : ''}
    </div>`;
  const progressHTML = hasLevel ? `<div class="progress" aria-label="Proficiency"><i style="width:${pct}%"></i></div>` : '';
  const keywordsHTML = s.keywords?.length
    ? `<div class="chips" style="margin-top:10px">${s.keywords.map(k=>`<span class="chip">${k}</span>`).join('')}</div>`
    : '';
  row.innerHTML = `${headerHTML}
    ${progressHTML}
    ${keywordsHTML}`;
  return row;
}

// Render a category as <details> for expand/collapse
function categorySection(cat){
  const det = document.createElement('details');
  det.className = 'skill-cat';
  det.open = true;
  det.innerHTML = `
    <summary>${cat.category}<span class="small"></span></summary>
    <div class="grid"></div>
  `;
  const grid = det.querySelector('.grid');
  (cat.items||[]).forEach(s => grid.appendChild(skillRow(s)));
  det.querySelector('.small').textContent = ` (${(cat.items||[]).length})`;
  return det;
}

// Filter categories and items based on query
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

// Scroll to deep link and highlight
function focusHashTarget(){
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const el = byId(id);
  if (el){
    el.classList.add('pulse');
    el.scrollIntoView({behavior:'smooth', block:'center'});
    setTimeout(()=>el.classList.remove('pulse'), 1400);
  }
}

// Load base skills and add Course Topics from coursework.json
async function loadSkillsData(){
  const base = await fetchJSON('data/skills.json') || [];
  const cw   = await fetchJSON('data/coursework.json') || [];
  const set  = new Set();
  cw.forEach(c => (c.topics||[]).forEach(t => set.add(t)));
  // For automatically-generated course topics, do not assign a fixed level.
  // Assign only the name and an empty keywords array. The skillRow helper
  // will hide the level/progress bar when no level is provided.
  const topics = [...set].sort((a,b)=>a.localeCompare(b)).map(name => ({ name, keywords:[] }));
  if (topics.length) base.push({ category:'Course Topics', items: topics });
  return base;
}

async function init(){
  const data = await loadSkillsData(); if(!data) return;
  const wrap = byId('skillsList');
  function draw(){
    const q = byId('skillQ').value.trim();
    wrap.innerHTML = '';
    filterCats(data, q).forEach(c => wrap.appendChild(categorySection(c)));
    focusHashTarget();
  }
  byId('skillQ')?.addEventListener('input', draw);
  byId('expandAll')?.addEventListener('click', () => $$('details.skill-cat').forEach(d=>d.open=true));
  byId('collapseAll')?.addEventListener('click', () => $$('details.skill-cat').forEach(d=>d.open=false));
  window.addEventListener('hashchange', focusHashTarget);
  draw();
}

document.addEventListener('DOMContentLoaded', init);