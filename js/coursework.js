// /js/coursework.js
// Loads courses from data/coursework.json and supports search + type filter.

(function () {
  "use strict";
  const $ = (sel) => document.querySelector(sel);

  const list =
    document.getElementById("courseworkList") ||
    $('[data-coursework-list]');
  const searchInput =
    document.getElementById("courseworkSearch") ||
    $('[data-coursework-search]');
  const typeSelect =
    document.getElementById("courseworkType") ||
    $('[data-coursework-type]');

  if (!list) {
    console.warn("coursework.js: #courseworkList (or [data-coursework-list]) not found.");
    return;
  }

  let all = [];

  fetch("data/coursework.json")
    .then((r) => {
      if (!r.ok) throw new Error(r.status + " " + r.statusText);
      return r.json();
    })
    .then((rows) => {
      all = rows.map((c) => ({
        code: c.code || "",
        title: c.title || "",
        type: c.type || "course",
        year: c.year || "",
        desc: c.desc || c.description || "",
        topics: Array.isArray(c.topics) ? c.topics : []
      }));
      render(all);
      wire();
    })
    .catch((err) => {
      list.innerHTML = `<div class="empty">Could not load coursework. Check <code>data/coursework.json</code>.</div>`;
      console.error(err);
    });

  function render(rows) {
    list.innerHTML = "";
    if (!rows.length) {
      list.innerHTML = `<div class="empty">No courses match your filters.</div>`;
      return;
    }
    const frag = document.createDocumentFragment();
    rows.forEach((c) => {
      const el = document.createElement("article");
      el.className = "card";
      el.innerHTML = `
        <div class="card-body">
          <header class="card-title">
            ${escapeHTML(c.code)} · ${escapeHTML(c.title)}
            <span class="pill">${escapeHTML(c.type)}</span>
          </header>
          <p class="card-desc">${escapeHTML(c.desc)}</p>
          ${c.topics?.length ? `<div class="tags">${c.topics.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>` : ""}
        </div>
      `;
      frag.appendChild(el);
    });
    list.appendChild(frag);
  }

  function wire() {
    const update = () => {
      const q = (searchInput && searchInput.value.trim().toLowerCase()) || "";
      const type = (typeSelect && typeSelect.value) || "all";

      const filtered = all.filter((c) => {
        const inType = type === "all" || c.type === type;
        if (!inType) return false;
        if (!q) return true;
        return (
          c.code.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q) ||
          c.topics.join(" ").toLowerCase().includes(q)
        );
      });
      render(filtered);
    };

    if (searchInput) searchInput.addEventListener("input", update);
    if (typeSelect) typeSelect.addEventListener("change", update);
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