import { $, $$, byId, fetchJSON, slugify } from "./main.js";

// Skill row
function skillRow(s) {
  const row = document.createElement("div");
  row.className = "card";
  const level = Math.min(5, Math.max(0, s.level || 0));
  const pct = Math.round(level * 20);
  row.id = `skill-${slugify(s.name)}`;
  row.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px">
      <h3 style="margin:0">${s.name}</h3>
      <span class="small">Level ${level}/5</span>
    </div>
    <div class="progress" aria-label="Proficiency"><i style="width:${pct}%"></i></div>
    ${
      s.keywords?.length
        ? `<div class="chips" style="margin-top:10px">${s.keywords
            .map((k) => `<span class="chip">${k}</span>`)
            .join("")}</div>`
        : ""
    }
  `;
  return row;
}
// Category as <details> so Expand/Collapse All works
function categorySection(cat) {
  const det = document.createElement("details");
  det.className = "skill-cat";
  det.open = true;
  det.innerHTML = `
    <summary>${cat.category}<span class="small"></span></summary>
    <div class="grid"></div>
  `;
  const grid = det.querySelector(".grid");
  (cat.items || []).forEach((s) => grid.appendChild(skillRow(s)));
  det.querySelector(".small").textContent = ` (${(cat.items || []).length})`;
  return det;
}
function filterCats(cats, q) {
  if (!q) return cats;
  const t = q.toLowerCase();
  return cats
    .map((c) => ({
      ...c,
      items: (c.items || []).filter(
        (s) =>
          s.name.toLowerCase().includes(t) ||
          (s.keywords || []).join(" ").toLowerCase().includes(t)
      ),
    }))
    .filter((c) => c.items.length);
}
function focusHashTarget() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const el = byId(id);
  if (el) {
    el.classList.add("pulse");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => el.classList.remove("pulse"), 1400);
  }
}
// Load base skills + Course Topics from coursework.json
async function loadSkillsData() {
  const base = (await fetchJSON("data/skills.json")) || [];
  const cw = (await fetchJSON("data/coursework.json")) || [];
  const set = new Set();
  cw.forEach((c) => (c.topics || []).forEach((t) => set.add(t)));
  const topics = [...set]
    .sort()
    .map((name) => ({ name, level: 3, keywords: [] }));
  if (topics.length) base.push({ category: "Course Topics", items: topics });
  return base;
}
async function init() {
  const data = await loadSkillsData();
  if (!data) return;
  const wrap = byId("skillsList");
  function draw() {
    const q = byId("skillQ").value.trim();
    wrap.innerHTML = "";
    filterCats(data, q).forEach((c) => wrap.appendChild(categorySection(c)));
    focusHashTarget();
  }
  byId("skillQ")?.addEventListener("input", draw);
  byId("expandAll")?.addEventListener("click", () =>
    $$("details.skill-cat").forEach((d) => (d.open = true))
  );
  byId("collapseAll")?.addEventListener("click", () =>
    $$("details.skill-cat").forEach((d) => (d.open = false))
  );
  window.addEventListener("hashchange", focusHashTarget);
  draw();
}
document.addEventListener("DOMContentLoaded", init);
