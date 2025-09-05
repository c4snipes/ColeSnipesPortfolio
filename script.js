/* ===================== Theme & small utils ===================== */
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

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

/* Copy email button (nice-to-have) */
$("#copyEmail")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("cole.snipes@icloud.com");
    const toast = $("#copyToast");
    toast?.classList.remove("hidden");
    setTimeout(() => toast?.classList.add("hidden"), 1400);
  } catch {}
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
    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <ul class="meta">${(p.tags||[]).map(t => `<li data-tag="${t}">${t}</li>`).join("")}</ul>
      <a class="btn small" href="${p.link}" target="_blank" rel="noopener">Repo</a>
    `;
    P.grid.appendChild(card);
  });
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
  P.items = await j("projects.json", []);
  const tags = ["All", ...new Set(P.items.flatMap(p => p.tags || []))].sort();
  renderProjectTags(tags);
  applyProjectFilters();

  P.search?.addEventListener("input", e => { P.state.q = e.target.value; applyProjectFilters(); });
  P.sort?.addEventListener("change", e => { P.state.sort = e.target.value; applyProjectFilters(); });

  P.grid.addEventListener("click", e => {
    const li = e.target.closest("li[data-tag]");
    if (!li) return;
    P.state.tag = li.dataset.tag;
    renderProjectTags(tags);
    applyProjectFilters();
  });
}

/* ===================== Skills (from skills.json only) ===================== */
async function loadSkills() {
  const skillsWrap = $("#skillsWrap");
  const cats = await j("skills.json", []);
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
const courseChips   = $("#courseworkChips");
const courseTimeline = $("#courseTimeline");
const toggleOverview = $("#courseToggleOverview");
const toggleTimeline = $("#courseToggleTimeline");

function showOverview() {
  courseChips.classList.remove("hidden");
  courseTimeline.classList.add("hidden");
  toggleOverview.classList.remove("outline");
  toggleOverview.setAttribute("aria-selected","true");
  toggleTimeline.classList.add("outline");
  toggleTimeline.setAttribute("aria-selected","false");
}
function showTimeline() {
  courseChips.classList.add("hidden");
  courseTimeline.classList.remove("hidden");
  toggleTimeline.classList.remove("outline");
  toggleTimeline.setAttribute("aria-selected","true");
  toggleOverview.classList.add("outline");
  toggleOverview.setAttribute("aria-selected","false");
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

  // group by term, in chronological order using "when"
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
      const link = c.link ? `<a href="${c.link}" target="_blank" rel="noopener" class="btn tiny">Repo</a>` : "";
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
  const data = await j("coursework.json", []);
  renderCourseworkOverview(data);
  renderCourseworkTimeline(data);

  // default view: Overview
  showOverview();
  toggleOverview?.addEventListener("click", showOverview);
  toggleTimeline?.addEventListener("click", showTimeline);
}

/* ===================== Achievements ===================== */
async function loadAchievements() {
  const el = $("#achievementList");
  const items = await j("achievements.json", []);
  el.innerHTML = "";
  items.forEach(a => {
    const li = document.createElement("li");
    const right = [a.issuer, a.year].filter(Boolean).join(" • ");
    const details = a.details ? ` — ${a.details}` : "";
    li.innerHTML = `<strong>${a.title}</strong>${right ? ` <span class="muted">(${right})</span>` : ""}${details}`;
    el.appendChild(li);
  });
}

/* ===================== Run all loaders ===================== */
loadProjects();
loadSkills();
loadCoursework();
loadAchievements();
