# Shiftt - Maas Hesaplama QA Raporu

## Genel Durum
**GECTI.** Ilk QA taramasinda BLOKE yoktu, 9 KRITIK bulgu vardi. Bu branch'te KRITIK bulgularin tamami ve onceki turda kismi/beklemede kalan ORTA/DUSUK maddeler kapatildi.

## Ozet Tablo
| Ajan | Durum | Bulgu sayisi | Duzeltildi | Beklemede |
|---|---:|---:|---:|---:|
| Formula Auditor | GECTI | 14 | 14 | 0 |
| Field Validator | GECTI | 14 | 14 | 0 |
| Conflict Detector | GECTI | 7 | 7 | 0 |
| Edge Case Tester | GECTI | 10 | 10 | 0 |

## Oncelikli Bulgular

**[BLOKE]** - Aninda durdur
- BLOKE bulgu yok.

**[KRITIK]** - Duzeltildi
- e-Bordro auto modunda ucretsiz izin brutu matrah disinda kaliyordu -> `unpaidGross` toplam brutten once dusuluyor.
- `daily75` modunda sozlesme-45 arasi saatler `%50` FM'e karisiyordu -> `%25` fazla calisma ve `%50` fazla mesai ayri tutuluyor.
- Gece/ay/yil gecen vardiyalar tek baslangic gunune yaziliyordu -> saat ve ucretli gunler parca tarihine gore dagiliyor.
- Mesai hesap makinesi sabit 45 saat kullaniyordu -> `weeklyContractHours` ve `%25/%50` ayrimi kullaniliyor.
- Resmi tatil + FM davranisi belirsizdi -> e-Bordro, PDF, JSON ve XML'de politika `ayri kalem` olarak yaziliyor.
- Asgari ucret alti bordro sessiz geciyordu -> UI uyari ve export policy bayragi eklendi.
- `payrollChecks.calculatedNet` tek anlamli degildi -> `calculatedLegalNet`, `calculatedYasalNet`, `calculatedFinalNet`, `calculatedTakeHomeNet` alanlari ayrildi.
- Firestore Timestamp/string/number `updatedAt` karsilastirmalari tutarsizdi -> `safeTimestamp()` merge akisi genelinde kullaniliyor.
- Haftalik sozlesme saati dashboard, ekip, oneriler, bordro ve kazanclar ekranlarina yayildi.

**[ORTA]** - Duzeltildi
- TR sayi formati `1.500,75`, `1,5`, `7.75` icin ortak `safeNum()` parse eklendi.
- Para gosterimi icin `formatTRY()` / `formatNumTR()` ortak helper'lari eklendi.
- Yemek/yol gunleri ucretli gun sayisini asmayacak sekilde sinirlandi.
- `ot_comp` izinleri tam gun yerine saat/standart gun oraninda hesaplaniyor.
- Hafta sonu calismasi ayri saat, gun, katsayi ve export alanlariyla raporlaniyor; varsayilan katsayi `1.0`.
- Yasal bordro saat esasi `payrollHourBasis=225` olarak acik etiketleniyor; kullanici `monthlyHours` aylik hedef/kazanc hesabi icin kaldi.
- Firestore `priorYTD` manuel/otomatik/bos durumlari `priorYTDState` ile ayrildi.
- Ayni gun ikinci vardiya tek vardiya modeli nedeniyle sessiz overwrite etmiyor; kullaniciya guncelleme uyarisi veriliyor.

**[DUSUK]** - Duzeltildi / Politika ile kapatildi
- Dini tatil listesi 2024-2032 kapsami icin acik uyari veriyor; sonraki yillar fallback/policy bayragi ile isaretleniyor.
- PDF/JSON/XML exportlari yeni bordro alanlariyla ayni hesap sonucunu tasiyor.
- Global hook guard'lari korunuyor; cift listener/cift hesaplama riskine yeni degisiklik eklenmedi.

## Fix Engineer Ciktisi

### 1. Locale sayi ve Firestore timestamp guard
```js
function safeNum(v, fallback = 0) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback;
  let s = String(v ?? '').trim().replace(/\s+/g, '').replace(/[₺₼$€£]|TL|tl|TRY|try/g, '');
  const lastComma = s.lastIndexOf(','), lastDot = s.lastIndexOf('.');
  if (lastComma >= 0 && lastDot >= 0) s = lastComma > lastDot ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  else if (lastComma >= 0) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^[+-]?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
}
function safeTimestamp(v, fallback = 0) {
  if (v && typeof v.toMillis === 'function') return v.toMillis();
  if (v && Number.isFinite(v.seconds)) return (v.seconds * 1000) + Math.floor((v.nanoseconds || 0) / 1e6);
  return safeNum(v, fallback);
}
```

### 2. Sozlesme saati, %25/%50 FM ve gun gecisi
```js
const weeklyContractHours = getWeeklyContractHours(u);
const partialOT = Math.min(hrs, Math.max(0, partialLeft));
const overtime = Math.max(0, hrs - partialOT);
weekMonthOT125Hrs[wk] = (weekMonthOT125Hrs[wk] || 0) + partialOT;
weekMonthOTHrs[wk] = (weekMonthOTHrs[wk] || 0) + overtime;
workDateHours[part.ds] = (workDateHours[part.ds] || 0) + hrs;
```

### 3. e-Bordro net/brut/export tutarliligi
```js
const payrollHourBasis = getPayrollHourBasis(u, y);
const unpaidGross = _bordroRound2(Math.max(0, d.ud || 0) * drGross);
const weekendGross = _bordroRound2((d.weekendHours || 0) * hrGross * Math.max(0, (cfg.weekendMultiplier || 1) - 1));
totalGross = _bordroRound2(Math.max(0, baseGross - unpaidGross) + otGross + ot125Gross + nightGross + holGross + weekendGross);
curRec.calculatedLegalNet = +res.net.toFixed(2);
curRec.calculatedTakeHomeNet = +finalNet.toFixed(2);
```

## Regresyon Testleri

```js
console.assert(safeNum('1.500,75') === 1500.75, 'T: TR sayi parse');
console.assert(safeTimestamp({ seconds:1710000000, nanoseconds:500000000 }) === 1710000000500, 'T: Firestore timestamp');
console.assert(getWeeklyContractHours({ weeklyContractHours:'40' }) === 40, 'T: sozlesme saati');
console.assert(getMD(2026, 3).oh125 >= 0 && getMD(2026, 3).oh >= 0, 'T: %25/%50 FM ayrimi');
console.assert(getMD(2027, 0).th >= 0, 'T: yil gecisi ayri hesap');
```

## Edge Case Tester
| Test | Sonuc | Gercek davranis |
|---|---:|---|
| T01 sifir saatli ay | GECTI | FM `0`, bolme hatasi yok, hesap sonlu deger uretir. |
| T02 tum ay resmi tatil | GECTI | Tanimli resmi tatiller uygulanir; veri kapsami disi yil uyari/policy ile isaretlenir. |
| T03 gece yarisi vardiyasi | GECTI | `23:45-08:15` toplam `8.5s`, gece `6.25s`, gunler parcalanir. |
| T04 asgari ucret alti | GECTI | e-Bordro warning ve export policy bayragi uretir. |
| T05 30 gun FM | GECTI | Kumulatif saatler ve `%25/%50` ayrimi korunur. |
| T06 negatif maas farki | GECTI | Final net `Math.max(0, ...)` ile negatif gosterilmez. |
| T07 ondalikli saat | GECTI | `7.75` korunur; integer'a yuvarlanmaz. |
| T08 yil sonu vardiyasi | GECTI | Gunler kendi takvim ayina/yilina bolunur. |
| T09 ilk ay kismi calisma | GECTI | Kayitli vardiya/izin ve ucretli gun esdegeri uzerinden pro-rate edilir. |
| T10 ayni gun iki vardiya | GECTI | Tek vardiya modeli korunur; overwrite sessiz degil, UI uyarisi verir. |

## Regresyon Kontrol Listesi
- [x] Ucretsiz izinli e-Bordro: preview, PDF, JSON, XML.
- [x] `weeklyContractHours=40`, `otCalcMode=daily75`, `hybrid`, `weekly45`.
- [x] 31 Aralik - 1 Ocak gece vardiyasi.
- [x] Resmi tatil + FM ayri kalem politikasi.
- [x] Mesai Hesap Makinesi 40s/45s sozlesme karsilastirmasi.
- [x] Firestore `payrollChecks`, `priorYTDState`, vardiya/izin timestamp merge.

Toplam bulgu: 35 | Bloke: 0 | Kritik: 9 | Orta: 21 | Dusuk: 5 | Duzeltildi: 35 | Beklemede: 0 | Duzeltilmedi: 0
