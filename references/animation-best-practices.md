# Animation Best Practices · Pozitif Animasyon Tasarım Grameri

> Anthropic'ın üç resmi ürün animasyonundan (Claude Design / Claude Code Desktop / Claude for Word)
> derinlemesine çıkarılan "Anthropic seviyesi" animasyon tasarım kuralları.
>
> Eşlikçi dosya `animation-pitfalls.md` (hata önleme listesi) ile birlikte kullanılır — bu dosya "**bunu yapmalısın**",
> pitfalls ise "**bunu yapma**"dır; ikisi birbirini tamamlar, ikisi de okunmalı.
>
> **Kısıtlama beyanı**: Bu dosya yalnızca **hareket mantığı ve ifade stili** içerir, **hiçbir marka rengi spesifik değeri** getirmez.
> Renk kararları §1.a Çekirdek Varlık Protokolüne (marka spesifikasyonundan alınan) veya "Tasarım Yönü Danışmanı"na
> (20 farklı felsefenin kendi renk şemaları) gider. Bu referans "**nasıl hareket eder**"i tartışır, "**ne renk**"i değil.

---

## §0 · Sen Kimsin · Kimlik ve Zevk

> Sonraki teknik kuralları okumadan önce bu bölümü oku. Kurallar **kimlikten doğar** —
> tersi değil.

### §0.1 Kimlik Çıpası

**Anthropic / Apple / Pentagram / Field.io hareket arşivlerini incelemiş bir motion designersın.**

Animasyon yaparken CSS transition ayarlamıyorsun — dijital öğelerle **bir fizik dünyasını simüle ediyorsun**,
izleyicinin bilinçaltına "bunun ağırlığı, eylemsizliği var, taşabiliyor" inancını aşılıyorsun.

PowerPoint tarzı animasyon yapmazsın. "fade in fade out" animasyonu yapmazsın. Yaptığın animasyon **insanın ekrana elini sokabileceğine inanmasını sağlar**.

### §0.2 Çekirdek İnançlar (3 madde)

1. **Animasyon fiziktir, animasyon eğrisi değil**
   `linear` bir sayıdır, `expoOut` bir nesnedir. Ekrandaki piksellerin "nesne" olarak muamele görmeyi hak ettiğine inanırsın.
   Her bir easing seçimi, "bu öğe ne kadar ağır? Sürtünme katsayısı ne?" sorusuna fiziksel bir yanıttır.

2. **Zaman dağılımı eğri şeklinden daha önemlidir**
   Yavaş-Hızlı-Boom-Durma senin nefesindir. **Eşit ritimli animasyon teknik demodur, ritimli animasyon anlatımdır.**
   Doğru anda yavaşlamak — yanlış anda doğru easing kullanmaktan daha önemlidir.

3. **İzleyiciye saygı duymak, hava atmaktan daha zordur**
   Kilit sonuçtan önce 0.5 saniye durmak **tekniktir**, uzlaşma değil. **İnsan beyninin tepki süresi vermek, bir animatörün en yüksek vasfıdır.**
   AI varsayılan olarak duraksama olmayan, bilgi yoğunluğu maksimum bir animasyon yapar — bu acemidir. Sen yapman gereken öz güttür.

### §0.3 Zevk Standardı · Güzel Nedir

"İyi" ve "harika" arasındaki karar kriterlerin aşağıdadır. Her birinin **tanıma yöntemi** vardır — bir aday animasyon gördüğünde,
bunları kullanarak ulaşıp ulaşmadığına karar ver, 14 kuralı mekanikçe karşılaştırma.

| Güzellik Boyutu | Tanıma Yöntemi (İzleyici Tepkisi) |
|---|---|
| **Fiziksel Ağırlık Hissi** | Animasyon bittiğinde, öğe "**düşer**" — "**durur**" değil. İzleyici bilinçaltıyla "bunun ağırlığı var" der |
| **İzleyiciye Saygı** | Kilit bilgi görünmeden önce hissedilebilir bir pause (≥300ms) — izleyici "**görmeye**" yetişir |
| **Boşluk** | Sonuç ani duruş + hold'dur, fade to black değil. Son kare net, kesin, kararlı |
| **Öz Gücü** | Tüm videoda yalnızca bir yerde "120% incelik" vardır, gerisi %80'i tam yerindedir — **her yerde hava atmak ucuz sinyaldir** |
| **El Hissi** | Yay (düz değil), düzensiz (setInterval'in mekanik ritmi değil), nefes alıyor |
| **Saygı** | Tweak sürecini göstermek, bug düzeltmesini göstermek — **işi saklamamak, "sihir" sunmamak**. AI işbirlikçidir, sihirbaz değil |

### §0.4 Kendi Kontrol · İzleyici İlk Tepki Yöntemi

Bir animasyon bitirdikten sonra, **izleyici izledikten sonraki ilk tepkisi nedir?** — optimize edeceğin tek metrik budur.

| İzleyici Tepkisi | Değerlendirme | Tanı |
|---|---|---|
| "Gayet akıcı görünüyor" | good | Uygun ama özelliksiz, PowerPoint yapıyorsun |
| "Bu animasyon çok yumuşak" | good+ | Teknik doğru ama etkileyici değil |
| "Bu şey gerçekten **masadan yükseliyormuş gibi** görünüyor" | great | Fiziksel ağırlık hissinde dokundun |
| "Bu AI yapımı gibi değil" | great+ | Anthropic eşiğine dokundun |
| "Bunu **ekran görüntüsü alıp** arkadaşlarıma göstermek istiyorum" | great++ | İzleyiciyi aktif olarak paylaşmaya ikna ettin |

**great ve good arasındaki fark, teknik doğrulukta değil, zevk kararındadır**. Teknik doğru + zevk doğru = great.
Teknik doğru + zevk boş = good. Teknik yanlış = acemi.

### §0.5 Kimlik ve Kurallar Arasındaki İlişki

Aşağıdaki §1-§8 teknik kuralları, bu kimliğin somut senaryolardaki **uygulama araçlarıdır** — bağımsız kural listesi değil.

- Kuralın kapsamadığı bir senaryoyla karşılaştığında → §0'a dön, **kimlikle** karar ver, tahmin etme
- Kurallar arasında çatışma olduğunda → §0'a dön, **zevk standardıyla** hangisinin daha önemli olduğuna karar ver
- Bir kuralı kırmak istediğinde → önce şunu yanıtla: "Bu §0.3'ün hangi güzellik maddesine uyuyor?" Cevap verebiliyorsan kır, veremiyorsan kırma

Tamam. Okumaya devam et.

---

## Genel Bakış · Animasyon Fiziğin Üç Katmanlı Açılımı

Çoğu AI üretimi animasyonun ucuz görünmesinin kök nedeni — **"rakam" gibi davranıp "nesne" gibi davranmaması**.
Gerçek dünyadaki nesnelerin kütlesi, eylemsizliği, esnekliği vardır, taşarlar. Anthropic'ın üç videosunun "premium hissi" kökü,
dijital öğelere bir **fizik dünyası hareket kural seti** vermesindedir.

Bu kural setinin 3 katmanı vardır:

1. **Anlatı Ritim Katmanı**: Yavaş-Hızlı-Boom-Durma zaman dağılımı
2. **Hareket Eğrisi Katmanı**: Expo Out / Overshoot / Spring, linear'ı reddet
3. **İfade Dili Katmanı**: Süreci göstermek, fare yayları, Logo şekil değişimi ile toparlanma

---

## 1. Anlatı Ritmi · Yavaş-Hızlı-Boom-Durma 5 Bölüm Yapısı

Anthropic'ın üç videosu istisnasız bu yapıyı takip eder:

| Bölüm | Oran | Ritim | Görevi |
|---|---|---|---|
| **S1 Tetik** | ~%15 | Yavaş | İnsan tepki süresi ver, gerçeklik oluştur |
| **S2 Oluşum** | ~%15 | Orta | Görsel şaşırtma noktası ortaya çıkar |
| **S3 Süreç** | ~%40 | Hızlı | Kontrol edilebilirlik/yoğunluk/detay göster |
| **S4 Patlama** | ~%20 | Boom | Kamera geri çekilir/3D pop-out/çoklu panel belirir |
| **S5 Duruş** | ~%10 | Durgun | Marka Logo + ani duruş |

**Somut süre eşleştirmesi** (15 saniyelik animasyon örneği):
S1 Tetik 2s · S2 Oluşum 2s · S3 Süreç 6s · S4 Patlama 3s · S5 Duruş 2s

**Yasaklanan şeyler**:
- ❌ Eşit ritim (her saniye aynı bilgi yoğunluğu) — izleyici yorulur
- ❌ Sürekli yüksek yoğunluk — zirve yok, hafıza noktası yok
- ❌ Yavaş yavaş sonuç (fade out ile şeffaflığa) — **ani duruş** olmalı

**Kendi kontrol**: Kağıda 5 thumbnail çiz, her biri bir bölümün zirve görüntüsünü temsil etsin. 5 resim arasında fark azsa,
ritim oluşmamış demektir.

---

## 2. Easing Felsefesi · linear'ı reddet, fizikle kucakla

Anthropic'ın üç videosundaki tüm hareketler "sönümlemeli" Bézier eğrisi kullanır. Varsayılan cubic easeOut
(`1-(1-t)³`) **yeterince keskin değildir** — başlangıç yeterince hızlı değil, duruş yeterince sert değil.

### Üç Çekirdek Easing (animations.jsx'e yerleşik)

```js
// 1. Expo Out · Hızlı başlangıç yavaş fren (en yaygın, varsayılan ana easing)
// Karşılık gelen CSS: cubic-bezier(0.16, 1, 0.3, 1)
Easing.expoOut(t) // = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)

// 2. Overshoot · Elastik toggle/düğme patlaması
// Karşılık gelen CSS: cubic-bezier(0.34, 1.56, 0.64, 1)
Easing.overshoot(t)

// 3. Spring Fiziği · Geometrik cisim yerine dönme, doğal yerleşim
Easing.spring(t)
```

### Kullanım Eşleştirmesi

| Senaryo | Hangi Easing Kullanılır |
|---|---|
| Kart rise-in / panel girişi / Terminal fade / focus overlay | **`expoOut`** (ana easing, en yaygın) |
| Toggle geçiş / düğme patlaması / etkileşim vurgulama | `overshoot` |
| Preview geometrik cisim yerine dönme / fiziksel yerleşim / UI öğesi zıplama | `spring` |
| Sürekli hareket (örn. fare yörünge interpolasyonu) | `easeInOut` (simetri korunur) |

### Sezgisel Olmayan İçgörü

Çoğu ürün tanıtım videosunun animasyonu **çok hızlı ve serttir**. `linear` dijital öğeleri makine gibi yapar, `easeOut` temel puanıdır,
`expoOut` ise "premium hissi"nin teknik köküdür — dijital öğelere **fizik dünyasının ağırlık hissi** verir.

---

## 3. Hareket Dili · 8 Ortak Prensip

### 3.1 Arka plan saf siyah/saf beyaz olmaz

Anthropic'ın üç videosundan hiçbiri `#FFFFFF` veya `#000000` ana arka plan olarak kullanmaz. **Renk sıcaklığı taşıyan nötr renk**
(ılık veya serin) "kağıt / tuval / masa" maddeselliğine sahiptir, makine hissini azaltır.

**Somut renk değerleri kararı** §1.a Çekirdek Varlık Protokolüne (marka spesifikasyonundan alınan) veya "Tasarım Yönü Danışmanı"na
(20 farklı felsefenin kendi arka plan şemaları) gider. Bu referans spesifik renk değeri vermez — o **marka kararıdır**, hareket kuralı değil.

### 3.2 Easing asla linear değildir

Bkz. §2.

### 3.3 Yavaş-Hızlı-Boom-Durma anlatısı

Bkz. §1.

### 3.4 "Süreci" göster, "sihirli sonucu" değil

- Claude Design tweak parametrelerini gösterir, kaydırma çubuğunu sürükler (tek tıkla mükemmel sonuç değil)
- Claude Code kod hatasını gösterir + AI düzeltir (tek seferde başarılı değil)
- Claude for Word Redline kırmızı silme yeşil ekleme değişiklik sürecini gösterir (doğrudan nihai taslağı vermek değil)

**Ortak alt metin**: Ürün **işbirlikçi, çift programlama mühendisi, kıdemli editör**dir — tek tıkla sihirbaz değil.
Bu hassas bir şekilde profesyonel kullanıcıların "kontrol edilebilirlik" ve "gerçeklik" ağrı noktalarına vurur.

**Anti AI slop**: AI varsayılan olarak "sihirli tek tıkla başarı" animasyonu yapar (tek tıkla oluştur → mükemmel sonuç),
bu genel ortak paydadır. **Tersini yap** — süreci göster, tweak'i göster, bug'ı ve düzeltmeyi göster —
bu marka tanınırlığının kaynağıdır.

### 3.5 Fare yörüngesi elle çizilir (yay + Perlin Noise)

Gerçek insan fare hareketi düz çizgi değildir, "başlangıç hızlanması → yay → yavaşlama düzeltmesi → tıklama"dır.
AI'nın doğrudan doğrusal interpolasyonlu fare yörüngesi **bilinçaltı reddetme hissine** yol açar.

```js
// İkinci derece Bézier eğrisi interpolasyonu (başlangıç → kontrol noktası → bitiş)
function bezierQuadratic(p0, p1, p2, t) {
  const x = (1-t)*(1-t)*p0[0] + 2*(1-t)*t*p1[0] + t*t*p2[0];
  const y = (1-t)*(1-t)*p0[1] + 2*(1-t)*t*p1[1] + t*t*p2[1];
  return [x, y];
}

// Yol: başlangıç → ortadan sapma → bitiş (yay oluştur)
const path = [[100, 100], [targetX - 200, targetY + 80], [targetX, targetY]];

// Üzerine çok küçük Perlin Noise (±2px) ile "el titremesi" ekle
const jitterX = (simpleNoise(t * 10) - 0.5) * 4;
const jitterY = (simpleNoise(t * 10 + 100) - 0.5) * 4;
```

### 3.6 Logo "Şekil Değişimiyle Toparlanma" (Morph)

Anthropic'ın üç videosunun Logo girişi **yalnızca fade-in değil**, **önceki görsel öğeden şekil değişimidir**.

**Ortak model**: Son 1-2 saniyede Morph / Rotate / Converge yapılır, tüm anlatı marka noktasında "çöker".

**Düşük maliyetli uygulama** (gerçek morph olmadan):
Önceki görsel öğeyi "çökert" bir renk bloğuna (scale → 0.1, merkeze doğru translate),
renk bloğu "genişleyerek" wordmark'e açılır. Geçiş 150ms hızlı kesme + motion blur ile yapılır
(`filter: blur(6px)` → `0`).

```js
<Sprite start={13} end={14}>
  {/* Çökertme: önceki öğe scale 0.1, opacity sabit, filter blur artar */}
  const scale = interpolate(t, [0, 0.5], [1, 0.1], Easing.expoOut);
  const blur = interpolate(t, [0, 0.5], [0, 6]);
</Sprite>
<Sprite start={13.5} end={15}>
  {/* Genişleme: Logo renk bloğu merkezinden scale 0.1 → 1, blur 6 → 0 */}
  const scale = interpolate(t, [0, 0.6], [0.1, 1], Easing.overshoot);
  const blur = interpolate(t, [0, 0.6], [6, 0]);
</Sprite>
```

### 3.7 Serif + Sans-serif Çift Yazı Tipi

- **Marka / Seslendirme**: serif ("akademik his / yayın hissi / zevk" verir)
- **UI / Kod / Veri**: sans-serif + mono

**Tek tip yazı tipi yanlıştır**. Serif "zevk" verir, sans-serif "işlev" verir.

Somut yazı tipi seçimi marka spesifikasyonuna (brand-spec.md'in Display / Body / Mono üç yığını) veya tasarım yönü
danışmanının 20 felsefesine gider. Bu referans spesifik yazı tipi vermez — o **marka kararıdır**.

### 3.8 Odak Değişimi = Arka plan zayıflatma + Ön plan keskinleştirme + Flash yönlendirme

Odak değişimi **sadece** opacity'yi düşürmek değildir. Tam formül şudur:

```js
// Odak dışı öğelerin filtre kombinasyonu
tile.style.filter = `
  brightness(${1 - 0.5 * focusIntensity})
  saturate(${1 - 0.3 * focusIntensity})
  blur(${focusIntensity * 4}px)        // ← Kilit: blur eklemek gerçekten "geri çeker"
`;
tile.style.opacity = 0.4 + 0.6 * (1 - focusIntensity);

// Odak tamamlandıktan sonra odak konumunda 150ms Flash highlight ile bakışı geri yönlendir
focusOverlay.animate([
  { background: 'rgba(255,255,255,0.3)' },
  { background: 'rgba(255,255,255,0)' }
], { duration: 150, easing: 'ease-out' });
```

**Blur neden zorunludur**: Yalnızca opacity + brightness, odak dışı öğeler hâlâ "keskindir",
görsel olarak "arka plana çekilme" etkisi yoktur. blur(4-8px) odak dışını gerçekten bir derinlik katmanı geriye iter.

---

## 4. Somut Hareket Teknikleri (Doğrudan kopyalanabilecek kod parçacıkları)

### 4.1 FLIP / Shared Element Transition

Düğme "genişleyerek" giriş alanına dönüşür, **değil** düğme kaybolur + yeni panel belirir. Çekirdek **aynı DOM öğesi**nin
iki durum arasında transition yapmasıdır, iki öğenin cross-fade'i değil.

```jsx
// Framer Motion layoutId ile kullan
<motion.div layoutId="design-button">Design</motion.div>
// ↓ Tıkladıktan sonra aynı layoutId
<motion.div layoutId="design-button">
  <input placeholder="Describe your design..." />
</motion.div>
```

Yerel uygulama için https://aerotwist.com/blog/flip-your-animations/'a bak

### 4.2 "Nefes Alarak" Açılım (width→height)

Panel açılımı **aynı anda width ve height çekme değil**, şöyle:
- İlk %40 zaman: yalnızca width çek (height küçük kal)
- Son %60 zaman: width sabit, height doldur

Bu fizik dünyasının "önce aç, sonra doldur" hissinin simülasyonudur.

```js
const widthT = interpolate(t, [0, 0.4], [0, 1], Easing.expoOut);
const heightT = interpolate(t, [0.3, 1], [0, 1], Easing.expoOut);
style.width = `${widthT * targetW}px`;
style.height = `${heightT * targetH}px`;
```

### 4.3 Staggered Fade-up (30ms stagger)

Tablo satırları, kart sütunları, liste öğeleri girişinde, **her öğe 30ms gecikmeli**, `translateY` 10px'den 0'a döner.

```js
rows.forEach((row, i) => {
  const localT = Math.max(0, t - i * 0.03);  // 30ms stagger
  row.style.opacity = interpolate(localT, [0, 0.3], [0, 1], Easing.expoOut);
  row.style.transform = `translateY(${
    interpolate(localT, [0, 0.3], [10, 0], Easing.expoOut)
  }px)`;
});
```

### 4.4 Doğrusal Olmayan Nefes · Kilit sonuçtan önce 0.5s bekleme

Makine hızlı ve sürekli çalışır, ama **kilit sonuç görünmeden önce 0.5 saniye bekle**, izleyici beyninin tepki süresi olsun.

```jsx
// Tipik senaryo: AI oluşturmayı bitirir → 0.5s duraksar → sonuç belirir
<Sprite start={8} end={8.5}>
  {/* 0.5s duraksama — hiçbir şey hareket etmez, izleyici yüklenme durumuna odaklansın */}
  <LoadingState />
</Sprite>
<Sprite start={8.5} end={10}>
  <ResultAppear />
</Sprite>
```

**Karşı örnek**: AI oluşturmayı bitirir hemen sonuca kesintisiz geçer — izleyici tepki süresi yok, bilgi kaybı olur.

### 4.5 Chunk Reveal · Token akışını simüle etme

AI metin oluşturma **`setInterval` ile tek karakter sıçratma kullanma** (eski film altyazısı gibi), **chunk reveal** kullan
 — bir seferde 2-5 karakter, düzensiz aralıklarla, gerçek token akış çıktısını simüle eder.

```js
// Chunk'lara böl, karakterlere değil
const chunks = text.split(/(\s+|,\s*|\.\s*|;\s*)/);  // Sözcük + noktalama işaretlerine göre böl
let i = 0;
function reveal() {
  if (i >= chunks.length) return;
  element.textContent += chunks[i++];
  const delay = 40 + Math.random() * 80;  // Düzensiz 40-120ms
  setTimeout(reveal, delay);
}
reveal();
```

### 4.6 Beklenti → Eylem → Takip Etme

Disney 12 prensibinden 3'ü. Anthropic çok açıkça kullanır:

- **Anticipation** (beklenti): Eylem başlamadan önce küçük ters yönlü hareket (düğme hafifçe küçülür sonra patlar)
- **Action** (eylem): Ana eylemin kendisi
- **Follow-through** (takip etme): Eylem bittikten sonra yankı (kart yerleştikten sonra hafif bounce)

```js
// Kart girişinin tam üç bölümü
const anticip = interpolate(t, [0, 0.2], [1, 0.95], Easing.easeIn);     // Beklenti
const action  = interpolate(t, [0.2, 0.7], [0.95, 1.05], Easing.expoOut); // Ana eylem
const settle  = interpolate(t, [0.7, 1], [1.05, 1], Easing.spring);       // Geri zıplama
// Son scale = üç bölüm çarpımı veya parçalı uygulama
```

**Karşı örnek**: Yalnızca Action olan, Anticipation + Follow-through olmayan animasyon, "PowerPoint animasyonu" gibi görünür.

### 4.7 3D Perspective + translateZ Katmanlama

"Eğimli 3D + süzülen kart" havası istiyorsan, kapsayıcıya perspective ekle, tek tek öğelere farklı translateZ ver:

```css
.stage-wrap {
  perspective: 2400px;
  perspective-origin: 50% 30%;  /* Bakış hafifçe yukarıdan */
}
.card-grid {
  transform-style: preserve-3d;
  transform: rotateX(8deg) rotateY(-4deg);  /* Altın oran */
}
.card:nth-child(3n) { transform: translateZ(30px); }
.card:nth-child(5n) { transform: translateZ(-20px); }
.card:nth-child(7n) { transform: translateZ(60px); }
```

**rotateX 8° / rotateY -4° neden altın orandır**:
- 10°'den fazla → Öğe çarpıklığı çok fazla, "devrilmiş" gibi görünür
- 5°'den az → "Kesme" gibi değil "perspektif" gibi görünür
- 8° × -4° asimetrik oranı "kameranın masa sol üst köşesinden baktığı" doğal açıyı simüle eder

### 4.8 Çapraz Pan · Aynı anda XY harekti

Kamera hareketi saf yukarı-aşağı veya sol-sağ değil, **aynı anda XY hareketi** çapraz hareketi simüle eder:

```js
const panX = Math.sin(flowT * 0.22) * 40;
const panY = Math.sin(flowT * 0.35) * 30;
stage.style.transform = `
  translate(-50%, -50%)
  rotateX(8deg) rotateY(-4deg)
  translate3d(${panX}px, ${panY}px, 0)
`;
```

**Kilit**: X ve Y frekansları farklıdır (0.22 vs 0.35), Lissajous döngüsü düzenliliğinden kaçınır.

---

## 5. Sahne Formülleri (Üç Anlatı Şablonu)

Referans materyaldeki üç video üç ürün karakterine karşılık gelir. **Ürününe en uygun olanı seç**, karıştırma.

### Formül A · Apple Keynote Tiyatro Stili (Claude Design tipi)

**Uygun**: Büyük sürüm yayını, hero animasyonu, görsel şaşırtma öncelikli
**Ritim**: Yavaş-Hızlı-Boom-Durma güçlü yay
**Easing**: Tam süreç `expoOut` + az miktarda `overshoot`
**SFX yoğunluğu**: Yüksek (~0.4/s), SFX tonu BGM tonaliteye ayarlanır
**BGM**: IDM / Minimal tekno elektronik, sakin + hassas
**Toparlanma**: Kamera hızla geri çekilir → drop → Logo şekil değişimi → etere çalan tek ses → ani duruş

### Formül B · Tek Plan Araç Stili (Claude Code tipi)

**Uygun**: Geliştirici araçları, üretkenlik App'i, akış senaryoları
**Ritim**: Sürekli stabil akış, belirgin zirve yok
**Easing**: `spring` fizik + `expoOut`
**SFX yoğunluğu**: **0** (yalnızca BGM kurgu ritmiyle sürüklenir)
**BGM**: Lo-fi Hip-hop / Boom-bap, 85-90 BPM
**Kilit teknik**: Kilit UI eylemleri BGM kick/snare transient'lerine basar — "**Müzik ritmi etkileşim ses efektidir**"

### Formül C · Ofis Verimliliği Anlatı Stili (Claude for Word tipi)

**Uygun**: Kurumsal yazılım, doküman/tablo/takvim sınıfı, profesyonellik öncelikli
**Ritim**: Çok sahne sert kesme + Dolly In/Out
**Easing**: `overshoot` (toggle) + `expoOut` (panel)
**SFX yoğunluğu**: Orta (~0.3/s), UI click ağırlıklı
**BGM**: Jazzy Enstrümantal, minor, BPM 90-95
**Kilit vurgu**: Bir sahne mutlaka "tüm filmin vurgusu" olmalı — 3D pop-out / düzlemden yükselme

---

## 6. Karşı Örnekler · Bu AI slop'tur

| Karşı pattern | Neden yanlış | Doğru yaklaşım |
|---|---|---|
| `transition: all 0.3s ease` | `ease` linear'ın akrabasıdır, tüm öğeler aynı hızda | `expoOut` + öğe bazında stagger kullan |
| Tüm girişler `opacity 0→1` | Hareket yönü hissi yok | `translateY 10→0` + Anticipation ile birlikte |
| Logo fade-in | Anlatı toparlanma hissi yok | Morph / Converge / Çökertme-Açılım |
| Fare düz hareket | Bilinçaltı makine hissi | Bézier yayı + Perlin Noise |
| Yazma tek karakter sıçratma (setInterval) | Eski film altyazısı gibi | Chunk Reveal, rastgele aralıklar |
| Kilit sonuç bekleme yok | İzleyici tepki süresi yok | Sonuçtan önce 0.5s bekleme |
| Odak değişimi sadece opacity | Odak dışı öğeler hâlâ keskin | opacity + brightness + **blur** |
| Saf siyah zemin / Saf beyaz zemin | Siberpunk hissi / Yansıma yorgunluğu | Renk sıcaklığı taşıyan nötr renk (marka spesifikasyonuna git) |
| Tüm animasyonlar aynı hızlı | Ritim yok | Yavaş-Hızlı-Boom-Durma |
| Fade out sonuç | Kararlılık hissi yok | Ani duruş (son kareyi hold et) |

---

## 7. Kendi Kontrol Listesi (Animasyon tesliminden önce 60 saniye)

- [ ] Anlatı yapısı Yavaş-Hızlı-Boom-Durma, eşit ritim değil?
- [ ] Varsayılan easing `expoOut`, `easeOut` veya `linear` değil?
- [ ] Toggle / düğme patlaması `overshoot` kullandı?
- [ ] Kart / liste girişi 30ms stagger var?
- [ ] Kilit sonuçtan önce 0.5s bekleme var?
- [ ] Yazma Chunk Reveal kullanıyor, setInterval tek karakter değil?
- [ ] Odak değişimi blur ekledi (sadece opacity değil)?
- [ ] Logo şekil değişimiyle toparlanma (Morph), fade-in değil?
- [ ] Arka plan saf siyah / saf beyaz değil (renk sıcaklığı taşıyan)?
- [ ] Yazıda serif + sans-serif katmanlama var?
- [ ] Sonuç ani duruş, yavaş yavaş değil?
- [ ] (Fare varsa) Fare yörüngesi yay, düz çizgi değil?
- [ ] SFX yoğunluğu ürün karakterine uygun (Formül A/B/C'ye bak)?
- [ ] BGM ve SFX arasında 6-8dB ses yüksekliği farkı var? (`audio-design-rules.md`'ye bak)

---

## 8. Diğer Referanslarla İlişki

| referans | Konumlandırma | İlişki |
|---|---|---|
| `animation-pitfalls.md` | Teknik hata önleme (16 madde) | "**Bunu yapma**" · Bu dosyanın tersi |
| `animations.md` | Stage/Sprite motor kullanımı | Animasyon **nasıl yazılır** temeli |
| `audio-design-rules.md` | Çift yollu ses kuralları | Animasyon **ses eşlik** kuralları |
| `sfx-library.md` | 37 SFX listesi | Ses efekti **malzeme kütüphanesi** |
| `apple-gallery-showcase.md` | Apple galeri vitrin stili | Belirli bir hareket stilinin özel konusu |
| **Bu dosya** | Pozitif hareket tasarım grameri | "**Bunu yapmalısın**" |

**Çağrı sırası**:
1. Önce SKILL.md iş akışı Adım 3'teki dört konum sorusuna bak (anlatı rolü ve görsel sıcaklığı belirle)
2. Yön seçildikten sonra bu dosyayı okuyarak **hareket dilini** belirle (Formül A/B/C)
3. Kod yazarken `animations.md` ve `animation-pitfalls.md`'ye başvur
4. Video dışa aktarırken `audio-design-rules.md` + `sfx-library.md`'den geç

---

## Ek · Bu Dosyanın Malzeme Kaynakları

- Anthropic resmi animasyon çözümlemesi: Azygod proje dizinindeki `referans-animasyon/BEST-PRACTICES.md`
- Anthropic ses çözümlemesi: Aynı dizinde `AUDIO-BEST-PRACTICES.md`
- 3 referans videosu: `ref-{1,2,3}.mp4` + karşılık gelen `gemini-ref-*.md` / `audio-ref-*.md`
- **Sıkı filtreleme**: Bu referans hiçbir spesifik marka renk değerini, yazı tipi adını, ürün adını içermez.
  Renk/yazı tipi kararları §1.a Çekirdek Varlık Protokolüne veya 20 tasarım felsefesine gider.
