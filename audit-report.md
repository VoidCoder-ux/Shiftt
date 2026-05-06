# Shiftt Uygulama Denetim Raporu
**Tarih:** 2026-05-06  
**Denetçi:** Claude Code  
**Repo:** https://github.com/VoidCoder-ux/Shiftt  
**Denetlenen Dosyalar:** index.html (13 002 satır, 644 KB), sw.js (72 satır), manifest.json, firestore.rules

---

## Özet Skoru

| Kategori | Durum | Kritik Sorun Sayısı |
|---|---|---|
| JavaScript Hataları | 🟡 | 1 |
| Firebase Güvenliği | 🟡 | 1 |
| Service Worker | 🟢 | 0 |
| Güvenlik | 🔴 | 2 |
| Görsel/UI | 🟡 | 2 |
| PWA Kalitesi | 🟡 | 2 |
| Erişilebilirlik (A11y) | 🔴 | 2 |

---

## Kritik Hatalar (🔴 Hemen Düzeltilmeli)

### [SEC-01] Firebase Kimlik Bilgileri Genel Repoda Açıkça Yazılı
**Dosya:** `index.html` — Satırlar 10141–10146

```js
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyClbILaI24aeB8yL-9Pdf6YWgrc7PRJGKo",   // ← gerçek anahtar
  authDomain: "shift-a50d2.firebaseapp.com",
  projectId: "shift-a50d2",
  ...
  measurementId: "G-3REEMPWMP9"
};
```

**Risk:**  
- Herkes bu kimlik bilgilerini kullanarak Firebase Auth servisine karşı kaba kuvvet saldırısı, e-posta doğrulama spam'i veya Analytics kotası tüketimi gerçekleştirebilir.  
- Firestore kuralları veri güvenliğini sağlıyor olsa da API anahtarı; Firebase Storage, Firebase Hosting, ML Kit gibi diğer servislere kötüye kullanım kapısı açar.  
- Git geçmişinde kalıcı olarak saklandığından tek başına silmek yetmez.

**Önerilen Düzeltme:**  
1. Firebase Console → Proje Ayarları → API Anahtarları → Anahtar için HTTP Referrer kısıtlaması ekle (yalnızca kendi domain'ine izin ver).  
2. `apiKey` değerini environment variable veya sunucu tarafı config endpoint'inden okuyacak şekilde yeniden yaz.  
3. `git filter-repo` veya BFG Repo Cleaner ile tüm git geçmişinden temizle.

---

### [SEC-02] Content Security Policy (CSP) Tanımlı Değil
**Dosya:** `index.html` — `<head>` bölümü

**Risk:**  
- XSS güvenlik açığı bulunması ya da CDN kaynaklarından biri ele geçirilmesi durumunda kötü amaçlı scriptler kısıtlama olmaksızın çalışır.  
- `object-src 'none'` olmadığından Flash/plugin tabanlı saldırılar da mümkündür.

**Uygulanan Otomatik Düzeltme:** ✅ CSP meta etiketi eklendi (bkz. "Düzeltmeler" bölümü).  
**Uyarı:** Mevcut uygulama çok sayıda inline script ve `onclick` handler kullandığından `unsafe-inline` zorunluydu. Uzun vadede nonce tabanlı CSP'ye geçilmeli.

---

### [A11Y-01] Icon-Yalnız Düğmelerde ARIA Etiket Eksikliği
**Dosya:** `index.html` — Satırlar 3418–3425

Topbar düğmelerinin yalnızca `title` niteliği vardı; `title` fare ile hover yapıldığında tooltip gösterir ancak ekran okuyucular `aria-label` arar.

**Uygulanan Otomatik Düzeltme:** ✅ `aria-label` nitelikleri eklendi.

---

### [A11Y-02] Çok Düşük ARIA Kapsama Oranı
**Dosya:** `index.html` — Genel

- 145+ etkileşimli öğe (buton/link) için yalnızca **2** `aria-label` niteliği tanımlıydı.
- Nav sekmeleri zaten metin içerdiği için sorunsuz; ancak açılır menü, modal kapat düğmeleri, form alanları için ARIA eksik.

**Önerilen Düzeltme:**  
```html
<!-- Kötü -->
<button onclick="closeM()"><i class="fas fa-times"></i></button>

<!-- İyi -->
<button onclick="closeM()" aria-label="Kapat"><i class="fas fa-times"></i></button>
```

---

## Orta Seviye Uyarılar (🟡 Yakın Zamanda Düzeltilmeli)

### [JS-01] `init()` İçindeki `document.addEventListener` Kırılgan Yapı
**Dosya:** `index.html` — Satır ~5404

`document.addEventListener('keydown', ...)` çağrısı `init()` fonksiyonu içinde. Şu an `init()` bir kez çağrılıyor (satır 11927) ancak gelecekte iki kez çağrılırsa klavye dinleyicileri üst üste eklenir.

**Önerilen Düzeltme:**
```js
// Kötü (init içinde)
document.addEventListener('keydown', e => { ... });

// İyi (init dışında, tek kez)
function setupKeyboardShortcuts() { ... }
// Modül başında çağır: setupKeyboardShortcuts();
```

---

### [FIREBASE-01] Firestore Rules — Sub-Collection Kapsama Kontrolü
**Dosya:** `firestore.rules`

```
match /userData/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;

  match /users/{appUserId}/docs/{docId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
}
```

- Ana veri (`userData/{uid}`) ve belge sub-collection'ları (`userData/{uid}/users/{S.cu}/docs/{docId}`) kural kapsamında. ✅  
- **Ancak:** `userData/{uid}/users/{appUserId}` seviyesindeki koleksiyona ait dökümanlar (ara yol) için açık bir kural yok. Bu collection'ı doğrudan okumak kural reddi alır; kod şu an yalnızca alt seviyeyi okuduğu için sorun çıkmıyor ama kırılgan.

**Önerilen Düzeltme:**
```
match /userData/{userId}/users/{appUserId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

---

### [JS-02] DeepSeek API Anahtarı localStorage'da Kalıcı Saklanabiliyor
**Dosya:** `index.html` — Satır ~5052

Kullanıcı "Hatırla" seçeneğini işaretlerse API anahtarı `localStorage`'a yazılıyor. `localStorage` sayfadaki tüm JavaScript'e açık; potansiyel XSS saldırısında anahtar çalınır.

**Önerilen Düzeltme:** `sessionStorage` yeterlidir veya anahtar asla tarayıcıda saklanmamalı; sunucu tarafı proxy tercih edilmeli.

---

### [SW-01] Service Worker ve HTML Cache Sürüm Numaraları Uyumsuz
**Dosya:** `sw.js` satır 1 vs `index.html` satır 10

```js
// sw.js
const CACHE_NAME = 'shifttrack-v20';

// index.html
var CV = 'stv15';
```

Bu iki sürüm bağımsız izleniyor. SW'yi güncelleyip HTML cache buster'ı güncellememek (veya tersi) tutarsız cache durumuna yol açar.

**Önerilen Düzeltme:** Tek bir `APP_VERSION` sabitini hem SW hem de HTML'den kullan.

---

### [CSS-01] Tüm CSS ve JS Tek HTML Dosyasında İnline
**Dosya:** `index.html`

644 KB'lık tek dosya — herhangi bir değişiklikte tamamı yeniden indirilir. Service Worker cache'in etkisi azalır.

**Önerilen:** CSS → `style.css`, JS → `app.js` olarak ayır; SW cache'ini ayrı dosyalar için konfigure et.

---

### [UI-01] `<label for="...">` Bağlantısı Yok
**Dosya:** `index.html` — Form alanları

Form label metinleri görsel olarak doğru; ancak hiçbiri `for="inputId"` niteliği içermiyor. Bu, tıklanabilir label desteğini ve ekran okuyucu eşleşmesini kırar.

```html
<!-- Kötü -->
<label class="bordro-label">Net Ücret</label>
<input id="eb-net" ...>

<!-- İyi -->
<label class="bordro-label" for="eb-net">Net Ücret</label>
<input id="eb-net" ...>
```

---

### [UI-02] `<script>` Etiketlerinde `defer`/`async` Yok
**Dosya:** `index.html` — Satırlar 32–40

5 harici CDN script'i `<head>` içinde `defer` veya `async` olmadan yükleniyor. Tarayıcı HTML ayrıştırmasını durdurup bu scriptleri sırayla yükler → ilk boyamanın gecikmesi.

```html
<!-- Kötü -->
<script src="https://cdnjs.cloudflare.com/.../jspdf.umd.min.js" ...></script>

<!-- İyi — ancak ana script de DOMContentLoaded'a bağlanmalı -->
<script defer src="https://cdnjs.cloudflare.com/.../jspdf.umd.min.js" ...></script>
```

**Not:** Ana inline script `<body>` içinde (satır 3862) ve `init()` doğrudan çağrıldığından bu değişiklik önce `init()`'in `DOMContentLoaded` ile sarılmasını gerektiriyor.

---

## Küçük İyileştirmeler (🟢 Yapılabilirse)

### [PWA-01] manifest.json Icon Boyutları Eksik
72, 96, 128, 144, 152, 384 px boyutları yok. `purpose: "maskable"` da eksikti.  
**Uygulanan Otomatik Düzeltme:** ✅ Mevcut ikonlara `"purpose": "any"` ve ayrı `"purpose": "maskable"` entry'leri eklendi. Gerçek boyutlardaki PNG dosyaları oluşturulmalı.

### [PWA-02] manifest.json — `shortcuts` ve `screenshots` Eksik
Modern PWA'larda ev ekranı kısayolları ve mağaza ekran görüntüleri destekleniyor.

### [SEC-03] Harici Anchor Taglerinde `rel="noopener noreferrer"` Yok
Yeni sekme açan linklerde `rel="noopener noreferrer"` eklenmelidir.

### [CSS-02] Hard-coded Renkler CSS Değişken Sisteminin Yanında Kullanılmış
Bazı inline style'larda `color:#fff` gibi sabit değerler var. CSS değişken sistemi (`:root` içinde tanımlı) kapsamlı ve sağlam; tüm renklerin bu sisteme taşınması önerilebilir.

### [PWA-03] Google Fonts Link Etiketi — `crossorigin` Eksik
```html
<!-- Mevcut -->
<link href="https://fonts.googleapis.com/css2?..." rel="stylesheet">

<!-- Önerilen -->
<link href="https://fonts.googleapis.com/css2?..." rel="stylesheet" crossorigin="anonymous">
```

### [PERF-01] 644 KB Tek HTML Dosyası
Build aracı (örneğin Vite) ile kod bölme, tree-shaking ve minification uygulanmalı.

---

## Otomatik Uygulanan Düzeltmeler

| # | Dosya | Değişiklik |
|---|---|---|
| 1 | `index.html` | CSP meta etiketi eklendi (`<head>`) |
| 2 | `index.html` | Topbar icon düğmelerine `aria-label` eklendi (Bildirimler, Kısayollar, Geri Al, Çıkış) |
| 3 | `manifest.json` | `purpose: "any"` ve `purpose: "maskable"` icon entry'leri eklendi; `categories` eklendi |
| 4 | `sw.js` | Navigate fallback'te `caches.match` null döndürdüğünde `503 Offline Response` döner — TypeError önlendi |
| 5 | `sw.js` | Assets fallback'te aynı null Response fix'i uygulandı |

---

## Düzeltme Önerileri — Kod Örnekleriyle

### FIX-1: Form Label For Bağlantıları

```html
<!-- ÖNCE -->
<div class="bordro-form-group">
  <label class="bordro-label">SGK Matrahı</label>
  <input id="eb-sgk" class="bordro-input" type="number">
</div>

<!-- SONRA -->
<div class="bordro-form-group">
  <label class="bordro-label" for="eb-sgk">SGK Matrahı</label>
  <input id="eb-sgk" class="bordro-input" type="number">
</div>
```

### FIX-2: Firebase Kısıtlaması (Firebase Console)
```
Firebase Console → Proje Ayarları → API ve hizmetler → Kimlik bilgileri
→ Browser key → Uygulama kısıtlamaları → HTTP referans adresleri
→ https://yourdomain.com/*  ekle
```

### FIX-3: CSP Nonce'a Geçiş (Uzun Vadeli)
```html
<!-- Sunucu tarafında rastgele nonce üret -->
<meta http-equiv="Content-Security-Policy"
  content="script-src 'nonce-{RANDOM_NONCE}' https://cdnjs.cloudflare.com ...">

<script nonce="{RANDOM_NONCE}">
  // tüm inline JS buraya
</script>
```

### FIX-4: Modal Kapat Düğmelerine ARIA
```html
<!-- Tüm modal X butonları için örnek -->
<!-- ÖNCE -->
<button class="modal-x" onclick="closeM()"><i class="fas fa-times"></i></button>

<!-- SONRA -->
<button class="modal-x" onclick="closeM()" aria-label="Modalı Kapat">
  <i class="fas fa-times" aria-hidden="true"></i>
</button>
```

### FIX-5: SW Sürüm Senkronizasyonu

```js
// sw.js — üste ekle
const APP_VERSION = 'v20';
const CACHE_NAME = 'shifttrack-' + APP_VERSION;
```

```js
// index.html — cache buster script
var CV = 'v20'; // sw.js APP_VERSION ile eşleştir
```

---

## Firestore Güvenlik Değerlendirmesi

Mevcut kurallar için değerlendirme:

| Kural | Durum | Not |
|---|---|---|
| `userData/{userId}` okuma/yazma | ✅ Güvenli | `uid` eşleşmesi zorunlu |
| `users/{appUserId}/docs/{docId}` | ✅ Güvenli | Üst `userId` kontrolü miras alınıyor |
| Kimliksiz erişim | ✅ Engellenmiş | `request.auth != null` zorunlu |
| Başka kullanıcının verisini okuma | ✅ Engellenmiş | `request.auth.uid == userId` |
| Eksik ara-yol kuralı | 🟡 Uyarı | `users/{appUserId}` dökümanı için açık kural yok |

---

*Rapor sonu — Toplam 5 otomatik düzeltme, 12 manuel öneri.*
