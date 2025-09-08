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

  (Array.isArray(data) ? data : []).forEach(cat => {
    const $card = $('<article>').addClass('card show').append(
      $('<h3>').text(cat && cat.category ? cat.category : '')
    );
    const $meta = $('<div>').addClass('meta');
    (cat && Array.isArray(cat.items) ? cat.items : []).forEach(s =>
      $meta.append($('<span>').addClass('badge').text(s))
    );
    $card.append($meta);
    $grid.append($card);
  });
});
