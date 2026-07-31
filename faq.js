(function () {
  var ANAHTAR_LOG = "avrasya_ikon_log";

  function iki(n) { return (n < 10 ? "0" : "") + n; }

  function simdikiZaman() {
    var d = new Date();
    return d.getFullYear() + "-" + iki(d.getMonth() + 1) + "-" + iki(d.getDate()) +
      " " + iki(d.getHours()) + ":" + iki(d.getMinutes());
  }

  function logOku() {
    try { return localStorage.getItem(ANAHTAR_LOG) || ""; } catch (e) { return ""; }
  }

  function logaEkle(satir) {
    var mevcut = logOku();
    var yeni = mevcut ? mevcut.replace(/\s+$/, "") + "\n" + satir : satir;
    try { localStorage.setItem(ANAHTAR_LOG, yeni); } catch (e) {}
  }

  function sayfaAdi() {
    return (document.title || "").split("–")[0].split("-")[0].trim();
  }

  function bagla(soru) {
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
  }

  document.querySelectorAll(".sss-soru").forEach(function (soru) {
    bagla(soru);
    silButonuEkle(soru.parentElement);
  });

  function sssSayisi() {
    return document.querySelectorAll(".sss-liste .sss-item").length;
  }

  function silButonuEkle(item) {
    var sil = document.createElement("button");
    sil.type = "button";
    sil.className = "sss-sil";
    sil.title = "Bu soruyu komple sil";
    sil.innerHTML =
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';
    sil.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var soru = item.querySelector(".sss-metin");
      var cevap = item.querySelector(".sss-cevap p");
      var b = soru ? soru.textContent.trim() : "";
      var a = cevap ? cevap.textContent.trim() : "";
      item.remove();
      logaEkle("[" + simdikiZaman() + '] "' + sayfaAdi() + '" SSS: "' + b + '" komple silindi');
      if (window.avrasyaDegisiklikKaydet) {
        window.avrasyaDegisiklikKaydet("Sık Sorulan Sorular • Soru Komple Silindi", b + " — " + a, "(silindi)");
      }
    });
    item.querySelector(".sss-soru").appendChild(sil);
  }

  document.querySelectorAll(".sss-liste").forEach(function (liste) {
    var ekle = document.createElement("div");
    ekle.className = "sss-ekle";
    ekle.innerHTML =
      '<button type="button" class="sss-ekle-ac">+ Yeni Soru Ekle</button>' +
      '<div class="sss-ekle-form" hidden>' +
      '<input type="text" class="sss-ekle-baslik" placeholder="Başlık *">' +
      '<textarea class="sss-ekle-aciklama" rows="3" placeholder="Açıklama *"></textarea>' +
      '<div class="sss-ekle-actions">' +
      '<button type="button" class="sss-ekle-kaydet">Ekle</button>' +
      '<button type="button" class="sss-ekle-vazgec">Vazgeç</button>' +
      "</div></div>";
    liste.appendChild(ekle);

    var acBtn = ekle.querySelector(".sss-ekle-ac");
    var form = ekle.querySelector(".sss-ekle-form");
    var baslik = ekle.querySelector(".sss-ekle-baslik");
    var aciklama = ekle.querySelector(".sss-ekle-aciklama");

    acBtn.addEventListener("click", function () {
      form.hidden = !form.hidden;
      if (!form.hidden) baslik.focus();
    });

    ekle.querySelector(".sss-ekle-vazgec").addEventListener("click", function () {
      baslik.value = "";
      aciklama.value = "";
      form.hidden = true;
    });

    ekle.querySelector(".sss-ekle-kaydet").addEventListener("click", function () {
      var b = baslik.value.trim();
      var a = aciklama.value.trim();

      if (!b || !a) {
        window.alert("Başlık ve açıklama alanları zorunludur.");
        if (!b) baslik.focus(); else aciklama.focus();
        return;
      }

      var item = document.createElement("div");
      item.className = "sss-item";
      item.innerHTML =
        '<div class="sss-soru">' +
        '<span class="sss-metin"></span>' +
        '<button class="sss-ac" type="button" aria-label="Yanıtı aç" title="Yanıtı aç">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>' +
        "</button></div>" +
        '<div class="sss-cevap"><p></p></div>';
      item.querySelector(".sss-metin").textContent = b;
      item.querySelector(".sss-cevap p").textContent = a;

      liste.insertBefore(item, ekle);
      bagla(item.querySelector(".sss-soru"));
      silButonuEkle(item);

      var cevap = item.querySelector(".sss-cevap");
      cevap.style.maxHeight = cevap.scrollHeight + "px";
      item.classList.add("acik");

      baslik.value = "";
      aciklama.value = "";
      form.hidden = true;

      logaEkle("[" + simdikiZaman() + '] "' + sayfaAdi() + '" SSS: "' + b + '" eklendi');

      if (window.avrasyaDegisiklikKaydet) {
        window.avrasyaDegisiklikKaydet("Sık Sorulan Sorular • Yeni Soru", "(yok)", b + " — " + a);
      }
    });
  });
})();
