# Video Dışa Aktarım: HTML Animasyonu MP4/GIF'e Dönüştürme

Animasyon HTML'i tamamlandıktan sonra, kullanıcı sıklıkla "video olarak dışa aktarabilir miyiz" der. Bu rehber tam süreci verir.

## Ne Zaman Dışa Aktarılır

**Dışa aktarma zamanı**:
- Animasyon tam olarak çalışıyor, görsel doğrulama yapıldı (Playwright ekran görüntüsü ile çeşitli zaman noktalarında doğrulandı)
- Kullanıcı tarayıcıda en az bir kez gördü, efekt tamam dedi
- **Animasyon hatası düzeltilmeden dışa aktarma** — videoya aktardıktan sonra düzeltmek daha pahalı

**Kullanıcının söyleyebileceği tetikleyici cümleler**:
- "Video olarak dışa aktarabilir miyiz"
- "MP4'e çevir"
- "GIF yap"
- "60fps"

## Çıktı Spesifikasyonu

Varsayılan olarak üç formatta ver, kullanıcının seçmesine izin ver:

| Format | Spesifikasyon | Uygun Senaryo | Tipik Boyut (30sn) |
|---|---|---|---|
| MP4 25fps | 1920×1080 · H.264 · CRF 18 | WeChat gömme, video kanalı, YouTube | 1-2 MB |
| MP4 60fps | 1920×1080 · minterpolate ara kare · H.264 · CRF 18 | Yüksek kare hızlı gösterim, Bilibili, portfolyo | 1.5-3 MB |
| GIF | 960×540 · 15fps · palet optimizasyonu | Twitter/X, README, Slack önizleme | 2-4 MB |

## Araç Zinciri

`scripts/` altında iki script:

### 1. `render-video.js` — HTML → MP4

25fps temel MP4 sürümünü kaydet. Global playwright'a bağımlı.

```bash
NODE_PATH=$(npm root -g) node /path/to/claude-design/scripts/render-video.js <html dosyası>
```

İsteğe bağlı parametreler:
- `--duration=30` Animasyon süresi (saniye)
- `--width=1920 --height=1080` Çözünürlük
- `--trim=2.2` Video başından kırpılacak saniye (reload + yazı tipi yükleme süresini at)
- `--fontwait=1.5` Yazı tipi yükleme bekleme süresi (saniye), çok yazı tipi varsa artır

Çıktı: HTML ile aynı dizin, aynı ad `.mp4`.

### 2. `add-music.sh` — MP4 + BGM → MP4

Sessiz MP4'e arka plan müziği karıştır, sahneye (mood) göre yerleşik BGM kütüphanesinden seç, veya kendi sesini getir. Otomatik süre eşleme, fade in fade out.

```bash
bash add-music.sh <input.mp4> [--mood=<isim>] [--music=<yol>] [--out=<yol>]
```

**Yerleşik BGM Kütüphanesi** (`assets/bgm-<mood>.mp3` içinde):

| `--mood=` | Stil | Uygun Sahne |
|-----------|------|-------------|
| `tech` (varsayılan) | Apple Silicon / Apple lansmanı, minimal sentezleyici + piyano | Ürün lansmanı, AI aracı, Skill tanıtımı |
| `ad` | Hızlı modern elektronik, build + drop var | Sosyal medya reklamı, ürün fragmanı, promosyon |
| `educational` | Sıcak ve parlak, hafif gitar / elektrikli piyano, davetkar | Bilimsel, eğitim tanıtımı, kurs fragmanı |
| `educational-alt` | Aynı tür alternatif, başka bir şarkı dene | Yukarıdakiyle aynı |
| `tutorial` | Lo-fi ortam sesi, neredeyse var olmayan | Yazılım gösterimi, programlama eğitimi, uzun sunum |
| `tutorial-alt` | Aynı tür alternatif | Yukarıdakiyle aynı |

**Davranış**:
- Müzik video süresine göre kırpılır
- 0.3s fade in + 1s fade out (sert kesme önlenir)
- Video akışı `-c:v copy` ile yeniden kodlanmaz, ses AAC 192k
- `--music=<yol>` `--mood`'dan daha yüksek önceliklidir, doğrudan harici ses dosyası belirtilebilir
- Yanlış mood adı verilirse tüm seçenekler listelenir, sessizce başarısız olmaz

**Tipik işlem hattı** (Animasyon dışa aktarma üçlüsü + müzik):
```bash
node render-video.js animation.html                        # Ekran kaydı
bash convert-formats.sh animation.mp4                      # 60fps + GIF türet
bash add-music.sh animation-60fps.mp4                      # Varsayılan tech BGM ekle
# Veya farklı sahneler için:
bash add-music.sh tutorial-demo.mp4 --mood=tutorial
bash add-music.sh product-promo.mp4 --mood=ad --out=promo-final.mp4
```

### 3. `convert-formats.sh` — MP4 → 60fps MP4 + GIF

Mevcut MP4'ten 60fps sürüm ve GIF üret.

```bash
bash /path/to/claude-design/scripts/convert-formats.sh <input.mp4> [gif_width] [--minterpolate]
```

Çıktı (girdi ile aynı dizin):
- `<name>-60fps.mp4` — Varsayılan `fps=60` kare kopyalama (geniş uyumluluk); `--minterpolate` eklendiğinde yüksek kaliteli ara kare
- `<name>.gif` — Palet optimize edilmiş GIF (varsayılan 960 genişlik, değiştirilebilir)

**60fps mod seçimi**:

| Mod | Komut | Uyumluluk | Kullanım Senaryosu |
|---|---|---|---|
| Kare kopyalama (varsayılan) | `convert-formats.sh in.mp4` | QuickTime/Safari/Chrome/VLC tam uyumlu | Genel teslimat, platform yükleme, sosyal medya |
| minterpolate ara kare | `convert-formats.sh in.mp4 --minterpolate` | macOS QuickTime/Safari reddedebilir | Bilibili gibi gerçek ara kare gerektiren gösterim senaryoları, **teslimattan önce hedef oynatıcıda mutlaka test et** |

Neden varsayılan kare kopyalamaya geçildi? minterpolate çıktısı H.264 elementary stream bilinen uyumluluk hatasına sahip — önceden varsayılan minterpolate olduğunda "macOS QuickTime açamıyor" sorunuyla birkaç kez karşılaşıldı. Detaylar için `animation-pitfalls.md` §14 bölümüne bak.

`gif_width` parametresi:
- 960 (varsayılan) — Sosyal platformlar için evrensel
- 1280 — Daha net ama daha büyük dosya
- 600 — Twitter/X öncelikli yükleme

## Tam Süreç (Standart Öneri)

Kullanıcı "video dışa aktar" dedikten sonra:

```bash
cd <proje dizini>

# $SKILL'in bu skill'in kök dizinini işaret ettiğini varsay (kurulum konumuna göre kendin değiştir)

# 1. 25fps temel MP4 kaydet
NODE_PATH=$(npm root -g) node "$SKILL/scripts/render-video.js" my-animation.html

# 2. 60fps MP4 ve GIF türet
bash "$SKILL/scripts/convert-formats.sh" my-animation.mp4

# Çıktı listesi:
# my-animation.mp4         (25fps · 1-2 MB)
# my-animation-60fps.mp4   (60fps · 1.5-3 MB)
# my-animation.gif         (15fps · 2-4 MB)
```

## Teknik Detaylar (Hata Ayıklama)

### Playwright recordVideo Hataları

- Kare hızı sabit 25fps, doğrudan 60fps kaydedilemez (Chromium headless compositor limiti)
- Context oluşturulduğundan itibaren kayıt başlar, başlangıç yükleme süresini atlamak için `trim` kullanmak zorunlu
- Varsayılan webm formatı, evrensel oynatma için ffmpeg ile H.264 MP4'e dönüştürülmesi gerekir

`render-video.js` yukarıdaki sorunları çözmüştür.

### ffmpeg minterpolate Parametreleri

Mevcut yapılandırma: `minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`

- `mi_mode=mci` — hareket telafi ara kare (motion compensation interpolation)
- `mc_mode=aobmc` — uyarlanabilir örtüşmeli blok hareket telafisi
- `me_mode=bidir` — çift yönlü hareket tahmini
- `vsbmc=1` — değişken boyut blok hareket telafisi

CSS **transform animasyonları** (translate/scale/rotate) için iyi sonuç verir.
**Saf fade** için hafif ghosting oluşabilir — kullanıcı şikayet ederse basit kare kopyalamaya geri dön:

```bash
ffmpeg -i input.mp4 -r 60 -c:v libx264 ... output.mp4
```

### GIF Paleti Neden İki Aşamalı

GIF sadece 256 renk destekler. Tek pass GIF, tüm animasyon renklerini 256 renk evrensel palete sıkıştırır, bej zemin + turuncu gibi ince renk paletinde bulanıklaşır.

İki aşama:
1. `palettegen=stats_mode=diff` — Önce tüm videoyu tara, **bu animasyona özel optimal palet** üret
2. `paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle` — Bu paletle kodla, rectangle diff sadece değişen alanları günceller, dosya boyutunu önemli ölçüde azaltır

Fade geçişleri için `dither=bayer` `none`'dan daha pürüzsüz, ama dosya biraz daha büyük.

## Uçuş Öncesi Kontrol (Dışa Aktarmadan Önce)

Dışa aktarmadan önce 30 saniyelik öz kontrol:

- [ ] HTML tarayıcıda tamamen çalıştı, konsol hatası yok
- [ ] Animasyon 0. karesi tam başlangıç durumu (boş yükleme değil)
- [ ] Animasyon son karesi stabil bitiş durumu (yarım kalmamış)
- [ ] Yazı tipi / resim / emoji tam olarak render ediliyor (`animation-pitfalls.md` referans)
- [ ] Duration parametresi HTML içindeki gerçek animasyon süresiyle eşleşiyor
- [ ] HTML içindeki Stage `window.__recording`'i algılıyor ve loop=false zorluyor (elle yazılmış Stage için mutlaka kontrol et; `assets/animations.jsx` içinde otomatik)
- [ ] Sonda Sprite `fadeOut={0}` (video son karesi fade out yapmıyor)
- [ ] "Created by Azygod-Design" filigranı içeriyor (sadece animasyon senaryolarında zorunlu; üçüncü taraf marka işlerinde "Resmi Olmayan Üretim · " öneki ekle. Detaylar için SKILL.md §「Skill Tanıtım Filigranı」)

## Teslimatta Eklenen Açıklama

Dışa aktarma tamamlandıktan sonra kullanıcıya standart açıklama formatı:

```
**Tam Teslimat**

| Dosya | Format | Spesifikasyon | Boyut |
|---|---|---|---|
| foo.mp4 | MP4 | 1920×1080 · 25fps · H.264 | X MB |
| foo-60fps.mp4 | MP4 | 1920×1080 · 60fps (hareket ara kare) · H.264 | X MB |
| foo.gif | GIF | 960×540 · 15fps · palet optimizasyonu | X MB |

**Açıklama**
- 60fps minterpolate ile hareket tahmini ara kare kullanıyor, transform animasyonlarında iyi sonuç verir
- GIF palet optimizasyonu kullanıyor, 30sn animasyon ~3MB'ye sıkıştırılabilir

Boyut veya kare hızını değiştirmek istersen söyle.
```

## Sık Karşılaşılan Kullanıcı Ek Talepleri

| Kullanıcı Söyler | Karşılık |
|---|---|
| "Çok büyük" | MP4: CRF 23-28'e yükselt; GIF: Çözünürlüğü 600'e veya fps'i 10'a düşür |
| "GIF çok bulanık" | `gif_width`'i 1280'e yükselt; veya MP4 öner (WeChat Moments da destekliyor) |
| "Dikey 9:16 istiyorum" | HTML kaynağında `--width=1080 --height=1920` değiştir, yeniden kaydet |
| "Filigran ekle" | ffmpeg ile `-vf "drawtext=..."` veya PNG `overlay=` |
| "Şeffaf arka plan istiyorum" | MP4 alpha desteklemez; WebM VP9 + alpha veya APNG kullan |
| "Kayıpsız istiyorum" | CRF 0 + preset veryslow (dosya 10 kat büyür) |
