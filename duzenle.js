(function () {
  var seciciler =
    ".hero-eyebrow, .hero h1, .hero-text, .hero-metre .metre strong, .hero-metre .metre span, " +
    ".hero-img-kutu, .section h2, .section .giris, .section p, .info-kutu h4, .info-kutu p, " +
    ".step h3, .step p, .gallery figcaption, .kart .kart-no, .kart h3, .kart p, .kart .kart-link, " +
    ".sss h2, .sss .giris, .sss-metin, .sss-cevap p, .not, .site-footer h4, .site-footer p";

  var elemanlar = [];
  var kayitlar = [];

  function modAcik() {
    return document.body.classList.contains("duzenleme-acik");
  }

  /* ---------- DÜZENLEME MODU AÇ/KAPA ---------- */
  var modBtn = document.createElement("button");
  modBtn.type = "button";
  modBtn.className = "duzen-mod-btn";
  modBtn.title = "Düzenleme modunu aç veya kapat";
  modBtn.textContent = "Düzenle";
  var menuToggle = document.querySelector(".menu-toggle");
  if (menuToggle) {
    menuToggle.parentNode.insertBefore(modBtn, menuToggle);
  } else {
    document.body.appendChild(modBtn);
  }

  function modDegistir() {
    var acik = document.body.classList.toggle("duzenleme-acik");
    modBtn.classList.toggle("acik", acik);
    elemanlar.forEach(function (el) {
      el.contentEditable = acik ? "true" : "false";
    });
    if (!acik) {
      panel.classList.remove("acik");
      document.body.classList.remove("panel-acik");
      popupKapat();
    }
  }

  modBtn.addEventListener("click", modDegistir);

  document.addEventListener("click", function (e) {
    if (!modAcik()) return;
    var hedef = e.target;
    if (!hedef || !hedef.closest) return;
    if (hedef.closest(".kart-ic")) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

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

  function sssTabAdi(el) {
    var liste = el.closest(".sss-liste");
    return liste ? liste.getAttribute("data-tab-ad") || "Genel" : "Genel";
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
    else if (el.classList.contains("sss-metin")) tip = sssTabAdi(el) + " • Soru";
    else if (el.closest(".sss-cevap")) tip = sssTabAdi(el) + " • Yanıt";
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
    '<div class="deg-aksiyon">' +
    '<button class="deg-hepsi-kopyala" type="button">Tümünü Kopyala</button>' +
    "</div>" +
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

  function sayfaAdresi() {
    try {
      return "/" + location.pathname.split("/").pop();
    } catch (e) {
      return location.href;
    }
  }

  function raporMetni() {
    var metin = "SAYFA: " + sayfaAdresi() + "\n";
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

  /* ---------- WHATSAPP PAYLAŞIM ---------- */
  var waBtn = document.createElement("button");
  waBtn.type = "button";
  waBtn.className = "whatsapp-paylas";
  waBtn.title = "Logları WhatsApp'ta paylaş";
  waBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
    "<span>WhatsApp</span>";
  panel.querySelector(".deg-aksiyon").insertBefore(waBtn, panel.querySelector(".deg-hepsi-kopyala"));

  waBtn.addEventListener("click", function () {
    var metin = "*AVRASYA WEBSİTESİ İÇERİK DÜZENLEME TEKLİFİ*\n\n" + raporMetni();
    window.open("https://wa.me/905388871803?text=" + encodeURIComponent(metin), "_blank");
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

  function sayfadakiGorseller() {
    var adaylar = [];
    document.querySelectorAll(".gallery img, .hero-img img, .kart-gorsel img").forEach(function (i) {
      var s = i.getAttribute("src");
      if (s && adaylar.indexOf(s) === -1) adaylar.push(s);
    });
    return adaylar;
  }

  function gorselListesiCek(klasor) {
    var apiAdres =
      "https://api.github.com/repos/selimhanc/avrasya-websitesi-icerik-taslak/contents/" +
      klasor;
    return fetch(apiAdres)
      .then(function (yanit) {
        if (!yanit.ok) throw new Error("api");
        return yanit.json();
      })
      .then(function (dizi) {
        var adlar = [];
        dizi.forEach(function (girdi) {
          if (girdi.type === "file" && /\.(jpe?g|png|gif|webp)$/i.test(girdi.name)) {
            adlar.push(girdi.name);
          }
        });
        if (!adlar.length) throw new Error("bos");
        return adlar;
      })
      .catch(function () {
        return fetch(klasor + "/liste.json")
          .then(function (yanit) {
            if (!yanit.ok) throw new Error("liste");
            return yanit.json();
          })
          .then(function (dizi) {
            if (!Array.isArray(dizi) || !dizi.length) throw new Error("liste");
            return dizi;
          })
          .catch(function () {
            return null;
          });
      });
  }

  function popupAc(img) {
    if (!modAcik()) return;
    if (img.closest(".kart-gorsel")) return;
    hedefImg = img;

    var hedefKlasor = null;
    var kaynak = img ? img.getAttribute("src") : null;
    if (!kaynak && ekleGaleri) {
      var ilkGorsel = ekleGaleri.querySelector(".gallery img");
      if (ilkGorsel) kaynak = ilkGorsel.getAttribute("src");
    }
    var eslesme = /^(medya\/[^/]+)\//.exec(kaynak || "");
    if (eslesme) hedefKlasor = eslesme[1];

    var sayfadakiler = sayfadakiGorseller();
    if (!sayfadakiler.length && !hedefKlasor) return;

    var secili = img ? img.getAttribute("src") : null;

    function listeyiDoldur(srcListesi) {
      popupListe.innerHTML = "";
      srcListesi.forEach(function (src) {
        var kucuk = document.createElement("img");
        kucuk.src = src;
        kucuk.alt = "Görsel seçenekleri";
        if (src === secili) {
          kucuk.className = "secili";
        } else if (sayfadakiler.indexOf(src) !== -1) {
          kucuk.className = "kullaniliyor";
        }
        kucuk.addEventListener("click", function () {
          if (hedefImg) {
            gorselDegistir(hedefImg, src);
          } else {
            gorselEkle(src);
          }
        });
        popupListe.appendChild(kucuk);
      });
    }

    popup.classList.add("acik");
    listeyiDoldur(sayfadakiler);

    if (hedefKlasor) {
      gorselListesiCek(hedefKlasor).then(function (adlar) {
        if (!adlar || !popup.classList.contains("acik")) return;
        var hepsi = [];
        adlar.forEach(function (ad) {
          hepsi.push(hedefKlasor + "/" + ad);
        });
        sayfadakiler.forEach(function (src) {
          if (hepsi.indexOf(src) === -1) hepsi.push(src);
        });
        listeyiDoldur(hepsi);
      });
    }
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
        sayfaAdresi() +
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

      galeriTasiEkle(kapsayici);
    }
  }

  function galeriTasiEkle(kapsayici) {
    var galeri = kapsayici.closest(".gallery");
    if (!galeri) return;

    var suruklenen = null;

    function galeriSiralamasi() {
      return Array.prototype.map.call(galeri.querySelectorAll(".gallery figure"), function (f) {
        var im = f.querySelector("img");
        var src = im ? im.getAttribute("src") : "";
        return src ? src.split("/").pop() : "(görsel yok)";
      }).join(" > ");
    }

    if (galeri.dataset.surukleme !== "1") {
      galeri.dataset.surukleme = "1";

      galeri.addEventListener("dragover", function (e) {
        if (!suruklenen) return;
        e.preventDefault();
        var hedef = e.target.closest ? e.target.closest(".gallery figure") : null;
        Array.prototype.forEach.call(galeri.querySelectorAll(".gallery figure"), function (f) {
          f.classList.toggle("birakma-noktasi", f === hedef && f !== suruklenen);
        });
      });

      galeri.addEventListener("drop", function (e) {
        if (!suruklenen) return;
        e.preventDefault();
        var hedef = e.target.closest ? e.target.closest(".gallery figure") : null;
        var onceSira = galeriSiralamasi();
        if (hedef && hedef !== suruklenen) {
          var rect = hedef.getBoundingClientRect();
          var once = e.clientY < rect.top + rect.height / 2;
          if (once) galeri.insertBefore(suruklenen, hedef);
          else galeri.insertBefore(suruklenen, hedef.nextSibling);
        }
        var sonra = galeriSiralamasi();
        if (onceSira !== sonra) {
          window.avrasyaDegisiklikKaydet("Galeri • Sıralama", onceSira, sonra);
        }
        suruklenen.classList.remove("surukleniyor");
        Array.prototype.forEach.call(galeri.querySelectorAll(".gallery figure"), function (f) {
          f.classList.remove("birakma-noktasi");
        });
        suruklenen = null;
      });

      galeri.addEventListener("dragend", function () {
        if (suruklenen) suruklenen.classList.remove("surukleniyor");
        Array.prototype.forEach.call(galeri.querySelectorAll(".gallery figure"), function (f) {
          f.classList.remove("birakma-noktasi");
        });
        suruklenen = null;
      });
    }

    var tasi = document.createElement("button");
    tasi.type = "button";
    tasi.className = "galeri-tasi";
    tasi.title = "Görseli sürükle";
    tasi.draggable = true;
    tasi.innerHTML = ikon('<path d="M9 5h1v1H9V5zm5 0h1v1h-1V5zM9 11h1v1H9v-1zm5 0h1v1h-1v-1zM9 17h1v1H9v-1zm5 0h1v1h-1v-1z"></path>');
    kapsayici.appendChild(tasi);

    tasi.addEventListener("dragstart", function (e) {
      if (!modAcik()) { e.preventDefault(); return; }
      suruklenen = kapsayici;
      kapsayici.classList.add("surukleniyor");
      e.dataTransfer.effectAllowed = "move";
      try { e.dataTransfer.setData("text/plain", "galeri"); } catch (err) {}
    });
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
  function editeBagla(el) {
    elemanlar.push(el);
    el.contentEditable = modAcik() ? "true" : "false";
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
        sayfaAdresi() +
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
  }

  Array.prototype.forEach.call(document.querySelectorAll(seciciler), editeBagla);

  /* ---------- PLANLAMA SÜREÇLERİ ---------- */
  function stepsHazirla(liste) {
    var ekleBtn = document.createElement("button");
    ekleBtn.type = "button";
    ekleBtn.className = "step-ekle";
    ekleBtn.textContent = "+ Yeni Süreç Ekle";
    liste.appendChild(ekleBtn);

    function adimlariYenile() {
      Array.prototype.forEach.call(liste.querySelectorAll(".step"), function (step, i) {
        var num = step.querySelector(".step-num");
        if (num) num.textContent = i + 1;
      });
    }

    function siralamasi() {
      return Array.prototype.map.call(liste.querySelectorAll(".step"), function (s) {
        var h3 = s.querySelector("h3");
        return h3 ? h3.textContent.trim() : "(başlıksız)";
      }).join(" > ");
    }

    function stepBilgi(step) {
      var h3 = step.querySelector("h3");
      var p = step.querySelector("p");
      return (h3 ? h3.textContent.trim() : "") + " — " + (p ? p.textContent.trim() : "");
    }

    var suruklenen = null;

    function dugmeleri(adim) {
      var tasi = document.createElement("button");
      tasi.type = "button";
      tasi.className = "step-tasi";
      tasi.title = "Süreci sürükle";
      tasi.draggable = true;
      tasi.innerHTML = ikon('<path d="M9 5h1v1H9V5zm5 0h1v1h-1V5zM9 11h1v1H9v-1zm5 0h1v1h-1v-1zM9 17h1v1H9v-1zm5 0h1v1h-1v-1z"></path>');
      adim.appendChild(tasi);

      tasi.addEventListener("dragstart", function (e) {
        if (!modAcik()) { e.preventDefault(); return; }
        suruklenen = adim;
        adim.classList.add("surukleniyor");
        e.dataTransfer.effectAllowed = "move";
        try { e.dataTransfer.setData("text/plain", "step"); } catch (err) {}
      });

      var sil = document.createElement("button");
      sil.type = "button";
      sil.className = "step-sil";
      sil.title = "Bu süreci sil";
      sil.innerHTML = ikon(capiIkonu);
      adim.appendChild(sil);

      sil.addEventListener("mousedown", function (e) {
        e.preventDefault();
        e.stopPropagation();
      });

      sil.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var adimlar = liste.querySelectorAll(".step");
        var idx = Array.prototype.indexOf.call(adimlar, adim) + 1;
        var eski = stepBilgi(adim);
        adim.remove();
        adimlariYenile();
        window.avrasyaDegisiklikKaydet("Faaliyet Planlaması • Süreç Silindi (" + idx + ")", eski, "(silindi)");
      });
    }

    function yeniAdim() {
      var adim = document.createElement("div");
      adim.className = "step";
      adim.innerHTML =
        '<span class="step-num">' + (liste.querySelectorAll(".step").length + 1) + "</span>" +
        "<h3>Yeni Süreç Başlığı</h3>" +
        "<p>Yeni süreç açıklaması buraya yazılır.</p>";
      var h3 = adim.querySelector("h3");
      var p = adim.querySelector("p");
      editeBagla(h3);
      editeBagla(p);
      dugmeleri(adim);
      liste.insertBefore(adim, ekleBtn);
      return adim;
    }

    ekleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!modAcik()) return;
      var adim = yeniAdim();
      adimlariYenile();
      window.avrasyaDegisiklikKaydet("Faaliyet Planlaması • Yeni Süreç", "(yok)", stepBilgi(adim));
    });

    liste.addEventListener("dragover", function (e) {
      if (!suruklenen) return;
      e.preventDefault();
      var hedef = e.target.closest ? e.target.closest(".step") : null;
      Array.prototype.forEach.call(liste.querySelectorAll(".step"), function (s) {
        s.classList.toggle("birakma-noktasi", s === hedef && s !== suruklenen);
      });
    });

    liste.addEventListener("drop", function (e) {
      if (!suruklenen) return;
      e.preventDefault();
      var hedef = e.target.closest ? e.target.closest(".step") : null;
      var onceSirala = siralamasi();
      if (hedef && hedef !== suruklenen) {
        var rect = hedef.getBoundingClientRect();
        var once = e.clientY < rect.top + rect.height / 2;
        if (once) liste.insertBefore(suruklenen, hedef);
        else liste.insertBefore(suruklenen, hedef.nextSibling);
      }
      adimlariYenile();
      var sonra = siralamasi();
      if (onceSirala !== sonra) {
        window.avrasyaDegisiklikKaydet("Faaliyet Planlaması • Sıralama", onceSirala, sonra);
      }
      suruklenen.classList.remove("surukleniyor");
      Array.prototype.forEach.call(liste.querySelectorAll(".step"), function (s) {
        s.classList.remove("birakma-noktasi");
      });
      suruklenen = null;
    });

    liste.addEventListener("dragend", function () {
      if (suruklenen) suruklenen.classList.remove("surukleniyor");
      Array.prototype.forEach.call(liste.querySelectorAll(".step"), function (s) {
        s.classList.remove("birakma-noktasi");
      });
      suruklenen = null;
    });

    Array.prototype.forEach.call(liste.querySelectorAll(".step"), function (adim) {
      dugmeleri(adim);
    });
  }

  document.querySelectorAll(".steps").forEach(stepsHazirla);

  /* ---------- SSS SORU SIRALAMASI ---------- */
  function sssSiralamaHazirla(liste) {
    if (liste.dataset.surukleme === "1") return;
    liste.dataset.surukleme = "1";

    function tabAdi() {
      return liste.getAttribute("data-tab-ad") || "Genel";
    }

    function soruSiralamasi() {
      return Array.prototype.map.call(liste.querySelectorAll(".sss-item"), function (it) {
        var m = it.querySelector(".sss-metin");
        return m ? m.textContent.trim() : "(soru yok)";
      }).join(" > ");
    }

    function temizle() {
      Array.prototype.forEach.call(document.querySelectorAll(".sss-item.surukleniyor"), function (s) {
        s.classList.remove("surukleniyor");
      });
      Array.prototype.forEach.call(document.querySelectorAll(".sss-item"), function (s) {
        s.classList.remove("birakma-noktasi");
      });
    }

    function hedefiKonumaGoreBul(e, suruklenen) {
      var itemler = liste.querySelectorAll(".sss-item");
      var once = null;
      Array.prototype.forEach.call(itemler, function (it) {
        if (it === suruklenen) return;
        var r = it.getBoundingClientRect();
        if (e.clientY < r.top + r.height / 2 && !once) once = it;
      });
      return once;
    }

    function onceyeMi(e, hedef) {
      var r = hedef.getBoundingClientRect();
      return e.clientY < r.top + r.height / 2;
    }

    function soruMetni(it) {
      var m = it.querySelector(".sss-metin");
      return m ? m.textContent.trim() : "(soru yok)";
    }

    liste.addEventListener("dragover", function (e) {
      var suruklenen = document.querySelector(".sss-item.surukleniyor");
      if (!suruklenen) return;
      e.preventDefault();
      var hedef = e.target.closest ? e.target.closest(".sss-item") : null;
      Array.prototype.forEach.call(liste.querySelectorAll(".sss-item"), function (s) {
        s.classList.toggle("birakma-noktasi", s === hedef && s !== suruklenen);
      });
    });

    liste.addEventListener("drop", function (e) {
      var suruklenen = document.querySelector(".sss-item.surukleniyor");
      if (!suruklenen) return;
      e.preventDefault();
      var kaynakListe = suruklenen.closest(".sss-liste");
      var hedef = e.target.closest ? e.target.closest(".sss-item") : null;

      if (kaynakListe !== liste) {
        var kaynakAd = kaynakListe ? kaynakListe.getAttribute("data-tab-ad") || "Genel" : "Genel";
        var hedefAd = tabAdi();
        var metin = soruMetni(suruklenen);
        if (hedef && hedef !== suruklenen) {
          if (onceyeMi(e, hedef)) liste.insertBefore(suruklenen, hedef);
          else liste.insertBefore(suruklenen, hedef.nextSibling);
        } else {
          var goreli = hedefiKonumaGoreBul(e, suruklenen);
          if (goreli) liste.insertBefore(suruklenen, goreli);
          else liste.insertBefore(suruklenen, liste.querySelector(".sss-ekle"));
        }
        var sec = suruklenen.querySelector(".sss-tab-sec");
        if (sec) sssSeciciDoldur(sec);
        window.avrasyaDegisiklikKaydet("Sık Sorulan Sorular • Soru Sekmeye Taşındı", kaynakAd + " — " + metin, hedefAd + " — " + metin);
        if (liste.hidden) {
          Array.prototype.forEach.call(document.querySelectorAll(".sss-tab"), function (t) {
            if (t.getAttribute("data-tab-ad") === hedefAd) t.click();
          });
        }
        temizle();
        return;
      }

      var onceSira = soruSiralamasi();
      if (hedef && hedef !== suruklenen) {
        if (onceyeMi(e, hedef)) liste.insertBefore(suruklenen, hedef);
        else liste.insertBefore(suruklenen, hedef.nextSibling);
      } else if (!hedef) {
        var goreli = hedefiKonumaGoreBul(e, suruklenen);
        if (goreli) liste.insertBefore(suruklenen, goreli);
        else liste.insertBefore(suruklenen, liste.querySelector(".sss-ekle"));
      }
      var sonra = soruSiralamasi();
      if (onceSira !== sonra) {
        window.avrasyaDegisiklikKaydet("Sık Sorulan Sorular • " + tabAdi() + " • Sıralama", onceSira, sonra);
      }
      temizle();
    });

    liste.addEventListener("dragend", temizle);
  }

  function sssSeciciDoldur(sec) {
    var item = sec.closest(".sss-item");
    var mevcut = item ? item.closest(".sss-liste").getAttribute("data-tab-ad") || "Genel" : "Genel";
    sec.innerHTML = "";
    var tablar = document.querySelectorAll(".sss-tab");
    Array.prototype.forEach.call(tablar, function (t) {
      var ad = t.getAttribute("data-tab-ad");
      if (ad === "Tümü") return;
      var opt = document.createElement("option");
      opt.value = ad;
      opt.textContent = ad;
      sec.appendChild(opt);
    });
    sec.value = mevcut;
  }

  function sssSeciciYenile() {
    document.querySelectorAll(".sss-tab-sec").forEach(sssSeciciDoldur);
  }

  function sssItemHazirla(item) {
    if (item.querySelector(".sss-tasi")) return;
    var tasi = document.createElement("button");
    tasi.type = "button";
    tasi.className = "sss-tasi";
    tasi.title = "Soruyu sürükle";
    tasi.draggable = true;
    tasi.innerHTML = ikon('<path d="M9 5h1v1H9V5zm5 0h1v1h-1V5zM9 11h1v1H9v-1zm5 0h1v1h-1v-1zM9 17h1v1H9v-1zm5 0h1v1h-1v-1z"></path>');
    var soru = item.querySelector(".sss-soru");
    soru.insertBefore(tasi, soru.firstChild);

    tasi.addEventListener("dragstart", function (e) {
      if (!modAcik()) { e.preventDefault(); return; }
      item.classList.add("surukleniyor");
      e.dataTransfer.effectAllowed = "move";
      try { e.dataTransfer.setData("text/plain", "sss"); } catch (err) {}
    });

    var sec = document.createElement("select");
    sec.className = "sss-tab-sec";
    sec.title = "Soruyu başka sekmeye taşı";
    soru.insertBefore(sec, soru.querySelector(".sss-ac"));
    sssSeciciDoldur(sec);
    sec.addEventListener("change", function () {
      if (!modAcik()) return;
      var hedefAd = sec.value;
      var kaynakListe = item.closest(".sss-liste");
      var kaynakAd = kaynakListe ? kaynakListe.getAttribute("data-tab-ad") || "Genel" : "Genel";
      if (hedefAd === kaynakAd) return;
      var hedefListe = document.querySelector('.sss-liste[data-tab-ad="' + hedefAd + '"]');
      if (!hedefListe) return;
      var soruMetni = item.querySelector(".sss-metin");
      var metin = soruMetni ? soruMetni.textContent.trim() : "(soru yok)";
      hedefListe.insertBefore(item, hedefListe.querySelector(".sss-ekle"));
      sssSeciciDoldur(sec);
      window.avrasyaDegisiklikKaydet("Sık Sorulan Sorular • Soru Sekmeye Taşındı", kaynakAd + " — " + metin, hedefAd + " — " + metin);
      if (hedefListe.hidden) {
        Array.prototype.forEach.call(document.querySelectorAll(".sss-tab"), function (t) {
          if (t.getAttribute("data-tab-ad") === hedefAd) t.click();
        });
      }
    });
    soru.insertBefore(sec, soru.querySelector(".sss-ac"));
  }

  window.avrasyaSssSiralamaHazirla = sssSiralamaHazirla;
  window.avrasyaSssItemHazirla = sssItemHazirla;
  window.avrasyaSssSeciciYenile = sssSeciciYenile;

  document.querySelectorAll(".sss-liste").forEach(sssSiralamaHazirla);
  document.querySelectorAll(".sss-item").forEach(sssItemHazirla);
})();
