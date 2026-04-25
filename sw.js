const CACHE_NAME = 'shifttrack-v20';
const CORE_ASSETS = ['./', './index.html', './manifest.json'];
const CDN_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      // Önce kritik dosyaları cache'le, sonra CDN'leri tek tek dene (başarısız olursa atla)
      cache.addAll(CORE_ASSETS).then(() =>
        Promise.allSettled(CDN_ASSETS.map(url => cache.add(url)))
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// [FIX ERR-HANDLE-13] Navigate fetch'i 8s timeout'a bağla — yavaş ağda cache fallback'a düş
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

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const sameOrigin = url.origin === self.location.origin;

  // Network-first for HTML pages, cache-first for assets
  if (sameOrigin && (e.request.mode === 'navigate' || url.pathname.endsWith('.html'))) {
    e.respondWith(
      fetchWithTimeout(e.request, NAV_TIMEOUT_MS).then(res => {
        if (res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(res => {
        if (res.status === 200 && sameOrigin) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request)))
    );
  }
});
