// /js/projects.js
// Loads projects from data/projects.json and wires up search, tag filters, and sorting.
// No frameworks, just modern DOM APIs.

(function () {
  "use strict";

  // ---------- DOM lookups with safe fallbacks ----------
  const $ = (sel) => document.querySelector(sel);
  const grid =
    document.getElementById("projectsGrid") ||
    $('[data-projects-grid]');
  const searchInput =
    document.getElementById("projectsSearch") ||
    $('[data-projects-search]');
  const sortSelect =
    document.getElementById("projectsSort") ||
    $('[data-projects-sort]');
  const clearBtn =
    document.getElementById("projectsClear") ||
    $('[data-projects-clear]');
  const tagsBar =
    document.getElementById("projectsTags") ||
    $('[data-projects-tags]');

  if (!grid) {
    console.warn("projects.js: #projectsGrid (or [data-projects-grid]) not found.");
    return;
  }

  // ---------- State ----------
  let all = [];
  let activeTags = new Set();

  // ---------- Fetch & init ----------
  fetch("data/projects.json")
    .then((r) => {
      if (!r.ok) throw new Error(r.status + " " + r.statusText);
      return r.json();
    })
    .then((rows) => {
      // Normalize and keep only fields we actually use.
      all = rows.map((p, i) => ({
        id: i,
        title: p.title || "",
        desc: p.desc || p.description || "",
        date: p.date || "",
        link: p.link || p.url || "#",
        repo: p.repo || "",
        tags: Array.isArray(p.tags) ? p.tags : [],
        image: p.image || p.img || ""
      }));

      buildTags(all);
      render(all);
      wire();
    })
    .catch((err) => {
      showEmpty("Could not load projects. Make sure <code>data/projects.json</code> exists and is being served from the same origin.");
      console.error(err);
    });

  // ---------- UI builders ----------
  function buildTags(list) {
    if (!tagsBar) return;
    const uniques = [...new Set(list.flatMap((p) => p.tags))].sort(
      (a, b) => a.localeCompare(b)
    );
    tagsBar.innerHTML = "";
    uniques.forEach((tag) => {
      const chip = document.createElement("button");
      chip.className = "chip";
      chip.type = "button";
      chip.textContent = tag;
      chip.setAttribute("data-tag", tag);
      tagsBar.appendChild(chip);
    });
  }

  function render(list) {
    grid.innerHTML = "";

    if (!list.length) {
      showEmpty("No projects match your filters.");
      return;
    }

    const frag = document.createDocumentFragment();
    list.forEach((p) => {
      const card = document.createElement("article");
      card.className = "card project-card";
      card.innerHTML = `
        <div class="card-body">
          <header class="card-title">${escapeHTML(p.title)}</header>
          <p class="card-desc">${escapeHTML(p.desc)}</p>
          ${p.tags && p.tags.length ? `<div class="tags">${p.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>` : ""}
          <div class="card-actions">
            ${p.link ? `<a class="btn" href="${encodeURI(p.link)}" target="_blank" rel="noopener">Live</a>` : ""}
            ${p.repo ? `<a class="btn secondary" href="${encodeURI(p.repo)}" target="_blank" rel="noopener">Code</a>` : ""}
          </div>
        </div>
      `;
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  function showEmpty(message) {
    grid.innerHTML = `<div class="empty">${message}</div>`;
  }

  // ---------- Interactions ----------
  function wire() {
    // Search
    if (searchInput) {
      const handler = () => update();
      searchInput.addEventListener("input", handler);
    }

    // Sort
    if (sortSelect) {
      sortSelect.addEventListener("change", update);
    }

    // Clear
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        activeTags.clear();
        if (tagsBar) tagsBar.querySelectorAll(".chip.active").forEach((b) => b.classList.remove("active"));
        if (searchInput) searchInput.value = "";
        if (sortSelect) sortSelect.value = "dateDesc";
        render(sorted(all));
      });
    }

    // Tag chips
    if (tagsBar) {
      tagsBar.addEventListener("click", (e) => {
        const btn = e.target.closest("button.chip");
        if (!btn) return;
        const tag = btn.getAttribute("data-tag");
        if (btn.classList.toggle("active")) activeTags.add(tag);
        else activeTags.delete(tag);
        update();
      });
    }
  }

  function update() {
    const q = (searchInput && searchInput.value.trim().toLowerCase()) || "";
    const base = all.filter((p) => {
      const inTags = !activeTags.size || p.tags.some((t) => activeTags.has(t));
      if (!inTags) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.tags.join(" ").toLowerCase().includes(q)
      );
    });
    render(sorted(base));
  }

  function sorted(list) {
    const mode = (sortSelect && sortSelect.value) || "dateDesc";
    const copy = list.slice();
    switch (mode) {
      case "dateAsc":
        copy.sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
        break;
      case "titleAsc":
        copy.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "titleDesc":
        copy.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default: // "dateDesc"
        copy.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    }
    return copy;
  }

  // ---------- utils ----------
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();