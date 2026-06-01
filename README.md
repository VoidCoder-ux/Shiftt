# Shiftt

Firebase tabanlı, çevrimdışı çalışabilen (PWA) vardiya & bordro hesaplama uygulaması.

## Çalıştırma

İki yol vardır:

### 1) Build'siz (mevcut/üretim yolu)
Kök dizindeki dosyalar doğrudan statik olarak servis edilir. Herhangi bir statik
sunucu yeterlidir:

```bash
python3 -m http.server 8000
# tarayıcıda http://localhost:8000
```

Sürüm güncellemesi için **yalnızca `version.js`** değiştirilir (hem service worker
cache adı hem HTML cache buster bu değeri kullanır). `.github/workflows/bump-version.yml`
`main`'e push'ta bunu otomatik artırır.

### 2) Vite ile (geliştirme + optimize build)
```bash
npm install
npm run dev       # HMR'li geliştirme sunucusu
npm run build     # dist/ üretir — vite-plugin-pwa ile içerik-hash'li precache
npm run preview   # build çıktısını yerelde servis eder
```

> **Modülarizasyon notu:** Şu an "güvenli temel" aşamasındayız — `app.js` tek dosya
> olarak kalır; Vite bundling/minify/PWA precache altyapısını ekler ve build çıktısında
> `app.js`/`version.js` aynen kopyalanır. Inline `on*` handler'ları `app.js` sonundaki
> `[MODÜL KÖPRÜSÜ]` bloğu sayesinde bundle altında da çalışır. İleride `app.js`
> ES modüllerine (auth / firebase / payroll / shifts / ui / export / persistence)
> bölünerek tam tree-shaking devreye alınabilir.

## Testler

```bash
npm test          # node:test — bordro/sayı fonksiyonları regresyon testleri
```

Testler `app.js`'i değiştirmeden, hedef saf fonksiyonların bağımlılık kapanışını izole
bir sandbox'ta yükler (`tests/loader.mjs`) ve golden değerlerle kilitler
(`tests/payroll.test.mjs`). Modülarizasyon/refactor öncesi emniyet ağıdır.
