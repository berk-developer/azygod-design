# Ses Tasarım Kuralları · azygod-design

> Tüm animasyon demo'larının ses uygulama formülü. `sfx-library.md` (varlık envanteri) ile birlikte kullanılır.
> Gerçek savaş tecrübesi: azygod-design hero v1-v9 iterasyonu · Anthropic üç resmi videosunun Gemini derinlemesine çözümlemesi · 8000+ A/B karşılaştırma

---

## Çekirdek Prensip · Ses Çift Yollu Sistemi (Demir Kural)

Animasyon sesi **iki bağımsız katmana ayrılmak zorundadır**, tek katman yapılamaz:

| Katman | Görevi | Zaman Ölçeği | Görselle İlişkisi | İşgal Ettiği Frekans Bandı |
|---|---|---|---|---|
| **SFX (Vuruş Katmanı)** | Her görsel vuruşu işaretler | 0.2-2 saniye kısa ve keskin | **Güçlü senkronizasyon** (kare seviyesi hizalama) | **Yüksek frekans 800Hz+** |
| **BGM (Hava Zemin)** | Duygusal zemin, ses sahası | Sürekli 20-60 saniye | Zayıf senkronizasyon (paragraf seviyesi) | **Orta-düşük frekans <4kHz** |

**Yalnızca BGM yapan animasyon sakat** — izleyici bilinçaltı "resim hareket ediyor ama ses yanıt vermiyor" hisseder, ucuzluğun kökü buradadır.

---

## Altın Standart · Altın Oran

Bu değer grubu Anthropic üç resmi videosu + kendi v9 final karşılaştırmasından elde edilen **mühendislik sert parametreleridir**, doğrudan uygula:

### Ses Seviyesi
- **BGM ses seviyesi**: `0.40-0.50` (tam ölçeğe göre 1.0)
- **SFX ses seviyesi**: `1.00`
- **Ses yüksekliği farkı**: BGM SFX peak'inden **-6 ila -8 dB daha düşük** (SFX mutlak ses yüksekliğiyle değil, ses yüksekliği farkıyla öne çıkar)
- **amix parametresi**: `normalize=0` (asla normalize=1 kullanma, dinamik aralığı düzleştirir)

### Frekans Yalıtımı (P1 Sert Optimizasyon)
Anthropic'ın sırrı "SFX sesi büyük" değil, **frekans katmanlamasıdır**:

```bash
[bgm_raw]lowpass=f=4000[bgm]      # BGM <4kHz orta-düşük frekansta sınırla
[sfx_raw]highpass=f=800[sfx]      # SFX 800Hz+ orta-yüksek frekansa it
[bgm][sfx]amix=inputs=2:duration=first:normalize=0[a]
```

Neden: İnsan kulağı 2-5kHz aralığına en duyarlıdır (yani "presence bandı"), SFX bu aralıktaysa, BGM tam frekans bandını kapsıyorsa, **SFX BGM'in yüksek frekans bölümü tarafından kapatılır**. SFX'i highpass ile yukarı it + BGM'i lowpass ile aşağı bastır, ikisi frekans spektrumunda kendi alanını işgal etsin, SFX netliği bir kademe artar.

### Fade
- BGM giriş: `afade=in:st=0:d=0.3` (0.3s, sert kesmeyi önle)
- BGM çıkış: `afade=out:st=N-1.5:d=1.5` (1.5s uzun kuyruk, toparlanma hissi)
- SFX kendi envelope'una sahip, ek fade gerekmez

---

## SFX cue Tasarım Kuralları

### Yoğunluk (Her 10 saniyede kaç SFX)
Anthropic üç resmi videosunun SFX yoğunluğu üç kademelidir:

| Video | Her 10s SFX Sayısı | Ürün Karakteri | Senaryo |
|---|---|---|---|
| Artifacts (ref-1) | **~9 adet/10s** | Fonksiyon yoğun, bilgi çok | Karmaşık araç demo |
| Code Desktop (ref-2) | **0 adet** | Saf atmosfer, meditasyon hissi | Geliştirici araç odaklanma durumu |
| Word (ref-3) | **~4 adet/10s** | Dengeli, ofis ritmi | Üretkenlik aracı |

**Sezgisel kural**:
- Ürün karakteri sakin/odaklı → SFX yoğunluğu düşük (0-3 adet/10s), BGM ağırlıklı
- Ürün karakteri canlı/bilgi yoğun → SFX yoğunluğu yüksek (6-9 adet/10s), SFX ritmi sürükler
- **Her görsel vuruşa SFX doldurma** — boşluk yoğunluktan daha premiumdur. **%30-50 cue'yu silmek kalanları daha dramatik yapar**.

### Cue Seçim Önceliği
Her görsel vuruş SFX gerektirmez. Bu önceliğe göre seç:

**P0 Mutlaka** (eksikliği rahatsızlık verir):
- Yazma (terminal/giriş)
- Tıklama/seçim (kullanıcı karar anı)
- Odak değişimi (görsel ana karakter değişimi)
- Logo reveal (marka toparlanması)

**P1 Önerilir**:
- Öğe girişi/çıkışı (modal / kart)
- Tamamlanma/başarı geri bildirimi
- AI oluşturma başlangıcı/bitişi
- Büyük geçiş (sahne değişimi)

**P2 İsteğe bağlı** (fazla olursa karışır):
- hover / focus-in
- İlerleme tick'i
- Dekoratif ambient

### Zaman Damgası Hizalama Hassasiyeti
- **Aynı kare hizalama** (0ms hata): Tıklama/odak değişimi/Logo yerleşimi
- **Önde 1-2 kare** (-33ms): Hızlı whoosh (izleyiciye psikolojik beklenti ver)
- **Arkada 1-2 kare** (+33ms): Cisim yerleşimi/impact (gerçek fiziğe uygun)

---

## BGM Seçim Karar Ağacı

azygod-design skill kendi içinde 6 BGM (`assets/bgm-*.mp3`) içerir:

```
Animasyon karakteri nedir?
├─ Ürün lansmanı / teknik demo → bgm-tech.mp3 (minimal synth + piano)
├─ Eğitim anlatımı / araç kullanımı → bgm-tutorial.mp3 (warm, instructional)
├─ Eğitim öğrenme / prensip açıklama → bgm-educational.mp3 (curious, thoughtful)
├─ Pazarlama reklamı / marka tanıtımı → bgm-ad.mp3 (upbeat, promotional)
└─ Benzer stil varyant gerekiyor → bgm-*-alt.mp3 (kendi alternatif versiyonları)
```

### BGM Olmayan Senaryolar (Değerlendirmeye değer)
Anthropic Code Desktop'a (ref-2) bak: **0 SFX + Saf Lo-fi BGM** de çok premium olabilir.

**BGM'siz ne zaman seçilir**:
- Animasyon süresi <10s (BGM kurulamaz)
- Ürün karakteri "odaklanma/meditasyon"
- Senaryonun kendisi çevre sesi/anlatım sesi içeriyor
- SFX yoğunluğu çok yüksek olduğunda (işitsel aşırı yüklenmeyi önle)

---

## Sahne Formülleri (Kutudan çıkar çıkmez kullan)

### Formül A · Ürün lansmanı hero (azygod-design v9 aynı model)
```
Süre: 25 saniye
BGM: bgm-tech.mp3 · %45 · Frekans <4kHz
SFX yoğunluğu: ~6 adet/10s

cue:
  Terminal yazma → type × 4 (aralık 0.6s)
  Enter     → enter
  Kart toplanma → card × 4 (zirve 0.2s)
  Seçim     → click
  Ripple   → whoosh
  4 odak   → focus × 4
  Logo     → thud (1.5s)

Ses seviyesi: BGM 0.45 / SFX 1.0 · amix normalize=0
```

### Formül B · Araç fonksiyon demo (Anthropic Code Desktop referans)
```
Süre: 30-45 saniye
BGM: bgm-tutorial.mp3 · %50
SFX yoğunluğu: 0-2 adet/10s (çok az)

Strateji: BGM + anlatım voiceover sürüklesin, SFX yalnızca **belirleyici anlarda** (dosya kaydetme/komut çalıştırma tamamlanması)
```

### Formül C · AI oluşturma demo
```
Süre: 15-20 saniye
BGM: bgm-tech.mp3 veya BGM'siz
SFX yoğunluğu: ~8 adet/10s (yüksek yoğunluk)

cue:
  Kullanıcı girişi → type + enter
  AI işlemeye başlar → magic/ai-process (1.2s döngü)
  Oluşturma tamamlandı → feedback/complete-done
  Sonuç sunumu → magic/sparkle
  
Vurgu: ai-process tüm oluşturma süreci boyunca 2-3 kez döngü yapabilir
```

### Formül D · Saf atmosfer uzun plan (Artifacts referans)
```
Süre: 10-15 saniye
BGM: Yok
SFX: Tek başına 3-5 adet özenle tasarlanmış cue

Strateji: Her SFX ana karakterdir, BGM "birbirine karışma" sorunu yok.
Uygun: Tek ürün yavaş plan, yakın çekim vitrin
```

---

## ffmpeg Birleştirme Şablonları

### Şablon 1 · Tek SFX Video Üzerine Bindirme
```bash
ffmpeg -y -i video.mp4 -itsoffset 2.5 -i sfx.mp3 \
  -filter_complex "[0:a][1:a]amix=inputs=2:normalize=0[a]" \
  -map 0:v -map "[a]" output.mp4
```

### Şablon 2 · Çoklu SFX Zaman Çizelgesi Birleştirme (cue zamanına göre hizalama)
```bash
ffmpeg -y \
  -i sfx-type.mp3 -i sfx-enter.mp3 -i sfx-click.mp3 -i sfx-thud.mp3 \
  -filter_complex "\
[0:a]adelay=1100|1100[a0];\
[1:a]adelay=3200|3200[a1];\
[2:a]adelay=7000|7000[a2];\
[3:a]adelay=21800|21800[a3];\
[a0][a1][a2][a3]amix=inputs=4:duration=longest:normalize=0[mixed]" \
  -map "[mixed]" -t 25 sfx-track.mp3
```
**Kilit parametreler**:
- `adelay=N|N`: Önce sol kanal gecikme(ms), sonra sağ kanal, iki kez yaz stereo hizalaması garanti
- `normalize=0`: Dinamik aralığı koru, kilit!
- `-t 25`: Belirtilen süreye kes

### Şablon 3 · Video + SFX track + BGM (Frekans yalıtımı ile)
```bash
ffmpeg -y -i video.mp4 -i sfx-track.mp3 -i bgm.mp3 \
  -filter_complex "\
[2:a]atrim=0:25,afade=in:st=0:d=0.3,afade=out:st=23.5:d=1.5,\
     lowpass=f=4000,volume=0.45[bgm];\
[1:a]highpass=f=800,volume=1.0[sfx];\
[bgm][sfx]amix=inputs=2:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k final.mp4
```

---

## Başarısızlık Modelleri Hızlı Arama

| Belirti | Kök Neden | Düzeltme |
|---|---|---|
| SFX duyulmuyor | BGM yüksek frekans bölümü kapatıyor | BGM'e `lowpass=f=4000` + SFX'e `highpass=f=800` ekle |
| Ses efekti çok yüksek ve sert | SFX mutlak ses seviyesi çok büyük | SFX ses seviyesini 0.7'ye düşür, aynı anda BGM'i 0.3'e düşür, farkı koru |
| BGM ve SFX ritim çatışması | BGM yanlış seçildi (güçlü beat'li müzik) | ambient / minimal synth BGM'e geç |
| Animasyon bitti BGM ani kesildi | fade out yapılmadı | `afade=out:st=N-1.5:d=1.5` |
| SFX birbirine karışarak bulanık | cue çok yoğun + her SFX süresi çok uzun | SFX süresini 0.5s içinde tut, cue aralığı ≥ 0.2s |
| WeChat mp4 sesi yok | WeChat bazen auto-play'de mute yapar | Endişelenme, kullanıcı tıklayınca ses gelir; gif zaten sesi yoktur |

---

## Görselle Eşgüdüm (İleri Düzey)

### SFX Timbresi Görsel Stille Eşleşmeli
- Sıcak krem/kağıt hissi görsel → SFX **ahşap/yumuşak** timbre (Morse, paper snap, soft click)
- Soğuk siyah teknoloji görsel → SFX **metal/dijital** timbre (beep, pulse, glitch)
- Elle çizilmiş/çocuksu görsel → SFX **karikatür/abartılı** timbre (boing, pop, zap)

Mevcut `apple-gallery-showcase.md` sıcak krem zemin → `keyboard/type.mp3` (mekanik) + `container/card-snap.mp3` (yumuşak) + `impact/logo-reveal-v2.mp3` (sinematik bas) ile eşleştirilir.

### SFX Görsel Ritmi Yönlendirebilir
İleri teknik: **Önce SFX zaman çizelgesini tasarla, sonra görsel animasyonu SFX'ye hizalayacak şekilde ayarla** (tersi değil).
Çünkü her SFX cue bir "saat tik tak"ıdır, görsel animasyon SFX ritmine uyum sağladığında çok stabil olur — aksine SFX görseli kovalarsa, sıklıkla ±1 kare uyuşmazlık rahatsızlık verir.

---

## Kalite Kontrol Listesi (Yayınlanmadan önce kendi kontrol)

- [ ] Ses yüksekliği farkı: SFX peak - BGM peak = -6 ila -8 dB?
- [ ] Frekans: BGM lowpass 4kHz + SFX highpass 800Hz?
- [ ] amix normalize=0 (dinamik aralığı koru)?
- [ ] BGM fade-in 0.3s + fade-out 1.5s?
- [ ] SFX sayısı uygun mu (sahne karakterine göre yoğunluk seç)?
- [ ] Her SFX görsel vuruşla aynı kare hizalı (±1 kare içinde)?
- [ ] Logo reveal ses efekti süresi yeterli mi (1.5s önerilir)?
- [ ] BGM'i kapatıp bir dinle: SFX tek başına yeterli ritim hissi var mı?
- [ ] SFX'i kapatıp bir dinle: BGM tek başına duygusal dalgalanma var mı?

Her iki katman tek başına kendi içinde tutarlı olmalı. Yalnızca iki katman üst üste gelince güzelse, iyi yapılmamış demektir.

---

## Referans

- SFX varlık envanteri: `sfx-library.md`
- Görsel stil referansı: `apple-gallery-showcase.md`
- Anthropic üç videosu derin ses analizi: `/Users/alchain/Documents/writing/01-wechat-writing/project/2026.04-azygod-design-release/reference-animation/AUDIO-BEST-PRACTICES.md`
- azygod-design v9 gerçek vaka: `/Users/alchain/Documents/writing/01-wechat-writing/project/2026.04-azygod-design-release/images/hero-animation-v9-final.mp4`
