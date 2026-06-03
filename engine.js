/* ============================================================
   Shiftt Bordro Motoru (v2) — saf, bağımsız hesaplama modülü
   Eski app.js'ten kuruşu kuruşuna doğrulanmış matematik buraya
   taşındı (14 golden test ile kilitli). DOM/Firebase bağımlılığı YOK.
   Kullanım: import { computeBordro } from './engine.js'
============================================================ */

/* ---------- Sayı yardımcıları ---------- */
export function safeNum(v, fallback = 0) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback;
  let s = String(v ?? '').trim().replace(/\s+/g, '').replace(/[₺₼$€£]|TL|tl|TRY|try/g, '');
  const lastComma = s.lastIndexOf(','), lastDot = s.lastIndexOf('.');
  if (lastComma >= 0 && lastDot >= 0) s = lastComma > lastDot ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  else if (lastComma >= 0) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^[+-]?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
}
export function round2(v) {
  const n = safeNum(v, NaN);
  if (!Number.isFinite(n)) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
function clampInt(v, lo, hi, def) {
  const n = Math.floor(safeNum(v, def));
  if (!Number.isFinite(n)) return def;
  return Math.min(hi, Math.max(lo, n));
}

/* ---------- Yıl-bazlı bordro parametreleri ----------
   Yeni yıl için tabloya anahtar ekleyin. Kullanıcı override'ı
   setTaxConfig() ile bindirilebilir. */
export const PAYROLL_CONFIG = {
  2024: { year:2024, minWageGross:20002.50, incomeTaxBrackets:[{upTo:110000,rate:.15},{upTo:230000,rate:.20},{upTo:870000,rate:.27},{upTo:3000000,rate:.35},{upTo:Infinity,rate:.40}] },
  2025: { year:2025, minWageGross:26005.50, incomeTaxBrackets:[{upTo:158000,rate:.15},{upTo:330000,rate:.20},{upTo:1200000,rate:.27},{upTo:4300000,rate:.35},{upTo:Infinity,rate:.40}] },
  2026: { year:2026, minWageGross:33030,    incomeTaxBrackets:[{upTo:190000,rate:.15},{upTo:400000,rate:.20},{upTo:1500000,rate:.27},{upTo:5300000,rate:.35},{upTo:Infinity,rate:.40}] },
};
const COMMON = {
  sgkEmployee: 0.14, unemploymentEmployee: 0.01, stampTaxRate: 0.00759,
  otPartialMultiplier: 1.25, otRate: 1.5, monthlyStandardHours: 225, dailyStandardHours: 7.5,
};

let _overrides = {};                 // { 2026: { incomeTaxBrackets:[...], minWageGross:... } }
export function setTaxConfig(year, params) { _overrides[year] = { ...(_overrides[year]||{}), ...params }; }
export function clearTaxConfig(year) { if (year == null) _overrides = {}; else delete _overrides[year]; }

export function payrollCfg(y) {
  const year = clampInt(y, 2000, 2100, new Date().getFullYear());
  // En yakın tanımlı yıl
  let base = PAYROLL_CONFIG[year];
  if (!base) {
    const yrs = Object.keys(PAYROLL_CONFIG).map(Number).sort((a,b)=>a-b);
    base = PAYROLL_CONFIG[year < yrs[0] ? yrs[0] : yrs[yrs.length-1]];
  }
  const cfg = { ...COMMON, ...base, ...(_overrides[year] || {}) };
  cfg.sgkCeiling = cfg.minWageGross * 9;
  return cfg;
}

/* ---------- Gelir vergisi (kümülatif dilim) ---------- */
function calcGV(ytdMatrah, y) {
  if (!Number.isFinite(ytdMatrah) || ytdMatrah <= 0) return 0;
  const brackets = payrollCfg(y).incomeTaxBrackets;
  let tax = 0, prev = 0;
  for (const b of brackets) {
    if (ytdMatrah <= prev) break;
    const upper = (b.upTo === Infinity) ? ytdMatrah : b.upTo;
    const taxable = Math.min(ytdMatrah, upper) - prev;
    if (taxable > 0) tax += taxable * b.rate;
    prev = b.upTo;
    if (b.upTo === Infinity) break;
  }
  return Number.isFinite(tax) ? tax : 0;
}
function minWageTaxableBase(gross, y) {
  const cfg = payrollCfg(y);
  const exemptGross = Math.min(Math.max(0, gross || 0), cfg.minWageGross);
  const sgkBase = Math.min(exemptGross, cfg.sgkCeiling);
  const sgk = round2(sgkBase * cfg.sgkEmployee);
  const uns = round2(sgkBase * cfg.unemploymentEmployee);
  return round2(Math.max(0, exemptGross - sgk - uns));
}
// 7349 sy. Kanun sonrası AGİ yok; asgari ücrete isabet eden GV/DV istisnası
function minWageExemption(gross, thisMonthRawGV, monthIndex, y) {
  const cfg = payrollCfg(y);
  const m = Math.max(0, Math.min(11, clampInt(monthIndex, 0, 11, 0)));
  const minTaxable = minWageTaxableBase(cfg.minWageGross, y);
  const priorMinYTD = minTaxable * m;
  const minWageGV = round2(calcGV(priorMinYTD + minTaxable, y) - calcGV(priorMinYTD, y));
  const incomeTaxExemption = round2(Math.min(Math.max(0, thisMonthRawGV || 0), Math.max(0, minWageGV)));
  const stampTaxExemption = round2(Math.min(Math.max(0, gross || 0), cfg.minWageGross) * cfg.stampTaxRate);
  return { incomeTaxExemption, stampTaxExemption };
}

/* ---------- Brütten net (belirli ay, kümülatif) ----------
   opts.sgkExemptGross: SGK'dan istisna ama gelir+damga vergisine tabi
   kazanç (alış-veriş/yemek kartı). Brüte dahil, SGK matrahından düşer. */
export function computeNetFromGross(gross, priorYTDMatrah, monthIndex, y, opts) {
  const cfg = payrollCfg(y);
  gross = round2(Math.max(0, safeNum(gross, 0)));
  priorYTDMatrah = round2(Math.max(0, safeNum(priorYTDMatrah, 0)));
  const sgkExemptGross = round2(Math.max(0, Math.min(gross, safeNum(opts && opts.sgkExemptGross, 0))));
  const sgkBase        = round2(Math.min(Math.max(0, gross - sgkExemptGross), cfg.sgkCeiling));
  const sgkDeduction   = round2(sgkBase * cfg.sgkEmployee);
  const unemployDeduct = round2(sgkBase * cfg.unemploymentEmployee);
  const gvMatrah   = round2(Math.max(0, gross - sgkDeduction - unemployDeduct));
  const priorYTD   = priorYTDMatrah || 0;
  const ytdMatrah  = round2(priorYTD + gvMatrah);
  const rawGVTotal = round2(calcGV(ytdMatrah, y));
  const rawGVPrior = round2(calcGV(priorYTD, y));
  const thisMonthRawGV = round2(rawGVTotal - rawGVPrior);
  const { incomeTaxExemption, stampTaxExemption } = minWageExemption(gross, thisMonthRawGV, monthIndex, y);
  const netGV         = round2(Math.max(0, thisMonthRawGV - incomeTaxExemption));
  const grossStampTax = round2(gross * cfg.stampTaxRate);
  const stampTax      = round2(Math.max(0, grossStampTax - stampTaxExemption));
  const net = round2(gross - sgkDeduction - unemployDeduct - netGV - stampTax);
  return { gross, sgkExemptGross, sgkBase, sgkDeduction, unemployDeduct, gvMatrah, ytdMatrah,
    thisMonthRawGV, incomeTaxExemption, stampTaxExemption, grossStampTax, netGV, stampTax, net, cfgYear: cfg.year };
}

/* ---------- Net → Brüt (ikili arama) ---------- */
export function findGrossFromNet(targetNet, priorYTDMatrah, monthIndex, y, opts) {
  targetNet = Math.max(0, safeNum(targetNet, 0));
  if (targetNet <= 0) return 0;
  let lo = targetNet * 0.75, hi = Math.max(targetNet * 5, 1000000);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const { net } = computeNetFromGross(mid, priorYTDMatrah, monthIndex, y, opts);
    if (!Number.isFinite(net)) { hi = mid; continue; }
    if (net < targetNet) lo = mid; else hi = mid;
    if (hi - lo < 0.001) break;
  }
  return round2((lo + hi) / 2);
}

/* ============================================================
   YÜKSEK SEVİYE: computeBordro — Günlük-Net (G-Net) bordrosu
   Tek çağrı; tüm kalemleri ve net'i kuruşu kuruşuna üretir.
   input: {
     dailyNetWage, sgkExemptEarn, otRate,
     normalDays, weeklyRestDays, publicHolidayDays, publicHolidayWorkedDays,
     otHours, ot125Hours, priorYTD, year, month  (month: 0-11)
   }
============================================================ */
export function computeBordro(input = {}) {
  const year  = clampInt(input.year, 2000, 2100, new Date().getFullYear());
  const month = clampInt(input.month, 0, 11, new Date().getMonth());
  const cfg = payrollCfg(year);
  const dsh = cfg.dailyStandardHours;
  const W = Math.max(0, safeNum(input.dailyNetWage, 0));

  const normalDays            = Math.max(0, safeNum(input.normalDays, 0));
  const weeklyRestDays        = Math.max(0, safeNum(input.weeklyRestDays, 0));
  const publicHolidayDays     = Math.max(0, safeNum(input.publicHolidayDays, 0));
  const publicHolidayWorkDays = Math.max(0, safeNum(input.publicHolidayWorkedDays, 0));
  const otHours               = Math.max(0, safeNum(input.otHours, 0));
  const ot125Hours            = Math.max(0, safeNum(input.ot125Hours, 0));
  const sgkExemptEarn         = round2(Math.max(0, safeNum(input.sgkExemptEarn, 0)));
  const otRate                = Math.min(3, Math.max(1.5, safeNum(input.otRate, cfg.otRate)));
  const priorYTD              = Math.max(0, safeNum(input.priorYTD, 0));

  // Ödenen gün-eşdeğeri: normal + hafta tatili + genel tatil(baz) + çalışılan genel tatil(ilave Md.47)
  const paidDays = round2(normalDays + weeklyRestDays + publicHolidayDays + publicHolidayWorkDays);
  const baseNet  = round2(W * paidDays);
  const baseGross = findGrossFromNet(baseNet, priorYTD, month, year);

  // FM/marjinal saatlik: asgari ücret istisnasından ARINMIŞ (4857/41).
  // Bir ek günün marjinal brütü (W×31 − W×30) / günlük std saat.
  const stdMonthGross = findGrossFromNet(W * 30, priorYTD, month, year);
  const marginalDayGross = round2(findGrossFromNet(W * 31, priorYTD, month, year) - stdMonthGross);
  const holidayDailyGross = marginalDayGross > 0 ? marginalDayGross : round2(stdMonthGross / 30);
  const hourlyGross = round2(holidayDailyGross / dsh);

  // Görüntü kalemleri: tatiller marjinal oranda; normal = kalan (istisna tabana isabet)
  const weeklyRestGross      = round2(weeklyRestDays * holidayDailyGross);
  const publicHolidayGross   = round2(publicHolidayDays * holidayDailyGross);
  const publicHolidayWorkGross = round2(publicHolidayWorkDays * holidayDailyGross);
  const normalGross = round2(Math.max(0, baseGross - weeklyRestGross - publicHolidayGross - publicHolidayWorkGross));

  const otGross    = round2(otHours * hourlyGross * otRate);
  const ot125Gross = round2(ot125Hours * hourlyGross * cfg.otPartialMultiplier);

  const totalGross = round2(baseGross + otGross + ot125Gross + sgkExemptEarn);
  const tax = computeNetFromGross(totalGross, priorYTD, month, year, { sgkExemptGross: sgkExemptEarn });

  return {
    year, month, cfgYear: cfg.year,
    dailyNetWage: W, paidDays,
    // Kazanç kalemleri (brüt)
    normalDays, normalGross,
    weeklyRestDays, weeklyRestGross,
    publicHolidayDays, publicHolidayGross,
    publicHolidayWorkDays, publicHolidayWorkGross,
    otHours, otGross, otRate,
    ot125Hours, ot125Gross, partialRate: cfg.otPartialMultiplier,
    sgkExemptEarn,
    holidayDailyGross, hourlyGross,
    baseNet, baseGross, totalGross,
    // Kesintiler + net (computeNetFromGross sonucu)
    sgkBase: tax.sgkBase, sgkDeduction: tax.sgkDeduction, unemployDeduct: tax.unemployDeduct,
    gvMatrah: tax.gvMatrah, ytdMatrah: tax.ytdMatrah, thisMonthRawGV: tax.thisMonthRawGV,
    incomeTaxExemption: tax.incomeTaxExemption, stampTaxExemption: tax.stampTaxExemption,
    incomeTax: tax.netGV, stampTax: tax.stampTax,
    legalDeductions: round2(tax.sgkDeduction + tax.unemployDeduct + tax.netGV + tax.stampTax),
    net: tax.net,
  };
}
