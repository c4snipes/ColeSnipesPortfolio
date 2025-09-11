// Global utilities (vanilla only)
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
const byId = (id) => document.getElementById(id);

// Keyboard: "/" focuses first input (nice QOL on list pages)
window.addEventListener('keydown', (e) => {
  if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
    const first = $('input');
    if (first) { e.preventDefault(); first.focus(); }
  }
});

// Footer year
document.addEventListener('DOMContentLoaded', () => {
  const y = byId('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Robust JSON loader with a friendly error card
async function fetchJSON(path){
  try{
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${path}`);
    return await res.json();
  }catch(err){
    console.error(err);
    const box = document.createElement('div');
    box.className = 'card';
    box.innerHTML = `
      <h3>Could not load data</h3>
      <p class="small">Tried to fetch <span class="kbd">${path}</span>.</p>
      <p class="small">${err.message}</p>`;
    document.querySelector('main.container')?.appendChild(box);
    return null;
  }
}

// Make a tag look like a chip (span or link)
function chip(text, href){
  const el = document.createElement(href ? 'a' : 'span');
  el.className = 'chip';
  el.textContent = text;
  if (href) { el.href = href; }
  return el;
}

// Date helpers
function formatDate(iso){
  // supports "YYYY" or "YYYY-MM"
  if (!iso) return '';
  const [y,m] = String(iso).split('-');
  if (!m) return y;
  return new Date(`${iso}-01T00:00:00`).toLocaleString(undefined, { month:'short', year:'numeric' });
}

// Slug (for linking chips -> Skills anchors)
function slugify(s){
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

export { $, $$, byId, fetchJSON, chip, formatDate, slugify };
