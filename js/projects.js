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

  // Normalize dates (support bare years like "2023") and make defensive defaults
  projects = projects.map(p => ({
    ...p,
    // ensure date string exists, support bare years, and fall back to epoch on invalid dates
    _date: (() => {
      const raw = p && p.date != null ? String(p.date) : "";
      if (raw && raw.length <= 4) return new Date(`${raw}-12-31`);
      const dt = new Date(p && p.date != null ? p.date : 0);
      return isNaN(dt) ? new Date(0) : dt;
    })(),
    // ensure title/desc are at least empty strings so callers don't crash
    title: p && p.title != null ? p.title : "",
    desc: p && p.desc != null ? p.desc : "",
    tags: Array.isArray(p && p.tags) ? p.tags : (p && p.tags ? [p.tags] : [])
  }));

  // Build tag list
  const allTags = [...new Set(projects.flatMap(p => p.tags || []))]
    .sort((a, b) => String(a).localeCompare(String(b)));
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
    if (v === "date-desc") list.sort((a,b)=> +b._date - +a._date);
    else if (v === "date-asc") list.sort((a,b)=> +a._date - +b._date);
    else if (v === "title-asc") list.sort((a,b)=> String(a.title || "").localeCompare(String(b.title || "")));
    else if (v === "title-desc") list.sort((a,b)=> String(b.title || "").localeCompare(String(a.title || "")));
    return list;
  }

  const hl = (text, q) => {
    const safeText = text == null ? "" : String(text);
    if (!q) return safeText;
    const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return safeText.replace(new RegExp(`(${esc})`,"ig"), "<mark>$1</mark>");
  };

  function render() {
    const q = ($search.val() || "").trim();
    const needle = q.toLowerCase();

    let list = projects.filter(p => {
      const title = String(p.title || "");
      const desc = String(p.desc || "");
      const tags = Array.isArray(p.tags) ? p.tags : [];

      const matchesQ =
        !needle ||
        title.toLowerCase().includes(needle) ||
        desc.toLowerCase().includes(needle) ||
        tags.some(t => String(t || "").toLowerCase().includes(needle));
      const matchesTags =
        activeTags.size === 0 || tags.some(t => activeTags.has(t));
      return matchesQ && matchesTags;
    });

    sortItems(list);
    $grid.empty();

    list.forEach(p => {
      const $card = $('<article class="card"/>');
      $card.append(`<h3>${hl(p.title || "", q)}</h3>`);
      $card.append(`<p class="muted">${hl(p.desc || "", q)}</p>`);

      const $meta = $('<div class="meta"/>');
      (p.tags||[]).forEach(t => $meta.append(`<span class="badge">${hl(t || "", q)}</span>`));
      $meta.append(`<span class="badge">${p.date ?? ""}</span>`);
      $card.append($meta);

      const $footer = $("<footer/>");
      // guard link attribute output
      const safeLink = p.link ? String(p.link) : "#";
      $footer.append(`<a class="btn" href="${safeLink}" target="_blank" rel="noopener">Open</a>`);
      const $more = $('<button type="button" class="btn btn-outline">Details</button>')
        .on("click", () => openModal(p));
      $footer.append($more);
      $card.append($footer);

      $grid.append($card);
    });

    // Reveal animation (feature-check IntersectionObserver)
    if (typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver((ents) => {
        ents.forEach(ent => {
          if (ent.isIntersecting) {
            ent.target.classList.add("show");
            io.unobserve(ent.target);
          }
        });
      }, { threshold: .12, rootMargin: "0px 0px -10% 0px" });

      document.querySelectorAll("#projectGrid .card").forEach(n => io.observe(n));
    } else {
      // fallback: just show all cards immediately
      document.querySelectorAll("#projectGrid .card").forEach(n => n.classList.add("show"));
    }
  }

  function openModal(p) {
    const dlg = document.getElementById("projectModal");
    // If there's no dialog in DOM, gracefully fallback to an alert
    if (!dlg) {
      const tags = (p.tags||[]).join(", ");
      alert(`${p.title || ""}\n\n${p.desc || ""}\n\nTags: ${tags}\nDate: ${p.date || ""}\nLink: ${p.link || ""}`);
      return;
    }

    $("#modalTitle").text(p.title || "");
    $("#modalBody").html(`
      <p>${p.desc || ""}</p>
      ${(p.tags||[]).map(t=>`<span class="badge">${t}</span>`).join(" ")}
      <p class="muted" style="margin-top:8px">Date: ${p.date || ""}</p>
    `);

    const $link = $("#modalLink");
    if (p.link) { $link.attr("href", p.link).text("Open Project").show(); }
    else       { $link.attr("href", "#").text("No link").hide(); }

    $("#copyLink").off("click").on("click", async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(p.link || "");
        } else {
          // fallback copy for older browsers: use textarea + legacy exec method via bracket access
          const ta = document.createElement("textarea");
          ta.value = p.link || "";
          document.body.appendChild(ta);
          ta.select();
          try {
            // Access execCommand via bracket to avoid deprecated API signature warnings in type-checkers
            if (document['execCommand']) document['execCommand']('copy');
          } catch (e) {
            // ignore
          }
          document.body.removeChild(ta);
        }
        alert("Link copied!");
      } catch {
        alert("Could not copy link.");
      }
    });

    $("#closeModal").off("click").on("click", () => {
      try { dlg.close(); } catch (e) { /* ignore */ }
    });

    try {
      if (typeof dlg.showModal === "function") dlg.showModal();
      else dlg.style.display = "block";
    } catch (e) {
      // ignore if showModal fails
      dlg.style.display = "block";
    }
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
