# Content Guidelines: Anti-AI Slop, İçerik Kriterleri, Ölçek Kuralları

AI tasarımda en kolay düşülen tuzaklar. Bu bir "ne yapma" listesidir, "ne yap" listesinden daha önemlidir — çünkü AI slop varsayılan değerdir, aktif olarak önlemezseniz gerçekleşir.

## AI Slop Tam Kara Listesi

### Görsel Tuzaklar

**❌ Agresif degrade arka plan**
- Mor → Pembe → Mavi tam ekran degrade (AI üretimi web sitesinin tipik kokusu)
- Her yönde rainbow gradient
- Mesh gradient arka planı kaplayan
- ✅ Degrade kullanılacaksa: subtle, tek renk tonu, kasıtlı olarak nokta süsleme (örn. düğme hover)

**❌ Yuvarlak köşeli kart + sol border accent rengi**
```css
/* Bu AI kokusu kartın tipik imzası */
.card {
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  padding: 16px;
}
```
Bu kart AI üretimi Dashboard'da yaygınlaştı. Vurgu yapmak istiyorsan daha tasarım hissiyatlı yöntemler kullan: arka plan rengi kontrastı, yazı kalınlığı/boyutu kontrastı, düz ayırıcı çizgi, veya kartı tamamen kaldır.

**❌ Emoji dekorasyon**
Marka kendisi emoji kullanmıyorsa (örn: Notion, Slack), UI'da emoji kullanma. **Özellikle**:
- Başlık önünde 🚀 ⚡️ ✨ 🎯 💡
- Özellik listesinin ✅
- CTA düğmesindeki → (ok tek başına tamam, emoji ok değil)

İkon yoksa gerçek icon kütüphanesi kullan (Lucide/Heroicons/Phosphor), veya placeholder kullan.

**❌ SVG ile imagery çizme**
SVG ile şunları çizmeye çalışma: insan, sahne, cihaz, nesne, soyut sanat. AI çizimi SVG imagery bir bakışta AI kokusu verir, çocuksu ve ucuzdur. **Bir gri dikdörtgen + "illüstrasyon yeri 1200×800" metin etiketi, kötü bir SVG hero illustration'dan 100 kat daha iyidir**.

SVG kullanılabilecek tek senaryo:
- Gerçek icon (16×16 ila 32×32 seviye)
- Geometrik şekil dekoratif öğe
- Data viz grafiği

**❌ Aşırı ikonografi**
Her başlık/özellik/bölüm icon gerektirmez. Icon kötüye kullanım arayüzü oyuncak gibi yapar. Az çoktur.

**❌ "Data slop"**
Uydurulan istatistik dekorasyonu:
- "10,000+ mutlu müşteri" (gerçekten var mı bilmiyorsun)
- "%99.9 uptime" (gerçek veri yoksa yazma)
- İkon + sayı + kelime oluşturulan dekoratif "metric kartları"
- Mock table'daki sahte verilerin süslü sunumu

Gerçek veri yoksa placeholder bırak veya kullanıcıdan iste.

**❌ "Quote slop"**
Uydurulan kullanıcı değerlendirmeleri, ünlü söz dekorasyonu sayfa. Placeholder bırak, kullanıcıdan gerçek quote iste.

### Yazı Tipi Tuzakları

**❌ Bu bayılmış yazı tiplerinden kaçın**:
- Inter (AI üretimi web sitesi varsayılanı)
- Roboto
- Arial / Helvetica
- Saf system font stack
- Fraunces (AI bunu keşfetti ve tüketti)
- Space Grotesk (yakın zamanda AI'nın favorisi)

**✅ Özellikli display+body eşleştirmesi kullan**. İlham yönleri:
- Serif display + sans-serif body (editorial his)
- Mono display + sans body (teknik his)
- Heavy display + light body (kontrast)
- Variable font ile hero kalınlık animasyonu

Yazı tipi kaynakları:
- Google Fonts nadir iyi seçenekler (Instrument Serif, Cormorant, Bricolage Grotesque, JetBrains Mono)
- Açık kaynak font siteleri (Fraunces'in kardeş fontları, Adobe Fonts)
- Boşu boşuna font adı icat etme

### Renk Tuzakları

**❌ Boşu boşuna renk icat etme**
Tanımadığınız bir renk setini sıfırdan tasarlamayın. Bu genellikle uyumsuzdur.

**✅ Strateji**:
1. Marka rengi var → Marka rengini kullan, eksik color token için oklch interpolasyonu
2. Marka rengi yok ama referans var → Referans ürün ekran görüntüsünden renk örnekle
3. Tamamen sıfırdan → Bilinen bir renk sistemi seç (Radix Colors / Tailwind varsayılan palet / Anthropic markası), kendin ayarlama

**oklch ile renk tanımlama** en modern yaklaşımdır:
```css
:root {
  --primary: oklch(0.65 0.18 25);      /* Sıcak terracotta */
  --primary-light: oklch(0.85 0.08 25); /* Aynı ton açık renk */
  --primary-dark: oklch(0.45 0.20 25);  /* Aynı ton koyu renk */
}
```
oklch parlaklık ayarlarken renk tonunun kaymadığını garanti eder, hsl'den daha kullanışlıdır.

**❌ Gece modu rastgele ters renk**
Basit renk invert değil. İyi dark mode doygunluk, kontrast, accent rengi yeniden ayarlama gerektirir. Dark mode yapmak istemiyorsan yapma.

### Yerleşim Tuzakları

**❌ Bento grid aşırı yaygınlığı**
Her AI üretimi landing page bento yapmak istiyor. Bilgi yapın gerçekten bento'ya uygun değilse başka yerleşim kullan.

**❌ Büyük hero + 3-sütun özellikler + referanslar + CTA**
Bu landing page şablonu tüketildi. Yenilik yapmak istiyorsan gerçekten yenilik yap.

**❌ Kart grid'de her kart aynı uzunlukta**
Asimetrik, farklı boyutlarda kartlar, bazısı resimli bazısı yalnızca metin, bazısı sütunları aşıyor — bu gerçek tasarımcı yaptığına benzer.

## İçerik Kriterleri

### 1. Don't add filler content

Her öğe yerini hak etmelidir. Boşluk tasarım sorunudur, **kompozisyon** ile çözülür (kontrast, ritim, boşluk), **içerik doldurarak** değil.

**Filler olup olmadığını sorgula**:
- Bu içeriği kaldırırsam tasarım bozulur mu? Cevap "hayır"sa kaldır.
- Bu öğe hangi gerçek sorunu çözüyor? "Sayfa boş olmasın" ise sil.
- Bu istatistik/quote/özellik gerçek veri destekli mi? Yoksa boşu boşuna yazma.

"One thousand no's for every yes".

### 2. Ask before adding material

Bir paragraf/sayfa/bölüm daha eklemek daha iyi olur mu düşünüyorsan? Önce kullanıcıya sor, tek taraflı ekleme.

Neden:
- Kullanıcı kendi kitlesini senden daha iyi bilir
- İçerik ekleme maliyeti var, kullanıcı istemeyebilir
- Tek taraflı içerik ekleme "junior designer'ın çalışma raporu sunması" ilişkisini ihlal eder

### 3. Create a system up front

Tasarım context'i keşfettikten sonra, **önce sözlü olarak kullanacağın sistemi söyle**, kullanıcı onaylasın:

```markdown
Tasarım sistemim:
- Renk: #1A1A1A ana gövde + #F0EEE6 arka plan + #D97757 accent (markanızdan)
- Yazı tipi: Instrument Serif display + Geist Sans body
- Ritim: bölüm başlığı full-bleed renkli arka plan + beyaz yazı; normal bölüm beyaz arka plan
- Görsel: hero full-bleed fotoğraf, özellik bölümü placeholder siz sağlayana kadar
- En fazla 2 arka plan rengi, karışıklıktan kaçın

Bu yönü onaylarsanız başlarım.
```

Kullanıcı onayladıktan sonra işe başla. Bu check-in "yarıda yön hatası keşfetme"yi önler.

## Ölçek Kuralları

### Slaytlar (1920×1080)

- Gövde metni en az **24px**, ideal 28-36px
- Başlık 60-120px
- Bölüm başlığı 80-160px
- Hero headline 180-240px büyük yazı kullanabilir
- Slaytta asla <24px yazı kullanma

### Basılı Belgeler

- Gövde metni en az **10pt** (≈13.3px), ideal 11-12pt
- Başlık 18-36pt
- Altyazı 8-9pt

### Web ve Mobil

- Gövde metni en az **14px** (yaşlı dostu 16px)
- Mobil gövde metni **16px** (iOS otomatik ölçeklemeyi önle)
- Hit target (tıklanabilir öğe) en az **44×44px**
- Satır yüksekliği 1.5-1.7 (Çince 1.7-1.8)

### Kontrast

- Gövde metni vs arka plan **en az 4.5:1** (WCAG AA)
- Büyük yazı vs arka plan **en az 3:1**
- Chrome DevTools erişilebilirlik aracı ile kontrol et

## CSS Sihirbazlığı

**İleri CSS özellikleri** tasarımcının iyi arkadaşıdır, cesurca kullan:

### Tipografi

```css
/* Başlık satır sonu daha doğal, son satır yalnız tek kelime kalmaz */
h1, h2, h3 { text-wrap: balance; }

/* Gövde metni satır sonu, dull ve yetimden kaçın */
p { text-wrap: pretty; }

/* Çince tipografi sihirbazlığı: noktalama işareti sıkıştırma, satır başı sonu kontrolü */
p { 
  text-spacing-trim: space-all;
  hanging-punctuation: first;
}
```

### Yerleşim

```css
/* CSS Grid + adlandırılmış alanlar = okunabilirlik patlaması */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
}

/* Subgrid kart içeriğini hizalar */
.card { display: grid; grid-template-rows: subgrid; }
```

### Görsel Efektler

```css
/* Tasarım hissiyatlı kaydırma çubuğu */
* { scrollbar-width: thin; scrollbar-color: #666 transparent; }

/* Cam morfizm (öz gücüyle kullan) */
.glass {
  backdrop-filter: blur(20px) saturate(150%);
  background: color-mix(in oklch, white 70%, transparent);
}

/* View transitions API sayfa geçişini pürüzsüzleştirir */
@view-transition { navigation: auto; }
```

### Etkileşim

```css
/* :has() seçici koşullu stilleri kolaylaştırır */
.card:has(img) { padding-top: 0; } /* Resimli kartın üst padding'i yok */

/* container queries bileşeni gerçekten duyarlı yapar */
@container (min-width: 500px) { ... }

/* Yeni color-mix fonksiyonu */
.button:hover {
  background: color-mix(in oklch, var(--primary) 85%, black);
}
```

## Karar Hızlı Arama: Kararsız olduğunda

- Degrade eklemek mi istiyorsun? → Büyük olasılıkla ekleme
- Emoji eklemek mi istiyorsun? → Ekleme
- Karta yuvarlak köşe + sol border accent eklemek mi istiyorsun? → Ekleme, başka yöntem kullan
- SVG ile hero illüstrasyonu çizmek mi istiyorsun? → Çizme, placeholder kullan
- Bir quote dekorasyonu eklemek mi istiyorsun? → Önce kullanıcının gerçek quote'u var mı sor
- Bir sıra icon özellikleri eklemek mi istiyorsun? → Önce icon gerekli mi sor, belki gerekmez
- Inter kullanmak mı istiyorsun? → Daha özellikli birine geç
- Mor degrade kullanmak mı istiyorsun? → Dayanağı olan bir renk paletine geç

**"Biraz eklemek daha güzel olur" dediğinde — bu genellikle AI slop'un belirtisidir**. Önce en sade versiyonu yap, yalnızca kullanıcı talep ettiğinde ekle.
