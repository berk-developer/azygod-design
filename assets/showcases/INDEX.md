# Tasarım Felsefesi Showcaseleri — Örnek Varlık Dizini

> 8 sahne × 3 stil = 24 önceden hazırlanmış tasarım örneği
> Faz 3'te tasarım yönü önerirken, "bu stil nasıl görünür"i doğrudan göstermek için kullanılır

## Stil Açıklaması

| Kod | Akım | Stil Adı | Görsel Ton |
|------|------|---------|---------|
| **Pentagram** | Bilgi Mimarisi | Pentagram / Michael Bierut | Siyah-beyaz ölçülü, İsviçre grid, güçlü yazı tipi hiyerarşisi, #E63946 kırmızı vurgu |
| **Build** | Minimalizm | Build Studio | Lüks seviyesinde boşluk (%70+), incelikli yazı ağırlığı (200-600), #D4A574 sıcak altın, zarif |
| **Takram** | Doğu Felsefesi | Takram | Yumuşak teknoloji hissi, doğal renkler (bej/gri/yeşil), yuvarlak köşeler, grafikler sanat gibi |

## Sahne Hızlı Bakış Tablosu

### İçerik Tasarım Sahneleri

| # | Sahne | Ölçü | Pentagram | Build | Takram |
|---|------|------|-----------|-------|--------|
| 1 | Kapak resmi | 1200×510 | `cover/cover-pentagram` | `cover/cover-build` | `cover/cover-takram` |
| 2 | PPT veri sayfası | 1920×1080 | `ppt/ppt-pentagram` | `ppt/ppt-build` | `ppt/ppt-takram` |
| 3 | Dikey infografik | 1080×1920 | `infographic/infographic-pentagram` | `infographic/infographic-build` | `infographic/infographic-takram` |

### Web Sitesi Tasarım Sahneleri

| # | Sahne | Ölçü | Pentagram | Build | Takram |
|---|------|------|-----------|-------|--------|
| 4 | Kişisel ana sayfa | 1440×900 | `website-homepage/homepage-pentagram` | `website-homepage/homepage-build` | `website-homepage/homepage-takram` |
| 5 | AI navigasyon sitesi | 1440×900 | `website-ai-nav/ainav-pentagram` | `website-ai-nav/ainav-build` | `website-ai-nav/ainav-takram` |
| 6 | AI yazma aracı | 1440×900 | `website-ai-writing/aiwriting-pentagram` | `website-ai-writing/aiwriting-build` | `website-ai-writing/aiwriting-takram` |
| 7 | SaaS açılış sayfası | 1440×900 | `website-saas/saas-pentagram` | `website-saas/saas-build` | `website-saas/saas-takram` |
| 8 | Geliştirici dokümanları | 1440×900 | `website-devdocs/devdocs-pentagram` | `website-devdocs/devdocs-build` | `website-devdocs/devdocs-takram` |

> Her öğe aynı anda `.html` (kaynak) ve `.png` (ekran görüntüsü) iki dosyaya sahiptir

## Kullanım Talimatları

### Faz 3 Önerirken Referans
Tasarım yönü önerildikten sonra, ilgili sahnenin önceden hazırlanmış ekran görüntüsü gösterilebilir:
```
"Bu Pentagram stili kapak resmi efekti → [cover/cover-pentagram.png göster]"
"Takram stili PPT veri sayfası bu hissi veriyor → [ppt/ppt-takram.png göster]"
```

### Sahne Eşleştirme Önceliği
1. Kullanıcı ihtiyacı sahnenin tam eşleşmesi var → Doğrudan ilgili sahneyi göster
2. Tam eşleşme yok ama tür yakın → En yakın sahneyi göster (örneğin "ürün web sitesi" → SaaS açılış sayfasını göster)
3. Tamamen eşleşmiyor → Önceden hazırlanmış örneği atla, doğrudan Faz 3.5'e geç ve yerinde üret

### Yatay Karşılaştırma Gösterimi
Aynı sahnenin 3 stili yan yana gösterilmeye uygundur, kullanıcının sezgisel olarak karşılaştırmasına yardımcı olur:
- "Bu aynı kapak resmi, 3 farklı stilde uygulanmış hali"
- Gösterim sırası: Pentagram (rasyonel ölçülü) → Build (lüks minimalizm) → Takram (yumuşak sıcak)

## İçerik Detayları

### Kapak Resmi (cover/)
- İçerik: Claude Code Agent İş Akışı — 8 paralel Agent mimarisi
- Pentagram: Dev kırmızı "8" + İsviçre grid çizgileri + veri çubukları
- Build: Ultra ince ağırlık "Agent" %70 boşlukta süzülüyor + sıcak altın ince çizgi
- Takram: 8 düğümlü radyal akış şeması sanat eseri olarak + bej zemin

### PPT Veri Sayfası (ppt/)
- İçerik: GLM-4.7 açık kaynak modeli Kodlama yeteneği atılımı (AIME 95.7 / SWE-bench 73.8% / τ²-Bench 87.4)
- Pentagram: 260px "95.7" çapa + kırmızı/gri/açık gri karşıtlık çubuk grafikleri
- Build: Üç grup 120px ultra ince sayı süzülüyor + sıcak altın gradyan karşıtlık çubukları
- Takram: SVG radar grafiği + üç renk bindirme + yuvarlak köşeli veri kartları

### Dikey Infografik (infographic/)
- İçerik: AI bellek sistemi CLAUDE.md 93KB'dan 22KB'ye optimize edildi
- Pentagram: Dev "93→22" sayı + numaralandırılmış bloklar + CSS veri çubukları
- Build: Aşırı boşluk + yumuşak gölge kartları + sıcak altın bağlantı çizgileri
- Takram: SVG halka grafiği + organik eğri akış şeması + buzlu cam kartları

### Kişisel Ana Sayfa (website-homepage/)
- İçerik: Bağımsız geliştirici Alex Chen'in portfolyo ana sayfası
- Pentagram: 112px büyük isim + İsviçre grid sütunları + editör sayıları
- Build: Cam efekti navigasyon + süzülen istatistik kartları + ultra ince ağırlık
- Takram: Kağıt dokusu + küçük dairesel avatar + saç teli ince ayırıcı çizgiler + asimetrik düzen

### AI Navigasyon Sitesi (website-ai-nav/)
- İçerik: AI Compass — 500+ AI araç dizini
- Pentagram: Kare köşeli arama kutusu + numaralandırılmış araç listesi + büyük harfli kategori etiketleri
- Build: Yuvarlak köşeli arama kutusu + zarif beyaz araç kartları + hap etiketler
- Takram: Organik yer değiştirme kart düzeni + yumuşak kategori etiketleri + grafik tarzı bağlantı

### AI Yazma Aracı (website-ai-writing/)
- İçerik: Inkwell — AI yazma asistanı
- Pentagram: 86px büyük başlık + çerçeve editör modeli + grid özellik sütunları
- Build: Süzülen editör kartları + sıcak altın CTA + lüks yazma deneyimi
- Takram: Şiirsel serif başlık + organik editör + akış şeması

### SaaS Açılış Sayfası (website-saas/)
- İçerik: Meridian — İş zekası analiz platformu
- Pentagram: Siyah-beyaz bölme + yapılandırılmış kontrol paneli + 140px "3x" çapa
- Build: Süzülen kontrol paneli kartları + SVG alan grafiği + sıcak altın gradyan
- Takram: Yuvarlak köşeli sütun grafikleri + akış düğümleri + yumuşak dünya tonları

### Geliştirici Dokümanları (website-devdocs/)
- İçerik: Nexus API — Birleşik AI model geçidi
- Pentagram: Sol kenar çubuğu navigasyonu + kare köşeli kod blokları + kırmızı dize vurgulama
- Build: Ortalanmış süzülen kod kartları + yumuşak gölge + sıcak altın simgeler
- Takram: Bej kod blokları + akış şeması bağlantıları + kesikli özellik kartları

## Dosya İstatistikleri

- HTML kaynak dosyaları: 24
- PNG ekran görüntüleri: 24
- Toplam varlık: 48 dosya

---

**Sürüm**: v1.0
**Oluşturulma Tarihi**: 2026-02-13
**Uygulanabilir**: design-philosophy skill Faz 3 öneri aşaması
