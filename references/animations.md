# Animations: Zaman Çizelgesi Animasyon Motoru

Animasyon/motion design HTML yaparken bunu oku. Prensip, kullanım, tipik modeller.

## Çekirdek Model: Stage + Sprite

Animasyon sistemimiz (`assets/animations.jsx`) zaman çizelgesi güdümlü bir motor sağlar:

- **`<Stage>`**: Tüm animasyonun kapsayıcısı, otomatik auto-scale (viewport'a sığdırma) + scrubber + play/pause/loop kontrolü sağlar
- **`<Sprite start end>`**: Zaman parçacığı. Bir Sprite yalnızca `start`'tan `end`'e kadar gösterilir. İçinde `useSprite()` hook ile kendi yerel ilerlemesi `t` (0→1) okunabilir
- **`useTime()`**: Mevcut global zamanı (saniye) okur
- **`Easing.easeInOut` / `Easing.easeOut` / ...**: Yumuşatma fonksiyonları
- **`interpolate(t, from, to, easing?)`**: t'ye göre interpolasyon

Bu model Remotion/After Effects fikrinden esinlenmiştir, ama hafif, sıfır bağımlılık.

## Başlangıç

```html
<script type="text/babel" src="animations.jsx"></script>
<script type="text/babel">
  const { Stage, Sprite, useTime, useSprite, Easing, interpolate } = window.Animations;

  function Title() {
    const { t } = useSprite();  // Yerel ilerleme 0→1
    const opacity = interpolate(t, [0, 1], [0, 1], Easing.easeOut);
    const y = interpolate(t, [0, 1], [40, 0], Easing.easeOut);
    return (
      <h1 style={{ 
        opacity, 
        transform: `translateY(${y}px)`,
        fontSize: 120,
        fontWeight: 900,
      }}>
        Hello.
      </h1>
    );
  }

  function Scene() {
    return (
      <Stage duration={10}>  {/* 10 saniyelik animasyon */}
        <Sprite start={0} end={3}>
          <Title />
        </Sprite>
        <Sprite start={2} end={5}>
          <SubTitle />
        </Sprite>
        {/* ... */}
      </Stage>
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Scene />);
</script>
```

## Sık Kullanılan Animasyon Modelleri

### 1. Fade In / Fade Out

```jsx
function FadeIn({ children }) {
  const { t } = useSprite();
  const opacity = interpolate(t, [0, 0.3], [0, 1], Easing.easeOut);
  return <div style={{ opacity }}>{children}</div>;
}
```

**Aralık dikkati**: `[0, 0.3]` sprite'ın ilk %30 zamanında fade-in tamamlanır, gerisi opacity=1 kalır demektir.

### 2. Slide In

```jsx
function SlideIn({ children, from = 'left' }) {
  const { t } = useSprite();
  const progress = interpolate(t, [0, 0.4], [0, 1], Easing.easeOut);
  const offset = (1 - progress) * 100;
  const directions = {
    left: `translateX(-${offset}px)`,
    right: `translateX(${offset}px)`,
    top: `translateY(-${offset}px)`,
    bottom: `translateY(${offset}px)`,
  };
  return (
    <div style={{
      transform: directions[from],
      opacity: progress,
    }}>
      {children}
    </div>
  );
}
```

### 3. Karakter Karakter Daktilo

```jsx
function Typewriter({ text }) {
  const { t } = useSprite();
  const charCount = Math.floor(text.length * Math.min(t * 2, 1));
  return <span>{text.slice(0, charCount)}</span>;
}
```

### 4. Sayı Sayma

```jsx
function CountUp({ from = 0, to = 100, duration = 0.6 }) {
  const { t } = useSprite();
  const progress = interpolate(t, [0, duration], [0, 1], Easing.easeOut);
  const value = Math.floor(from + (to - from) * progress);
  return <span>{value.toLocaleString()}</span>;
}
```

### 5. Aşamalı Açıklama (Tipik eğitim animasyonu)

```jsx
function Scene() {
  return (
    <Stage duration={20}>
      {/* Aşama 1: Sorunu göster */}
      <Sprite start={0} end={4}>
        <Problem />
      </Sprite>

      {/* Aşama 2: Yaklaşımı göster */}
      <Sprite start={4} end={10}>
        <Approach />
      </Sprite>

      {/* Aşama 3: Sonucu göster */}
      <Sprite start={10} end={16}>
        <Result />
      </Sprite>

      {/* Tüm süre boyunca gösterilen altyazı */}
      <Sprite start={0} end={20}>
        <Caption />
      </Sprite>
    </Stage>
  );
}
```

## Easing Fonksiyonları

Hazır easing eğrileri:

| Easing | Özellik | Kullanım |
|--------|------|------|
| `linear` | Sabit hız | Kaydırma altyazısı, sürekli animasyon |
| `easeIn` | Yavaş→Hızlı | Sahne dışı kaybolma |
| `easeOut` | Hızlı→Yavaş | Sahne içi belirme |
| `easeInOut` | Yavaş→Hızlı→Yavaş | Konum değişimi |
| **`expoOut`** ⭐ | **Üstel yumuşatma** | **Anthropic seviyesi ana easing** (fiziksel ağırlık hissi) |
| **`overshoot`** ⭐ | **Elastik geri zıplama** | **Toggle / düğme patlaması / etkileşim vurgusu** |
| `spring` | Yay | Etkileşim geri bildirimi, geometrik cisim yerine dönme |
| `anticipation` | Önce ters sonra ileri | Eylem vurgusu |

**Varsayılan ana easing `expoOut`** (`easeOut` değil) — bkz. `animation-best-practices.md` §2.
Giriş `expoOut`, çıkış `easeIn`, toggle `overshoot` — Anthropic seviyesi animasyonun temel kuralı.

## Ritim ve Süre Kılavuzu

### Mikro Etkileşim (0.1-0.3 saniye)
- Düğme hover
- Kart expand
- Tooltip belirme

### UI Geçiş (0.3-0.8 saniye)
- Sayfa geçişi
- Modal belirme
- Liste öğesi ekleme

### Anlatı Animasyonu (2-10 saniye her parça)
- Bir kavram açıklamanın fazı
- Veri grafiğinin reveal'i
- Sahne dönüşümü

### Tek parça anlatı animasyonu en fazla 10 saniye
İnsan dikkat sınırlıdır. 10 saniyede bir şey anlat, anlatınca bir sonraki.

## Animasyon Tasarlamada Düşünme Sırası

### 1. Önce İçerik/Hikaye, Sonra Animasyon

**Yanlış**: Önce havalı animasyon yapmak iste, sonra içerik sığdır
**Doğru**: Önce ne bilgi iletmek istediğini düşün, sonra animasyon araçları bu bilgiye hizmet etsin

Animasyon **sinyal**dir, **dekorasyon** değil. Bir fade-in "burası çok önemli, lütfen bak" vurgusu yapar — her şey fade-in olursa sinyal etkisizleşir.

### 2. Sahneye Göre Zaman Çizelgesi Yaz

```
0:00 - 0:03   Sorun belirir (fade in)
0:03 - 0:06   Sorun büyür/açılır (zoom+pan)
0:06 - 0:09   Çözüm belirir (sağdan slide in)
0:09 - 0:12   Çözüm açıklanır (typewriter)
0:12 - 0:15   Sonuç gösterilir (counter up + chart reveal)
0:15 - 0:18   Tek cümle özet (static, 3 saniye oku)
0:18 - 0:20   CTA veya fade out
```

Zaman çizelgesini yaz, sonra bileşen yaz.

### 3. Kaynaklar Önce

Animasyonda kullanılacak resim/ikon/yazı tipi **önce** hazırla. Yarıda malzeme aramaya çıkma — ritmi bozar.

## Sık Sorulan Sorular

**Animasyon takılıyor**
→ Esas olarak layout thrashing. `transform` ve `opacity` kullan, `top`/`left`/`width`/`height`/`margin`'i hareket ettirme. Tarayıcı GPU'su `transform`'u hızlandırır.

**Animasyon çok hızlı, anlaşılmıyor**
→ Bir Çin karakteri okumak 100-150ms, bir kelime 300-500ms sürer. Metinle hikaye anlatıyorsan, tek cümle en az 3 saniye bırak.

**Animasyon çok yavaş, izleyici sıkılıyor**
→ İlginç görsel değişiklikler yoğun olmalı. Statik görüntü 5 saniyeden fazla dayanmaz.

**Birden fazla animasyon birbirini etkiliyor**
→ CSS `will-change: transform` kullanarak tarayıcıya bu öğenin hareket edeceğini önceden bildir, reflow azalt.

**Video olarak kaydetme**
→ Skill kendi araç zincirini kullan (tek komut üç format çıkarır): bkz. `video-export.md`
- `scripts/render-video.js` — HTML → 25fps MP4 (Playwright + ffmpeg)
- `scripts/convert-formats.sh` — 25fps MP4 → 60fps MP4 + optimize GIF
- Daha hassas kare render'ı mı istiyorsun? render(t)'yi pure function yap, bkz. `animation-pitfalls.md` madde 5

## Video Araçlarıyla Eşgüdüm

Bu skill **HTML animasyonu** yapar (tarayıcıda çalışır). Son ürün video malzemesi olarak kullanılacaksa:

- **Kısa animasyon/kavram demo**: Buradaki yöntemle HTML animasyonu yap → ekran kaydı
- **Uzun video/anlatı**: Bu skill HTML animasyona odaklanır, uzun video AI video üretim skill'i veya profesyonel video yazılımı kullanır
- **Motion graphics**: Profesyonel After Effects/Motion Canvas daha uygun

## Popmotion vb. Kütüphaneler Hakkında

Gerçekten fizik animasyonu (spring, decay, keyframes with precise timing) gerekiyorsa, motorumuz yetmez, Popmotion'a fallback yapabilirsin:

```html
<script src="https://unpkg.com/popmotion@11.0.5/dist/popmotion.min.js"></script>
```

Ama **önce motorumuzu dene**. %90 durumda yeterli.
