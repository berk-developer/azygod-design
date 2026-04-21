# Apple Gallery Showcase · Galeri Vitrin Duvarı Animasyon Stili

> İlham kaynağı: Claude Design web sitesi hero videosu + Apple ürün sayfası "eser duvarı" tarzı sergileme
> Gerçek uygulama: azygod-design hero v5 yayını
> Uygun senaryolar: **Ürün lansmanı hero animasyonu, skill yetenek demosu, portfolyo vitrini** — "birden fazla yüksek kaliteli ürünü" aynı ekranda sergilemek ve izleyici dikkatini yönlendirmek gerektiğinde

---

## Tetikleme Kararı: Bu stili ne zaman kullan

**Uygun**:
- 10'dan fazla gerçek ürün aynı ekranda gösterilecek (PPT, App, Web, İnfografik)
- İzleyici profesyonel kitle (geliştirici, tasarımcı, ürün yöneticisi), "kaliteye" duyarlı
- İletilmek istenen hava "öz gücü, sergi tarzı, premium, mekansal his"
- Odak ve genel görünüm aynı anda var olmalı (detay gör ama bütünü kaybetme)

**Uygun değil**:
- Tek ürün odaklı (frontend-design ürün hero şablonunu kullan)
- Duygusal/hikaye odaklı animasyon (zaman çizelgesi anlatı şablonunu kullan)
- Küçük ekran / dikey ekran (eğimli perspektif küçük ekranda bulanıklaşır)

---

## Çekirdek Görsel Token

```css
:root {
  /* Açık galeri paleti */
  --bg:         #F5F5F7;   /* Ana tuval — Apple web sitesi gri */
  --bg-warm:    #FAF9F5;   /* Sıcak krem beyaz varyant */
  --ink:        #1D1D1F;   /* Ana yazı rengi */
  --ink-80:     #3A3A3D;
  --ink-60:     #545458;
  --muted:      #86868B;   /* İkincil yazı */
  --dim:        #C7C7CC;
  --hairline:   #E5E5EA;   /* Kart 1px kenarlık */
  --accent:     #D97757;   /* Kiremit turuncu — Claude markası */
  --accent-deep:#B85D3D;

  --serif-cn: "Noto Serif SC", "Songti SC", Georgia, serif;
  --serif-en: "Source Serif 4", "Tiempos Headline", Georgia, serif;
  --sans:     "Inter", -apple-system, "PingFang SC", system-ui;
  --mono:     "JetBrains Mono", "SF Mono", ui-monospace;
}
```

**Kilit prensip**:
1. **Asla saf siyah zemin kullanma**. Siyah zemin eserleri film gibi gösterir, "benimsenebilecek çalışma sonucu" gibi değil
2. **Kiremit turuncu tek renkli accent'tir**, gerisi tamamen tonlamalar + beyaz
3. **Üç yazı tipi yığını** (serif EN + serif CN + sans + mono) "yayın" değil "internet ürünü" havası verir

---

## Çekirdek Yerleşim Modeli

### 1. Süzülen Kartlar (Tüm stilin temel birimi)

```css
.gallery-card {
  background: #FFFFFF;
  border-radius: 14px;
  padding: 6px;                          /* İç boşluk "passepartout kağıdı" */
  border: 1px solid var(--hairline);
  box-shadow:
    0 20px 60px -20px rgba(29, 29, 31, 0.12),   /* Ana gölge, yumuşak ve uzun */
    0 6px 18px -6px rgba(29, 29, 31, 0.06);     /* İkinci yakın ışık, süzülme hissi */
  aspect-ratio: 16 / 9;                  /* Birleşik slide oranı */
  overflow: hidden;
}
.gallery-card img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 9px;                    /* Kart köşe yarıçapından biraz küçük, görsel iç içe */
}
```

**Karşı örnek**: Kenara yapışık fayans (padding yok kenarlık yok gölge yok) — bu infografik yoğunluk ifadesi, sergi değil.

### 2. 3D Eğimli Eser Duvarı

```css
.gallery-viewport {
  position: absolute; inset: 0;
  overflow: hidden;
  perspective: 2400px;                   /* Biraz derin perspektif, eğim abartılı değil */
  perspective-origin: 50% 45%;
}
.gallery-canvas {
  width: 4320px;                         /* Tuval = 2.25× viewport */
  height: 2520px;                        /* Pan alanı bırak */
  transform-origin: center center;
  transform: perspective(2400px)
             rotateX(14deg)              /* Geriye eğil */
             rotateY(-10deg)             /* Sola dön */
             rotateZ(-2deg);             /* Hafif eğim, fazla düzenli olmaması için */
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 40px;
  padding: 60px;
}
```

**Parametre tatlı noktası**:
- rotateX: 10-15deg (daha fazla VIP arka planı gibi)
- rotateY: ±8-12deg (sağ-sol simetri hissi)
- rotateZ: ±2-3deg ("Bunu makine dizmedi" insani dokunuş)
- perspective: 2000-2800px (2000'den az balık gözü, 3000'den fazla yaklaşık dik izdüşüm)

### 3. 2×2 Dört Köşe Toplanma (Seçim senaryosu)

```css
.grid22 {
  display: grid;
  grid-template-columns: repeat(2, 800px);
  gap: 56px 64px;
  align-items: start;
}
```

Her kart ilgili köşeden (tl/tr/bl/br) merkeze doğru kayarak + fade in. Karşılık gelen `cornerEntry` vektörü:

```js
const cornerEntry = {
  tl: { dx: -700, dy: -500 },
  tr: { dx:  700, dy: -500 },
  bl: { dx: -700, dy:  500 },
  br: { dx:  700, dy:  500 },
};
```

---

## Beş Çekirdek Animasyon Modeli

### Mod A · Dört Köşe Toplanma (0.8-1.2s)

4 öğe viewport köşelerinden kayarak içeri, aynı anda scale 0.85→1.0, karşılık gelen ease-out. "Çok yönlü seçim gösterimi" açılışı için uygun.

```js
const inP = easeOut(clampLerp(t, start, end));
card.style.transform = `translate3d(${(1-inP)*ce.dx}px, ${(1-inP)*ce.dy}px, 0) scale(${0.85 + 0.15*inP})`;
card.style.opacity = inP;
```

### Mod B · Seçim Büyütme + Diğerleri Kayarak Çıkma (0.8s)

Seçilen kart büyütülür 1.0→1.28, diğer kartlar fade out + blur + köşelere geri kayar:

```js
// Seçilen
card.style.transform = `translate3d(${cellDx*outP}px, ${cellDy*outP}px, 0) scale(${1 + 0.28*easeOut(zoomP)})`;
// Seçilmeyen
card.style.opacity = 1 - outP;
card.style.filter = `blur(${outP * 1.5}px)`;
```

**Kilit**: Seçilmeyen blur olmalı, sadece fade değil. blur derinlik hissi simüle eder, görsel olarak seçileni "öne iter".

### Mod C · Ripple Dalga Açılım (1.7s)

Merkezden dışa doğru, mesafeye göre gecikme, her kart sırayla fade in + 1.25x'ten 0.94x'e küçülür ("kamera uzaklaşır"):

```js
const col = i % COLS, row = Math.floor(i / COLS);
const dc = col - (COLS-1)/2, dr = row - (ROWS-1)/2;
const dist = Math.sqrt(dc*dc + dr*dr);
const delay = (dist / maxDist) * 0.8;
const localT = Math.max(0, (t - rippleStart - delay) / 0.7);
card.style.opacity = easeOut(Math.min(1, localT));

// Aynı anda toplam scale 1.25→0.94
const galleryScale = 1.25 - 0.31 * easeOut(rippleProgress);
```

### Mod D · Sinusoidal Pan (Sürekli süzülme)

Sinüs dalgası + doğrusal süzülme kombinasyonu, marquee tarzı "başlangıcı ve bitişi olan" döngü hissinin önüne geçer:

```js
const panX = Math.sin(panT * 0.12) * 220 - panT * 8;    // Yatay sola süzülme
const panY = Math.cos(panT * 0.09) * 120 - panT * 5;    // Dikey yukarı süzülme
const clampedX = Math.max(-900, Math.min(900, panX));   // Kenar taşmasını önle
```

**Parametreler**:
- Sinüs periyodu `0.09-0.15 rad/s` (yavaş, yaklaşık 30-50 saniyede bir salınım)
- Doğrusal süzülme `5-8 px/s` (izleyici göz kırpmasından yavaş)
- Genlik `120-220 px` (hissetmeye yetecek kadar büyük, baş döndürmeyecek kadar küçük)

### Mod E · Focus Overlay (Odak değişimi)

**Kilit tasarım**: focus overlay **düz bir öğedir** (eğimli değil), eğimli tuvalin üzerinde yüzer. Seçilen slide karo konumundan (yaklaşık 400×225) ekran ortasına (960×540) büyütülür, arka plan tuvali eğim değişmez ama **%45'e kararır**:

```js
// Focus overlay (düz, ortalanmış)
focusOverlay.style.width = (startW + (endW - startW) * focusIntensity) + 'px';
focusOverlay.style.height = (startH + (endH - startH) * focusIntensity) + 'px';
focusOverlay.style.opacity = focusIntensity;

// Arka plan kartları kararır, ama hâlâ görünür (kilit! %100 maske yok)
card.style.opacity = entryOp * (1 - 0.55 * focusIntensity);   // 1 → 0.45
card.style.filter = `brightness(${1 - 0.3 * focusIntensity})`;
```

**Netlik kuralı**:
- Focus overlay'in `<img>`'si `src` ile orijinal resme doğrudan bağlanmalı, **galeri içindeki sıkıştırılmış önizlemeyi yeniden kullanma**
- Tüm orijinal resimleri önceden `new Image()[]` dizisine preload et
- overlay kendisi `width/height`'i kare bazında hesaplanır, tarayıcı her karede orijinal resmi yeniden örnekler

---

## Zaman Çizelgesi Mimarisi (Yeniden Kullanılabilir İskelet)

```js
const T = {
  DURATION: 25.0,
  s1_in: [0.0, 0.8],    s1_type: [1.0, 3.2],  s1_out: [3.5, 4.0],
  s2_in: [3.9, 5.1],    s2_hold: [5.1, 7.0],  s2_out: [7.0, 7.8],
  s3_hold: [7.8, 8.3],  s3_ripple: [8.3, 10.0],
  panStart: 8.6,
  focuses: [
    { start: 11.0, end: 12.7, idx: 2  },
    { start: 13.3, end: 15.0, idx: 3  },
    { start: 15.6, end: 17.3, idx: 10 },
    { start: 17.9, end: 19.6, idx: 16 },
  ],
  s4_walloff: [21.1, 21.8], s4_in: [21.8, 22.7], s4_hold: [23.7, 25.0],
};

// Çekirdek easing
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
function lerp(time, start, end, fromV, toV, easing) {
  if (time <= start) return fromV;
  if (time >= end) return toV;
  let p = (time - start) / (end - start);
  if (easing) p = easing(p);
  return fromV + (toV - fromV) * p;
}

// Tek bir render(t) fonksiyonu zaman damgası okur, tüm öğeleri yazar
function render(t) { /* ... */ }
requestAnimationFrame(function tick(now) {
  const t = ((now - startMs) / 1000) % T.DURATION;
  render(t);
  requestAnimationFrame(tick);
});
```

**Mimari özü**: **Tüm durum zaman damgası t'den türetilir**, durum makinesi yok, setTimeout yok. Böylece:
- Herhangi bir ana `window.__setTime(12.3)` anında atla (playwright kare kare kesim için uygun)
- Döngü doğal olarak dikişsiz (t mod DURATION)
- Hata ayıklarken herhangi bir kareyi dondurabilirsin

---

## Doku Detayları (Gözden kaçar ama ölümcül)

### 1. SVG noise texture

Açık zemin en çok "çok düz" korkusu. Üzerine çok zayıf bir fractalNoise katmanı ekle:

```html
<style>
.stage::before {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.078  0 0 0 0 0.078  0 0 0 0 0.074  0 0 0 0.035 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  opacity: 0.5;
  pointer-events: none;
  z-index: 30;
}
</style>
```

Görünüşte fark yok, çıkarınca anlarsın.

### 2. Köşe Marka Kimliği

```html
<div class="corner-brand">
  <div class="mark"></div>
  <div>HUASHU · DESIGN</div>
</div>
```

```css
.corner-brand {
  position: absolute; top: 48px; left: 72px;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
}
```

Yalnızca eser duvarı sahnesinde gösterilir, fade in fade out. Müze etiketi gibi.

### 3. Marka Toparlanma wordmark

```css
.brand-wordmark {
  font-family: var(--sans);
  font-size: 148px;
  font-weight: 700;
  letter-spacing: -0.045em;   /* Negatif harf aralığı kilit, harfleri sıkıştırarak logo yapar */
}
.brand-wordmark .accent {
  color: var(--accent);
  font-weight: 500;           /* accent karakteri tersine biraz ince, görsel fark */
}
```

`letter-spacing: -0.045em` Apple ürün sayfası büyük yazısının standart uygulamasıdır.

---

## Sık Başarısızlık Modelleri

| Belirti | Neden | Çözüm |
|---|---|---|
| PPT şablonu gibi görünüyor | Kart gölge/hairline yok | İki katman box-shadow + 1px kenarlık ekle |
| Eğim hissi ucuz | Sadece rotateY kullanmış rotateZ eklemedi | ±2-3deg rotateZ ekle düzenliği kırmak için |
| Pan "takılıyor" gibi hissediyor | setTimeout veya CSS keyframes döngüsü kullanılmış | rAF + sin/cos sürekli fonksiyon kullan |
| Focus'ta yazı okunmuyor | Galeri karosunun düşük çözünürlüklü küçük resmini yeniden kullanmış | Bağımsız overlay + orijinal resim src doğrudan |
| Arka plan çok boş | Saf renk `#F5F5F7` | Üzerine SVG fractalNoise 0.5 opacity ekle |
| Yazı tipi çok "internet" | Sadece Inter | Serif (İngilizce ve Çince ayrı) + mono üç yığın ekle |

---

## Referans

- Tam uygulama örneği: `/Users/alchain/Documents/writing/01-wechat-writing/project/2026.04-azygod-design-release/images/hero-animation-v5.html`
- Orijinal ilham: claude.ai/design hero videosu
- Referans estetik: Apple ürün sayfası, Dribbble shot koleksiyon sayfası

"Birden fazla yüksek kaliteli ürün sergileme" animasyon ihtiyacıyla karşılaştığında, doğrudan bu dosyadan iskelet kopyala, içerik değiştir + timing ayarla.
