/* global $ */
$(async function () {
  let data = [];
  try {
    data = await $.getJSON("data/skills.json");
  } catch (e) {
    $("#skillsError").removeClass("hide");
    return;
  }

  const $grid = $("#skillsGrid").empty();

  data.forEach(cat => {
    const $card = $('<article class="card show"/>').append(
      `<h3>${cat.category}</h3>`
    );
    const $meta = $('<div class="meta"/>');
    (cat.items || []).forEach(s => $meta.append(`<span class="badge">${s}</span>`));
    $card.append($meta);
    $grid.append($card);
  });
});
