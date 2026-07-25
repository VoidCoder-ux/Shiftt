// Zam Simülatörü regresyonu — simülatörün baz çizgisi ile Kazanç ekranındaki
// bordro sonucunun (estimatePayrollForMonth / "Net Özet") AYNI sayı olması.
// Geçmişte simülatör ayrı bir "net mod" formülü kullanıyordu ve günlük-net
// (yevmiye) modunda taban 30 güne kilitli, tatil günü çift sayılmış, FM saat
// ücreti ortalama brütten alınmış oluyordu; sonuç binlerce TL sapıyordu.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadFns } from './loader.mjs';

const f = loadFns([
  'S', 'mkUser', 'estimatePayrollForMonth', '_rsProject', '_rsBaseAmount', '_rsBasisOf',
  '_rsCacheKey', '_bordroRound2', 'computeNetFromGross', 'findGrossFromNet',
]);

const Y = 2026, M = 4;              // Mayıs 2026 — geçmiş ay (tam ay değerlendirilir)
const W = 1440;                     // günlük net yevmiye
const near = (a, b, eps = 0.02) => Math.abs(a - b) <= eps;

/* Mayıs 2026 puantajı: 21 normal gün + 4 hafta tatili + 1 resmi tatil (1 Mayıs)
   + o tatilde çalışma (Md.47 ilave gün) + 19 saat %50 fazla mesai. */
const MD = {
  dim: 31, th: 170,
  workDayEquiv: 22, wd: 22, wr: 4, mau: 0, msd: 0, otcm: 0, ud: 0,
  hdw: 1, hpd: 1, hh: 7.5, hhOT: 0,
  oh: 19, oh125: 0, weekendHours: 0, weeklyRestDays: 4, publicHolidayPaidDays: 0,
  weekTotalHrs: {},
};

function withUser(patch) {
  const u = Object.assign(f.mkUser(1), { shifts:{}, leaves:{} }, patch);
  f.S.cu = 1;
  f.S.u[1] = u;
  return u;
}

test('zam simülatörü — günlük-net modunda baz çizgi bordroyla birebir aynı', () => {
  const u = withUser({ salaryInputMode:'dailyNet', dailyNetWage:W, netSalary:W * 30, monthlyHours:225 });
  const prior = 190000;

  const payroll = f.estimatePayrollForMonth(u, Y, M, MD, prior);
  const sim = f._rsProject(u, 'dailyNet', f._rsBaseAmount(u, 'dailyNet'), Y, M, MD, prior);

  assert.ok(payroll && payroll.dailyNetMode, 'bordro yevmiye modelini kullanmalı');
  assert.equal(sim.periodNet, f._bordroRound2(payroll.net), 'simülatör dönem neti = Net Özet neti');
  assert.equal(sim.baseGross, f._bordroRound2(payroll.fullGross), 'taban brüt aynı kaynak');
  // Taban (yevmiye×30) ile dönem neti FARKLI olmalı: ödenen gün-eşdeğeri 28,
  // ayrıca 19s fazla mesai ilavesi var. Bu fark UI'da ayrı satırda gösterilir.
  assert.equal(sim.baseNet, W * 30);
  assert.ok(sim.periodNet > sim.baseNet, 'FM + tatil çalışması neti tabanın üstüne çıkarır');
});

test('zam simülatörü — ödenen gün-eşdeğeri tabana giriyor (30 güne kilitlenmiyor)', () => {
  const u = withUser({ salaryInputMode:'dailyNet', dailyNetWage:W, netSalary:W * 30 });
  const prior = 0;
  // FM'siz, tatilsiz ama 32 ödenen günlük ay: net, 30 günlük tabandan YÜKSEK olmalı.
  const md32 = Object.assign({}, MD, { workDayEquiv:26, wd:26, wr:6, hdw:0, hpd:0, hh:0, oh:0, oh125:0 });
  const sim = f._rsProject(u, 'dailyNet', W * 30, Y, M, md32, prior);
  assert.ok(near(sim.periodNet, W * 32, 1), `32 ödenen gün → ${sim.periodNet} ≈ ${W * 32}`);
  // Eski (hatalı) formül tabanı Math.min(1, …) ile 30 güne kırpıyordu:
  assert.ok(sim.periodNet - W * 30 > 2500, 'kırpılmış 30 günlük tabana geri dönmemeli');
});

test('zam simülatörü — %25 zam yevmiyeye uygulanır, taban/brüt tutarlı büyür', () => {
  const u = withUser({ salaryInputMode:'dailyNet', dailyNetWage:W, netSalary:W * 30 });
  const prior = 190000;
  const cur = f._rsProject(u, 'dailyNet', W * 30, Y, M, MD, prior);
  const nw  = f._rsProject(u, 'dailyNet', f._bordroRound2(W * 30 * 1.25), Y, M, MD, prior);

  assert.equal(nw.baseNet, f._bordroRound2(W * 30 * 1.25), 'yeni taban net = %25 fazlası');
  assert.equal(nw.payroll.dailyNetPaidDays, cur.payroll.dailyNetPaidDays, 'puantaj değişmez');
  assert.ok(nw.baseGross > cur.baseGross, 'brüt de artar');
  // Vergi dilimi nedeniyle brüt zam yüzdesi net zam yüzdesinden büyük olmalı.
  const pctNet = (nw.baseNet - cur.baseNet) / cur.baseNet * 100;
  const pctGross = (nw.baseGross - cur.baseGross) / cur.baseGross * 100;
  assert.ok(near(pctNet, 25, 0.01), `net zam %${pctNet.toFixed(2)}`);
  assert.ok(pctGross > pctNet, `brüt zam (%${pctGross.toFixed(2)}) net zamdan büyük olmalı`);
});

test('zam simülatörü — net modda da bordro motoruyla aynı sonucu verir', () => {
  const u = withUser({ salaryInputMode:'net', netSalary:43200, monthlyHours:225 });
  const prior = 190000;
  const payroll = f.estimatePayrollForMonth(u, Y, M, MD, prior);
  const sim = f._rsProject(u, 'net', f._rsBaseAmount(u, 'net'), Y, M, MD, prior);
  assert.equal(f._rsBasisOf(u), 'net');
  assert.ok(payroll && !payroll.dailyNetMode, 'net modda yevmiye modeli kullanılmaz');
  assert.equal(sim.periodNet, f._bordroRound2(payroll.net));
  assert.equal(sim.baseNet, 43200);
});

test('zam simülatörü — brüt modda taban brüt sabit kalır, net brütten türetilir', () => {
  const u = withUser({ salaryInputMode:'gross', grossSalary:57125, netSalary:43200 });
  const prior = 190000;
  assert.equal(f._rsBasisOf(u), 'gross');
  assert.equal(f._rsBaseAmount(u, 'gross'), 57125);
  const sim = f._rsProject(u, 'gross', 57125, Y, M, MD, prior);
  assert.equal(sim.baseGross, 57125, 'girilen brüt olduğu gibi taban olur');
  const expectedNet = f._bordroRound2(f.computeNetFromGross(57125, 'single', 0, prior, M, undefined, Y).net);
  assert.equal(sim.baseNet, expectedNet, 'taban net brütten hesaplanır');
});

test('zam simülatörü — SGK-muaf ek kazanç ve TSS muafiyeti hesaba katılır', () => {
  const prior = 190000;
  const plain = withUser({ salaryInputMode:'dailyNet', dailyNetWage:W, netSalary:W * 30 });
  const a = f._rsProject(plain, 'dailyNet', W * 30, Y, M, MD, prior);
  const withExtras = withUser({ salaryInputMode:'dailyNet', dailyNetWage:W, netSalary:W * 30, sgkExemptEarn:5710.42, tssExempt:3672.99 });
  const b = f._rsProject(withExtras, 'dailyNet', W * 30, Y, M, MD, prior);
  assert.ok(b.periodNet > a.periodNet, 'ek kazanç + muafiyet neti yükseltmeli (eski simülatör bunları yok sayıyordu)');
  assert.ok(b.periodNet - a.periodNet > 3000, `fark ${(b.periodNet - a.periodNet).toFixed(2)} anlamlı olmalı`);
});

/* Baz çizgi cache'i, `_rsProject`'in kullandığı HER girdiyi kapsamalı. Kapsamazsa
   baz çizgi eski ayarlarla cache'te kalır, yeni projeksiyon taze ayarlarla
   hesaplanır ve %0 zamda bile "hayalet zam" farkı görünür. */
test('zam simülatörü — cache anahtarı bordroyu etkileyen tüm ayarları kapsar', () => {
  const base = { salaryInputMode:'dailyNet', dailyNetWage:W, netSalary:W * 30, settingsUpdatedAt:1000 };
  const keyOf = (patch) => {
    const u = withUser(Object.assign({}, base, patch));
    return f._rsCacheKey(u, 'dailyNet', W * 30, Y, M, MD);
  };
  const ref = keyOf({});
  assert.equal(keyOf({}), ref, 'aynı girdi → aynı anahtar');

  // sSet() bordroyu etkileyen her ayar değişiminde settingsUpdatedAt'ı günceller.
  for (const patch of [
    { sgkExemptEarn:5710.42, settingsUpdatedAt:2000 },
    { tssExempt:3672.99, settingsUpdatedAt:2000 },
    { otCompRate:2, settingsUpdatedAt:2000 },
    { otCompMode:'leave', settingsUpdatedAt:2000 },
    { monthlyHours:195, settingsUpdatedAt:2000 },
    { weeklyContractHours:40, settingsUpdatedAt:2000 },
  ]) {
    assert.notEqual(keyOf(patch), ref, `ayar değişimi anahtarı değiştirmeli: ${JSON.stringify(patch)}`);
  }

  // Puantajın her ücretli-gün bileşeni de anahtarda olmalı.
  const u = withUser(base);
  for (const field of ['th','workDayEquiv','wr','mau','msd','otcm','ud','oh','oh125','weekendHours','hpd']) {
    const md2 = Object.assign({}, MD, { [field]: safeAdd(MD[field]) });
    assert.notEqual(
      f._rsCacheKey(u, 'dailyNet', W * 30, Y, M, md2), ref,
      `puantaj alanı anahtarda yok: ${field}`);
  }
  function safeAdd(v) { return (typeof v === 'number' ? v : 0) + 1; }
});

test('zam simülatörü — priorYTD elle düzenlenince baz çizgi tazelenir', () => {
  const u = withUser({ salaryInputMode:'dailyNet', dailyNetWage:W, netSalary:W * 30, settingsUpdatedAt:1000 });
  const before = f._rsCacheKey(u, 'dailyNet', W * 30, Y, M, MD);
  u.payrollChecks = { '2026-05': { priorYTD:190000, priorYTDState:'manual', updatedAt:12345 } };
  assert.notEqual(f._rsCacheKey(u, 'dailyNet', W * 30, Y, M, MD), before,
    'payrollChecks düzenlemesi anahtarı değiştirmeli');
});

/* Regresyonun kendisi: baz çizgi eski ayarla, projeksiyon yeni ayarla
   hesaplanırsa %0 zamda sıfırdan farklı bir "dönem farkı" doğar. */
test('zam simülatörü — %0 zamda hayalet fark üretmez', () => {
  const prior = 190000;
  const u0 = withUser({ salaryInputMode:'dailyNet', dailyNetWage:W, netSalary:W * 30, settingsUpdatedAt:1000 });
  const stale = f._rsProject(u0, 'dailyNet', W * 30, Y, M, MD, prior);   // muafiyet öncesi baz çizgi

  const u1 = withUser({ salaryInputMode:'dailyNet', dailyNetWage:W, netSalary:W * 30,
                        sgkExemptEarn:5710.42, tssExempt:3672.99, settingsUpdatedAt:2000 });
  const fresh = f._rsProject(u1, 'dailyNet', W * 30, Y, M, prior === null ? MD : MD, prior);

  // Eski davranış: stale baz çizgi + taze projeksiyon = hayalet fark.
  assert.ok(Math.abs(fresh.periodNet - stale.periodNet) > 3000, 'senaryo gerçekten fark üretiyor');
  // Anahtar bu ayarları kapsadığı için baz çizgi tazelenir ve fark sıfırlanır.
  assert.notEqual(f._rsCacheKey(u1, 'dailyNet', W * 30, Y, M, MD),
                  f._rsCacheKey(u0, 'dailyNet', W * 30, Y, M, MD));
  const rebased = f._rsProject(u1, 'dailyNet', W * 30, Y, M, MD, prior);
  assert.equal(rebased.periodNet - fresh.periodNet, 0, '%0 zam → dönem farkı 0');
});
