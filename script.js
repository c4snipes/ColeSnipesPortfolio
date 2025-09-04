;(() => {
  "use strict";
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
  const root = document.documentElement;
  const themeKey = "prefers-dark";
  const savedTheme = localStorage.getItem(themeKey);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = savedTheme ? savedTheme : prefersDark ? "dark" : "light";
  on($("#themeToggle"), "click", () => {
    const d = root.dataset.theme !== "dark";
    root.dataset.theme = d ? "dark" : "light";
    localStorage.setItem(themeKey, d ? "dark" : "light");
  });
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
  const copyBtn = $("#copyEmail"), toast = $("#copyToast");
  on(copyBtn, "click", async () => {
    try {
      await navigator.clipboard.writeText("cole.snipes@icloud.com");
      toast && toast.classList.remove("hidden");
      setTimeout(() => toast && toast.classList.add("hidden"), 1400);
    } catch {}
  });
  function j(u, d) {
    return fetch(u, { cache: "no-store" }).then(r => (r.ok ? r.json() : d)).catch(() => d);
  }
  const grid = $("#projectGrid"), tagBar = $("#tagBar"), search = $("#search"), sortSel = $("#sort"), empty = $("#emptyState"), stats = $("#projectStats");
  const defaultProjects = [
    {"title":"Bluetooth Attendance Application","desc":"Reliable attendance via Bluetooth scanning with export tools and a focused UI.","tags":["Python","Threads","CSV"],"link":"https://github.com/c4snipes/BluetoothAttendanceApplication","date":"2025-06-01"},
    {"title":"Budget Manager","desc":"CLI budgeting tool in Rust with clear data models and fast workflows.","tags":["Rust","CLI","Serde"],"link":"https://github.com/c4snipes/budget_manager","date":"2025-05-20"},
    {"title":"Obesity Risk Prediction","desc":"ML models predicting obesity levels using lifestyle features with EDA and evaluation.","tags":["Python","Pandas","ML"],"link":"https://github.com/c4snipes?tab=repositories","date":"2024-11-10"},
    {"title":"Password Manager (Testing)","desc":"Selenium suite for a course password manager project with automatic test coverage.","tags":["Python","Selenium","CI"],"link":"https://github.com/c4snipes/swen320_2024S_password_manager_EllerSnipes_automatictesting","date":"2024-04-15"},
    {"title":"Spring Boot Showcase","desc":"REST API experiments with minimal config and clean structure.","tags":["Java","Spring Boot","REST"],"link":"https://github.com/c4snipes/gs-spring-boot","date":"2024-03-01"},
    {"title":"Portfolio Site","desc":"This site. Lightweight, accessible, and fast. Built with semantic HTML and modern CSS.","tags":["HTML","CSS","Responsive"],"link":"https://github.com/c4snipes/ColeSnipesPortfolio","date":"2025-09-04"}
  ];
  const stateKey = "portfolio-state";
  let state = { q: "", tag: "All", sort: "recent" };
  try {
    const s = JSON.parse(localStorage.getItem(stateKey) || "{}");
    state = { ...state, ...s };
  } catch {}
  function saveState() {
    localStorage.setItem(stateKey, JSON.stringify({ q: state.q, tag: state.tag, sort: state.sort }));
  }
  function getHash() {
    const p = new URLSearchParams(location.hash.slice(1));
    return { q: p.get("q") || "", tag: p.get("tag") || "All", sort: p.get("sort") || "recent" };
  }
  function setHash() {
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.tag && state.tag !== "All") p.set("tag", state.tag);
    if (state.sort && state.sort !== "recent") p.set("sort", state.sort);
    const s = p.toString();
    location.hash = s ? "#" + s : "";
  }
  let projects = [], tags = [];
  function dedupeTags(arr) {
    return [...new Set(arr.flatMap(p => p.tags))].sort();
  }
  function renderTags() {
    if (!tagBar) return;
    tagBar.innerHTML = "";
    const all = document.createElement("li");
    all.textContent = "All";
    if (state.tag === "All") all.className = "active";
    tagBar.appendChild(all);
    tags.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      if (t === state.tag) li.classList.add("active");
      tagBar.appendChild(li);
    });
  }
  function renderProjects(list) {
    if (!grid) return;
    grid.innerHTML = "";
    if (!list.length) {
      empty && empty.classList.remove("hidden");
      stats && (stats.textContent = "");
      return;
    }
    empty && empty.classList.add("hidden");
    list.forEach(p => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `<h3>${p.title}</h3><p>${p.desc}</p><ul class="meta">${p.tags.map(t => `<li data-tag="${t}">${t}</li>`).join("")}</ul><a class="btn small" href="${p.link}" target="_blank" rel="noopener">Repo</a>`;
      grid.appendChild(card);
    });
    stats && (stats.textContent = list.length + " shown • " + projects.length + " total");
  }
  function applyFilters() {
    let list = projects.slice();
    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (state.tag && state.tag !== "All") list = list.filter(p => p.tags.includes(state.tag));
    if (state.sort === "recent") list.sort((a, b) => new Date(b.date) - new Date(a.date));
    else list.sort((a, b) => a.title.localeCompare(b.title));
    renderProjects(list);
  }
  function hydrateControls() {
    if (search) search.value = state.q;
    if (sortSel) sortSel.value = state.sort;
  }
  function onTagClick(e) {
    const el = e.target;
    if (el.tagName !== "LI") return;
    $$("#tagBar li").forEach(n => n.classList.remove("active"));
    el.classList.add("active");
    state.tag = el.textContent;
    setHash();
    saveState();
    applyFilters();
  }
  function onSearch(e) {
    state.q = e.target.value;
    setHash();
    saveState();
    applyFilters();
  }
  function onSort(e) {
    state.sort = e.target.value;
    setHash();
    saveState();
    applyFilters();
  }
  on(tagBar, "click", onTagClick);
  on(search, "input", onSearch);
  on(sortSel, "change", onSort);
  on(window, "hashchange", () => {
    state = { ...state, ...getHash() };
    hydrateControls();
    renderTags();
    applyFilters();
  });
  j("projects.json", []).then(d => {
    projects = Array.isArray(d) && d.length ? d : defaultProjects;
    tags = dedupeTags(projects);
    state = { ...state, ...getHash() };
    hydrateControls();
    renderTags();
    applyFilters();
    on(grid, "click", e => {
      const li = e.target.closest("li[data-tag]");
      if (!li) return;
      state.tag = li.dataset.tag;
      setHash();
      saveState();
      renderTags();
      applyFilters();
    });
  });
  const skillsWrap = $("#skillsWrap");
  const defaultSkills = [
    {
      "category": "Programming Languages",
      "items": [
        { "name": "C/C++", "level": 4, "since": "2023", "last_used": "2025", "keywords": ["STL","OOP","memory","pointers"], "projects": ["Algorithms coursework","Knights Tour Solver","Sudoku Solver"] },
        { "name": "Python", "level": 5, "since": "2022", "last_used": "2025", "keywords": ["Pandas","NumPy","scikit-learn","Selenium"], "projects": ["Obesity Risk Prediction","Password Manager Testing","Bluetooth Attendance Application"] },
        { "name": "Java", "level": 4, "since": "2023", "last_used": "2025", "keywords": ["OOP","Spring Boot"], "projects": ["Spring Boot Showcase"] },
        { "name": "JavaScript", "level": 3, "since": "2023", "last_used": "2025", "keywords": ["DOM","fetch","modules"], "projects": ["Portfolio Site"] },
        { "name": "Rust", "level": 2, "since": "2024", "last_used": "2025", "keywords": ["ownership","borrowing","cargo"], "projects": ["Budget Manager"] },
        { "name": "SQL", "level": 4, "since": "2023", "last_used": "2025", "keywords": ["joins","indexes","normalization"], "projects": ["RateMyProfessor-style app","Coursework"] },
        { "name": "Bash", "level": 3, "since": "2023", "last_used": "2025", "keywords": ["scripts","cli","automation"], "projects": ["Local tooling"] }
      ]
    },
    {
      "category": "Frameworks & Libraries",
      "items": [
        { "name": "Spring Boot", "level": 3, "since": "2024", "last_used": "2025", "keywords": ["REST","controllers","JPA"], "projects": ["Spring Boot Showcase"] },
        { "name": "Django", "level": 3, "since": "2023", "last_used": "2024", "keywords": ["ORM","templates","auth"], "projects": ["Learning repos"] },
        { "name": "Pandas", "level": 5, "since": "2022", "last_used": "2025", "keywords": ["EDA","wrangling","merge","groupby"], "projects": ["Obesity Risk Prediction","Gun Violence Analysis"] },
        { "name": "NumPy", "level": 4, "since": "2022", "last_used": "2025", "keywords": ["arrays","vectorization"], "projects": ["ML pipelines"] }
      ]
    },
    {
      "category": "Data Science & ML",
      "items": [
        { "name": "scikit-learn", "level": 4, "since": "2023", "last_used": "2025", "keywords": ["LogReg","RandomForest","train/test","metrics"], "projects": ["Obesity Risk Prediction"] },
        { "name": "Matplotlib", "level": 3, "since": "2023", "last_used": "2025", "keywords": ["plots","visualization"], "projects": ["Analysis notebooks"] },
        { "name": "Feature Engineering", "level": 3, "since": "2023", "last_used": "2025", "keywords": ["encoding","scaling","selection"], "projects": ["ML pipelines"] },
        { "name": "Statistical Interpretation", "level": 3, "since": "2023", "last_used": "2025", "keywords": ["correlation","R²","p-values"], "projects": ["Gun Violence Analysis"] }
      ]
    },
    {
      "category": "Web & Backend",
      "items": [
        { "name": "REST APIs", "level": 4, "since": "2023", "last_used": "2025", "keywords": ["HTTP","JSON","routing"], "projects": ["Spring Boot Showcase","Portfolio Site"] },
        { "name": "Auth Tokens", "level": 3, "since": "2023", "last_used": "2024", "keywords": ["JWT","sessions"], "projects": ["Coursework"] },
        { "name": "HTTP", "level": 4, "since": "2023", "last_used": "2025", "keywords": ["status codes","headers"], "projects": ["APIs","testing"] },
        { "name": "JSON", "level": 5, "since": "2022", "last_used": "2025", "keywords": ["schema","parsing"], "projects": ["Projects data","APIs"] },
        { "name": "WebSockets", "level": 2, "since": "2024", "last_used": "2024", "keywords": ["real-time"], "projects": ["Experiments"] }
      ]
    },
    {
      "category": "Databases",
      "items": [
        { "name": "MySQL", "level": 4, "since": "2023", "last_used": "2025", "keywords": ["DDL","DML","indexes"], "projects": ["RateMyProfessor-style app","Coursework"] },
        { "name": "SQLite", "level": 3, "since": "2023", "last_used": "2025", "keywords": ["embedded","migrations"], "projects": ["Utilities"] },
        { "name": "MongoDB", "level": 3, "since": "2024", "last_used": "2025", "keywords": ["documents","aggregation"], "projects": ["RMP migration"] },
        { "name": "phpMyAdmin", "level": 3, "since": "2023", "last_used": "2024", "keywords": ["admin","queries"], "projects": ["Coursework"] }
      ]
    },
    {
      "category": "Testing & QA",
      "items": [
        { "name": "Unit Testing", "level": 4, "since": "2023", "last_used": "2025", "keywords": ["TDD","fixtures"], "projects": ["Multiple repos"] },
        { "name": "Integration Testing", "level": 3, "since": "2023", "last_used": "2025", "keywords": ["services","I/O"], "projects": ["Coursework"] },
        { "name": "System Testing", "level": 3, "since": "2023", "last_used": "2024", "keywords": ["end-to-end"], "projects": ["Coursework"] },
        { "name": "Automation", "level": 3, "since": "2023", "last_used": "2024", "keywords": ["scripts","CI"], "projects": ["Testing project"] },
        { "name": "pytest", "level": 4, "since": "2023", "last_used": "2025", "keywords": ["parametrize","mocks"], "projects": ["Python repos"] },
        { "name": "JUnit", "level": 3, "since": "2024", "last_used": "2025", "keywords": ["assertions"], "projects": ["Spring Boot Showcase"] },
        { "name": "Selenium", "level": 3, "since": "2024", "last_used": "2024", "keywords": ["browser","selectors"], "projects": ["Password Manager Testing"] }
      ]
    },
    {
      "category": "DevOps & Tools",
      "items": [
        { "name": "Git", "level": 4, "since": "2022", "last_used": "2025", "keywords": ["branching","PRs","rebases"], "projects": ["All"] },
        { "name": "Docker", "level": 3, "since": "2024", "last_used": "2025", "keywords": ["images","compose"], "projects": ["Local dev"] },
        { "name": "GitHub Actions", "level": 3, "since": "2024", "last_used": "2025", "keywords": ["CI","workflows"], "projects": ["Automation"] },
        { "name": "VS Code", "level": 5, "since": "2020", "last_used": "2025", "keywords": ["extensions","tasks"], "projects": ["All"] },
        { "name": "Replit", "level": 4, "since": "2022", "last_used": "2024", "keywords": ["quick protos"], "projects": ["Prototypes"] },
        { "name": "Google Colab", "level": 4, "since": "2022", "last_used": "2025", "keywords": ["notebooks","GPU"], "projects": ["ML notebooks"] }
      ]
    },
    {
      "category": "Systems & OS",
      "items": [
        { "name": "Linux", "level": 4, "since": "2022", "last_used": "2025", "keywords": ["shell","processes"], "projects": ["Daily dev"] },
        { "name": "Threads & Concurrency", "level": 3, "since": "2024", "last_used": "2025", "keywords": ["locks","queues"], "projects": ["Bluetooth Attendance Application"] },
        { "name": "Operating Systems", "level": 3, "since": "2023", "last_used": "2024", "keywords": ["scheduling","memory"], "projects": ["Coursework"] },
        { "name": "Parallel Computing", "level": 2, "since": "2024", "last_used": "2024", "keywords": ["architecture"], "projects": ["Coursework"] }
      ]
    },
    {
      "category": "UI/UX & Frontend",
      "items": [
        { "name": "HTML5", "level": 4, "since": "2021", "last_used": "2025", "keywords": ["semantic","a11y"], "projects": ["Portfolio Site"] },
        { "name": "CSS3", "level": 4, "since": "2021", "last_used": "2025", "keywords": ["responsive","grid","flex"], "projects": ["Portfolio Site"] },
        { "name": "Responsive Design", "level": 4, "since": "2022", "last_used": "2025", "keywords": ["mobile-first"], "projects": ["Portfolio Site"] },
        { "name": "Accessibility", "level": 3, "since": "2023", "last_used": "2025", "keywords": ["contrast","keyboard"], "projects": ["Portfolio Site"] }
      ]
    },
    {
      "category": "Core CS Topics",
      "items": [
        { "name": "Data Structures & Algorithms", "level": 4, "since": "2023", "last_used": "2025", "keywords": ["trees","graphs","heaps"], "projects": ["C++ projects","Coursework"] },
        { "name": "Complexity Analysis", "level": 3, "since": "2023", "last_used": "2025", "keywords": ["Big-O","proofs"], "projects": ["Algorithms"] },
        { "name": "Object-Oriented Design", "level": 4, "since": "2023", "last_used": "2025", "keywords": ["encapsulation","patterns"], "projects": ["Java/C++ work"] },
        { "name": "Database Systems", "level": 3, "since": "2023", "last_used": "2025", "keywords": ["ERD","normal forms"], "projects": ["RMP app"] },
        { "name": "Software Testing", "level": 4, "since": "2023", "last_used": "2025", "keywords": ["coverage","assertions"], "projects": ["Testing repos"] },
        { "name": "Big Data Mining", "level": 2, "since": "2024", "last_used": "2024", "keywords": ["pipelines"], "projects": ["Coursework"] }
      ]
    },
    {
      "category": "Soft Skills",
      "items": [
        { "name": "Collaboration", "level": 5, "since": "2020", "last_used": "2025", "keywords": ["cross-functional","teamwork"], "projects": ["Team projects"] },
        { "name": "Communication", "level": 4, "since": "2020", "last_used": "2025", "keywords": ["written","verbal"], "projects": ["Docs","presentations"] },
        { "name": "Time Management", "level": 4, "since": "2020", "last_used": "2025", "keywords": ["prioritization"], "projects": ["Course + work balance"] },
        { "name": "Documentation", "level": 4, "since": "2021", "last_used": "2025", "keywords": ["readme","specs"], "projects": ["Repos"] },
        { "name": "Problem Solving", "level": 5, "since": "2020", "last_used": "2025", "keywords": ["analysis","troubleshooting"], "projects": ["All"] },
        { "name": "Root Cause Analysis", "level": 4, "since": "2023", "last_used": "2025", "keywords": ["debugging"], "projects": ["Testing","automation"] },
        { "name": "Leadership", "level": 3, "since": "2021", "last_used": "2024", "keywords": ["mentoring"], "projects": ["Team assignments"] }
      ]
    }
  ];
  function buildSkillTitle(it) {
    const k = it.keywords && it.keywords.length ? " • " + it.keywords.join(", ") : "";
    const s = it.since ? " • since " + it.since : "";
    const lu = it.last_used ? " • last used " + it.last_used : "";
    const pr = it.projects && it.projects.length ? " • " + it.projects.join(" | ") : "";
    return (it.name + k + s + lu + pr).trim();
  }
  function renderSkills(data) {
    if (!skillsWrap) return;
    skillsWrap.innerHTML = "";
    data.forEach(cat => {
      const card = document.createElement("div");
      card.className = "skill-card";
      const list = document.createElement("div");
      list.className = "skill-list";
      const h = document.createElement("h3");
      h.textContent = cat.category;
      card.appendChild(h);
      cat.items.forEach(it => {
        const row = document.createElement("div");
        row.className = "skill-row";
        row.title = buildSkillTitle(it);
        const name = document.createElement("div");
        name.className = "skill-name";
        name.textContent = it.name;
        const bar = document.createElement("div");
        bar.className = "skill-bar";
        const fill = document.createElement("div");
        fill.className = "skill-fill";
        fill.dataset.w = Math.max(0, Math.min(5, Number(it.level) || 0)) * 20;
        bar.appendChild(fill);
        const lvl = document.createElement("div");
        lvl.className = "skill-level";
        lvl.textContent = "Level " + (it.level || 0) + " / 5";
        row.appendChild(name);
        row.appendChild(bar);
        row.appendChild(lvl);
        list.appendChild(row);
      });
      card.appendChild(list);
      skillsWrap.appendChild(card);
    });
    animateBars();
  }
  function animateBars() {
    const fills = $$(".skill-fill");
    if (!fills.length) return;
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          const w = e.target.dataset.w || 0;
          e.target.style.width = w + "%";
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    fills.forEach(f => {
      f.style.width = "0%";
      io.observe(f);
    });
  }
  j("skills.json", []).then(d => renderSkills(Array.isArray(d) && d.length ? d : defaultSkills));
})();
