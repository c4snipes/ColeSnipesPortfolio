/* global $ */
$(async function () {
  let list = [];
  try {
    list = await $.getJSON("data/coursework.json");
  } catch (e) {
    $("#cwError").removeClass("hide");
    return;
  }

  const $search = $("#cwSearch");
  const $type   = $("#cwType");
  const $out    = $("#cwTimeline");

  function render(){
    const q = ($search.val() || "").toLowerCase().trim();
    const t = $type.val();

    const groups = {};
    list.forEach(row => {
      if (t && row.type !== t) return;
      const text = `${row.course} ${row.code} ${(row.topics||[]).join(" ")} ${row.term} ${row.when}`.toLowerCase();
      if (q && !text.includes(q)) return;
      const key = `${row.term} • ${row.when}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });

    $out.empty();
    Object.entries(groups)
      .sort((a,b) => a[0].localeCompare(b[0]))
      .forEach(([term, rows]) => {
        const $section = $('<section class="term"/>').append(`<h4>${term}</h4>`);
        rows.forEach(r => {
          const $course = $('<div class="course"/>').append(`
            <div>
              <div><strong>${r.course}</strong> <span class="code">(${r.code})</span></div>
              <div class="topics">${(r.topics||[]).map(x=>`<span class="badge">${x}</span>`).join(" ")}</div>
            </div>
            <div class="muted">${r.type}</div>
          `);
          $section.append($course);
        });
        $out.append($section);
      });

    if (!$out.children().length) $out.html('<p class="muted">No results.</p>');
  }

  $search.on("input", render);
  $type.on("change", render);
  render();
});
