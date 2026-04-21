# Tweaks: Tasarım Varyasyonları Gerçek Zamanlı Ayar

Tweaks bu skill'in çok çekirdek yeteneğidir — kullanıcının kodu değiştirmeden gerçek zamanlı olarak varyasyonlar arasında geçiş yapmasını / parametreleri ayarlamasını sağlar.

**Çapraz agent ortam uyumluluğu**: Bazı design-agent yerleşik ortamları (örneğin Claude.ai Artifacts) host postMessage'e bağlı olarak tweak değerlerini kaynak koda geri yazar. Bu skill **saf ön yüz localStorage çözümü** kullanır — etki aynıdır (yenileme durumu korur), ancak kalıcılık tarayıcı localStorage'ında gerçekleşir, kaynak dosyasında değil. Bu çözüm herhangi bir agent ortamında (Claude Code / Codex / Cursor / Trae / vb.) çalışır.

## Tweaks Ne Zaman Eklenir

- Kullanıcı açıkça "ayarlanabilir olsun" / "birden fazla sürüm geçişi" istediğinde
- Tasarımda karşılaştırılması gereken birden fazla varyasyon varsa
- Kullanıcı söylememiş olsa da, sen öznel olarak **birkaç ilham verici tweaks eklemenin kullanıcıya olasılıkları göstereceğini** düşünüyorsan

Varsayılan öneri: **Her tasarıma 2-3 tweaks ekle** (renk teması / yazı boyutu / düzen varyasyonu) kullanıcı istemese bile — kullanıcıya olasılık alanını göstermek tasarım hizmetinin bir parçasıdır.

## Uygulama Yöntemi (Saf Ön Yüz Sürümü)

### Temel Yapı

```jsx
const TWEAK_DEFAULTS = {
  "primaryColor": "#D97757",
  "fontSize": 16,
  "density": "comfortable",
  "dark": false
};

function useTweaks() {
  const [tweaks, setTweaks] = React.useState(() => {
    try {
      const stored = localStorage.getItem('design-tweaks');
      return stored ? { ...TWEAK_DEFAULTS, ...JSON.parse(stored) } : TWEAK_DEFAULTS;
    } catch {
      return TWEAK_DEFAULTS;
    }
  });

  const update = (patch) => {
    const next = { ...tweaks, ...patch };
    setTweaks(next);
    try {
      localStorage.setItem('design-tweaks', JSON.stringify(next));
    } catch {}
  };

  const reset = () => {
    setTweaks(TWEAK_DEFAULTS);
    try {
      localStorage.removeItem('design-tweaks');
    } catch {}
  };

  return { tweaks, update, reset };
}
```

### Tweaks Panel UI

Sağ alt köşede yüzen panel. Daraltılabilir:

```jsx
function TweaksPanel() {
  const { tweaks, update, reset } = useTweaks();
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 9999,
    }}>
      {open ? (
        <div style={{
          background: 'white',
          border: '1px solid #e5e5e5',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          width: 280,
          fontFamily: 'system-ui',
          fontSize: 13,
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <strong>Tweaks</strong>
            <button onClick={() => setOpen(false)} style={{
              border: 'none', background: 'none', cursor: 'pointer', fontSize: 16,
            }}>×</button>
          </div>

          {/* Renk */}
          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ marginBottom: 4, color: '#666' }}>Ana Renk</div>
            <input 
              type="color" 
              value={tweaks.primaryColor} 
              onChange={e => update({ primaryColor: e.target.value })}
              style={{ width: '100%', height: 32 }}
            />
          </label>

          {/* Yazı boyutu slider */}
          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ marginBottom: 4, color: '#666' }}>Yazı Boyutu ({tweaks.fontSize}px)</div>
            <input 
              type="range" 
              min={12} max={24} step={1}
              value={tweaks.fontSize}
              onChange={e => update({ fontSize: +e.target.value })}
              style={{ width: '100%' }}
            />
          </label>

          {/* Yoğunluk seçenekleri */}
          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ marginBottom: 4, color: '#666' }}>Yoğunluk</div>
            <select 
              value={tweaks.density}
              onChange={e => update({ density: e.target.value })}
              style={{ width: '100%', padding: 6 }}
            >
              <option value="compact">Sıkışık</option>
              <option value="comfortable">Rahat</option>
              <option value="spacious">Geniş</option>
            </select>
          </label>

          {/* Karanlık mod toggle */}
          <label style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}>
            <input 
              type="checkbox" 
              checked={tweaks.dark}
              onChange={e => update({ dark: e.target.checked })}
            />
            <span>Karanlık Mod</span>
          </label>

          <button onClick={reset} style={{
            width: '100%',
            padding: '8px 12px',
            background: '#f5f5f5',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
          }}>Sıfırla</button>
        </div>
      ) : (
        <button 
          onClick={() => setOpen(true)}
          style={{
            background: '#1A1A1A',
            color: 'white',
            border: 'none',
            borderRadius: 999,
            padding: '10px 16px',
            fontSize: 12,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >⚙ Tweaks</button>
      )}
    </div>
  );
}
```

### Tweaks Uygulama

Ana bileşende Tweaks kullan:

```jsx
function App() {
  const { tweaks } = useTweaks();

  return (
    <div style={{
      '--primary': tweaks.primaryColor,
      '--font-size': `${tweaks.fontSize}px`,
      background: tweaks.dark ? '#0A0A0A' : '#FAFAFA',
      color: tweaks.dark ? '#FAFAFA' : '#1A1A1A',
    }}>
      {/* İçeriğin */}
      <TweaksPanel />
    </div>
  );
}
```

CSS'te değişkenleri kullan:

```css
button.cta {
  background: var(--primary);
  color: white;
  font-size: var(--font-size);
}
```

## Tipik Tweak Seçenekleri

Farklı tasarım türlerine ne tweaks eklenir:

### Genel
- Ana renk (color picker)
- Yazı boyutu (slider 12-24px)
- Yazı tipi (select: display font vs body font)
- Karanlık mod (toggle)

### Slayt deck
- Tema (light/dark/brand)
- Arka plan stili (solid/gradient/image)
- Yazı tipi karşıtlığı (daha dekoratif vs daha ölçülü)
- Bilgi yoğunluğu (minimal/standard/dense)

### Ürün prototipi
- Düzen varyasyonu (layout A / B / C)
- Etkileşim hızı (animation speed 0.5x-2x)
- Veri miktarı (mock veri sayısı 5/20/100)
- Durum (empty/loading/success/error)

### Animasyon
- Hız (0.5x-2x)
- Döngü (once/loop/ping-pong)
- Easing (linear/easeOut/spring)

### Landing page
- Hero stili (image/gradient/pattern/solid)
- CTA metni (birkaç varyasyon)
- Yapı (single column / two column / sidebar)

## Tweaks Tasarım İlkeleri

### 1. Anlamlı Seçenekler, Uğraştıran Değil

Her tweak **gerçek bir tasarım seçeneği** sunmalı. Kimse gerçekten değiştirmeyeceği tweak ekleme (örneğin border-radius 0-50px slider — kullanıcı ayarladıktan sonra tüm ara değerlerin çirkin olduğunu keşfeder).

İyi tweak **ayrık, düşünülmüş varyasyonlar** sunar:
- "Köşe stili": Köşesiz / hafif köşeli / büyük köşeli (üç seçenek)
- Değil: "Köşe": 0-50px slider

### 2. Az Çoktur

Bir tasarımın Tweaks paneli **en fazla 5-6** seçenek içermeli. Daha fazlası "yapılandırma sayfası" haline gelir, hızlı varyasyon keşfinin anlamını kaybeder.

### 3. Varsayılan Değer Tamamlanmış Tasarımdır

Tweaks **süs değildir**. Varsayılan değerin kendisi tam, yayınlanabilir bir tasarım olmalıdır. Kullanıcı Tweaks panelini kapattığında gördüğü üretimdir.

### 4. Makul Gruplama

Seçenekler fazlaysa gruplu göster:

```
---- Görsel ----
Ana Renk | Yazı Boyutu | Karanlık Mod

---- Düzen ----
Yoğunluk | Kenar Çubuğu Konumu

---- İçerik ----
Göster Veri Miktarı | Durum
```

## İleri Uyumlu Kaynak Kodu Seviyesinde Kalıcılık Host'u

Eğer gelecekte tasarımını kaynak kodu seviyesinde tweaks destekleyen (örneğin Claude.ai Artifacts) bir ortama yüklemek istersen, **EDITMODE işaret bloğu** koru:

```jsx
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#D97757",
  "fontSize": 16,
  "density": "comfortable",
  "dark": false
}/*EDITMODE-END*/;
```

İşaret bloğu localStorage çözümünde **işlevsizdir** (sadece sıradan bir yorumdur), ancak kaynak kodu geri yazmayı destekleyen host'ta okunur ve kaynak kodu seviyesinde kalıcılık sağlar. Bunu eklemek mevcut ortama zarar vermez, aynı zamanda ileri uyumluluğu korur.

## Sık Sorulan Sorular

**Tweaks paneli tasarım içeriğini kapatıyor**
→ Kapatılabilir yap. Varsayılan olarak kapalı, küçük bir buton göster, kullanıcı tıkladığında açılsın.

**Kullanıcı tweak geçişinden sonra ayarları tekrar tekrar yapıyor**
→ Zaten localStorage kullanılıyor. Eğer yenilemeden sonra kalıcı değilse, localStorage'ın kullanılabilirliğini kontrol et (gizli mod başarısız olur, catch ile yakalanmalı).

**Birden fazla HTML sayfası tweaks'i paylaşmak istiyor**
→ localStorage key'e proje adı ekle: `design-tweaks-[projectName]`.

**Tweak'ler arasında bağlantılı ilişki kurmak istiyorum**
→ `update` içine mantık ekle:

```jsx
const update = (patch) => {
  let next = { ...tweaks, ...patch };
  // Bağlantı: karanlık mod seçildiğinde otomatik yazı rengi değiştir
  if (patch.dark === true && !patch.textColor) {
    next.textColor = '#F0EEE6';
  }
  setTweaks(next);
  localStorage.setItem(...);
};
```
