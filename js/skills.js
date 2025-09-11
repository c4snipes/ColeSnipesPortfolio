import { $, $$, byId, fetchJSON } from './main.js';

// Convert arbitrary text into a slug suitable for use in fragment identifiers.
const slug = (s) => String(s)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

/**
 * Render a single skill row. Each row shows the skill name, optional level,
 * a progress bar, and any keywords as chips. The row gets an ID based on
 * the skill name so it can be linked to directly via fragment identifiers.
 *
 * @param {Object} s - Skill object with `name`, `level` (1-5), and `keywords`.
 * @returns {HTMLElement}
 */
function skillRow(s){
  const row = document.createElement('div');
  row.className = 'skill-row';
  row.id = `skill-${slug(s.name)}`;
  const levelPct = Math.min(100, Math.max(0, (s.level || 0) * 20));
  row.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px">
      <h3 style="margin:0">${s.name}</h3>
      ${Number.isFinite(s.level) ? `<span class="small">Level ${s.level}/5</span>` : ''}
    </div>
    <div class="progress" aria-label="Proficiency"><i style="width:${levelPct}%"></i></div>
    ${s.keywords?.length ? `<div class="chips" style="margin-top:10px">${s.keywords.map(k => `<span class='chip'>${k}</span>`).join('')}</div>` : ''}
  `;
  return row;
}

/**
 * Render an entire category of skills into a <details> element. Each category
 * will be collapsed or expanded based on the `open` attribute, allowing the
 * "Expand all" and "Collapse all" buttons to control them collectively.
 *
 * @param {Object} cat - Category object with `category` and `items` arrays.
 * @returns {HTMLElement}
 */
function section(cat){
  const det = document.createElement('details');
  det.className = 'card';
  det.open = true;
  det.innerHTML = `
    <summary id="cat-${slug(cat.category)}" style="cursor:pointer"><strong>${cat.category}</strong></summary>
    <div class="grid"></div>
  `;
  const grid = det.querySelector('.grid');
  (cat.items || []).forEach(s => grid.appendChild(skillRow(s)));
  return det;
}

/**
 * Filter categories based on a search query. Only categories with items that
 * match the query will be returned, and items within those categories will
 * themselves be filtered. Matching is case-insensitive against skill names
 * and keywords.
 *
 * @param {Array} cats - Array of category objects.
 * @param {string} q - Search query.
 * @returns {Array}
 */
function filterCats(cats, q){
  if (!q) return cats;
  const t = q.toLowerCase();
  return cats
    .map(c => ({
      ...c,
      items: (c.items || []).filter(s => {
        return (
          s.name.toLowerCase().includes(t) ||
          (s.keywords || []).join(' ').toLowerCase().includes(t)
        );
      })
    }))
    .filter(c => c.items.length);
}

/**
 * Load the base skills JSON and augment it with a new category of skills
 * derived from unique topics listed in the coursework data. Each unique
 * topic becomes its own skill with a default proficiency level.
 *
 * @returns {Promise<Array>} - Resolves to an array of category objects.
 */
async function loadSkillsData(){
  const base = await fetchJSON('data/skills.json') || [];

  // Build Course Topics category from unique topics in coursework
  const cw   = await fetchJSON('data/coursework.json') || [];
  const set  = new Set();
  cw.forEach(c => (c.topics||[]).forEach(t => set.add(t)));
  const topics = [...set].sort().map(name => ({
    name,
    level: 3,         // default level
    keywords: []
  }));

  if (topics.length) {
    base.push({ category: 'Course Topics', items: topics });
  }
  return base;
}

async function init(){
  const data = await loadSkillsData();
  const wrap = byId('skillsList');

  function draw(){
    const q = byId('skillQ').value.trim();
    wrap.innerHTML = '';
    filterCats(data, q).forEach(c => wrap.appendChild(section(c)));
  }

  byId('skillQ').addEventListener('input', draw);
  byId('expandAll').addEventListener('click', () => $$('details').forEach(d => d.open = true));
  byId('collapseAll').addEventListener('click', () => $$('details').forEach(d => d.open = false));
  draw();
  if (location.hash) highlightAndScrollTo(location.hash);
  window.addEventListener('hashchange', () => highlightAndScrollTo(location.hash));
}

document.addEventListener('DOMContentLoaded', init);
