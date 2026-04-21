# Animation Pitfalls: HTML Animasyon Hataları ve Kurallar

Animasyon yaparken en sık karşılaşılan bug'lar ve nasıl önlenecekleri. Her kural gerçek başarısızlık vakalarından gelir.

Animasyon yazmadan önce bunu oku, bir tur iterasyon kazanabilirsin.

## 1. Katman Yerleşimi — `position: relative` varsayılan zorunluluktur

**Karşılaşılan hata**: Bir sentence-wrap öğesi 3 bracket-layer (`position: absolute`) içeriyordu. sentence-wrap'a `position: relative` verilmemişti, sonuçta absolute bracket'lar `.canvas`'ı koordinat sistemi olarak kullandı, ekranın altına 200px uçtu.

**Kural**:
- `position: absolute` alt öğe içeren herhangi bir kapsayıcı, **mutlaka** açıkça `position: relative` olmalı
- Görsel olarak "offset" gerektirmese bile, koordinat sistemi çıpası olarak `position: relative` yaz
- `.parent { ... }` yazarken, alt öğelerinde `.child { position: absolute }` varsa, refleks olarak parent'a relative ekle

**Hızlı kontrol**: Her `position: absolute` çıktığında, yukarı doğru ancestor'ları say, en yakın positioned ancestor'ın istediğin **koordinat sistemi** olduğundan emin ol.

## 2. Karakter Tuzağı — Nadir Unicode'e Güvenme

**Karşılaşılan hata**: `␣` (U+2423 OPEN BOX) ile "boşluk token"ı görselleştirmek istendi. Noto Serif SC / Cormorant Garamond'da bu karakter yok, boş/tofu olarak render edildi, izleyici tamamen göremedi.

**Kural**:
- **Animasyonda görünen her karakter, seçtiğin yazı tipinde mevcut olmalı**
- Yaygın nadir karakter kara listesi: `␣ ␀ ␐ ␋ ␨ ↩ ⏎ ⌘ ⌥ ⌃ ⇧ ␦ ␖ ␛`
- "Boşluk / enter / tab" gibi meta karakterleri ifade etmek için **CSS ile oluşturulan anlamsal kutular** kullan:
  ```html
  <span class="space-key">Space</span>
  ```
  ```css
  .space-key {
    display: inline-flex;
    padding: 4px 14px;
    border: 1.5px solid var(--accent);
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.3em;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  ```
- Emoji de doğrulanmalı: Bazı emoji Noto Emoji dışındaki yazı tiplerinde gri kareye fallback olabilir, en iyisi `emoji` font-family veya SVG kullan

## 3. Veri Güdümlü Grid/Flex Şablonları

**Karşılaşılan hata**: Kodda `const N = 6` token vardı, ama CSS'te sabit `grid-template-columns: 80px repeat(5, 1fr)` yazılmıştı. Sonuçta 6. token'ın kolonu yoktu, tüm matris kaymıştı.

**Kural**:
- Count JS dizisinden geliyorsa (`TOKENS.length`), CSS şablonu da veri güdümlü olmalı
- Seçenek A: CSS değişkeni JS'ten enjekte et
  ```js
  el.style.setProperty('--cols', N);
  ```
  ```css
  .grid { grid-template-columns: 80px repeat(var(--cols), 1fr); }
  ```
- Seçenek B: `grid-auto-flow: column` kullanarak tarayıcının otomatik genişlemesine izin ver
- **"Sabit sayı + JS sabiti" kombinasyonunu yasakla**, N değişince CSS senkronize güncellenmez

## 4. Geçiş Kopukluğu — Sahne değişimi sürekli olmalı

**Karşılaşılan hata**: zoom1 (13-19s) → zoom2 (19.2-23s) arasında, ana cümle zaten hidden'dı, zoom1 fade out (0.6s) + zoom2 fade in (0.6s) + stagger gecikme (0.2s+) = yaklaşık 1 saniye saf boş ekran. İzleyici animasyonun takıldığını sandı.

**Kural**:
- Sürekli sahne değişimlerinde, fade out ve fade in **çapraz örtüşmeli**, önceki tamamen kaybolmadan sonrakine başlamaz
  ```js
  // Kötü:
  if (t >= 19) hideZoom('zoom1');      // 19.0s out
  if (t >= 19.4) showZoom('zoom2');    // 19.4s in → arada 0.4s boşluk

  // İyi:
  if (t >= 18.6) hideZoom('zoom1');    // 0.4s önce fade out başla
  if (t >= 18.6) showZoom('zoom2');    // Aynı anda fade in (cross-fade)
  ```
- Veya bir "çıpa öğesi" (örn. ana cümle) sahne arasındaki görsel bağlantı olarak kullanılsın, zoom geçişi sırasında kısa süreli geri yansısın
- CSS transition duration'ını hesaplayarak, transition bitmeden sonrakini tetiklememeye dikkat et

## 5. Pure Render Prensibi — Animasyon durumu seek edilebilir olmalı

**Karşılaşılan hata**: `setTimeout` + `fireOnce(key, fn)` zincirlemesiyle animasyon durumları tetiklendi. Normal oynatma sorun değil, ama kare kare kayıt/herhangi bir zamana seek yapıldığında, önceki setTimeout'lar zaten çalıştığı için "geçmişe dönmek" imkansız.

**Kural**:
- `render(t)` fonksiyonu ideal olarak **pure function** olmalı: Verilen t tek bir DOM durumu çıktısı verir
- Yan etki kullanılması zorunluysa (örn. class değiştirme), `fired` set ile açık reset kullan:
  ```js
  const fired = new Set();
  function fireOnce(key, fn) { if (!fired.has(key)) { fired.add(key); fn(); } }
  function reset() { fired.clear(); /* Tüm .show class'larını temizle */ }
  ```
- `window.__seek(t)` Playwright / hata ayıklama için aç:
  ```js
  window.__seek = (t) => { reset(); render(t); };
  ```
- Animasyonla ilgili setTimeout >1 saniye boyunca aşmamalı, yoksa seek geri atlamasında karışır

## 6. Yazı Tipi Yüklenmeden Ölçüm = Yanlış Ölçüm

**Karşılaşılan hata**: Sayfa DOMContentLoaded'da hemen `charRect(idx)` çağrıldı, bracket konumunu ölçtü, yazı tipi henüz yüklenmemişti, her karakter genişliği fallback yazı tipinin genişliğiydi, konumlar tamamen yanlıştı. Yazı tipi yüklendikten sonra (yaklaşık 500ms), bracket'ın `left: Xpx`'i hâlâ eski değerdeydi, kalıcı olarak kaymıştı.

**Kural**:
- DOM ölçümüne bağımlı (`getBoundingClientRect`, `offsetWidth`) herhangi bir yerleşim kodu, **mutlaka** `document.fonts.ready.then()` içine alınmalı
  ```js
  document.fonts.ready.then(() => {
    requestAnimationFrame(() => {
      buildBrackets(...);  // Bu noktada yazı tipi hazır, ölçüm doğru
      tick();              // Animasyon başlar
    });
  });
  ```
- Ek `requestAnimationFrame` tarayıcıya layout'u işlemek için bir kare süre verir
- Google Fonts CDN kullanıyorsan, `<link rel="preconnect">` ilk yükleme hızlandırır

## 7. Kayıt Hazırlığı — Video dışa aktarımı için tutamaklar bırak

**Karşılaşılan hata**: Playwright `recordVideo` varsayılan 25fps, context oluşturulduğundan itibaren kayda başlar. Sayfa yükleme, yazı tipi yükleme ön 2 saniyesi kaydedilir. Teslimatta video önünde 2 saniye boş/parlak beyaz.

**Kural**:
- `render-video.js` aracı sağlar: warmup navigate → reload animasyonu yeniden başlat → duration bekle → ffmpeg trim head + H.264 MP4'e dönüştür
- Animasyonun **0. karesi** nihai yerleşiminin tamamlanmış tam başlangıç durumu olmalı (boş veya yüklenme değil)
- 60fps mi istiyorsun? ffmpeg `minterpolate` ile sonradan işle, tarayıcı kaynak kare hızına güvenme
- GIF mi istiyorsun? İki aşamalı palette (`palettegen` + `paletteuse`), 30s 1080p animasyonu 3MB'a sıkıştırabilir

Bkz. `video-export.md` tam betik çağrı yöntemi için.

## 8. Toplu Dışa Aktarma — tmp dizini PID ile çakışmayı önlemeli

**Karşılaşılan hata**: `render-video.js` ile 3 süreç paralel olarak 3 HTML kaydediyordu. TMP_DIR yalnızca `Date.now()` ile adlandırıldığından, 3 süreç aynı milisaniyede başladığında aynı tmp dizinini paylaştı. İlk tamamlanan süreç tmp'yi temizledi, diğer ikisi dizin okurken `ENOENT`, tamamen çöktü.

**Kural**:
- Çok süreççe paylaşılabilecek herhangi bir geçici dizin, adlandırma **PID veya rastgele ek** içermeli:
  ```js
  const TMP_DIR = path.join(DIR, '.video-tmp-' + Date.now() + '-' + process.pid);
  ```
- Gerçekten çoklu dosya paralelliği isteniyorsa, shell'in `&` + `wait` kullan, tek bir node betiğinde fork yapma
- Birden fazla HTML toplu kayıtta tutucu yaklaşım: **Seri** çalıştır (2 adet paralel olabilir, 3+ sıraya gir)

## 9. Kayıtta İlerleme Çubuğu/Yeniden Oynatma Düğmesi — Chrome Öğeleri Video'yu Kirletir

**Karşılaşılan hata**: Animasyon HTML'sine `.progress` ilerleme çubuğu, `.replay` yeniden oynatma düğmesi, `.counter` zaman damgası eklendi, insan hata ayıklaması için kolaylık sağlandı. MP4 olarak teslim edildiğinde bu öğeler video alt kısmında görünüyordu, geliştirici araçlarını ekran görüntüsüne almış gibi.

**Kural**:
- HTML'de insan için olan "chrome öğeleri" (progress bar / replay button / footer / masthead / counter / phase labels) ile video içeriği ayrı yönetilmeli
- **Sınıf adı sözleşmesi** `.no-record`: Bu sınıfa sahip herhangi bir öğe, kayıt betiği tarafından otomatik olarak gizlenir
- Betik tarafında (`render-video.js`) varsayılan olarak yaygın chrome sınıf adlarını gizleyen CSS enjekte edilir:
  ```
  .progress .counter .phases .replay .masthead .footer .no-record [data-role="chrome"]
  ```
- Playwright'ın `addInitScript` ile enjekte et (her navigate öncesi etkili olur, reload da stabil)
- Orijinal HTML'yi (chrome ile) görmek istediğinde `--keep-chrome` flag'i ekle

## 10. Kayıt Başı Animasyon Tekrarı — Warmup Kare Sızıntısı

**Karşılaşılan hata**: `render-video.js` eski akışı `goto → wait fonts 1.5s → reload → wait duration`. Kayıt context oluşturulduğundan başlar, warmup aşamasında animasyon zaten bir parça oynadı, reload'dan sonra 0'dan yeniden başlar. Sonuçta video ön saniyeleri "animasyon orta parçası + geçiş + animasyon 0'dan başlar" şeklinde tekrar hissi güçlüydü.

**Kural**:
- **Warmup ve Record bağımsız context'ler kullanmalıdır**:
  - Warmup context (`recordVideo` seçeneği olmadan): Yalnızca url yükleme, yazı tipi bekleme, sonra close
  - Record context (`recordVideo` ile): Fresh durumdan başlar, animasyon t=0'dan kayda başlar
- ffmpeg `-ss trim` yalnızca Playwright'ın startup gecikmesini (~0.3s) kesebilir, **warmup karelerini** maskeleyemez; kaynak temiz olmalı
- Kayıt context kapanması = webm dosyası diske yazılır, bu Playwright'ın kısıtlamasıdır
- İlgili kod modeli:
  ```js
  // Aşama 1: warmup (atılacak)
  const warmupCtx = await browser.newContext({ viewport });
  const warmupPage = await warmupCtx.newPage();
  await warmupPage.goto(url, { waitUntil: 'networkidle' });
  await warmupPage.waitForTimeout(1200);
  await warmupCtx.close();

  // Aşama 2: record (fresh)
  const recordCtx = await browser.newContext({ viewport, recordVideo });
  const page = await recordCtx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(DURATION * 1000);
  await page.close();
  await recordCtx.close();
  ```

## 11. Sahne İçinde "Sahte Chrome" Çizme — Dekoratif Player UI ile Gerçek Chrome Çakışması

**Karşılaşılan hata**: Animasyonda `Stage` bileşeni kullanılıyordu, zaten scrubber + zaman kodu + duraklatma düğmesi içeriyordu (`.no-record` chrome'a ait, dışa aktarımda otomatik gizlenir). Ben de ekranın altına "`00:60 ──── CLAUDE-DESIGN / ANATOMY`" şeklinde bir "dergi sayfa numarası hissi dekoratif ilerleme çubuğu" çizdim, kendimi çok iyi hissettim. **Sonuç**: Kullanıcı iki ilerleme çubuğu gördü — biri Stage denetleyicisi, biri benim çizdiğim dekoratif. Görsel olarak tamamen çakıştı, bug olarak değerlendirildi. "Videonun içinde ilerleme çubuğu ne işe yarıyor?"

**Kural**:

- Stage zaten sunuyor: scrubber + zaman kodu + duraklatma/yeniden oynatma düğmesi. **Sahne içinde tekrar çizme** ilerleme göstergesi, mevcut zaman kodu, telif hakkı imza şeridi, bölüm sayacı — bunlar ya chrome ile çakışır, ya da filler slop'tur ("earn its place" ilkesini ihlal eder).
- "Sayfa numarası hissi", "dergi hissi", "alt imza şeridi" gibi **dekoratif talepler**, AI tarafından otomatik eklenen yüksek frekanslı filler'dır. Her biri belirdiğinde uyanık ol — gerçekten yerine getirilemez bilgi mi iletiyor, yoksa sadece boşluğu dolduruyor mu?
- Eğer bir alt şeridin mutlaka var olması gerektiğine inanıyorsan (örn: animasyonun konusu player UI anlatmak), o zaman **anlatısal olarak zorunlu** olmalı, ve **görsel olarak Stage scrubber'ından belirgin şekilde farklı** olmalı (farklı konum, farklı form, farklı ton).

**Öğe Aidiyet Testi** (canvas'e çizilen her öğe bunu yanıtlayabilmeli):

| Ne ait | İşlem |
|------------|------|
| Belirli bir sahnenin anlatı içeriği | Tamam, kalacak |
| Global chrome (kontrol/hata ayıklama) | `.no-record` sınıfı ekle, dışa aktarımda gizle |
| **Ne anlatıya ait ne chrome** | **Sil**. Bu sahipsiz şeydir, kaçınılmaz olarak filler slop'tur |

**Kendi kontrol (teslimden önce 3 saniye)**: Statik bir ekran görüntüsü al, kendine sor —

- Ekranda "video player UI'ya benzeyen bir şey" var mı? (Yatay çizgi ilerleme çubuğu, zaman kodu, kontrol düğmesi şekli)?
- Varsa, bunu silmek anlatıya zarar verir mi? Vermiyorsa sil.
- Aynı bilgi türü (ilerleme/zaman/imza) iki kez mi görünüyor? Chrome'da tek noktada birleştir.

**Karşı örnek**: Alt kısımda `00:42 ──── PROJECT NAME` çizme, sağ alt köşede "CH 03 / 06" bölüm sayacı çizme, kenarda "v0.3.1" sürüm numarası çizme — hepsi sahte chrome filler'dır.

## 12. Kayıt Ön Boşluk + Kayıt Başlangıç Ofseti — `__ready` × tick × lastTick Üçlü Tuzağı

**Karşılaşılan hata (A · Ön boşluk)**: 60 saniyelik animasyon MP4'e dışa aktarıldı, ön 2-3 saniye boş sayfaydı. `ffmpeg --trim=0.3` kesemedi.

**Karşılaşılan hata (B · Başlangıç ofseti, 2026-04-20 gerçek kazası)**: 24 saniyelik video dışa aktarıldı, kullanıcı "video 19 saniyede ilk kareyi oynatmaya başlıyor" dedi. Aslında animasyon t=5'ten başlayarak kaydedildi, t=24'e kadar kaydedildi sonra t=0'a loop döndü, son 5 saniye animasyonun gerçek başlangıcıydı — yani video son 5 saniyesi animasyonun gerçek başlangıcıydı.

**Kök neden** (iki hata ortak bir kök nedeni paylaşır):

Playwright `recordVideo` `newContext()` anından itibaren WebM yazmaya başlar, bu sırada Babel/React/yazı tipi yüklenmesi toplam L saniye (2-6s) sürer. Kayıt betiği `window.__ready = true`'yu "animasyon buradan başlar" çıpası olarak bekler — animasyon `time = 0` ile katı çift olmalıdır. İki yaygın yanlış yol vardır:

| Yanlış yol | Belirti |
|------|------|
| `__ready` `useEffect` veya senkron kurulum aşamasında ayarlanır (tick ilk karesinden önce) | Kayıt betiği animasyonun başladığını sanır, aslında WebM hâlâ boş sayfa kaydediyor → **Ön boşluk** |
| tick'in `lastTick = performance.now()` **betik üst seviyesinde** başlatılır | Yazı tipi yüklenmesi L saniyesi ilk kare `dt`'ye dahil edilir, `time` anında L'ye atlar → Kayıt tam süreç boyunca L saniye geride → **Başlangıç ofseti** |

**✅ Doğru tam başlangıç tick şablonu** (elle yazılan animasyon bu iskeleti kullanmalıdır):

```js
// ━━━━━━ state ━━━━━━
let time = 0;
let playing = false;   // ❗ Varsayılan oynamaz, yazı tipi ready olana kadar bekle
let lastTick = null;   // ❗ sentinel——tick ilk karesinde dt zorla 0 olur (performance.now() kullanma)
const fired = new Set();

// ━━━━━━ tick ━━━━━━
function tick(now) {
  if (lastTick === null) {
    lastTick = now;
    window.__ready = true;   // ✅ eşleştirme: "kayıt başlangıcı" ve "animasyon t=0" aynı kare
    render(0);               // Tekrar render et DOM hazır olduğundan emin ol (yazı tipi şu anda ready)
    requestAnimationFrame(tick);
    return;
  }
  const dt = (now - lastTick) / 1000;   // İlk kareden sonra dt ilerlemeye başlar
  lastTick = now;

  if (playing) {
    let t = time + dt;
    if (t >= DURATION) {
      t = window.__recording ? DURATION - 0.001 : 0;  // Kayıtta loop yapma, 0.001s bırak son kareyi koru
      if (!window.__recording) fired.clear();
    }
    time = t;
    render(time);
  }
  requestAnimationFrame(tick);
}

// ━━━━━━ boot ━━━━━━
// Üst seviyede hemen rAF başlatma — yazı tipi yüklenince başlat
 document.fonts.ready.then(() => {
  render(0);                 // Önce başlangıç ekranını çiz (yazı tipi ready)
  playing = true;
  requestAnimationFrame(tick);  // İlk tick __ready + t=0'ı eşleştirir
});

// ━━━━━━ seek arayüzü (render-video düzeltici savunma için) ━━━━━━
window.__seek = (t) => { fired.clear(); time = t; lastTick = null; render(t); };
```

**Bu şablon neden doğru**:

| Aşama | Neden böyle olmalı |
|------|-------------|
| `lastTick = null` + ilk kare `return` | "Betik yükleme → tick ilk çalıştırma" arasındaki L saniyesinin animasyon zamanına dahil edilmesini önler |
| `playing = false` varsayılan | Yazı tipi yüklenirken `tick` çalışsa bile time ilerlemez, render kaymasını önler |
| `__ready` tick ilk karesinde ayarlanır | Kayıt betiği bu anı zamanlama başlangıcı olarak alır, karşılık gelen görüntü animasyonun gerçek t=0'ıdır |
| `document.fonts.ready.then(...)` içinde tick başlatılır | Yazı tipi fallback genişlik ölçümünden kaçınır, ilk kare yazı tipi atlama sorununu önler |
| `window.__seek` varlığı | `render-video.js`'in aktif olarak düzeltmesine izin verir — ikinci savunma hattı |

**Kayıt betiği tarafındaki karşılık gelen savunma**:
1. `addInitScript` ile `window.__recording = true` enjekte et (page goto öncesi)
2. `waitForFunction(() => window.__ready === true)` bekle, bu anın ofsetini ffmpeg trim olarak kaydet
3. **Ekstra**: `__ready` sonrası aktif olarak `page.evaluate(() => window.__seek && window.__seek(0))`, HTML'nin olası zaman sapmasını zorla sıfırla — bu ikinci savunma hattı, başlangıç şablonuna tam uymayan HTML'lere karşı

**Doğrulama yöntemi**: MP4 dışa aktarıldıktan sonra
```bash
ffmpeg -i video.mp4 -ss 0 -vframes 1 frame-0.png
ffmpeg -i video.mp4 -ss $DURATION-0.1 -vframes 1 frame-end.png
```
İlk kare animasyon t=0 başlangıç durumu olmalı (orta değil, siyah değil), son kare animasyon son durumu olmalı (ikinci loop'un bir anı değil).

**Referans uygulama**: `assets/animations.jsx`'in Stage bileşeni, `scripts/render-video.js` bu protokole göre uygulanmıştır. Elle yazılan HTML başlangıç tick şablonunu kullanmalıdır — her satır belirli bir bug'ı önler.

## 13. Kayıtta Loop Yasak — `window.__recording` Sinyali

**Karşılaşılan hata**: Animasyon Stage varsayılan `loop=true` (tarayıcıda kolay izleme için). `render-video.js` duration saniye kaydettikten sonra 300ms daha ara tampon bekleyip durur, bu 300ms Stage'in bir sonraki döngüye girmesine izin verir. ffmpeg `-t DURATION` keserken, son 0.5-1s bir sonraki döngüye düşer — video sonu ani olarak ilk kareye (Scene 1) döner, izleyici video bug'u sanar.

**Kök neden**: Kayıt betiği ile HTML arasında "kayıt yapıyorum" el sıkışma protokolü yok. HTML kendisinin kaydedildiğini bilmez, tarayıcı etkileşim senaryosuna göre loop yapmaya devam eder.

**Kural**:

1. **Kayıt betiği**: `addInitScript` içinde `window.__recording = true` enjekte et (page goto öncesi):
   ```js
   await recordCtx.addInitScript(() => { window.__recording = true; });
   ```

2. **Stage bileşeni**: Bu sinyali tanıyıp loop'u zorla false yap:
   ```js
   const effectiveLoop = (typeof window !== 'undefined' && window.__recording) ? false : loop;
   // ...
   if (next >= duration) return effectiveLoop ? 0 : duration - 0.001;
   //                                                       ↑ 0.001 bırak Sprite end=duration kapatılmasın
   ```

3. **Son Sprite'ın fadeOut'u**: Kayıt senaryosunda `fadeOut={0}` olarak ayarlanmalı, aksi takdirde video sonu şeffaflığa/kararmaya doğru geçiş olur — kullanıcı net son karede durmasını bekler, fade out değil. Elle yazılan HTML'de son Sprite'lar `fadeOut={0}` ile önerilir.

**Referans uygulama**: `assets/animations.jsx`'in Stage / `scripts/render-video.js` el sıkışma içinde yerleşiktir. Elle yazılan Stage `__recording` algılamasını uygulamalıdır — aksi halde kayıtta bu hataya mutlaka düşülür.

**Doğrulama**: MP4 dışa aktarıldıktan sonra `ffmpeg -ss 19.8 -i video.mp4 -frames:v 1 end.png`, son 0.2 saniyenin hâlâ beklenen son kare olduğunu, ani olarak başka bir sahneye geçmediğini kontrol et.

## 14. 60fps Video Varsayılan Olarak Kare Kopyalama Kullanır — minterpolate Uyumluluğu Kötü

**Karşılaşılan hata**: `convert-formats.sh` `minterpolate=fps=60:mi_mode=mci...` ile ürettiği 60fps MP4, macOS QuickTime / Safari bazı sürümlerinde açılamadı (tamamen siyah veya doğrudan reddetti). VLC / Chrome açabiliyordu.

**Kök neden**: minterpolate çıktısı H.264 elementary stream'inde bazı oynatıcıların ayrıştırmada sorun yaşadığı SEI / SPS alanları var.

**Kural**:

- Varsayılan 60fps basit `fps=60` filtresi (kare kopyalama) kullan, geniş uyumluluk (QuickTime/Safari/Chrome/VLC hepsi açabilir)
- Yüksek kaliteli kare aralama `--minterpolate` flag ile açıkça etkinleştir — ama **mutlaka yerel olarak test et** hedef oynatıcıda teslimat öncesi
- 60fps etiket değeri **yükleme platformu algoritma tanımasıdır** (Bilibili / YouTube'da 60fps işaret öncelikli akış sağlar), gerçek algılanan akıcılık CSS animasyonu için marjinal artıştır
- `-profile:v high -level 4.0` ekle H.264 genel uyumluluğu artırmak için

**`convert-formats.sh` varsayılan olarak uyumlu moda geçirildi**. Yüksek kaliteli kare aralama istersen `--minterpolate` flag ekle:
```bash
bash convert-formats.sh input.mp4 --minterpolate
```

## 15. `file://` + Harici `.jsx` CORS Tuzağı — Tek Dosya Teslimat Motorunu İçine Almalı

**Karşılaşılan hata**: Animasyon HTML'sinde `<script type="text/babel" src="animations.jsx"></script>` ile harici motor yüklendi. Yerel olarak çift tıklama ile açıldı (`file://` protokolü) → Babel Standalone XHR ile `.jsx`'i çeker → Chrome `Cross origin requests are only supported for protocol schemes: http, https, chrome, chrome-extension...` hatası verir → Tüm ekran kararır, `pageerror` değil yalnızca console error verir, "animasyon tetiklenmedi" olarak kolayca yanlış teşhis edilir.

HTTP server başlatmak bile kurtaramayabilir — yerel global proxy varsa `localhost` da proxy'den geçer, 502 / bağlantı hatası dönebilir.

**Kural**:

- **Tek dosya teslimat (çift tıklama ile kullanılabilir HTML)** → `animations.jsx` **mutlaka** `<script type="text/babel">...</script>` etiketi içine inline edilmelidir, `src="animations.jsx"` kullanma
- **Çok dosyalı proje (HTTP server ile sunum)** → Harici yükleme yapılabilir, ama teslimatta açıkça `python3 -m http.server 8000` komutunu yaz
- Karar kriteri: Kullanıcıya teslim edilen "HTML dosyası" mı yoksa "server ile proje dizini" mi? İlk durumda inline kullan
- Stage bileşeni / animations.jsx sıklıkla 200+ satır — HTML `<script>` bloğuna yapıştırılması tamamen kabul edilebilir, boyuttan korkma

**Minimum doğrulama**: Oluşturduğun HTML'yi çift tıklayarak aç, **hiçbir** server üzerinden açma. Stage animasyon ilk karesini normal gösteriyorsa geçti.

## 16. Çok Sahne Ters Renk Bağlamı — Sahne İçinde Öğeler Sabit Renk Kodlamamalı

**Karşılaşılan hata**: Çok sahneli animasyonda, `ChapterLabel` / `SceneNumber` / `Watermark` gibi **çok sahne boyunca görünen** öğeler, bileşende sabit `color: '#1A1A1A'` (koyu metin) yazılmıştı. İlk 4 sahne açık zemin tamam, 5. siyah zemin sahnesinde "05" ve filigran doğrudan kayboldu — hata vermedi, hiçbir kontrol tetiklemedi, kritik bilgi görünmez oldu.

**Kural**:

- **Çok sahne boyunca tekrar kullanılan sahne içi öğeler** (bölüm etiketi / sahne numarası / zaman kodu / filigran / telif hakkı şeridi) **sabit renk değerleri kodlamayı yasakla**
- Üç yoldan biriyle değiştir:
  1. **`currentColor` kalıtım**: Öğe yalnızca `color: currentColor` yaz, ana sahne kapsayıcısı `color: hesaplanan değer` ayarlasın
  2. **invert prop**: Bileşen `<ChapterLabel invert />` prop kabul etsin, açık/koyu manuel geçiş yapsın
  3. **Zemine dayalı otomatik hesaplama**: `color: contrast-color(var(--scene-bg))` (CSS 4 yeni API, veya JS kararı)
- Teslimattan önce Playwright ile **her sahne temsili karesini** çek, gözle "çok sahne öğeleri"nin her zeminde görünür olduğunu kontrol et

Bu hatanın sinsiliği — **hiçbir bug alarmı yok**. Yalnızca insan gözü veya OCR bulabilir.

## Hızlı Kendi Kontrol Listesi (İşe başlamadan önce 5 saniye)

- [ ] Her `position: absolute`'ın ana öğesi `position: relative` ile birlikte?
- [ ] Animasyondaki özel karakterler (`␣` `⌘` `emoji`) seçtiğin yazı tipinde mevcut?
- [ ] Grid/Flex şablonunun count'u ile JS verinin length'i tutarlı?
- [ ] Sahne değişimleri arasında cross-fade var, >0.3s saf boşluk yok?
- [ ] DOM ölçüm kodu `document.fonts.ready.then()` içine alınmış?
- [ ] `render(t)` pure, veya açık reset mekanizması var?
- [ ] 0. kare tam başlangıç durumu, boş değil?
- [ ] Sahne içinde "sahte chrome" dekor yok (ilerleme çubuğu/zaman kodu/alt imza şeridi Stage scrubber ile çakışıyor)?
- [ ] Animasyon tick ilk karesi `window.__ready = true` ile senkronize ayarlanmış? (animations.jsx kendi getiriyor; elle yazılan HTML kendin ekle)
- [ ] Stage `window.__recording` algılayıp loop'u zorla false yapıyor? (elle yazılan HTML mutlaka ekle)
- [ ] Son Sprite'ın `fadeOut`'u 0 olarak ayarlandı (video sonu net karede dursun)?
- [ ] 60fps MP4 varsayılan olarak kare kopyalama modu (uyumluluk), yüksek kaliteli kare aralama yalnızca `--minterpolate` ile?
- [ ] Dışa aktarıldıktan sonra 0. kare + son kare çekip animasyon başlangıç/son durumu olduğunu doğrulandı?
- [ ] Spesifik marka (Stripe/Anthropic/Lovart/...) içeren: "Marka Varlık Protokolü" (SKILL.md §1.a beş adımı) tamamlandı mı? `brand-spec.md` yazıldı mı?
- [ ] Tek dosya teslimat HTML: `animations.jsx` inline, `src="..."` değil? (file:// altında external .jsx CORS karası olur)
- [ ] Çok sahne görünen öğeler (bölüm etiketi/filigran/sahne numarası) sabit renk kodlamıyor? Her sahne zemini altında görünür?
