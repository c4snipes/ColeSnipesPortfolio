// Shared utilities – no jQuery, vanilla only
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

function byId(id){ return document.getElementById(id); }

// Keyboard shortcut: "/" focuses the first input on the page
window.addEventListener('keydown', (e)=>{
  if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
    const firstInput = $('input');
    if (firstInput){ e.preventDefault(); firstInput.focus(); }
  }
});

// Current year
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

async function fetchJSON(path){
  try{
    const res = await fetch(path, {cache: "no-cache"});
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

function chip(text){
  const el = document.createElement('span');
  el.className = 'chip';
  el.textContent = text;
  return el;
}

function formatDate(iso){
  // supports "YYYY" or "YYYY-MM"
  const [y,m] = iso.split('-');
  if (!m) return y;
  return new Date(`${iso}-01T00:00:00`).toLocaleString(undefined, {year:'numeric', month:'short'});
}

export { $, $$, byId, fetchJSON, chip, formatDate };
