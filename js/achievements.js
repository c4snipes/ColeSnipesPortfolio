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
    const $card = $('<article class="card show"></article>');

    $card.append($('<h3></h3>').text(a.title));
    $card.append($('<p class="muted"></p>').text(a.details || ""));

    const $meta = $('<div class="meta"></div>');
    $meta.append($('<span class="badge"></span>').text(a.issuer));
    $meta.append($('<span class="badge"></span>').text(a.year));
    $card.append($meta);

    const $footer = $('<footer></footer>');
    if (a.link) {
      $footer.append(
        $('<a class="btn" target="_blank" rel="noopener"></a>')
          .attr('href', a.link)
          .text('Learn more')
      );
    }
    $card.append($footer);

    $out.append($card);
  });
});
