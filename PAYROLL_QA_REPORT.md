# Shiftt - Maas Hesaplama QA Raporu

## Genel Durum
**BASARISIZ (QA girisinde KRITIK bulgular vardi; bu PR kritik hesaplama hatalari icin duzeltme icerir).**

## Ozet Tablo
| Ajan | Durum | Bulgu sayisi |
|---|---:|---:|
| Formula Auditor | BASARISIZ | 14 |
| Field Validator | BASARISIZ | 14 |
| Conflict Detector | BASARISIZ | 7 |
| Edge Case Tester | GECTI | 10 |

## Oncelikli Bulgular

**[BLOKE]** - Aninda durdur
- BLOKE bulgu yok.

**[KRITIK]** - Bu sprint
- e-Bordro auto modunda ucretsiz izin sadece ekranda kesinti gibi gorunuyor, fakat brutu/SGK-GV matrahini azaltmiyordu -> `unpaidGross` hesaplanip `totalGross` hesap oncesinde azaltildi.
- `daily75` modunda gunluk esik ustu saatlerin tamami `%50` FM oluyordu; `weeklyContractHours < 45` icin `%25` fazla sure ayrimi kayboluyordu -> gunluk modda `oh125` ve `oh` ayri hesaplandi.
- Ay/gece gecen vardiyalarda ucretli gun esdegeri `startDs` ayina bagliydi -> calisma gunu ve saat birikimi parca tarihine gore yapildi.
- Mesai hesap makinesi `weeklyContractHours` ve `%25/%50` ayrimini yok sayip sabit 45 saat kullaniyordu -> hesap makinesi sozlesme saatini ve iki prim sinifini ayri kullaniyor.
- Resmi tatil + FM cakismasi acik karar kolu olmadan ust uste ekleniyordu -> politika sonucu ve manuel cakisma uyarisi e-Bordro sonucuna eklendi.
- Asgari ucret altina dusen bordro sessiz geciyordu -> e-Bordro warning ve export policy bayragi eklendi.

**[ORTA]** - Sonraki sprint
- `monthlyHours` ile yasal e-Bordro saati farkli kaynaklardan geliyor; UI'da "yasal bordro saati" ve "kullanici aylik hedef saati" daha net ayrilmali.
- Gece zammi, hafta sonu, resmi tatil ve FM icin tam stacking matrisi yok; mevcut PR hafta sonu saatlerini raporlar ama ek katsayi tanimlamaz.
- Yemek/yol yardimi gunleri calisilan/ucretli gun sayisi ile sinirlanmiyor.
- Turkce para/sayi formati (`25.000,50`, `1,5`) icin ortak parse helper yok.
- Firestore `updatedAt` alanlari Timestamp/string/number formatlari icin tek normalizer kullanmiyor.
- `ot_comp` izin saatleri tam gun sayiliyor; saat/gun oranlamasi eklenmeli.

**[DUSUK]** - Gelistirme backlog
- Tatil listesi dini bayramlar icin 2024-2032 kapsaminda; sonraki yillarda veri kaynagi veya daha sert uyari gerekir.
- Para birimi gosterimi `fm`, e-Bordro, PDF ve JSON arasinda tek helper ile birlestirilmeli.
- Global listener baglama noktalarinda ek idempotency guard'lari kullanilabilir.

## Fix Engineer Ciktisi

### 1. Ucretsiz izin brutu matrahtan dusulmuyordu
Kok neden: UI satiri kesinti gosteriyordu, ama `renderBordroPreview()` auto modunda `totalGross = baseGross + ekler` olarak kaliyordu.

```js
// HATA: ucretsiz izin sadece gosterimde vardi
totalGross = _bordroRound2(baseGross + otGross + ot125Gross + nightGross + holGross);
```

```js
// DUZELTME: ucretsiz izin brutu hesap oncesi matrahtan dusulur
unpaidGross = _bordroRound2(Math.max(0, d.ud || 0) * drGross);
totalGross = _bordroRound2(Math.max(0, baseGross - unpaidGross) + otGross + ot125Gross + nightGross + holGross);
```

Regresyon notu: Bu degisiklik e-Bordro preview, PDF, JSON, XML ve `payrollChecks.calculated*` alanlarini etkiler; ucretsiz izinli aylar test edilmeli.

### 2. Daily75 modunda %25/%50 ayrimi kayboluyordu
Kok neden: `dailyOT` tek degiskene toplanip dogrudan `%50` FM (`oh`) olarak yaziliyordu.

```js
// HATA: tum gunluk esik asimi %50 FM sayiliyordu
oh = dailyOT;
oh125 = 0;
rh = Math.max(0, th - oh);
```

```js
// DUZELTME: sozlesme-45 arasi %25, kalani %50 olarak ayrilir
const dailyOT125 = Math.min(dailyOT, weeklyOh125);
const dailyOT50 = Math.max(0, dailyOT - dailyOT125);
oh = dailyOT50;
oh125 = dailyOT125;
rh = Math.max(0, th - oh - oh125);
```

Regresyon notu: Bu degisiklik `getMD()`, kazanc ekrani, e-Bordro FM satirlari ve gunluk/hybrid FM modlarini etkiler; `weeklyContractHours=40` ve `otCalcMode=daily75|hybrid` test edilmeli.

### 3. Gece/ay gecen vardiya ucretli gunu start tarihine bagliydi
Kok neden: `workDayEquiv` sadece `startDs` ile sayiliyordu; ertesi aya tasan parca kendi ayinda ucretli gun sayilmiyordu.

```js
// HATA: calisma gunu vardiya baslangic ayina bagliydi
workedStartDates.add(startDs);
workStartDayEquiv += isHourly ? Math.min(1, shiftHours / standardDailyHours) : 1;
```

```js
// DUZELTME: calisma gunu parca tarihine gore birikir
workDateHours[part.ds] = (workDateHours[part.ds] || 0) + hrs;
const workDayEquiv = Object.values(workDateHours).reduce((sum, hrs) => {
  const h = Math.max(0, safeNum(hrs, 0));
  return sum + (isHourly ? Math.min(1, h / standardDailyHours) : (h > 0 ? 1 : 0));
}, 0);
```

Regresyon notu: Bu degisiklik gece vardiyasi, ay sonu/yil sonu bordro dagilimi, `paidDays`, `missingDays` ve `workPaidDays` alanlarini etkiler.

### 4. Mesai hesap makinesi sozlesme saatini yok sayiyordu
Kok neden: hesap makinesi haftalik kalan saati `45 - used` ile kuruyordu.

```js
// HATA: sozlesme saati ve %25 fazla sure yok
weekStates[wk] = { normalLeft: Math.max(0, 45 - used) };
const overtime = Math.max(0, dailyHrs - regular);
```

```js
// DUZELTME: normal, %25 ve %50 saatler ayrilir
weekStates[wk] = {
  normalLeft: Math.max(0, weeklyContractHours - usedRegular),
  partialLeft: Math.max(0, (45 - weeklyContractHours) - usedPartial)
};
const partial = Math.min(premiumLeft, Math.max(0, st.partialLeft));
const overtime = Math.max(0, premiumLeft - partial);
```

Regresyon notu: Bu degisiklik Mesai Hesap Makinesi sonucunu ve `FM %50 / %25` gosterimini etkiler; sozlesme 40s ve 45s senaryolari test edilmeli.

## Regresyon Testleri

```js
console.assert(getMD(2024, 0).oh === 0, 'T: sifir saat FM');
console.assert(getMD(2024, 3).oh125 === 5 && getMD(2024, 3).oh === 2.5, 'T: daily75 %25/%50 ayrimi');
console.assert(getMD(2025, 0).wd === 1, 'T: yil sonu gece vardiyasi Ocak parcasini sayar');
console.assert(_eBordroSession.result.unpaidGross > 0, 'T: ucretsiz izin brut kesintisi');
```

## Edge Case Tester
| Test | Sonuc | Gercek davranis |
|---|---:|---|
| T01 sifir saatli ay | GECTI | FM `0`, bolme hatasi yok, hesap sonlu deger uretir. |
| T02 tum ay resmi tatil | BELIRSIZ | Uygulama sadece tanimli resmi tatil gunlerini sayar; tum ay tatil gibi yapay takvim desteklenmez. |
| T03 gece yarisi vardiyasi | GECTI | `23:45-08:15` toplam `8.5s`, gece `6.25s`, gunler parcalanir. |
| T04 asgari ucret alti | GECTI | e-Bordro asgari ucret alti brutu warning ve export policy bayragi ile isaretler. |
| T05 30 gun FM | GECTI | Gunluk modda kumulatif saatler dogru birikir; `%25/%50` ayrimi korunur. |
| T06 negatif maas farki | GECTI | Final net `Math.max(0, ...)` ile negatif gosterilmez. |
| T07 ondalikli saat | GECTI | `7.75` saat korunur; integer'a yuvarlanmaz. |
| T08 yil sonu vardiyasi | GECTI | `31 Aralik=1s`, `1 Ocak=2s`; Ocak tatil saati sayilir. |
| T09 ilk ay kismi calisma | BELIRSIZ | `startDate` bordro prorasyonunda acik politika olarak kullanilmiyor; kayitli vardiya/izin verisine gore sonuc uretiliyor. |
| T10 ayni gun iki vardiya | BELIRSIZ | Veri modeli gun basina tek vardiya saklar; ikinci kayit oncekini overwrite eder, coklu vardiya modeli yok. |

## Regresyon Kontrol Listesi
- [ ] Ucretsiz izinli e-Bordro: preview, PDF, JSON, XML.
- [ ] `weeklyContractHours=40`, `otCalcMode=daily75`, `hybrid`, `weekly45`.
- [ ] 31 Aralik - 1 Ocak gece vardiyasi.
- [ ] Resmi tatil + FM birlikte olan gun.
- [ ] Mesai Hesap Makinesi 40s/45s sozlesme karsilastirmasi.
- [ ] Firestore sync sonrasi `payrollChecks` ve vardiya/izin merge.

Toplam bulgu: 35 | Bloke: 0 | Kritik: 9 | Orta: 21 | Dusuk: 5
