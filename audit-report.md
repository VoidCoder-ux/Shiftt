# Shiftt Uygulama Denetim Raporu

**İlk denetim:** 2026-05-06
**Son durum güncellemesi:** 2026-06-20
**Denetçi:** Claude Code
**Repo:** https://github.com/VoidCoder-ux/Shiftt

> **Not (2026-06-20):** Bu rapor ilk olarak tüm CSS/JS'in tek `index.html`
> içinde inline olduğu (≈644 KB) sürüm için yazıldı. Kod tabanı o günden bu
> yana ayrıştırıldı: `index.html`, `style.css`, `app.js`, `version.js`, `sw.js`
> ayrı dosyalar; Vite + `vite-plugin-pwa` build hattı eklendi; ESLint + `node:test`
> regresyon testleri ve CI (lint + test + build) devrede. Aşağıdaki bulguların
> **çoğu kapatıldı** — her maddenin güncel durumu işaretlendi.

---

## Güncel Durum Özeti (2026-06-20)

| Kod | Bulgu | Durum |
|---|---|---|
| SEC-01 | Firebase config repoda açık | ✅ Politika ile kapatıldı — istemci tanımlayıcısı; güvenlik `firestore.rules` ile, README'de belgeli (HTTP referrer kısıtı önerisi) |
| SEC-02 | CSP tanımlı değil | ✅ `index.html` `<head>`'te CSP meta etiketi var |
| SEC-03 | Harici linklerde `rel="noopener"` yok | ✅ Geçersiz — kodda `target="_blank"` kullanımı yok |
| A11Y-01 | Icon düğmelerde ARIA eksik | ✅ Topbar + modal kapat düğmelerinde `aria-label` var |
| A11Y-02 | Düşük ARIA kapsama | ✅ `setupA11yModals()` + `enhanceA11y()` (MutationObserver ile dinamik içerik) |
| JS-01 | `init()` içinde kırılgan keydown | ✅ `setupKeyboardShortcuts()` modül seviyesinde bir kez çağrılıyor |
| JS-02 | DeepSeek anahtarı localStorage'da | ✅ API anahtarı yalnız `sessionStorage`'da; localStorage'da yalnız model/onay |
| FIREBASE-01 | Firestore ara-yol kuralı yok | ✅ `userData/{uid}/users/{appUserId}` açık kuralı + yazma boyut sınırı eklendi |
| SW-01 | SW/HTML sürüm uyumsuzluğu | ✅ Tek kaynak `version.js` (`APP_VERSION`) — hem SW cache adı hem HTML cache buster oradan okur |
| CSS-01 | Tüm CSS/JS inline | ✅ `style.css` + `app.js` ayrıştırıldı |
| UI-01 | `<label for>` bağlantısı yok | ✅ Form label'larında `for=` var; geri kalan label'lar input'larını saran (radio/checkbox) erişilebilir wrapper'lar |
| UI-02 | Script'lerde `defer` yok | ✅ Harici CDN script'leri `defer` ile yükleniyor |
| PWA-01 | manifest icon boyutları | 🟡 `any`/`maskable` purpose eklendi; ek boyutlu PNG'ler opsiyonel |
| PWA-02 | manifest `shortcuts`/`screenshots` | 🟢 Opsiyonel iyileştirme |
| PWA-03 | Google Fonts `crossorigin` | 🟢 Opsiyonel iyileştirme |
| PERF-01 | Tek büyük dosya | ✅ Vite build: minify + içerik-hash'li precache |
| DEP-01 | Bağımlılık güvenlik açıkları | ✅ (2026-06-20) Vite 5→8, vite-plugin-pwa 0.20→1.3; `npm audit` → 0 açık |

**Kapatıldı:** çoğunluk · **Açık (opsiyonel):** PWA-01/02/03 (düşük öncelik)

---

## Açık Kalan Opsiyonel İyileştirmeler

- **PWA-01:** Gerçek 72/96/128/144/152/384 px ikon PNG'leri üretilirse kurulum
  deneyimi iyileşir (mevcut 192/512 + maskable yeterli çalışıyor).
- **PWA-02:** `manifest.json`'a ev ekranı `shortcuts` ve mağaza `screenshots`
  eklenebilir.
- **PWA-03:** Google Fonts `<link>`'ine `crossorigin` eklenebilir.
- **SEC (uzun vade):** İnline script/handler'lar nedeniyle CSP `unsafe-inline`
  kullanıyor; nonce tabanlı CSP'ye geçiş ileride değerlendirilebilir.

---

## Firestore Güvenlik Değerlendirmesi (güncel)

| Kural | Durum | Not |
|---|---|---|
| `userData/{userId}` okuma/yazma | ✅ | `uid` eşleşmesi + yazmada anahtar sayısı sınırı (<100) |
| `userData/{uid}/users/{appUserId}` | ✅ | Ara-yol açık kuralı eklendi |
| `.../users/{appUserId}/docs/{docId}` | ✅ | Üst `userId` kontrolü uygulanıyor |
| Kimliksiz erişim | ✅ | `request.auth != null` zorunlu |
| Başka kullanıcı verisi | ✅ | `request.auth.uid == userId` |

---

*Tarihsel ilk denetim ayrıntıları için repo geçmişine bakın
(`git log -- audit-report.md`). Bu dosya artık güncel durumu yansıtır.*
