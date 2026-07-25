// Bordro parametresi override'ı kaydedildikten sonra cfg'nin BOZULMAMASI.
// Regresyon: sgkCeiling enumerable OLMAYAN bir getter'dı, nöbetçi bayrak ise
// normal alandı; payrollCfg'nin override dalındaki Object.assign bayrağı
// kopyalayıp getter'ı kopyalamayınca sgkCeiling undefined kalıyor ve
// Math.min(x, undefined) → NaN → 0 zinciriyle SGK kesintisi sıfırlanıyordu.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadFns } from './loader.mjs';

const f = loadFns([
  'payrollCfg', '_withSgkCeiling', '_sgkCeilingOf', 'computeNetFromGross',
  'findGrossFromNet', 'payrollConfigByYear', '_payrollCfgCache', '_bordroRound2',
]);

const near = (a, b, eps = 0.02) => Math.abs(a - b) <= eps;

test('payrollCfg — override sonrası sgkCeiling korunur (Object.assign kopyalayabilmeli)', () => {
  const base = f._withSgkCeiling(Object.assign({}, f.payrollConfigByYear[2026]));
  assert.ok(Number.isFinite(base.sgkCeiling) && base.sgkCeiling > 0, 'taban tavanı sonlu');

  // payrollCfg'nin override dalının birebir kopyası
  const merged = Object.assign({}, base, { year: 2026 });
  assert.ok(Number.isFinite(merged.sgkCeiling), 'Object.assign tavanı TAŞIMALI');
  const after = f._withSgkCeiling(merged);
  assert.equal(after.sgkCeiling, base.sgkCeiling, 'ikinci çağrı tavanı bozmamalı');
});

test('payrollCfg — override minWageGross değişince tavan yeniden türetilir', () => {
  const base = f._withSgkCeiling(Object.assign({}, f.payrollConfigByYear[2026]));
  const merged = Object.assign({}, base, { year: 2026, minWageGross: 40000 });
  const after = f._withSgkCeiling(merged);
  assert.equal(after.sgkCeiling, 40000 * 7.5, 'tavan yeni asgari ücretten hesaplanmalı');
  assert.notEqual(after.sgkCeiling, base.sgkCeiling, 'eski tavan yapışmamalı');
});

test('_sgkCeilingOf — tavan eksikse SGK matrahını sıfırlamaz, tavansız davranır', () => {
  assert.equal(f._sgkCeilingOf({ minWageGross: 33030 }), 33030 * 7.5);
  assert.equal(f._sgkCeilingOf({ sgkCeiling: 247725 }), 247725);
  assert.equal(f._sgkCeilingOf({ sgkCeiling: 0, minWageGross: 0 }), Infinity, 'tavansız → Infinity');
  assert.equal(f._sgkCeilingOf({}), Infinity);
  assert.equal(f._sgkCeilingOf(null), Infinity);
  // Bozuk cfg ile bile SGK kesintisi 0 OLMAMALI (asıl BLOKE belirtisi)
  const broken = Object.assign({}, f.payrollConfigByYear[2026]);
  delete broken.sgkCeiling;
  assert.ok(f._sgkCeilingOf(broken) > 0);
});

test("bordro — override'lı cfg ile net, override'sız cfg ile aynı kalır (tavan altı)", () => {
  const a = f.computeNetFromGross(60000, 'single', 0, 0, 0, undefined, 2026);
  // Cache'e payrollCfg'nin override dalının ürettiği objeyi koy
  const base = f.payrollCfg(2026);
  const merged = f._withSgkCeiling(Object.assign({}, base, { year: 2026 }));
  f._payrollCfgCache['2026'] = merged;
  const b = f.computeNetFromGross(60000, 'single', 0, 0, 0, undefined, 2026);
  assert.ok(b.sgkDeduction > 0, 'SGK kesintisi sıfırlanmamalı');
  assert.equal(b.sgkDeduction, a.sgkDeduction, 'SGK aynı');
  assert.equal(b.net, a.net, `net aynı (${b.net} vs ${a.net})`);
  // net→brüt ters hesabı da bozulmamalı
  assert.ok(near(f.findGrossFromNet(a.net, 'single', 0, 0, 0, undefined, 2026), 60000, 0.05));
});

test("bordro — SGK tavanı üstünde kesinti tavanla sınırlı kalır (override dalında da)", () => {
  const base = f.payrollCfg(2026);
  const ceiling = f._sgkCeilingOf(base);
  f._payrollCfgCache['2026'] = f._withSgkCeiling(Object.assign({}, base, { year: 2026 }));
  const r = f.computeNetFromGross(2000000, 'single', 0, 0, 0, undefined, 2026);
  assert.equal(r.sgkBase, f._bordroRound2(ceiling), 'matrah tavanda');
  assert.ok(near(r.sgkDeduction, f._bordroRound2(ceiling * 0.14), 0.1));
});
