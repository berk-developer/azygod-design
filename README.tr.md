<sub><b>🌐 Türkçe</b></sub>

<div align="center">

# Azygod Design

> *"Yaz. Enter'a bas. Bitmiş bir tasarım kucağına düşsün."*
> *"Bir sey yaz. Enter'a bas. Teslim edilebilir bir tasarim elinde."*

[![License](https://img.shields.io/badge/License-Personal%20Use%20Only-orange.svg)](LICENSE)
[![Agent-Agnostic](https://img.shields.io/badge/Agent-Agnostic-blueviolet)](https://skills.sh)
[![Skills](https://img.shields.io/badge/skills.sh-Compatible-green)](https://skills.sh)

<br>

**Ajanına tek bir cümle söyle — Claude Code, Cursor, Codex, OpenClaw, Hermes hepsi çalışır.**

<br>

3 ila 30 dakika içinde **ürün lansman animasyonu**, tıklanabilir App prototipi, düzenlenebilir PPTX sunumları, baskı kalitesinde infografik teslim edebilirsin.

"AI için iyi" kalitesinde değil — gerçek bir tasarım ekibi yapmış gibi görünüyor. Yeteneğe marka varlıklarını (logo, renkler, UI ekran görüntüleri) ver ve markanın dilini okur; hiçbir şey verme ve yerleşik 20 tasarım sözlüğü seni AI slop bölgesinden uzak tutmaya devam eder.

**Bu README'deki her animasyon azygod-design tarafından kendisi yapıldı.** Figma yok, After Effects yok — sadece bir cümle + skill çalıştırması. Bir sonraki ürün lansmanı için tanıtım videosu mu lazım? Sen de yapabilirsin.

```
npx skills add alchaincyf/azygod-design
```

[Çalışırken gör](#demo-galerisi) · [Kurulum](#kurulum) · [Ne yapar](#ne-yapar) · [Nasıl çalışır](#temel-mekanikler) · [vs. Claude Design](#claude-designa-karşı)

> 📖 **İngilizce okuyucular için not**: bu skill Çince konuşan bir geliştirici tarafından oluşturulmuştur. Skill'in ajan promptları (`SKILL.md`, `references/*.md`) Çince'dir ancak ajan iki dilli — İngilizce görevlerde de sorunsuz çalışır. Aşağıdaki demolar İngilizce paralel versiyonlardır; Çince olanlar varsayılan isimli dosyalarda bulunur (Çince [README.md](README.md)'ye bakın).

</div>

---

<p align="center">
  <video src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/hero-animation-v10-en.mp4" autoplay muted loop playsinline width="100%">
    Tarayıcınız inline video desteklemiyor. <a href="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/hero-animation-v10-en.mp4">MP4 indir</a>.
  </video>
</p>

<p align="center"><sub>▲ azygod-design'ın ne yaptığını gösteren 10 saniyelik hero animasyonu (autoplay çalışmazsa <a href="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/hero-animation-v10-en.mp4">MP4 indir</a>)</sub></p>

---

## Kurulum

```bash
npx skills add alchaincyf/azygod-design
```

Sonra sadece Claude Code ile konuş:

```
"Yapay zeka psikolojisi için bir keynote hazırla. Seçmem için 3 stil yönü öner."
"Pomodoro app'i için bir iOS prototipi oluştur — 4 ekran, gerçekten tıklanabilir."
"Bu mantığı 60 saniyelik bir animasyona dönüştür. MP4 ve GIF olarak export et."
"Bu tasarım üzerinde 5 boyutlu uzman incelemesi yap."
```

Hiçbir düğme, panel, Figma eklentisi yok. Ajan-agnostik — Claude Code, Cursor, Trae, Hermes, OpenClaw veya markdown-skill destekleyen herhangi bir ajana entegre olur.

---

## Yıldız Geçmişi

<p align="center">
  <a href="https://star-history.com/#alchaincyf/azygod-design&Date">
    <img src="https://api.star-history.com/svg?repos=alchaincyf/azygod-design&type=Date" alt="azygod-design Star History" width="80%">
  </a>
</p>

---

## Ne yapar

| Yetenek | Çıktı | Tipik süre |
|---|---|---|
| Etkileşimli prototip (App / Web) | Tek dosya HTML · gerçek iPhone bezel · tıklanabilir · Playwright ile doğrulanmış | 10–15 dk |
| Slayt sunumları | HTML sunum (tarayıcıda sunum) + düzenlenebilir PPTX (metin çerçeveleri korunur) | 15–25 dk |
| Motion design | MP4 (25fps / 60fps interpolasyon) + GIF (palet optimize) + BGM | 8–12 dk |
| Tasarım varyasyonları | 3+ yan yana · Canlı parametre ayarları · çok boyutlu keşif | 10 dk |
| İnfografik / data viz | Baskı kalitesinde tipografi · PDF/PNG/SVG olarak export | 10 dk |
| Tasarım yönü danışmanı | 5 ekol × 20 felsefe · 3 yön önerilir · Demolar paralel oluşturulur | 5 dk |
| 5 boyutlu uzman eleştirisi | Radar grafiği + Tut/Sıfırla/Hızlı Kazanımlar · uygulanabilir görev listesi | 3 dk |

---

## Demo Galerisi

> Demoların İngilizce paralel versiyonları. Çince versiyonlar varsayılan dosya adlarında bulunur (Çince README'ye bakın).

### Tasarım Yönü Danışmanı

Belirsiz brief'ler için yedek çözüm: 5 ekol × 20 felsefeden 3 farklı yön seç, 3 demo'yu paralel oluştur, kullanıcının seçmesine izin ver.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/w3-fallback-advisor-en.gif" width="100%"></p>

### iOS App Prototipi

Piksel hassasiyetinde iPhone 15 Pro kasası (Dynamic Island / durum çubuğu / Home Indicator) · durum odaklı çoklu ekran navigasyonu · Wikimedia/Met/Unsplash'tan çekilmiş gerçek görseller · teslimattan önce Playwright tıklama testleri.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/c1-ios-prototype-en.gif" width="100%"></p>

### Motion Design Motoru

Stage + Sprite zaman dilimi modeli · `useTime` / `useSprite` / `interpolate` / `Easing` — dört API tüm animasyon ihtiyacını karşılar · tek komut MP4 / GIF / 60fps interpolasyonlu / BGM eşlikli final dosyalarını export eder.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/c3-motion-design-en.gif" width="100%"></p>

### HTML Slaytlar → Düzenlenebilir PPTX

Tarayıcıda sunum için HTML sunumlar · `html2pptx.js` DOM computed style'larını okur ve her elementi gerçek PowerPoint nesnesine dönüştürür · export edilenler **gerçek metin çerçeveleridir**, görüntü yatağı sahtekarlığı değil.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/c2-slides-pptx-en.gif" width="100%"></p>

### Tweaks · Canlı Varyasyon Değiştirme

Renkler / tipografi / bilgi yoğunluğu parametrelendirilmiş · yan panel toggle · saf frontend + `localStorage` kalıcılığı · yenilemeden korunur.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/c4-tweaks-en.gif" width="100%"></p>

### İnfografik / Data Viz

Dergi kalitesinde tipografi · hassas CSS Grid sütunları · `text-wrap: pretty` tipografik detaylar · gerçek veri ile yönlendirilir · vektör PDF / 300dpi PNG / SVG olarak export eder.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/c5-infographic-en.gif" width="100%"></p>

### 5 Boyutlu Uzman Eleştirisi

Felsefi tutarlılık · görsel hiyerarşi · uygulama zanaati · işlevsellik · yenilikçilik — her biri 0–10 arası puanlanır · radar grafik görselleştirmesi · Tut / Sıfırla / Hızlı Kazanımlar görev listesi çıktıları.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/c6-expert-review-en.gif" width="100%"></p>

### Junior Tasarımcı İş Akışı

Kahramanca tek seferlik denemeler yok: varsayımlar + placeholder'lar + gerekçe ile başla, kullanıcıya erken göster, sonra iterasyon yap. Erken bir yanlış anlamayı düzeltmek, geç düzeltmekten 100 kat daha ucuzdur.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/w2-junior-designer-en.gif" width="100%"></p>

### Temel Varlık Protokolü · 5 adımlı sert süreç

Görev belirli bir marka içerdiğinde zorunlu: sor → ara → indir (üç yedek yol) → doğrula + çıkar → **logo, ürün çekimleri, UI ekran görüntüleri, renkler, fontlar** dahil tüm gerekli varlıkları kapsayan `brand-spec.md` yaz — sadece renkler değil.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/w1-brand-protocol-en.gif" width="100%"></p>

---

## Temel Mekanikler

### Temel Varlık Protokolü

Skill'deki en zor kural. Görev belirli bir markaya (Stripe, Linear, Anthropic, DJI, kendi şirketin vb.) dokunduğunda beş adım zorunlu kılınır:

| Adım | Eylem | Amaç |
|---|---|---|
| 1 · Sor | 6 varlık türü kontrol listesi: logo / ürün çekimleri / UI ekran görüntüleri / renk paleti / fontlar / marka kılavuzları | Mevcut kaynaklara saygı göster |
| 2 · Resmi kanallarda ara | `<brand>.com/brand` · `<brand>.com/press` · `brand.<brand>.com` · ürün sayfaları · lansman filmleri | Yetkili varlıkları bul |
| 3 · Varlık türüne göre indir | Logo (SVG → HTML'de inline-SVG → sosyal avatar) · Ürün çekimleri (hero → basın kiti → lansman video kareleri → referanstan AI ile oluşturulan) · UI (App Store ekran görüntüleri → resmi video kareleri) | Her varlık türü için üç yedek yol |
| 4 · Doğrula + çıkar | Logo sadakatini kontrol et · ürün görüntü çözünürlüğü · UI güncelliği · gerçek varlıklardan hex renk kodunu grep'le | **Asla hafızadan tahmin etme** |
| 5 · Spec'e dondur | Logo yolları, ürün görüntü yolları, UI ekran görüntüsü yolları, renkler/fontlar için CSS değişkenleri ile `brand-spec.md` yaz | Donmamış bilgi buharlaşır |

**Varlık önem sıralaması** (skill'in iç rubriğinden):

1. Logo — herhangi bir marka için zorunlu
2. Ürün render'ları — fiziksel ürünler için zorunlu
3. UI ekran görüntüleri — dijital ürünler için zorunlu
4. Renk değerleri — yardımcı
5. Fontlar — yardımcı

A/B test edilmiştir (v1 vs v2, her biri 6 ajan): **v2 kararlılık varyansını 5 kat azalttı**. Kararlılığın kararlılığı — işte gerçek hendek.

### Tasarım Yönü Danışmanı (Yedek)

Brief yürütülemeyecek kadar belirsiz olduğunda tetiklenir:

- Genel sezgi üzerinde çalışma — Yedek moduna geç
- 5 ekol × 20 felsefeden **farklı bir ekolden** 3 farklı yön öner
- Her biri amiral gemisi çalışmaları, gestalt anahtar kelimeleri, temsilci tasarımcı ile gelir
- 3 görsel demoyu paralel oluştur, kullanıcının seçmesine izin ver
- Seçildikten sonra Junior Tasarımcı ana akışına devam et

### Junior Tasarımcı İş Akışı

Her görevde varsayılan çalışma modu:

- Tüm soru setini tek seferde gönder, hareket etmeden önce tüm cevapları bekle
- Varsayımları + placeholder'ları + gerekçe yorumlarını doğrudan HTML'e yaz
- Kullanıcıya erken göster (hatta sadece gri bloklar olsa bile)
- Gerçek içerik doldur → varyasyonlar → Tweaks — bu üç adımda da göster
- Teslimattan önce Playwright ile tarayıcıyı manuel olarak kontrol et

### Gerçek Doğrulama İlkesi (İlke #0)

Gerçek bir hata modundan sonra eklenen en yüksek öncelikli kural: görev belirli bir ürün / teknoloji / etkinlikten bahsettiğinde (örn. "DJI Pocket 4", "Nano Banana Pro", "Gemini 3 Pro"), ilk eylem **mutlaka** varlığını, yayın durumunu, mevcut sürümünü ve özelliklerini doğrulamak için `WebSearch` olmalıdır. Eğitim korpusundan gelen iddialar yok. Bir aramanın maliyeti: ~10 saniye. Yanlış bir varsayımın maliyeti: 1–2 saat yeniden iş.

### Anti AI-slop Kuralları

AI çıktısının görsel ortak paydasından kaçın (mor gradient'ler / emoji ikonları / yuvarlak köşe + sol kenar vurgusu / SVG insanları / Inter display olarak / **gerçek ürün çekimlerinin yerini tutan CSS siluetleri**). `text-wrap: pretty` + CSS Grid + dikkatle seçilmiş serif display yüzleri + oklch renkleri kullan.

---

## Claude Design'a Karşı

Dürüst olayım: Temel Varlık Protokolü felsefesi Anthropic'in Claude Design için yazdığı sistem promptlarından ödünç alındı. O prompt tek bir fikri vurgular — **harika hi-fi tasarım boş bir sayfadan başlamaz, mevcut tasarım bağlamından büyür**. Tek bu ilke, 65 puanlık bir tasarım ile 90 puanlık bir tasarım arasındaki farktır.

Konumlandırma farklılıkları:

| | Claude Design | azygod-design |
|---|---|---|
| Biçim | Web ürünü (tarayıcıda kullanılır) | Skill (Claude Code'da kullanılır) |
| Kota | Abonelik kotası | API kullanımı · paralel ajanlar engellenmez |
| Çıktı | Canvas + Figma export | HTML / MP4 / GIF / düzenlenebilir PPTX / PDF |
| Etkileşim | GUI (tıkla, sürükle, düzenle) | Konuşma (ajana söyle, bekle) |
| Karmaşık animasyon | Sınırlı | Stage + Sprite timeline · 60fps export |
| Ajan uyumluluğu | Sadece Claude.ai | Claude Code / Cursor / Trae / Hermes / OpenClaw |

Claude Design **daha iyi bir grafik aracıdır**. Azygod-design **grafik-aracı katmanını ortadan kaldırır**. İki farklı yol, farklı kitleler.

---

## Sınırlamalar

- **Katman düzenlenebilir PPTX-to-Figma dönüşümü yok.** Çıktı HTML'dir — ekran görüntüsü alınabilir, kaydedilebilir, görüntü olarak export edilebilir, ancak metin konumu ayarlamaları için Keynote'a sürüklenemez.
- **Framer-Motion seviyesi karmaşık animasyonlar kapsam dışı.** 3D, fizik simülasyonu, parçacık sistemleri skill sınırlarını aşar.
- **Sıfırdan marka tasarım kalitesi 60–65 puana düşer.** Hiçbir şey olmadan hi-fi çizmek her zaman son çareydi.

Bu 80 puanlık bir skill, 100 puanlık bir ürün değil. Grafiksel bir UI açmaya istekli olmayanlar için, 80 puanlık bir skill 100 puanlık bir ürünü yenar.

---

## Depo Yapısı

```
azygod-design/
├── SKILL.md                 # Ana doküman (ajan tarafından okunur, Çince)
├── README.md                # Çince README (varsayılan)
├── README.en.md             # İngilizce README (bu dosya)
├── assets/                  # Başlangıç Bileşenleri
│   ├── animations.jsx       # Stage + Sprite + Easing + interpolate
│   ├── ios_frame.jsx        # iPhone 15 Pro bezel
│   ├── android_frame.jsx
│   ├── macos_window.jsx
│   ├── browser_window.jsx
│   ├── deck_stage.js        # HTML sunum motoru
│   ├── deck_index.html      # Çok dosyalı sunum birleştirici
│   ├── design_canvas.jsx    # Yan yana varyasyon gösterimi
│   ├── showcases/           # 24 önceden oluşturulmuş örnek (8 sahne × 3 stil)
│   └── bgm-*.mp3            # 6 sahne özel arka plan müziği
├── references/              # Göreve göre detay dokümanlar (Çince)
│   ├── animation-pitfalls.md
│   ├── design-styles.md     # 20 tasarım felsefesi detaylı
│   ├── slide-decks.md
│   ├── editable-pptx.md
│   ├── critique-guide.md
│   ├── video-export.md
│   └── ...
├── scripts/                 # Export araç zinciri
│   ├── render-video.js      # HTML → MP4
│   ├── convert-formats.sh   # MP4 → 60fps + GIF
│   ├── add-music.sh         # MP4 + BGM
│   ├── export_deck_pdf.mjs
│   ├── export_deck_pptx.mjs
│   ├── html2pptx.js
│   └── verify.py
└── demos/                   # Bu README tarafından referans edilen yetenek demoları
```

---

## Köken Hikayesi

Anthropic Claude Design'ı piyasaya sürdüğü gün onunla saat 4'e kadar oynadım. Birkaç gün sonra bir kez bile açmadığımı fark ettim — kötü olduğu için değil (kategorideki en cilalı ürün) ama ajanımın terminalimde çalışmasını tercih ettiğim için hiçbir grafiksel UI açmak istemedim.

Bu yüzden bir ajan Claude Design'ın kendisini (toplumda dolaşan sistem promptları, marka varlık protokolü, bileşen mekaniği dahil) çözümledi, yapılandırılmış bir spec'e özetledi, sonra kendi Claude Code'uma yüklenen bir skill olarak yazdı.

Claude Design promptlarını bu kadar net yazdıkları için Anthropic'e teşekkürler. Bu tür diğer ürünlerden esinlenen türev çalışmalar, AI çağında açık kaynak kültürünün yeni biçimidir.

---

## Lisans · Kullanım Hakları

**Kişisel kullanım ücretsiz ve kısıtsızdır** — öğrenme, araştırma, kendin için bir şeyler oluşturma, makale yazma, yan projeler, kişisel sosyal medya. Özgürce kullan, sormana gerek yok.

**Kurumsal / ticari kullanım kısıtlıdır** — bu skill'i bir ürün, harici hizmet veya müşteri teslimatına entegre eden herhangi bir şirket, ekip veya kar amaçlı kuruluş **önce Azygod'dan yetki almalıdır**. Şunları dahil ancak bunlarla sınırlı değil:
- Skill'i dahili şirket araç zincirinin bir parçası olarak kullanma
- Skill çıktılarını harici teslimatlar için birincik yaratıcı yöntem olarak kullanma
- Skill üzerine ticari bir ürün inşa etme
- Ücretli müşteri projelerinde kullanma

**Ticari lisanslama iletişimi**: aşağıdaki sosyal platformlardan herhangi biri.

---

## Bağlantı · Azygod (Azygod)

Azygod, AI-native bir kodcu, bağımsız geliştirici ve AI içerik oluşturucusudur. Dikkat çekici çalışmaları: Cat Fill Light (App Store Ücretli kategorisinde 1. sırada), *A Book on DeepSeek*, Nüwa.skill (GitHub'da 12k+ yıldız). Platformlar arası toplam 300k+ takipçi.

| Platform | Kullanıcı adı | Bağlantı |
|---|---|---|
| X / Twitter | @AlchainHust | https://x.com/AlchainHust |
| WeChat Resmi Hesabı | Azygod | WeChat'te "Azygod" ara |
| Bilibili | Azygod | https://space.bilibili.com/14097567 |
| YouTube | Azygod | https://www.youtube.com/@Alchain |
| Xiaohongshu | Azygod | https://www.xiaohongshu.com/user/profile/5abc6f17e8ac2b109179dfdf |
| Resmi Site | huasheng.ai | https://www.huasheng.ai/ |
| Geliştirici Merkezi | bookai.top | https://bookai.top |

Ticari lisanslama, işbirlikleri veya sponsorlu içerik için yukarıdakilerden herhangi biri üzerinden DM atın.
