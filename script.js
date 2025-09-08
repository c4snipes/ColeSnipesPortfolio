(() => {
  "use strict";

  const PATHS = {
    skills: "data/skills.json",
    projects: "data/projects.json",
    coursework: "data/coursework.json",
    achievements: "data/achievements.json",
  };

  // DOM refs
  const els = {
    year: document.getElementById("year"),
    nav: document.querySelector(".site-nav"),
    navToggle: document.querySelector(".nav-toggle"),
    tagRow: document.getElementById("project-tags"),
    search: document.getElementById("project-search"),
    projGrid: document.getElementById("projects-grid"),
    projEmpty: document.getElementById("projects-empty"),
    skillsGrid: document.getElementById("skills-grid"),
    courseList: document.getElementById("course-list"),
    achievementsList: document.getElementById("achievements-list"),
  };

  // Utilities
  const fmt = {
    dateISO: (s) => {
      // Accepts YYYY-MM or YYYY-MM-DD; returns Date
      if (!s) return null;
      const parts = s.split("-");
      const [y, m = "01", d = "01"] = parts;
      return new Date(Number(y), Number(m) - 1, Number(d));
    },
    relURL: (u) => {
      try { return new URL(u); } catch { return null; }
    },
    escapeHTML: (str) => str.replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])),
  };

  const state = {
    projects: [],
    activeTags: new Set(),
    search: "",
  };

  // Fetch JSON helper with nice errors
  async function loadJSON(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
    return res.json();
  }

  // ----- Render: Projects -----
  function computeAllTags(items) {
    const all = new Set();
    items.forEach(p => (p.tags || []).forEach(t => all.add(t)));
    return [...all].sort((a, b) => a.localeCompare(b));
  }

  function projectMatches(p) {
    const s = state.search.trim().toLowerCase();
    const tags = state.activeTags;
    if (tags.size) {
      const ptags = new Set(p.tags || []);
      for (const t of tags) {
        if (!ptags.has(t)) return false;
      }
    }
    if (!s) return true;
    const hay = [
      p.title || "",
      p.desc || "",
      ...(p.tags || [])
    ].join(" ").toLowerCase();
    return hay.includes(s);
  }

  function renderProjectCard(p) {
    const tagBadges = (p.tags || [])
      .map(t => `<span class="badge" aria-label="Tag: ${t}">${t}</span>`)
      .join(" ");

    const link = p.link && fmt.relURL(p.link) ? `<a class="btn" href="${p.link}" target="_blank" rel="noopener noreferrer">Visit</a>` : "";

    const when = p.date ? `<span>${p.date}</span>` : "";
    const tech = (p.tech || p.stack || []).length ? `<span>${(p.tech || p.stack).join(" • ")}</span>` : "";

    return `
      <article class="card" tabindex="0">
        <h3>${fmt.escapeHTML(p.title || "Untitled")}</h3>
        ${p.desc ? `<p>${fmt.escapeHTML(p.desc)}</p>` : ""}
        <div class="meta">${when}${when && tech ? " · " : ""}${tech}</div>
        ${tagBadges ? `<div class="meta" aria-label="Tags">${tagBadges}</div>` : ""}
        ${link ? `<div class="actions">${link}</div>` : ""}
      </article>
    `;
  }

  function renderProjects() {
    const filtered = state.projects.filter(projectMatches);
    els.projGrid.innerHTML = filtered.map(renderProjectCard).join("");
    els.projEmpty.classList.toggle("hidden", filtered.length > 0);
  }

  function renderProjectTags(allTags) {
    els.tagRow.innerHTML = allTags.map(t => `
      <button class="tag" type="button" role="option" aria-pressed="false" data-tag="${t}">${t}</button>
    `).join("");

    els.tagRow.addEventListener("click", (e) => {
      const btn = e.target.closest(".tag");
      if (!btn) return;
      const tag = btn.dataset.tag;
      if (state.activeTags.has(tag)) {
        state.activeTags.delete(tag);
        btn.setAttribute("aria-pressed", "false");
      } else {
        state.activeTags.add(tag);
        btn.setAttribute("aria-pressed", "true");
      }
      renderProjects();
    }, { passive: true });
  }

  // ----- Render: Skills -----
  function renderSkills(groups) {
    const cards = groups.map(g => `
      <article class="card">
        <h3>${fmt.escapeHTML(g.category)}</h3>
        ${g.items?.length ? `<ul>${g.items.map(i => `<li>${fmt.escapeHTML(i)}</li>`).join("")}</ul>` : ""}
      </article>
    `);
    els.skillsGrid.innerHTML = cards.join("");
  }

  // ----- Render: Coursework -----
  function renderCoursework(items) {
    const sorted = [...items].sort((a, b) => {
      const da = fmt.dateISO(a.when);
      const db = fmt.dateISO(b.when);
      if (da && db) return db - da;
      return String(b.term || "").localeCompare(String(a.term || ""));
    });

    els.courseList.innerHTML = sorted.map(c => {
      const code = [c.dept, c.code].filter(Boolean).join(" ");
      const title = c.course ? `${code}: ${c.course}` : code;
      const meta = [
        c.term || "",
        c.instructor ? `Instructor: ${c.instructor}` : ""
      ].filter(Boolean).join(" · ");

      const topics = Array.isArray(c.topics) && c.topics.length
        ? `<div class="meta">Topics: ${c.topics.join(" • ")}</div>` : "";

      return `
        <li>
          <span class="dot" aria-hidden="true"></span>
          <article class="card">
            <h3>${fmt.escapeHTML(title || "Course")}</h3>
            ${meta ? `<div class="meta">${fmt.escapeHTML(meta)}</div>` : ""}
            ${c.description ? `<p>${fmt.escapeHTML(c.description)}</p>` : ""}
            ${topics}
          </article>
        </li>
      `;
    }).join("");
  }

  // ----- Render: Achievements -----
  function renderAchievements(items) {
    const sorted = [...items].sort((a, b) => {
      const da = fmt.dateISO(a.date);
      const db = fmt.dateISO(b.date);
      if (da && db) return db - da;
      return 0;
    });

    els.achievementsList.innerHTML = sorted.map(a => {
      const title = a.title || "Achievement";
      const where = a.org || a.organization || "";
      const when = a.date || "";
      const details = a.details || a.description || "";

      return `
        <li>
          <article class="card">
            <h3>${fmt.escapeHTML(title)}</h3>
            <div class="meta">${[where, when].filter(Boolean).join(" · ")}</div>
            ${details ? `<p>${fmt.escapeHTML(details)}</p>` : ""}
          </article>
        </li>
      `;
    }).join("");
  }

  // ----- Bootstrapping -----
  async function init() {
    // Year
    if (els.year) els.year.textContent = String(new Date().getFullYear());

    // Mobile nav
    if (els.nav && els.navToggle) {
      els.navToggle.addEventListener("click", () => {
        const expanded = els.nav.getAttribute("aria-expanded") === "true";
        els.nav.setAttribute("aria-expanded", String(!expanded));
        els.navToggle.setAttribute("aria-expanded", String(!expanded));
      });
    }

    try {
      const [projects, skills, coursework, achievements] = await Promise.all([
        loadJSON(PATHS.projects),
        loadJSON(PATHS.skills),
        loadJSON(PATHS.coursework),
        loadJSON(PATHS.achievements),
      ]);

      // Projects
      state.projects = Array.isArray(projects) ? projects : [];
      renderProjects();
      renderProjectTags(computeAllTags(state.projects));
      els.search?.addEventListener("input", (e) => {
        state.search = e.target.value || "";
        renderProjects();
      });

      // Skills
      renderSkills(Array.isArray(skills) ? skills : []);

      // Coursework
      renderCoursework(Array.isArray(coursework) ? coursework : []);

      // Achievements
      renderAchievements(Array.isArray(achievements) ? achievements : []);
    } catch (err) {
      console.error(err);
      // Inline fault-tolerance so users see something useful
      const msg = `
        <div class="empty">
          Could not load one or more data files from <code>/workspaces/ColeSnipesPortfolio/data</code>.<br/>
          Ensure the JSON files exist and are served from that absolute path.
        </div>
      `;
      if (els.projGrid) els.projGrid.innerHTML = msg;
      if (els.skillsGrid) els.skillsGrid.innerHTML = msg;
      if (els.courseList) els.courseList.innerHTML = `<li>${msg}</li>`;
      if (els.achievementsList) els.achievementsList.innerHTML = `<li>${msg}</li>`;
      if (els.projEmpty) els.projEmpty.classList.add("hidden");
    }
  }

  // Start
  document.addEventListener("DOMContentLoaded", init, { once: true });
})();
