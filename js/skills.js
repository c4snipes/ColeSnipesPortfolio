// /js/skills.js
// Loads and renders grouped skills from data/skills.json

(function () {
  "use strict";
  const $ = (sel) => document.querySelector(sel);
  const container =
    document.getElementById("skillsContainer") ||
    $('[data-skills-container]');

  if (!container) {
    console.warn("skills.js: #skillsContainer (or [data-skills-container]) not found.");
    return;
  }

  fetch("data/skills.json")
    .then((r) => {
      if (!r.ok) throw new Error(r.status + " " + r.statusText);
      return r.json();
    })
    .then((data) => {
      // Expecting: [{ category: string, items: [{ name, level?, keywords?, projects? }] }]
      render(data);
      container.addEventListener("click", (e) => {
        const btn = e.target.closest("button.skill-toggle");
        if (!btn) return;
        const panel = btn.closest(".skill-group").querySelector(".skill-list");
        panel.hidden = !panel.hidden;
        btn.setAttribute("aria-expanded", String(!panel.hidden));
      });
    })
    .catch((err) => {
      container.innerHTML = `<div class="empty">Could not load skills. Check <code>data/skills.json</code>.</div>`;
      console.error(err);
    });

  function render(groups) {
    container.innerHTML = "";
    const frag = document.createDocumentFragment();
    (groups || []).forEach((g) => {
      const group = document.createElement("section");
      group.className = "skill-group";
      const items = (g.items || []).map((s) => `
        <li>
          <div class="skill">
            <span class="skill-name">${escapeHTML(s.name || "")}</span>
            ${s.level ? `<span class="pill">${escapeHTML(s.level)}</span>` : ""}
          </div>
          ${s.keywords?.length ? `<div class="muted small">${escapeHTML(s.keywords.join(", "))}</div>` : ""}
        </li>`).join("");

      group.innerHTML = `
        <header class="group-header">
          <h3>${escapeHTML(g.category || "Skills")}</h3>
          <button class="skill-toggle" aria-expanded="true" type="button">Toggle</button>
        </header>
        <ul class="skill-list">${items}</ul>
      `;
      frag.appendChild(group);
    });
    container.appendChild(frag);
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