// TEK NET MOTORU regresyonu: ekran tahmini (calcEarningForMonth) ile bordro
// motoru (estimatePayrollForMonth) aynı ay ve aynı veri için aynı tabanı
// üretmeli. Geçmişte ikisi ayrı formül kullanıyordu:
//   - taban ücret: `ay günü × (net/30)` vs `(30 − eksik)/30`  → Şubat −%6,7
//   - yevmiye modunda işaretsiz günler: ekran ücretli sayıyor, bordro saymıyor
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadFns } from './loader.mjs';

const f = loadFns([
  'S', 'mkUser', 'getMD', 'calcEarningForMonth', 'estimatePayrollForMonth',
  'computeNetFromGross', 'findGrossFromNet', '_bordroRound2', 'invalidateMDCache',
]);

const near = (a, b, eps = 0.02) => Math.abs(a - b) <= eps;

/* Takvimi doldur: hafta içi vardiya, hafta sonu 'weekly' izin. */
function fillMonth(u, y, m, { from = 1, to = null, hours = ['09:00', '17:30'] } = {}) {
  const dim = new Date(y, m + 1, 0).getDate();
  const last = to || dim;
  for (let day = from; day <= last; day++) {
    const ds = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dow = new Date(y, m, day).getDay();
    if (dow === 0 || dow === 6) u.leaves[ds] = { type: 'weekly' };
    else u.shifts[ds] = { start: hours[0], end: hours[1], break: 0 };
  }
  return u;
}

function setUser(patch) {
  const u = Object.assign(f.mkUser(1), { shifts: {}, leaves: {} }, patch);
  f.S.cu = 1;
  f.S.u[1] = u;
  f.invalidateMDCache();
  return u;
}

// === Aylık ücretli: ay uzunluğu tabanı DEĞİŞTİRMEMELİ (Türk bordrosu 30 gün) ===
test('aylık ücretli — taban ücret ay uzunluğundan bağımsız (30 gün esası)', () => {
  const NET = 43200;
  const seen = {};
  for (const [y, m, etiket] of [[2025, 0, 'Ocak 31g'], [2025, 1, 'Şubat 28g'], [2024, 1, 'Şubat 29g'], [2025, 3, 'Nisan 30g']]) {
    const u = setUser({ netSalary: NET, salaryInputMode: 'net', payMode: 'monthly' });
    fillMonth(u, y, m);
    const e = f.calcEarningForMonth(y, m, NET);
    assert.equal(e.absentDays, 0, `${etiket}: eksik gün yok`);
    seen[etiket] = f._bordroRound2(e.basePay);
  }
  const values = Object.values(seen);
  assert.ok(values.every(v => v === NET),
    `taban her ayda ${NET} olmalı, görülen: ${JSON.stringify(seen)}`);
});

test('aylık ücretli — tatil/FM içermeyen ayda ekran tahmini = bordro neti', () => {
  const NET = 43200;
  // Resmi tatil çalışması ve fazla mesai İÇERMEYEN aylar: taban tek başına
  // kaldığında iki motor artık birebir aynı sayıyı vermeli.
  // Resmi tatil içermeyen aylar (Şubat, Kasım, Aralık)
  for (const [y, m] of [[2025, 1], [2025, 10], [2025, 11], [2024, 1]]) {
    const u = setUser({ netSalary: NET, salaryInputMode: 'net', payMode: 'monthly' });
    fillMonth(u, y, m, { hours: ['09:00', '16:00'] });   // 7s/gün → haftalık 35s, FM yok
    const e = f.calcEarningForMonth(y, m, NET);
    const p = f.estimatePayrollForMonth(u, y, m, undefined, 0);
    assert.ok(p, `${y}-${m + 1}: bordro üretilmeli`);
    assert.equal(e.overtimeHours + e.overtimeHours125, 0, `${y}-${m + 1}: FM olmamalı`);
    assert.equal(e.holidayPayDays, 0, `${y}-${m + 1}: tatil çalışması olmamalı`);
    assert.ok(near(e.totalEarning, p.net, 1.5),
      `${y}-${m + 1}: ekran ${e.totalEarning.toFixed(2)} vs bordro ${p.net.toFixed(2)}`);
  }
});

/* BİLİNEN AÇIK FARK — ertelenen "FM/ilave kalem vergilendirmesi" maddesi.
   Ekran, Md.47 tatil ilavesini ve fazla mesaiyi NET birim ücretle ekliyor;
   bordro motoru bunları BRÜT ekleyip marjinal vergiye tabi tutuyor. Taban artık
   hizalı olduğu için kalan fark yalnızca bu artışlardan geliyor. Test farkın
   varlığını ve YÖNÜNÜ kilitler: ekran her zaman bordrodan yüksek ya da eşit
   olmalı (ekran vergiyi hiç uygulamıyor), ve fark yalnızca ilave kalem varken
   doğmalı. Madde kapatıldığında bu test parity'ye çevrilmeli. */
test('bilinen açık fark — ilave kalemler ekranda brütleştirilmiyor', () => {
  const NET = 43200, y = 2025, m = 0;      // Ocak: 1 Ocak resmi tatili çalışılıyor
  const u = setUser({ netSalary: NET, salaryInputMode: 'net', payMode: 'monthly' });
  fillMonth(u, y, m);
  const e = f.calcEarningForMonth(y, m, NET);
  const p = f.estimatePayrollForMonth(u, y, m, undefined, 0);
  const ilave = e.holidayPay + e.overtimePay + e.overtimePay125;
  assert.ok(ilave > 0, 'senaryo ilave kalem içermeli');
  assert.ok(near(e.basePay, NET, 1), `taban hizalı olmalı: ${e.basePay.toFixed(2)}`);
  assert.ok(e.totalEarning >= p.net - 1, 'ekran bordrodan düşük olmamalı');
  assert.ok(e.totalEarning - p.net < ilave,
    `fark ilave kalemin tamamını aşmamalı (fark ${(e.totalEarning - p.net).toFixed(2)}, ilave ${ilave.toFixed(2)})`);
});

test('aylık ücretli — eksik gün iki motorda da AYNI gün sayısıyla düşer', () => {
  const NET = 43200, y = 2025, m = 4;
  const u = setUser({ netSalary: NET, salaryInputMode: 'net', payMode: 'monthly' });
  fillMonth(u, y, m, { from: 1, to: 20, hours: ['09:00', '16:00'] });   // 21–31 girilmemiş
  const e = f.calcEarningForMonth(y, m, NET);
  const p = f.estimatePayrollForMonth(u, y, m, undefined, 0);
  assert.ok(e.absentDays > 0, 'eksik gün oluşmalı');
  // Ekran: neti doğrusal pro-rate ediyor. Bordro: BRÜTÜ pro-rate edip neti
  // yeniden türetiyor — asgari ücret vergi istisnası sabit olduğu için sonuç
  // doğrusal değil ve bordro daha yüksek çıkar. Doğrusu bordrodur.
  assert.ok(near(e.basePay, NET * (30 - e.absentDays) / 30, 1),
    `ekran tabanı doğrusal pro-rate: ${e.basePay.toFixed(2)}`);
  assert.ok(near(p.baseGross, p.fullGross * (30 - e.absentDays) / 30, 1),
    `bordro brütü aynı gün sayısıyla pro-rate etmeli: ${p.baseGross.toFixed(2)}`);
  assert.ok(p.net >= e.totalEarning - 1,
    `istisna sabit olduğu için bordro neti daha yüksek olmalı (${p.net.toFixed(2)} vs ${e.totalEarning.toFixed(2)})`);
});

// === Saatlik sözleşme: gerçek ay günü esası KORUNMALI ===
test('saatlik sözleşme — ay günü esası korunur (davranış değişmedi)', () => {
  const NET = 43200, y = 2025, m = 0;              // Ocak, 31 gün
  const u = setUser({ netSalary: NET, salaryInputMode: 'net', payMode: 'hourly' });
  fillMonth(u, y, m);
  const e = f.calcEarningForMonth(y, m, NET);
  assert.ok(near(e.basePay, NET / 30 * 31, 0.5), `saatlikte 31×dr beklenir: ${e.basePay.toFixed(2)}`);
});

// === Yevmiye (G-Net): işaretsiz gün ödenmez, iki motor aynı ===
test('yevmiye — işaretsiz gün ödenmez, ekran ile bordro aynı ödenen günü kullanır', () => {
  const W = 1440, y = 2025, m = 4;
  const u = setUser({ salaryInputMode: 'dailyNet', dailyNetWage: W, netSalary: W * 30 });
  fillMonth(u, y, m, { from: 1, to: 20 });          // 21–31 işaretsiz
  const d = f.getMD(y, m);
  const e = f.calcEarningForMonth(y, m, W * 30);
  const p = f.estimatePayrollForMonth(u, y, m, d, 0);

  assert.ok(p && p.dailyNetMode, 'yevmiye modeli çalışmalı');
  assert.equal(e.freePassDays, 0, 'yevmiyede serbest gün ÜRETİLMEZ');
  assert.ok(near(e.basePay, W * (p.dailyNetPaidDays - (d.hpd || 0)), 1),
    `ekran tabanı ödenen gün-eşdeğerinden gelmeli: ${e.basePay.toFixed(2)}`);
  assert.ok(near(e.basePay + e.holidayPay, p.baseNet, 1),
    `ekran ${(e.basePay + e.holidayPay).toFixed(2)} vs bordro baseNet ${p.baseNet.toFixed(2)}`);
});

test('yevmiye — tam işaretli ayda ekran tabanı = bordro baseNet', () => {
  const W = 1440;
  for (const [y, m] of [[2025, 0], [2025, 1], [2025, 3]]) {
    const u = setUser({ salaryInputMode: 'dailyNet', dailyNetWage: W, netSalary: W * 30 });
    fillMonth(u, y, m);
    const d = f.getMD(y, m);
    const e = f.calcEarningForMonth(y, m, W * 30);
    const p = f.estimatePayrollForMonth(u, y, m, d, 0);
    assert.ok(near(e.basePay + e.holidayPay, p.baseNet, 1),
      `${y}-${m + 1}: ekran ${(e.basePay + e.holidayPay).toFixed(2)} vs bordro ${p.baseNet.toFixed(2)}`);
  }
});

test('yevmiye — ödenen gün-eşdeğeri Net Özet ayrıştırmasıyla tutarlı', () => {
  const W = 1440, y = 2025, m = 4;
  const u = setUser({ salaryInputMode: 'dailyNet', dailyNetWage: W, netSalary: W * 30 });
  fillMonth(u, y, m);
  const d = f.getMD(y, m);
  const p = f.estimatePayrollForMonth(u, y, m, d, 0);
  const beklenen = (d.workDayEquiv || 0) + (d.wr || 0) + (d.mau || 0) + (d.msd || 0)
                 + (d.otcm || 0) + (d.hpd !== undefined ? d.hpd : d.hdw || 0);
  assert.ok(near(p.dailyNetPaidDays, f._bordroRound2(beklenen), 0.02));
  assert.ok(near(p.baseNet, W * p.dailyNetPaidDays, 0.02));
});

// === ORTA grup regresyonları ===

test('işe başlama — ay içi girişte giriş öncesi günler ödenmez', () => {
  const NET = 43200, y = 2025, m = 2;            // Mart 2025
  const u = setUser({ netSalary: NET, salaryInputMode: 'net', payMode: 'monthly', startDate: '2025-03-16' });
  // Yalnızca 16–31 Mart kayıtlı
  const dim = new Date(y, m + 1, 0).getDate();
  for (let day = 16; day <= dim; day++) {
    const ds = `${y}-03-${String(day).padStart(2, '0')}`;
    const dow = new Date(y, m, day).getDay();
    if (dow === 0 || dow === 6) u.leaves[ds] = { type: 'weekly' };
    else u.shifts[ds] = { start: '09:00', end: '16:00', break: 0 };
  }
  f.invalidateMDCache();
  const e = f.calcEarningForMonth(y, m, NET);
  assert.equal(e.preStartDays, 15, 'giriş öncesi 15 gün ayrı sayılmalı');
  assert.equal(e.freePassDays, 0, 'giriş öncesi hafta sonları serbest gün sayılmamalı');
  assert.ok(e.basePay < NET, 'tam maaş ödenmemeli');
  assert.ok(near(e.basePay, NET * (30 - e.absentDays) / 30, 1),
    `taban pro-rate edilmeli: ${e.basePay.toFixed(2)}`);
});

test('işe başlama — giriş tarihinden önceki ay hiç kazanç üretmez', () => {
  const NET = 43200, y = 2025, m = 0;
  const u = setUser({ netSalary: NET, salaryInputMode: 'net', payMode: 'monthly', startDate: '2025-03-16' });
  f.invalidateMDCache();
  const e = f.calcEarningForMonth(y, m, NET);
  assert.equal(e.basePay, 0, `giriş öncesi ay 0 olmalı: ${e.basePay}`);
  assert.equal(e.totalEarning, 0);
});

test('işe başlama — startDate yoksa davranış değişmez', () => {
  const NET = 43200, y = 2025, m = 2;
  const u = setUser({ netSalary: NET, salaryInputMode: 'net', payMode: 'monthly' });
  fillMonth(u, y, m, { hours: ['09:00', '16:00'] });
  const e = f.calcEarningForMonth(y, m, NET);
  assert.equal(e.preStartDays, 0);
  assert.ok(near(e.basePay, NET, 1));
});
