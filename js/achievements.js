import { byId, fetchJSON, formatDate } from './main.js';

function card(a){
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <h3>${a.title}</h3>
    <div class="meta"><span>${a.issuer||''}</span><span class="dot"></span><span>${a.year||''}</span></div>
    <p>${a.details||''}</p>
    ${a.link ? `<a class="inline" href="${a.link}" target="_blank" rel="noopener">Learn more</a>` : ''}
  `;
  return el;
}

async function init(){
  const list = byId('achievements');
  const data = await fetchJSON('data/achievements.json');
  if(!data) return;
  list.innerHTML = '';
  data.forEach(a => list.appendChild(card(a)));
}
document.addEventListener('DOMContentLoaded', init);
