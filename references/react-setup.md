# React + Babel Proje Kuralları

HTML+React+Babel ile prototip yaparken uyulması gereken teknik kurallar. Uyulmazsa patlar.

## Sabitlenmiş Script Etiketleri (Bu Sürümler Kullanılmalı)

HTML `<head>`'ine bu üç script etiketini yerleştir, **sabit sürüm+integrity hash** ile:

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
```

**Kullanma** `react@18` veya `react@latest` gibi sabitlenmemiş sürümler — sürüm kayması/önbellek sorunları oluşur.

**Atlama** `integrity` — CDN bir gün ele geçirilirse veya kurcalanırsa bu savunma hattıdır.

## Dosya Yapısı

```
ProjeAdı/
├── index.html               # Ana HTML
├── components.jsx           # Bileşen dosyası (type="text/babel" ile yüklenir)
├── data.js                  # Veri dosyası
└── styles.css               # Ek CSS (isteğe bağlı)
```

HTML'de yükleme şekli:

```html
<!-- Önce React+Babel -->
<script src="https://unpkg.com/react@18.3.1/..."></script>
<script src="https://unpkg.com/react-dom@18.3.1/..."></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/..."></script>

<!-- Sonra bileşen dosyaların -->
<script type="text/babel" src="components.jsx"></script>
<script type="text/babel" src="pages.jsx"></script>

<!-- Son ana giriş -->
<script type="text/babel">
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
</script>
```

**Kullanma** `type="module"` — Babel ile çakışır.

## Üç Çiğneme Kuralı

### Kural 1: styles Nesnesi Tekil Adlandırma Kullanmalı

**Yanlış** (Çok bileşenli kesin patlar):
```jsx
// components.jsx
const styles = { button: {...}, card: {...} };

// pages.jsx  ← Aynı isimle üstüne yazar!
const styles = { container: {...}, header: {...} };
```

**Doğru**: Her bileşen dosyasının styles'ı tekil önek kullanır.

```jsx
// terminal.jsx
const terminalStyles = { 
  screen: {...}, 
  line: {...} 
};

// sidebar.jsx
const sidebarStyles = { 
  container: {...}, 
  item: {...} 
};
```

**Veya inline styles kullan** (küçük bileşenler için öneri):
```jsx
<div style={{ padding: 16, background: '#111' }}>...</div>
```

Bu kural **pazarlık kabul etmez**. Her `const styles = {...}` yazışında spesifik adlandırmaya değiştir, aksi halde çok bileşen yüklendiğinde tam yığın hata verir.

### Kural 2: Scope Paylaşılmaz, Manuel export Gerekir

**Kilit bilgi**: Her `<script type="text/babel">` Babel tarafından bağımsız derlenir, aralarında **scope iletişimi yok**. `components.jsx`'te tanımlanan `Terminal` bileşeni, `pages.jsx`'te **varsayılan olarak undefined**.

**Çözüm**: Her bileşen dosyası sonunda, paylaşılacak bileşen/araçları `window`'a export et:

```jsx
// components.jsx sonunda
function Terminal(props) { ... }
function Line(props) { ... }
const colors = { green: '#...', red: '#...' };

Object.assign(window, {
  Terminal, Line, colors,
  // Başka yerde kullanacaklarının hepsini burada listele
});
```

Sonra `pages.jsx` `<Terminal />` doğrudan kullanabilir, çünkü JSX `window.Terminal`'de arar.

### Kural 3: scrollIntoView Kullanma

`scrollIntoView` tüm HTML kapsayıcısını yukarı iter, web harness düzenini bozar. **Asla kullanma**.

Alternatif:
```js
// Kapsayıcı içinde belirli konuma kaydır
container.scrollTop = targetElement.offsetTop;

// Veya element.scrollTo kullan
container.scrollTo({
  top: targetElement.offsetTop - 100,
  behavior: 'smooth'
});
```

## HTML İçinde Claude API Çağrısı

Bazı yerel design-agent ortamları (örn. Claude.ai Artifacts) yapılandırmasız `window.claude.complete` sağlar, ama çoğu agent ortamı (Claude Code / Codex / Cursor / Trae / vb.) yerelinde **yoktur**.

HTML prototipin LLM çağrısı yapması gerekiyorsa (örn: bir sohbet arayüzü demosu), iki seçenek:

### Seçenek A: Gerçekten çağırma, mock kullan

Demo senaryosu önerilir. Sahte bir helper yaz, önceden ayarlanmış yanıt döndür:
```jsx
window.claude = {
  async complete(prompt) {
    await new Promise(r => setTimeout(r, 800)); // Gecikme simülasyonu
    return "Bu bir mock yanıttır. Gerçek dağıtımda gerçek API ile değiştirin.";
  }
};
```

### Seçenek B: Gerçek Anthropic API Çağrısı

API key gerektirir, kullanıcı kendi key'ini HTML'e girmek zorundadır. **Asla key'i HTML'e sabit kodlama**.

```html
<input id="api-key" placeholder="Anthropic API key'inizi yapıştırın" />
<script>
window.claude = {
  async complete(prompt) {
    const key = document.getElementById('api-key').value;
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    return data.content[0].text;
  }
};
</script>
```

**Dikkat**: Tarayıcı doğrudan Anthropic API çağrısı yaparken CORS sorunuyla karşılaşır. Kullanıcının verdiği önizleme ortamı CORS bypass desteklemiyorsa, bu yol kapalıdır. Bu durumda Seçenek A mock kullan, veya kullanıcıya proxy arka ucu gerektiğini söyle.

### Seçenek C: Agent tarafı LLM yeteneği ile mock veri oluşturma

Sadece yerel demo kullanımıysa, mevcut agent oturumunda geçici olarak agent'ın LLM yeteneğini (veya kullanıcının kurduğu multi-model skill) çağırarak mock yanıt verisi oluştur, sonra HTML'e sabit kod olarak yaz. Böylece HTML çalışma zamanında hiçbir API'ye bağımlı olmaz.

## Tipik HTML Başlangıç Şablonu

Bu şablonu React prototipin iskeleti olarak kopyala:

```html
<!DOCTYPE html>
<html lang="tr-TR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prototip Adın</title>

  <!-- React + Babel sabitlenmiş -->
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; width: 100%; }
    body { 
      font-family: -apple-system, 'SF Pro Text', sans-serif;
      background: #FAFAFA;
      color: #1A1A1A;
    }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>

  <!-- Bileşen dosyaların -->
  <script type="text/babel" src="components.jsx"></script>

  <!-- Ana giriş -->
  <script type="text/babel">
    const { useState, useEffect } = React;

    function App() {
      return (
        <div style={{padding: 40}}>
          <h1>Hello</h1>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
```

## Sık Hatalar ve Çözümleri

**`styles is not defined` veya `Cannot read property 'button' of undefined`**
→ Bir dosyada `const styles` tanımladın, başka bir dosya üstüne yazdı. Her birini spesifik adlandırmaya değiştir.

**`Terminal is not defined`**
→ Çapraz dosya referansında scope iletişimi yok. Terminal tanımlandığı dosyanın sonuna `Object.assign(window, {Terminal})` ekle.

**Tüm sayfa beyaz, konsolda hata yok**
→ Büyük olasılıkla JSX sözdizim hatası ama Babel konsola yansıtmadı. `babel.min.js`'i geçici olarak `babel.js` sıkıştırılmamış sürüme değiştir, hata mesajı daha net olur.

**ReactDOM.createRoot is not a function**
→ Sürüm yanlış. react-dom@18.3.1 kullandığından emin ol (17 veya diğeri değil).

**`Objects are not valid as a React child`**
→ Bir nesne yerine JSX/string render ettin. Genellikle `{someObj}` yazıp `{someObj.name}` yazman gerekiyordu.

## Büyük Projeler Nasıl Dosyalara Bölünür

**>1000 satırlık tek dosya** bakımı zordur. Bölme düşüncesi:

```
Proje/
├── index.html
├── src/
│   ├── primitives.jsx      # Temel öğeler: Button, Card, Badge...
│   ├── components.jsx      # İş bileşenleri: UserCard, PostList...
│   ├── pages/
│   │   ├── home.jsx        # Ana sayfa
│   │   ├── detail.jsx      # Detay sayfası
│   │   └── settings.jsx    # Ayarlar sayfası
│   ├── router.jsx          # Basit yönlendirme (React state geçişi)
│   └── app.jsx             # Giriş bileşeni
└── data.js                 # mock veri
```

HTML'de sırayla yükle:
```html
<script type="text/babel" src="src/primitives.jsx"></script>
<script type="text/babel" src="src/components.jsx"></script>
<script type="text/babel" src="src/pages/home.jsx"></script>
<script type="text/babel" src="src/pages/detail.jsx"></script>
<script type="text/babel" src="src/pages/settings.jsx"></script>
<script type="text/babel" src="src/router.jsx"></script>
<script type="text/babel" src="src/app.jsx"></script>
```

**Her dosya sonunda** paylaşılacakları `Object.assign(window, {...})` ile export et.
