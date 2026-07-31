(function () {
  var sorular = document.querySelectorAll(".sss-soru");

  sorular.forEach(function (soru) {
    soru.addEventListener("click", function (e) {
      if (e.target.closest(".sss-metin")) return;

      var item = soru.parentElement;
      var cevap = item.querySelector(".sss-cevap");
      var acik = item.classList.toggle("acik");

      if (acik) {
        var liste = item.parentElement;
        Array.prototype.forEach.call(liste.children, function (kardes) {
          if (kardes !== item) {
            kardes.classList.remove("acik");
            var kCevap = kardes.querySelector(".sss-cevap");
            if (kCevap) kCevap.style.maxHeight = null;
          }
        });
        cevap.style.maxHeight = cevap.scrollHeight + "px";
      } else {
        cevap.style.maxHeight = null;
      }
    });
  });
})();
