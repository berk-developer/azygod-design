<sub><b>Türkçe</b></sub>

<div align="center">

# Azygod Design

> *「Bir şey yaz. Enter'a bas. Teslim edilebilir bir tasarım elinde.」*
> *"Type. Hit enter. A finished design lands in your lap."*

[![License](https://img.shields.io/badge/License-Personal%20Use%20Only-orange.svg)](LICENSE)
[![Agent-Agnostic](https://img.shields.io/badge/Agent-Agnostic-blueviolet)](https://skills.sh)
[![Skills](https://img.shields.io/badge/skills.sh-Compatible-green)](https://skills.sh)

<br>

**Agent'ına bir cümle yaz, teslim edilebilir bir tasarım geri al.**

<br>

3 ila 30 dakika içinde bir **ürün lansman animasyonu**, tıklanabilir bir **App prototipi**, düzenlenebilir bir **PPTX sunumu** veya basım kalitesinde bir **infografik** oluşturabilirsin.

Bu "AI fena yapmamış" seviyesi değil—büyük şirketlerin tasarım ekiplerinin elinden çıkmış gibi görünüyor. Skill'e marka varlıklarını (logo, renk paleti, UI ekran görüntüleri) ver, o da markanın karakterini anlar; hiçbir şey vermezsen, yerleşik 20 tasarım dilinden biri AI slop üretmeden seni kurtarır.

**Bu README'de gördüğün her animasyon, azygod-design tarafından kendi başına üretildi.** Ne Figma, ne After Effects—sadece bir cümlelik prompt ve skill. Bir sonraki ürün lansmanın için tanıtım videosu mu lazım? Artık sen de yapabilirsin.

```
npx skills add alchaincyf/azygod-design
```

Tüm agent'larla uyumlu—Claude Code, Cursor, Codex, OpenClaw, Hermes üzerinde çalışır.

[Demolar](#demo-galerisi) · [Kurulum](#kurulum) · [Neler Yapabilir](#neler-yapabilir) · [Temel Mekanizmalar](#temel-mekanizmalar) · [Claude Design ile İlişki](#claude-design-ile-iliski)

</div>

---

<p align="center">
  <img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/hero-animation-v10-en.gif" alt="azygod-design Hero · Terminal → 4 yön → Galeri dalgalanması → 4 odaklanma → Marka ortaya çıkışı" width="100%">
</p>

<p align="center"><sub>
  ▲ 25 saniye · Terminal → 4 yön → Galeri dalgalanması → 4 odaklanma → Marka ortaya çıkışı<br>
  👉 <a href="https://www.huasheng.ai/azygod-design-hero/">Ses efektleriyle HTML etkileşimli sürümü ziyaret et</a> ·
  <a href="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/hero-animation-v10-en.mp4">MP4 indir (BGM+SFX içerir · 10MB)</a>
</sub></p>

---

## Kurulum

```bash
npx skills add alchaincyf/azygod-design
```

Ardından Claude Code'da doğrudan şunu söyle:

```
「Bir AI Psikolojisi sunum PPTX'i yap, seçmem için 3 stil yönü öner」
「Bir AI Pomodoro iOS prototipi yap, 4 temel ekran gerçekten tıklanabilir olsun」
「Bu mantığı 60 saniyelik animasyona dönüştür, MP4 ve GIF olarak dışa aktar」
「Bu tasarımı 5 boyutta değerlendir」
```

Hiçbir düğme, hiçbir panel, hiçbir Figma eklentisi yok.

---

## Star Geçmişi

<p align="center">
  <a href="https://star-history.com/#alchaincyf/azygod-design&Date">
    <img src="https://api.star-history.com/svg?repos=alchaincyf/azygod-design&type=Date" alt="azygod-design Star History" width="80%">
  </a>
</p>

---

## Neler Yapabilir

| Yetenek | Çıktı | Tipik Süre |
|------|--------|----------|
| Etkileşimli Prototip (App / Web) | Tek dosya HTML · Gerçek iPhone bezel · Tıklanabilir · Playwright doğrulaması | 10–15 dk |
| Sunum Slaytları | HTML deck (tarayıcıda sunum) + Düzenlenebilir PPTX (metin kutuları korunur) | 15–25 dk |
| Zaman Çizelgesi Animasyonu | MP4 (25fps / 60fps kare ekleme) + GIF (palet optimizasyonu) + BGM | 8–12 dk |
| Tasarım Varyasyonları | 3+ yan yana karşılaştırma · Tweaks anlık parametre ayarı · Çok boyutlu keşif | 10 dk |
| İnfografik / Görselleştirme | Basım kalitesinde tipografi · PDF/PNG/SVG olarak dışa aktarılabilir | 10 dk |
| Tasarım Yönü Danışmanı | 5 ekol × 20 tasarım felsefesi · 3 yön önerisi · Paralel Demo oluşturma | 5 dk |
| 5 Boyutlu Uzman Değerlendirmesi | Radar grafiği + Koru/Düzelt/Hızlı Kazanımlar · Uygulanabilir düzeltme listesi | 3 dk |

---

## Demo Galerisi

### Tasarım Yönü Danışmanı

Belirsiz gereksinimlerde yedek çözüm: 5 ekol × 20 tasarım felsefesinden 3 farklı yön seç, paralel olarak 3 Demo oluştur ve seçmeni bekle.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/w3-fallback-advisor.gif" width="100%"></p>

### iOS App Prototipi

iPhone 15 Pro hassas gövde (Dynamic Island / Durum çubuğu / Ana Ekran Göstergesi) · Durum odaklı çoklu ekran geçişi · Gerçek görseller Wikimedia/Met/Unsplash'tan alınır · Playwright otomatik tıklama testi.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/c1-ios-prototype.gif" width="100%"></p>

### Motion Design Motoru

Stage + Sprite zaman dilimi modeli · `useTime` / `useSprite` / `interpolate` / `Easing` dört API'si tüm animasyon ihtiyaçlarını karşılar · Tek komutla MP4 / GIF / 60fps kare ekleme / BGM'li final video dışa aktarımı.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/c3-motion-design.gif" width="100%"></p>

### HTML Slaytlar → Düzenlenebilir PPTX

HTML deck tarayıcıda sunum · `html2pptx.js` DOM'un `computedStyle`'ını okuyarak öğe öğe PowerPoint nesnelerine çevirir · Dışa aktarılanlar **gerçek metin kutularıdır**, altına resim serpiştirilmiş değil.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/c2-slides-pptx.gif" width="100%"></p>

### Tweaks · Anlık Varyasyon Değiştirme

Renk şeması / Yazı tipi / Bilgi yoğunluğu gibi parametrik ayarlar · Yan panelde geçiş · Saf frontend + `localStorage` kalıcılığı · Yenileme sonrası kaybolmaz.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/c4-tweaks.gif" width="100%"></p>

### İnfografik / Veri Görselleştirme

Dergi kalitesinde tipografi · CSS Grid hassas sütunlar · `text-wrap: pretty` baskı detayları · Gerçek veri odaklı · PDF vektör / PNG 300dpi / SVG olarak dışa aktarılabilir.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/c5-infographic.gif" width="100%"></p>

### 5 Boyutlu Uzman Değerlendirmesi

Felsefi tutarlılık · Görsel hiyerarşi · Detay yürütme · İşlevsellik · Yenilikçilik her biri 0–10 puan · Radar grafiği görselleştirme · Çıktı: Koru / Düzelt / Hızlı Kazanımlar listesi.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/c6-expert-review.gif" width="100%"></p>

### Junior Designer İş Akışı

Kendi başına büyük şeyler yapmaya kalkma: önce varsayımlar + yer tutucular + gerekçeler yaz, sana en kısa sürede göster, sonra yinele. Yanlış anlamayı erken düzeltmek, geç düzeltmekten 100 kat daha ucuzdur.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/w2-junior-designer.gif" width="100%"></p>

### Marka Varlığı Protokolü 5 Adımlı Sert Süreç

Belirli bir marka söz konusu olduğunda zorunlu: Sor → Ara → İndir (üç yedek) → grep renk değerleri → `brand-spec.md` yaz.

<p align="center"><img src="https://github.com/alchaincyf/azygod-design/releases/download/v2.0/w1-brand-protocol.gif" width="100%"></p>

---

## Temel Mekanizmalar

### Marka Varlığı Protokolü

Skill'deki en katı kural seti. Belirli bir marka (Stripe, Linear, Anthropic, kendi şirketiniz vb.) söz konusu olduğunda 5 adım zorunlu:

| Adım | Eylem | Amaç |
|------|------|------|
| 1 · Sor | Kullanıcının marka yönergeleri var mı? | Mevcut kaynaklara saygı |
| 2 · Resmi marka sayfasını ara | `<brand>.com/brand` · `brand.<brand>.com` · `<brand>.com/press` | Yetkili renk değerlerini yakala |
| 3 · Varlıkları indir | SVG dosyası → Resmi site HTML tam metin → Ürün ekran görüntüsünden renk alma | Üç yedek, biri başarısız olursa hemen sonrakine geç |
| 4 · grep ile renk değerlerini çıkar | Varlıklardan tüm `#xxxxxx` değerlerini yakala, sıklığa göre sırala, siyah/beyaz/griyi filtrele | **Marka renklerini asla hafızadan tahmin etme** |
| 5 · Spec'i kalıcı hale getir | `brand-spec.md` + CSS değişkenleri yaz, tüm HTML'ler `var(--brand-*)` kullansın | Kalıcı hale getirilmezse unutulur |

A/B testi (v1 vs v2, her biri 6 agent ile çalıştırıldı): **v2'nin stabilite varyansı v1'den 5 kat daha düşük**. Stabilite üzerine kurulu istikrar—bu skill'in gerçek rekabet avantajıdır.

### Tasarım Yönü Danışmanı (Fallback)

Kullanıcı gereksinimi o kadar belirsiz ki nereden başlanacağı belli değilse tetiklenir:

- Genel sezgisel algıya dayanarak zorla yapma, Fallback moduna geç
- 5 ekol × 20 tasarım felsefesinden, farklı ekollerden gelmek zorunda olan 3 farklılaştırılmış yön öner
- Her yöne temsilci eser, karakter anahtar kelimeleri ve temsilci tasarımcı eşlik eder
- Paralel olarak 3 görsel Demo oluştur ve kullanıcının seçmesini bekle
- Seçim yapıldıktan sonra ana Junior Designer iş akışına geç

### Junior Designer İş Akışı

Varsayılan çalışma modu, tüm görevleri kapsar:

- İşe başlamadan önce soru listesini kullanıcıya tek seferde göster, toplu yanıt gelene kadar bekle
- HTML'de önce varsayımlar + yer tutucular + gerekçe yorumları yaz
- Kullanıcıya en kısa sürede göster (sadece gri kareler bile olsa)
- Gerçek içerik ekleme → varyasyonlar → Tweaks adımlarını her birinde tekrar göster
- Teslimattan önce Playwright ile tarayıcıyı gözle kontrol et

### AI Slop Karşıtı Kurallar

Bir bakışta AI olduğu anlaşılan görsel ortak paydadan kaçın (mor gradient / emoji ikonlar / yuvarlak köşeler + sol border vurgusu / SVG ile yüz çizimi / Inter'i display olarak kullanma). `text-wrap: pretty` + CSS Grid + özenle seçilmiş serif display ve oklch renkleri kullan.

---

## Claude Design ile İlişki

Açıkça itiraf ediyorum: Marka varlığı protokolünün felsefesi, Claude Design'dan sızan prompt'lardan öğrenildi. O prompt sürekli olarak **iyi hi-fi tasarımın boş bir sayfadan başlamadığını, mevcut tasarım bağlamından büyüdüğünü** vurguluyor. Bu ilke 65 puanlık bir eser ile 90 puanlık bir eser arasındaki belirleyici faktördür.

Konumlandırma farkları:

| | Claude Design | azygod-design |
|---|---|---|
| Biçim | Web ürünü (tarayıcıda kullanılır) | skill (Claude Code'da kullanılır) |
| Kota | Abonelik kotası | API tüketimi · Paralel agent çalıştırma kota ile sınırlı değil |
| Çıktı | Tuval içinde + Figma'ya dışa aktarılabilir | HTML / MP4 / GIF / Düzenlenebilir PPTX / PDF |
| Çalışma Şekli | GUI (tıkla, sürükle, değiştir) | Sohbet (konuş, agent'ın bitirmesini bekle) |
| Karmaşık Animasyon | Sınırlı | Stage + Sprite zaman çizelgesi · 60fps dışa aktarım |
| Çoklu Agent | Özel Claude.ai | Herhangi bir skill uyumlu agent |

Claude Design **daha iyi bir grafik aracıdır**, azygod-design ise **grafik araç katmanını ortadan kaldırır**. İki farklı yol, iki farklı hedef kitle.

---

## Sınırlamalar

- **Figma'ya katman katman düzenlenebilir PPTX dışa aktarımı desteklenmez.** HTML çıktısı üretilir, ekran görüntüsü alınabilir, kaydedilebilir, haritalanabilir, ancak Keynote'a sürüklenip metin konumu değiştirilemez.
- **Framer Motion seviyesinde karmaşık animasyonlar desteklenmez.** 3D, fizik simülasyonu, parçacık sistemi skill sınırlarının dışındadır.
- **Tamamen boş bir marka için sıfırdan tasarım kalitesi 60–65 puana düşer.** Hiçbir şey yokken hi-fi çizmek zaten son çaredir.

Bu 80 puanlık bir skill, 100 puanlık bir ürün değil. Grafik arayüzünü açmak istemeyen biri için 80 puanlık bir skill, 100 puanlık bir üründen daha kullanışlıdır.

---

## Depo Yapısı

```
azygod-design/
├── SKILL.md                 # Ana belge (agent'lar için)
├── README.md                # Bu dosya (kullanıcılar için)
├── assets/                  # Starter Components
│   ├── animations.jsx       # Stage + Sprite + Easing + interpolate
│   ├── ios_frame.jsx        # iPhone 15 Pro bezel
│   ├── android_frame.jsx
│   ├── macos_window.jsx
│   ├── browser_window.jsx
│   ├── deck_stage.js        # HTML slayt motoru
│   ├── deck_index.html      # Çok dosyalı deck birleştirici
│   ├── design_canvas.jsx    # Yan yana varyasyon gösterimi
│   ├── showcases/           # 24 önceden hazırlanmış örnek (8 sahne × 3 stil)
│   └── bgm-*.mp3            # 6 sahneye özgü arka plan müziği
├── references/              # Göreve göre derinlemesine okunacak alt belgeler
│   ├── animation-pitfalls.md
│   ├── design-styles.md     # 20 tasarım felsefesi detaylı kitaplığı
│   ├── slide-decks.md
│   ├── editable-pptx.md
│   ├── critique-guide.md
│   ├── video-export.md
│   └── ...
├── scripts/                 # Dışa aktarım araç zinciri
│   ├── render-video.js      # HTML → MP4
│   ├── convert-formats.sh   # MP4 → 60fps + GIF
│   ├── add-music.sh         # MP4 + BGM
│   ├── export_deck_pdf.mjs
│   ├── export_deck_pptx.mjs
│   ├── html2pptx.js
│   └── verify.py
└── demos/                   # 9 yetenek demosu (c*/w*), Çince ve İngilizce GIF/MP4/HTML + hero v10
```

---

## Köken

Anthropic Claude Design'i yayınladığında saat dörde kadar oynadım. Birkaç gün sonra bir daha açmadığımı fark ettim, kötü olduğu için değil—bu alanın şu anda en olgun ürünü—sadece agent'ın terminalde benim için çalışmasını tercih ediyorum, hiçbir grafik arayüzü açmak istemiyorum.

Bu yüzden agent'a Claude Design'ın kendisini parçalamasını söyledim (topluluk tarafından sızdırılan sistem prompt'ları, marka varlığı protokolü, bileşen mekanizmaları dahil), yapılandırılmış bir spec'e damıttım ve kendi Claude Code'uma skill olarak yazdım.

Anthropic'e Claude Design prompt'larını bu kadar net yazdığı için teşekkürler. Başka bir üründen ilham alarak yapılan bu tür ikincil yaratımlar, açık kaynak kültürünün AI çağındaki yeni biçimidir.

---

## Lisans · Kullanım İzni

**Kişisel kullanım ücretsiz ve özgürdür**—öğrenme, araştırma, yaratma, kendin için bir şeyler yapma, makale yazma, yan iş, sosyal medyada paylaşım, istediğin gibi kullan, izin sormana gerek yok.

**Kurumsal ticari kullanım yasaktır**—herhangi bir şirket, ekip veya kâr amacı güden organizasyon, bu skill'i ürününe entegre etmek, dış hizmet olarak sunmak veya müşteriye teslimatta kullanmak isterse, **önce Azygod ile iletişime geçip yetki almalıdır**. Şunlar dahil ancak bunlarla sınırlı değildir:
- Skill'i şirket içi araç zincirinin bir parçası olarak kullanmak
- Skill çıktılarını dış teslimatların ana yaratım aracı olarak kullanmak
- Skill üzerinden ikincil geliştirme yaparak ticari ürün oluşturmak
- Müşteri projelerinde kullanmak

**Ticari kullanım yetki ve iletişim bilgileri** aşağıdaki sosyal medya platformlarında.

---

## İletişim · Azygod

Azygod, AI Native Coder, bağımsız geliştirici ve AI içerik üreticisidir. Öne çıkan çalışmaları: Kitty Softbox (AppStore Ücretli Listesi #1), 《DeepSeek'le Baştan Sona》, Nuwa .skill (GitHub 12000+ star). Sosyal medyada toplam 300.000+ takipçisi vardır.

| Platform | Hesap | Bağlantı |
|---|---|---|
| X / Twitter | @AlchainHust | https://x.com/AlchainHust |
| WeChat Official | Azygod | WeChat'te "Azygod" ara |
| Bilibili | Azygod | https://space.bilibili.com/14097567 |
| YouTube | Azygod | https://www.youtube.com/@Alchain |
| Xiaohongshu | Azygod | https://www.xiaohongshu.com/user/profile/5abc6f17e8ac2b109179dfdf |
| Resmi Site | huasheng.ai | https://www.huasheng.ai/ |
| Geliştirici Ana Sayfası | bookai.top | https://bookai.top |

Ticari kullanım yetkisi, iş birliği danışmanlığı, içerik siparişi → Yukarıdaki platformların herhangi birinden Azygod'a özel mesaj atabilirsiniz.
