// Sessiz veri/parametre bozulmalarına karşı sertleştirme regresyonları.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadFns } from './loader.mjs';

const store = {};
globalThis.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; },
};

const f = loadFns([
  '_safeUserName', 'normalizeUserCalculations', 'normalizeImportedUser', 'mkUser',
  'parseBracketsInput', 'validatePayrollParamsLocal', '_bordroCalcGV',
  '_payrollBracketsToStorage', '_payrollBracketsFromStorage',
  'savePayrollOverride', 'loadPayrollOverrides', 'clearPayrollOverride',
  '_payrollOverrides', 'safeNum',
]);

// === Ad tipi: tek bir bozuk içe aktarma uygulamayı kilitlemesin ===
test('_safeUserName — string olmayan ad her zaman güvenli string olur', () => {
  assert.equal(f._safeUserName('Özlem', 1), 'Özlem');
  assert.equal(f._safeUserName('  Ali  ', 1), 'Ali');
  assert.equal(f._safeUserName(12345, 1), '12345');
  for (const bad of [{}, [], true, null, undefined, NaN, Infinity, () => {}]) {
    const out = f._safeUserName(bad, 2);
    assert.equal(typeof out, 'string');
    assert.ok(out.length > 0, `boş dönmemeli: ${String(bad)}`);
    assert.doesNotThrow(() => out[0].toUpperCase());
  }
  assert.equal(f._safeUserName('x'.repeat(200), 1).length, 60, '60 karaktere kısalır');
});

test('içe aktarma — bozuk ad baş harf gösterimini çökertmez', () => {
  for (const bad of [12345, {}, [], true, null]) {
    const u = f.normalizeImportedUser(1, { name: bad, netSalary: 43200 });
    assert.ok(u, 'kullanıcı üretilmeli');
    assert.equal(typeof u.name, 'string');
    assert.doesNotThrow(() => String(u.name || 'K')[0].toUpperCase(),
      `baş harf hesabı patlamamalı: ${String(bad)}`);
  }
});

test('normalizeUserCalculations — localStorage/bulut yolunda da adı düzeltir', () => {
  const u = Object.assign(f.mkUser(1), { name: { evil: true } });
  f.normalizeUserCalculations(u, 1);
  assert.equal(typeof u.name, 'string');
  assert.doesNotThrow(() => u.name[0].toUpperCase());
});

// === Infinity dilim sınırı JSON turunda kaybolmasın ===
test('vergi dilimleri — Infinity üst sınır kalıcılaştırma turunu atlatır', () => {
  const brackets = f.parseBracketsInput('158000:15\n330000:20\ninf:40');
  assert.equal(brackets[brackets.length - 1].upTo, Infinity, 'parse Infinity üretmeli');

  // Eski hata: JSON.stringify(Infinity) === "null"
  const naive = JSON.parse(JSON.stringify(brackets));
  assert.equal(naive[naive.length - 1].upTo, null, 'düz JSON turu Infinity kaybeder (regresyonun kökü)');

  // Sentinel'li tur
  const roundTripped = f._payrollBracketsFromStorage(
    JSON.parse(JSON.stringify(f._payrollBracketsToStorage(brackets))));
  assert.equal(roundTripped[roundTripped.length - 1].upTo, Infinity, 'sentinel turu Infinity korur');
  assert.equal(roundTripped[0].upTo, 158000, 'sonlu sınırlar bozulmamalı');
});

test('vergi dilimleri — eski kayıtlardaki null da Infinity olarak okunur', () => {
  const restored = f._payrollBracketsFromStorage([{ upTo: 158000, rate: 0.15 }, { upTo: null, rate: 0.4 }]);
  assert.equal(restored[1].upTo, Infinity);
});

test('override — kaydet/oku turundan sonra en üst dilim vergisi uygulanır', () => {
  f.clearPayrollOverride();
  const brackets = f.parseBracketsInput('158000:15\n330000:20\n800000:27\n4300000:35\ninf:40');
  assert.ok(f.savePayrollOverride(2026, { minWageGross: 33030, incomeTaxBrackets: brackets }, {}));
  // Cache'i düşür: gerçek "sayfa yenileme" gibi localStorage'dan taze oku
  f._payrollOverrides = null;
  const reloaded = f.loadPayrollOverrides()[2026].incomeTaxBrackets;
  assert.equal(reloaded[reloaded.length - 1].upTo, Infinity, 'yeniden okumada Infinity korunmalı');
  f.clearPayrollOverride();
});

// === Boş parametre 0 olarak kaydedilmesin ===
test('bordro parametreleri — sıfır oranlar doğrulamada uyarı üretir', () => {
  const issues = f.validatePayrollParamsLocal(2026, {
    minWageGross: 33030, sgkEmployee: 0, unemploymentEmployee: 0, stampTaxRate: 0,
  });
  assert.ok(issues.some(t => t.includes('SGK işçi payı 0')), `SGK uyarısı: ${JSON.stringify(issues)}`);
  assert.ok(issues.some(t => t.includes('İşsizlik payı 0')), 'işsizlik uyarısı');
  assert.ok(issues.some(t => t.includes('Damga vergisi oranı 0')), 'damga uyarısı');
});

test('bordro parametreleri — normal değerler uyarı üretmez', () => {
  const issues = f.validatePayrollParamsLocal(2026, {
    minWageGross: 33030, sgkEmployee: 0.14, unemploymentEmployee: 0.01, stampTaxRate: 0.00759,
    incomeTaxBrackets: f.parseBracketsInput('158000:15\ninf:40'),
  });
  assert.deepEqual(issues, [], `beklenmeyen uyarı: ${JSON.stringify(issues)}`);
});

// === TR binlik formatı dilim sınırını 1000'e bölmesin ===
test('vergi dilimleri — TR binlik formatı doğru okunur ve yanlışsa uyarılır', () => {
  const tr = f.parseBracketsInput('158.000:15\n330.000:20\ninf:40');
  assert.equal(tr[0].upTo, 158000, `TR format: ${tr[0].upTo}`);
  assert.equal(tr[1].upTo, 330000);
  // Gerçekten küçük bir ilk dilim girilirse doğrulama artık yakalar
  const issues = f.validatePayrollParamsLocal(2026, {
    minWageGross: 33030, incomeTaxBrackets: [{ upTo: 158, rate: 0.15 }, { upTo: Infinity, rate: 0.4 }],
  });
  assert.ok(issues.some(t => t.includes('binlik ayracını')), `uyarı bekleniyordu: ${JSON.stringify(issues)}`);
});
