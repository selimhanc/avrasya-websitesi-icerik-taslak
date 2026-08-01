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

  function sorularBagla() {
    document.querySelectorAll(".sss-soru").forEach(function (soru) {
      bagla(soru);
      silButonuEkle(soru.parentElement);
    });
  }

  function sssSayisi() {
    return document.querySelectorAll(".sss-liste .sss-item").length;
  }

  function tabAdi(liste) {
    return liste ? liste.getAttribute("data-tab-ad") || "Genel" : "Genel";
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
        window.avrasyaDegisiklikKaydet("Sık Sorulan Sorular • " + tabAdi(item.closest(".sss-liste")) + " • Soru Komple Silindi", b + " — " + a, "(silindi)");
      }
    });
    item.querySelector(".sss-soru").appendChild(sil);
  }

  function listeHazirla(liste) {
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
      if (window.avrasyaSssItemHazirla) window.avrasyaSssItemHazirla(item);

      var cevap = item.querySelector(".sss-cevap");
      cevap.style.maxHeight = cevap.scrollHeight + "px";
      item.classList.add("acik");

      baslik.value = "";
      aciklama.value = "";
      form.hidden = true;

      logaEkle("[" + simdikiZaman() + '] "' + sayfaAdi() + '" SSS: "' + b + '" eklendi');

      if (window.avrasyaDegisiklikKaydet) {
        window.avrasyaDegisiklikKaydet("Sık Sorulan Sorular • " + tabAdi(liste) + " • Yeni Soru", "(yok)", b + " — " + a);
      }
    });
  }

  function tabGoster(sssBolum, ad) {
    var tablar = sssBolum.querySelector(".sss-tablar");
    Array.prototype.forEach.call(tablar.querySelectorAll(".sss-tab"), function (t) {
      t.classList.toggle("aktif", t.getAttribute("data-tab-ad") === ad);
    });
    var tumu = ad === "Tümü";
    Array.prototype.forEach.call(sssBolum.querySelectorAll(".sss-liste"), function (l) {
      l.hidden = tumu ? false : l.getAttribute("data-tab-ad") !== ad;
    });
  }

  function tabDropHazirla(sssBolum, tab) {
    var ad = tab.getAttribute("data-tab-ad");
    tab.addEventListener("dragover", function (e) {
      if (!document.body.classList.contains("duzenleme-acik")) return;
      if (!document.querySelector(".sss-item.surukleniyor")) return;
      e.preventDefault();
      tab.classList.add("surukleniyor");
    });
    tab.addEventListener("dragleave", function () {
      tab.classList.remove("surukleniyor");
    });
    tab.addEventListener("drop", function (e) {
      tab.classList.remove("surukleniyor");
      if (!document.body.classList.contains("duzenleme-acik")) return;
      var soru = document.querySelector(".sss-item.surukleniyor");
      if (!soru) return;
      e.preventDefault();
      var kaynakListe = soru.closest(".sss-liste");
      var kaynakAd = kaynakListe ? kaynakListe.getAttribute("data-tab-ad") || "Genel" : "Genel";
      if (ad === kaynakAd || ad === "Tümü") return;
      var hedefListe = sssBolum.querySelector('.sss-liste[data-tab-ad="' + ad + '"]');
      if (!hedefListe) return;
      var m = soru.querySelector(".sss-metin");
      var metin = m ? m.textContent.trim() : "(soru yok)";
      hedefListe.insertBefore(soru, hedefListe.querySelector(".sss-ekle"));
      soru.classList.remove("surukleniyor");
      Array.prototype.forEach.call(document.querySelectorAll(".sss-item.birakma-noktasi"), function (s) {
        s.classList.remove("birakma-noktasi");
      });
      if (window.avrasyaSssSeciciYenile) window.avrasyaSssSeciciYenile();
      if (window.avrasyaDegisiklikKaydet) {
        window.avrasyaDegisiklikKaydet("Sık Sorulan Sorular • Soru Sekmeye Taşındı", kaynakAd + " — " + metin, ad + " — " + metin);
      }
      tabGoster(sssBolum, ad);
    });
  }

  function tumuButonuEkle(sssBolum, tablar) {
    if (tablar.querySelector('.sss-tab[data-tab-ad="Tümü"]')) return;
    var tumu = document.createElement("button");
    tumu.type = "button";
    tumu.className = "sss-tab sss-tab-tumu";
    tumu.setAttribute("data-tab-ad", "Tümü");
    tumu.textContent = "Tümü";
    tablar.insertBefore(tumu, tablar.firstChild);
    tabDropHazirla(sssBolum, tumu);
  }

  function geneliIlkYap(tablar) {
    var tumu = tablar.querySelector('.sss-tab[data-tab-ad="Tümü"]');
    var genel = tablar.querySelector('.sss-tab[data-tab-ad="Genel"]');
    if (!tumu || !genel) return;
    if (genel.previousElementSibling === tumu) return;
    tablar.insertBefore(genel, tumu.nextSibling);
  }

  function tabSilButonuEkle(sssBolum, tab) {
    var sil = document.createElement("button");
    sil.type = "button";
    sil.className = "sss-tab-sil";
    sil.title = "Bu sekmeyi sil";
    sil.innerHTML =
      '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';
    sil.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var ad = tab.getAttribute("data-tab-ad");
      var liste = sssBolum.querySelector('.sss-liste[data-tab-ad="' + ad + '"]');
      var n = liste ? liste.querySelectorAll(".sss-item").length : 0;
      if (!window.confirm('"' + ad + '" sekmesi ve içindeki ' + n + ' soru silinecek. Devam edilsin mi?')) return;
      var tablar = sssBolum.querySelector(".sss-tablar");
      Array.prototype.forEach.call(tablar.querySelectorAll(".sss-tab"), function (t) {
        if (t.getAttribute("data-tab-ad") === ad) t.remove();
      });
      if (liste) liste.remove();
      logaEkle("[" + simdikiZaman() + '] "' + sayfaAdi() + '" SSS sekmesi "' + ad + '" silindi');
      if (window.avrasyaDegisiklikKaydet) {
        window.avrasyaDegisiklikKaydet("Sık Sorulan Sorular • Tab Silindi", ad + " (" + n + " soru)", "(silindi)");
      }
      if (window.avrasyaSssSeciciYenile) window.avrasyaSssSeciciYenile();
      geneliIlkYap(tablar);
      var ilk = tablar.querySelector(".sss-tab");
      if (ilk) tabGoster(sssBolum, ilk.getAttribute("data-tab-ad"));
    });
    tab.appendChild(sil);
  }

  function tablarHazirla(sssBolum) {
    var tablar = sssBolum.querySelector(".sss-tablar");
    if (!tablar) return;

    tumuButonuEkle(sssBolum, tablar);

    Array.prototype.forEach.call(tablar.querySelectorAll(".sss-tab"), function (tab) {
      tabSilButonuEkle(sssBolum, tab);
      tabDropHazirla(sssBolum, tab);
    });

    geneliIlkYap(tablar);

    var ekle = document.createElement("button");
    ekle.type = "button";
    ekle.className = "sss-tab-ekle";
    ekle.textContent = "+ Yeni Sekme";
    ekle.addEventListener("click", function () {
      var ad = window.prompt("Yeni sekme adı:", "");
      if (!ad) return;
      ad = ad.trim();
      if (!ad) return;
      var varMi = Array.prototype.some.call(tablar.querySelectorAll(".sss-tab"), function (t) {
        return t.getAttribute("data-tab-ad") === ad;
      });
      if (varMi) {
        window.alert("Bu isimde bir sekme zaten var.");
        return;
      }
      var tabBtn = document.createElement("button");
      tabBtn.type = "button";
      tabBtn.className = "sss-tab";
      tabBtn.setAttribute("data-tab-ad", ad);
      tabBtn.textContent = ad;
      tabSilButonuEkle(sssBolum, tabBtn);
      tabDropHazirla(sssBolum, tabBtn);
      tablar.insertBefore(tabBtn, ekle);
      geneliIlkYap(tablar);

      var liste = document.createElement("div");
      liste.className = "sss-liste";
      liste.setAttribute("data-tab-ad", ad);
      liste.hidden = true;
      tablar.parentNode.insertBefore(liste, tablar.nextSibling);
      listeHazirla(liste);
      if (window.avrasyaSssSiralamaHazirla) window.avrasyaSssSiralamaHazirla(liste);

      tabGoster(sssBolum, ad);
      logaEkle("[" + simdikiZaman() + '] "' + sayfaAdi() + '" SSS sekmesi "' + ad + '" eklendi');
      if (window.avrasyaDegisiklikKaydet) {
        window.avrasyaDegisiklikKaydet("Sık Sorulan Sorular • Tab Eklendi", "(yok)", ad);
      }
      if (window.avrasyaSssSeciciYenile) window.avrasyaSssSeciciYenile();
    });
    tablar.appendChild(ekle);

    tablar.addEventListener("click", function (e) {
      var tab = e.target.closest ? e.target.closest(".sss-tab") : null;
      if (tab && !e.target.closest(".sss-tab-sil")) {
        tabGoster(sssBolum, tab.getAttribute("data-tab-ad"));
      }
    });
  }

  document.querySelectorAll(".sss").forEach(function (bolum) {
    tablarHazirla(bolum);
    var ilk = bolum.querySelector(".sss-tab.aktif") || bolum.querySelector(".sss-tab");
    if (ilk) tabGoster(bolum, ilk.getAttribute("data-tab-ad"));
  });

  sorularBagla();
  document.querySelectorAll(".sss-liste").forEach(listeHazirla);
})();
