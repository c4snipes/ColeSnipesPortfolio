/* global $ */
$(async function () {
  let list = [];
  try {
    list = await $.getJSON("data/achievements.json");
  } catch (e) {
    $("#achError").removeClass("hide");
    return;
  }

  const $out = $("#achList").empty();
  list.sort((a,b)=> String(b.year).localeCompare(String(a.year)));

  list.forEach(a => {
    const $card = $('<article class="card show"/>').append(`
      <h3>${a.title}</h3>
      <p class="muted">${a.details || ""}</p>
      <div class="meta">
        <span class="badge">${a.issuer}</span>
        <span class="badge">${a.year}</span>
      </div>
      <footer>${a.link ? `<a class="btn" href="${a.link}" target="_blank" rel="noopener">Learn more</a>` : ""}</footer>
    `);
    $out.append($card);
  });
});
