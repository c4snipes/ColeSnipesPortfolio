// /js/achievements.js
// Loads achievements from data/achievements.json

(function () {
  "use strict";
  const $ = (sel) => document.querySelector(sel);
  const list =
    document.getElementById("achievementsList") ||
    $('[data-achievements-list]');

  if (!list) {
    console.warn("achievements.js: #achievementsList (or [data-achievements-list]) not found.");
    return;
  }

  fetch("data/achievements.json")
    .then((r) => {
      if (!r.ok) throw new Error(r.status + " " + r.statusText);
      return r.json();
    })
    .then((rows) => {
      render(rows || []);
    })
    .catch((err) => {
      list.innerHTML = `<div class="empty">Could not load achievements. Check <code>data/achievements.json</code>.</div>`;
      console.error(err);
    });

  function render(items) {
    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = `<div class="empty">No achievements yet.</div>`;
      return;
    }
    const frag = document.createDocumentFragment();
    items.forEach((a) => {
      const el = document.createElement("article");
      el.className = "card";
      el.innerHTML = `
        <div class="card-body">
          <header class="card-title">${escapeHTML(a.title || "")}</header>
          <div class="muted">${escapeHTML(a.issuer || "")}${a.year ? " · " + escapeHTML(a.year) : ""}</div>
          <p class="card-desc">${escapeHTML(a.details || "")}</p>
          ${a.link ? `<a class="btn" href="${encodeURI(a.link)}" target="_blank" rel="noopener">Learn more</a>` : ""}
        </div>
      `;
      frag.appendChild(el);
    });
    list.appendChild(frag);
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();