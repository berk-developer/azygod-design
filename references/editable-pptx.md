# Düzenlenebilir PPTX Dışa Aktarım: HTML Sert Kısıtlamaları + Boyut Kararları + Sık Hatalar

Bu belge **HTML öğelerini tek tek gerçek düzenlenebilir PowerPoint metin kutularına** çevirmek için `scripts/html2pptx.js` + `pptxgenjs` kullanım yolunu anlatır. `export_deck_pptx.mjs --mode image` (ekran görüntüsü taban, metin resme dönüşür, düzenlenemez) ile aynı şey değildir.

> **Çekirdek önkoşul**: Bu yolu kullanmak için HTML ilk satırdan itibaren aşağıdaki 4 kısıtlamaya uygun yazılmalıdır. **Yazdıktan sonra dönüştürme değil** — sonradan telafi 2-3 saatlik geri işlem tetikler (2026-04-20 opsiyon özel toplantı projesi gerçek ölçüm hatası).

---

## Tuval Boyutu: 960×540pt Kullan (LAYOUT_WIDE)

PPTX birimi **inch** (fiziksel boyut), px değil. Karar ilkesi: body'nin computedStyle boyutu **presentation layout inch boyutuyla eşleşmelidir** (±0.1", `html2pptx.js`'in `validateDimensions` tarafından zorunlu kontrol).

### 3 Aday Boyut Karşılaştırması

| HTML body | Fiziksel Boyut | Karşılık Gelen PPT layout | Ne Zaman Seçilir |
|---|---|---|---|
| **`960pt × 540pt`** | **13.333″ × 7.5″** | **pptxgenjs `LAYOUT_WIDE`** | ✅ **Varsayılan öneri** (modern PowerPoint 16:9 standart) |
| `720pt × 405pt` | 10″ × 5.625″ | Özel | Yalnızca kullanıcı "eski PowerPoint Widescreen" şablonu belirttiğinde |
| `1920px × 1080px` | 20″ × 11.25″ | Özel | ❌ Standart dışı boyut, projeksiyondan sonra yazı anormal derecede küçük görünür |

**HTML boyutunu çözünürlük olarak düşünme.** PPTX vektör belgedir, body boyutu **fiziksel boyutu** belirler, netliği değil. Aşırı büyük body (20″×11.25″) yazıyı daha net yapmaz — yalnızca yazı pt değerini tuvalde göreceli olarak küçültür, projeksiyon/baskıda görünüm daha kötü olur.

### body Yazma Şekli Üç Seçenek (Eşdeğer)

```css
body { width: 960pt;  height: 540pt; }    /* En net, öneri */
body { width: 1280px; height: 720px; }    /* Eşdeğer, px alışkanlığı */
body { width: 13.333in; height: 7.5in; }  /* Eşdeğer, inch sezgiselliği */
```

Eşlik eden pptxgenjs kodu:

```js
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';  // 13.333 × 7.5 inch, özel tanımlamaya gerek yok
```

---

## 4 Sert Kısıtlama (İhlal Doğrudan Hata Verir)

`html2pptx.js` HTML DOM'u öğe öğe PowerPoint nesnelerine çevirir. PowerPoint format kısıtlamaları HTML'e yansıması = aşağıdaki 4 kural.

### Kural 1: DIV İçinde Doğrudan Yazı Olamaz — `<p>` veya `<h1>`-`<h6>` ile Sarılmalı

```html
<!-- ❌ Hata: Yazı doğrudan div içinde -->
<div class="title">Q3 Gelir Artışı %23</div>

<!-- ✅ Doğru: Yazı <p> veya <h1>-<h6> içinde -->
<div class="title"><h1>Q3 Gelir Artışı %23</h1></div>
<div class="body"><p>Yeni kullanıcılar ana itici güç</p></div>
```

**Neden**: PowerPoint metni text frame içinde bulunmalıdır, text frame HTML paragraf seviyesi öğelere (p/h*/li) karşılık gelir. Çıplak `<div>` PPTX'te karşılık gelen metin kapsayıcısı yoktur.

**`<span>` Ana Metin Taşıyamaz** — span satır içi öğedir, bağımsız olarak metin kutusu hizalaması yapamaz. Span yalnızca **p/h\* içine** yerleştirilerek yerel stil (kalın, renk değiştirme) yapabilir.

### Kural 2: CSS Degrade Desteklenmez — Yalnızca Düz Renk

```css
/* ❌ Hata */
background: linear-gradient(to right, #FF6B6B, #4ECDC4);

/* ✅ Doğru: Düz renk */
background: #FF6B6B;

/* ✅ Çok renkli şerit şartsa, flex alt öğeleriyle kendi düz rengi */
.stripe-bar { display: flex; }
.stripe-bar div { flex: 1; }
.red   { background: #FF6B6B; }
.teal  { background: #4ECDC4; }
```

**Neden**: PowerPoint shape fill yalnızca solid/gradient-fill iki türü destekler, ama pptxgenjs `fill: { color: ... }` yalnızca solid'i eşler. Degrade PowerPoint yerel gradient ile gitmek ayrı yapı gerektirir, mevcut araç zinciri desteklemez.

### Kural 3: Arka Plan/Kenarlık/Gölge Yalnızca DIV'de Olabilir, Yazı Etiketinde Olamaz

```html
<!-- ❌ Hata: <p> arka plan rengi var -->
<p style="background: #FFD700; border-radius: 4px;">Kilit içerik</p>

<!-- ✅ Doğru: Dış div arka planı/kısıtlaması taşır, <p> yalnızca yazıdan sorumlu -->
<div style="background: #FFD700; border-radius: 4px; padding: 8pt 12pt;">
  <p>Kilit içerik</p>
</div>
```

**Neden**: PowerPoint'te shape (kare/yuvarlak dikdörtgen) ve text frame iki nesnedir. HTML `<p>` yalnızca text frame'e çevrilir, arka plan/kenarlık/gölge shape'e aittir — **metni saran div** üzerinde yazılmalıdır.

### Kural 4: DIV `background-image` Kullanamaz — `<img>` Etiketi Kullan

```html
<!-- ❌ Hata -->
<div style="background-image: url('chart.png')"></div>

<!-- ✅ Doğru -->
<img src="chart.png" style="position: absolute; left: 50%; top: 20%; width: 300pt; height: 200pt;" />
```

**Neden**: `html2pptx.js` yalnızca `<img>` öğesinden resim yolu çıkarır, CSS `background-image` URL'sini ayrıştırmaz.

---

## Path A HTML Şablon İskeleti

Her slide bağımsız bir HTML dosyası, birbirinden kapsam izole edilir (tek dosya deck CSS kirliliğinden kaçınır).

```html
<!DOCTYPE html>
<html lang="tr-TR">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 960pt; height: 540pt;           /* ⚠️ LAYOUT_WIDE ile eşleş */
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    background: #FEFEF9;                    /* Düz renk, degrade olamaz */
    overflow: hidden;
  }
  /* DIV yerleşim/arka plan/kenarlıktan sorumlu */
  .card {
    position: absolute;
    background: #1A4A8A;                    /* Arka plan DIV üzerinde */
    border-radius: 4pt;
    padding: 12pt 16pt;
  }
  /* Yazı etiketi yalnızca yazı tipi stilinden sorumlu, arka plan/kenarlık eklemez */
  .card h2 { font-size: 24pt; color: #FFFFFF; font-weight: 700; }
  .card p  { font-size: 14pt; color: rgba(255,255,255,0.85); }
</style>
</head>
<body>

  <!-- Başlık alanı: dış div konumlandırma, iç yazı etiketi -->
  <div style="position: absolute; top: 40pt; left: 60pt; right: 60pt;">
    <h1 style="font-size: 36pt; color: #1A1A1A; font-weight: 700;">Başlık iddia cümlesi kullan, konu kelimesi değil</h1>
    <p style="font-size: 16pt; color: #555555; margin-top: 10pt;">Altyazı ek açıklama</p>
  </div>

  <!-- İçerik kartı: div arka plandan sorumlu, h2/p yazıdan sorumlu -->
  <div class="card" style="top: 130pt; left: 60pt; width: 240pt; height: 160pt;">
    <h2>Kilit nokta bir</h2>
    <p>Kısa açıklama metni</p>
  </div>

  <!-- Liste: ul/li kullan, elle • sembolü kullanma -->
  <div style="position: absolute; top: 320pt; left: 60pt; width: 540pt;">
    <ul style="font-size: 16pt; color: #1A1A1A; padding-left: 24pt; list-style: disc;">
      <li>İlk kilit nokta</li>
      <li>İkinci kilit nokta</li>
      <li>Üçüncü kilit nokta</li>
    </ul>
  </div>

  <!-- İllüstrasyon: <img> etiketi kullan, background-image kullanma -->
  <img src="illustration.png" style="position: absolute; right: 60pt; top: 110pt; width: 320pt; height: 240pt;" />

</body>
</html>
```

---

## Sık Hatalar Hızlı Arama

| Hata Mesajı | Neden | Düzeltme Yöntemi |
|---------|------|---------|
| `DIV element contains unwrapped text "XXX"` | div içinde çıplak yazı var | Yazıyı `<p>` veya `<h1>`-`<h6>` içine sar |
| `CSS gradients are not supported` | linear/radial-gradient kullanıldı | Düz renge geç, veya flex alt öğeleriyle böl |
| `Text element <p> has background` | `<p>` etiketi arka plan rengi ekledi | Dış `<div>` arka planı taşısın, `<p>` yalnızca yazı yazsın |
| `Background images on DIV elements are not supported` | div background-image kullandı | `<img>` etiketine geç |
| `HTML content overflows body by Xpt vertically` | İçerik 540pt'yi aştı | İçeriği azalt veya yazı boyutunu küçült, veya `overflow: hidden` ile kes |
| `HTML dimensions don't match presentation layout` | body boyutu pres layout ile uyuşmuyor | body `960pt × 540pt` kullan `LAYOUT_WIDE` ile; veya defineLayout özel boyut |
| `Text box "XXX" ends too close to bottom edge` | Büyük yazı `<p>` body alt kenarına < 0.5 inch | Yukarı kaydır, alt boşluğu artır; PPT alt kısmı zaten bir kısmı kapatır |

---

## Temel İş Akışı (3 Adımda PPTX)

### Adım 1: Kısıtlamalara Göre Her Sayfa Bağımsız HTML Yaz

```
BenimDeck'im/
├── slides/
│   ├── 01-cover.html    # Her dosya tam 960×540pt HTML
│   ├── 02-agenda.html
│   └── ...
└── illustration/        # Tüm <img> referans resimleri
    ├── chart1.png
    └── ...
```

### Adım 2: build.js Yaz `html2pptx.js`'i Çağıran

```js
const pptxgen = require('pptxgenjs');
const html2pptx = require('../scripts/html2pptx.js');  // Bu skill betiği

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';  // 13.333 × 7.5 inch, HTML'in 960×540pt ile eşleşir

  const slides = ['01-cover.html', '02-agenda.html', '03-content.html'];
  for (const file of slides) {
    await html2pptx(`./slides/${file}`, pres);
  }

  await pres.writeFile({ fileName: 'deck.pptx' });
})();
```

### Adım 3: Aç ve Kontrol Et

- PowerPoint/Keynote ile dışa aktarılan PPTX'i aç
- Herhangi bir yazıya çift tıklamak doğrudan düzenlenebilmeli (resimse kural 1 ihlal edilmiş demektir)
- Overflow doğrulama: Her sayfa body aralığı içinde olmalı, kesilmemiş olmalı

---

## Bu Yol vs Diğer Seçenekler (Ne Zaman Hangisi)

| İhtiyaç | Ne Seçilir |
|------|------|
| Meslektaş PPTX'teki yazıyı değiştirecek / teknik olmayan kişilere gönderip düzenlemesini isteyecek | **Bu yol** (düzenlenebilir, 4 kurala uygun HTML ilk satırdan yazılmalı) |
| Sadece sunum kullanımı / arşiv gönderimi, bir daha değiştirilmeyecek | `export_deck_pdf.mjs` (çoklu dosya) veya `export_deck_stage_pdf.mjs` (tek dosya deck-stage), vektör PDF çıkar |
| Görsel özgürlük öncelikli (animasyon, web bileşeni, CSS degrade, karmaşık SVG), düzenlenemez kabul edilebilir | `export_deck_pptx.mjs --mode image` (resim tabanlı PPTX) |

**Görsel özgürlükle yazılmış HTML üzerinde asla zorla html2pptx çalıştırma** — gerçek ölçüm görsel güdümlü HTML geçiş oranı <%30, kalan sayfa sayfa dönüştürme yeniden yazmaktan yavaş.

---

## Neden 4 Kural Bug Değil Fiziksel Kısıtlamadır

Bu 4 kural `html2pptx.js` yazarının tembelliği değil — bunlar **PowerPoint dosya formatının (OOXML) kendi kısıtlamalarının** HTML'e yansımasıdır:

- PPTX'te yazı text frame (`<a:txBody>`) içinde olmalıdır, HTML paragraf seviyesi öğelere karşılık gelir
- PPTX'te shape ve text frame iki nesnedir, aynı elementte hem arka plan çizip hem yazı yazılamaz
- PPTX'te shape fill degrade desteği sınırlıdır (yalnızca bazı preset degradeler, CSS rastgele açı degrade desteklemez)
- PPTX'te picture nesnesi gerçek resim dosyasına referans vermelidir, CSS özelliği değil

Bunu anladıktan sonra, **aracın zeki olmasını bekleme** — HTML yazımının PPTX formatına uyum sağlaması gerekir, tersi değil.
