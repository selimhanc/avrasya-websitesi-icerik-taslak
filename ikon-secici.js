(function () {
  if (!document.querySelector(".main-nav")) return;

  var ANAHTAR_SECIM = "avrasya_ikon_secimleri";
  var ANAHTAR_LOG = "avrasya_ikon_log";
  var baslangicKayitlari = {
    "egitim-projesi.html": "open_book",
    "kalici-eserler.html": "brick",
    "kislik-ihtiyaclar.html": "snowflake",
    "kumanya.html": "package",
    "kurban-bayrami.html": "cow_face",
    "nafile-kurban.html": "ewe",
    "su-kuyusu.html": "droplet",
    "saglikli-sunnet.html": "syringe"
  };
  var hedefBag = null;
  var modal = null;
  var grid = null;
  var logAlan = null;

  function iki(n) { return (n < 10 ? "0" : "") + n; }

  function simdikiZaman() {
    var d = new Date();
    return d.getFullYear() + "-" + iki(d.getMonth() + 1) + "-" + iki(d.getDate()) +
      " " + iki(d.getHours()) + ":" + iki(d.getMinutes());
  }

  function ikonBul(id) {
    for (var i = 0; i < AVRASYA_IKONLAR.length; i++) {
      if (AVRASYA_IKONLAR[i].id === id) return AVRASYA_IKONLAR[i];
    }
    for (var j = 0; j < AVRASYA_EMOJILER.length; j++) {
      if (AVRASYA_EMOJILER[j].id === id) return AVRASYA_EMOJILER[j];
    }
    return null;
  }

  function secimleriOku() {
    try { return JSON.parse(localStorage.getItem(ANAHTAR_SECIM)) || {}; }
    catch (e) { return {}; }
  }

  function secimleriYaz(kayitlar) {
    try { localStorage.setItem(ANAHTAR_SECIM, JSON.stringify(kayitlar)); } catch (e) {}
  }

  function logOku() {
    try { return localStorage.getItem(ANAHTAR_LOG) || ""; } catch (e) { return ""; }
  }

  function logYaz(metin) {
    try { localStorage.setItem(ANAHTAR_LOG, metin); } catch (e) {}
  }

  function svgOlustur(icerik) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "nav-ikon");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("width", "16");
    s.setAttribute("height", "16");
    s.setAttribute("aria-hidden", "true");
    s.innerHTML = icerik;
    return s;
  }

  function faOlustur(ikon) {
    var i = document.createElement("i");
    i.className = "nav-ikon nav-fa " + ikon.sinif;
    i.setAttribute("aria-hidden", "true");
    if (ikon.renk) i.style.color = ikon.renk;
    return i;
  }

  function emojiOlustur(ikon) {
    var s = document.createElement("span");
    s.className = "nav-ikon nav-emoji";
    s.textContent = ikon.emoji;
    return s;
  }

  function ikonOlustur(ikon) {
    if (ikon.tip === "fa") return faOlustur(ikon);
    if (ikon.emoji) return emojiOlustur(ikon);
    return svgOlustur(ikon.svg);
  }

  function svgParmakIzi(el) {
    var parcalar = [];
    (function gez(n) {
      if (n.nodeType === 1) {
        var s = n.nodeName;
        for (var i = 0; i < n.attributes.length; i++) {
          s += "|" + n.attributes[i].name + "=" + n.attributes[i].value;
        }
        parcalar.push(s + "[" + (n.textContent || "") + "]");
        for (var j = 0; j < n.childNodes.length; j++) gez(n.childNodes[j]);
      }
    })(el);
    return parcalar.join(",");
  }

  function gecerliIkonId(bag) {
    var svg = bag.querySelector("svg");
    if (svg) {
      var parmak = svgParmakIzi(svg);
      for (var i = 0; i < AVRASYA_IKONLAR.length; i++) {
        if (!AVRASYA_IKONLAR[i].svg) continue;
        var referans = svgOlustur(AVRASYA_IKONLAR[i].svg);
        if (svgParmakIzi(referans) === parmak) return AVRASYA_IKONLAR[i].id;
      }
      return "";
    }
    var emoji = bag.querySelector("span.nav-emoji");
    if (emoji) {
      for (var k = 0; k < AVRASYA_EMOJILER.length; k++) {
        if (AVRASYA_EMOJILER[k].emoji === emoji.textContent) return AVRASYA_EMOJILER[k].id;
      }
      return "";
    }
    var fa = bag.querySelector("i.nav-fa");
    if (fa) {
      for (var j = 0; j < AVRASYA_IKONLAR.length; j++) {
        var ikon = AVRASYA_IKONLAR[j];
        if (ikon.tip === "fa" && fa.getAttribute("class") === "nav-ikon nav-fa " + ikon.sinif) return ikon.id;
      }
    }
    return "";
  }

  function uygulaKayitlar() {
    var kayitlar = secimleriOku();
    var baglar = document.querySelectorAll(".main-nav a");
    for (var i = 0; i < baglar.length; i++) {
    var bag = baglar[i];
    var id = kayitlar[bag.getAttribute("href")] || baslangicKayitlari[bag.getAttribute("href")];
    if (!id) continue;
      var ikon = ikonBul(id);
      if (!ikon) continue;
      var eski = bag.querySelector("svg") || bag.querySelector("i.nav-fa") || bag.querySelector("span.nav-emoji");
      if (eski) eski.remove();
      bag.insertBefore(ikonOlustur(ikon), bag.firstChild);
    }
  }

  function menuAdi(bag) {
    var son = bag.lastChild;
    return son && son.nodeType === 3 ? son.nodeValue.trim() : bag.textContent.trim();
  }

  function logaEkle(satir) {
    var mevcut = logOku();
    var yeni = satir + (mevcut ? "\n" + mevcut : "");
    logYaz(yeni);
    if (logAlan) logAlan.value = yeni;
  }

  function tumIkonlar() {
    var liste = [];
    for (var i = 0; i < AVRASYA_IKONLAR.length; i++) liste.push(AVRASYA_IKONLAR[i]);
    for (var j = 0; j < AVRASYA_EMOJILER.length; j++) liste.push(AVRASYA_EMOJILER[j]);
    return liste;
  }

  function gridDoldur(arama) {
    grid.innerHTML = "";
    var metin = (arama || "").toLocaleLowerCase("tr");
    var suanki = hedefBag ? gecerliIkonId(hedefBag) : "";
    var liste = tumIkonlar();
    for (var i = 0; i < liste.length; i++) {
      var ikon = liste[i];
      if (metin && ikon.ad.toLocaleLowerCase("tr").indexOf(metin) === -1) continue;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ikon-btn" + (ikon.id === suanki ? " secili" : "");
      btn.setAttribute("data-id", ikon.id);
      if (ikon.tip === "fa") {
        btn.innerHTML = '<i class="' + ikon.sinif + '" style="color:' + (ikon.renk || "#014573") + '" aria-hidden="true"></i><span>' + ikon.ad + "</span>";
      } else if (ikon.emoji) {
        btn.innerHTML = '<span class="ikon-emoji">' + ikon.emoji + "</span><span>" + ikon.ad + "</span>";
      } else {
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">' + ikon.svg + "</svg><span>" + ikon.ad + "</span>";
      }
      grid.appendChild(btn);
    }
  }

  function modalOlustur() {
    modal = document.createElement("div");
    modal.className = "ikon-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-label", "İkon Seçici");
    modal.innerHTML =
      '<div class="ikon-modal-ic">' +
      '<div class="ikon-modal-baslik">' +
      "<h3>İkon Seç</h3>" +
      '<button class="ikon-modal-kapat" type="button" aria-label="Kapat">×</button>' +
      "</div>" +
      '<input class="ikon-ara" type="search" placeholder="İkon ara..." aria-label="İkon ara">' +
      '<div class="ikon-grid"></div>' +
      '<div class="ikon-log-baslik">Güncelleme Logu <small>(düzenlenebilir)</small></div>' +
      '<textarea class="ikon-log" rows="8" placeholder="Loga yaz..."></textarea>' +
      '<div class="ikon-modal-alt">' +
      '<button class="ikon-log-kopyala" type="button">Logu Kopyala</button>' +
      '<button class="ikon-log-kaydet" type="button">Logu Kaydet</button>' +
      '<button class="ikon-log-temizle" type="button">Logu Temizle</button>' +
      "</div>" +
      "</div>";
    document.body.appendChild(modal);
    grid = modal.querySelector(".ikon-grid");
    logAlan = modal.querySelector(".ikon-log");
    modal.querySelector(".ikon-modal-kapat").addEventListener("click", kapat);
    modal.querySelector(".ikon-ara").addEventListener("input", function (e) {
      gridDoldur(e.target.value);
    });
    modal.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".ikon-btn") : null;
      if (btn) sec(btn.getAttribute("data-id"));
    });
    modal.querySelector(".ikon-log-kopyala").addEventListener("click", function () {
      var metin = logAlan.value;
      if (!metin) return;
      var kopyalaBtn = modal.querySelector(".ikon-log-kopyala");
      function bildir(basariliMi) {
        logAlan.style.borderColor = basariliMi ? "#2e8b57" : "#e2574c";
        kopyalaBtn.textContent = basariliMi ? "Kopyalandı!" : "Kopyalanamadı";
        setTimeout(function () {
          logAlan.style.borderColor = "";
          kopyalaBtn.textContent = "Logu Kopyala";
        }, 1500);
      }
      function eskiYontem() {
        logAlan.focus();
        logAlan.select();
        try {
          document.execCommand("copy");
          bildir(true);
        } catch (e) {
          bildir(false);
        }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(metin).then(function () { bildir(true); }, eskiYontem);
      } else {
        eskiYontem();
      }
    });
    modal.querySelector(".ikon-log-kaydet").addEventListener("click", function () {
      logYaz(logAlan.value);
      logAlan.style.borderColor = "#2e8b57";
      setTimeout(function () { logAlan.style.borderColor = ""; }, 1200);
    });
    modal.querySelector(".ikon-log-temizle").addEventListener("click", function () {
      if (window.confirm("Güncelleme logu tamamen silinsin mi?")) {
        logYaz("");
        logAlan.value = "";
      }
    });
  }

  function ac(bag) {
    hedefBag = bag;
    if (!modal) modalOlustur();
    logAlan.value = logOku();
    gridDoldur("");
    modal.classList.add("acik");
    modal.querySelector(".ikon-ara").value = "";
    modal.querySelector(".ikon-ara").focus();
  }

  function kapat() {
    if (!modal) return;
    modal.classList.remove("acik");
    hedefBag = null;
  }

  function sec(id) {
    if (!hedefBag) return;
    var yeni = ikonBul(id);
    if (!yeni) return;
    var eskiId = gecerliIkonId(hedefBag);
    var eski = ikonBul(eskiId);
    var eskiAd = eski ? eski.ad : "Yok";
    var eskiEleman = hedefBag.querySelector("svg") || hedefBag.querySelector("i.nav-fa") || hedefBag.querySelector("span.nav-emoji");
    if (eskiEleman) eskiEleman.remove();
    hedefBag.insertBefore(ikonOlustur(yeni), hedefBag.firstChild);
    var kayitlar = secimleriOku();
    kayitlar[hedefBag.getAttribute("href")] = id;
    secimleriYaz(kayitlar);
    logaEkle("[" + simdikiZaman() + "] \"" + menuAdi(hedefBag) + "\" ikonu: " + eskiAd + " → " + yeni.ad);
    gridDoldur("");
    kapat();
  }

  document.addEventListener("click", function (e) {
    var hedef = e.target;
    if (!hedef || !hedef.closest) return;
    var ikonEl = hedef.closest(".main-nav a svg, .main-nav a i.nav-fa, .main-nav a span.nav-emoji");
    if (!ikonEl) return;
    var bag = ikonEl.closest(".main-nav a");
    if (!bag) return;
    if (!document.body.classList.contains("duzenleme-acik")) return;
    e.preventDefault();
    e.stopPropagation();
    ac(bag);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") kapat();
  });

  document.addEventListener("click", function (e) {
    if (!modal || !modal.classList.contains("acik")) return;
    if (e.target.closest(".ikon-modal-ic")) return;
    if (e.target.closest(".main-nav")) return;
    kapat();
  });

  uygulaKayitlar();
})();
