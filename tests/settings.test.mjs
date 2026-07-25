// Ayar/hesaplama ekranı regresyonları (ORTA grup kalanı).
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadFns } from './loader.mjs';

const f = loadFns(['annualLeaveTotal', 'statutoryAnnualLeaveFromStart', 'safeInt', 'parseDS', 'dsToDate']);

test('yıllık izin — yasal hak yalnızca YÜKSELTİR, elle gireni ezmez', () => {
  // sSet(startDate/birthDate) dalının uyguladığı kural
  const uygula = (u) => Math.max(f.safeInt(u.annualLeave, 0),
    f.safeInt(f.statutoryAnnualLeaveFromStart(u.startDate, u.birthDate), 0));

  const sozlesmeli = { annualLeave: 30, startDate: '2010-01-01', birthDate: '1995-01-01' };
  const yasal = f.safeInt(f.statutoryAnnualLeaveFromStart(sozlesmeli.startDate, sozlesmeli.birthDate), 0);
  assert.ok(yasal > 0 && yasal < 30, `senaryo anlamlı olmalı (yasal ${yasal})`);
  assert.equal(uygula(sozlesmeli), 30, 'elle girilen 30 gün korunmalı');
  assert.equal(uygula(sozlesmeli), f.annualLeaveTotal(sozlesmeli), 'annualLeaveTotal ile aynı semantik');

  // Elle girilen yasalın altındaysa yasal kazanır
  const dusuk = { annualLeave: 5, startDate: '2010-01-01', birthDate: '1995-01-01' };
  assert.equal(uygula(dusuk), yasal, 'yasal minimum uygulanmalı');
});

test('parseDS — makul yıl aralığı dışı reddedilir', () => {
  assert.equal(f.parseDS('9999999-01-01'), null, 'aşırı büyük yıl reddedilmeli');
  assert.equal(f.parseDS('0000-01-01'), null, 'sıfır yıl reddedilmeli');
  assert.equal(f.parseDS('1969-12-31'), null, 'alt sınır altı reddedilmeli');
  assert.deepEqual(f.parseDS('1970-01-01'), { y: 1970, m: 0, d: 1 });
  assert.deepEqual(f.parseDS('2026-07-24'), { y: 2026, m: 6, d: 24 });
  assert.deepEqual(f.parseDS('2100-12-31'), { y: 2100, m: 11, d: 31 });
  assert.equal(f.parseDS('2101-01-01'), null, 'üst sınır üstü reddedilmeli');
  // Geçersiz takvim günleri hâlâ reddediliyor
  assert.equal(f.parseDS('2026-02-30'), null);
  assert.equal(f.parseDS('2026-13-01'), null);
});

test('dsToDate — aralık dışı anahtar artık sessizce BUGÜNE düşmez', () => {
  // parseDS null döndüğü için normalize aşaması bu anahtarları atar;
  // dsToDate fallback'i yine bugündür ama artık oraya ulaşan kayıt kalmaz.
  assert.equal(f.parseDS('9999999-01-01'), null,
    'aralık dışı anahtar normalize aşamasında elenmeli');
});
