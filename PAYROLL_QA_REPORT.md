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
> madde (FM/Md.47 net etkisi iki motorda farklı) **kapatıldı — ama bu turda
> değil, paralel olarak `main`'e giren PR #113 ile.** Bu tur sapmayı bağımsız
> olarak ölçtü (net 43.200 ₺'de ayda 117–234 ₺, 6 ayda **965,19 ₺**; yön her
> zaman ekran > bordro) ve PR #113 sonrası pariteyi doğruladı. Bu turda fiilen
> kapatılan bulgular: `dsToDate`'in geçersiz tarihte sessizce bugüne düşmesi ve
> 7 bağımlılık güvenlik açığı. FM saat esası ayrışması ise PR #113 ile dolaylı
> olarak kapandı; değişmez bir regresyon testiyle kilitlendi.
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

Regresyon testi: **88 test** (`npm test`); Tur 2 başında 25, Tur 2 sonunda 66 idi.
(Aradaki artışın bir kısmı PR #113'ün eklediği cloudsync/pwa testlerinden gelir.)

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

**KAPATILDI — PR #113 (`main`), Eylül 2026.** `tests/engineparity.test.mjs`
içindeki **"bilinen açık fark"** testi parite testine çevrildi: artık
`assert.equal(e.totalEarning, p.net)` ile **tam eşitlik** arıyor.

Kapatma, bu raporun öngördüğü "ortak gün-muhasebesi yardımcısı + bordro cache'i"
yolunu izlemedi. Bunun yerine delegasyonun yönü tersine çevrildi:
`calcEarningBasisForMonth` tabanı üretiyor, `estimatePayrollForMonth` bu tabanı
`earningBasis` parametresiyle alıyor (artık kazanç motorunu kendisi çağırmıyor),
`calcEarningForMonth` ise bordro sonucunu alıp kalemleri **artımlı marjinal
netleme** ile ayrıştırıyor ve `totalEarning: payroll.net` döndürüyor. Böylece
parite yapısal olarak garanti altında — iki motorun aynı sayıyı üretmesi bir
tesadüf değil, tanım gereği. Döngü de oluşmuyor çünkü delegasyon tek yönlü.

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
- [x] FM/Md.47 net etkisi iki motorda aynı (PR #113 — tam eşitlik)
- [x] FM brüt saat ücreti `monthlyHours` ayarından etkilenmiyor (yasal esas 225)
- [x] Geçersiz tarih anahtarı `dsToDate`'te bugüne düşmüyor (null döner)

---

## Tur 3 Eki — Ekim 2026

Bağımsız bir denetim turunda dört bulgu çıktı. **Üçü bu turda kapatıldı; biri
(en büyüğü) paralel olarak `main`'de PR #113 ile zaten kapatılmıştı** — aşağıda
bunu açıkça ayırıyoruz, çünkü Tur 1'in hatası tam olarak kapanmamış maddeleri
kapanmış göstermekti.

### 1. İlave kalemler net birim ücretle ekleniyordu — PR #113 ile KAPATILDI

Tur 2'nin "bilinçli erteleme"si. Ekran Md.47 tatil ilavesini `gün × net günlük
ücret`, fazla mesaiyi `saat × net saatlik ücret` olarak ekliyordu. Dayandığı
varsayım kodun kendi yorumunda yazılıydı — *"brüt extra ₺1.930,31 → marjinal
vergi sonrası net = tam ₺1.380 = dr"* — ve yalnızca **tek bir maaş ve tek bir
vergi diliminde** doğruydu. Başka dilimlerde ekran, eline geçecekten fazlasını
gösteriyordu.

Bu denetim turunda sapma bağımsız olarak ölçüldü (net 43.200 ₺, hafta içi
09:00–17:30): 2025 Ocak **+117,11 ₺**, Nisan/Mayıs **+234,21 ₺**, Ekim
**+230,91 ₺**, 2026 Ocak **+148,75 ₺** — 6 ayda **+965,19 ₺**, yön her zaman
aynı (ekran > bordro).

**Çözüm bu turda üretilmedi.** `main`'deki PR #113 aynı maddeyi daha temiz bir
mimariyle kapatmıştı: `calcEarningBasisForMonth` tabanı ayırıyor,
`estimatePayrollForMonth` bu tabanı parametre olarak alıyor (delegasyon aşağı
yönlü, döngü yok) ve `calcEarningForMonth` artık kalemleri **artımlı marjinal
netleme** ile ayrıştırıp `totalEarning: payroll.net` döndürüyor. Yani parite
yapısal olarak garanti; testi de `assert.equal(e.totalEarning, p.net)` ile tam
eşitlik arıyor. Bu tur yalnızca bulguyu bağımsız doğruladı.

### 2. FM saat esası ayrışması — PR #113 ile dolaylı olarak kapandı

Ekran FM brüt saat ücretini `getMonthlyHours(u)` (kullanıcının ayarlanabilir
aylık saat hedefi), bordro `getPayrollHourBasis` (yasal 225) ile hesaplıyordu.
Kullanıcı `monthlyHours`'u 225'ten farklı ayarladığı anda iki motor farklı FM
saat ücreti üretiyordu; bu, dosyanın kendi **[POLİTİKA FM-SAAT-ESASI]** kararına
da aykırıydı. Varsayılan 225 olduğu için etki yalnızca ayarı değiştirenlerde
görünüyordu — Tur 2'de bu yüzden yakalanmadı.

PR #113'ten sonra ekran kalemleri doğrudan bordro motorundan aldığı için sapma
kendiliğinden ortadan kalktı; ölçümle doğrulandı (`monthlyHours` 180/225/300 →
FM eki ve toplam kazanç birebir aynı). `calcEarningBasisForMonth` içindeki
`hrGross` artık yalnızca okunmayan bir `hourlyRateGross` alanını besliyor.
Değişmezi kilitlemek için regresyon testi eklendi — ekran ileride kendi saat
ücretini yeniden hesaplamaya başlarsa test bunu yakalar.

### 3. `dsToDate` geçersiz tarihte sessizce BUGÜNE düşüyordu — bu turda kapatıldı

`dsToDate('2026-02-30')` bugünün tarihini döndürüyordu. Canlı bir hata değildi —
normalize aşaması (`normalizeUserCalculations`) bozuk anahtarları `delete` ile
siliyor — ama savunma tek bir yukarı-akış noktasına bağlıydı.

Tur 2'deki test adı (*"artık sessizce BUGÜNE düşmez"*) doğruladığından fazlasını
iddia ediyordu: gövdesi yalnızca `parseDS`'i sınıyor, `dsToDate`'e hiç
dokunmuyordu; kendi yorumu da bunu kabul ediyordu (*"dsToDate fallback'i yine
bugündür"*). Artık fonksiyon `null` dönüyor, **15 çağrı noktasının tamamı**
null'a karşı korundu, `getISOWeek` null girdide çökmüyor ve test adının iddia
ettiği şeyi gerçekten doğruluyor.

Riskli olan üç nokta özellikle ele alındı: `checkRestTime` (`new Date(null)`
1970 epoch'una düşüyordu — dinlenme süresi sessizce yanlış hesaplanırdı),
`openM` (geçersiz tarihle modal açılıp yanlış güne kayıt yazılabilirdi) ve
ot_comp izin bakiyesi (örtük `null >= Date` karşılaştırması).

### 4. Bağımlılık açıkları — bu turda kapatıldı

`npm audit` 7 açık veriyordu (1 orta, 6 yüksek); `audit-report.md` ise
Haziran'dan beri "0 açık" diyordu. Kod değişmemişti, yeni CVE'ler yayınlanmıştı.
`npm audit fix` ile kapatıldı (`package.json` değişmedi, yalnız lock dosyası).
Yedisi de devDependency olduğu için kullanıcıya giden çıktıya girmiyor.
Ayrıntı ve CI önerisi: `audit-report.md` → DEP-01 Notu.

### Doğrulama

PR #113 sonrası parite, 672 senaryoluk bir taramayla bağımsız olarak doğrulandı
(4 mod × 7 maaş × 8 ay × 3 vardiya deseni), ekranın kullandığı çağrı biçimiyle
(`estimatePayrollForMonth(u, y, m)` — `priorYTDOverride` verilmeden):

| Mod | Senaryo | Ort. \|sapma\| | En büyük |
|---|---:|---:|---:|
| aylık | 168 | **0,00** | 0,00 |
| saatlik | 168 | **0,00** | 0,00 |
| yevmiye | 168 | **0,00** | 0,00 |
| brüt | 168 | **0,00** | 0,00 |

Parite dört modda da tam. `calcEarningBasisForMonth` içindeki saatlik taban
farkı (saatlik sözleşmede `dim`, aylıkta 30 gün) duruyor, ancak
`calcEarningForMonth` toplamı bordro netiyle değiştirdiği için kullanıcıya
görünen hiçbir sayıda sapma üretmiyor.

> **Ölçüm notu.** Bu tarama ilk denemede `estimatePayrollForMonth`'u
> `priorYTDOverride = 0` ile çağırıyordu ve aylık/saatlik/brüt modlarda sahte
> sapmalar üretti — ekran bu parametreyi vermediği için bordro gerçek kümülatif
> matrahı çözüyor, override verilince marjinal dilim kayıyor. Parite ölçerken
> iki motor **aynı çağrı biçimiyle** karşılaştırılmalı.

### Ders

Tur 2'nin "bilinçli erteleme"si bir tur boyunca açık kaldı ve bu sürede
kullanıcılara yanlış tutar gösterildi. Ertelenen maddeler için sapmanın
**sayısal büyüklüğü** rapora yazılmalı (bu turda yapıldı: ayda 117–234 ₺);
"ileride bakılacak" etiketi tek başına önceliklendirme için yeterli bilgi
taşımıyor.

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
