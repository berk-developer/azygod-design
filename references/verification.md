# Doğrulama: Çıktı Doğrulama Akışı

Bazı design-agent yerleşik ortamlarda (örneğin Claude.ai Artifacts) `fork_verifier_agent` ile subagent başlatıp iframe ekran görüntüsü kontrolü yapma yeteneği vardır. Çoğu agent ortamında (Claude Code / Codex / Cursor / Trae / vb.) bu yerleşik yetenek yoktur — Playwright ile manuel olarak aynı doğrulama senaryolarını kapsayabilirsin.

## Doğrulama Listesi

Her HTML çıktısından sonra bu listeyi bir kez uygula:

### 1. Tarayıcı Render Kontrolü (Zorunlu)

En temel: **HTML açılıyor mu**? macOS'te:

```bash
open -a "Google Chrome" "/path/to/your/design.html"
```

Veya Playwright ile ekran görüntüsü al (bir sonraki bölüm).

### 2. Konsol Hata Kontrolü

HTML dosyalarındaki en yaygın sorun JS hatası nedeniyle beyaz ekrandır. Playwright ile bir kez çalıştır:

```bash
python ~/.claude/skills/claude-design/scripts/verify.py path/to/design.html
```

Bu script şunları yapar:
1. Headless chromium ile HTML'i açar
2. Ekran görüntüsü alıp proje dizinine kaydeder
3. Konsol hatalarını yakalar
4. Durum raporu verir

Detaylar için `scripts/verify.py` dosyasına bak.

### 3. Çoklu Görünüm Alanı Kontrolü

Eğer responsive tasarım ise, birden fazla viewport'tan yakala:

```bash
python verify.py design.html --viewports 1920x1080,1440x900,768x1024,375x667
```

### 4. Etkileşim Kontrolü

Tweaks, animasyon, buton geçişleri — varsayılan statik ekran görüntüsü bunları göremez. **Kullanıcının kendi tarayıcısında bir kez tıklamasını öner**, veya Playwright ile kaydet:

```python
page.video.record('interaction.mp4')
```

### 5. Slayt Sayfa Sayfa Kontrol

Deck tipi HTML'ler için, sayfa sayfa yakala:

```bash
python verify.py deck.html --slides 10  # İlk 10 sayfayı yakala
```

`deck-slide-01.png`, `deck-slide-02.png`... üretir, hızlı göz atmak için kolaydır.

## Playwright Kurulumu

İlk kullanımda gerekli:

```bash
# Henüz kurulu değilse
npm install -g playwright
npx playwright install chromium

# Veya Python sürümü
pip install playwright
playwright install chromium
```

Kullanıcı zaten Playwright'ı global olarak kurduysa, doğrudan kullanabilir.

## Ekran Görüntüsü En İyi Uygulamaları

### Tam Sayfa Yakala

```python
page.screenshot(path='full.png', full_page=True)
```

### Görünüm Alanı Yakala

```python
page.screenshot(path='viewport.png')  # Varsayılan olarak sadece görünür alan
```

### Belirli Öğeyi Yakala

```python
element = page.query_selector('.hero-section')
element.screenshot(path='hero.png')
```

### Yüksek Çözünürlüklü Ekran Görüntüsü

```python
page = browser.new_page(device_scale_factor=2)  # retina
```

### Animasyon Bittikten Sonra Yakala

```python
page.wait_for_timeout(2000)  # Animasyonun yerleşmesi için 2 saniye bekle
page.screenshot(...)
```

## Ekran Görüntüsünü Kullanıcıya Gönder

### Yerel Ekran Görüntüsünü Doğrudan Aç

```bash
open screenshot.png
```

Kullanıcı kendi Preview / Figma / VSCode / Tarayıcısında görür.

### Resim Barınağına Yükle ve Bağlantı Paylaş

Uzak işbirlikçilere göstermek gerekiyorsa (örneğin Slack / Feishu / WeChat), kullanıcının kendi resim barınağı aracını veya MCP'sini kullanarak yükle:

```bash
python ~/Documents/writing/tools/upload_image.py screenshot.png
```

ImgBB kalıcı bağlantısı döner, herhangi bir yere yapıştırılabilir.

## Doğrulama Hatalarında

### Sayfa Beyaz Ekran

Konsolda kesinlikle hata vardır. Önce kontrol et:

1. React+Babel script tag'inin integrity hash'i doğru mu (`react-setup.md` bölümüne bak)
2. `const styles = {...}` ad çakışması var mı
3. Çapraz dosya bileşenleri `window`'a export edilmiş mi
4. JSX sözdizimi hatası (babel.min.js hata vermez, babel.js sıkıştırılmamış sürümüne geç)

### Animasyon Takılma

- Chrome DevTools Performance sekmesini aç ve bir süre kaydet
- Layout thrashing'i bul (sık reflow)
- Efektlerde `transform` ve `opacity` öncelikli kullan (GPU hızlandırma)

### Yazı Tipi Yanlış

- `@font-face` url'sinin erişilebilirliğini kontrol et
- Yedek yazı tipini kontrol et
- Çince yazı tipi yavaş yükleniyor: Önce yedek göster, yüklendikten sonra geçiş yap

### Düzen Hataları

- `box-sizing: border-box` global olarak uygulanmış mı kontrol et
- `* { margin: 0; padding: 0 }` reset'i kontrol et
- Chrome DevTools'ta gridlines açıp gerçek düzeni gör

## Doğrulama = Tasarımcının İkinci Gözü

**Her zaman kendin bir kez geç**. AI kod yazarken sık karşılaşılanlar:

- Görünürde doğru ama etkileşimde hata var
- Statik ekran görüntüsü iyi ama kaydırırken hatalı
- Geniş ekran güzel ama dar ekran çöküyor
- Karanlık mod test edilmeyi unuttu
- Tweaks geçişinden sonra bazı bileşenler yanıt vermiyor

**Son 1 dakikalık doğrulama 1 saatlik yeniden çalışmayı kurtarabilir**.

## Sık Kullanılan Doğrulama Script Komutları

```bash
# Temel: Aç + Yakala + Hata yakala
python verify.py design.html

# Çoklu viewport
python verify.py design.html --viewports 1920x1080,375x667

# Çoklu slayt
python verify.py deck.html --slides 10

# Belirli dizine çıktı
python verify.py design.html --output ./screenshots/

# headless=false, gerçek tarayıcıyı sana göster
python verify.py design.html --show
```
