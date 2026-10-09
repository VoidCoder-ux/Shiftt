# Shiftt — Maaş/Bordro QA Raporu

**Tur 2 · Temmuz 2026** — Bu rapor, önceki turun ("Tur 1") sonuçlarının yerini alır.

> **Tur 1 hakkında not.** Önceki rapor "35 bulgu / 35 düzeltildi / 0 beklemede" diyordu.
> Bu tur, o iddianın doğrulanamadığını gösterdi: kapatılmış sayılan en az üç madde
> (e-Bordro ↔ Net Özet eksik gün farkı, export'ta SGK-muaf kalem eksikliği,
> `payrollHourBasis` ile `monthlyHours` çelişkisi) açık kalmıştı. Nedeni yöntemseldi —
> Tur 1'in uç durum tablosu her fonksiyonu **izole** sınıyordu; **iki hesap yolunun
> birbiriyle tutarlılığını** hiç sınamıyordu. Bu turda bulunan kritiklerin çoğu tam
> olarak o boşluktaydı.

## Genel Durum

**36 tekil bulgu.** 1 BLOKE, 9 KRİTİK, 14 ORTA, 12 DÜŞÜK.
**Kapatılan: 36.** Açık kalan: 1 (veri kapsamı — dini tatil tablosu 2024–2032).

> **Tur 3 eki · Ekim 2026.** Önceki turun "bilinçli erteleme" olarak bıraktığı
> madde (FM/Md.47 net etkisi iki motorda farklı) **kapatıldı**; ayrıca ertelemenin
> yanında duran ikinci bir sapma (FM brüt saat ücretinin ekranda `monthlyHours`
> ile hesaplanması) bulunup düzeltildi. Ölçüm: net 43.200 ₺'de 6 aylık sapma
> **965,19 ₺ → −0,01 ₺**. 672 senaryoluk mod×maaş×ay×vardiya taramasında aylık
> ücretli modda ortalama sapma **1.010,97 ₺ → 0,07 ₺** (0 regresyon) ve bordro
> motoru çıktısı 672 senaryonun hiçbirinde değişmedi (geri besleme yok).
> Ayrıntı: aşağıdaki "Tur 3 Eki" bölümü.

Baskın kusur sınıfı tekti: **aynı büyüklüğün iki ayrı motorla hesaplanması.**
`calcEarningForMonth` (ekran tahmini) ile `estimatePayrollForMonth` (bordro) farklı
taban, farklı gün sayısı ve farklı saat ücreti kullanıyordu; buna e-Bordro'nun kendi
üçüncü kalem motoru ekleniyordu. Bulguların yarıdan fazlası bu kökten geliyordu.

## Yöntem

Dört bağımsız denetim şeridi (formül, alan/girdi, tutarsızlık, uç durum)
`tests/loader.mjs` üzerinden **gerçek `app.js` fonksiyonlarını** DOM/Firebase olmadan
izole sandbox'ta koşturdu. Her bulgu sayısal olarak kanıtlandı; doğrulanamayan şüpheler
bulgu olarak raporlanmadı. 124 açık iddia + 400 senaryoluk fuzz taraması yürütüldü.

Regresyon testi: **68 test** (`npm test`); Tur 2 başında 25, Tur 2 sonunda 66 idi.

## Özet Tablo

| Şiddet | Bulgu | Kapatıldı | Açık |
|---|---:|---:|---:|
| BLOKE  | 1  | 1  | 0 |
| KRİTİK | 9  | 9  | 0 |
| ORTA   | 14 | 14 | 0 |
| DÜŞÜK  | 12 | 12 | 0 |
| **Toplam** | **36** | **35** | **1** |

---

## BLOKE

**SGK tavanı override sonrası kayboluyor; kesintiler sıfırlanıyor.**
`_withSgkCeiling` tavanı `Object.defineProperty` ile **enumerable olmayan** getter
olarak tanımlıyor, nöbetçi bayrağını (`_withCeiling`) normal alan olarak yazıyordu.
`payrollCfg`'nin override dalındaki `Object.assign` bayrağı kopyalıyor, getter'ı
kopyalamıyordu; sonraki çağrı bayrağı dolu görüp erken dönünce `cfg.sgkCeiling`
`undefined` kalıyordu.

Zincir: `Math.min(x, undefined)` → `NaN` → `_bordroRound2(NaN)` → `0`.
Sonuç: SGK matrahı 0, SGK ve işsizlik kesintisi 0, GV matrahı tam brüt.

```
brüt 60.000 → net 47.356,63  (sağlam)
brüt 60.000 → net 56.060,25  (bozuk, +8.703,62)
```

Tetikleyici pratikte kaçınılmazdı: paylaşılan `payrollConfigByYear[yıl]` nesnesi
override yokken zaten damgalanıyor, dolayısıyla herhangi bir yıl için parametre
kaydeden ya da başka cihazdan override senkronu alan herkes etkileniyordu.

**Düzeltme:** tavan düz (enumerable) alan; `_deriveSgkCeiling` her çağrıda yeniden
türetiyor (override `minWageGross`'u değiştirirse eski değer yapışmasın); dört okuma
noktası `_sgkCeilingOf()` üzerinden geçiyor — tavan eksik kalırsa matrahı sıfırlamak
yerine "tavansız" davranıyor, yani hata yönü eksik kesinti değil tam kesinti.

---

## KRİTİK

### Tek net motoru (4 bulgu)

| Bulgu | Ölçülen etki | Düzeltme |
|---|---|---|
| Aylık ücretlide taban `ay günü × (net/30)` | Şubat −4.000 ₺, Ocak +1.440 ₺; ekran bunu "Tam ay" etiketiyle sunuyordu | 30 gün esası (4857/32). Saatlik sözleşmede gerçek ay günü korundu |
| Yevmiyede işaretsiz günler ekranda ücretli, bordroda değil | Panel ile Kazanç 14.400 ₺ ayrışıyordu | Ekran da aynı politikayı uyguluyor; Panel doğrudan bordro motorunu okuyor |
| e-Bordro "auto" eksik günleri düşmüyor | 5 eksik günde 9.256 ₺, 10 günde 18.512 ₺ | Eksik gün ayrı kalem; önizleme, PDF, JSON, XML'de görünüyor |
| e-Bordro G-Net ön dolumu ücretli izin günlerini atlıyor, Md.47 için `hdw` kullanıyor | 3 gün yıllık izinli ayda 3.600 ₺ | Ön dolum ödenen gün-eşdeğeri ayrıştırmasıyla aynı; `hpd` kullanılıyor |

### Sessiz veri/parametre bozulmaları (3 bulgu)

- **İçe aktarmada `name` tip denetimsiz.** Sayı/obje bir ad
  `(u.name || 'K')[0].toUpperCase()` ifadesini patlatıyor; çöküş `saveLS()`'ten
  **sonra** olduğu için bozuk kayıt yazılmış oluyor ve sonraki açılışta `init()` aynı
  noktada çöküyordu — uygulama kalıcı olarak kullanılamaz hale geliyordu.
  → `_safeUserName()` ile `normalizeUserCalculations`'a alındı (localStorage, import ve
  bulut merge yollarının hepsini kapsar).
- **`JSON.stringify(Infinity) === "null"`.** En üst gelir vergisi dilimi
  `upTo: Infinity` ile tanımlı olduğundan, override kaydedilip sayfa yenilendiğinde
  dilim `null` okunuyor ve `=== Infinity` kontrolüne dayanan kod en üst dilimin
  vergisini hiç uygulamıyordu (8M ₺ matrahta 1.480.000 ₺).
  → Açık sentinel ile kalıcılaştırma; eski `null` kayıtlar da geri okunuyor.
- **`Number('') === 0`.** Boş bırakılan bordro parametresi `undefined` değil `0`
  dönüyor, SGK/işsizlik/damga oranı 0 olarak kalıcılaşıyor ve doğrulama 0'ı aralık
  içinde bulup uyarmıyordu; sonuç buluta yayılıyordu.
  → Boş alan `undefined` dönüyor; sıfır oranlar açıkça uyarılıyor.

### Zam Simülatörü (2 bulgu)

- **"Mevcut Net" bordro motorundan sapıyordu.** Simülatör kendi projeksiyon formülünü
  kullanıyordu: taban 30 güne kilitli, tatil günü çift sayılmış, FM saat ücreti
  marjinal yerine ortalama brütten, SGK-muaf ek kazanç ve TSS muafiyeti yok sayılmış,
  devreden matrah yalnızca elle girilmiş değerden okunuyordu. Tipik ayda ~5.046 ₺
  sapma. Ayrıca UI kendi içinde tutarsızdı: "Mevcut Brüt" 30 günlük tabanı, "Mevcut
  Net" o tabanın üstüne ayın FM/tatil kalemleri eklenmiş hâlini gösteriyordu.
  → Simülatör hem baz çizgiyi hem projeksiyonu `estimatePayrollForMonth`'tan alıyor;
  UI taban ile dönem netini ayrı ve etiketli gösteriyor.
- **Baz çizgi cache'i ayar değişimlerini görmüyordu** (ilk düzeltmenin regresyonu).
  Anahtar muafiyetleri, FM katsayısını, saat esaslarını ve devreden matrahı
  kapsamıyordu; %0 zamda 5.361 ₺ "hayalet zam" görünüyordu.
  → `_rsCacheKey()` tüm girdileri kapsıyor; `invalidateMDCache()` cache'i düşürüyor.

---

## ORTA (14)

**Tutarsızlık:** 270 saat/yıl sınırı üç yerde iki farklı sonuç veriyordu (Panel "sorun
yok", Kazanç "240 saat aşım") — sınır 4857/41 gereği yalnızca fazla **çalışmaya** (%50)
aittir, üç nokta da `oh` kullanıyor · Panel'in FM kartı kendi ücretini hesaplıyor ve
yalnız `oh` sayıyordu (50s vs 25s) · "Çalışan Hak Kontrolü" kartında yan yana iki farklı
"beklenen net" · `_eBordroSession` puantaj/ayar/senkron sonrası invalide edilmiyordu ·
e-Bordro'da elle düzeltilen devreden matrah hiçbir yere yazılmıyordu.

**Güvenlik/veri:** Belge yüklemede uzantı **veya** MIME kontrolü yeterliydi; `.pdf` adlı
`text/html` bir dosya blob iframe'de aynı-origin script çalıştırabiliyordu (artık ikisi
de uygun olmalı + `dataUrlToBlob` allowlist) · `parseDS` yıl sınırı yoktu, aralık dışı
anahtar `dsToDate` ile bugüne düşüp o haftanın FM'ine yazılıyordu (1970–2100) · Silme
kaydı uygulaması `<=` idi, aynı milisaniyede yazılan kayıt sessizce siliniyordu (`<`).

**Hesap doğruluğu:** `startDate` bordro yoluna hiç girmiyordu; ay içi işe girişte giriş
öncesi hafta sonları ücretli sayılıyordu (16 Mart girişte 4,5 gün) · AI kazanç tahmini
zaten tam ay olan tabanı bir kez daha ay ilerlemesine bölüyordu (%29 şişme) · Tanımsız
bordro yılı "en yeni" yıla düşüyordu (2023 → 2026 parametreleri, brüt 60.000'de ayda
~1.760 ₺) · Yıllık izin hakkı tarih düzenlemesinde yasal minimuma eziliyordu · Mesai
hesap makinesinde tarih aralığı sınırsızdı (~384 toast, arayüz kilitleniyordu).

---

## DÜŞÜK (12)

Kapatılanlar: export'ta SGK-muaf kalem satırı ve TOPLAM BRUT eksikliği · hafta tatili
gün sayısının 0 yazılması · `savePayrollOverride`'ın yazma hatasında belleği geri
almaması · vergi dilimi üst sınırında TR binlik formatı (`"158.000"` → 158) · fallback
yıl bayrağının export'a yazılmaması · `goalHours` üst sınırı · e-Bordro alanlarında HTML
`max` eksikliği · `toast`/`showConfirm` çağrılarında çift kaçış (`Ahmet&#39;s`) ·
`sName` uzunluk sınırı · `parseTime`'ın hex/üstel gösterimi kabul etmesi
(`'0x8:00'` → 480) · `_bordroMinWageTaxableBase`'in aya özel asgari ücreti yıllık değere
geri kırpması (yıl içi zamda istisna eksik hesaplanırdı).

**Açık kalan:** Dini tatil tablosu (`RH`) yalnızca 2024–2032 kapsıyor; kapsam dışı
yıllarda Md.47 tatil ilave ücreti sessizce ödenmiyor (2023 Ramazan senaryosunda
2.880 ₺). Uyarı mekanizması çalışıyor ama hesap eksik kalıyor. Tabloyu genişletmek veya
hicri takvim üreticisi eklemek gerekiyor — veri işi, kod işi değil.

---

## Bilinçli Erteleme

**FM ve Md.47 ilave kalemlerinin vergilendirilmesi.** Taban artık iki motorda hizalı,
ama ekran bu kalemleri **net** birim ücretle ekliyor; bordro **brüt** ekleyip marjinal
vergiye tabi tutuyor. 20 saat FM'de sapma ~297 ₺ (kalemin %11,5'i).

`tests/engineparity.test.mjs` içindeki **"bilinen açık fark"** testi, maddenin
kapatılmasıyla **parite testine çevrildi**: artık 6 maaş seviyesi × 5 ay için
`ekran totalEarning = bordro net` (±1 ₺) doğruluyor. Yanına iki regresyon kilidi
eklendi: (1) ilave netin brütten küçük olması ve net-birim-ücret çarpımına EŞİT
OLMAMASI, (2) FM brüt saat ücretinin `monthlyHours`'tan bağımsız olması.

**KAPATILDI (Tur 3 eki, Ekim 2026).** Kapatma, öngörülen "ortak gün-muhasebesi
yardımcısı + bordro cache'i" yolunu GEREKTİRMEDİ; o yol gerçekten döngü yaratıyordu.
Daha dar bir müdahale yeterli oldu: ilaveler kazanç motorunun İÇİNDE brütleştirilip
`findGrossFromNet` + `computeNetFromGross` ile netleştiriliyor. Bu iki fonksiyon saf
brüt↔net matematiği; bağımlılık taramasıyla doğrulandı ki kazanç ya da bordro motoruna
bağlı **değiller**, dolayısıyla çağrı zinciri tek yön kalıyor ve döngü oluşmuyor.
Devreden GV matrahı ise bordro motorundan kazanç motoruna `opts.priorYTDMatrah` ile
AŞAĞI geçiriliyor (yukarı delegasyon yok). Cache de gerekmedi: ay başına yalnız iki
ek ikili arama ekleniyor ve `estimatePayrollForMonth`'un çıktısı değişmediği için
(672 senaryoda doğrulandı) bordro tarafında ek yük yok.

**Politika kararı (kapalı):** Yasal saat esası tüm sözleşmelerde **225** sabit kalır
(Yargıtay 9.HD: 30 gün × 7,5 saat). `weeklyContractHours` yalnızca %25/%50
sınıflandırmasında kullanılır, saat ücretini değiştirmez. `getPayrollHourBasis`'teki
kullanılmayan `u` parametresi bu yüzden bilinçli olarak duruyor.

---

## Regresyon Kontrol Listesi

- [x] Bordro parametresi kaydet → tüm ekranlarda SGK kesintisi korunuyor
- [x] Taban ücret 28/29/30/31 günlük aylarda sabit (aylık ücretli)
- [x] Yevmiye modunda Panel = Kazanç "Net Özet" = Zam Simülatörü dönem neti
- [x] Eksik günlü ayda e-Bordro = Net Özet
- [x] Ay içi işe girişte giriş öncesi günler ödenmiyor
- [x] Bozuk `name` içeren yedek içe aktarma uygulamayı kilitlemiyor
- [x] En üst vergi dilimi sayfa yenilemesinden sonra da uygulanıyor
- [x] Boş bordro parametresi 0 olarak kaydedilmiyor
- [x] `.pdf` adlı `text/html` dosya reddediliyor
- [x] Aralık dışı tarih anahtarları eleniyor
- [x] Tanımsız yıl en yakın tanımlı yıla düşüyor ve bayrak taşıyor
- [x] FM/Md.47 net etkisi iki motorda aynı (Tur 3 eki — aylık ücretli modda ±0,07 ₺)
- [x] FM brüt saat ücreti `monthlyHours` ayarından etkilenmiyor (yasal esas 225)
- [x] Geçersiz tarih anahtarı `dsToDate`'te bugüne düşmüyor (null döner)

---

## Tur 3 Eki — Ekim 2026

Üç bulgu; üçü de kapatıldı.

### 1. İlave kalemler ekranda net birim ücretle ekleniyordu (ORTA → kapatıldı)

Tur 2'nin "bilinçli erteleme"si. Ekran Md.47 tatil ilavesini `gün × net günlük ücret`,
fazla mesaiyi `saat × net saatlik ücret` olarak ekliyordu. Dayandığı varsayım kodun kendi
yorumunda yazılıydı: *"brüt extra ₺1.930,31 → marjinal vergi sonrası net = tam ₺1.380 = dr"*.
Bu eşitlik yalnızca **tek bir maaş ve tek bir vergi diliminde** doğru; başka dilimlerde
marjinal oran değiştiği için ekran eline geçecekten fazlasını gösteriyordu.

Ölçüm (net 43.200 ₺, hafta içi 09:00–17:30):

| Ay | Önce (ekran−bordro) | Sonra |
|---|---:|---:|
| 2025 Ocak | +117,11 | −0,01 |
| 2025 Nisan | +234,21 | 0,00 |
| 2025 Mayıs | +234,21 | 0,00 |
| 2025 Ekim | +230,91 | −0,02 |
| 2026 Ocak | +148,75 | +0,02 |
| **6 ay toplam** | **+965,19** | **−0,01** |

Yevmiye modu istisnası korundu: o modda Md.47 ilavesi net tabanın içindedir
(bordro motoru da `holGross = 0` diyor), marjinal vergiye tabi değildir.

### 2. FM brüt saat ücreti yanlış saat esasından alınıyordu (ORTA → kapatıldı)

Ekran `getMonthlyHours(u)` (kullanıcının ayarlanabilir aylık saat hedefi), bordro
`getPayrollHourBasis` (yasal 225) kullanıyordu. Kullanıcı `monthlyHours`'u 225'ten
farklı ayarladığı anda iki motor farklı FM saat ücreti üretiyordu. Bu, dosyanın kendi
**[POLİTİKA FM-SAAT-ESASI]** kararına da aykırıydı: yasal saat esası tüm sözleşmelerde
sabittir, `monthlyHours` saat ücretini değiştirmez. Varsayılan 225 olduğu için etki
yalnızca ayarı değiştiren kullanıcılarda görünüyordu — bu yüzden Tur 2'de yakalanmadı.

### 3. `dsToDate` geçersiz tarihte sessizce BUGÜNE düşüyordu (DÜŞÜK → kapatıldı)

`dsToDate('2026-02-30')` bugünün tarihini döndürüyordu. Canlı bir hata değildi —
normalize aşaması bozuk anahtarları siliyor — ama savunma tek bir yukarı-akış noktasına
bağlıydı. Tur 2'deki test adı (*"artık sessizce BUGÜNE düşmez"*) doğruladığından
fazlasını iddia ediyordu: gövdesi yalnızca `parseDS`'i sınıyor, `dsToDate`'e hiç
dokunmuyordu; yorumu da bunu kabul ediyordu. Artık fonksiyon `null` dönüyor,
**15 çağrı noktasının tamamı** null'a karşı korundu ve test adının iddia ettiği şeyi
gerçekten doğruluyor.

### Doğrulama yöntemi

672 senaryoluk tarama (4 mod × 7 maaş × 8 ay × 3 vardiya), düzeltme öncesi ve sonrası
aynı matrisle koşturulup senaryo bazında karşılaştırıldı:

| Mod | Ort. \|sapma\| önce | Sonra | İyileşen | Kötüleşen |
|---|---:|---:|---:|---:|
| aylık | 1.010,97 | **0,07** | 136 | 0 |
| yevmiye | 202,39 | **2,83** | 38 | 15 |
| saatlik | 3.802,71 | 3.279,55 | 110 | 27 |
| brüt | 10.754,83 | 9.556,08 | 140 | 0 |

**Bordro motoru çıktısı 672 senaryonun hiçbirinde değişmedi** — kazanç motorundaki
değişiklik bordroya geri beslenmiyor (bordro motoru `earning` objesinden yalnızca
`basePay`, `absentDays`, `isFutureMonth` okuyor; `totalEarning`'i kullanmıyor).

### Kalan bilinen fark (yeni madde, kapsam dışı)

`saatlik` ve `brüt` modlarda **taban** düzeyinde sapma sürüyor; bu Tur 3'ün kapsamı
değildi ve ilave kalem düzeltmesiyle ilgisi yok. Saatlik modda sapma kasıtlı ve
testle kilitli (ekran gerçek ay günü esasını, bordro 30 gün esasını kullanır).

Dikkat çeken yan etki: düzeltmeden önce **iki hata birbirini maskeliyordu.** Örnek —
saatlik mod, 150.000 ₺ net, 2025 Ocak, bol FM: toplam sapma önce −196 ₺ görünüyordu,
şimdi +5.000 ₺. 5.000 ₺ tam olarak saatlik taban farkıdır (31 × 5.000 − 30 × 5.000).
Yani ilave kalem hatası, taban hatasını kısmen götürüyor ve toplamı "doğru" gösteriyordu.
İlaveler düzeltilince taban farkı maskesiz kaldı. Bu bir regresyon değil; saatlik/brüt
modların taban hizalaması ayrı bir madde olarak ele alınmalı.

## Test Dosyaları

| Dosya | Kapsam |
|---|---|
| `tests/payroll.test.mjs` | Sayı parse, GV dilimleri, net↔brüt, SGK tavanı, muafiyetler (altın değerler) |
| `tests/payrollcfg.test.mjs` | Override dalı, SGK tavanı türetme, yıl fallback |
| `tests/engineparity.test.mjs` | İki motorun taban hizası, işe başlama, bilinen açık fark |
| `tests/raisesim.test.mjs` | Zam Simülatörü ↔ bordro motoru eşitliği, cache anahtarı kapsamı |
| `tests/hardening.test.mjs` | Ad tipi, Infinity dilim kalıcılığı, boş parametre |
| `tests/settings.test.mjs` | İzin hakkı, tarih aralığı, saat parse, asgari ücret matrahı |
| `tests/datetime.test.mjs` | Tarih/saat yardımcıları |

`npm test` → 66 test, tamamı geçiyor.
