// Faz 0 regresyon testleri — app.js'teki saf sayı/bordro fonksiyonlarını kilitler.
// Amaç: O7 hizalaması ve gelecekteki refactor/modülarizasyonda maaş matematiğinin
// bozulmadığını kanıtlamak. Değerler MEVCUT (doğru kabul edilen) davranışı yansıtır.
// Çalıştır: npm test   (veya: node --test tests/)
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadFns } from './loader.mjs';

const f = loadFns([
  'safeNum', 'safeInt', 'safeTimestamp', 'isAmbiguousNumStr',
  '_bordroRound2', '_bordroCalcGV', 'computeNetFromGross', 'findGrossFromNet',
]);

const near = (a, b, eps = 0.02) => Math.abs(a - b) <= eps;

test('safeNum — TR sayı formatı parse', () => {
  assert.equal(f.safeNum('1.500,75'), 1500.75);   // PAYROLL_QA_REPORT regresyonu
  assert.equal(f.safeNum('1,5'), 1.5);
  assert.equal(f.safeNum('7.75'), 7.75);
  assert.equal(f.safeNum('1.234.567,89'), 1234567.89);
  assert.equal(f.safeNum(2500), 2500);
  assert.equal(f.safeNum('₺1.500,75'), 1500.75);
  assert.equal(f.safeNum('abc', 0), 0);
  assert.equal(f.safeNum('', 42), 42);
  assert.equal(f.safeNum(null, 7), 7);
  assert.equal(f.safeNum(Infinity, 9), 9);          // sonsuz → fallback
});

test('safeInt — tam sayıya indirger', () => {
  assert.equal(f.safeInt('7.75'), 7);
  assert.equal(f.safeInt('1.500,99'), 1500);
  assert.equal(f.safeInt('x', 3), 3);
});

test('safeTimestamp — Firestore/Date/ISO/number/null', () => {
  assert.equal(f.safeTimestamp({ seconds: 1710000000, nanoseconds: 500000000 }), 1710000000500);
  assert.equal(f.safeTimestamp(1710000000500), 1710000000500);
  assert.equal(f.safeTimestamp(new Date(0)), 0);
  assert.equal(f.safeTimestamp(null, 0), 0);
  assert.equal(f.safeTimestamp(undefined, 0), 0);
  assert.equal(f.safeTimestamp({ toMillis: () => 123 }), 123);
});

test('isAmbiguousNumStr — belirsiz tek-nokta tespiti (K1 uyarısı)', () => {
  for (const v of ['1.500', '2.999', '10.500', '1.234']) assert.equal(f.isAmbiguousNumStr(v), true, v);
  for (const v of ['10.50', '1.500,75', '1.234.567', '1500', '1500,75', '7.75', '']) assert.equal(f.isAmbiguousNumStr(v), false, v);
});

test('_bordroRound2 — 2 ondalık, float güvenli', () => {
  assert.equal(f._bordroRound2(0.1 + 0.2), 0.3);
  assert.equal(f._bordroRound2(1500.005), 1500.01);
  assert.equal(f._bordroRound2(2.675), 2.68);
  assert.equal(f._bordroRound2('abc'), 0);
});

// === Gelir vergisi dilimi (kümülatif) — deterministik, golden ===
test('_bordroCalcGV — golden dilim hesabı (2025)', () => {
  assert.equal(f._bordroCalcGV(30000, 2025), 4500);     // ilk dilim %15
  assert.equal(f._bordroCalcGV(200000, 2025), 32100);
  assert.equal(f._bordroCalcGV(1000000, 2025), 239000);
  assert.equal(f._bordroCalcGV(0, 2025), 0);
  assert.equal(f._bordroCalcGV(-5, 2025), 0);            // negatif → 0
});

test('_bordroCalcGV — kümülatifte monotonik artış', () => {
  let prev = -1;
  for (const ytd of [0, 30000, 100000, 200000, 500000, 1000000]) {
    const gv = f._bordroCalcGV(ytd, 2025);
    assert.ok(Number.isFinite(gv) && gv >= 0, 'sonlu/negatif değil');
    assert.ok(gv >= prev, 'monotonik');
    prev = gv;
  }
});

// === computeNetFromGross — golden ===
test('computeNetFromGross — golden net (single, ay 0, prior 0, 2025)', () => {
  const r = f.computeNetFromGross(30000, 'single', 0, 0, 0, undefined, 2025);
  assert.equal(r.net, 24960.38);
  assert.equal(r.gvMatrah, 25500);
  assert.equal(r.sgkDeduction, 4200);
  const r2 = f.computeNetFromGross(50000, 'single', 0, 0, 0, undefined, 2025);
  assert.equal(r2.net, 39258.58);
});

test('computeNetFromGross — net < gross ve sonlu', () => {
  for (const g of [20000, 30000, 50000, 100000]) {
    const r = f.computeNetFromGross(g, 'single', 0, 0, 0, undefined, 2025);
    assert.ok(Number.isFinite(r.net), 'sonlu');
    assert.ok(r.net > 0 && r.net < g, 'net brütten küçük ve pozitif');
  }
});

// === findGrossFromNet — bisection; tolerans + invaryant ===
test('findGrossFromNet — net→brüt→net yuvarlak tur (±0.02)', () => {
  for (const net of [20000, 30000, 50000]) {
    const g = f.findGrossFromNet(net, 'single', 0, 0, 0, undefined, 2025);
    assert.ok(g > net, 'brüt > net');
    const back = f.computeNetFromGross(g, 'single', 0, 0, 0, undefined, 2025).net;
    assert.ok(near(back, net), `geri dönüş ${back} ≈ ${net}`);
  }
});

test('findGrossFromNet — monotonik ve golden (±0.02)', () => {
  assert.ok(near(f.findGrossFromNet(30000, 'single', 0, 0, 0, undefined, 2025), 37049.29));
  let prev = 0;
  for (const net of [10000, 20000, 30000, 50000, 80000]) {
    const g = f.findGrossFromNet(net, 'single', 0, 0, 0, undefined, 2025);
    assert.ok(g > prev, 'monotonik artış');
    prev = g;
  }
});

// === Günlük-net (yevmiye) bordro mutabakatı — Ocak 2026 (gerçek bordro, golden) ===
// Günlük net 1.380 × 32 ödenen gün-eşdeğeri (25 normal + 5 hafta + 1 genel + 1 genel-çalıştı)
// → brüt 55.528,63 ; SGK 7.774,01 ; GV 2.868,57 ; damga 170,76 ; net 44.160,00.
test('günlük-net bordro — Ocak 2026 mutabakatı (golden)', () => {
  const W = 1380, paidDays = 32;
  const targetNet = W * paidDays;                       // 44.160
  const gross = f.findGrossFromNet(targetNet, 'single', 0, 0, 0, undefined, 2026);
  assert.ok(near(gross, 55528.63, 0.1), `brüt ${gross} ≈ 55528.63`);
  const r = f.computeNetFromGross(gross, 'single', 0, 0, 0, undefined, 2026);
  assert.ok(near(r.net, 44160, 0.1), `net ${r.net} ≈ 44160`);
  assert.ok(near(r.sgkDeduction, 7774.01, 0.5), 'SGK %14');
  assert.ok(near(r.unemployDeduct, 555.29, 0.5), 'işsizlik %1');
  assert.ok(near(r.stampTax, 170.76, 0.5), 'damga');
});

// === FM marjinal saatlik baz — asgari ücret istisnasından arınmış (Mayıs 2026) ===
// 4857/41: fazla mesai, vergi istisnasıyla düşmüş "ortalama" değil, marjinal saat
// ücreti üzerinden. Bir ek günün marjinal brütü / 7.5 = tatil saatlik brüt 285,54.
test('FM marjinal saatlik — istisnadan arınmış (Mayıs 2026, %20 dilim)', () => {
  const W = 1440, prior = 190000;
  const marginalDay = f.findGrossFromNet(W * 31, 'single', 0, prior, 4, undefined, 2026)
                    - f.findGrossFromNet(W * 30, 'single', 0, prior, 4, undefined, 2026);
  const hourly = marginalDay / 7.5;
  assert.ok(near(hourly, 285.54, 0.1), `marjinal saatlik ${hourly} ≈ 285,54`);
  assert.ok(near(19 * hourly * 1.5, 8137.89, 2), 'FM %50 = 19s × 285,54 × 1,5 ≈ 8.137,89');
});
// Brüt 86.449,81 (5.710,42 SGK-muaf dahil); SGK matrahı 80.739,39; SGK 11.303,51;
// GV matrahı 74.338,91; damga 405,45; net (yasal) 63.277.
test('computeNetFromGross — SGK-muaf ek kazanç: SGK tabanı düşer, GV/damga tam brüt', () => {
  const r = f.computeNetFromGross(86449.81, 'single', 0, 190000, 4, { sgkExemptGross: 5710.42 }, 2026);
  assert.ok(near(r.sgkBase, 80739.39, 0.1), `SGK matrahı ${r.sgkBase}`);
  assert.ok(near(r.sgkDeduction, 11303.51, 0.1), 'SGK %14');
  assert.ok(near(r.gvMatrah, 74338.91, 0.1), 'GV matrahı tam brütten');
  assert.ok(near(r.stampTax, 405.45, 0.1), 'damga tam brütten');
  assert.ok(near(r.net, 63277.00, 0.5), `net ${r.net}`);
  // opts olmadan eski davranış korunur (SGK tüm brütten)
  const r0 = f.computeNetFromGross(86449.81, 'single', 0, 190000, 4, undefined, 2026);
  assert.equal(r0.sgkExemptGross, 0);
  assert.ok(r0.sgkDeduction > r.sgkDeduction, 'muaf yokken SGK daha yüksek');
});
