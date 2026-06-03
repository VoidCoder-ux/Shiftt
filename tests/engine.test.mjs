// Yeni motor (engine.js) golden testleri — gerçek bordrolarla birebir.
import test from 'node:test';
import assert from 'node:assert/strict';
import { computeBordro, computeNetFromGross, findGrossFromNet } from '../engine.js';

const near = (a, b, eps = 0.05) => Math.abs(a - b) <= eps;

test('computeBordro — Ocak 2026 G-Net (golden, gerçek bordro)', () => {
  const r = computeBordro({ dailyNetWage: 1380, year: 2026, month: 0, priorYTD: 0,
    normalDays: 25, weeklyRestDays: 5, publicHolidayDays: 1, publicHolidayWorkedDays: 1 });
  assert.ok(near(r.totalGross, 55528.63, 0.1), `brüt ${r.totalGross}`);
  assert.ok(near(r.sgkDeduction, 7774.01, 0.1), 'SGK');
  assert.ok(near(r.incomeTax, 2868.57, 0.1), 'GV');
  assert.ok(near(r.stampTax, 170.76, 0.1), 'damga');
  assert.ok(near(r.net, 44160, 0.1), `net ${r.net}`);
});

test('computeBordro — Mayıs 2026 (FM + ek kazanç + %20 dilim, gerçek bordro)', () => {
  const r = computeBordro({ dailyNetWage: 1440, year: 2026, month: 4, priorYTD: 190000, sgkExemptEarn: 5710.43,
    normalDays: 21, weeklyRestDays: 4, publicHolidayDays: 6, publicHolidayWorkedDays: 6, otHours: 19 });
  assert.ok(near(r.normalGross, 38336.68, 0.1), `normal ${r.normalGross}`);
  assert.ok(near(r.weeklyRestGross, 8566.20, 0.1), 'hafta');
  assert.ok(near(r.publicHolidayGross, 12849.30, 0.1), 'genel');
  assert.ok(near(r.publicHolidayWorkGross, 12849.30, 0.1), 'genel-çalıştı');
  assert.ok(near(r.otGross, 8137.89, 0.5), `FM ${r.otGross}`);
  assert.ok(near(r.sgkBase, 80739.39, 0.1), 'SGK matrahı');
  assert.ok(near(r.incomeTax, 10656.45, 0.1), 'GV');
  assert.ok(near(r.stampTax, 405.45, 0.1), 'damga');
  assert.ok(near(r.net, 63277.00, 0.5), `net ${r.net}`);
});

test('computeNetFromGross — opts yokken SGK tüm brütten (geriye uyum)', () => {
  const r = computeNetFromGross(30000, 0, 0, 2025);
  assert.equal(r.sgkExemptGross, 0);
  assert.ok(r.net > 0 && r.net < 30000);
});

test('findGrossFromNet — net→brüt→net yuvarlak tur', () => {
  const g = findGrossFromNet(44160, 0, 0, 2026);
  assert.ok(near(computeNetFromGross(g, 0, 0, 2026).net, 44160, 0.1));
});
