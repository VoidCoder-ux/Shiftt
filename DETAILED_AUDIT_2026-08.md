# Shiftt — Detaylı Uygulama Denetim Raporu (Ağustos 2026)

Bu rapor, mevcut uygulamanın derinlemesine incelenmesi sonucunda elde edilen bulguları, tespit edilen hataları ve iyileştirme önerilerini içermektedir. Mevcut `PAYROLL_QA_REPORT.md` ve `audit-report.md` dosyalarındaki kapanmış konulara değinilmemiş, sadece açık kalan ve yeni tespit edilen konulara odaklanılmıştır.

## Özet: En Kritik 5 Bulgu

1. **[KRİTİK] İki Farklı Bordro Motorunun Çıktı Çelişkisi:** `calcEarningForMonth` (Kazanç Ekranı / Dashboard) ile `estimatePayrollForMonth` (e-Bordro) motorları farklı varsayımlar ve hesaplama mantıkları kullanmaktadır. Bu durum ekranlar arasında tutarsız (bazen yüzlerce lira fark eden) net kazanç değerlerine yol açmaktadır.
2. **[YÜKSEK] Dini Tatil (RH) Veri Kapsamının Dar Olması:** `RH` (Ramazan ve Kurban bayramı) tablosu sadece 2024-2032 yıllarını kapsamaktadır. Bu aralığın dışındaki geçmiş veya gelecek yıllar için resmi tatil ek mesai hakedişi eksik hesaplanmaktadır.
3. **[YÜKSEK] Veri Yükleme ve Birleştirme (Import/Sync) Çakışma Mantığı:** Buluttan veya yedekten geri yüklenen verilerin birleştirilmesi sırasında (özellikle vardiya vs. izin önceliğinde) aynı tarihteki çakışmalarda potansiyel sessiz ezilmeler yaşanabilir.
4. **[ORTA] Bordro Hesaplamasında Gece Çalışması Primi Tanımsızlığı:** `estimatePayrollForMonth` içinde gece zammı (`nightRate`) eğer undefined/0 olarak bırakılmışsa (varsayılan) gece mesaisi yapılmasına rağmen herhangi bir prim eklenmemekte, ancak buna dair uyarılar yeterince belirgin olmamaktadır.
5. **[ORTA] Uzun Süreli Hesaplamalarda UI Bloklanması:** `runCalc` (Mesai Hesap Makinesi) gibi büyük tarih aralıkları içeren hesaplamalarda `CALC_MAX_DAYS` kısıtlaması olmasına rağmen (366 gün), hesaplamalar ana JS thread'ini bloke ederek mobil cihazlarda donmalara sebep olabilir.

---

## 1. Bordro Hesaplama ve Doğruluk (Öncelik 1)

### [KRİTİK] İki Bordro Hesaplama Motoru Arasındaki Tutarsızlık
- **Konum:** `app.js` -> `calcEarningForMonth` (Satır ~1100) vs `estimatePayrollForMonth` (Satır ~4218)
- **Sorunun Tanımı:** `calcEarningForMonth` daha basit, net tabanlı bir tahmin yaklaşımı güderken; `estimatePayrollForMonth`, tam vergi dilimleri, SGK işçi kesintisi, engellilik indirimi, vergi matrahı aktarımı ve kümülatif net-brüt iterasyonları (`computeNetFromGross`, `findGrossFromNet`) üzerinden gider. Fazla mesai (FM) ve Md.47 (Tatil çalışma) ilaveleri, `calcEarningForMonth` fonksiyonunda **net saatlik ücret** (`hr`) üzerinden doğrudan eklenirken, `estimatePayrollForMonth` fonksiyonunda bu ilaveler **marjinal brüt saatlik ücret** (`hrGross`) üzerinden brüte eklenip daha sonra tekrar vergi dilimine sokulmaktadır (marjinal vergilendirme).
- **Etki (Somut Örnek):**
  - *Senaryo:* Aylık Net: 30,000₺, Fazla Mesai: 20 Saat. %27 vergi diliminde olunan bir ay.
  - *`calcEarningForMonth` (Dashboard):* FM Ücreti = 20s * (30000/225) * 1.5 = 4000 ₺ (Net olarak eklenir, toplam 34,000 ₺).
  - *`estimatePayrollForMonth` (Bordro):* 30,000₺ net = ~42,500₺ brüt. `hrGross` = 42500/225 = 188.88 ₺. FM Brüt = 20 * 188.88 * 1.5 = 5666.66 ₺. Bu brüt %27 GV + SGK + DV'ye girdiğinde ele geçen net ek getiri ~3900₺ civarında olur. (Toplam ~33,900₺).
  - Yani gösterilen "Tahmini Kazanç" ile detaylı "e-Bordro" arasında yaklaşık 100₺ fark oluşur (fazla mesai veya tatil daha fazlaysa bu fark katlanarak büyür).
- **Önerilen Çözüm:** `calcEarningForMonth` fonksiyonunun varlık sebebi performans ve basitlik olsa da, ekranlar arası tutarsızlığı önlemek için, bu motor tamamen kaldırılıp, arka planda asenkron veya hafifletilmiş bir şekilde `estimatePayrollForMonth` (veya ortak bir temel hesaplayıcı) kullanılmalıdır. Performans için sonuçlar bir cache haritasında tutulmalıdır.
- **Tahmini Efor:** L

### [YÜKSEK] Dini Bayramlar (RH) Veri Kapsamı Eksikliği
- **Konum:** `app.js` -> `RH` nesnesi (Satır ~22)
- **Sorunun Tanımı:** Dini tatiller hicri takvime göre değiştiği için statik tanımlanmıştır. Ancak sadece 2024-2032 yılları desteklenmektedir. 2023 veya öncesi bir yıl incelendiğinde ya da 2033 sonrasında uygulama, resmi dini bayramlardaki çalışmaları normal çalışma sayacaktır.
- **Etki:** Hatalı eksik ödeme hesabı. Geçmişe dönük bordro/hakediş kontrolünde çalışan hak kaybı.
- **Önerilen Çözüm:** İki yöntem izlenebilir: 1) Statik veriyi 2010-2050 gibi çok daha geniş bir aralığa yaymak (basit ama veri şişkinliği yaratır). 2) Dini bayramları tahmini olarak hesaplayan basit bir astronomik formül / Hicri takvim dönüştürücü algoritması yazmak, kesin tarihler bilindikçe/yaklaştıkça override mekanizması ile sunmak. En pratik yol 2010-2040 arasını statik doldurmaktır.
- **Tahmini Efor:** S (Veri girişi)

### [ORTA] Eksik Günlerin (Missing Days) Yanlış Orantılanması Riski
- **Konum:** `app.js` -> `estimatePayrollForMonth`
- **Sorunun Tanımı:** Bordro motorunda, takvimde işaretlenmemiş günler (`missingGross`) tabandan düşülmektedir. Ancak şubat aylarında veya 31 çeken aylarda 30 günlük standart sgk matrahı ile fiili takvim günleri (dim) arasında oransal sapmalar oluşabilir. Yasal sınırda şubat ayında eksik gün olduğunda SGK günü (30 - eksik gün) veya (28 - eksik gün) hesaplamaları karmaşıktır ve Türkiye bordro standartlarında uç durumlar yaratır.
- **Önerilen Çözüm:** Türkiye'deki özel eksik gün (Şubat kuralı: 28 çeken ayda 1 gün eksik çalışanın 27 değil, özel bir durum olmazsa 27 sgk bildirilmesi, ancak tam çalışan 30 bildirilmesi) mantığını tam olarak implemente eden bir yardımcı fonksiyon yazılmalıdır.
- **Tahmini Efor:** M

---

## 2. Veri Tutarlılığı ve Firebase (Öncelik 2)

### [YÜKSEK] Offline ve Bulut Sync Arasında Çakışma Yönetimi (Conflict Resolution)
- **Konum:** `app.js` -> `mergePayrollOverridesFromCloud` ve Firestore veri çekme/yazma blokları.
- **Sorunun Tanımı:** Kullanıcı offline iken aynı güne hem vardiya hem izin kaydı girip (veya silip), ardından online olduğunda; başka bir cihazdan gelen verilerle birleştiğinde `updatedAt` bazlı bir LWW (Last Writer Wins) mantığı var. Ancak, uygulamanın içinde `u.shifts` ve `u.leaves` ayrı objeler. Bir cihazda vardiya silinip yerine izin yazılırken, diğer cihazda aynı günün eski vardiyası güncellenirse, senkronizasyon anında aynı günde hem vardiya hem izin bulunabilir. `getMD` içinde bu çakışma (`if (u.shifts && u.shifts[k]) return;` şeklinde izinleri atlayarak) kısmen tolere edilmiş ama veritabanında tutarsız state oluşur.
- **Etki:** Takvimde UI bug'ları, ekranda çakışan göstergeler, gereksiz veritabanı şişkinliği.
- **Önerilen Çözüm:** `mergeUserData` fonksiyonu (eğer Firestore sync tarafındaysa) bir gün için sadece bir temel "aktivite" olmasına zorlamalıdır. Bir kayıt `updatedAt` ile gelirken, diğer koleksiyondaki eşlenik kayıtları da tombstonelamalıdır (deletedShifts / deletedLeaves mekanizmasının daha tutarlı hale getirilmesi).
- **Tahmini Efor:** M

### [ORTA] Evrak/Doküman LocalStorage Şişkinliği
- **Konum:** `app.js` -> `saveDocument` (Satır ~5850)
- **Sorunun Tanımı:** `saveDocument` fonksiyonu, yüklenen belgeleri `base64` olarak (url alanında) `u.documents` dizisine ekler. Firebase bağlı ise oraya yazar, bağlı değilse her şeyi LocalStorage'a kaydeder. LocalStorage kapasitesi tarayıcıya göre ~5MB-10MB'dir. Birkaç 700KB'lık PDF veya resim eklendiğinde LocalStorage sınırı aşılır, uygulama `QuotaExceededError` fırlatarak çöker ve hiçbir veri kaydedilemez hale gelir.
- **Etki:** Offline kullanıcılar için uygulamanın çökmesi (Brick olması).
- **Önerilen Çözüm:** `base64` doküman verileri `LocalStorage` yerine IndexedDB'de (örn. `idb` kütüphanesi kullanarak) tutulmalıdır. `LocalStorage` sadece meta veriler (isim, boyut) için kullanılmalıdır.
- **Tahmini Efor:** M

---

## 3. Güvenlik ve Hata Yönetimi (Öncelik 3)

### [DÜŞÜK] DeepSeek API Anahtarının Session Storage'da Tutulması
- **Konum:** `app.js` -> `saveDeepSeekSettings`
- **Sorunun Tanımı:** Güvenlik açısından `sessionStorage` iyi bir tercih olsa da, tarayıcıda çalışan herhangi bir XSS açığı (ki uygulama şu an bir çok `innerHTML` ataması yapıyor, büyük kısmı `escHtml` ile korunsa da) bu anahtarın çalınmasına olanak tanır.
- **Önerilen Çözüm:** Tam anlamıyla güvenli olması için API isteklerinin kullanıcının kendi tarayıcısından gitmesi yerine bir backend proxy (Cloud Functions vb.) üzerinden gitmesi önerilir. Ancak mevcut sunucusuz mimari (PWA) dikkate alındığında, bu risk "kabul edilebilir" olarak nitelendirilebilir.
- **Tahmini Efor:** L (Risk kabul edilirse efor yok)

### [ORTA] innerHTML Kullanımı ve XSS Riskleri
- **Konum:** Genel (örn. `renderBordroPreview`, `renderTeamView`, vb.)
- **Sorunun Tanımı:** Uygulamada UI render edilirken büyük oranda template string'ler ve `innerHTML` kullanılıyor. Değişkenlerin çoğu `escHtml`'den geçirilse de (`escHtml(doc.name)` vb.), bazı alanlar doğrudan sayılar sayılarak veya "güvenilir" varsayılarak birleştirilmiş.
- **Etki:** Yeni bir alan eklendiğinde geliştiricinin `escHtml`'i unutması durumunda kalıcı XSS zafiyeti oluşabilir.
- **Önerilen Çözüm:** Uzun vadede uygulamanın React, Preact veya Vue gibi bir Sanal DOM framework'üne geçirilmesi güvenliği mimari olarak çözer. Şimdilik `escHtml` kullanımının eksik olduğu yerler sıkı denetlenmelidir.
- **Tahmini Efor:** L (Manuel denetim için)

---

## 4. UI/UX ve Performans (Öncelik 4)

### [ORTA] Ağır DOM Manipülasyonları
- **Konum:** `app.js` -> `renderDash`, `renderCal` vb. ana render fonksiyonları
- **Sorunun Tanımı:** Uygulamanın mimarisi, en ufak bir veri değişikliğinde (örneğin takvimde bir gün seçildiğinde veya yıl değiştirildiğinde) `renderActivePage` (ve bazen `renderAll`) fonksiyonunu çağırarak tüm DOM ağacını baştan oluşturuyor.
- **Etki:** Eski cihazlarda ekran geçişleri ve etkileşimler sırasında takılma (jank) hissedilmesi.
- **Önerilen Çözüm:** Vanilla JS ile DOM diffing yapmak zordur. Sadece değişen kısmın içeriğini güncelleyecek spesifik `updateX` fonksiyonları yazılmalı veya mevcut `_debouncedUpdResult` gibi debounce/throttle stratejileri daha geniş alana yayılmalıdır.
- **Tahmini Efor:** L

### [ORTA] AI Chat Scroll Davranışı
- **Konum:** `app.js` -> `submitAIQuestion`
- **Sorunun Tanımı:** Kullanıcı AI'a bir soru sorduğunda, DOM'a yeni mesaj ekleniyor ve en alta kaydırma (`log.scrollTop = log.scrollHeight`) yapılıyor. Ancak cevap bir ağ isteği gerektirdiğinde (`askDeepSeek`) asenkron yanıt geldikten sonra metin boyutu büyüyebilir veya resim vb. içerebilir.
- **Etki:** Asenkron cevap sonrası içerik uzun olursa ekran kaydırma eksik kalır ve kullanıcı cevabın sonunu görmek için elle kaydırmak zorunda kalır.
- **Önerilen Çözüm:** `askDeepSeek` Promise'i `resolved` olduktan ve metin atandıktan *sonra* da bir `log.scrollTop = log.scrollHeight` çağrısı (gerekirse kısa bir timeout veya `requestAnimationFrame` ile) yapılmalıdır.
- **Tahmini Efor:** S

---

## Analiz Edilmeyen / Kapsam Dışı Bırakılan Konular

1. **Firestore.rules İncelemesi:** Firebase bulut kuralları `firestore.rules` dosyasındadır, ancak bu rapor `app.js` içindeki istemci tarafı iş mantığına odaklanmıştır. (Önceki raporda bu kısmen onaylanmıştır).
2. **PWA Kurulum (Manifest/SW) Davranışları:** Daha önceki denetimde `sw.js` ve manifest durumları "opsiyonel" olarak raporlandığı için, cache mekanizmasının tarayıcı içi davranışları bu raporda test edilmemiştir.
3. **PDF ve Excel İhracat Düzenleri:** `jsPDF` ve `autoTable` kütüphanelerinin oluşturduğu PDF ve CSV dosyalarının görsel formatlama / hizalama ve basılı çıktı kaliteleri manuel bir doğrulama gerektirdiği için kod üzerinden analiz edilmemiştir.

---

## Sonraki Adımlar / Opsiyonel (PWA ve Çevre İyileştirmeler)

Bu iyileştirmeler, çekirdek özellikler istikrara kavuştuktan sonra değerlendirilebilir:
- **PWA-01:** Manifest'te daha fazla boyutlu ikonlar (`144x144`, `384x384`) sağlamak.
- **PWA-02:** Kullanıcıların uygulamayı App Store/Google Play algısıyla yükleyebilmesi için `manifest.json`'a uygulama ekran görüntüleri (`screenshots`) eklemek.
- **PWA-03:** Google Fonts performansını artırmak için `<link>` etiketlerine `crossorigin` özniteliğini eklemek.
