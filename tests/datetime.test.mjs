// Tarih/saat ve format yardımcıları regresyon testleri — app.js'teki saf
// fonksiyonları kilitler (vardiya saat hesabı, gece tespiti, ISO hafta, TR format).
// Değerler MEVCUT (doğru kabul edilen) davranışı yansıtır.
// Çalıştır: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadFns } from './loader.mjs';

const f = loadFns([
  'parseTime', 'calcHr', 'grossHr', 'isNightShift', 'getISOWeek',
  'parseDS', 'dsToDate', 'dStr', 'formatNumTR', 'formatTRY',
  'parseBracketsInput', 'bracketsToInput',
]);

test('parseTime — HH:MM → dakika', () => {
  assert.equal(f.parseTime('08:30'), 510);
  assert.equal(f.parseTime('00:00'), 0);
  assert.equal(f.parseTime('23:59'), 1439);
  assert.equal(f.parseTime('24:00'), null);
  assert.equal(f.parseTime('8:61'), null);
  assert.equal(f.parseTime(''), null);
  assert.equal(f.parseTime(null), null);
  assert.equal(f.parseTime('0830'), null);
});

test('calcHr — net çalışma saati (mola düşülür, gece geçişi)', () => {
  assert.equal(f.calcHr('09:00', '17:00', 0), 8);
  assert.equal(f.calcHr('09:00', '17:00', 60), 7);
  assert.equal(f.calcHr('22:00', '06:00', 0), 8);          // gece geçişi
  assert.equal(f.calcHr('23:45', '08:15', 0), 8.5);        // QA T03 senaryosu
  assert.equal(f.calcHr('09:00', '09:00', 0), 0);          // eşit giriş/çıkış
  assert.equal(f.calcHr('09:00', '17:00', 600), 0);        // mola > süre → 0'a kilitle
  assert.equal(f.calcHr('bozuk', '17:00', 0), 0);
});

test('grossHr — brüt süre (mola düşülmez)', () => {
  assert.equal(f.grossHr('09:00', '17:00'), 8);
  assert.equal(f.grossHr('22:00', '06:00'), 8);
  assert.equal(f.grossHr('09:00', '09:00'), 0);
});

test('isNightShift — çıkış < giriş gece sayılır, 00:00 bitiş sayılmaz', () => {
  assert.equal(f.isNightShift('22:00', '06:00'), true);
  assert.equal(f.isNightShift('09:00', '17:00'), false);
  assert.equal(f.isNightShift('16:00', '00:00'), false);   // gece yarısında biter, taşmaz
  assert.equal(f.isNightShift('bozuk', '06:00'), false);
});

test('getISOWeek — yıl sınırı dahil ISO hafta', () => {
  assert.equal(f.getISOWeek(new Date(2026, 0, 1)), '2026-W01');   // Per
  assert.equal(f.getISOWeek(new Date(2024, 11, 30)), '2025-W01'); // Pzt → sonraki yılın W01
  assert.equal(f.getISOWeek(new Date(2026, 0, 4)), '2026-W01');   // Paz
  assert.equal(f.getISOWeek(new Date(2026, 5, 9)), '2026-W24');
  assert.equal(f.getISOWeek(new Date(2027, 0, 1)), '2026-W53');   // 1 Oca 2027 Cum → önceki yıl W53
});

test('parseDS / dsToDate / dStr — tarih string gidiş-dönüş', () => {
  assert.deepEqual(f.parseDS('2026-06-09'), { y: 2026, m: 5, d: 9 });
  assert.equal(f.parseDS('2026-13-01'), null);              // ay taşması
  assert.equal(f.parseDS('2026-04-31'), null);              // 31 Nisan yok
  assert.equal(f.parseDS('2026-02-29'), null);              // 2026 artık yıl değil
  assert.deepEqual(f.parseDS('2024-02-29'), { y: 2024, m: 1, d: 29 });
  assert.equal(f.parseDS(''), null);
  assert.equal(f.parseDS(null), null);
  assert.equal(f.dStr(f.dsToDate('2026-06-09')), '2026-06-09');
  assert.equal(f.dStr(new Date(NaN)), '');
});

test('formatNumTR / formatTRY — TR yerel format', () => {
  assert.equal(f.formatNumTR(1500.75), '1.500,75');
  assert.equal(f.formatNumTR(0), '0,00');
  assert.equal(f.formatNumTR('abc'), '0,00');               // safeNum fallback
  assert.equal(f.formatNumTR(7.5, 1), '7,5');
  assert.equal(f.formatTRY(1500.75), '₺1.500,75');
  assert.equal(f.formatTRY(1500.75, 0), '₺1.501');
});

test('parseBracketsInput / bracketsToInput — GV dilimi gidiş-dönüş', () => {
  const b = f.parseBracketsInput('190000:15\n230000:0.20\ninf:40');
  assert.deepEqual(b, [
    { upTo: 190000, rate: 0.15 },
    { upTo: 230000, rate: 0.20 },
    { upTo: Infinity, rate: 0.40 },
  ]);
  assert.equal(f.parseBracketsInput(''), null);
  assert.equal(f.parseBracketsInput('bozuk'), null);
  assert.equal(f.bracketsToInput(b), '190000:15\n230000:20\ninf:40');
  // 0.275 float artefaktı yuvarlanır
  assert.equal(f.bracketsToInput([{ upTo: 100, rate: 0.275 }]), '100:27.5');
});
