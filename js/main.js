// Shared utilities – vanilla only
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
const byId = (id) => document.getElementById(id);

// Keyboard: "/" focuses first input
window.addEventListener('keydown', (e)=>{
  if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
    const first = $('input'); if (first){ e.preventDefault(); first.focus(); }
  }
});

// Footer year
document.addEventListener('DOMContentLoaded', () => {
  const y = byId('year'); if (y) y.textContent = new Date().getFullYear();
});

// Robust JSON loader
async function fetchJSON(path){
  try{
    const res = await fetch(path, { cache: "no-cache" });
    if(!res.ok) throw new Error(`HTTP ${res.status} while fetching ${path}`);
    return await res.json();
  }catch(err){
    console.error(err);
    const msg = document.createElement('div');
    msg.className = 'card';
    msg.innerHTML = `
      <h3>Could not load data</h3>
      <p class="small">Tried to fetch <span class="kbd">${path}</span>.</p>
      <p class="small">${err.message}</p>`;
    document.querySelector('main.container')?.appendChild(msg);
    return null;
  }
}

// Chips
function chip(text, href){
  const el = document.createElement(href ? 'a' : 'span');
  el.className = 'chip';
  el.textContent = text;
  if (href) el.href = href;
  return el;
}

// Dates & slugs
function formatDate(iso){
  if (!iso) return '';
  const [y,m] = String(iso).split('-');
  if (!m) return y;
  return new Date(`${iso}-01T00:00:00`).toLocaleString(undefined, {year:'numeric', month:'short'});
}
function slugify(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

// -------- THEME SYSTEM --------
const THEME_KEY = 'site-theme';
const THEMES = ['dark','light','solar'];

function detectSystemTheme(){
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
function getSavedTheme(){ return localStorage.getItem(THEME_KEY); }

function applyTheme(theme){
  const val = THEMES.includes(theme) ? theme : 'dark';
  document.documentElement.setAttribute('data-theme', val);
  localStorage.setItem(THEME_KEY, val);

  const btn = byId('themeToggle');
  if (btn){
    const label = val.charAt(0).toUpperCase() + val.slice(1);
    btn.setAttribute('aria-pressed', String(val !== 'dark'));
    btn.dataset.theme = val;
    btn.innerHTML = (val === 'light')
      ? `<span class="icon">☀️</span><span>Light</span>`
      : (val === 'solar')
        ? `<span class="icon">🌅</span><span>Solar</span>`
        : `<span class="icon">🌙</span><span>Dark</span>`;
    btn.title = `Theme: ${label} (press to change)`;
  }
}

function cycleTheme(){
  const current = document.documentElement.getAttribute('data-theme') || getSavedTheme() || detectSystemTheme() || 'dark';
  const idx = THEMES.indexOf(current);
  const next = THEMES[(idx + 1) % THEMES.length];
  applyTheme(next);
}

// Initialize theme + wire toggle
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getSavedTheme() || detectSystemTheme());

  const toggle = byId('themeToggle');
  if (toggle){
    toggle.addEventListener('click', cycleTheme);
    toggle.addEventListener('keydown', (e)=>{ if (e.key===' '||e.key==='Enter'){ e.preventDefault(); cycleTheme(); }});
  }
});

export { $, $$, byId, fetchJSON, chip, formatDate, slugify, applyTheme, cycleTheme };
