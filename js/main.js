/* global $ */
$(function () {
  // Footer year
  $("#year").text(new Date().getFullYear());

  // Auto-activate current nav link
  const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const isIndex = page === "" || page === "index.html";

  $(".top-nav a").each(function () {
    const href = $(this).attr("href") || "";
    const file = href.split("/").pop().toLowerCase();
    const matches = (isIndex && (file === "" || file === "index.html")) ||
                    (!isIndex && page === file);

    if (matches) {
      $(".top-nav a").removeClass("active").removeAttr("aria-current");
      $(this).addClass("active").attr("aria-current", "page");
    }
  });
});
