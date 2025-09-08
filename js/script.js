/* ===================== Theme & small utils ===================== */
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// If you ever move JSON into /data elsewhere, set this in HTML first:
// <script>window.DATA_ROOT = "../data/";</script>
const DATA_ROOT = window.DATA_ROOT || "../data/";

const root = document.documentElement;
const THEME_KEY = "prefers-dark";
const saved = localStorage.getItem(THEME_KEY);
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
root.dataset.theme = saved ? saved : (prefersDark ? "dark" : "light");

$("#themeToggle")?.addEventListener("click", () => {
  const dark = root.dataset.theme !== "dark";
  root.dataset.theme = dark ? "dark" : "light";
  localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
});

$("#year") && ($("#year").textContent = new Date().getFullYear());

async function j(url, fallback = []) {
  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(url);
    return await r.json();
  } catch {
    console.warn("Failed to load", url);
    return fallback;
  }
}

/* Copy email button */
$("#copyEmail")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("cole.snipes@icloud.com");
    const toast = $("#copyToast");
    toast?.classList.remove("hidden");
    setTimeout(() => toast?.classList.add("hidden"), 1400);
  } catch {}
});

/* ---------- Robust resume link resolver ---------- */
(async () => {
  const a = document.getElementById('resumeLink');
  if (!a) return;

  const candidates = [
    '../assets/Cole_Snipes_Resume.pdf',
    './assets/Cole_Snipes_Resume.pdf',
    '../assets/resume.pdf',
    './assets/resume.pdf'
  ];

  for (const p of candidates) {
    try {
      const r = await fetch(p, { method: 'HEAD', cache: 'no-store' });
      if (r.ok) {
        a.href = p;
        a.target = '_blank';
        a.rel = 'noopener';
        return;
      }
    } catch {}
  }
  // Fallback if not found
  a.href = 'mailto:cole.snipes@icloud.com?subject=Resume%20Request';
})();

/* ===================== Tabs (menu controls sections) ===================== */
const TABS = ["projects","skills","coursework","achievements","about","contact"];
function showTab(id) {
  TABS.forEach(t => {
    const el = document.getElementById(t);
    if (el) el.classList.toggle("hidden", t !== id);
  });
  $$('.nav a[href^="#"]').forEach(a => {
    const match = a.getAttribute("href").slice(1) === id;
    a.classList.toggle("active", match);
    a.setAttribute("aria-selected", match ? "true" : "false");
  });
  document.getElementById(id)?.focus({preventScroll:true});
}
document.querySelectorAll('.nav a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href").slice(1);
    if (TABS.includes(id)) {
      e.preventDefault();
      history.replaceState(null, "", `#${id}`);
      showTab(id);
    }
  });
});
window.addEventListener("DOMContentLoaded", () => {
  const id = location.hash?.slice(1);
  showTab(TABS.includes(id) ? id : "projects");
});

/* ===================== Projects ===================== */
const P = {
  grid: $("#projectGrid"),
  tagBar: $("#tagBar"),
  search: $("#search"),
  sort: $("#sort"),
  empty: $("#emptyState"),
  stats: $("#projectStats"),
  state: { q: "", tag: "All", sort: "recent" },
  items: []
};

// Highlight search terms
function highlight(text) {
  const q = (P.search?.value || '').trim();
  if (!q) return text;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
  return text.replace(re, '<mark>$1</mark>');
}

// Expand/collapse details
function attachExpanders(container) {
  container.querySelectorAll('[data-expand]').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.closest('.card')?.querySelector('.card-more');
      if (!body) return;
      body.classList.toggle('hidden');
      btn.textContent = body.classList.contains('hidden') ? 'More' : 'Less';
    });
  });
}

// Modal image viewer
const modal = (() => {
  const overlay = document.createElement('div');
  overlay.className = 'modal hidden';
  overlay.innerHTML = `
    <div class="modal-box">
      <button class="btn tiny" data-close>Close</button>
      <img alt="">
    </div>`;
  document.body.appendChild(overlay);

  function close() { overlay.classList.add('hidden'); }
  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.hasAttribute('data-close')) close();
  });
  window.addEventListener('keydown', e => {
    if (!overlay.classList.contains('hidden') && e.key === 'Escape') close();
  });

  return {
    show(src, alt='Project preview') {
      overlay.querySelector('img').src = src;
      overlay.querySelector('img').alt = alt;
      overlay.classList.remove('hidden');
    }
  };
})();

function renderProjectTags(tags) {
  P.tagBar.innerHTML = "";
  tags.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    if (t === P.state.tag) li.classList.add("active");
    li.addEventListener("click", () => {
      P.state.tag = t;
      renderProjectTags(tags);
      applyProjectFilters();
    });
    P.tagBar.appendChild(li);
  });
}

function renderProjects(list) {
  P.grid.innerHTML = "";
  if (!list.length) {
    P.empty.classList.remove("hidden");
    P.stats.textContent = "";
    return;
  }
  P.empty.classList.add("hidden");
  P.stats.textContent = `${list.length} shown • ${P.items.length} total`;

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";

    const thumb = p.image ? `<img class="thumb" src="${p.image}" alt="${p.title} screenshot">` : "";
    const more  = Array.isArray(p.more) && p.more.length
      ? `<div class="card-more hidden"><ul class="meta">${p.more.map(m => `<li>${m}</li>`).join("")}</ul></div>`
      : "";

    card.innerHTML = `
      ${thumb}
      <h3>${highlight(p.title)}</h3>
      <p>${highlight(p.desc)}</p>
      <ul class="meta">${(p.tags||[]).map(t => `<li data-tag="${t}">${t}</li>`).join("")}</ul>
      <div class="row">
        <a class="btn small" href="${p.link}" target="_blank" rel="noopener noreferrer">Repo</a>
        ${p.image ? `<button class="btn small outline" data-view="${p.image}">View</button>` : ""}
        ${more ? `<button class="btn small outline" data-expand>More</button>` : ""}
      </div>
      ${more}
    `;
    P.grid.appendChild(card);
  });

  // tag click inside cards to filter
  P.grid.querySelectorAll('li[data-tag]').forEach(li => {
    li.addEventListener('click', () => {
      P.state.tag = li.dataset.tag;
      const tags = ["All", ...new Set(P.items.flatMap(p => p.tags || []))].sort();
      renderProjectTags(tags);
      applyProjectFilters();
    });
  });
  // wire modal + expanders
  P.grid.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => modal.show(b.dataset.view)));
  attachExpanders(P.grid);
}

function applyProjectFilters() {
  let list = [...P.items];
  const { q, tag, sort } = P.state;

  if (q) {
    const needle = q.toLowerCase();
    list = list.filter(p =>
      p.title.toLowerCase().includes(needle) ||
      p.desc.toLowerCase().includes(needle) ||
      (p.tags||[]).some(t => t.toLowerCase().includes(needle))
    );
  }
  if (tag !== "All") list = list.filter(p => (p.tags||[]).includes(tag));
  if (sort === "recent") list.sort((a,b) => new Date(b.date) - new Date(a.date));
  else list.sort((a,b) => a.title.localeCompare(b.title));

  renderProjects(list);
}

async function loadProjects() {
  P.items = await j(`${DATA_ROOT}projects.json`, []);
  const tags = ["All", ...new Set(P.items.flatMap(p => p.tags || []))].sort();
  renderProjectTags(tags);
  applyProjectFilters();

  P.search?.addEventListener("input", e => { P.state.q = e.target.value; applyProjectFilters(); });
  P.sort?.addEventListener("change", e => { P.state.sort = e.target.value; applyProjectFilters(); });
}

/* ===================== Skills (from skills.json only) ===================== */
async function loadSkills() {
  const skillsWrap = $("#skillsWrap");
  const cats = await j(`${DATA_ROOT}skills.json`, []);
  skillsWrap.innerHTML = "";

  cats.forEach(cat => {
    const card = document.createElement("div");
    card.className = "skill-card";
    card.innerHTML = `<h3>${cat.category}</h3>`;
    const list = document.createElement("div");
    list.className = "skill-list";

    (cat.items || []).forEach(it => {
      const row = document.createElement("div");
      row.className = "skill-row";
      const lvl = Math.max(0, Math.min(5, Number(it.level) || 0)) * 20;

      row.innerHTML = `
        <div class="skill-name">${it.name}</div>
        <div class="skill-bar"><div class="skill-fill" style="width:${lvl}%"></div></div>
        <div class="skill-level">Level ${it.level} / 5</div>
      `;

      if (it.keywords?.length) {
        const kws = document.createElement("ul");
        kws.className = "meta";
        kws.style.marginTop = "6px";
        kws.innerHTML = it.keywords.map(k => `<li>${k}</li>`).join("");
        row.appendChild(kws);
      }

      if (it.projects?.length) {
        const uses = document.createElement("div");
        uses.className = "muted";
        uses.style.fontSize = "12px";
        uses.style.marginTop = "2px";
        uses.textContent = `Used in: ${it.projects.join(" • ")}`;
        row.appendChild(uses);
      }

      list.appendChild(row);
    });

    card.appendChild(list);
    skillsWrap.appendChild(card);
  });
}

/* ===================== Coursework (Overview + Timeline) ===================== */
const courseChips    = $("#courseworkChips");
const courseTimeline = $("#courseTimeline");
const toggleOverview = $("#courseToggleOverview");
const toggleTimeline = $("#courseToggleTimeline");

function showOverview() {
  courseChips.classList.remove("hidden");
  courseTimeline.classList.add("hidden");
  toggleOverview?.classList.remove("outline");
  toggleOverview?.setAttribute("aria-selected","true");
  toggleTimeline?.classList.add("outline");
  toggleTimeline?.setAttribute("aria-selected","false");
}
function showTimeline() {
  courseChips.classList.add("hidden");
  courseTimeline.classList.remove("hidden");
  toggleTimeline?.classList.remove("outline");
  toggleTimeline?.setAttribute("aria-selected","true");
  toggleOverview?.classList.add("outline");
  toggleOverview?.setAttribute("aria-selected","false");
}

function renderCourseworkOverview(data) {
  courseChips.innerHTML = "";
  data.forEach(c => {
    const li = document.createElement("li");
    li.title = `${c.code} • ${c.term}`;
    li.textContent = c.course;
    courseChips.appendChild(li);
  });
}

function renderCourseworkTimeline(data) {
  courseTimeline.innerHTML = "";

  const chronological = [...data].sort((a,b) => new Date(a.when) - new Date(b.when));
  const groups = chronological.reduce((acc, cur) => {
    acc[cur.term] = acc[cur.term] || [];
    acc[cur.term].push(cur);
    return acc;
  }, {});

  Object.entries(groups).forEach(([term, list]) => {
    const section = document.createElement("section");
    section.className = "t-section";
    section.innerHTML = `<h3 class="t-term">${term}</h3>`;
    const ol = document.createElement("ol");
    ol.className = "t-list";

    list.forEach(c => {
      const li = document.createElement("li");
      li.className = "t-item";
      const topics = c.topics?.length ? `<ul class="meta">${c.topics.map(t => `<li>${t}</li>`).join("")}</ul>` : "";
      const link = c.link ? `<a href="${c.link}" target="_blank" rel="noopener noreferrer" class="btn tiny">Repo</a>` : "";
      li.innerHTML = `
        <div class="t-head">
          <strong>${c.code}</strong> — ${c.course}
          ${c.type ? `<span class="chip">${c.type}</span>` : ""}
          ${link}
        </div>
        ${topics}
      `;
      ol.appendChild(li);
    });

    section.appendChild(ol);
    courseTimeline.appendChild(section);
  });
}

async function loadCoursework() {
  const data = await j(`${DATA_ROOT}coursework.json`, []);
  renderCourseworkOverview(data);
  renderCourseworkTimeline(data);
  showOverview();
  toggleOverview?.addEventListener("click", showOverview);
  toggleTimeline?.addEventListener("click", showTimeline);
}

/* ===================== Achievements ===================== */
async function loadAchievements() {
  const el = $("#achievementList");
  const items = await j(`${DATA_ROOT}achievements.json`, []);
  el.innerHTML = "";
  items.forEach(a => {
    const right = [a.issuer, a.year].filter(Boolean).join(" • ");
    const details = a.details ? ` — ${a.details}` : "";
    const li = document.createElement("li");
    li.innerHTML = `<strong>${a.title}</strong>${right ? ` <span class="muted">(${right})</span>` : ""}${details}`;
    el.appendChild(li);
  });
}

/* ===================== Boot ===================== */
loadProjects();
loadSkills();
loadCoursework();
loadAchievements();
