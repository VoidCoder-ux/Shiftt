importScripts('./version.js'); // APP_VERSION burada tanımlanır

const CACHE_NAME = APP_VERSION;
/* [FIX-DÜŞÜK] CDN varlıkları sürümden BAĞIMSIZ kalıcı cache'te tutulur — her sürüm
   artışında yeniden indirilmesin (değişmeyen 3. parti dosyalar). Çekirdek dosyalar
   sürümlü cache'te kalır (yeni deploy'da tazelenir). */
const CDN_CACHE = 'shifttrack-cdn-v1';
const CORE_ASSETS = ['./', './index.html', './version.js', './app.js', './style.css', './manifest.json', './assets/icons/icon-192.png', './assets/icons/icon-512.png'];
const CDN_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  // PDF/e-Bordro üretimi için — offline'da da çalışsın diye önbelleğe alınır.
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)),
      // CDN zaten önbellekteyse tekrar indirme (sürümden bağımsız kalıcı cache)
      caches.open(CDN_CACHE).then(cache =>
        Promise.allSettled(CDN_ASSETS.map(url =>
          cache.match(url).then(hit => hit || cache.add(url))
        ))
      )
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      // Eski SÜRÜMLÜ çekirdek cache'lerini sil; CDN kalıcı cache'i koru.
      keys.filter(k => k !== CACHE_NAME && k !== CDN_CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

const NAV_TIMEOUT_MS = 8000;
function fetchWithTimeout(req, ms) {
  const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
  const signal = ctrl ? ctrl.signal : undefined;
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      if (ctrl) { try { ctrl.abort(); } catch(_) {} }
      reject(new Error('timeout'));
    }, ms);
    fetch(req, { signal }).then(
      res => { clearTimeout(t); resolve(res); },
      err => { clearTimeout(t); reject(err); }
    );
  });
}

const OFFLINE_RESPONSE = new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin && (e.request.mode === 'navigate' || url.pathname.endsWith('.html'))) {
    e.respondWith(
      fetchWithTimeout(e.request, NAV_TIMEOUT_MS).then(res => {
        if (res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html').then(r2 => r2 || OFFLINE_RESPONSE)))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(res => {
        if (res.status === 200 && sameOrigin) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request).then(r => r || new Response('', { status: 503, statusText: 'Offline' }))))
    );
  }
});
