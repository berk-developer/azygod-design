# Design Context: Mevcut Bağlamdan Hareketle

**Bu skill'ın en önemli tek şeyi budur.**

İyi hi-fi tasarım mutlaka mevcut design context'ten büyür. **Boşu boşuna hi-fi yapmak son çaredir, kesinlikle generic bir ürün verir**. Bu yüzden her tasarım görevi başlarken sor: Referans alınabilecek bir şey var mı?

## Design Context Nedir

Öncelik yüksekten düşüğe:

### 1. Kullanıcının Design System/UI Kit'i
Kullanıcının kendi ürününde mevcut bileşen kütüphanesi, renk token'ı, yazı tipi kuralları, icon sistemi. **En mükemmel durum**.

### 2. Kullanıcının Codebase'i
Kullanıcı kod deposu verdiyse, içinde canlı bileşen uygulamaları vardır. Bu bileşen dosyalarını oku:
- `theme.ts` / `colors.ts` / `tokens.css` / `_variables.scss`
- Somut bileşenler (Button.tsx, Card.tsx)
- Yerleşim iskeleti (App.tsx, MainLayout.tsx)
- Global stylesheets

**Koddan tam değerleri kopyala**: hex kodları, aralık ölçeği, font stack, border radius. Hafızandan yeniden çizme.

### 3. Kullanıcının Yayınlanmış Ürünü
Kullanıcının yayında ürünü varsa ama kod vermemişse, Playwright veya kullanıcıdan ekran görüntüsü iste.

```bash
# Herkese açık bir URL'nin Playwright ekran görüntüsünü al
npx playwright screenshot https://example.com screenshot.png --viewport-size=1920,1080
```

Gerçek görsel kelime dağarcığını görmene izin verir.

### 4. Marka Kılavuzu/Logo/Mevcut Malzeme
Kullanıcının olabilir: Logo dosyası, marka renk kuralları, pazarlama malzemeleri, slide şablonu. Bunların hepsi context'tir.

### 5. Rakip Referansı
Kullanıcı "XX web sitesi gibi" dediğinde — ondan URL veya ekran görüntüsü iste. **Eğitim verindeki bulanık izlenimle yapma**.

### 6. Bilinen design system (fallback)
Yukarıdakilerin hiçbiri yoksa, tanınmış bir tasarım sistemini temel olarak kullan:
- Apple HIG
- Material Design 3
- Radix Colors (renk)
- shadcn/ui (bileşen)
- Tailwind varsayılan palet

Kullanıcıya ne kullandığını açıkça söyle, bunun başlangıç noktası olduğunu, nihai tasarım olmadığını bilsin.

## Context Alma Akışı

### Adım 1: Kullanıcıya Sor

Görev başlangıcında mutlaka sorulacak liste (`workflow.md`'den):

```markdown
1. Hazır design system/UI kit/bileşen kütüphaneniz var mı? Nerede?
2. Marka kılavuzu, renk/yazı tipi kuralları var mı?
3. Mevcut ürününüzün ekran görüntüsü veya URL'sini verebilir misiniz?
4. Okuyabileceğim bir codebase var mı?
```

### Adım 2: Kullanıcı "Yok" Dediğinde, Ona Yardım Et

Doğrudan vazgeçme. Dene:

```markdown
Bakalım ipucu var mı:
- Daha önceki projelerinizde ilgili tasarım var mı?
- Şirketinizin pazarlama web sitesi hangi renk/yazı tipini kullanıyor?
- Ürününüzün Logo'su ne stil? Bana bir resim verebilir misiniz?
- Referans olarak beğendiğiniz bir ürün var mı?
```

### Adım 3: Bulunabilen Tüm Context'i Oku

Kullanıcı codebase yolu verdiyse, şunları oku:
1. **Önce dosya yapısını listele**: stil/tema/bileşen ile ilgili dosyaları bul
2. **Tema/token dosyalarını oku**: Somut hex/px değerlerini kaldır
3. **2-3 temsili bileşen oku**: Görsel kelime dağarcığına bak (hover state, gölge, kenarlık, padding node pattern)
4. **Global stylesheet'i oku**: Temel reset, font yükleme
5. **Figma bağlantısı/ekran görüntüsü varsa**: Resme bak, ama **koda daha fazla güven**

**Önemli**: **Bir bakışta izlenimle yapma**. Okuduğunda 30+ somut değer varsa gerçekten kaldırılmış demektir.

### Adım 4: Kullanacağın Sistemi Seslendir

Context'i okuduktan sonra, kullanıcıya kullanacağın sistemi söyle:

```markdown
Codebase'iniz ve ürün ekran görüntünüzden çıkardığım tasarım sistemi:

**Renk**
- Primary: #C27558 (tokens.css'ten)
- Background: #FDF9F0
- Text: #1A1A1A
- Muted: #6B6B6B

**Yazı Tipi**
- Display: Instrument Serif (global.css'in @font-face'inden)
- Body: Geist Sans
- Mono: JetBrains Mono

**Aralık** (ölçek sisteminizden)
- 4, 8, 12, 16, 24, 32, 48, 64

**Gölge pattern**
- `0 1px 2px rgba(0,0,0,0.04)` (subtle card)
- `0 10px 40px rgba(0,0,0,0.1)` (elevated modal)

**Border-radius**
- Küçük bileşen 4px, kart 12px, düğme 8px

**Bileşen kelime dağarcığı**
- Düğme: filled primary, outlined secondary, ghost tertiary, hepsi 8px köşe yuvarlak
- Kart: Beyaz arka plan, subtle gölge, kenarlık yok

Buna göre başlıyorum. Sorun yok mu?
```

Kullanıcı onayladıktan sonra işe başla.

## Boşu Boşuna Tasarım (Context Yoksa Fallback)

**Şiddetle uyarı**: Bu durumda ürün kalitesi önemli ölçüde düşer. Kullanıcıya açıkça söyle.

```markdown
Design context'iniz yok, yalnızca genel sezgisellik üzerine yapabilirim.
Ürün "görünürde tamam ama benzersizlikten yoksun" olacak.
Devam etmek istiyorsunuz, yoksa önce referans malzeme tamamlamak mı istersiniz?
```

Kullanıcı ısrarla yapmanı istiyorsa, bu sırayla karar ver:

### 1. Bir estetik yön seç
Generic sonuç verme. Belirli bir yön seç:
- brutally minimal
- editorial/magazine
- brutalist/raw
- organic/natural
- luxury/refined
- playful/toy
- retro-futuristic
- soft/pastel

Kullanıcıya hangisini seçtiğini söyle.

### 2. Bilinen bir design system'i iskelet olarak seç
- Renk için Radix Colors kullan (https://www.radix-ui.com/colors)
- Bileşen kelime dağarcığı için shadcn/ui kullan (https://ui.shadcn.com)
- Aralık ölçeği için Tailwind (4'ün katları)

### 3. Özellikli yazı tipi eşleştirmesi seç

Inter/Roboto kullanma. Önerilen kombinasyonlar (Google Fonts'tan ücretsiz):
- Instrument Serif + Geist Sans
- Cormorant Garamond + Inter Tight
- Bricolage Grotesque + Söhne (ücretli)
- Fraunces + Work Sans (Fraunces'in AI tarafından tüketildiğine dikkat)
- JetBrains Mono + Geist Sans (teknik his)

### 4. Her Kilit Kararın Gerekçesi Olsun

Sessizce seçme. HTML yorumuna yaz:

```html
<!--
Design decisions:
- Primary color: warm terracotta (oklch 0.65 0.18 25) — "editorial" yönüne uygun  
- Display: Instrument Serif for humanist, literary feel
- Body: Geist Sans for cleanness contrast
- No gradients — minimal kararlı, AI slop yok
- Spacing: 8px base, golden ratio friendly (8/13/21/34)
-->
```

## Import Stratejisi (Kullanıcı Codebase Verdiyse)

Kullanıcı "bu codebase'i referans olarak import et" dediyse:

### Küçük (<50 dosya)
Tamamını Oku, context'i içselleştir.

### Orta (50-500 dosya)
Odak noktaları:
- `src/components/` veya `components/`
- Tüm styles/tokens/theme ile ilgili dosyalar
- 2-3 temsili tam sayfa bileşeni (Home.tsx, Dashboard.tsx)

### Büyük (>500 dosya)
Kullanıcıdan odak noktası belirtmesini iste:
- "Settings sayfası yapacağım" → Mevcut settings ile ilgili olanları oku
- "Yeni bir feature yapacağım" → Genel shell + en yakın referansı oku
- Tamamı değil, doğruluk

## Figma/Tasarım Çizimi ile Eşgüdüm

Kullanıcı Figma bağlantısı verdiyse:

- **Figma'yı doğrudan HTML'e dönüştürebileceğini bekleme** — bu ek araç gerektirir
- Figma bağlantıları genellikle herkese açık erişilebilir değil
- Kullanıcıdan: **Ekran görüntüsü** göndermesini iste + somut renk/aralık değerlerini söylemesini iste

Yalnızca Figma ekran görüntüsü verdiyse, kullanıcıya söyle:
- Görseli görebiliyorum, ama hassas değerleri alamıyorum
- Kilit sayılar (hex, px) lütfen bana söyleyin, veya code olarak export edin (Figma destekler)

## Son Hatırlatma

**Bir projenin tasarım kalite sınırı, aldığın context kalitesiyle belirlenir**.

Context toplamak için 10 dakika harcamak, boşu boşuna 1 saat hi-fi çizmekten daha değerlidir.

**Context olmayan durumda, önce kullanıcıdan iste, zorla devam etme**.
