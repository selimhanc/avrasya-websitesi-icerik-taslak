(function () {
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var acik = nav.classList.toggle("acik");
    toggle.classList.toggle("acik", acik);
    toggle.setAttribute("aria-expanded", acik ? "true" : "false");
  });

  nav.addEventListener("click", function (event) {
    if (event.target.tagName === "A" && nav.classList.contains("acik")) {
      nav.classList.remove("acik");
      toggle.classList.remove("acik");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();
