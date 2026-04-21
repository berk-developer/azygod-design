# Gallery Ripple + Multi-Focus · Sahne Kurgu Felsefesi

> azygod-design hero animasyonu v9'dan (25 saniye, 8 sahne) çıkarılan **yeniden kullanılabilir bir görsel kurgu yapısı**.
> Animasyon üretim hattı değil, **bu kurgunun "doğru" olduğu senaryolar**.
> Gerçek referans: [demos/hero-animation-v9.mp4](../demos/hero-animation-v9.mp4) · [https://www.huasheng.ai/azygod-design-hero/](https://www.huasheng.ai/azygod-design-hero/)

## Tek Cümle Öncesi

> **20+ homojen görsel malzemen var, sahne "ölçek ve derinlik hissi ifade etmesi" gerektiğinde, Gallery Ripple + Multi-Focus kurgusunu önceliklendir, yığma yerleşim yerine.**

Genel SaaS özellik animasyonu, ürün lansmanı, skill tanıtımı, seri portfolyo vitrini — malzeme sayısı yeterliyse, stil tutarlıysa, bu yapı neredeyse her zaman etki yaratır.

---

## Bu Teknik Ne İfade Ediyor

"Malzeme gösterisi" değil — **iki ritim değişimiyle bir anlatı** sunar:

**Birinci Vuruş · Ripple Açılım (~1.5s)**: Merkezden dört yana 48 kart yayılır, izleyici "miktar" ile etkilenir — "Vay, bunun bu kadar üretimi var".

**İkinci Vuruş · Multi-Focus (~8s, 4 döngü)**: Kamera yavaş pan yaparken, 4 kez arka plan dim + desaturate olur, tek bir kart ekran ortasına büyütülür — izleyici "miktar şoku"ndan "kalite bakışı"na geçer, her biri 1.7s stabil ritim.

**Çekirdek anlatı yapısı**: **Ölçek (Ripple) → Bakış (Focus × 4) → Soldurma (Walloff)**. Bu üç vuruşun birleşimi "Breadth × Depth" ifade eder — yalnızca çok yapabilmek değil, her biri durup bakmaya değer.

Karşı örnekle karşılaştır:

| Yaklaşım | İzleyici Algısı |
|------|---------|
| 48 kart statik sıralama (Ripple yok) | Güzel ama anlatısız, bir grid ekran görüntüsü gibi |
| Tek tek hızlı kesme (Gallery context yok) | Slideshow gibi, "ölçek hissi" kaybolur |
| Yalnızca Ripple, Focus yok | Etkilendi ama hiçbirini hatırlamıyor |
| **Ripple + Focus × 4 (Bu formül)** | **Önce miktardan etkilen, sonra kaliteye bak, sonunda sakin soldur — tam duygusal yay** |

---

## Ön Koşullar (Hepsi Sağlanmalı)

Bu kurgu **her şeye uymaz**, aşağıdaki 4 koşul eksiksiz olmalı:

1. **Malzeme ölçeği ≥ 20 adet, en iyi 30+**
   20'dan az Ripple "boş" görünür — 48 karenin her biri hareket edince yoğunluk hissi olur. v9 48 kare × 32 resim kullandı (döngü doldurma).

2. **Malzeme görsel stili tutarlı**
   Hepsi 16:9 slide önizlemesi / hepsi app ekran görüntüsü / hepsi kapak tasarımı — en-boy oranı, ton, düzen "bir set" gibi görünmeli. Karıştırılırsa Gallery karalama panosu gibi görünür.

3. **Malzeme tek başına büyütüldüğünde hâlâ okunabilir bilgi taşıyor**
   Focus bir kartı 960px genişliğe büyütür, orijinal resim büyütüldüğünde bulanıklaşırsa veya bilgi seyrekse Focus vuruşu boşa gider. Ters doğrulama: 48 adetten 4 adet "en temsili" olarak seçilebiliyor mu? Seçilemiyorsa malzeme kalitesi dengesiz.

4. **Sahne kendisi landscape veya kare, dikey değil**
   Gallery'nin 3D eğimi (`rotateX(14deg) rotateY(-10deg)`) yatay uzanma hissine ihtiyaç duyar, dikey ekranda eğim dar ve garip görünür.

**Koşul eksikliğinde yedek yol**:

| Eksik olan | Ne olarak düşer |
|-------|-----------|
| Malzeme < 20 adet | "3-5 adet yan yana statik vitrin + tek tek focus" kullan |
| Stil tutarsız | "Kapak + 3 bölüm büyük resim" keynote stiline geç |
| Bilgi seyrek | "Data-driven dashboard" veya "Altın söz + büyük yazı" kullan |
| Dikey senaryo | "Dikey kaydırma + sticky kartlar" kullan |

---

## Teknik Formül (v9 Gerçek Parametreleri)

### 4 Katman Yapısı

```
viewport (1920×1080, perspective: 2400px)
  └─ canvas (4320×2520, büyük overflow) → 3D eğim + pan
      └─ 8×6 grid = 48 kart (gap 40px, padding 60px)
          └─ img (16:9, border-radius 9px)
      └─ focus-overlay (absolute center, z-index 40)
          └─ img (seçilen slide ile eşleşir)
```

**Kilit**: Canvas viewport'tan 2.25 kat büyük, böylece pan yaparken "daha büyük dünyaya göz atma" hissi olur.

### Ripple Açılım (Mesafe Gecikme Algoritması)

```js
// Her kartın giriş zamanı = merkeze olan mesafe × 0.8s gecikme
const col = i % 8, row = Math.floor(i / 8);
const dc = col - 3.5, dr = row - 2.5;       // Merkeze göre offset
const dist = Math.hypot(dc, dr);
const maxDist = Math.hypot(3.5, 2.5);
const delay = (dist / maxDist) * 0.8;       // 0 → 0.8s
const localT = Math.max(0, (t - rippleStart - delay) / 0.7);
const opacity = expoOut(Math.min(1, localT));
```

**Çekirdek parametreler**:
- Toplam süre 1.7s (`T.s3_ripple: [8.3, 10.0]`)
- Maksimum gecikme 0.8s (merkez en erken çıkar, köşeler en geç)
- Her kart giriş süresi 0.7s
- Easing: `expoOut` (patlama hissi, yumuşak değil)

**Aynı anda yapılan**: canvas scale 1.25 → 0.94 (zoom out to reveal) — eş zamanlı olarak belirmeyle birlikte uzaklaşma hissi.

### Multi-Focus (4 Kez Ritim)

```js
T.focuses = [
  { start: 11.0, end: 12.7, idx: 2  },  // 1.7s
  { start: 13.3, end: 15.0, idx: 3  },  // 1.7s
  { start: 15.6, end: 17.3, idx: 10 },  // 1.7s
  { start: 17.9, end: 19.6, idx: 16 },  // 1.7s
];
```

**Ritim kuralı**: Her focus 1.7s, aralarında 0.6s soluklanma. Toplam 8s (11.0–19.6s).

**Her focus'un iç yapısı**:
- In ramp: 0.4s (`expoOut`)
- Hold: orta 0.9s (`focusIntensity = 1`)
- Out ramp: 0.4s (`easeOut`)

**Arka plan değişimi (bu kilit)**:

```js
if (focusIntensity > 0) {
  const dimOp = entryOp * (1 - 0.6 * focusIntensity);  // %40'a karart
  const brt = 1 - 0.32 * focusIntensity;                // brightness %68
  const sat = 1 - 0.35 * focusIntensity;                // saturate %65
  card.style.filter = `brightness(${brt}) saturate(${sat})`;
}
```

**Yalnızca opacity değil — aynı anda desaturate + darken**. Bu ön plan overlay renginin "atlamasını" sağlar, yalnızca "biraz daha parlak" olmaz.

**Focus overlay boyut animasyonu**:
- 400×225 (giriş) → 960×540 (hold durumu)
- Dışarıda 3 katman gölge + 3px accent renk outline ring, "çerçevelenmiş hissi" verir

### Pan (Durağanlık sıkıcı olmamak için sürekli his)

```js
const panT = Math.max(0, t - 8.6);
const panX = Math.sin(panT * 0.12) * 220 - panT * 8;
const panY = Math.cos(panT * 0.09) * 120 - panT * 5;
```

- Sinüs dalgası + doğrusal drift çift katmanlı hareket — saf döngü değil, her an konum farklı
- X/Y frekansları farklı (0.12 vs 0.09) görsel "düzenli döngü" algısını önler
- ±900/500px clamp ile kenar taşmasını önle

**Neden saf doğrusal pan değil**: Saf doğrusal izleyici "bir saniye sonra nerede olacak" tahmin eder; sinüs+drift her saniye yeni bir konum, 3D eğim altında "hafif deniz tutması hissi" (iyi anlamda), dikkat tutar.

---

## 5 Yeniden Kullanılabilir Model (v6→v9 İterasyonundan Damıtılmış)

### 1. **expoOut Ana easing Olarak, cubicOut Değil**

`easeOut = 1 - (1-t)³` (yumuşak) vs `expoOut = 1 - 2^(-10t)` (patladıktan sonra hızla yakınsama).

**Seçim gerekçesi**: expoOut ilk %30'da çabucak %90'a ulaşır, fiziksel sönümlemeye daha benzer, "ağır şeyin yere düşmesi" sezgisine uygun. Özellikle şunlara uygun:
- Kart girişi (ağırlık hissi)
- Ripple yayılımı (şok dalgası)
- Marka yükselmesi (yerleşim hissi)

**Ne zaman hâlâ cubicOut**: focus out ramp, simetrik mikro hareketler.

### 2. **Kağıt Hissi Zemin + Kiremit Turuncu Accent (Anthropic Soyu)**

```css
--bg: #F7F4EE;        /* Sıcak kağıt */
--ink: #1D1D1F;       /* Neredeyse siyah */
--accent: #D97757;    /* Kiremit turuncu */
--hairline: #E4DED2;  /* Sıcak çizgi */
```

**Neden**: Sıcak zemin GIF sıkıştırma sonrası hâlâ "nefes alma hissi" taşır, saf beyaz "ekran hissine" girer. Kiremit turuncu tek accent olarak terminal prompt, dir-card seçimi, cursor, brand tire, focus ring gibi tüm görsel çıpaları birleştirir — tüm görsel bağlantı noktaları bu tek renkle bağlanır.

**v5 dersi**: noise overlay ekleyerek "kağıt dokusu" simüle etti, sonuç GIF kare sıkıştırma tamamen bozuldu (her kare farklı). v6 "yalnızca zemin + sıcak gölge"ye geçti, kağıt hissi %90 korundu, GIF boyutu %60 küçüldü.

### 3. **İki Kademe Gölge Derinliği Simüle Eder, Gerçek 3D Değil**

```css
.gallery-card.depth-near { box-shadow: 0 32px 80px -22px rgba(60,40,20,0.22), ... }
.gallery-card.depth-far  { box-shadow: 0 14px 40px -16px rgba(60,40,20,0.10), ... }
```

`sin(i × 1.7) + cos(i × 0.73)` deterministik algoritmasıyla her karta near/mid/far üç kademe gölge atanır — **görsel olarak "üç boyutlu yığınlama" hissi, ama her kare transform tamamen değişmez, GPU tüketimi 0**.

**Gerçek 3D maliyeti**: Her kart tek tek `translateZ`, GPU her karede 48 transform + gölge blur hesaplar. v4 denendi, Playwright kaydı 25fps bile zorlandı. v6'nın iki kademe gölgesi gözle görülen fark <%5, ama maliyet farkı 10 kat.

### 4. **Yazı Kalınlığı Değişimi (font-variation-settings) Boyut Değişiminden Daha Sinematik**

```js
const wght = 100 + (700 - 100) * morphP;  // 0.9s boyunca 100 → 700
wordmark.style.fontVariationSettings = `"wght" ${wght.toFixed(0)}`;
```

Marka wordmark Thin → Bold arası 0.9s degrade, letter-spacing ince ayarı (-0.045 → -0.048em) ile birlikte.

**Neden büyültme-küçültmeden daha iyi**:
- Büyültme-küçültme izleyici çok gördü, beklenti donuklaştı
- Yazı kalınlığı değişimi "içsel doygunluk hissi", balonun şişirilmesi gibi, "yaklaştırılması" gibi değil
- variable fonts 2020+ sonrası yaygınlaşan bir özellik, izleyici bilinçaltı "modern" hisseder

**Sınırlama**: Variable font destekleyen yazı tipi kullanılmalı (Inter/Roboto Flex/Recursive vb.). Normal statik yazı tipi yalnızca taklit edebilir (birkaç sabit weight arasında geçiş atlama olur).

### 5. **Köşe Marka Düşük Yoğunluklu Sürekli İmza**

Gallery aşamasında sol üst köşede `HUASHU · DESIGN` küçük bir kimlik, %16 opacity, 12px yazı boyutu, geniş harf aralığı.

**Neden eklendi**:
- Ripple patlamasından sonra izleyici "odaklanamama" unutabilir ne izlediğini, sol üst hafif işaret yardım eder anchor
- Tam ekran büyük logodan daha premium — marka imzasının bağırmaya ihtiyacı olmadığını bilen markacılar bilir
- GIF ekran görüntüsü paylaşıldığında hâlâ aidiyet sinyali bırakır

**Kural**: Yalnızca orta kısımda (ekran kalabalık) gösterilir, açılışta kapatılır (terminal'i kapatmaz), sonuçta kapatılır (brand reveal ana karakterdir).

---

## Karşı Örnek: Bu Kurgu Ne Zaman Kullanılmamalı

**❌ Ürün demo (fonksiyon gösterimi)**: Gallery her birinin hızlıca geçtiği, izleyici hiçbir fonksiyonu hatırlayamaz. "Tek ekran focus + tooltip etiketleme" kullan.

**❌ Veri güdümlü içerik**: İzleyici sayıları okumak ister, Gallery hızlı ritim okumaya süre vermez. "Veri grafikleri + tek tek reveal" kullan.

**❌ Hikaye anlatımı**: Gallery "yan yana" yapı, hikaye "nedensellik" gerektirir. Keynote bölüm geçişi kullan.

**❌ Malzeme yalnızca 3-5 adet**: Ripple yoğunluğu yetersiz, "yama" gibi görünür. "Statik sıralama + tek tek vurgulama" kullan.

**❌ Dikey (9:16)**: 3D eğim yatay uzanma gerektirir, dikeyde eğim "eğik" değil "daralma" gibi hissettirir.

---

## Kendi Görevinin Bu Kurguya Uygun Olup Olmadığı Nasıl Anlaşılır

Üç adım hızlı kontrol:

**Adım 1 · Malzeme miktarı**: Kaç tane aynı tür görsel malzemen var? < 15 → dur; 15-25 → tamamla; 25+ → doğrudan kullan.

**Adım 2 · Tutarlılık testi**: 4 adet rastgele malzemeyi yan yana koy, "bir set" gibi görünüyor mu? Görünmüyorsa önce stili birleştir, veya plan değiştir.

**Adım 3 · Anlatı eşleşmesi**: İfade etmek istediğin "Breadth × Depth" (miktar × kalite) mi? Yoksa "süreç", "fonksiyon", "hikaye" mi? İlki değilse zorlama.

Üç adım da evet ise, doğrudan v6 HTML'ini forkla, `SLIDE_FILES` dizisini ve zaman çizelgesini değiştirerek yeniden kullan. Palet `--bg / --accent / --ink`'i değiştir, genel görünümü değiştir ama kemik aynı kalır.

---

## İlgili Referans

- Tam teknik süreç: [references/animations.md](animations.md) · [references/animation-best-practices.md](animation-best-practices.md)
- Animasyon dışa aktarım hattı: [references/video-export.md](video-export.md)
- Ses yapılandırması (BGM + SFX çift yol): [references/audio-design-rules.md](audio-design-rules.md)
- Apple galeri stili yatay referans: [references/apple-gallery-showcase.md](apple-gallery-showcase.md)
- Kaynak HTML (v6 + ses entegrasyonu): `www.huasheng.ai/azygod-design-hero/index.html`
