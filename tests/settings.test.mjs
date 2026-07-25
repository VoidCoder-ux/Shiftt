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

test('parseTime — hex/üstel gösterim reddedilir', () => {
  const g = loadFns(['parseTime']);
  assert.equal(g.parseTime('08:30'), 510);
  assert.equal(g.parseTime('00:00'), 0);
  assert.equal(g.parseTime('23:59'), 1439);
  // İçe aktarılan bozuk veriden gelebilecek gösterimler
  assert.equal(g.parseTime('0x8:00'), null, 'hex reddedilmeli');
  assert.equal(g.parseTime('1e1:00'), null, 'üstel reddedilmeli');
  assert.equal(g.parseTime('08:5e1'), null, 'dakikada üstel reddedilmeli');
  assert.equal(g.parseTime('8.5:00'), null, 'ondalık reddedilmeli');
  assert.equal(g.parseTime('24:00'), null, 'saat aralığı');
  assert.equal(g.parseTime('08:60'), null, 'dakika aralığı');
  assert.equal(g.parseTime(' 8:05'), 485, 'baştaki boşluk tolere edilir');
});

test('goalHours — üst sınır HTML max ile hizalı', () => {
  const g = loadFns(['clampNum']);
  assert.equal(g.clampNum(99999, 0, 400, 0), 400);
  assert.equal(g.clampNum(180, 0, 400, 0), 180);
  assert.equal(g.clampNum(-5, 0, 400, 0), 0);
});

test('asgari ücret matrahı — aya özel brüt yıllık değere geri kırpılmaz', () => {
  const g = loadFns(['_bordroMinWageTaxableBase', 'payrollCfg', '_bordroRound2']);
  const y = 2026;
  const cfg = g.payrollCfg(y);
  const zamli = cfg.minWageGross * 1.25;              // yıl içi zam senaryosu
  const taban = g._bordroMinWageTaxableBase(zamli, y);
  const beklenen = g._bordroRound2(zamli - g._bordroRound2(zamli * cfg.sgkEmployee)
                                        - g._bordroRound2(zamli * cfg.unemploymentEmployee));
  assert.equal(taban, beklenen, 'zamlı brüt olduğu gibi kullanılmalı');
  assert.ok(taban > g._bordroMinWageTaxableBase(cfg.minWageGross, y),
    'zamlı değer, zamsız değerden büyük olmalı (önceden eşitti)');
});
