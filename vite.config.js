// Vite + PWA yapılandırması — "güvenli temel" modülarizasyon adımı.
// app.js TEK dosya olarak kalır; Vite yalnızca bundling/minify/içerik-hash'li
// precache ve hızlı dev server ekler. Inline on* handler'ları app.js sonundaki
// [MODÜL KÖPRÜSÜ] bloğu sayesinde bundle altında da çalışır.
//
// Kullanım:
//   npm run dev      → yerel geliştirme sunucusu (HMR)
//   npm run build    → dist/ üretir (minify + vite-plugin-pwa SW)
//   npm run preview  → build çıktısını yerelde servis eder
//
// NOT: Elle yazılmış sw.js ve version.js mevcut (build'siz doğrudan servis için).
// Build kullanıldığında vite-plugin-pwa kendi SW'sini üretir; o senaryoda
// index.html'deki manuel SW register'ı yerine plugin'in autoUpdate akışı geçerlidir.
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { copyFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// app.js/version.js içerik hash'i — değiştiğinde workbox precache'i tazelesin diye.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const _hash = (f) => createHash('md5').update(readFileSync(resolve(__dirname, f))).digest('hex').slice(0, 16);
const APP_REVISION = _hash('app.js') + '-' + _hash('version.js');

// app.js (tek dosya monolit) ve version.js plain <script> ile yüklenir; Vite bunları
// bundle'lamaz. "Güvenli temel" adımında onları aynen dist'e kopyalarız — böylece hem
// build çıktısı çalışır hem de raw (build'siz) dağıtım bozulmaz. Gerçek JS bundling/
// minify, ileride modül bölme (Faz 2) ile app.js ES module'e dönüştüğünde devreye girer.
function copyRootScripts() {
  return {
    name: 'copy-root-scripts',
    generateBundle() {
      for (const name of readdirSync(resolve(__dirname, 'assets/icons'))) {
        this.emitFile({ type:'asset', fileName:'assets/icons/' + name, source:readFileSync(resolve(__dirname, 'assets/icons', name)) });
      }
    },
    closeBundle() {
      for (const f of ['app.js', 'version.js']) {
        copyFileSync(resolve(__dirname, f), resolve(__dirname, 'dist', f));
      }
    },
  };
}

export default defineConfig({
  // Göreli yollar (GitHub Pages / alt-dizin dağıtımıyla uyumlu).
  base: './',
  build: {
    target: 'es2019',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: { output: { assetFileNames: asset =>
      (asset.names || []).includes('manifest.json') ? 'manifest.json' : 'assets/[name]-[hash][extname]' } },
  },
  plugins: [
    copyRootScripts(),
    VitePWA({
      registerType: 'autoUpdate',
      // Mevcut manifest.json korunur; plugin onu enjekte eder.
      manifest: false,

      workbox: {
        // Tüm build çıktısı içerik-hash'li olduğundan yalnız değişen chunk yeniden iner.
        globPatterns: ['**/*.{js,css,html,json,png,svg,woff2}'],
        // app.js/version.js bundle dışı kopyalandığından precache'e elle dahil et.
        additionalManifestEntries: [
          { url: 'app.js', revision: APP_REVISION },
          { url: 'version.js', revision: APP_REVISION },
        ],
        // CDN bağımlılıkları (jspdf, font-awesome, firebase) çevrimdışı için cache'lenir.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://cdnjs.cloudflare.com' ||
              url.origin === 'https://fonts.googleapis.com' ||
              url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'shifttrack-cdn-v1',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
});
