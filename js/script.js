
/** --------- CONFIG --------- */
const PATHS = {
  projects: "data/projects.json",
  skills: "data/skills.json",
  coursework: "data/coursework.json",
  achievements: "data/achievements.json",
};

const state = {
  projects: [],
  activeTags: new Set(),
  search: "",
  sort: "newest",
};

/** --------- HELPERS --------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

async function getJSON(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

function debounce(fn, ms = 150) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function intersectReveal(container) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "50px 0px", threshold: 0.1 }
  );
  container.querySelectorAll(".card").forEach((el) => io.observe(el));
}

/** --------- PROJECTS --------- */
function renderProjectCard(p, highlightTerms = []) {
  const tpl = $("#projectCardTpl");
  const node = tpl.content.firstElementChild.cloneNode(true);
  node.querySelector(".card-title").textContent = p.title;
  node.querySelector("time").textContent = fmtDate(p.date);
  node.querySelector("time").dateTime = p.date || "";
  node.querySelector(".card-desc").innerHTML = highlight(
    p.desc ?? "",
    highlightTerms
  );

  // tags
  const tagRow = node.querySelector(".tags");
  (p.tags || []).forEach((t) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.type = "button";
    chip.textContent = t;
    chip.setAttribute(
      "aria-pressed",
      state.activeTags.has(t) ? "true" : "false"
    );
    chip.addEventListener("click", () => toggleTag(t));
    tagRow.appendChild(chip);
  });

  // footer actions
  const open = node.querySelector(".btn");
  open.href = p.link || "#";
  open.addEventListener("click", (e) => {
    if (!p.link) e.preventDefault();
  });

  node.querySelector(".copy-btn").addEventListener("click", async () => {
    if (!p.link) return;
    try {
      await navigator.clipboard.writeText(p.link);
      toast("Link copied");
    } catch {
      toast("Copy failed");
    }
  });

  const expandBtn = node.querySelector(".expand-btn");
  const details = node.querySelector(".details");
  expandBtn.addEventListener("click", () => {
    const open = expandBtn.getAttribute("aria-expanded") === "true";
    expandBtn.setAttribute("aria-expanded", String(!open));
    details.hidden = open;
    if (!open)
      details.innerHTML = `<p class="muted small"><strong>Stack:</strong> ${(
        p.tags || []
      ).join(", ")}</p>`;
  });

  return node;
}

function allProjectTags(list) {
  const s = new Set();
  list.forEach((p) => (p.tags || []).forEach((t) => s.add(t)));
  return Array.from(s).sort((a, b) => a.localeCompare(b));
}

function highlight(text, terms) {
  if (!terms.length) return text;
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rx = new RegExp(`(${terms.map(esc).join("|")})`, "ig");
  return text.replace(rx, '<mark class="highlight">$1</mark>');
}

function toggleTag(tag) {
  if (state.activeTags.has(tag)) state.activeTags.delete(tag);
  else state.activeTags.add(tag);
  updateTagChipsUI();
  renderProjects();
}

function updateTagChipsUI() {
  // Update active state on chips in both the tag row and cards
  $$("#projectTags .chip").forEach((c) =>
    c.setAttribute("aria-pressed", String(state.activeTags.has(c.dataset.tag)))
  );
  $$(".project .tags .chip").forEach((c) =>
    c.setAttribute("aria-pressed", String(state.activeTags.has(c.textContent)))
  );
}

function applyProjectFilters() {
  const terms = state.search.toLowerCase().split(/\s+/).filter(Boolean);
  let list = state.projects.filter((p) => {
    const hay = [p.title, p.desc, (p.tags || []).join(" ")]
      .join(" ")
      .toLowerCase();
    const searchOK = terms.every((t) => hay.includes(t));
    const tagOK = state.activeTags.size
      ? (p.tags || []).some((t) => state.activeTags.has(t))
      : true;
    return searchOK && tagOK;
  });

  switch (state.sort) {
    case "az":
      list.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "za":
      list.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "tags":
      list.sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0));
      break;
    default:
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return { list, terms };
}

function renderProjects() {
  const grid = $("#projectsGrid");
  grid.innerHTML = "";
  const { list, terms } = applyProjectFilters();

  $("#projectCount").textContent = `${list.length} project${
    list.length !== 1 ? "s" : ""
  }`;

  list.forEach((p) => grid.appendChild(renderProjectCard(p, terms)));
  intersectReveal(grid);
}

async function loadProjects() {
  try {
    state.projects = await getJSON(PATHS.projects);
    // Tag chips
    const container = $("#projectTags");
    container.innerHTML = "";
    allProjectTags(state.projects).forEach((t) => {
      const btn = document.createElement("button");
      btn.className = "chip";
      btn.type = "button";
      btn.textContent = t;
      btn.dataset.tag = t;
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", () => toggleTag(t));
      container.appendChild(btn);
    });
    renderProjects();
  } catch (err) {
    showError(
      "#projectsError",
      `Could not load projects from <code>${PATHS.projects}</code> — ${err.message}. Ensure the JSON file exists at that relative path.`
    );
  }
}

/** --------- SKILLS --------- */
function skillBar(percent) {
  const wrap = document.createElement("div");
  wrap.className = "progress";
  const span = document.createElement("span");
  span.style.width = Math.min(100, Math.max(0, percent)) + "%";
  wrap.appendChild(span);
  return wrap;
}

function renderSkills(groups) {
  const host = $("#skillsList");
  host.innerHTML = "";
  groups.forEach((group) => {
    const box = document.createElement("section");
    box.className = "skill-cat";

    const head = document.createElement("button");
    head.className = "skill-head";
    head.type = "button";
    head.setAttribute("aria-expanded", "true");
    head.innerHTML = `<strong>${group.category}</strong><span class="muted small">${group.items.length} skills</span>`;

    const items = document.createElement("div");
    items.className = "skill-items";

    group.items.forEach((s) => {
      const row = document.createElement("div");
      row.className = "skill";
      const label = document.createElement("div");
      label.className = "label";
      label.innerHTML = `<span>${s.name}</span><span class="muted small">Level ${s.level}/5</span>`;
      row.appendChild(label);
      row.appendChild(skillBar((s.level || 0) * 20));
      items.appendChild(row);
    });

    head.addEventListener("click", () => {
      const open = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", String(!open));
      items.style.display = open ? "none" : "grid";
    });

    box.appendChild(head);
    box.appendChild(items);
    host.appendChild(box);
  });
}

async function loadSkills() {
  try {
    const groups = await getJSON(PATHS.skills);
    renderSkills(groups);
    $("#skillsExpandAll").addEventListener("click", () =>
      $$(".skill-head").forEach((h) => {
        h.setAttribute("aria-expanded", "true");
        h.nextElementSibling.style.display = "grid";
      })
    );
    $("#skillsCollapseAll").addEventListener("click", () =>
      $$(".skill-head").forEach((h) => {
        h.setAttribute("aria-expanded", "false");
        h.nextElementSibling.style.display = "none";
      })
    );
  } catch (err) {
    showError(
      "#skillsError",
      `Could not load skills from <code>${PATHS.skills}</code> — ${err.message}.`
    );
  }
}

/** --------- COURSEWORK --------- */
function groupByTerm(list) {
  const m = new Map();
  list.forEach((c) => {
    const key = c.term || c.semester || "Other";
    if (!m.has(key)) m.set(key, []);
    m.get(key).push(c);
  });
  return Array.from(m.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .reverse(); // newest-ish first if terms are ISO-like (e.g., 2024 Fall)
}

function renderCoursework(list) {
  const host = $("#courseTimeline");
  host.innerHTML = "";

  const groups = groupByTerm(list);
  groups.forEach(([term, items]) => {
    const wrap = document.createElement("section");
    wrap.className = "time-group";

    const head = document.createElement("div");
    head.className = "time-head";
    head.innerHTML = `<strong>${term}</strong><span class="muted small">${
      items.length
    } course${items.length !== 1 ? "s" : ""}</span>`;

    const ul = document.createElement("div");
    ul.className = "time-list";

    items.forEach((c) => {
      const row = document.createElement("article");
      row.className = "course";
      row.innerHTML = `<div><h4>${c.code ?? ""} ${
        c.title ?? ""
      }</h4><p class="muted small">${
        c.desc ?? ""
      }</p></div><div class="right"><div>${c.institution ?? ""}</div><div>${
        c.year ?? ""
      }</div></div>`;
      ul.appendChild(row);
    });

    wrap.appendChild(head);
    wrap.appendChild(ul);
    host.appendChild(wrap);
  });
}

async function loadCoursework() {
  try {
    const all = await getJSON(PATHS.coursework);
    let current = all;
    const input = $("#courseSearch");
    input.addEventListener(
      "input",
      debounce(() => {
        const q = input.value.toLowerCase().trim();
        current = all.filter((c) =>
          `${c.code} ${c.title} ${c.desc}`.toLowerCase().includes(q)
        );
        renderCoursework(current);
      }, 120)
    );
    renderCoursework(current);
  } catch (err) {
    showError(
      "#courseError",
      `Could not load coursework from <code>${PATHS.coursework}</code> — ${err.message}.`
    );
  }
}

/** --------- ACHIEVEMENTS --------- */
function renderAchievements(list) {
  const grid = $("#achievementsGrid");
  grid.innerHTML = "";
  list.forEach((a) => {
    const card = document.createElement("article");
    card.className = "card revealed";
    card.innerHTML = `<div class="card-body"><div class="card-header"><h3 class="card-title">${
      a.title
    }</h3><time class="card-meta" datetime="${a.date || ""}">${fmtDate(
      a.date
    )}</time></div><p class="card-desc">${
      a.desc ?? ""
    }</p><p class="muted small">${
      a.issuer ?? a.org ?? ""
    }</p></div><footer class="card-footer">${
      a.url
        ? `<a class="btn" target="_blank" rel="noopener" href="${a.url}">View</a>`
        : "<span></span>"
    }</footer>`;
    grid.appendChild(card);
  });
}

async function loadAchievements() {
  try {
    const list = await getJSON(PATHS.achievements);
    renderAchievements(list);
  } catch (err) {
    showError(
      "#achievementsError",
      `Could not load achievements from <code>${PATHS.achievements}</code> — ${err.message}.`
    );
  }
}

/** --------- UX / CHROME --------- */
function toast(msg, ms = 1600) {
  let t = document.createElement("div");
  t.textContent = msg;
  Object.assign(t.style, {
    position: "fixed",
    bottom: "18px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "var(--surface)",
    color: "var(--text)",
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #ffffff22",
    boxShadow: "var(--shadow)",
    zIndex: 9999,
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), ms);
}

function showError(sel, html) {
  const el = $(sel);
  el.hidden = false;
  el.innerHTML = html;
}

function initTheme() {
  const pref =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark");
  if (pref === "light") document.documentElement.classList.add("light");
  $("#themeToggle").setAttribute("aria-pressed", String(pref === "light"));
  $("#themeToggle").addEventListener("click", () => {
    document.documentElement.classList.toggle("light");
    const isLight = document.documentElement.classList.contains("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    $("#themeToggle").setAttribute("aria-pressed", String(isLight));
  });
}

function initNav() {
  const btn = $("#navToggle");
  const list = $("#navList");
  btn.addEventListener("click", () => {
    const open = list.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  // Close on link click (mobile)
  $$("#navList a").forEach((a) =>
    a.addEventListener("click", () => list.classList.remove("open"))
  );
}

function initProjectsUI() {
  $("#projectSearch").addEventListener(
    "input",
    debounce((e) => {
      state.search = e.target.value;
      renderProjects();
    })
  );
  $("#projectSort").addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderProjects();
  });
}

function initFooterYear() {
  $("#year").textContent = new Date().getFullYear();
}

/** --------- BOOT --------- */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNav();
  initProjectsUI();
  initFooterYear();

  loadProjects();
  loadSkills();
  loadCoursework();
  loadAchievements();
});
