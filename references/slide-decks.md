# Slayt Deckleri: HTML Slayt Yapım Spesifikasyonu

Slayt yapmak tasarım çalışmalarının sık karşılaşılan bir senaryosudur. Bu doküman HTML slaytların nasıl iyi yapılacağını açıklar — mimari seçimden, tek sayfa tasarımına, PDF/PPTX dışa aktarımının tam yoluna kadar.

**Bu skill'in yetenek kapsamı**:
- HTML oynatma/PDF dışa aktarım → Bu doküman + `scripts/export_deck_pdf.mjs` / `scripts/export_deck_stage_pdf.mjs`
- Düzenlenebilir PPTX dışa aktarım → `references/editable-pptx.md` + `scripts/html2pptx.js` + `scripts/export_deck_pptx.mjs --mode editable`
- Görsel tabanlı PPTX (düzenlenemez ama görsel bütünlük) → `scripts/export_deck_pptx.mjs --mode image`

---

## 🛑 İşe Başlamadan Önce Teslimat Formatını Onayla (En Sert Kontrol Noktası)

**Bu karar "tek dosya mı çoklu dosya mı" sorusundan daha önce gelir.** 2026-04-20 opsiyon özel yönetim kurulu projesi gerçek ölçümü: **İşe başlamadan önce teslimat formatını onaylamamak = 2-3 saat yeniden çalışma.**

### Karar Ağacı

```
│ Soru: Son teslimat olarak ne isteniyor?
├── Sadece tarayıcı tam ekran sunum / yerel HTML    → En görsel özgürlük, dilediğin gibi yap
├── PDF isteniyor (yazdırma / grupta paylaşma / arşiv)      → En görsel özgürlük, her mimari dışa aktarılabilir
└── Düzenlenebilir PPTX isteniyor (meslektaş metin değiştirecek)    → 🛑 İlk HTML satırından itibaren `references/editable-pptx.md` içindeki 4 sert kısıtlamaya göre yaz
```

### Neden "PPTX İsteniyorsa Baştan Yol A'ya Uymak Gerekir"

PPTX düzenlenebilir olmasının önkoşulu `html2pptx.js`'nin DOM'u öğe öğe PowerPoint nesnesine çevirmesidir. Bunun için **4 sert kısıtlama** gerekir:

1. body sabit 720pt × 405pt (1920×1080px değil)
2. Tüm metin `<p>`/`<h1>`-`<h6>` içinde olmalı (div doğrudan metin taşıyamaz, `<span>` ana metin taşıyıcı olarak kullanılamaz)
3. `<p>`/`<h*>` kendisi background/border/shadow taşıyamaz (dış div'e koy)
4. `<div>` `background-image` kullanamaz (`<img>` etiketi kullan)
5. CSS gradient kullanma, web component kullanma, karmaşık SVG dekorasyon kullanma

**Bu skill'in varsayılan HTML görsel özgürlüğü yüksektir** — bolca span, iç içe flex, karmaşık SVG, web component (örneğin `<deck-stage>`), CSS gradyan — **neredeyse hiçbiri html2pptx kısıtlamalarını doğal olarak geçemez** (gerçek ölçüm: görsel odaklı HTML doğrudan html2pptx'e verildiğinde, pass oranı < 30%).

### İki Gerçek Yolun Maliyet Karşılaştırması (2026-04-20 Gerçek Hata Kaydı)

| Yol | Yapılacak | Sonuç | Maliyet |
|------|------|------|------|
| ❌ **Önce özgürce HTML yaz, sonra PPTX'i düzelt** | Tek dosya deck-stage + bolca SVG/span dekorasyon | Düzenlenebilir PPTX için iki yol kalır:<br>A. Elle pptxgenjs yüzlerce satır hardcode koordinat yaz<br>B. 17 sayfa HTML'i Yol A formatında yeniden yaz | 2-3 saat yeniden çalışma, ve elle yazılan sürümün **bakım maliyeti sonsuzdur** (HTML'de bir harf değişince, PPTX elle yeniden senkronize edilmeli) |
| ✅ **İlk Adımdan İtibaren Yol A Kısıtlamalarına Uy** | Her sayfa bağımsız HTML + 4 sert kısıtlama + 720×405pt | Tek komutla %100 düzenlenebilir PPTX dışa aktarır, aynı zamanda tarayıcı tam ekran sunum da yapılabilir (Yol A HTML'i zaten tarayıcıda oynatılabilir standart HTML'dir) | HTML yazarken 5 dakika fazla düşün "metni nasıl `<p>` içine sokarım", sıfır yeniden çalışma |

### İşe Başlama Diyaloğu (Kopyala Kullan)

> İşe başlamadan önce teslimat formatını onaylayalım:
> - **Tarayıcı sunum / PDF** → En görsel özgürlüklü şekilde yaparım (animasyon, web component, karmaşık SVG, CSS gradyan kullanabilirim)
> - **Düzenlenebilir PPTX gerekir** (meslektaş metin değiştirecek) → Baştan itibaren `references/editable-pptx.md` içindeki 4 sert kısıtlamaya göre HTML yazmam gerekir. Görsel yetenekler biraz azalır (gradyan yok, web component yok, karmaşık SVG yok), ama dışa aktarım tek komuttur
>
> Hangisini seçersin?

### Karma Teslimat Ne Zaman Gerekir

Kullanıcı "HTML sunum **ve** düzenlenebilir PPTX istiyorum" derse — **Bu karma değil**, PPTX ihtiyacı HTML ihtiyacını kapsar. Yol A'ya göre yazılan HTML zaten tarayıcıda tam ekran sunum yapabilir (bir `deck_index.html` birleştirici eklemek yeterli). **Ekstra maliyet yok.**

Kullanıcı "PPTX **ve** animasyon / web component istiyorum" derse — **Bu gerçek çelişki**. Kullanıcıya söyleyin: Düzenlenebilir PPTX için bu görsel yeteneklerden feragat etmek gerekir. Kararı ona bırakın, gizlice elle pptxgenjs çözümü yapmayın (sonsuz bakım borcu olur).

### İş Bittikten Sonra PPTX İstendiğinde Ne Yapılır (Acil Müdahale)

Çok nadir durum: HTML zaten yazıldıktan sonra PPTX istenir. Bu iki seçenek de mükemmel değil:

1. **Görsel tabanlı PPTX** (`scripts/export_deck_pptx.mjs` image modu) — Görsel %100 bütünlük ama metin düzenlenemez. "Sunumda PPT oynatılacak, içerik değiştirilmeyecek" senaryolarına uyar
2. **Elle pptxgenjs yeniden inşa** (Her sayfa için addText/addShape + grafik PNG gömme) — Metin düzenlenebilir ama konum, yazı tipi, hizalama elle ayarlanmalı, bakım maliyeti yüksek. **Sadece kullanıcı "HTML kaynağı değişirse PPTX'i yeniden elle ayarlamayı kabul ediyorum" derse bu yolu seç**

Her zaman öncelikle seçimi kullanıcıya söyleyin, kararı ona bırakın. **Asla ilk tepki olarak elle pptxgenjs yazmaya başlamayın** — bu son çare yedek yoldur.

---

## 🛑 Önce Mimariyi Belirle: Tek Dosya mı Çoklu Dosya mı?

**Bu seçim slayt yapımının ilk adımıdır, yanlış seçim tekrar tekrar hata demektir. Bu bölümü bitirmeden işe başlama.**

### İki Mimari Karşılaştırması

| Boyut | Tek Dosya + `deck_stage.js` | **Çoklu Dosya + `deck_index.html` Birleştirici** |
|------|--------------------------|--------------------------------------|
| Kod yapısı | Bir HTML, tüm slayt'lar `<section>` | Her sayfa bağımsız HTML, `index.html` iframe ile birleştirir |
| CSS kapsamı | ❌ Global, bir sayfanın stili tüm sayfaları etkileyebilir | ✅ Doğal izolasyon, iframe'ler kendi dünyalarında |
| Doğrulama granülaritesi | ❌ JS goTo ile sayfa değiştirmek gerekir | ✅ Tek sayfa dosyası çift tıklamayla tarayıcıda açılır |
| Paralel geliştirme | ❌ Tek dosya, çok agent değişikliği çakışır | ✅ Çok agent farklı sayfaları paralel yapabilir, sıfır çakışma |
| Hata ayıklama zorluğu | ❌ Bir CSS hatası, tüm deck çöker | ✅ Bir sayfa hatası sadece kendini etkiler |
| Gömülü etkileşim | ✅ Sayfalar arası durum paylaşımı kolay | 🟡 iframe'ler arası postMessage gerekir |
| PDF yazdırma | ✅ Yerleşik | ✅ Birleştirici beforeprint iframe'leri dolaşır |
| Klavye navigasyonu | ✅ Yerleşik | ✅ Birleştirici yerleşik |

### Hangisini Seç? (Karar Ağacı)

```
│ Soru: deck tahmini kaç sayfa?
├── ≤10 sayfa, deck içi animasyon veya sayfalar arası etkileşim gerekir, pitch deck → Tek dosya
└── ≥10 sayfa, akademik sunum, ders notları, uzun deck, çok agent paralel → Çoklu dosya (önerilen)
```

**Varsayılan olarak çoklu dosya yolunu izle**. O "alternatif" değil, **uzun deck ve ekip işbirliğinin ana yoludur**. Sebep: Tek dosya mimarisinin her avantajı (klavye navigasyonu, yazdırma, scale) çoklu dosyada da var, ama çoklu dosyanın kapsam izolasyonu ve doğrulanabilirliği tek dosyada telafi edilemez.

### Neden Bu Kural Bu Kadar Sert? (Gerçek Kaza Kaydı)

Tek dosya mimarisi bir AI psikolojisi sunum deck yapımında dört hata üst üste yaptı:

1. **CSS spesifikite geçersiz kılma**: `.emotion-slide { display: grid }` (spesifikite 10) `deck-stage > section { display: none }` (spesifikite 2) üzerine baskın çıktı, tüm sayfalar aynı anda render edilip üst üste bindi.
2. **Shadow DOM slot kuralı dış CSS tarafından ezildi**: `::slotted(section) { display: none }` dış kuralın geçersiz kılmasına dayanamadı, section'lar gizlenmeyi reddetti.
3. **localStorage + hash navigasyon yarış koşulu**: Yenileme sonrası hash konumuna atlamadı, localStorage kayıtlı eski konumda kaldı.
4. **Doğrulama maliyeti yüksek**: Bir sayfa yakalamak için `page.evaluate(d => d.goTo(n))` yapmak gerekli, doğrudan `goto(file://.../slides/05-X.html)`'den iki kat yavaş ve sık sık hata veriyor.

Tüm kök neden **tek global namespace** — çoklu dosya mimarisi bu sorunları fiziksel katmanla ortadan kaldırır.

---

## Yol A (Varsayılan): Çoklu Dosya Mimarisi

### Dizin Yapısı

```
BenimDeckim/
├── index.html              # assets/deck_index.html'den kopyala, MANIFEST'i değiştir
├── shared/
│   ├── tokens.css          # Paylaşılan tasarım token'ları (renk paleti/yazı boyutu/sık kullanılan chrome)
│   └── fonts.html          # <link> Google Fonts tanıtımı (her sayfa include eder)
└── slides/
    ├── 01-cover.html       # Her dosya tam 1920×1080 HTML
    ├── 02-agenda.html
    ├── 03-problem.html
    └── ...
```

### Her Slayt'ın Şablon İskeleti

```html
<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<title>P05 · Bölüm Başlığı</title>
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
<link rel="stylesheet" href="../shared/tokens.css">
<style>
  /* Bu sayfaya özgü stiller. Herhangi bir class adı diğer sayfaları kirletmez. */
  body { padding: 120px; }
  .my-thing { ... }
</style>
</head>
<body>
  <!-- 1920×1080 içerik (body'nin width/height'i tokens.css içinde kilitlenmiş) -->
  <div class="page-header">...</div>
  <div>...</div>
  <div class="page-footer">...</div>
</body>
</html>
```

**Kritik Kısıtlamalar**:
- `<body>` tuvaldir, doğrudan üzerinde düzenleme yap. `<section>` veya başka wrapper sarma.
- `width: 1920px; height: 1080px` `shared/tokens.css` içindeki `body` kuralıyla kilitlenir.
- `shared/tokens.css`'i paylaşılan tasarım token'ları için (renk paleti, yazı boyutu adımları, page-header/footer vb.) referans al.
- Yazı tipi `<link>`'i her sayfa kendi yazsın (font'ları ayrı import etmek pahalı değil, ve her sayfanın bağımsız açılabilirliğini garanti eder).

### Birleştirici: `deck_index.html`

**Doğrudan `assets/deck_index.html`'den kopyala**. Sadece bir yer değiştirmen gerekir — `window.DECK_MANIFEST` dizisi, tüm slayt dosya adlarını ve insan tarafından okunabilir etiketleri sırayla listele:

```js
window.DECK_MANIFEST = [
  { file: "slides/01-cover.html",    label: "Kapak" },
  { file: "slides/02-agenda.html",   label: "İçindekiler" },
  { file: "slides/03-problem.html",  label: "Sorun Tanımı" },
  // ...
];
```

Birleştirici yerleşik olarak içerir: Klavye navigasyonu (←/→/Home/End/sayı tuşları/P yazdırma), scale + letterbox, sağ alt sayaç, localStorage hafıza, hash atlama, yazdırma modu (iframe'leri dolaşıp sayfa sayfa PDF çıktısı).

### Tek Sayfa Doğrulama (Çoklu Dosya Mimarisi'nin Katil Özelliği)

Her slayt bağımsız HTML'dir. **Birini bitir bitirmez tarayıcıda çift tıklayarak aç**:

```bash
open slides/05-personas.html
```

Playwright ekran görüntüsü de doğrudan `goto(file://.../slides/05-personas.html)` ile alınır, JS atlama gerekmez, diğer sayfaların CSS'i de müdahale etmez. Bu "bir değişiklik bir doğrulama" iş akışının maliyetini neredeyse sıfıra indirir.

### Paralel Geliştirme

Her slayt görevini farklı agent'lara böl, aynı anda çalıştır — HTML dosyaları birbirinden bağımsızdır, merge sırasında çakışma olmaz. Uzun deck'lerde bu paralel yöntem yapım süresini 1/N'ye indirir.

### `shared/tokens.css` Ne İçin Kullanılır

Sadece **gerçekten sayfalar arası paylaşılan** şeyleri koy:

- CSS değişkenleri (renk paleti, yazı boyutu adımları, boşluk adımları)
- `body { width: 1920px; height: 1080px; }` gibi tuval kilitleme
- `.page-header` / `.page-footer` gibi her sayfada birebir aynı olan chrome

**Koyma**: Tek sayfa düzen class'larını buraya sokma — bu tek dosya mimarisinin global kirlilik sorununa geri döner.

---

## Yol B (Küçük deck): Tek Dosya + `deck_stage.js`

≤10 sayfa, sayfalar arası durum paylaşımı gerekir (örneğin bir React tweaks paneli tüm sayfaları kontrol edecek), veya pitch deck demo gibi aşırı kompakt senaryolar için uygundur.

### Temel Kullanım

1. `assets/deck_stage.js` içeriğini oku, HTML'nin `<script>`'ine göm (veya `<script src="deck_stage.js">`)
2. body içinde `<deck-stage>` ile slayt'ları sar
3. 🛑 **script etiketi `</deck-stage>`'den sonra olmalı** (aşağıdaki sert kısıtlamaya bak)

```html
<body>

  <deck-stage>
    <section>
      <h1>Slide 1</h1>
    </section>
    <section>
      <h1>Slide 2</h1>
    </section>
  </deck-stage>

  <!-- ✅ Doğru: script deck-stage'den sonra -->
  <script src="deck_stage.js"></script>

</body>
```

### 🛑 Script Konumu Sert Kısıtlaması (2026-04-20 Gerçek Hata)

**`<script src="deck_stage.js">`'i `<head>` içine koyamazsın.** `<head>` içinde `customElements` tanımlasa bile, parser `<deck-stage>` başlangıç etiketine ulaştığında `connectedCallback` tetiklenir — bu noktada alt `<section>` henüz parse edilmemiştir, `_collectSlides()` boş dizi alır, sayaç `1 / 0` gösterir, tüm sayfalar aynı anda üst üste render edilir.

**Üç uygun yazım** (herhangi biri seçilebilir):

```html
<!-- ✅ En önerilen: script </deck-stage>'den sonra -->
</deck-stage>
<script src="deck_stage.js"></script>

<!-- ✅ Ayrıca: script head'de ama defer ile -->
<head><script src="deck_stage.js" defer></script></head>

<!-- ✅ Ayrıca: module script doğal defer -->
<head><script src="deck_stage.js" type="module"></script></head>
```

`deck_stage.js` kendisi `DOMContentLoaded` gecikmeli toplama savunması yerleşik olarak içerir, script head'e konduğunda bile tamamen çökmez — ama `defer` veya body altına yerleştirmek daha temiz bir yaklaşımdır, savunma dalına bağımlı kalmaktan kaçınır.

### ⚠️ Tek Dosya Mimarisi CSS Tuzakları (Mutlaka Okunmalı)

Tek dosya mimarisinin en yaygın çukuru — **`display` özelliği tek sayfa stili tarafından çalınır**.

Yaygın hata pozisyonu 1 (doğrudan section'a display: flex yazmak):

```css
/* ❌ Dış CSS spesifikitesi 2, shadow DOM ::slotted(section){display:none}'u (2) geçersiz kılar */
deck-stage > section {
  display: flex;            /* Tüm sayfalar aynı anda üst üste render edilir! */
  flex-direction: column;
  padding: 80px;
  ...
}
```

Yaygın hata pozisyonu 2 (section'da daha yüksek spesifikiteli class):

```css
.emotion-slide { display: grid; }   /* Spesifikite: 10, daha kötü */
```

İkisi de **tüm slayt'ların aynı anda üst üste render edilmesine** neden olur — sayaç `1 / 10` göstererek normalmiş gibi davranabilir, ama görsel olarak birinci sayfa ikinciyi, ikinci üçüncüyü kapatır.

### ✅ Başlangıç CSS (İşe Başlarken Doğrudan Kopyala, Çukura Düşme)

**section kendisi** sadece "görünür/görünmez"den sorumlu; **düzen (flex/grid vb.) `.active` üzerine yazılır**:

```css
/* section sadece display dışı genel stilleri tanımlar */
deck-stage > section {
  background: var(--paper);
  padding: 80px 120px;
  overflow: hidden;
  position: relative;
  /* ⚠️ Buraya display yazma! */
}

/* "Aktif olmayan = gizli" kilidi — spesifikite + ağırlık çift güvencesi */
deck-stage > section:not(.active) {
  display: none !important;
}

/* Aktif sayfa ihtiyaç duyduğu display + düzeni yaz */
deck-stage > section.active {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Yazdırma modu: Tüm sayfalar gösterilmeli, :not(.active)'ı geçersiz kıl */
@media print {
  deck-stage > section { display: flex !important; }
  deck-stage > section:not(.active) { display: flex !important; }
}
```

Alternatif çözüm: **Tek sayfa flex/grid'ini iç wrapper `<div>` üzerine yaz**, section kendisi her zaman sadece `display: block/none` değiştiricisi olarak kalır. Bu en temiz yaklaşımdır:

```html
<deck-stage>
  <section>
    <div class="slide-content flex-layout">...</div>
  </section>
</deck-stage>
```

### Özel Boyut

```html
<deck-stage width="1080" height="1920">
  <!-- 9:16 Dikey -->
</deck-stage>
```

---

## Slayt Etiketleri

Deck_stage ve deck_index her sayfaya etiket verir (sayaçta gösterilir). Onlara **daha anlamlı** etiketler ver:

**Çoklu dosya**: `MANIFEST` içinde `{ file, label: "04 Sorun Tanımı" }` yaz
**Tek dosfa**: section'a `<section data-screen-label="04 Problem Statement">` ekle

**Kritik: Slayt numaralandırma 1'den başlar, 0'dan değil**.

Kullanıcı "slide 5" dediğinde, beşinci sayfayı kasteder, asla dizi pozisyonu `[4]` değildir. İnsanlar 0-indexed konuşmaz.

---

## Konuşmacı Notları

**Varsayılan olarak ekleme**, sadece kullanıcı açıkça istediğinde ekle.

Konuşmacı notları eklendiğinde slayt üzerindeki metni minimuma indirebilir, etkili görsellere odaklanabilirsin — notlar tam script'i taşır.

### Format

**Çoklu dosya**: `index.html`'in `<head>` içinde yaz:

```html
<script type="application/json" id="speaker-notes">
[
  "1. slayt'ın script'i...",
  "2. slayt'ın script'i...",
  "..."
]
</script>
```

**Tek dosya**: Aynı konumda.

### Not Yazım Püf Noktaları

- **Tam**: Özet değil, gerçekten söylenecek sözler
- **Konuşma tarzı**: Günlük konuşma gibi, yazı dili değil
- **Karşılık**: Dizinin N'inci öğesi N'inci slayt'a karşılık gelir
- **Uzunluk**: 200-400 kelime ideal
- **Duygu çizgisi**: Vurgu, duraklama, vurgu noktalarını işaretle

---

## Slayt Tasarım Kalıpları

### 1. Bir Sistem Kur (Zorunlu)

Tasarım bağlamını keşfettikten sonra, **önce kullanacağın sistemi sesli olarak söyle**:

```markdown
Deck Sistemi:
- Arka plan rengi: En fazla 2 (90% beyaz + 10% koyu bölüm ayırıcı)
- Yazı tipi: display için Instrument Serif, body için Geist Sans
- Ritim: bölüm ayırıcı full-bleed renkli + beyaz metin, normal slayt beyaz zemin
- Görsel: hero slayt full-bleed fotoğraf, data slayt grafik

Ben bu sisteme göre yapıyorum, sorun olursa söyle.
```

Kullanıcı onayladıktan sonra devam et.

### 2. Sık Kullanılan Slayt Düzenleri

- **Title slide**: Düz renk arka plan + devasa başlık + alt başlık + yazar/tarih
- **Section divider**: Renkli arka plan + bölüm numarası + bölüm başlığı
- **Content slide**: Beyaz zemin + başlık + 1-3 madde
- **Data slide**: Başlık + büyük grafik/sayı + kısa açıklama
- **Image slide**: Full-bleed fotoğraf + alt küçük caption
- **Quote slide**: Boşluk + devasa alıntı + kaynak
- **Two-column**: Sol-sağ karşılaştırma (vs / before-after / problem-solution)

Bir deck'te en fazla 4-5 düzen kullan.

### 3. Scale (Tekrar Vurgu)

- Gövde metni minimum **24px**, ideal 28-36px
- Başlık **60-120px**
- Hero metni **180-240px**
- Slayt 10 metre uzaktan izlenir, yazılar yeterince büyük olmalı

### 4. Görsel Ritim

Deck **bilinçli çeşitlilik** gerektirir:

- Renk ritmi: Çoğunlukla beyaz zemin + ara sıra renkli bölüm ayırıcı + ara sıra koyu parça
- Yoğunluk ritmi: Birkaç metin-ağırlıklı + birkaç görsel-ağırlıklı + birkaç alıntı boşluğu
- Yazı boyutu ritmi: Normal başlık + ara sıra devasa hero metni

**Her slayt aynı görünmesin** — Bu PPT şablonudur, tasarım değil.

### 5. Alan Nefesi (Veri Yoğun Sayfalar İçin Okunmalı)

**Yeni başlayanların en kolay düştüğü çukur**: Tüm bilgiyi bir sayfaya tıkıştırmak.

Bilgi yoğunluğu ≠ Etkili bilgi iletimi. Akademik/sunum deck'lerinde özellikle ölçülü ol:

- Liste/matris sayfaları: N öğeyi aynı boyutta çizmeyin. **Ana-ikincil katmanlama** kullanın — bugün konuşulacak 5 öğeyi büyüt ana karakter yap, geri kalan 16'yı küçült arka plan ipucu yap.
- Büyük sayı sayfaları: Sayının kendisi görsel ana karakterdir. Etrafındaki caption 3 satırı geçmemeli, aksi halde izleyici gözü ileri geri zıplar.
- Alıntı sayfaları: Alıntı ve kaynak arasında boşluk olmalı, birbirine yapışmamalı.

"Veri ana karakter mi" ve "metinler birbirine yapışmış mı" iki kriterine göre öz değerlendirme yap, boşluk seni biraz rahatsız edene kadar düzenle.

---

## PDF Olarak Yazdırma

**Çoklu dosya**: `deck_index.html` `beforeprint` olayını işler, sayfa sayfa PDF çıktısı verir.

**Tek dosya**: `deck_stage.js` aynı şekilde işler.

Yazdırma stilleri zaten yazılmış, ek `@media print` CSS yazmaya gerek yok.

---

## PPTX / PDF Olarak Dışa Aktarma (Kendi Kendine Script'ler)

HTML önceliklidir birinci vatandaştır. Ama kullanıcılar sıklıkla PPTX/PDF teslimatı ister. İki genel script sağlanır, **her çoklu dosya deck kullanabilir**, `scripts/` altında:

### `export_deck_pdf.mjs` — Vektör PDF Dışa Aktar (Çoklu Dosya Mimarisi)

```bash
node scripts/export_deck_pdf.mjs --slides <slides-dir> --out deck.pdf
```

**Özellikleri**:
- Metin **vektör olarak korunur** (kopyalanabilir, aranabilir)
- Görsel %100 bütünlük (Playwright gömülü Chromium render sonrası yazdırma)
- **HTML'de tek bir harf değiştirmeye gerek yok**
- Her slayt bağımsız `page.pdf()`, ardından `pdf-lib` ile birleştirme

**Bağımlılıklar**: `npm install playwright pdf-lib`

**Sınırlama**: PDF'de metin tekrar düzenlenemez — değiştirmek için HTML'e dön.

### `export_deck_stage_pdf.mjs` — Tek Dosya deck-stage Mimarisi Özel ⚠️

**Ne zaman kullanılır**: deck tek HTML dosya + `<deck-stage>` web component N adet `<section>` sarıyor (Yol B mimarisi). Bu durumda `export_deck_pdf.mjs`'nin "her HTML için bir `page.pdf()`" yaklaşımı işe yaramaz, bu özel script gerekir.

```bash
node scripts/export_deck_stage_pdf.mjs --html deck.html --out deck.pdf
```

**Neden export_deck_pdf.mjs yeniden kullanılamaz** (2026-04-20 Gerçek Hata Kaydı):

1. **Shadow DOM `!important`'ı yeniyor**: deck-stage'in shadow CSS'inde `::slotted(section) { display: none }` (sadece aktif olan `display: block`). Light DOM'da `@media print { deck-stage > section { display: block !important } }` kullanılsa bile baskı çıkamaz — `page.pdf()` yazdırma medyasını tetikledikten sonra Chromium son render'da sadece aktif olanı gösterir, sonuç olarak **tüm PDF sadece 1 sayfa** (mevcut aktif slayt'ın tekrarı).

2. **Döngü goto her sayfa yine 1 sayfa çıkarır**: Sezgisel çözüm "her `#slide-N` için navigate et, sonra `page.pdf({pageRanges:'1'})`" de başarısız — çünkü yazdırma CSS'i shadow DOM dışında da `deck-stage > section { display: block }` kuralı override edildikten sonra, son render her zaman section listesinin ilki olur (navigate edilen sayfa değil). Sonuç 17 döngü = 17 kopya P01 kapak.

3. **absolute alt öğeler bir sonraki sayfaya kaçar**: Tüm section'ların render edilmesi başarılsa bile, section kendisi `position: static` ise absolute konumlu `cover-footer`/`slide-footer` initial containing block'a göre konumlanır — section yazdırma tarafından 1080px yüksekliğe zorlandığında absolute footer bir sonraki sayfaya itilebilir (PDF section sayısından 1 fazla görünür, fazla sayfa sadece footer yetimi içerir).

**Düzeltme Stratejisi** (script zaten uygulanmış):

```js
// HTML açıldıktan sonra, page.evaluate ile section'ı deck-stage slot'undan çıkar,
// doğrudan body altındaki normal bir div'e as, ve inline style position:relative + sabit boyut garantisi ver
await page.evaluate(() => {
  const stage = document.querySelector('deck-stage');
  const sections = Array.from(stage.querySelectorAll(':scope > section'));
  document.head.appendChild(Object.assign(document.createElement('style'), {
    textContent: `
      @page { size: 1920px 1080px; margin: 0; }
      html, body { margin: 0 !important; padding: 0 !important; }
      deck-stage { display: none !important; }
    `,
  }));
  const container = document.createElement('div');
  sections.forEach(s => {
    s.style.cssText = 'width:1920px!important;height:1080px!important;display:block!important;position:relative!important;overflow:hidden!important;page-break-after:always!important;break-after:page!important;background:#F7F4EF;margin:0!important;padding:0!important;';
    container.appendChild(s);
  });
  // Son sayfa sayfa sonu yasakla, kuyruk boş sayfasını önle
  sections[sections.length - 1].style.pageBreakAfter = 'auto';
  sections[sections.length - 1].style.breakAfter = 'auto';
  document.body.appendChild(container);
});

await page.pdf({ width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
```

**Neden bu çalışır**:
- Section'ı shadow DOM slot'undan light DOM'daki normal div'e çek — `::slotted(section) { display: none }` kuralını tamamen atlatır
- Inline `position: relative` absolute alt öğelerin section'a göre konumlanmasını sağlar, taşmaz
- `page-break-after: always` tarayıcı yazdırmada her section'ı bağımsız sayfa yapar
- `:last-child` sayfa sonu yapmaz, kuyruk boş sayfasını önler

**`mdls -name kMDItemNumberOfPages` doğrulamasında dikkat**: macOS Spotlight metadata önbelleği vardır, PDF yeniden yazıldıktan sonra `mdimport file.pdf` çalıştırarak zorla yenileme gerekir, aksi halde eski sayı gösterilir. `pdfinfo` veya `pdftoppm` ile dosya sayısı saymak gerçek sayıdır.

---

### `export_deck_pptx.mjs` — PPTX Dışa Aktar (İki Mod)

```bash
# Görsel tabanlı (görsel %100 bütünlük, metin düzenlenemez)
node scripts/export_deck_pptx.mjs --slides <dir> --out deck.pptx --mode image

# Her metin bağımsız metin kutusu (düzenlenebilir, ama yazı tipi düşüşü olur)
node scripts/export_deck_pptx.mjs --slides <dir> --out deck.pptx --mode editable
```

| Mod | Görsel Bütünlük | Metin Düzenlenebilir | Çalışma Prensibi | Sınırlama |
|------|---------|----------|---------|------|
| `image` | ✅ %100 | ❌ | Playwright ekran görüntüsü → pptxgenjs addImage | Metin görsele dönüşür |
| `editable` | 🟡 ~%70 | ✅ | html2pptx her metin kutusunu çıkarır | Aşağıdaki kısıtlamalara bak |

**editable modu sert kısıtlamaları** (kullanıcı HTML'i karşılamalı, aksi halde o sayfa atlanır):
- Tüm metin `<p>`/`<h1>`-`<h6>`/`<ul>`/`<ol>` içinde olmalı (çıplak metin div yasak)
- `<p>`/`<h*>` etiketleri kendisi background/border/shadow taşıyamaz (dış div'e koy)
- `::before`/`::after` dekoratif metin eklemeyin (pseudo element çıkarılamaz)
- inline element'ler (span/em/strong) margin taşıyamaz
- CSS gradient kullanmayın (render edilemez)
- div `background-image` kullanmasın (`<img>` kullan)

Script yerleşik **otomik ön işlemci** — "yaprak div içindeki çıplak metni" otomatik `<p>` içine sarar (class korunur). Bu en yaygın ihlali çözer (çıplak metin). Ama diğer ihlaller (p üzerinde border, span üzerinde margin vb.) HTML kaynağının uyumlu olmasını gerektirir.

**editable modunun bir diğer uyarısı — yazı tipi düşüşü**:
- Playwright webfont ile text-box boyutu ölçer; PowerPoint/Keynote yerel yazı tipi ile render eder
- İkisi farklı olduğunda **taşma veya hizalama hatası** olur — her sayfa gözle geçirilmeli
- Hedef makinede HTML'de kullanılan yazı tiplerinin kurulu olması önerilir, veya `system-ui`'e fallback

### HTML'yi Baştan Dışa Aktarıma Uygun Yaz

En stabil deck için **HTML yazarken editable modu kısıtlamalarına göre yaz**. Böylece `--mode editable` doğrudan tam pass verir. Ek maliyet büyük değil:

```html
<!-- ❌ Kötü -->
<div class="title">Kritik Bulgu</div>

<!-- ✅ İyi (p sarar, class miras alır) -->
<p class="title">Kritik Bulgu</p>

<!-- ❌ Kötü (border p üzerinde) -->
<p class="stat" style="border-left: 3px solid red;">%41</p>

<!-- ✅ İyi (border dış div'de) -->
<div class="stat-wrap" style="border-left: 3px solid red;">
  <p class="stat">%41</p>
</div>
```

### Hangisini Ne Zaman Seç

| Senaryo | Öneri |
|------|------|
| Düzenleyiciye/arşive teslim | **PDF** (evrensel, yüksek bütünlük, metin aranabilir) |
| İşbirlikçilere gönder, metin ince ayar yapsınlar | **PPTX editable** (yazı tipi düşüşünü kabul et) |
| Sahada sunum, içerik değiştirilmeyecek | **PDF** veya **PPTX image** |
| HTML birincil sunum ortamı | Doğrudan tarayıcı oynatma, dışa aktarım sadece yedek |

## Düzenlenebilir PPTX Dışa Aktarma Derin Yolu (Sadece Uzun Vadeli Projeler)

Deck uzun vadeli bakım, tekrar tekrar değişiklik, ekip işbirliği gerektiriyorsa — **baştan html2pptx kısıtlamalarına göre HTML yaz** önerilir, böylece `--mode editable` stabil geçer. Detaylar için `references/editable-pptx.md` (4 sert kısıtlama + HTML şablonu + sık hata hızlı bakış).

---

## Sık Sorulan Sorular

**Çoklu dosya: iframe içindeki sayfa açılmıyor / beyaz ekran**
→ `MANIFEST` içindeki `file` yolunun `index.html`'e göre doğru olduğunu kontrol et. Tarayıcı DevTools'tan iframe'in src'sinin doğrudan erişilebilir olup olmadığını kontrol et.

**Çoklu dosya: Bir sayfanın stili başka sayfayla çakışıyor**
→ İmkansız (iframe izolasyonu). Çakışma hissediyorsan, bu önbellek — Cmd+Shift+R ile zorla yenile.

**Tek dosfa: Çoklu slayt aynı anda render edilip üst üste biniyor**
→ CSS spesifikite sorunu. Yukarıdaki "Tek Dosfa Mimarisi CSS Tuzakları" bölümüne bak.

**Tek dosfa: Scale yanlış görünüyor**
→ Tüm slayt'ların doğrudan `<deck-stage>` altında `<section>` olarak asılı olduğunu kontrol et. Ara `<div>` olmamalı.

**Tek dosfa: Belirli slayt'a atlamak istiyorum**
→ URL'e hash ekle: `index.html#slide-5` 5. sayfaya atlar.

**İki mimari için de geçerli: Yazılar farklı ekranlarda tutarsız konumlanıyor**
→ Sabit boyut (1920×1080) ve `px` birimi kullan, `vw`/`vh` veya `%` kullanma. Scale tek tip işlenir.

---

## Doğrulama Kontrol Listesi (Deck Bittikten Sonra Mutlaka Geçir)

1. [ ] Tarayıcı doğrudan `index.html`'i (veya ana HTML'i) aç, ana sayfada kırık resim olmadığını, yazı tiplerinin yüklendiğini kontrol et
2. [ ] → tuşuyla her sayfaya ilerle, boş sayfa yok, düzen hatası yok
3. [ ] P tuşuyla yazdırma önizlemesi, her sayfa tam olarak bir A4 (veya 1920×1080) ve kırpma yok
4. [ ] Rastgele 3 sayfa Cmd+Shift+R ile zorla yenile, localStorage hafıza normal çalışıyor
5. [ ] Playwright toplu ekran görüntüsü (çoklu sayfa mimarisi: `slides/*.html` dolaş; tek dosfa mimarisi: goTo ile geçiş), gözle bir kez geçir
6. [ ] `TODO` / `placeholder` kalıntısı ara, hepsinin temizlendiğini onayla
