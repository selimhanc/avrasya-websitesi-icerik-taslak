(function () {
  var seciciler =
    ".hero-eyebrow, .hero h1, .hero-text, .hero-metre .metre strong, .hero-metre .metre span, " +
    ".hero-img-kutu, .section h2, .section .giris, .section p, .info-kutu h4, .info-kutu p, " +
    ".step h3, .step p, .gallery figcaption, .kart .kart-no, .kart h3, .kart p, .kart .kart-link, " +
    ".sss h2, .sss .giris, .sss-metin, .sss-cevap p, .not, .site-footer h4, .site-footer p";

  var elemanlar = Array.prototype.slice.call(document.querySelectorAll(seciciler));
  var kayitlar = [];

  function temizIc(el) {
    var klon = el.cloneNode(true);
    var btn = klon.querySelector(".duzen-kopyala");
    if (btn) btn.remove();
    var sil = klon.querySelector(".eleman-sil");
    if (sil) sil.remove();
    return klon.innerHTML;
  }

  function bolumEtiketi(el) {
    var bolum = "Sayfa";
    var section = el.closest(".section");
    if (section) {
      var h2 = section.querySelector("h2");
      bolum = h2 ? h2.textContent.trim() : "Bölüm";
    }
    return bolum;
  }

  function galeriIndex(img) {
    var galeri = img.closest(".gallery");
    if (!galeri) return "";
    var imgs = galeri.querySelectorAll("img");
    return Array.prototype.indexOf.call(imgs, img) + 1;
  }

  function konumEtiketi(el) {
    if (el.tagName === "IMG") {
      var tip = "Görsel";
      if (el.closest(".hero-img")) tip = "Kapak Görseli";
      else if (el.closest(".kart-gorsel")) tip = "Faaliyet Görseli";
      else if (el.closest(".gallery")) tip = "Galeri Görseli (" + galeriIndex(el) + ")";
      return bolumEtiketi(el) + " • " + tip;
    }

    var bolum = bolumEtiketi(el);
    var tip = "Paragraf";
    if (el.classList.contains("hero-eyebrow")) tip = "Üst Etiket";
    else if (el.matches(".hero h1")) tip = "Sayfa Başlığı";
    else if (el.classList.contains("hero-text")) tip = "Tanıtım Metni";
    else if (el.classList.contains("hero-img-kutu")) tip = "Kapak Görsel Açıklaması";
    else if (el.matches(".section h2")) tip = "Bölüm Başlığı";
    else if (el.classList.contains("giris")) tip = "Giriş Paragrafı";
    else if (el.classList.contains("sss-metin")) tip = "Soru";
    else if (el.closest(".sss-cevap")) tip = "Yanıt";
    else if (el.closest(".step")) tip = el.tagName === "H3" ? "Planlama Adımı Başlığı" : "Planlama Adımı";
    else if (el.closest(".info-kutu")) tip = el.tagName === "H4" ? "Bilgi Kutusu Başlığı" : "Bilgi Kutusu";
    else if (el.closest(".gallery")) tip = "Galeri Açıklaması";
    else if (el.closest(".kart")) tip = "Faaliyet Kartı";
    else if (el.classList.contains("not")) tip = "Bilgi Notu";
    else if (el.closest(".site-footer")) tip = "Alt Bilgi";
    return bolum + " • " + tip;
  }

  function kopyala(metin, sonra) {
    function geriDus() {
      var ta = document.createElement("textarea");
      ta.value = metin;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
      } catch (e) {}
      document.body.removeChild(ta);
      sonra();
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(metin).then(sonra, geriDus);
    } else {
      geriDus();
    }
  }

  function ikon(svg) {
    return (
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      svg +
      "</svg>"
    );
  }

  var kopyaIkonu =
    '<rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';
  var tikIkonu = '<path d="M20 6 9 17l-5-5"></path>';
  var capiIkonu = '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>';

  function geriBildirim(btn, metin) {
    btn.classList.add("basarili");
    var eskiTitle = btn.title;
    var eskiIcerik = btn.innerHTML;
    btn.title = "Kopyalandı!";
    btn.innerHTML = metin;
    setTimeout(function () {
      btn.classList.remove("basarili");
      btn.title = eskiTitle;
      btn.innerHTML = eskiIcerik;
    }, 1600);
  }

  /* ---------- DEĞİŞİKLİK PANELİ ---------- */
  var panel = document.createElement("div");
  panel.className = "deg-panel";
  panel.innerHTML =
    '<button class="deg-panel-toggle" type="button">' +
    "<span>Yapılan Değişiklikler</span><span class=\"deg-sayac\">0</span>" +
    "</button>" +
    '<div class="deg-panel-icerik">' +
    '<div class="deg-panel-baslik">' +
    "<span>Düzenlediğiniz içerikler burada birikir; tümünü tek seferde kopyalayabilirsiniz.</span>" +
    '<button class="deg-hepsi-kopyala" type="button">Tümünü Kopyala</button>' +
    "</div>" +
    '<div class="deg-liste"></div>' +
    "</div>";
  document.body.appendChild(panel);

  var liste = panel.querySelector(".deg-liste");
  var sayacEl = panel.querySelector(".deg-sayac");
  var toggleBtn = panel.querySelector(".deg-panel-toggle");

  toggleBtn.addEventListener("click", function () {
    var acik = panel.classList.toggle("acik");
    document.body.classList.toggle("panel-acik", acik);
  });

  function guncelleSayac() {
    sayacEl.textContent = kayitlar.length;
  }

  function kayitPanoyaEkle(konum, eski, yeni) {
    var kayit = { konum: konum, eski: eski, yeni: yeni };
    kayitlar.push(kayit);

    var div = document.createElement("div");
    div.className = "deg-kayit";
    div.innerHTML = '<div class="deg-konum"></div><div class="deg-eski"></div><div class="deg-yeni"></div>';
    div.querySelector(".deg-konum").textContent = kayit.konum;
    div.querySelector(".deg-eski").textContent = "ESKİ: " + kayit.eski;
    div.querySelector(".deg-yeni").textContent = "YENİ: " + kayit.yeni;
    liste.appendChild(div);

    guncelleSayac();
    panel.classList.add("acik");
    document.body.classList.add("panel-acik");
    return kayit;
  }

  function kayitEkle(el) {
    if (el.dataset.kayitli === "1") return null;
    var eski = el.dataset.ilk || "";
    var yeni = temizIc(el);
    if (eski === yeni) return null;
    el.dataset.kayitli = "1";
    return kayitPanoyaEkle(konumEtiketi(el), eski, yeni);
  }

  function raporMetni() {
    var metin = "SAYFA: " + location.href + "\n";
    if (!kayitlar.length) {
      return metin + "\n(Değişiklik kaydı yok)";
    }
    kayitlar.forEach(function (k, i) {
      metin += "\n--- DEĞİŞİKLİK " + (i + 1) + " ---\n";
      metin += "KONUM: " + k.konum + "\n";
      metin += "ESKİ: " + k.eski + "\n";
      metin += "YENİ: " + k.yeni + "\n";
    });
    return metin;
  }

  window.avrasyaDegisiklikKaydet = function (konum, eski, yeni) {
    kayitPanoyaEkle(konum, eski, yeni);
  };

  panel.querySelector(".deg-hepsi-kopyala").addEventListener("click", function () {
    var btn = this;
    kopyala(raporMetni(), function () {
      geriBildirim(btn, "Kopyalandı!");
    });
  });

  /* ---------- GÖRSEL İŞLEMLERİ ---------- */
  var hedefImg = null;
  var ekleGaleri = null;

  var popup = document.createElement("div");
  popup.className = "gorsel-popup";
  popup.innerHTML =
    '<div class="gorsel-popup-kutu">' +
    '<div class="gorsel-popup-baslik">' +
    "<span>Görsel Seçin</span>" +
    '<button class="gorsel-popup-kapat" type="button" title="Kapat">' +
    ikon(capiIkonu) +
    "</button>" +
    "</div>" +
    '<div class="gorsel-popup-liste"></div>' +
    "</div>";
  document.body.appendChild(popup);

  var popupListe = popup.querySelector(".gorsel-popup-liste");

  function popupAc(img) {
    hedefImg = img;
    var adaylar = [];
    document.querySelectorAll(".gallery img, .hero-img img, .kart-gorsel img").forEach(function (i) {
      var s = i.getAttribute("src");
      if (s && adaylar.indexOf(s) === -1) adaylar.push(s);
    });
    if (!adaylar.length) return;

    popupListe.innerHTML = "";
    var secili = img ? img.getAttribute("src") : null;
    adaylar.forEach(function (src) {
      var kucuk = document.createElement("img");
      kucuk.src = src;
      kucuk.alt = "Görsel seçenekleri";
      if (src === secili) kucuk.className = "secili";
      kucuk.addEventListener("click", function () {
        if (hedefImg) {
          gorselDegistir(hedefImg, src);
        } else {
          gorselEkle(src);
        }
      });
      popupListe.appendChild(kucuk);
    });

    popup.classList.add("acik");
  }

  function popupKapat() {
    popup.classList.remove("acik");
    hedefImg = null;
    ekleGaleri = null;
  }

  function gorselDegistir(img, yeniSrc) {
    var eskiSrc = img.getAttribute("src");
    if (eskiSrc !== yeniSrc) {
      img.setAttribute("src", yeniSrc);
      var hero = img.closest(".hero");
      if (hero) {
        hero.style.setProperty("--hero-bg", "url('" + yeniSrc.replace(/'/g, "\\'") + "')");
      }
      kayitPanoyaEkle(konumEtiketi(img), eskiSrc, yeniSrc);
    }
    popupKapat();
  }

  function gorselEkle(src) {
    if (!ekleGaleri) return;
    var galeri = ekleGaleri;

    var fig = document.createElement("figure");
    var img = document.createElement("img");
    img.src = src;
    img.alt = "Yeni eklenen görsel";
    img.addEventListener("click", function () {
      popupAc(img);
    });

    var cap = document.createElement("figcaption");
    cap.textContent = "Yeni eklenen görsel";

    fig.appendChild(img);
    fig.appendChild(cap);
    gorselButonlariEkle(fig, img, true);

    galeri.insertBefore(fig, galeri.querySelector(".gorsel-ekle"));
    kayitPanoyaEkle("Galeri • Yeni Görsel (" + galeriIndex(img) + ")", "(yok)", src);
    popupKapat();
  }

  function gorselButonlariEkle(kapsayici, img, silinebilir) {
    var ataBtn = document.createElement("button");
    ataBtn.type = "button";
    ataBtn.className = "gorsel-ata";
    ataBtn.title = "Bu görsel değişikliğini URL ile birlikte kopyala";
    ataBtn.innerHTML = ikon(kopyaIkonu);

    ataBtn.addEventListener("mousedown", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    ataBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var metin =
        "SAYFA: " +
        location.href +
        "\n\n--- DEĞİŞİKLİK ---\n" +
        "KONUM: " +
        konumEtiketi(img) +
        "\n" +
        "ESKİ: " +
        img.getAttribute("src") +
        "\n" +
        "YENİ: " +
        img.getAttribute("src") +
        "\n";
      kopyala(metin, function () {
        geriBildirim(ataBtn, ikon(tikIkonu));
      });
    });

    kapsayici.appendChild(ataBtn);

    if (silinebilir) {
      var silBtn = document.createElement("button");
      silBtn.type = "button";
      silBtn.className = "gorsel-sil";
      silBtn.title = "Bu görseli sil";
      silBtn.innerHTML = ikon(capiIkonu);

      silBtn.addEventListener("mousedown", function (e) {
        e.preventDefault();
        e.stopPropagation();
      });

      silBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var src = img.getAttribute("src");
        var idx = galeriIndex(img);
        kapsayici.remove();
        kayitPanoyaEkle("Galeri • Galeri Görseli Silindi (" + idx + ")", src, "(silindi)");
      });

      kapsayici.appendChild(silBtn);
    }
  }

  popup.querySelector(".gorsel-popup-kapat").addEventListener("click", popupKapat);
  popup.addEventListener("click", function (e) {
    if (e.target === popup) popupKapat();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") popupKapat();
  });

  document.querySelectorAll(".gallery figure").forEach(function (fig) {
    var img = fig.querySelector("img");
    if (!img) return;
    img.addEventListener("click", function () {
      popupAc(img);
    });
    gorselButonlariEkle(fig, img, true);
  });

  document.querySelectorAll(".hero-img img, .kart-gorsel img").forEach(function (img) {
    img.addEventListener("click", function () {
      popupAc(img);
    });
    var kapsayici = img.closest(".hero-img, .kart-gorsel");
    gorselButonlariEkle(kapsayici, img, false);
  });

  document.querySelectorAll(".gallery").forEach(function (galeri) {
    var ekle = document.createElement("button");
    ekle.type = "button";
    ekle.className = "gorsel-ekle";
    ekle.textContent = "+ Yeni Görsel Ekle";
    ekle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      ekleGaleri = galeri;
      popupAc(null);
    });
    galeri.appendChild(ekle);
  });

  /* ---------- DÜZENLENEBİLİR ÖĞELER ---------- */
  elemanlar.forEach(function (el) {
    el.setAttribute("contenteditable", "true");
    el.style.position = "relative";
    el.dataset.ilk = temizIc(el);

    el.addEventListener("blur", function () {
      kayitEkle(el);
    });

    el.addEventListener("input", function () {
      el.dataset.kayitli = "";
    });

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "duzen-kopyala";
    btn.title = "Bu paragrafı URL ile birlikte kopyala";
    btn.innerHTML = ikon(kopyaIkonu);

    btn.addEventListener("mousedown", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      kayitEkle(el);

      var metin =
        "SAYFA: " +
        location.href +
        "\n\n--- DEĞİŞİKLİK ---\n" +
        "KONUM: " +
        konumEtiketi(el) +
        "\n" +
        "ESKİ: " +
        (el.dataset.ilk || "") +
        "\n" +
        "YENİ: " +
        temizIc(el) +
        "\n";

      kopyala(metin, function () {
        geriBildirim(btn, ikon(tikIkonu));
      });
    });

    el.appendChild(btn);

    var silBtn = document.createElement("button");
    silBtn.type = "button";
    silBtn.className = "eleman-sil";
    silBtn.title = "Bu öğeyi sil";
    silBtn.innerHTML = ikon(capiIkonu);

    silBtn.addEventListener("mousedown", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    silBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var eski = el.dataset.ilk || "";
      var konum = konumEtiketi(el) + " • Silindi";
      el.remove();
      kayitPanoyaEkle(konum, eski, "(silindi)");
    });

    el.appendChild(silBtn);
  });
})();
