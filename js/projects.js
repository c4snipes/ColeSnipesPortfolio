/* global $ */
$(async function () {
  const $grid  = $("#projectGrid");
  const $tagBar = $("#tagBar");
  const $search = $("#search");
  const $sort   = $("#sort");
  const $clear  = $("#clearFilters");

  // Load JSON
  let projects = [];
  try {
    projects = await $.getJSON("data/projects.json");
  } catch (e) {
    $("#dataError").removeClass("hide");
    return;
  }

  // Normalize dates (support bare years like "2023")
  projects = projects.map(p => ({
    ...p,
    _date: new Date(String(p.date).length <= 4 ? `${p.date}-12-31` : p.date)
  }));

  // Build tag list
  const allTags = [...new Set(projects.flatMap(p => p.tags || []))]
    .sort((a, b) => a.localeCompare(b));
  const activeTags = new Set();

  function renderTags() {
    $tagBar.empty();
    allTags.forEach(tag => {
      const $b = $('<button/>', {
        class: `tag${activeTags.has(tag) ? " active" : ""}`,
        text: tag
      }).on("click", () => {
        activeTags.has(tag) ? activeTags.delete(tag) : activeTags.add(tag);
        render(); renderTags();
      });
      $tagBar.append($b);
    });
  }

  function sortItems(list) {
    const v = $sort.val();
    if (v === "date-desc") list.sort((a,b)=> b._date - a._date);
    else if (v === "date-asc") list.sort((a,b)=> a._date - b._date);
    else if (v === "title-asc") list.sort((a,b)=> a.title.localeCompare(b.title));
    else if (v === "title-desc") list.sort((a,b)=> b.title.localeCompare(a.title));
    return list;
  }

  const hl = (text, q) => {
    if (!q) return text;
    const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp(`(${esc})`,"ig"), "<mark>$1</mark>");
  };

  function render() {
    const q = ($search.val() || "").trim();
    const needle = q.toLowerCase();

    let list = projects.filter(p => {
      const matchesQ =
        !needle ||
        p.title.toLowerCase().includes(needle) ||
        (p.desc||"").toLowerCase().includes(needle) ||
        (p.tags||[]).some(t => t.toLowerCase().includes(needle));
      const matchesTags =
        activeTags.size === 0 || (p.tags||[]).some(t => activeTags.has(t));
      return matchesQ && matchesTags;
    });

    sortItems(list);
    $grid.empty();

    list.forEach(p => {
      const $card = $('<article class="card"/>');
      $card.append(`<h3>${hl(p.title, q)}</h3>`);
      $card.append(`<p class="muted">${hl(p.desc || "", q)}</p>`);

      const $meta = $('<div class="meta"/>');
      (p.tags||[]).forEach(t => $meta.append(`<span class="badge">${hl(t, q)}</span>`));
      $meta.append(`<span class="badge">${p.date}</span>`);
      $card.append($meta);

      const $footer = $("<footer/>");
      $footer.append(`<a class="btn" href="${p.link}" target="_blank" rel="noopener">Open</a>`);
      const $more = $('<button type="button" class="btn btn-outline">Details</button>')
        .on("click", () => openModal(p));
      $footer.append($more);
      $card.append($footer);

      $grid.append($card);
    });

    // Reveal animation
    const io = new IntersectionObserver((ents) => {
      ents.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add("show");
          io.unobserve(ent.target);
        }
      });
    }, { threshold: .12, rootMargin: "0px 0px -10% 0px" });

    document.querySelectorAll("#projectGrid .card").forEach(n => io.observe(n));
  }

  function openModal(p) {
    const dlg = document.getElementById("projectModal");
    $("#modalTitle").text(p.title);
    $("#modalBody").html(`
      <p>${p.desc || ""}</p>
      ${(p.tags||[]).map(t=>`<span class="badge">${t}</span>`).join(" ")}
      <p class="muted" style="margin-top:8px">Date: ${p.date}</p>
    `);

    const $link = $("#modalLink");
    if (p.link) { $link.attr("href", p.link).text("Open Project").show(); }
    else       { $link.attr("href", "#").text("No link").hide(); }

    $("#copyLink").off("click").on("click", async () => {
      try { await navigator.clipboard.writeText(p.link || ""); alert("Link copied!"); }
      catch { alert("Could not copy link."); }
    });

    $("#closeModal").off("click").on("click", () => dlg.close());
    dlg.showModal();
  }

  $search.on("input", render);
  $sort.on("change", render);
  $clear.on("click", () => {
    $search.val("");
    activeTags.clear();
    $sort.val("date-desc");
    renderTags(); render();
  });

  renderTags();
  render();
});
