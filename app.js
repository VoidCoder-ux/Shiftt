/* ============================================================
   CONSTANTS
============================================================ */
const DATA_VERSION = '5.4';
const MTR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const DTR = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
/* [FIX L-01] DFS, DTR ile aynıydı — kaldırıldı, kullanımlar DTR'ye yönlendirildi */
const DFL = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
let MH = 225;  // Aylık yasal saat (Yargıtay 9.HD: 30 gün × 7,5s); kullanıcı 195 (45×52,18÷12) seçebilir
const MAX_GROSS_HOURS = 16;
const PRESETS_BASE = Object.freeze({
  morning:   { start:'08:00', end:'16:00', break:30 },
  afternoon: { start:'12:00', end:'20:00', break:30 },
  evening:   { start:'16:00', end:'00:00', break:30 }
});
const FH = [
  {m:1,d:1,n:'Yılbaşı'},{m:4,d:23,n:'23 Nisan'},{m:5,d:1,n:'1 Mayıs'},
  {m:5,d:19,n:'19 Mayıs'},{m:7,d:15,n:'15 Temmuz'},{m:8,d:30,n:'30 Ağustos'},
  {m:10,d:28,n:'Cumhuriyet Arifesi',half:true},{m:10,d:29,n:'29 Ekim'}
];
/* [FIX] Dini tatiller 2024-2032 genişletildi */
const RH = {
  2024:[{m:4,d:9,n:'Ramazan Arifesi',half:true},{m:4,d:10,n:'Ramazan B.'},{m:4,d:11,n:'Ramazan B.'},{m:4,d:12,n:'Ramazan B.'},{m:6,d:16,n:'Kurban Arifesi',half:true},{m:6,d:17,n:'Kurban B.'},{m:6,d:18,n:'Kurban B.'},{m:6,d:19,n:'Kurban B.'},{m:6,d:20,n:'Kurban B.'}],
  2025:[{m:3,d:29,n:'Ramazan Arifesi',half:true},{m:3,d:30,n:'Ramazan B.'},{m:3,d:31,n:'Ramazan B.'},{m:4,d:1,n:'Ramazan B.'},{m:6,d:5,n:'Kurban Arifesi',half:true},{m:6,d:6,n:'Kurban B.'},{m:6,d:7,n:'Kurban B.'},{m:6,d:8,n:'Kurban B.'},{m:6,d:9,n:'Kurban B.'}],
  2026:[{m:3,d:19,n:'Ramazan Arifesi',half:true},{m:3,d:20,n:'Ramazan B.'},{m:3,d:21,n:'Ramazan B.'},{m:3,d:22,n:'Ramazan B.'},{m:5,d:26,n:'Kurban Arifesi',half:true},{m:5,d:27,n:'Kurban B.'},{m:5,d:28,n:'Kurban B.'},{m:5,d:29,n:'Kurban B.'},{m:5,d:30,n:'Kurban B.'}],
  2027:[{m:3,d:8,n:'Ramazan Arifesi',half:true},{m:3,d:9,n:'Ramazan B.'},{m:3,d:10,n:'Ramazan B.'},{m:3,d:11,n:'Ramazan B.'},{m:5,d:15,n:'Kurban Arifesi',half:true},{m:5,d:16,n:'Kurban B.'},{m:5,d:17,n:'Kurban B.'},{m:5,d:18,n:'Kurban B.'},{m:5,d:19,n:'Kurban B.'}],
  2028:[{m:2,d:26,n:'Ramazan Arifesi',half:true},{m:2,d:27,n:'Ramazan B.'},{m:2,d:28,n:'Ramazan B.'},{m:2,d:29,n:'Ramazan B.'},{m:5,d:3,n:'Kurban Arifesi',half:true},{m:5,d:4,n:'Kurban B.'},{m:5,d:5,n:'Kurban B.'},{m:5,d:6,n:'Kurban B.'},{m:5,d:7,n:'Kurban B.'}],
  2029:[{m:2,d:13,n:'Ramazan Arifesi',half:true},{m:2,d:14,n:'Ramazan B.'},{m:2,d:15,n:'Ramazan B.'},{m:2,d:16,n:'Ramazan B.'},{m:4,d:23,n:'Kurban Arifesi',half:true},{m:4,d:24,n:'Kurban B.'},{m:4,d:25,n:'Kurban B.'},{m:4,d:26,n:'Kurban B.'},{m:4,d:27,n:'Kurban B.'}],
  2030:[{m:2,d:3,n:'Ramazan Arifesi',half:true},{m:2,d:4,n:'Ramazan B.'},{m:2,d:5,n:'Ramazan B.'},{m:2,d:6,n:'Ramazan B.'},{m:4,d:12,n:'Kurban Arifesi',half:true},{m:4,d:13,n:'Kurban B.'},{m:4,d:14,n:'Kurban B.'},{m:4,d:15,n:'Kurban B.'},{m:4,d:16,n:'Kurban B.'}],
  2031:[{m:1,d:23,n:'Ramazan Arifesi',half:true},{m:1,d:24,n:'Ramazan B.'},{m:1,d:25,n:'Ramazan B.'},{m:1,d:26,n:'Ramazan B.'},{m:4,d:1,n:'Kurban Arifesi',half:true},{m:4,d:2,n:'Kurban B.'},{m:4,d:3,n:'Kurban B.'},{m:4,d:4,n:'Kurban B.'},{m:4,d:5,n:'Kurban B.'}],
  2032:[{m:1,d:12,n:'Ramazan Arifesi',half:true},{m:1,d:13,n:'Ramazan B.'},{m:1,d:14,n:'Ramazan B.'},{m:1,d:15,n:'Ramazan B.'},{m:3,d:21,n:'Kurban Arifesi',half:true},{m:3,d:22,n:'Kurban B.'},{m:3,d:23,n:'Kurban B.'},{m:3,d:24,n:'Kurban B.'},{m:3,d:25,n:'Kurban B.'}]
};
const THEME_COLORS = {
  default:'linear-gradient(135deg,#7c3aed,#8b5cf6)',ocean:'linear-gradient(135deg,#0891b2,#06b6d4)',
  forest:'linear-gradient(135deg,#16a34a,#22c55e)',sunset:'linear-gradient(135deg,#ea580c,#f97316)',
  rose:'linear-gradient(135deg,#e11d48,#f43f5e)',gold:'linear-gradient(135deg,#d97706,#f59e0b)',
  light:'linear-gradient(135deg,#7c3aed,#a78bfa)',['light-ocean']:'linear-gradient(135deg,#0891b2,#22d3ee)'
};
const MIN_REST_HOURS = 11; // Minimum dinlenme süresi (saat)
const THEME_NAMES = {default:'Mor',ocean:'Okyanus',forest:'Orman',sunset:'Gün Batımı',rose:'Gül',gold:'Altın',light:'Aydınlık',['light-ocean']:'Aydınlık Okyanus'};
const PRESET_EMOJIS = ['⏰','🌅','🌇','🌙','⭐','🌞','🔥','💼','🏭','🏥','🚀','⚡','🎯','🌈','🦉','🌊'];

/* ============================================================
   STATE
============================================================ */
let S = {
  cu: null,
  cm: new Date().getMonth(),
  cy: new Date().getFullYear(),
  lvy: new Date().getFullYear(),
  em: new Date().getMonth(),
  ey: new Date().getFullYear(),
  sd: null,
  mt: 'shift',
  lt: null,
  clipboard: null,
  multiSelect: false,
  selectedDates: [],
  wtEditDay: null,
  cpSelectedEmoji: '⏰',
  nextUid: 3,
  deletedUsers: {},
  u: { 1: mkUser(1), 2: mkUser(2) }
};

function mkUser(i) {
  return {
    name: 'Kullanıcı ' + i,
    netSalary: 0,
    startDate: '',
    birthDate: '',
    annualLeave: 0,
    shifts: {},
    leaves: {},
    deletedShifts: {},
    deletedLeaves: {},
    customPresets: [],
    weeklyTemplate: null,
    notes: '',
    profileUpdatedAt: 0,
    notesUpdatedAt: 0,
    settingsUpdatedAt: 0,
    lastLogin: null,
    theme: 'default',
    monthlyHours: 225,
    weeklyContractHours: 45,
    payMode: 'monthly',
    goalHours: 0,
    goalEarning: 0,
    pin: null,
    autoTheme: false,
    documents: [],
    deletedDocs: {},
    payrollChecks: {},
    conflictLog: [],
    /* [FIX] Fazla Mesai → İzin Karşılığı (Comp Time) */
    otCompMode: 'pay',      // 'pay' | 'leave'
    otCalcMode: 'weekly45', // 'weekly45' (4857/41 default) | 'daily75' (günlük) | 'hybrid'
    otCompRate: 1.5,        // Yasal katsayı (TR İş Kanunu: 1.5)
    otBalance: 0,           // Kullanıcının el ile düzenlediği başlangıç bakiyesi (saat)
    otCompModeChangedAt: 0,
    otCompModeHistory: [],
    /* [FIX] Akıllı Vardiya Önerileri */
    hideSuggestions: false  // Öneri ikonlarını gizle/göster
  };
}

let confirmCallback = null;
let mdCache = {};
let yearlyOTCache = {};

/* ============================================================
   UNDO STACK
============================================================ */
const undoStack = [];
const MAX_UNDO = 30;

function pushUndo(label) {
  const u = cu(); if (!u) return;
  undoStack.push({
    label,
    shifts: JSON.parse(JSON.stringify(u.shifts)),
    leaves: JSON.parse(JSON.stringify(u.leaves)),
    deletedShifts: JSON.parse(JSON.stringify(u.deletedShifts || {})),
    deletedLeaves: JSON.parse(JSON.stringify(u.deletedLeaves || {})),
    ts: Date.now()
  });
  if (undoStack.length > MAX_UNDO) undoStack.shift();
  updUndoBtn();
}

function undo() {
  if (!undoStack.length) return;
  const u = cu(); if (!u) return;
  const snap = undoStack.pop();
  u.shifts = snap.shifts;
  u.leaves = snap.leaves;
  u.deletedShifts = snap.deletedShifts || {};
  u.deletedLeaves = snap.deletedLeaves || {};
  invalidateMDCache();
  saveLS();
  renderActivePage();
  updUndoBtn();
  toast('Geri alındı: ' + snap.label, 'info');
}

function updUndoBtn() {
  const b = $('undoBtn');
  if (b) b.disabled = !undoStack.length;
}

/* ============================================================
   HELPERS
============================================================ */
function escHtml(s) {
  if (s === null || s === undefined) return '';
  const d = document.createElement('div');
  d.textContent = String(s);
  return d.innerHTML;
}
function $(id) { return document.getElementById(id); }
function setHtml(id, h) { const e = $(id); if (e) e.innerHTML = h; }
function setTxt(id, t) { const e = $(id); if (e) e.textContent = t; }

/* [FIX ERR-HANDLE-01] Ortak hata-güvenli parse & sayı yardımcıları */
function safeParse(s, fallback) {
  try { const v = JSON.parse(s); return (v === null || v === undefined) ? fallback : v; }
  catch { return fallback; }
}
function safeNum(v, fallback = 0) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback;
  if (v === null || v === undefined) return fallback;
  let s = String(v).trim();
  if (!s) return fallback;
  s = s.replace(/\s+/g, '').replace(/[₺₼$€£]|TL|tl|TRY|try/g, '');
  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  if (lastComma >= 0 && lastDot >= 0) {
    s = lastComma > lastDot ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  } else if (lastComma >= 0) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (/^[+-]?\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, '');
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
}
function safeInt(v, fallback = 0) {
  const n = safeNum(v, fallback);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}
function safeTimestamp(v, fallback = 0) {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback;
  if (v instanceof Date) {
    const t = v.getTime();
    return Number.isFinite(t) ? t : fallback;
  }
  if (typeof v === 'object') {
    if (typeof v.toMillis === 'function') {
      const t = v.toMillis();
      return Number.isFinite(t) ? t : fallback;
    }
    if (Number.isFinite(v.seconds)) {
      const nanos = Number.isFinite(v.nanoseconds) ? v.nanoseconds : 0;
      return (v.seconds * 1000) + Math.floor(nanos / 1e6);
    }
  }
  if (typeof v === 'string') {
    const t = Date.parse(v);
    if (Number.isFinite(t)) return t;
  }
  return safeNum(v, fallback);
}
function clampNum(v, min, max, fallback = min) {
  const n = safeNum(v, fallback);
  return Math.min(max, Math.max(min, n));
}
function clampInt(v, min, max, fallback = min) {
  const n = safeInt(v, fallback);
  return Math.min(max, Math.max(min, n));
}
function minuteLabel(mins) {
  const n = ((safeInt(mins, 0) % 1440) + 1440) % 1440;
  return `${String(Math.floor(n / 60)).padStart(2,'0')}:${String(n % 60).padStart(2,'0')}`;
}
function getMonthlyHours(u) {
  const mh = safeNum(u && u.monthlyHours, 0);
  return mh > 0 ? mh : 225;
}
function getWeeklyContractHours(u) {
  return clampNum(u && u.weeklyContractHours, 15, 45, 45);
}
function getPayrollHourBasis(u, y) {
  return Math.max(1, safeNum(payrollCfg(y).monthlyStandardHours, 225));
}
function getStandardDailyHours(u) {
  return Math.max(1, getMonthlyHours(u) / 30);
}
function getOTRate(u) {
  return clampNum(u && u.otCompRate, 1.5, 3, 1.5);
}
function getOTCompLeaveHours(u, leave) {
  const stored = safeNum(leave && leave.hours, 0);
  return stored > 0 ? stored : 8;
}
function validateShiftInput(start, end, breakMinutes, opts = {}) {
  const st = parseTime(start), en = parseTime(end);
  if (st === null || en === null) return { ok:false, msg:'Saatleri girin' };
  if (st === en) return { ok:false, msg:'Giriş ve çıkış aynı olamaz' };
  let grossMin = en - st;
  if (grossMin <= 0) grossMin += 1440;
  const grossHours = grossMin / 60;
  if (grossHours <= 0) return { ok:false, msg:'Geçersiz süre' };
  if (grossHours > MAX_GROSS_HOURS) return { ok:false, msg:`Vardiya ${MAX_GROSS_HOURS}s brüt aşamaz` };
  const br = safeInt(breakMinutes, 0);
  if (br < 0) return { ok:false, msg:'Mola negatif olamaz' };
  if (br >= grossMin) return { ok:false, msg:`Mola süresi (${br} dk) vardiya toplam süresini (${grossMin} dk) aşıyor` };
  const netHours = (grossMin - br) / 60;
  if (netHours <= 0) return { ok:false, msg:'Mola vardiya süresinden uzun olamaz' };
  return { ok:true, start, end, breakMinutes:br, grossMin, grossHours, netHours };
}
function ageOnDate(birthDate, refDate = new Date()) {
  if (!birthDate) return null;
  const b = new Date(birthDate), r = refDate instanceof Date ? refDate : new Date(refDate);
  if (Number.isNaN(b.getTime()) || Number.isNaN(r.getTime()) || b > r) return null;
  let age = r.getFullYear() - b.getFullYear();
  const beforeBirthday = r.getMonth() < b.getMonth() || (r.getMonth() === b.getMonth() && r.getDate() < b.getDate());
  if (beforeBirthday) age--;
  return Math.max(0, age);
}
function annualLeaveTotal(u) {
  const manual = Math.max(0, safeInt(u && u.annualLeave, 0));
  const legal = statutoryAnnualLeaveFromStart(u && u.startDate, u && u.birthDate);
  return Math.max(manual, legal || 0);
}
function statutoryAnnualLeaveFromStart(startDate, birthDate) {
  if (!startDate) return null;
  const s = new Date(startDate), n = new Date();
  if (Number.isNaN(s.getTime()) || s > n) return 0;
  const yr = (n - s) / (365.25 * 864e5);
  if (yr < 1) return 0;
  const base = yr >= 15 ? 26 : yr >= 5 ? 20 : 14;
  const age = ageOnDate(birthDate, n);
  return (age !== null && (age < 18 || age >= 50)) ? Math.max(base, 20) : base;
}

function parseDS(ds) {
  if (!ds || typeof ds !== 'string') return null;
  const p = ds.split('-');
  if (p.length !== 3) return null;
  const y = parseInt(p[0]), m = parseInt(p[1]) - 1, d = parseInt(p[2]);
  if (isNaN(y) || isNaN(m) || isNaN(d) || m < 0 || m > 11 || d < 1) return null;
  const mx = new Date(y, m + 1, 0).getDate();
  if (d > mx) return null;
  return { y, m, d };
}

function dsToDate(ds) {
  const p = parseDS(ds);
  if (!p) return new Date();
  /* [FIX ERR-HANDLE-02] Date constructor month overflow koruması (ör. 31 Nisan → 1 Mayıs) */
  const d = new Date(p.y, p.m, p.d);
  if (d.getFullYear() !== p.y || d.getMonth() !== p.m || d.getDate() !== p.d) return new Date();
  return d;
}

function dStr(d) {
  if (!(d instanceof Date) || isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function fm(n) {
  return formatTRY(n, 0);
}
function formatTRY(n, fractionDigits = 2) {
  const v = safeNum(n, 0);
  const fd = clampInt(fractionDigits, 0, 2, 2);
  return '₺' + v.toLocaleString('tr-TR', { minimumFractionDigits:fd, maximumFractionDigits:fd });
}
function formatNumTR(n, fractionDigits = 2) {
  const v = safeNum(n, 0);
  const fd = clampInt(fractionDigits, 0, 4, 2);
  return v.toLocaleString('tr-TR', { minimumFractionDigits:fd, maximumFractionDigits:fd });
}

function cu() {
  if (!S.cu || !S.u[S.cu]) return null;
  return S.u[S.cu];
}

function toast(msg, type = 'info') {
  const c = $('toastContainer'); if (!c) return;
  const ic = { success:'fa-check-circle', error:'fa-times-circle', info:'fa-info-circle', warning:'fa-exclamation-triangle' };
  const t = document.createElement('div');
  t.className = `toast t-${type}`;
  t.innerHTML = `<i class="fas ${ic[type] || ic.info}"></i><span>${escHtml(msg)}</span>`;
  c.appendChild(t);
  setTimeout(() => {
    t.classList.add('toast-out');
    setTimeout(() => { if (t.parentNode) t.remove(); }, 350);
  }, 2500);
}

function showConfirm(title, msg, cb) {
  setTxt('confirmTitle', title);
  setTxt('confirmMsg', msg);
  confirmCallback = cb;
  const co = $('confirmOverlay'); if (co) co.classList.add('show');
}
function confirmOk() {
  const co = $('confirmOverlay'); if (co) co.classList.remove('show');
  if (typeof confirmCallback === 'function') confirmCallback();
  confirmCallback = null;
}
function confirmCancel() {
  const co = $('confirmOverlay'); if (co) co.classList.remove('show');
  confirmCallback = null;
}

function getH(ds) {
  const h = getHoliday(ds);
  return h ? h.n : null;
}
function getHoliday(ds) {
  const p = parseDS(ds); if (!p) return null;
  const y = p.y, m = p.m + 1, day = p.d;
  for (const h of FH) if (h.m === m && h.d === day) return h;
  const r = RH[y];
  if (r) for (const h of r) if (h.m === m && h.d === day) return h;
  return null;
}
function holidayWeight(ds) {
  const h = getHoliday(ds);
  return h ? (h.half ? 0.5 : 1) : 0;
}
function holidayPayWeight(ds, sh) {
  const parts = getShiftDayParts(ds, sh);
  if (!parts.length) return 0;
  return parts.reduce((sum, part) => sum + holidayPayWeightForPart(part), 0);
}

function getShiftDayParts(ds, sh) {
  const p = parseDS(ds);
  const st = parseTime(sh && sh.start), en = parseTime(sh && sh.end);
  if (!p || st === null || en === null || st === en) return [];
  let gross = en - st;
  if (gross <= 0) gross += 1440;
  if (gross / 60 > MAX_GROSS_HOURS) return [];
  const br = Math.max(0, safeInt(sh.break, 0));
  const net = Math.max(0, Math.min(gross, gross - br));
  if (gross <= 0 || net <= 0) return [];
  const ratio = net / gross;
  const base = new Date(p.y, p.m, p.d);
  const firstGross = Math.min(gross, 1440 - st);
  const out = [];
  if (firstGross > 0) {
    out.push({ ds, hours:firstGross * ratio / 60, startMin:st, endMin:st + firstGross });
  }
  const secondGross = gross - firstGross;
  if (secondGross > 0) {
    const next = new Date(base);
    next.setDate(base.getDate() + 1);
    out.push({ ds:dStr(next), hours:secondGross * ratio / 60, startMin:0, endMin:secondGross });
  }
  return out;
}

// Gece çalışma saati hesabı (4857/69) — parça bazında, [20:00, 06:00] ile kesişim.
// part.startMin, part.endMin aynı takvim günü içindedir; mola düşülmüş çalışılan oranla ölçeklenir.
function nightHoursForPart(part) {
  if (!part || !(part.hours > 0)) return 0;
  const s = safeNum(part.startMin, 0);
  const e = safeNum(part.endMin, 0);
  const span = Math.max(0, e - s);
  if (span <= 0) return 0;
  // Part'ın ait olduğu yılın config'ini kullan; bulunamazsa mevcut yıla fallback
  const _partYear = (parseDS(part.ds) || {}).y || new Date().getFullYear();
  const _cfg = payrollCfg(_partYear);
  const nightStart = _cfg.nightStartMin || 1200;
  const nightEnd   = _cfg.nightEndMin   || 360;
  const overlap = (a, b, c, d) => Math.max(0, Math.min(b, d) - Math.max(a, c));
  // Gece pencereleri: [00:00, 06:00) ve [20:00, 24:00)
  const nightMin = overlap(s, e, 0, nightEnd) + overlap(s, e, nightStart, 1440);
  // Mola/ratio: gerçek çalışılan saat = part.hours; brüt aralık = span/60
  const grossH = span / 60;
  if (grossH <= 0) return 0;
  return (nightMin / 60) * (part.hours / grossH);
}

function holidayPayWeightForPart(part) {
  const h = getHoliday(part && part.ds);
  if (!h || !part || part.hours <= 0) return 0;
  if (!h.half) return 1;
  /* [FIX P8] Yarım tatil 13:00'tan sonra başlar; sadece 13:00 sonrası kısım oransal sayılır.
     11 saatlik referans pencere (13:00–24:00) üzerinden 0.5 azami ağırlık. */
  const noonStart = 13 * 60;
  const dayEnd = 24 * 60;
  const halfWindow = dayEnd - noonStart;
  const overlap = Math.max(0, Math.min(part.endMin, dayEnd) - Math.max(part.startMin, noonStart));
  if (overlap <= 0) return 0;
  return Math.min(0.5, (overlap / halfWindow) * 0.5);
}
/* [FIX N-05] RH veri kapsamı dışındaki yıllar için uyarı — session başına bir kez */
const _rhWarnedYears = new Set();
function isH(ds) {
  const _p = parseDS(ds);
  if (_p && _p.y > 2032 && !_rhWarnedYears.has(_p.y)) {
    _rhWarnedYears.add(_p.y);
    console.warn(`[Shiftt] ${_p.y} yılı dini tatil verisi eksik (kapsam: 2024–2032). Ramazan/Kurban tatilleri bu yıl için hesaplanamıyor.`);
    setTimeout(() => toast(`⚠️ ${_p.y} yılı için dini tatil (Ramazan/Kurban) tarihleri tanımlı değil — uygulama kapsamı 2032'ye kadar. Tatil prim hesapları eksik olabilir.`, 'warning'), 400);
  }
  return getH(ds) !== null;
}

function parseTime(ts) {
  if (!ts || typeof ts !== 'string') return null;
  const p = ts.split(':');
  if (p.length !== 2) return null;
  const h = safeInt(p[0], NaN), m = safeInt(p[1], NaN);
  if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

function calcHr(s, e, b) {
  const st = parseTime(s), en = parseTime(e);
  if (st === null || en === null || st === en) return 0;
  let d = en - st;
  if (d <= 0) d += 1440;
  b = Math.max(0, safeInt(b, 0));
  const net = (d - b) / 60;
  return Math.min(Math.max(0, net), 24);
}

function grossHr(s, e) {
  const st = parseTime(s), en = parseTime(e);
  if (st === null || en === null || st === en) return 0;
  let d = en - st;
  if (d <= 0) d += 1440;
  return Math.max(0, d / 60);
}

function getShiftPartRows(u, filterFn) {
  const rows = [];
  Object.entries((u && u.shifts) || {}).forEach(([startDs, sh]) => {
    if (!sh || !sh.start || !sh.end) return;
    getShiftDayParts(startDs, sh).forEach((part, idx) => {
      if (!part || !part.ds || part.hours <= 0) return;
      const dt = dsToDate(part.ds);
      if (!dt || isNaN(dt.getTime())) return;
      const row = {
        ...part,
        sourceDs:startDs,
        sh,
        partIndex:idx,
        dt,
        wk:getISOWeek(dt),
        startLabel:minuteLabel(part.startMin),
        endLabel:minuteLabel(part.endMin)
      };
      if (!filterFn || filterFn(row)) rows.push(row);
    });
  });
  rows.sort((a, b) => (a.dt - b.dt) || ((a.startMin || 0) - (b.startMin || 0)) || a.sourceDs.localeCompare(b.sourceDs));
  return rows;
}

function getShiftPartsForDate(u, ds) {
  return getShiftPartRows(u, part => part.ds === ds);
}

function getShiftPartsForMonth(u, y, m) {
  return getShiftPartRows(u, part => {
    const p = parseDS(part.ds);
    return p && p.y === y && p.m === m;
  });
}

function getShiftHoursForDate(u, ds) {
  return getShiftPartsForDate(u, ds).reduce((sum, part) => sum + Math.max(0, part.hours || 0), 0);
}

function getAllWorkedDates(u) {
  return new Set(getShiftPartRows(u).map(part => part.ds));
}

function normalizeShiftRecord(sh) {
  if (!sh || typeof sh !== 'object') return null;
  const check = validateShiftInput(sh.start, sh.end, sh.break || 0);
  if (!check.ok) return null;
  return {
    start:check.start,
    end:check.end,
    break:check.breakMinutes,
    note:typeof sh.note === 'string' ? sh.note.substring(0, 100) : '',
    updatedAt:safeTimestamp(sh.updatedAt, 0)
  };
}

function normalizeLeaveRecord(lv) {
  if (!lv || typeof lv !== 'object' || !lv.type) return null;
  const allowed = new Set(['annual','weekly','public_holiday','sick','unpaid','ot_comp']);
  const type = allowed.has(lv.type) ? lv.type : null;
  if (!type) return null;
  const out = {
    type,
    note:typeof lv.note === 'string' ? lv.note.substring(0, 100) : '',
    updatedAt:safeTimestamp(lv.updatedAt, 0)
  };
  if (type === 'ot_comp') out.hours = getOTCompLeaveHours(null, lv);
  return out;
}

function normalizeUserCalculations(u) {
  if (!u || typeof u !== 'object') return u;
  u.netSalary = Math.max(0, safeNum(u.netSalary, 0));
  u.annualLeave = clampInt(u.annualLeave, 0, 40, 0);
  u.monthlyHours = clampInt(u.monthlyHours || 225, 100, 400, 225);
  u.weeklyContractHours = clampInt(u.weeklyContractHours, 15, 45, 45);
  u.payMode = (u.payMode === 'hourly') ? 'hourly' : 'monthly';
  u.goalHours = Math.max(0, safeNum(u.goalHours, 0));
  u.goalEarning = Math.max(0, safeNum(u.goalEarning, 0));
  u.otCompMode = u.otCompMode === 'leave' ? 'leave' : 'pay';
  u.otCalcMode = (u.otCalcMode === 'daily75' || u.otCalcMode === 'hybrid') ? u.otCalcMode : 'weekly45';
  u.otCompRate = getOTRate(u);
  u.otBalance = Math.max(0, safeNum(u.otBalance, 0));
  u.otCompModeChangedAt = safeTimestamp(u.otCompModeChangedAt, 0);
  if (!Array.isArray(u.otCompModeHistory)) u.otCompModeHistory = [];
  if (!u.shifts || typeof u.shifts !== 'object') u.shifts = {};
  if (!u.leaves || typeof u.leaves !== 'object') u.leaves = {};
  Object.keys(u.shifts).forEach(ds => {
    const p = parseDS(ds), sh = normalizeShiftRecord(u.shifts[ds]);
    if (!p || !sh) delete u.shifts[ds];
    else u.shifts[ds] = sh;
  });
  Object.keys(u.leaves).forEach(ds => {
    const p = parseDS(ds), lv = normalizeLeaveRecord(u.leaves[ds]);
    if (!p || !lv || (lv.type === 'public_holiday' && !isH(ds))) delete u.leaves[ds];
    else u.leaves[ds] = lv;
  });
  return u;
}

/* [FIX] Gece vardiyası tespiti */
function isNightShift(start, end) {
  const st = parseTime(start), en = parseTime(end);
  if (st === null || en === null) return false;
  if (en === 0) return false; // 00:00 bitiş = gece yarısında sona eriyor, ertesi güne taşmıyor
  return en < st; // çıkış < giriş → gece geçişi (örn. 22:00–06:00)
}

/* [FIX HESAP-MANTIK-01] UTC-bazlı ISO hafta hesabı — DST sapmalarını önler */
/* [N-07] Date.UTC() kullanımı DST-safe'dir: yerel saat diliminden bağımsız UTC zaman damgaları karşılaştırılır.
   Yıl sınırı geçişleri (Aralık 31 → sonraki yılın W01) "YYYY-Wnn" formatı sayesinde doğru işlenir. */
function getISOWeek(d) {
  const y = d.getFullYear(), m = d.getMonth(), day2 = d.getDate();
  const ts      = Date.UTC(y, m, day2);
  const jan4    = Date.UTC(y, 0, 4);
  const dow4    = new Date(jan4).getUTCDay() || 7;
  const w1start = jan4 - (dow4 - 1) * 864e5;
  const diff    = ts - w1start;
  if (diff < 0) {
    const pJan4   = Date.UTC(y - 1, 0, 4);
    const pDow4   = new Date(pJan4).getUTCDay() || 7;
    const pW1start = pJan4 - (pDow4 - 1) * 864e5;
    return (y - 1) + '-W' + String(Math.ceil((ts - pW1start) / (7 * 864e5))).padStart(2, '0');
  }
  const wk = Math.floor(diff / (7 * 864e5)) + 1;
  const dec31Dow = new Date(Date.UTC(y, 11, 31)).getUTCDay() || 7;
  const jan1Dow  = new Date(Date.UTC(y, 0, 1)).getUTCDay() || 7;
  const maxWeeks = (dec31Dow >= 4 || jan1Dow === 4) ? 53 : 52;
  if (wk > maxWeeks) return (y + 1) + '-W01';
  return y + '-W' + String(wk).padStart(2, '0');
}

/* [FIX] getStreak — hafta sonu atlaması sınırlandırıldı (max 3 gün atlama)
   [FIX BUG-07] Ücretsiz izin günleri seri sayısına dahil edilmez */
function getStreak() {
  const u = cu(); if (!u) return 0;
  let streak = 0, skipCount = 0;
  const today = new Date();
  let d = new Date(today);
  const todayDs = dStr(today);
  const todayActive = u.shifts[todayDs] || (u.leaves[todayDs] && u.leaves[todayDs].type !== 'unpaid');
  if (!todayActive) {
    d.setDate(d.getDate() - 1);
  }
  for (let g = 0; g < 400; g++) {
    const ds = dStr(d);
    if (!ds) break;
    const lv = u.leaves[ds];
    const isActive = u.shifts[ds] || (lv && lv.type !== 'unpaid');
    if (isActive) {
      streak++;
      skipCount = 0;
      d.setDate(d.getDate() - 1);
    } else {
      const dow = d.getDay();
      if ((dow === 0 || dow === 6 || isH(ds)) && skipCount < 3) {
        skipCount++;
        d.setDate(d.getDate() - 1);
        continue;
      }
      break;
    }
  }
  return streak;
}

function getAnnualUsed(uid, yr, excArr) {
  const u = S.u[uid]; if (!u) return 0;
  const excSet = new Set(Array.isArray(excArr) ? excArr : (excArr ? [excArr] : []));
  let c = 0;
  Object.entries(u.leaves).forEach(([k, v]) => {
    if (!v || v.type !== 'annual') return;
    const p = parseDS(k); if (!p || p.y !== yr) return;
    if (!isAnnualLeaveChargeable(k)) return;
    if (excSet.has(k)) return;
    c++;
  });
  return c;
}

function isAnnualLeaveChargeable(ds) {
  const p = parseDS(ds); if (!p) return false;
  const d = new Date(p.y, p.m, p.d);
  const dow = d.getDay();
  return dow !== 0 && dow !== 6 && !isH(ds);
}

/* [FEAT F3] Yıllık toplam FM (yasal sınır 270s — İş K. Md.41) */
function getYearlyOT(yr) {
  let sum = 0;
  for (let mm = 0; mm < 12; mm++) {
    const md = getMD(yr, mm);
    sum += safeNum(md.oh, 0) + safeNum(md.oh125, 0);
  }
  return sum;
}
/* [FEAT F3] Son 3 aylık FM toplamı (Md.41 — 3 ayda 90s önerisi) */
function getQuarterlyOT(yr, mo) {
  let sum = 0;
  for (let i = 0; i < 3; i++) {
    let mm = mo - i, yy = yr;
    if (mm < 0) { mm += 12; yy--; }
    sum += safeNum(getMD(yy, mm).oh, 0);
  }
  return sum;
}

/* ============================================================
   CACHE
============================================================ */
function invalidateMDCache(uid, y, m) {
  if (uid !== undefined && y !== undefined && m !== undefined) {
    const prefix = `${uid}-${y}-${m}-`;
    Object.keys(mdCache).forEach(k => { if (k === `${uid}-${y}-${m}` || k.startsWith(prefix)) delete mdCache[k]; });
    delete yearlyOTCache[`${uid}-${y}`];
    if (y !== undefined) delete _payrollCfgCache[String(y)];
  } else {
    mdCache = {};
    yearlyOTCache = {};
    _payrollCfgCache = {};
  }
}

/* ============================================================
   [FIX] MONTH DATA (getMD) — Hafta-ay sınırı düzeltildi
   Artık ISO hafta anahtarı kullanılıyor, ay sınırı yapay eklentisi kaldırıldı.
   Bir ISO haftası iki aya taşarsa, her iki aydaki saatler gerçek hafta toplamında
   birleştirilir. FM hesabı doğru hafta bazında yapılır.
============================================================ */
function getMD(y, m, opts = {}) {
  const u = cu();
  const dim = new Date(y, m + 1, 0).getDate();
  const throughDay = opts && opts.throughDay !== undefined ? clampInt(opts.throughDay, 0, dim, dim) : null;
  const empty = { th:0, rh:0, oh:0, oh125:0, nh:0, hh:0, hhOT:0, hpd:0, wd:0, workDayEquiv:0, hdw:0, wh:{}, wr:0, weeklyRestDays:0, publicHolidayPaidDays:0, ud:0, yau:0, ysd:0, mau:0, msd:0, hr:0, dim, weekendHours:0, weekendWorkedDays:0, weekTotalHrs:{}, weekMonthOTHrs:{}, weekMonthOT125Hrs:{}, weeklyContractHours:45 };
  if (!u) return empty;

  const ck = `${S.cu}-${y}-${m}-${throughDay === null ? 'all' : throughDay}`;
  if (mdCache[ck]) return mdCache[ck];

  let th = 0, hh = 0, hpd = 0;
  const _mh = getMonthlyHours(u);
  const standardDailyHours = Math.max(1, _mh / 30);
  // [FIX] Sözleşmesel haftalık saat (<45) — fazla çalışma %25 zam, fazla mesai %50 zam ayrımı (4857/41/4)
  const weeklyContractHours = getWeeklyContractHours(u);

  // Bu aydaki her gün için: hangi ISO haftasında, kaç saat, tatil mi?
  // dayData[isoWeek] = { monthHrs, monthHolHrs }
  const weekMonthHrs = {};  // isoWeek -> bu aydaki saatler
  const weekMonthHolHrs = {}; // isoWeek -> bu aydaki tatil saatleri
  const weekTotalHrs = {};  // isoWeek -> tüm hafta boyunca toplam (diğer aylar dahil)
  const weekTotalHolHrs = {}; // isoWeek -> tüm hafta tatil saatleri
  const weekMonthRegularHrs = {};
  const weekMonthOTHrs = {};        // %50 zamlı (haftalık 45 saat üstü)
  const weekMonthOT125Hrs = {};     // %25 zamlı (sözleşme saati .. 45 arası, fazla çalışma)
  const weekMonthHolOTHrs = {};
  const allParts = [];
  const workDateHours = {};
  const holidayWorkedDates = new Set();
  const weekendWorkedDates = new Set();

  Object.entries(u.shifts || {}).forEach(([startDs, sh]) => {
    if (!sh || !sh.start || !sh.end) return;
    const parts = getShiftDayParts(startDs, sh);
    parts.forEach(part => {
      if (!part || part.hours <= 0 || !part.ds) return;
      const pp = parseDS(part.ds);
      if (throughDay !== null && pp && pp.y === y && pp.m === m && pp.d > throughDay) return;
      const dt = dsToDate(part.ds);
      if (!dt || isNaN(dt.getTime())) return;
      allParts.push({
        ...part,
        startDs,
        sh,
        dt,
        wk: getISOWeek(dt)
      });
    });
  });
  allParts.sort((a, b) => (a.dt - b.dt) || ((a.startMin || 0) - (b.startMin || 0)));

  let nh = 0;
  allParts.forEach(part => {
    const p = parseDS(part.ds);
    if (!p || p.y !== y || p.m !== m) return;
    const hrs = part.hours;
    th += hrs;
    workDateHours[part.ds] = (workDateHours[part.ds] || 0) + hrs;
    nh += nightHoursForPart(part);
    const wk = part.wk;
    if (!weekMonthHrs[wk]) weekMonthHrs[wk] = 0;
    weekMonthHrs[wk] += hrs;
    const holidayPayDays = holidayPayWeightForPart(part);
    if (isH(part.ds)) {
      hh += hrs;
      holidayWorkedDates.add(part.ds);
      if (!weekMonthHolHrs[wk]) weekMonthHolHrs[wk] = 0;
      weekMonthHolHrs[wk] += hrs;
    }
    const dow = part.dt.getDay();
    if (dow === 0 || dow === 6) {
      weekendWorkedDates.add(part.ds);
    }
    if (holidayPayDays > 0) hpd += holidayPayDays;
  });

  // Şimdi bu aydaki haftaların GERÇEK toplam saatlerini hesapla
  // (aynı ISO haftasına düşen diğer ayların günlerini de tara)
  const weeksInMonth = Object.keys(weekMonthHrs);
  for (const wk of weeksInMonth) {
    let totalH = 0, totalHolH = 0;
    let regularLeft = weeklyContractHours;        // sözleşmesel saate kadar normal
    let partialLeft = Math.max(0, 45 - weeklyContractHours); // sözleşme..45 arası %25 zam
    allParts.filter(part => part.wk === wk).forEach(part => {
      let hrs = part.hours;
      const regular = Math.min(hrs, Math.max(0, regularLeft));
      regularLeft = Math.max(0, regularLeft - regular);
      hrs -= regular;
      const partialOT = Math.min(hrs, Math.max(0, partialLeft));
      partialLeft = Math.max(0, partialLeft - partialOT);
      hrs -= partialOT;
      const overtime = Math.max(0, hrs); // 45 saat üstü, %50 zam
      const pp = parseDS(part.ds);
      const inTargetMonth = pp && pp.y === y && pp.m === m;
      totalH += part.hours;
      if (isH(part.ds)) totalHolH += part.hours;
      if (inTargetMonth) {
        weekMonthRegularHrs[wk] = (weekMonthRegularHrs[wk] || 0) + regular;
        weekMonthOT125Hrs[wk] = (weekMonthOT125Hrs[wk] || 0) + partialOT;
        weekMonthOTHrs[wk] = (weekMonthOTHrs[wk] || 0) + overtime;
        if (isH(part.ds)) weekMonthHolOTHrs[wk] = (weekMonthHolOTHrs[wk] || 0) + overtime;
      }
    });
    weekTotalHrs[wk] = totalH;
    weekTotalHolHrs[wk] = totalHolH;
  }

  // FM hesabı: ISO hafta içinde gün sırasına göre 45 saat dolduktan sonra yazılır.
  let oh = 0, oh125 = 0, rh = 0, hhOT = 0;
  for (const wk of weeksInMonth) {
    rh += weekMonthRegularHrs[wk] || 0;
    oh125 += weekMonthOT125Hrs[wk] || 0;
    oh += weekMonthOTHrs[wk] || 0;
    hhOT += weekMonthHolOTHrs[wk] || 0;
  }
  const weeklyOh = oh;
  const weeklyOh125 = oh125;

  /* [FIX OT-DAILY] Günlük FM hesap modu — kullanıcı sözleşmesi günlük 7,5 üstünü FM
     sayıyorsa hafta tamamlanmasını beklemeden günlük olarak işlenir.
     Modlar: 'weekly45' (varsayılan, 4857/41), 'daily75' (sadece günlük), 'hybrid' (max).
     Hybrid: günlük 7,5 üstü VE haftalık 45 üstü ayrı hesaplanır, hangisi büyükse o ödenir
     (çift sayım önlenir). */
  const otCalcMode = (u && (u.otCalcMode === 'daily75' || u.otCalcMode === 'hybrid')) ? u.otCalcMode : 'weekly45';
  const dailyStdH = Math.min(7.5, standardDailyHours);
  if (otCalcMode !== 'weekly45') {
    // Günlük eşik takvim günü bazında uygulanır; gece/ay geçişlerinde parça kendi ayına yazılır.
    const shiftDailyHrs = {};   // ds -> o takvim günündeki toplam çalışılan net saat
    Object.entries(u.shifts || {}).forEach(([startDs, sh]) => {
      if (!sh || !sh.start || !sh.end) return;
      const parts = getShiftDayParts(startDs, sh);
      parts.forEach(p2 => {
        const pp = parseDS(p2 && p2.ds);
        if (!pp || pp.y !== y || pp.m !== m) return;
        if (throughDay !== null && pp.d > throughDay) return;
        shiftDailyHrs[p2.ds] = (shiftDailyHrs[p2.ds] || 0) + Math.max(0, p2.hours || 0);
      });
    });
    let dailyOT = 0;
    let dailyHolOT = 0;
    Object.entries(shiftDailyHrs).forEach(([startDs, total]) => {
      const over = Math.max(0, total - dailyStdH);
      if (over > 0) {
        dailyOT += over;
        if (isH(startDs)) dailyHolOT += over;
      }
    });
    const dailyOT125 = Math.min(dailyOT, weeklyOh125);
    const dailyOT50 = Math.max(0, dailyOT - dailyOT125);
    if (otCalcMode === 'daily75') {
      // Günlük eşik uygulanırken sözleşme-45 arası %25 ayrımı korunur; tatil OT ayrı izlenir.
      oh = dailyOT50;
      oh125 = dailyOT125;
      hhOT = dailyHolOT;
      rh = Math.max(0, th - oh - oh125);
    } else {
      // hybrid: haftalık ve günlük sonucu prim katsayılı değerle karşılaştır.
      const partialRate = payrollCfg(y).otPartialMultiplier || 1.25;
      const weeklyWeighted = (weeklyOh * 1.5) + (weeklyOh125 * partialRate);
      const dailyWeighted = (dailyOT50 * 1.5) + (dailyOT125 * partialRate);
      if (dailyWeighted > weeklyWeighted) {
        oh = dailyOT50;
        oh125 = dailyOT125;
        hhOT = dailyHolOT;
        rh = Math.max(0, th - oh - oh125);
      }
      // Aksi halde mevcut weekly değerleri kalır
    }
  }

  let yau = 0, ysd = 0, mau = 0, msd = 0, wr = 0, weeklyRestDays = 0, publicHolidayPaidDays = 0, ud = 0, otcm = 0;
  Object.entries(u.leaves).forEach(([k, v]) => {
    const p = parseDS(k); if (!p || !v || !v.type) return;
    const withinCutoff = throughDay === null || p.y !== y || p.m !== m || p.d <= throughDay;
    /* [FIX BLOKE-01] Import/merge çakışması: aynı gün hem shift hem leave olursa
       shift öncelikli — yıllık (yau/ysd) ve aylık sayaçların tümünü atla. */
    if (u.shifts && u.shifts[k]) return;
    if (p.y === y && withinCutoff) { if (v.type === 'annual') yau++; if (v.type === 'sick') ysd++; }
    if (p.y === y && p.m === m) {
      if (!withinCutoff) return;
      /* [FIX BLOKE-01] Import/merge çakışması: aynı gün hem shift hem leave olursa
         shift öncelikli — leave döngüsündeki aylık ücretli gün sayımını atla. */
      if (u.shifts && u.shifts[k]) return;
      if (v.type === 'annual') mau++;
      if (v.type === 'sick') msd++;
      if (v.type === 'weekly') { wr++; weeklyRestDays++; }
      if (v.type === 'public_holiday' && isH(k)) {
        const hw = holidayWeight(k) || 1;
        wr += hw;
        publicHolidayPaidDays += hw;
      }
      if (v.type === 'unpaid') ud++;
      /* [FIX] FM İzni — ücretli, yıllık izinden bağımsız, otBalance'tan düşülür */
      if (v.type === 'ot_comp') otcm += Math.min(1, getOTCompLeaveHours(u, v) / standardDailyHours);
    }
  });

  const hr = (u.netSalary > 0 && _mh > 0) ? u.netSalary / _mh : 0;
  const isHourly = u && u.payMode === 'hourly';
  const workDayEquiv = Object.values(workDateHours).reduce((sum, hrs) => {
    const h = Math.max(0, safeNum(hrs, 0));
    return sum + (isHourly ? Math.min(1, h / standardDailyHours) : (h > 0 ? 1 : 0));
  }, 0);
  const wd = Object.keys(workDateHours).length;
  const hdw = holidayWorkedDates.size;
  const weekendHours = allParts.reduce((sum, part) => {
    const p = parseDS(part.ds);
    if (!p || p.y !== y || p.m !== m) return sum;
    const dow = part.dt.getDay();
    return (dow === 0 || dow === 6) ? sum + Math.max(0, part.hours || 0) : sum;
  }, 0);
  const weekendWorkedDays = weekendWorkedDates.size;
  // wh: dashboard haftalık chart için — bu aydaki saatler (görüntüleme amaçlı)
  const wh = weekMonthHrs;
  const r = { th, rh, oh, oh125, nh, hh, hhOT, hpd, wd, workDayEquiv, hdw, wh, wr, weeklyRestDays, publicHolidayPaidDays, ud, otcm, yau, ysd, mau, msd, hr, dim,
    weekendHours, weekendWorkedDays, weekTotalHrs, weekMonthOTHrs, weekMonthOT125Hrs, weeklyContractHours }; // chart'ta gerçek haftalık toplamı göstermek için
  mdCache[ck] = r;
  return r;
}

function getPrevMD() {
  let pm = S.cm - 1, py = S.cy;
  if (pm < 0) { pm = 11; py--; }
  return getMD(py, pm);
}

/* ============================================================
   EARNING CALCULATION
============================================================ */
function calcEarningForMonth(y, m, ns, opts = {}) {
  /* [FIX ERR-HANDLE-08] NaN/Infinity ns input'u red et */
  ns = safeNum(ns, 0);
  if (!ns || ns <= 0 || !Number.isFinite(ns)) return null;
  const u = cu(); if (!u) return null;
  const today = new Date();
  const tY = today.getFullYear(), tM = today.getMonth(), tD = today.getDate();
  const isCur = (y === tY && m === tM);
  const isFut = (y > tY || (y === tY && m > tM));
  const includeFutureRecords = !!(opts && opts.includeFutureRecords);
  const d = getMD(y, m, (isCur && !includeFutureRecords) ? { throughDay:tD } : undefined);
  /* [FIX BUG-02] Saatlik ücret hesabında kullanıcının monthlyHours'unu kullan */
  const _mh = getMonthlyHours(u);
  const dim = d.dim, dr = ns / 30;
  /* [FIX OT-GROSS] FM ve fazla çalışma ücreti 4857/41 gereği BRÜT saatlik ücret bazında
     hesaplanmalı. findGrossFromNet ikili arama ile net → brüt dönüşümü yapar.
     Taban maaş ve eksik gün hesabı net (dr) üzerinden kalmaya devam eder. */
  const _fullGrossForOT = (Number.isFinite(ns) && ns > 0)
    ? findGrossFromNet(ns, 'single', 0, 0, m, undefined, y)
    : 0;
  const hrGross = (_mh > 0 && _fullGrossForOT > 0) ? _fullGrossForOT / _mh : 0;
  const hr = _mh > 0 ? ns / _mh : 0;  // net saatlik oran (geriye dönük uyumluluk / display)

  let ev;
  if (isFut) ev = 0;
  else if (isCur) ev = Math.max(0, tD);
  else ev = dim;

  if (isFut) {
    return {
      dailyRate: dr, hourlyRate: hr, hourlyRateGross: hrGross, dailyRateGross: _fullGrossForOT > 0 ? _fullGrossForOT / 30 : dr,
      basePay: 0, overtimePay: 0, overtimePay125: 0, holidayPay: 0, totalEarning: 0,
      paidDays: 0, workedDays: d.wd || 0, workPaidDays: d.workDayEquiv || 0, weeklyDays: d.wr || 0,
      annualDays: d.mau || 0, sickDays: d.msd || 0, unpaidDays: d.ud || 0, otCompDays: d.otcm || 0,
      missingDays: 0, absentDays: 0, freePassDays: 0,
      dim, totalHours: d.th || 0, overtimeHours: d.oh || 0, overtimeHours125: d.oh125 || 0,
      holidayHours: d.hh || 0, holidayDays: d.hdw || 0, holidayPayDays: d.hpd !== undefined ? d.hpd : d.hdw,
      hhOT: d.hhOT || 0, otCompMode: u.otCompMode || 'pay', partialRate: payrollCfg(y).otPartialMultiplier,
      isFullMonth: false, isCurrentMonth: false, isFutureMonth: true, forecastOnly: true, evaluableDays: 0
    };
  }

  let fp = 0;
  for (let day = 1; day <= ev; day++) {
    const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    if (u.shifts[ds] || u.leaves[ds]) continue;
    const dt = new Date(y, m, day);
    const dow = dt.getDay();
    if (dow === 0 || dow === 6) fp++;
    else fp += holidayWeight(ds);
  }

  /* [FIX] otcm (FM İzni günleri) ücretli gün sayısına dahil edilir */
  const workPaidDays = Number.isFinite(d.workDayEquiv) ? d.workDayEquiv : d.wd;
  const pd = workPaidDays + d.wr + d.mau + d.msd + (d.otcm || 0);
  const mis = Math.max(0, ev - pd - d.ud - fp);
  const ab = d.ud + mis;
  /* Günlük (G) sözleşmelerde gerçek ay gün sayısı üzerinden baz ücret hesaplanır.
     Ocak (31g) → 31×dr, Şubat (28g) → 28×dr. Aylık sabit için 30-günlük ayda fark yok. */
  const bp = Math.max(0, dim * dr - (ab * dr));

  /* Md.47 tatil ilave ücreti = 1 günlük NET ücret (dr). Bordro doğrulaması:
     brüt extra (₺1.930,31) → marjinal vergi/SGK sonrası net = tam ₺1.380 = dr. */
  const _hpd = (d.hpd !== undefined ? d.hpd : d.hdw) || 0;
  const hp = _hpd * dr;
  /* [FIX] otCompMode: 'leave' modunda FM eki ödenmez, saatler bakiyeye eklenir */
  const compMode = u.otCompMode || 'pay';
  const compRate = getOTRate(u);
  const partialRate = payrollCfg(y).otPartialMultiplier;
  /* Ekran TAHMİNİ NET gösterdiği için FM net saatlik ücret (hr) üzerinden hesaplanır.
     hrGross referans/bilgi amaçlı return objesinde tutulmaya devam eder. */
  const op    = compMode === 'leave' ? 0 : (d.oh    || 0) * hr * compRate;
  /* [FIX P4] Sözleşme <45s sözleşmeli için fazla sürelerle çalışma %25 zamlı (4857/41/4) */
  const op125 = compMode === 'leave' ? 0 : (d.oh125 || 0) * hr * partialRate;
  /* [FIX ERR-HANDLE-08] NaN propagation engellendi — bozuk md sonuçları 0'a sabitlenir */
  const teRaw = bp + op + op125 + hp;
  const te = Number.isFinite(teRaw) ? Math.max(0, teRaw) : 0;

  return {
    dailyRate: dr, hourlyRate: hr, hourlyRateGross: hrGross, dailyRateGross: _fullGrossForOT > 0 ? _fullGrossForOT / 30 : dr,
    basePay: bp, overtimePay: op, overtimePay125: op125, holidayPay: hp, totalEarning: te,
    paidDays: Math.round((dim - ab) * 100) / 100, workedDays: d.wd, workPaidDays: Math.round(workPaidDays * 100) / 100, weeklyDays: d.wr,
    annualDays: d.mau, sickDays: d.msd, unpaidDays: d.ud, otCompDays: d.otcm || 0,
    missingDays: mis, absentDays: ab, freePassDays: fp,
    dim, totalHours: d.th, overtimeHours: d.oh, overtimeHours125: d.oh125 || 0,
    holidayHours: d.hh, holidayDays: d.hdw, holidayPayDays: d.hpd !== undefined ? d.hpd : d.hdw,
    hhOT: d.hhOT || 0, otCompMode: compMode, partialRate,
    isFullMonth: ab === 0 && !isCur && !isFut,
    isCurrentMonth: isCur, isFutureMonth: isFut, evaluableDays: ev
  };
}

/* ============================================================
   LOCAL AI ASSISTANT MVP
============================================================ */
function buildAIContext(user, year, month) {
  const u = user || cu();
  const y = Number.isInteger(year) ? year : S.cy;
  const m = Number.isInteger(month) ? month : S.cm;
  const today = new Date();
  const isCurrentMonth = y === today.getFullYear() && m === today.getMonth();
  const md = getMD(y, m, isCurrentMonth ? { throughDay:today.getDate() } : undefined);
  const salary = safeNum(u && u.netSalary, 0);
  const earning = salary > 0 ? calcEarningForMonth(y, m, salary) : null;
  const monthlyHours = getMonthlyHours(u);
  const shiftCount = u ? new Set(getShiftPartsForMonth(u, y, m).map(part => part.sourceDs || part.ds)).size : 0;
  const leaveCount = u && u.leaves ? Object.keys(u.leaves).filter(ds => {
    const p = parseDS(ds);
    return p && p.y === y && p.m === m;
  }).length : 0;
  const payrollSessionMatches = (typeof _eBordroSession !== 'undefined' && _eBordroSession && _eBordroSession.result &&
    _eBordroSession.y === y && _eBordroSession.m === m &&
    (_eBordroSession.userId === undefined || _eBordroSession.userId === S.cu));
  return {
    user: u, y, m, monthName: MTR[m], md, salary, earning, monthlyHours,
    shiftCount, leaveCount, isCurrentMonth,
    payroll: payrollSessionMatches ? _eBordroSession.result : null
  };
}

function generateEarningsForecast(ctx) {
  if (!ctx || !ctx.user) return { status:'empty', title:'Kullanıcı yok', lines:['Önce kullanıcı seçin.'] };
  if (!ctx.salary || ctx.salary <= 0) {
    return { status:'missing_salary', title:'Maaş bilgisi eksik', total:0, confidence:'Düşük', lines:['Kazanç tahmini için Ayarlar sayfasından aylık net maaş girin.'] };
  }
  if (!ctx.earning) {
    return { status:'empty', title:'Yeterli veri yok', total:0, confidence:'Düşük', lines:['Bu ay için hesaplanabilir kazanç verisi bulunamadı.'] };
  }

  const e = ctx.earning;
  const md = ctx.md;
  let projected = e.totalEarning;
  let confidence = 'Yüksek';
  let basis = 'Kayıtlı ay verisi';
  if (e.isCurrentMonth) {
    const evalDays = Math.max(1, e.evaluableDays || new Date().getDate());
    const progress = Math.min(1, evalDays / Math.max(1, e.dim || ctx.md.dim || 30));
    if (evalDays < 7) {
      projected = ctx.salary;
      confidence = 'Düşük';
      basis = `İlk ${evalDays} gün — temel maaş baz alındı`;
    } else {
      projected = progress > 0 ? e.totalEarning / progress : e.totalEarning;
      confidence = evalDays < 10 ? 'Düşük' : evalDays < 20 ? 'Orta' : 'Yüksek';
      basis = `${evalDays} gün üzerinden ay sonu projeksiyonu`;
    }
  } else if (e.isFutureMonth) {
    projected = 0;
    confidence = 'Düşük';
    basis = 'Gelecek ay için kayıtlı veri yok';
  }

  const low = projected > 0 ? projected * 0.92 : 0;
  const high = projected > 0 ? projected * 1.08 : 0;
  return {
    status:'ok', total:projected, low, high, confidence, basis,
    metrics:[
      { k:'Çalışma', v:md.th.toFixed(1) + 's' },
      { k:'FM', v:md.oh.toFixed(1) + 's' },
      { k:'Tatil', v:md.hdw + 'g' }
    ],
    lines:[
      `${ctx.monthName} için tahmini kazanç ${fm(projected)}.`,
      projected > 0 ? `Güven aralığı yaklaşık ${fm(low)} - ${fm(high)}.` : 'Tahmin için vardiya veya izin kaydı ekleyin.',
      `Dayanak: ${basis}.`
    ]
  };
}

function explainPayroll(ctx, payrollResult) {
  const r = payrollResult || (ctx && ctx.payroll);
  if (!r) {
    return [
      { icon:'fa-file-invoice', text:'Bordro açıklaması için önce Kazanç sayfasından e-Bordro önizlemesi oluşturun.' },
      { icon:'fa-shield-alt', text:'Açıklamalar yalnızca uygulamadaki hesaplama kalemlerini sadeleştirir; resmi bordro/hukuk danışmanlığı yerine geçmez.' }
    ];
  }
  const items = [
    { icon:'fa-coins', text:`Temel brüt maaş ${fm(r.baseGross || r.gross || 0)} olarak alındı.` },
    { icon:'fa-user-shield', text:`SGK işçi payı ${fm(r.sgkDeduction || 0)}, işsizlik sigortası ${fm(r.unemployDeduct || 0)} hesaplandı.` },
    { icon:'fa-receipt', text:`Gelir vergisi matrahı ${fm(r.gvMatrah || 0)}, net gelir vergisi ${fm(r.netGV || 0)}.` },
    { icon:'fa-stamp', text:`Damga vergisi ${fm(r.stampTax || 0)} olarak yansıtıldı.` }
  ];
  if ((r.otGross || 0) > 0) items.push({ icon:'fa-business-time', text:`Fazla mesai brüt eki ${fm(r.otGross)}; ${safeNum(r.otHours,0).toFixed(1)} saat ve ${safeNum(r.compRate,1.5)} katsayısına göre oluştu.` });
  if ((r.holGross || 0) > 0) items.push({ icon:'fa-calendar-day', text:`Tatil çalışması ilavesi ${fm(r.holGross)}; ${safeNum(r.holPayDays || r.holDays,0)} gün üzerinden eklendi.` });
  if ((r.mealTotal || 0) > 0 || (r.transportTotal || 0) > 0) items.push({ icon:'fa-plus-circle', text:`Yemek/yol yan hakları toplam ${fm((r.mealTotal || 0) + (r.transportTotal || 0))} nete eklendi.` });
  items.push({ icon:'fa-wallet', text:`Son net maaş ${fm(r.finalNet || r.net || 0)} olarak görünüyor.` });
  return items;
}

function generateProfileSuggestions(ctx) {
  const u = ctx && ctx.user;
  if (!u) return [{ level:'warning', text:'Profil önerisi için kullanıcı seçin.' }];
  const out = [];
  if (!ctx.salary || ctx.salary <= 0) out.push({ level:'warning', text:'Aylık net maaş eksik. Kazanç tahmini ve bordro açıklaması için Ayarlar’dan maaş girin.' });
  if (!u.monthlyHours || u.monthlyHours < 100 || u.monthlyHours > 400) out.push({ level:'warning', text:'Aylık saat değeri olağan aralığın dışında. Saatlik ücret ve fazla mesai tahmini etkilenebilir.' });
  if (ctx.md.th > ctx.monthlyHours * 1.15) out.push({ level:'info', text:`Bu ay çalışma saatiniz aylık hedefin %15 üstünde görünüyor (${ctx.md.th.toFixed(1)}s / ${ctx.monthlyHours}s).` });
  if (ctx.md.oh > 0 && (u.otCompMode || 'pay') === 'leave') out.push({ level:'info', text:`Fazla mesai ücret yerine izin bakiyesine gidiyor. Bu ay ${ctx.md.oh.toFixed(1)}s FM oluştu.` });
  if (ctx.md.oh > 20) out.push({ level:'warning', text:'Fazla mesai yüksek görünüyor. Dinlenme ve haftalık limitleri ayrıca kontrol edin.' });
  if (!u.startDate) out.push({ level:'info', text:'İşe başlangıç tarihi boş. Yıllık izin yorumları daha iyi olsun diye ekleyebilirsiniz.' });
  if (!ctx.shiftCount && !ctx.leaveCount) out.push({ level:'info', text:'Bu ay vardiya veya izin kaydı yok. AI kartları veri geldikçe daha anlamlı tahmin üretir.' });
  if (!out.length) out.push({ level:'ok', text:'Profilde kritik eksik görünmüyor. Tahminler mevcut ay verisine göre üretilebilir.' });
  return out;
}

function answerAIQuestion(question, ctx) {
  const q = String(question || '').trim();
  const n = q.toLocaleLowerCase('tr-TR');
  if (!q) return 'Bir soru yazın ya da hazır sorulardan birini seçin.';
  if (!ctx || !ctx.user) return 'Önce kullanıcı seçin.';

  if (n.includes('kaç saat') || n.includes('kac saat') || n.includes('saat çalış')) {
    return `${ctx.monthName} ayında kayıtlı çalışma süreniz ${ctx.md.th.toFixed(1)} saat. Bunun ${ctx.md.oh.toFixed(1)} saati fazla mesai olarak görünüyor.`;
  }
  if (n.includes('tahmini') || n.includes('kazanc') || n.includes('kazanç') || n.includes('maaş') || n.includes('maas')) {
    const f = generateEarningsForecast(ctx);
    if (f.status !== 'ok') return f.lines.join(' ');
    return `${ctx.monthName} tahmini kazancınız ${fm(f.total)}. Yaklaşık aralık ${fm(f.low)} - ${fm(f.high)}; güven seviyesi: ${f.confidence}.`;
  }
  if (n.includes('fazla mesai') || n.includes('fm')) {
    if (ctx.md.oh <= 0) return `${ctx.monthName} için fazla mesai görünmüyor.`;
    const mode = (ctx.user.otCompMode || 'pay') === 'leave' ? 'izin bakiyesine aktarılıyor' : 'ücret olarak hesaplanıyor';
    return `${ctx.monthName} için ${ctx.md.oh.toFixed(1)} saat fazla mesai var ve mevcut ayara göre ${mode}.`;
  }
  if (n.includes('profil') || n.includes('eksik') || n.includes('öner') || n.includes('oner')) {
    return generateProfileSuggestions(ctx).map(x => x.text).join(' ');
  }
  if (n.includes('bordro') || n.includes('kesinti') || n.includes('vergi') || n.includes('sgk')) {
    return explainPayroll(ctx).map(x => x.text).join(' ');
  }
  return 'Bu yerel MVP şu soruları güvenli şekilde yanıtlıyor: "Bu ay kaç saat çalıştım?", "Tahmini kazancım ne?", "Fazla mesaim var mı?", "Profilimde ne eksik?", "Bordromu açıkla".';
}

function getDeepSeekSettings() {
  try {
    let apiKey = sessionStorage.getItem('st_deepseek_api_key') || '';
    return {
      apiKey,
      model: localStorage.getItem('st_deepseek_model') || 'deepseek-chat',
      storage: 'session',
      consent: localStorage.getItem('st_deepseek_remote_consent') === '1'
    };
  } catch(_) {
    return { apiKey:'', model:'deepseek-chat', storage:'session', consent:false };
  }
}

function saveDeepSeekSettings() {
  const keyEl = $('aiDeepSeekKey');
  const modelEl = $('aiDeepSeekModel');
  const consentEl = $('aiDeepSeekConsent');
  const key = keyEl ? keyEl.value.trim() : '';
  const model = modelEl ? modelEl.value.trim() : 'deepseek-chat';
  try {
    if (key) {
      sessionStorage.setItem('st_deepseek_api_key', key);
      localStorage.removeItem('st_deepseek_api_key');
    } else {
      localStorage.removeItem('st_deepseek_api_key');
      sessionStorage.removeItem('st_deepseek_api_key');
    }
    localStorage.removeItem('st_deepseek_storage');
    localStorage.setItem('st_deepseek_model', model || 'deepseek-chat');
    if (consentEl && consentEl.checked) localStorage.setItem('st_deepseek_remote_consent', '1');
    else localStorage.removeItem('st_deepseek_remote_consent');
    setTxt('aiApiStatus', key ? `DeepSeek API ${consentEl && consentEl.checked ? 'aktif' : 'hazır, dış servis onayı bekliyor'}. Key yalnızca bu oturumda saklanır.` : 'API key boşaltıldı; yerel MVP cevapları kullanılacak.');
    toast(key ? 'DeepSeek API kaydedildi' : 'DeepSeek API kaldırıldı', key ? 'success' : 'info');
  } catch(e) {
    toast('API ayarı kaydedilemedi', 'error');
  }
}

function clearDeepSeekSettings() {
  try {
    localStorage.removeItem('st_deepseek_api_key');
    localStorage.removeItem('st_deepseek_model');
    localStorage.removeItem('st_deepseek_storage');
    localStorage.removeItem('st_deepseek_remote_consent');
    sessionStorage.removeItem('st_deepseek_api_key');
  } catch(_) {}
  const keyEl = $('aiDeepSeekKey'); if (keyEl) keyEl.value = '';
  const modelEl = $('aiDeepSeekModel'); if (modelEl) modelEl.value = 'deepseek-chat';
  const consentEl = $('aiDeepSeekConsent'); if (consentEl) consentEl.checked = false;
  setTxt('aiApiStatus', 'DeepSeek API kapalı. Yerel MVP cevapları kullanılacak.');
  toast('DeepSeek API temizlendi', 'info');
}

function buildDeepSeekPayload(question, ctx) {
  const f = generateEarningsForecast(ctx);
  const suggestions = generateProfileSuggestions(ctx).map(x => x.text);
  const payroll = explainPayroll(ctx).map(x => x.text);
  return {
    question,
    month: `${ctx.monthName} ${ctx.y}`,
    summary: {
      totalHours: ctx.md.th,
      overtimeHours: ctx.md.oh,
      holidayWorkDays: ctx.md.hdw,
      shiftCount: ctx.shiftCount,
      leaveCount: ctx.leaveCount,
      monthlyHours: ctx.monthlyHours,
      salaryEntered: ctx.salary > 0,
      forecast: f.status === 'ok' ? {
        total: Math.round(f.total * 100) / 100,
        low: Math.round(f.low * 100) / 100,
        high: Math.round(f.high * 100) / 100,
        confidence: f.confidence
      } : null,
      overtimeMode: (ctx.user && ctx.user.otCompMode) || 'pay'
    },
    profileSuggestions: suggestions,
    payrollExplanation: payroll
  };
}

async function askDeepSeek(question, ctx) {
  const cfg = getDeepSeekSettings();
  if (!cfg.apiKey) return null;
  if (!cfg.consent) return null;
  const payload = buildDeepSeekPayload(question, ctx);
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + cfg.apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: cfg.model || 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'Sen ShiftTrack Pro içinde çalışan Türkçe vardiya, kazanç ve bordro asistanısın. Yalnızca verilen JSON bağlamına dayan. Hukuki/finansal kesin danışmanlık verme; uygulama içi hesaplama ve bilgilendirme dili kullan. Cevabı kısa, net ve güvenli ver.'
        },
        {
          role: 'user',
          content: JSON.stringify(payload)
        }
      ],
      temperature: 0.2,
      max_tokens: 450
    })
  });
  if (!res.ok) throw new Error('DeepSeek API HTTP ' + res.status);
  const data = await res.json();
  return (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ? data.choices[0].message.content.trim() : null;
}

/* ============================================================
   GÜNCEL BORDRO PARAMETRELERİ — AI DOĞRULAMA + GİRİŞ
============================================================ */
/* "190000:0.15, 230000:0.20, ..., inf:0.40" veya satır satır → bracket array */
function parseBracketsInput(text) {
  if (!text || typeof text !== 'string') return null;
  const out = [];
  // Satır ayracı olarak yalnızca yeni satır ve ';' kullan — ',' ondalık ayracı olabilir (15,5 gibi).
  text.split(/[\n;]+/).forEach(tok => {
    const t = tok.trim(); if (!t) return;
    const parts = t.split(':');
    if (parts.length !== 2) return;
    const upRaw = parts[0].trim().toLowerCase();
    const upTo = (upRaw === 'inf' || upRaw === 'infinity' || upRaw === '∞' || upRaw === 'sonsuz') ? Infinity : Number(upRaw.replace(/[^\d.]/g, ''));
    let rate = Number(parts[1].trim().replace(',', '.'));
    if (rate > 1) rate = rate / 100; // %15 girilirse 0.15'e çevir
    if (!Number.isFinite(upTo) && upTo !== Infinity) return;
    if (!Number.isFinite(rate) || rate < 0 || rate > 1) return;
    out.push({ upTo, rate });
  });
  if (!out.length) return null;
  out.sort((a, b) => a.upTo - b.upTo);
  return out;
}

function bracketsToInput(brackets) {
  if (!Array.isArray(brackets)) return '';
  // rate*100 float artefaktını (0.275*100=27.500000000000004) önlemek için yuvarla.
  const pct = (r) => Math.round(r * 100 * 1e6) / 1e6;
  return brackets.map(b => `${b.upTo === Infinity ? 'inf' : b.upTo}:${pct(b.rate)}`).join('\n');
}

/* DeepSeek'ten yıla ait resmî Türkiye bordro parametrelerini JSON olarak ister.
   AI eğitim verisine dayalı değerleri döner; resmî onay kullanıcıdan beklenir. */
async function askDeepSeekFetchPayroll(year) {
  const cfg = getDeepSeekSettings();
  if (!cfg.apiKey) throw new Error('NO_KEY');
  if (!cfg.consent) throw new Error('NO_CONSENT');
  const sys = `Sen Türk bordro mevzuatı veri asistanısın. Kullanıcı ${year} yılı için Türkiye resmî bordro parametrelerini soruyor.
Eğitim verilerindeki en doğru bilgileri kullanarak YALNIZCA aşağıdaki JSON formatında yanıt ver, başka metin ekleme:
{
  "minWageGross": <brüt asgari ücret ₺, sayı>,
  "sgkEmployee": <SGK işçi payı ondalık, örn 0.14>,
  "unemploymentEmployee": <işsizlik işçi payı ondalık, örn 0.01>,
  "stampTaxRate": <damga vergisi oranı ondalık, örn 0.00759>,
  "incomeTaxBrackets": [
    {"upTo": <kümülatif matrah sınırı ₺, sayı>, "rate": <oran ondalık, örn 0.15>},
    {"upTo": 99999999, "rate": <son dilim oranı, örn 0.40>}
  ],
  "note": "<kısa kaynak notu>"
}
Kurallar: değerleri UYDURMA; bilmiyorsan null ver. SGK işçi 0.14 ve işsizlik 0.01 yasayla sabit. Son dilim upTo her zaman 99999999. Yalnızca JSON döndür.`;
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + cfg.apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: cfg.model || 'deepseek-chat',
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: `${year} yılı Türkiye resmî bordro parametrelerini JSON olarak ver.` }
      ],
      temperature: 0.1,
      max_tokens: 700
    })
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  const text = (data && data.choices && data.choices[0] && data.choices[0].message) ? data.choices[0].message.content.trim() : null;
  if (!text) throw new Error('Boş yanıt');
  let jsonStr = text;
  const m = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (m) jsonStr = m[1].trim();
  const parsed = JSON.parse(jsonStr);
  if (parsed.incomeTaxBrackets) {
    parsed.incomeTaxBrackets = parsed.incomeTaxBrackets.map(b => ({
      upTo: (b.upTo >= 99999990) ? Infinity : b.upTo,
      rate: b.rate > 1 ? b.rate / 100 : b.rate
    }));
  }
  return parsed;
}

async function payrollParamsAutoFill() {
  const out = $('ppValidateOut'); if (!out) return;
  const aiCfg = getDeepSeekSettings();
  if (!aiCfg.apiKey) {
    out.innerHTML = `<div style="color:var(--r)"><i class="fas fa-key"></i> Önce DeepSeek API key girip kaydedin.</div>`;
    return;
  }
  if (!aiCfg.consent) {
    out.innerHTML = `<div style="color:var(--r)"><i class="fas fa-triangle-exclamation"></i> Veri gönderimi için onay kutusunu işaretleyin.</div>`;
    return;
  }
  const year = safeInt(($('ppYear') || {}).value, _payrollParamYear);
  out.innerHTML = `<div style="color:var(--t2)"><i class="fas fa-spinner fa-spin"></i> DeepSeek ${year} parametrelerini getiriyor...</div>`;
  try {
    const p = await askDeepSeekFetchPayroll(year);
    const filled = [], missing = [];
    // Yalnızca AI gerçek bir değer döndürdüyse alanı doldur; bilmiyorsa (null) mevcut değeri KORU.
    const setNum = (id, val, label) => {
      const n = Number(val);
      if (val != null && Number.isFinite(n)) { const el = $(id); if (el) el.value = n; filled.push(label); }
      else missing.push(label);
    };
    setNum('ppMinWage', p.minWageGross, 'Asgari ücret');
    setNum('ppSgk',     p.sgkEmployee, 'SGK');
    setNum('ppUnemp',   p.unemploymentEmployee, 'İşsizlik');
    setNum('ppStamp',   p.stampTaxRate, 'Damga');
    if (p.incomeTaxBrackets && Array.isArray(p.incomeTaxBrackets) && p.incomeTaxBrackets.length) {
      const ta = $('ppBrackets');
      if (ta) ta.value = bracketsToInput(p.incomeTaxBrackets);
      filled.push('GV dilimleri');
    } else missing.push('GV dilimleri');
    const note = p.note ? escHtml(p.note) : 'DeepSeek eğitim verisine dayalı.';
    if (!filled.length) {
      out.innerHTML = `<div style="color:var(--acc)"><i class="fas fa-circle-info"></i> DeepSeek ${year} için doğrulanmış değer döndürmedi (canlı internet erişimi yok). Mevcut/varsayılan değerler korundu; resmî kaynaktan elle girip onaylayın.</div>`;
    } else {
      out.innerHTML = `<div style="color:var(--g)"><i class="fas fa-check-circle"></i> AI doldurdu: <b>${filled.join(', ')}</b>.${missing.length ? ` <span style="color:var(--acc)">Korunan (AI bilmiyor): ${missing.join(', ')}.</span>` : ''} Resmî kaynakla doğrulayıp <b>Onayla &amp; Kaydet</b>'e basın.</div>
        <div style="font-size:10.5px;color:var(--t3);margin-top:4px"><i class="fas fa-info-circle"></i> ${note} Resmî Gazete / GİB / ÇSGB ile teyit edin.</div>`;
    }
  } catch (e) {
    const msg = e.message === 'NO_CONSENT' ? 'Onay kutusunu işaretleyin.' :
                e.message === 'NO_KEY'     ? 'API key girilmemiş.' :
                e.message.startsWith('HTTP') ? 'DeepSeek API hatası: ' + e.message :
                'JSON ayrıştırılamadı: ' + e.message;
    out.innerHTML = `<div style="color:var(--r)"><i class="fas fa-triangle-exclamation"></i> ${escHtml(msg)}</div>`;
  }
}

/* DeepSeek'e girilen parametreleri akla yatkınlık/tutarlılık için doğrulatır.
   AI yalnızca UYARI/ONAY metni döner — değeri kendisi UYGULAMAZ. */
async function askDeepSeekValidatePayroll(year, params) {
  const cfg = getDeepSeekSettings();
  if (!cfg.apiKey) throw new Error('NO_KEY');
  if (!cfg.consent) throw new Error('NO_CONSENT');
  const sys = 'Sen bir Türk bordro mevzuatı kontrol asistanısın. Kullanıcının girdiği YIL için vergi/SGK parametrelerini akla yatkınlık ve iç tutarlılık açısından denetle. ' +
    'Şunları kontrol et: asgari ücret brüt makul mü, SGK işçi payı 0.14 ve işsizlik 0.01 standart mı, gelir vergisi dilimleri artan sıralı ve oranlar 0.15-0.40 aralığında mı, damga vergisi ~0.00759 mu. ' +
    'Resmî kaynağa erişimin yok; rakamları SEN UYDURMA. Yalnızca girilen değerlerin tutarlılığını değerlendir, şüpheli/eksik noktaları kısa madde madde Türkçe belirt. Sonunda "DURUM: TUTARLI" veya "DURUM: KONTROL EDİN" yaz.';
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + cfg.apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: cfg.model || 'deepseek-chat',
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: JSON.stringify({ year, params }) }
      ],
      temperature: 0.1,
      max_tokens: 400
    })
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  return (data && data.choices && data.choices[0] && data.choices[0].message) ? data.choices[0].message.content.trim() : null;
}

/* Girilen parametrelerin yerel (AI'sız) tutarlılık kontrolü — her zaman çalışır. */
function validatePayrollParamsLocal(year, p) {
  const issues = [];
  if (!(p.minWageGross > 0)) issues.push('Asgari ücret brüt pozitif olmalı.');
  else if (p.minWageGross < 10000 || p.minWageGross > 200000) issues.push(`Asgari ücret brüt (${p.minWageGross}) ${year} için sıra dışı görünüyor.`);
  if (p.sgkEmployee !== undefined && (p.sgkEmployee < 0 || p.sgkEmployee > 0.3)) issues.push('SGK işçi payı 0–0.30 aralığında olmalı (std 0.14).');
  if (p.unemploymentEmployee !== undefined && (p.unemploymentEmployee < 0 || p.unemploymentEmployee > 0.05)) issues.push('İşsizlik payı sıra dışı (std 0.01).');
  if (p.stampTaxRate !== undefined && (p.stampTaxRate < 0 || p.stampTaxRate > 0.02)) issues.push('Damga vergisi oranı sıra dışı (std 0.00759).');
  if (p.incomeTaxBrackets) {
    if (!Array.isArray(p.incomeTaxBrackets) || !p.incomeTaxBrackets.length) issues.push('Gelir vergisi dilimleri okunamadı.');
    else {
      let prev = -1;
      p.incomeTaxBrackets.forEach((b, i) => {
        if (b.upTo <= prev) issues.push(`Dilim ${i + 1} artan sırada değil.`);
        if (b.rate < 0.10 || b.rate > 0.45) issues.push(`Dilim ${i + 1} oranı (%${(b.rate * 100).toFixed(0)}) sıra dışı.`);
        prev = b.upTo;
      });
      if (p.incomeTaxBrackets[p.incomeTaxBrackets.length - 1].upTo !== Infinity) issues.push('Son dilim "inf" (sonsuz) ile bitmeli.');
    }
  }
  return issues;
}

function aiAsk(q) {
  const input = $('aiChatInput');
  if (input) input.value = q || input.value;
  submitAIQuestion();
}

async function submitAIQuestion() {
  const input = $('aiChatInput');
  const log = $('aiChatLog');
  if (!input || !log) return;
  const q = input.value.trim();
  if (!q) return;
  const ctx = buildAIContext(cu(), S.cy, S.cm);
  log.insertAdjacentHTML('beforeend', `<div class="ai-msg user">${escHtml(q)}</div>`);
  const bot = document.createElement('div');
  bot.className = 'ai-msg bot';
  const aiCfg = getDeepSeekSettings();
  bot.textContent = aiCfg.apiKey && aiCfg.consent ? 'DeepSeek yanıtlıyor...' : answerAIQuestion(q, ctx);
  log.appendChild(bot);
  input.value = '';
  log.scrollTop = log.scrollHeight;
  if (!aiCfg.apiKey || !aiCfg.consent) return;
  try {
    const remote = await askDeepSeek(q, ctx);
    bot.textContent = remote || answerAIQuestion(q, ctx);
  } catch(e) {
    bot.textContent = answerAIQuestion(q, ctx) + ' (DeepSeek API çağrısı başarısız oldu; yerel cevap gösterildi.)';
  }
  log.scrollTop = log.scrollHeight;
}

function renderAIItems(items) {
  return `<div class="ai-list">${items.map(it => `
    <div class="ai-item"><i class="fas ${escHtml(it.icon || 'fa-circle-info')}"></i><span>${escHtml(it.text || '')}</span></div>
  `).join('')}</div>`;
}

/* Güncel Bordro Parametreleri kartı — yıl seçimi, giriş alanları, AI doğrulama, onay/kaydet */
let _payrollParamYear = new Date().getFullYear();
function renderPayrollParamsCard() {
  const y = _payrollParamYear;
  const cfg = payrollCfg(y);
  const ov = loadPayrollOverrides()[y];
  const isOverridden = !!(cfg && cfg._override);
  const metaTxt = isOverridden && cfg._overrideMeta
    ? `Override aktif • ${new Date(cfg._overrideMeta.savedAt).toLocaleDateString('tr-TR')}${cfg._overrideMeta.aiValidated ? ' • AI doğrulandı' : ''}`
    : 'Varsayılan (gömülü) değerler kullanılıyor';
  const v = (n) => (n === undefined || n === null ? '' : n);
  return `
    <div class="ai-card" style="margin-bottom:16px">
      <h3><i class="fas fa-scale-balanced"></i>Güncel Bordro Parametreleri</h3>
      <div style="font-size:11px;color:var(--t2);margin-bottom:10px;line-height:1.5">
        Vergi/SGK/asgari ücret değerleri her yıl değişir.
        ${getDeepSeekSettings().apiKey && getDeepSeekSettings().consent
          ? '<b style="color:var(--acc)"><i class="fas fa-wand-magic-sparkles"></i> AI ile Doldur</b> düğmesiyle DeepSeek değerleri otomatik getirir; siz sadece onaylarsınız.'
          : 'API key + onay ile <b>AI değerleri otomatik getirir</b>; yoksa manuel girin.'}
        <br><span style="color:var(--acc)">${escHtml(metaTxt)}</span>
      </div>
      <div class="ai-api-grid">
        <label style="font-size:11px;color:var(--t2)">Yıl
          <input id="ppYear" type="number" min="2020" max="2099" value="${y}" oninput="payrollParamsChangeYear(this.value)" style="width:100%">
        </label>
        <label style="font-size:11px;color:var(--t2)">Asgari Ücret Brüt (₺)
          <input id="ppMinWage" type="number" step="0.01" value="${v(cfg.minWageGross)}" style="width:100%">
        </label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          <label style="font-size:11px;color:var(--t2)">SGK İşçi (0.14)
            <input id="ppSgk" type="number" step="0.0001" value="${v(cfg.sgkEmployee)}" style="width:100%">
          </label>
          <label style="font-size:11px;color:var(--t2)">İşsizlik (0.01)
            <input id="ppUnemp" type="number" step="0.0001" value="${v(cfg.unemploymentEmployee)}" style="width:100%">
          </label>
        </div>
        <label style="font-size:11px;color:var(--t2)">Damga Vergisi Oranı (0.00759)
          <input id="ppStamp" type="number" step="0.00001" value="${v(cfg.stampTaxRate)}" style="width:100%">
        </label>
        <label style="font-size:11px;color:var(--t2)">Gelir Vergisi Dilimleri (her satır: <code>üstSınır:oran%</code>, son satır <code>inf:40</code>)
          <textarea id="ppBrackets" rows="5" style="width:100%;font-family:monospace;font-size:11px">${escHtml(bracketsToInput(cfg.incomeTaxBrackets))}</textarea>
        </label>
        <div class="ai-api-actions" style="flex-wrap:wrap;gap:6px">
          ${getDeepSeekSettings().apiKey && getDeepSeekSettings().consent ? `<button class="btn btn-outline btn-sm" type="button" onclick="payrollParamsAutoFill()" style="color:var(--acc);border-color:var(--acc)"><i class="fas fa-wand-magic-sparkles"></i>AI ile Doldur</button>` : ''}
          <button class="btn btn-outline btn-sm" type="button" onclick="payrollParamsValidate()"><i class="fas fa-robot"></i>Doğrula</button>
          <button class="btn btn-primary btn-sm" type="button" onclick="payrollParamsSave()"><i class="fas fa-check"></i>Onayla & Kaydet</button>
          ${ov ? `<button class="btn btn-outline btn-sm" type="button" onclick="payrollParamsReset()"><i class="fas fa-rotate-left"></i>Varsayılana Dön</button>` : ''}
        </div>
      </div>
      <div id="ppValidateOut" class="ai-api-status" style="margin-top:10px"></div>
    </div>`;
}

function payrollParamsChangeYear(val) {
  const yr = safeInt(val, NaN);
  if (Number.isFinite(yr) && yr >= 2020 && yr <= 2099) {
    _payrollParamYear = yr;
    renderAIAssistantPage();
  }
}

function payrollParamsCollect() {
  const num = (id) => { const el = $(id); const n = el ? Number(el.value) : NaN; return Number.isFinite(n) ? n : undefined; };
  const year = safeInt(($('ppYear') || {}).value, _payrollParamYear);
  const params = {
    minWageGross: num('ppMinWage'),
    sgkEmployee: num('ppSgk'),
    unemploymentEmployee: num('ppUnemp'),
    stampTaxRate: num('ppStamp'),
    incomeTaxBrackets: parseBracketsInput(($('ppBrackets') || {}).value) || undefined
  };
  return { year, params };
}

async function payrollParamsValidate() {
  const out = $('ppValidateOut'); if (!out) return;
  const { year, params } = payrollParamsCollect();
  const localIssues = validatePayrollParamsLocal(year, params);
  let html = '';
  if (localIssues.length) {
    html += `<div style="color:var(--r)"><b><i class="fas fa-triangle-exclamation"></i> Yerel kontrol (${localIssues.length}):</b><ul style="margin:4px 0 0 16px">${localIssues.map(i => `<li>${escHtml(i)}</li>`).join('')}</ul></div>`;
  } else {
    html += `<div style="color:var(--g)"><i class="fas fa-check-circle"></i> Yerel tutarlılık kontrolü temiz.</div>`;
  }
  out.innerHTML = html;
  const aiCfg = getDeepSeekSettings();
  if (aiCfg.apiKey && aiCfg.consent) {
    out.innerHTML = html + `<div style="margin-top:6px;color:var(--t2)"><i class="fas fa-spinner fa-spin"></i> DeepSeek doğruluyor...</div>`;
    try {
      const ai = await askDeepSeekValidatePayroll(year, params);
      out.innerHTML = html + `<div style="margin-top:8px;padding:8px;background:var(--b2);border-radius:8px;white-space:pre-wrap;font-size:11.5px"><b><i class="fas fa-robot"></i> DeepSeek:</b>\n${escHtml(ai || 'Yanıt alınamadı.')}</div>`;
    } catch (e) {
      const msg = e.message === 'NO_CONSENT' ? 'AI sayfasındaki onay kutusunu işaretleyin.' : e.message === 'NO_KEY' ? 'DeepSeek API key girilmemiş.' : 'DeepSeek çağrısı başarısız: ' + e.message;
      out.innerHTML = html + `<div style="margin-top:6px;color:var(--acc)"><i class="fas fa-info-circle"></i> ${escHtml(msg)} (Yerel kontrol geçerli.)</div>`;
    }
  } else {
    out.innerHTML = html + `<div style="margin-top:6px;color:var(--t3);font-size:11px"><i class="fas fa-info-circle"></i> DeepSeek doğrulaması için AI key + onay gerekir; yerel kontrol her zaman çalışır.</div>`;
  }
}

function payrollParamsSave() {
  const { year, params } = payrollParamsCollect();
  const issues = validatePayrollParamsLocal(year, params);
  if (issues.length) {
    showConfirm('Tutarsızlık Uyarısı', `${issues.length} uyarı var:\n\n• ${issues.join('\n• ')}\n\nYine de kaydetmek istiyor musunuz?`, () => {
      _payrollParamsCommit(year, params, false);
    });
    return;
  }
  _payrollParamsCommit(year, params, false);
}

function _payrollParamsCommit(year, params, aiValidated) {
  const cur = payrollCfg(year);
  const diff = [];
  const cmp = (label, oldV, newV) => { if (newV !== undefined && Math.abs(safeNum(oldV, 0) - safeNum(newV, 0)) > 1e-9) diff.push(`${label}: ${oldV} → ${newV}`); };
  cmp('Asgari ücret brüt', cur.minWageGross, params.minWageGross);
  cmp('SGK işçi', cur.sgkEmployee, params.sgkEmployee);
  cmp('İşsizlik', cur.unemploymentEmployee, params.unemploymentEmployee);
  cmp('Damga', cur.stampTaxRate, params.stampTaxRate);
  if (params.incomeTaxBrackets && bracketsToInput(cur.incomeTaxBrackets) !== bracketsToInput(params.incomeTaxBrackets)) diff.push('Gelir vergisi dilimleri güncellendi');
  const ok = savePayrollOverride(year, params, { source: 'manual', aiValidated: !!aiValidated });
  if (ok) {
    invalidateMDCache();
    if (typeof debouncedPush === 'function') debouncedPush(); // bulut senkronu tetikle
    toast(`${year} bordro parametreleri kaydedildi${diff.length ? ' (' + diff.length + ' değişiklik)' : ''}`, 'success');
    renderAIAssistantPage();
  } else {
    toast('Kaydetme başarısız', 'error');
  }
}

function payrollParamsReset() {
  const year = safeInt(($('ppYear') || {}).value, _payrollParamYear);
  showConfirm('Varsayılana Dön', `${year} yılı için girdiğiniz override silinecek ve gömülü varsayılan değerlere dönülecek. Onaylıyor musunuz?`, () => {
    clearPayrollOverride(year);
    invalidateMDCache();
    if (typeof debouncedPush === 'function') debouncedPush(); // bulut senkronu tetikle
    toast(`${year} override kaldırıldı`, 'info');
    renderAIAssistantPage();
  });
}

function renderAIAssistantPage() {
  const el = $('aiAssistantContent'); if (!el) return;
  const ctx = buildAIContext(cu(), S.cy, S.cm);
  const forecast = generateEarningsForecast(ctx);
  const profile = generateProfileSuggestions(ctx);
  const payrollItems = explainPayroll(ctx);
  const apiCfg = getDeepSeekSettings();
  const forecastLines = (forecast.lines || []).map(text => ({ icon:'fa-chart-line', text }));
  const profileItems = profile.map(x => ({
    icon: x.level === 'warning' ? 'fa-triangle-exclamation' : x.level === 'ok' ? 'fa-check-circle' : 'fa-lightbulb',
    text: x.text
  }));

  el.innerHTML = `
    <div class="ai-hero">
      <div class="eyebrow">Yerel AI MVP • ${escHtml(ctx.monthName)} ${ctx.y}</div>
      <div class="value">${forecast.status === 'ok' ? fm(forecast.total) : 'Veri bekleniyor'}</div>
      <div class="meta">${forecast.status === 'ok' ? `Tahmini kazanç • Güven: ${escHtml(forecast.confidence)}` : escHtml((forecast.lines || ['Tahmin için profil ve vardiya verisi gerekir.'])[0])}</div>
      <div class="ai-metric-grid">
        ${(forecast.metrics || [
          { k:'Çalışma', v:ctx.md.th.toFixed(1) + 's' },
          { k:'FM', v:ctx.md.oh.toFixed(1) + 's' },
          { k:'Kayıt', v:(ctx.shiftCount + ctx.leaveCount) + ' gün' }
        ]).map(x => `<div class="ai-metric"><div class="v">${escHtml(x.v)}</div><div class="k">${escHtml(x.k)}</div></div>`).join('')}
      </div>
    </div>
    <div class="ai-page-grid">
      <div>
        <div class="ai-card" style="margin-bottom:16px">
          <h3><i class="fas fa-chart-simple"></i>Kazanç Tahmini</h3>
          ${renderAIItems(forecastLines)}
        </div>
        <div class="ai-card" style="margin-bottom:16px">
          <h3><i class="fas fa-file-invoice-dollar"></i>Bordro Açıklaması</h3>
          ${renderAIItems(payrollItems)}
        </div>
        <div class="ai-card ai-safe">
          <h3><i class="fas fa-scale-balanced"></i>Kural Güvenliği</h3>
          <div class="ai-empty">Bu asistan hukuki veya finansal kesin danışmanlık vermez. Yanıtlar yalnızca ShiftTrack içindeki profil, vardiya, izin ve bordro hesaplama kurallarına göre bilgilendirme amaçlıdır.</div>
        </div>
      </div>
      <div>
        <div class="ai-card" style="margin-bottom:16px">
          <h3><i class="fas fa-key"></i>DeepSeek API</h3>
          <div class="ai-api-grid">
            <input id="aiDeepSeekKey" type="password" placeholder="DeepSeek API key" value="${escHtml(apiCfg.apiKey)}" autocomplete="off">
            <input id="aiDeepSeekModel" type="text" placeholder="Model" value="${escHtml(apiCfg.model || 'deepseek-chat')}">
            <label style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--t2)"><input id="aiDeepSeekConsent" type="checkbox" ${apiCfg.consent ? 'checked' : ''}>Vardiya, izin, kazanç ve varsa bordro özetini DeepSeek'e göndermeyi onaylıyorum</label>
            <div style="font-size:10px;color:var(--t3);margin-top:2px"><i class="fas fa-shield-alt" style="margin-right:4px"></i>API key güvenlik gereği yalnızca bu oturumda saklanır, sayfa kapanınca silinir.</div>
            <div class="ai-api-actions">
              <button class="btn btn-primary btn-sm" type="button" onclick="saveDeepSeekSettings()"><i class="fas fa-save"></i>Kaydet</button>
              <button class="btn btn-outline btn-sm" type="button" onclick="clearDeepSeekSettings()"><i class="fas fa-trash"></i></button>
            </div>
          </div>
          <div class="ai-api-status" id="aiApiStatus">${apiCfg.apiKey ? (apiCfg.consent ? `DeepSeek API aktif. Key bu oturumda saklanır.` : 'API key hazır; dış servise veri gönderimi için onay kutusunu işaretleyin.') : 'API key girilmezse sohbet yerel MVP cevaplarını kullanır.'}</div>
        </div>
        ${renderPayrollParamsCard()}
        <div class="ai-card" style="margin-bottom:16px">
          <h3><i class="fas fa-comments"></i>Takvim Sohbeti</h3>
          <div class="ai-chat">
            <div class="ai-chat-log" id="aiChatLog">
              <div class="ai-msg bot">Merhaba. Bu ayın saat, kazanç, fazla mesai, bordro ve profil durumunu yerel olarak yorumlayabilirim.</div>
            </div>
            <div class="ai-quick">
              <button onclick="aiAsk('Bu ay kaç saat çalıştım?')">Saat</button>
              <button onclick="aiAsk('Tahmini kazancım ne?')">Kazanç</button>
              <button onclick="aiAsk('Fazla mesaim var mı?')">FM</button>
              <button onclick="aiAsk('Profilimde ne eksik?')">Profil</button>
              <button onclick="aiAsk('Bordromu açıkla')">Bordro</button>
            </div>
            <form class="ai-chat-form" onsubmit="submitAIQuestion();return false">
              <input id="aiChatInput" type="text" placeholder="Örn: Bu ay kaç saat çalıştım?">
              <button type="submit" title="Gönder"><i class="fas fa-paper-plane"></i></button>
            </form>
          </div>
        </div>
        <div class="ai-card">
          <h3><i class="fas fa-user-gear"></i>Profil Önerileri</h3>
          ${renderAIItems(profileItems)}
        </div>
      </div>
    </div>
  `;
}

/* ============================================================
   6-MONTH TREND DATA
============================================================ */
function getTrendData() {
  const u = cu(); if (!u) return [];
  const today = new Date();
  const data = [];
  for (let i = 5; i >= 0; i--) {
    let m = today.getMonth() - i, y = today.getFullYear();
    while (m < 0) { m += 12; y--; }
    const now = new Date();
    const md = getMD(y, m, (y === now.getFullYear() && m === now.getMonth()) ? { throughDay:now.getDate() } : undefined);
    const earn = u.netSalary ? calcEarningForMonth(y, m, u.netSalary) : null;
    data.push({
      y, m,
      label: MTR[m].substring(0, 3),
      fullLabel: MTR[m] + ' ' + y,
      hours: md.th, overtime: md.oh, days: md.wd,
      earning: earn ? earn.totalEarning : 0,
      holidays: md.hdw,
      leaves: md.wr + md.mau + md.msd + md.ud
    });
  }
  return data;
}

/* ============================================================
   RENDER HELPERS
============================================================ */
function renderActivePage() {
  if (!cu()) return;
  const a = document.querySelector('.page.active');
  if (!a) return;
  switch (a.id) {
    case 'pg-dashboard': renderDash(); renderYearOverview(); break;
    case 'pg-calendar': renderCal(); break;
    case 'pg-stats': renderStats(); break;
    case 'pg-leaves': renderLeaves(); break;
    case 'pg-earnings': renderEarn(); break;
    case 'pg-ai': renderAIAssistantPage(); break;
    case 'pg-settings': loadSet(); break;
    case 'pg-documents': renderDocs(); break;
  }
}

function renderAll() {
  if (!cu()) return;
  /* [FIX BUG-08] renderActivePage() zaten pg-settings için loadSet() çağırır.
     Başka sayfalardayken gereksiz DOM manipülasyonu önlendi. */
  renderActivePage();
}

/* ============================================================
   YEAR OVERVIEW
============================================================ */
function renderYearOverview() {
  const wrap = $('yearOverviewWrap'); if (!wrap) return;
  let h = `<div class="year-nav">
    <button onclick="chgYear(-1)"><i class="fas fa-chevron-left"></i></button>
    <span>${S.cy}</span>
    <button onclick="chgYear(1)"><i class="fas fa-chevron-right"></i></button>
  </div><div class="year-overview">`;
  for (let m = 0; m < 12; m++) {
    const d = getMD(S.cy, m);
    /* [FIX] çift kontrol kaldırıldı */
    h += `<div class="year-month ${m === S.cm ? 'active' : ''}" data-month="${m}">
      <span class="ym-name">${MTR[m].substring(0, 3)}</span>
      <span class="ym-hrs">${d.th > 0 ? d.th.toFixed(0) : '—'}</span>
    </div>`;
  }
  h += '</div>';
  wrap.innerHTML = h;
  wrap.querySelector('.year-overview').onclick = function(e) {
    const ym = e.target.closest('.year-month'); if (!ym) return;
    const mo = parseInt(ym.dataset.month); if (isNaN(mo)) return;
    S.cm = mo;
    /* [FIX BUG-06] Ay değişimi veri değiştirmiyor, cache temizlemeye gerek yok */
    renderActivePage();
  };
}

function chgYear(d) {
  S.cy += d;
  /* [FIX BUG-06] Yıl navigasyonu veri değiştirmiyor, cache temizlemeye gerek yok */
  renderActivePage();
}

/* ============================================================
   INIT
============================================================ */
function init() {
  loadLS();
  applyTheme('default');
  // Auth ekranı yönetimi — Firebase init sonra halleder
  const ls = $('loginScreen'); if (ls) ls.style.display = 'none';
  const as = $('authScreen'); if (as) as.style.display = 'flex';
  updLogin();

  // Input event listeners — null-safe
  /* [FIX L-02] updResult her tuş basışında FM hesabı yapar; 150ms debounce ile frekans azaltıldı */
  let _updResultTimer;
  const _debouncedUpdResult = function() { clearTimeout(_updResultTimer); _updResultTimer = setTimeout(updResult, 150); };
  const iStart = $('iStart'); if (iStart) iStart.addEventListener('input', _debouncedUpdResult);
  const iEnd = $('iEnd'); if (iEnd) iEnd.addEventListener('input', _debouncedUpdResult);
  const iBrk = $('iBreak'); if (iBrk) iBrk.addEventListener('change', updResult);
  const wtS = $('wtStart'); if (wtS) wtS.addEventListener('input', updWTPreview);
  const wtE = $('wtEnd'); if (wtE) wtE.addEventListener('input', updWTPreview);
  const wtB = $('wtBreak'); if (wtB) wtB.addEventListener('change', updWTPreview);
  const cpS = $('cpStart'); if (cpS) cpS.addEventListener('input', updCPPreview);
  const cpE = $('cpEnd'); if (cpE) cpE.addEventListener('input', updCPPreview);
  const cpB = $('cpBreak'); if (cpB) cpB.addEventListener('change', updCPPreview);

  const cg = $('calGrid');
  if (cg) {
    cg.addEventListener('click', function(e) {
      if (wasDragging) { wasDragging = false; return; }
      const c = e.target.closest('.cal-cell');
      if (!c || c.classList.contains('out')) return;
      const ds = c.dataset.date; if (!ds) return;
      if (S.multiSelect) {
        const i = S.selectedDates.indexOf(ds);
        if (i > -1) S.selectedDates.splice(i, 1); else S.selectedDates.push(ds);
        renderCal(); return;
      }
      openM(ds);
    });
    cg.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const c = e.target.closest('.cal-cell');
        if (c && !c.classList.contains('out')) { e.preventDefault(); c.click(); }
      }
    });
  }

  const modalEl = $('modal'); if (modalEl) modalEl.addEventListener('click', function(e) { if (e.target === this) closeM(); });
  const wtModalEl = $('wtModal'); if (wtModalEl) wtModalEl.addEventListener('click', function(e) { if (e.target === this) closeWTModal(); });
  const cpModalEl = $('cpModal'); if (cpModalEl) cpModalEl.addEventListener('click', function(e) { if (e.target === this) closeCPModal(); });
  const nuModalEl = $('newUserModal'); if (nuModalEl) nuModalEl.addEventListener('click', function(e) { if (e.target === this) closeNewUserModal(); });
  const nuInput = $('newUserName'); if (nuInput) nuInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') confirmNewUser(); });
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); return; }
    if (e.key === 'Escape') {
      closeM(); closeWTModal(); closeCPModal(); closeNewUserModal();
      const co = $('confirmOverlay'); if (co) co.classList.remove('show');
      const po = $('pinOverlay'); if (po) po.classList.remove('show');
      const qo = $('qrOverlay'); if (qo) qo.classList.remove('show');
      closeCalc(); closeEmployer();
    }
    const modal = $('modal'), wtModal = $('wtModal'), cpModal = $('cpModal');
    if ((modal && modal.classList.contains('show')) || (wtModal && wtModal.classList.contains('show')) || (cpModal && cpModal.classList.contains('show'))) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
    const pg = document.querySelector('.page.active'); if (!pg) return;
    if (e.key === 'ArrowLeft') { if (pg.id === 'pg-calendar') chgM(-1); else if (pg.id === 'pg-earnings') chgE(-1); }
    if (e.key === 'ArrowRight') { if (pg.id === 'pg-calendar') chgM(1); else if (pg.id === 'pg-earnings') chgE(1); }
    if (e.key.toLowerCase() === 't' && pg.id === 'pg-calendar') goToday();
    if (e.key === '?') showShortcuts();
  });
}

/* ============================================================
   LOGIN / LOGOUT
============================================================ */
function updLogin() {
  const container = $('loginCards'); if (!container) return;
  let h = '';
  Object.keys(S.u).sort((a,b) => parseInt(a) - parseInt(b)).forEach(k => {
    const i = parseInt(k);
    const u = S.u[i]; if (!u) return;
    const name = escHtml(u.name || 'Kullanıcı ' + i);
    const initial = (u.name || 'K')[0].toUpperCase();
    const lastLogin = u.lastLogin
      ? 'Son: ' + new Date(u.lastLogin).toLocaleDateString('tr-TR', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })
      : '';
    const themeColor = THEME_COLORS[u.theme||'default'];
    const themeName = THEME_NAMES[u.theme||'default'];
    const hasPin = u.pin ? '<i class="fas fa-lock" style="font-size:9px;color:var(--t3);margin-left:4px" title="PIN korumalı"></i>' : '';
    h += `<div class="login-card" onclick="loginAttempt(${i})">
      <div class="avatar">${initial}</div>
      <h3>${name}${hasPin}</h3>
      <span>Giriş yap →</span>
      <div class="user-theme-indicator"><span class="uti-dot" style="background:${themeColor}"></span><span class="uti-text">${themeName}</span></div>
      <span class="last-login">${lastLogin}</span>
    </div>`;
  });
  h += `<div class="login-card add-user" onclick="addNewUser()">
    <div class="avatar"><i class="fas fa-plus"></i></div>
    <h3>Yeni Kullanıcı</h3>
    <span>Ekle →</span>
  </div>`;
  container.innerHTML = h;
}

function loginAttempt(id) {
  const u = S.u[id]; if (!u) return;
  if (u.pin) {
    if (Date.now() < pinLockUntil) {
      const sec = Math.ceil((pinLockUntil - Date.now()) / 1000);
      toast(`Çok fazla hatalı deneme. ${sec}sn bekleyin.`, 'error'); return;
    }
    openPIN('PIN Girin', u.name, async pin => {
      /* [FIX BUG-04] Düz metin karşılaştırması kaldırıldı — yalnızca hash eşleşmesi */
      const h = await hashPIN(pin);
      if (h === u.pin) { pinAttempts = 0; login(id); }
      else {
        pinAttempts++;
        if (pinAttempts >= 5) { pinLockUntil = Date.now() + 30000; pinAttempts = 0; toast('5 hatalı deneme! 30sn kilitlendi.', 'error'); }
        else { toast(`Yanlış PIN! (${5 - pinAttempts} hak kaldı)`, 'error'); }
      }
    });
  } else { login(id); }
}

function login(id) {
  S.cu = id;
  const u = cu(); if (!u) return;
  u.lastLogin = new Date().toISOString();
  applyTheme(u.theme || 'default');
  saveLS();
  const ls = $('loginScreen'); if (ls) ls.style.display = 'none';
  const ma = $('mainApp'); if (ma) ma.style.display = 'block';
  updTop();
  invalidateMDCache();
  undoStack.length = 0;
  updUndoBtn();
  renderAll();
  scheduleNotifications();
  toast(`Hoş geldin, ${escHtml(u.name)}!`, 'success');
}

function logout() {
  S.cu = null;
  S.multiSelect = false;
  S.selectedDates = [];
  S.clipboard = null;
  undoStack.length = 0;
  invalidateMDCache();
  applyTheme('default');
  const ma = $('mainApp'); if (ma) ma.style.display = 'none';
  const ls = $('loginScreen'); if (ls) ls.style.display = 'flex';
  updLogin();
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const firstTab = document.querySelector('.nav-tab');
  if (firstTab) firstTab.classList.add('active');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pgD = $('pg-dashboard'); if (pgD) pgD.classList.add('active');
}

function updTop() {
  const u = cu(); if (!u) return;
  setTxt('topName', u.name || 'İsimsiz');
  const ta = $('topAv'); if (ta) ta.textContent = (u.name || 'K')[0].toUpperCase();
}

function go(p, btn) {
  if (p !== 'calendar' && S.multiSelect) {
    S.multiSelect = false; S.selectedDates = [];
    const mb = $('multiSelBtn');
    if (mb) { mb.className = 'btn btn-outline btn-sm'; mb.innerHTML = '<i class="fas fa-object-group"></i>Çoklu Seç'; }
  }
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  const pg = $('pg-' + p); if (pg) pg.classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  /* [FIX] Panel↔Kazanç ay tutarlılığı: kazanç sayfasına girince takvim/panel ayına senkronla */
  if (p === 'earnings') { S.em = S.cm; S.ey = S.cy; }
  renderActivePage();
}

/* ============================================================
   THEME
============================================================ */
function setTheme(t) {
  const u = cu(); if (!u) return;
  u.theme = t;
  markSettingsUpdated(u);
  applyTheme(t);
  saveLS();
  toast(THEME_NAMES[t] + ' teması', 'info');
}

function applyTheme(t) {
  document.body.className = t === 'default' ? '' : 'theme-' + t;
  document.querySelectorAll('.theme-dot').forEach(d => d.classList.toggle('active', d.dataset.t === t));
  const atToggle = $('autoThemeToggle');
  if (atToggle) { const u = cu(); atToggle.checked = u ? !!u.autoTheme : false; }
}

function toggleAutoTheme(on) {
  const u = cu(); if (!u) return;
  u.autoTheme = on;
  if (on) {
    const isLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    u.theme = isLight ? 'light' : 'default';
    applyTheme(u.theme);
  }
  markSettingsUpdated(u);
  saveLS();
  toast(on ? 'Otomatik tema açık' : 'Otomatik tema kapalı', 'info');
}

/* ============================================================
   DASHBOARD
============================================================ */
function renderDash() {
  const u = cu(); if (!u) return;
  const now = new Date();
  const d = getMD(S.cy, S.cm, (S.cy === now.getFullYear() && S.cm === now.getMonth()) ? { throughDay:now.getDate() } : undefined), prev = getPrevMD();
  setTxt('dashSub', `${MTR[S.cm]} ${S.cy} — ${u.name}`);
  const streak = getStreak();
  setHtml('dashStreak', streak > 0 ? `<div class="streak-badge"><i class="fas fa-fire"></i>${streak} gün seri</div>` : '');
  const e = u.netSalary ? calcEarningForMonth(S.cy, S.cm, u.netSalary) : null;

  function cmp(c, p) {
    if (p === null || p === undefined) return '<span class="change neutral">—</span>';
    if (c === p) return '<span class="change neutral">→ 0%</span>';
    const df = c - p, pc = p !== 0 ? Math.round((df / p) * 100) : 100;
    if (df > 0) return `<span class="change up"><i class="fas fa-arrow-up"></i>${Math.abs(pc)}%</span>`;
    return `<span class="change down"><i class="fas fa-arrow-down"></i>${Math.abs(pc)}%</span>`;
  }

  setHtml('statsEl', `
    <div class="stat"><div class="ribbon"></div><div class="ico"><i class="fas fa-clock"></i></div><div class="val">${d.th.toFixed(1)}</div><div class="lbl">Toplam Saat</div>${cmp(d.th, prev.th)}</div>
    <div class="stat"><div class="ribbon"></div><div class="ico"><i class="fas fa-fire"></i></div><div class="val">${(d.oh + d.oh125).toFixed(1)}</div><div class="lbl">FÇ/FM</div>${cmp(d.oh + d.oh125, prev.oh + prev.oh125)}</div>
    <div class="stat"><div class="ribbon"></div><div class="ico"><i class="fas fa-wallet"></i></div><div class="val">${e ? fm(e.totalEarning) : '—'}</div><div class="lbl">Kazanç</div></div>
    <div class="stat"><div class="ribbon"></div><div class="ico"><i class="fas fa-calendar-check"></i></div><div class="val">${d.wd}/${d.dim}</div><div class="lbl">Çalışma Günü</div></div>
  `);

  /* [FIX Y-01] Haftalık chart: tam yyyy-Wnn stringiyle sırala (yıllar arası doğru) */
  const wks = Object.entries(d.wh).sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
  const weeklyLimit = getWeeklyContractHours(u);
  const maxWk = wks.length ? Math.max(60, weeklyLimit, ...wks.map(([wk]) => d.weekTotalHrs[wk] || 0)) : 60;
  let wc = '';
  if (!wks.length) {
    wc = '<div class="empty"><i class="fas fa-calendar-times"></i><p>Bu ay vardiya yok</p></div>';
  } else {
    wks.forEach(([wk, h], i) => {
      const realTotal = d.weekTotalHrs[wk] || h;
      const p = maxWk > 0 ? Math.min(100, realTotal / maxWk * 100) : 0;
      const lp = maxWk > 0 ? (weeklyLimit / maxWk * 100).toFixed(1) : 0;
      const isOT = realTotal > weeklyLimit;
      const crossMonth = Math.abs(realTotal - h) > 0.01;
      const label = crossMonth ? `${h.toFixed(1)}s (hafta: ${realTotal.toFixed(1)}s)` : `${h.toFixed(1)}s`;
      wc += `<div class="wk-row"><span class="label">${i+1}. Hafta</span><div class="track"><div class="limit-line" style="left:${lp}%" title="${weeklyLimit}s sözleşme eşiği"></div><div class="fill ${isOT ? 'ot' : 'ok'}" style="width:${p}%">${realTotal.toFixed(1)}s</div></div><span class="hrs ${isOT ? 'overtime' : ''}" title="${crossMonth ? 'Bu aydaki: '+h.toFixed(1)+'s' : ''}">${label}</span></div>`;
    });
  }
  setHtml('weekChart', wc);

  const al = annualLeaveTotal(u), ar = Math.max(0, al - d.yau);
  const workdays = d.wd + d.wr + d.mau + d.msd;
  let info = '';
  if (!u.netSalary) info = '<div class="hint" style="margin-bottom:8px"><i class="fas fa-exclamation-triangle"></i><span>Ayarlar\'dan maaş girin.</span></div>';
  info += `
    <div class="info-row"><span class="k"><i class="fas fa-umbrella-beach"></i>Kalan Y.İzin</span><span class="v ${ar <= 3 ? 'neg' : ''}">${ar}g</span></div>
    <div class="info-row"><span class="k"><i class="fas fa-notes-medical"></i>Rapor (yıl)</span><span class="v">${d.ysd}g</span></div>
    <div class="info-row"><span class="k"><i class="fas fa-couch"></i>H.Tatil (ay)</span><span class="v">${d.weeklyRestDays || 0}g</span></div>
    <div class="info-row"><span class="k"><i class="fas fa-flag"></i>R.Tatil İzni</span><span class="v">${(d.publicHolidayPaidDays || 0).toFixed(1)}g</span></div>
    <div class="info-row"><span class="k"><i class="fas fa-coins"></i>Saatlik (baz)</span><span class="v">${u.netSalary ? fm(d.hr) : '—'}</span></div>
    <div class="info-row"><span class="k"><i class="fas fa-chart-line"></i>İş Günü Dol.</span><span class="v">${d.dim > 0 ? workdays + '/' + d.dim : '—'}</span></div>
  `;
  // Year comparison
  info += renderYearComparison();

  // Month projection
  const proj = getMonthProjection();
  if (proj) {
    info += `<div class="info-row"><span class="k"><i class="fas fa-chart-area"></i>Ay Sonu Tahmini</span><span class="v">${proj.projected}s${proj.projectedEarning > 0 ? ' / ' + fm(proj.projectedEarning) : ''}</span></div>`;
  }

  setHtml('dashInfo', info);

  // Render dashboard widgets
  renderDashTodayWidget();
  renderDashProgressBar();
  renderDashFMTracker();
  /* [FIX] FM İzin Bakiyesi + AI Rapor Özeti kartları */
  renderDashOTComp();
  renderDashAISummary();
  renderDashYearlyCumul();
  renderDashLast7Days();
  renderDashWeekSummary();
  renderDashHeatmap();
  renderGoals();

  const deb = $('dashEarnSummary');
  if (deb) {
    if (e && (d.wd > 0 || d.wr > 0)) {
      const sl = e.isCurrentMonth ? 'Devam' : e.isFullMonth ? 'Tam' : '−' + e.absentDays + 'g';
      const sc = e.isCurrentMonth ? 'var(--s)' : e.isFullMonth ? 'var(--g)' : 'var(--acc)';
      deb.innerHTML = `<div class="esb" style="margin-top:16px">
        <div class="esb-title"><i class="fas fa-calculator"></i>${MTR[S.cm]} Kazanç</div>
        <div class="esb-grid">
          <div class="esb-item"><div class="esb-val" style="color:var(--p)">${e.paidDays}<small style="font-size:11px;color:var(--t3)">g</small></div><div class="esb-lbl">Ücretli</div></div>
          <div class="esb-item"><div class="esb-val" style="color:${sc}"><small style="font-size:11px">${sl}</small></div><div class="esb-lbl">Durum</div></div>
          <div class="esb-item"><div class="esb-val" style="color:var(--g)">${fm(e.basePay)}</div><div class="esb-lbl">Maaş</div></div>
          <div class="esb-item"><div class="esb-val" style="color:var(--acc)">${fm(e.totalEarning)}</div><div class="esb-lbl">Toplam</div></div>
        </div>
      </div>`;
    } else { deb.innerHTML = ''; }
  }
  renderDashReports(u, d, e);
}

/* Dashboard Mini Reports — tüm bölümlerin kısa özetleri */
function renderDashReports(u, d, e) {
  const el = $('dashReports'); if (!el) return;
  const y = S.cy, m = S.cm;

  /* 1. Vardiya Dağılımı Mini */
  const shiftDist = {};
  getShiftPartsForMonth(u, y, m).forEach(part => {
    const sh = part.sh;
    if (!sh || !sh.start || !sh.end) return;
    const st = getShiftType(sh);
    if (!shiftDist[st.name]) shiftDist[st.name] = { icon:st.icon, days:new Set(), hours:0 };
    shiftDist[st.name].days.add(part.sourceDs || part.ds);
    shiftDist[st.name].hours += Math.max(0, safeNum(part.hours, 0));
  });
  let shiftHtml = '';
  const sdSorted = Object.entries(shiftDist).sort((a,b) => (b[1].days && b[1].days.size || 0) - (a[1].days && a[1].days.size || 0));
  if (sdSorted.length) {
    sdSorted.forEach(([name, v]) => {
      const days = v.days && typeof v.days.size === 'number' ? v.days.size : safeInt(v.days, 0);
      const pct = d.wd > 0 ? (days / d.wd * 100).toFixed(0) : 0;
      shiftHtml += `<div class="dr-row"><span class="drk">${v.icon} ${escHtml(name)}</span><span class="drv">${days}g · ${v.hours.toFixed(1)}s <small style="color:var(--t3);font-weight:600">(${pct}%)</small></span></div>`;
    });
  } else {
    shiftHtml = '<div style="font-size:11px;color:var(--t3);text-align:center;padding:8px">Veri yok</div>';
  }

  /* 2. İzin Durumu Mini */
  const al = annualLeaveTotal(u), ar = Math.max(0, al - d.yau);
  const alPct = al > 0 ? Math.min(100, (d.yau / al) * 100) : 0;
  let leaveMini = `
    <div class="dr-row"><span class="drk"><i class="fas fa-umbrella-beach" style="color:var(--leave-annual)"></i>Y.İzin</span><span class="drv">${ar}/${al}g kalan</span></div>
    <div class="dr-mini-bar"><div class="dr-fill" style="width:${alPct}%;background:linear-gradient(90deg,#3b82f6,#60a5fa)"></div></div>
    <div class="dr-row" style="margin-top:4px"><span class="drk"><i class="fas fa-notes-medical" style="color:var(--leave-sick)"></i>Rapor</span><span class="drv">${d.ysd}g</span></div>
    <div class="dr-row"><span class="drk"><i class="fas fa-couch" style="color:var(--p)"></i>H.Tatil (ay)</span><span class="drv">${d.weeklyRestDays || 0}g</span></div>
    <div class="dr-row"><span class="drk"><i class="fas fa-flag" style="color:var(--r)"></i>R.Tatil İzni</span><span class="drv">${(d.publicHolidayPaidDays || 0).toFixed(1)}g</span></div>
    <div class="dr-row"><span class="drk"><i class="fas fa-ban" style="color:var(--r)"></i>Ücretsiz</span><span class="drv ${d.ud > 0 ? 'neg' : ''}">${d.ud}g</span></div>`;

  /* 3. Kazanç Detay Mini */
  let earnMini = '';
  if (e) {
    const otPct = e.totalEarning > 0 ? (e.overtimePay / e.totalEarning * 100).toFixed(1) : 0;
    const holPct = e.totalEarning > 0 ? (e.holidayPay / e.totalEarning * 100).toFixed(1) : 0;
    earnMini = `
      <div class="dr-row"><span class="drk"><i class="fas fa-money-bill" style="color:var(--g)"></i>Maaş (baz)</span><span class="drv pos">${fm(e.basePay)}</span></div>
      <div class="dr-row"><span class="drk"><i class="fas fa-fire" style="color:var(--acc)"></i>FM Eki</span><span class="drv accent">${fm(e.overtimePay)} <small style="color:var(--t3)">(${otPct}%)</small></span></div>
      <div class="dr-row"><span class="drk"><i class="fas fa-flag" style="color:var(--r)"></i>Tatil Eki</span><span class="drv accent">${fm(e.holidayPay)} <small style="color:var(--t3)">(${holPct}%)</small></span></div>
      <div class="dr-row"><span class="drk"><i class="fas fa-coins" style="color:var(--p)"></i>Günlük</span><span class="drv">${fm(e.dailyRate)}</span></div>
      <div class="dr-row"><span class="drk"><i class="fas fa-clock" style="color:var(--p)"></i>Saatlik (baz)</span><span class="drv">${fm(e.hourlyRate)}</span></div>`;
  } else {
    earnMini = '<div style="font-size:11px;color:var(--t3);text-align:center;padding:8px">Maaş bilgisi girilmemiş</div>';
  }

  /* 4. Performans Mini */
  const avgDaily = d.wd > 0 ? d.th / d.wd : 0;
  const proj2 = getMonthProjection();
  let perfMini = `
    <div class="dr-row"><span class="drk"><i class="fas fa-tachometer-alt" style="color:var(--p)"></i>Gün Ort.</span><span class="drv">${avgDaily.toFixed(1)}s</span></div>
    <div class="dr-row"><span class="drk"><i class="fas fa-percentage" style="color:var(--acc)"></i>FM Oranı</span><span class="drv ${d.oh > 0 ? 'accent' : ''}">${d.th > 0 ? (d.oh / d.th * 100).toFixed(1) : 0}%</span></div>
    <div class="dr-row"><span class="drk"><i class="fas fa-calendar-day" style="color:var(--g)"></i>Tatil Çalışma</span><span class="drv">${d.hdw}g · ${d.hh.toFixed(1)}s</span></div>`;
  if (proj2) {
    perfMini += `<div class="dr-row"><span class="drk"><i class="fas fa-chart-area" style="color:var(--s)"></i>Ay Sonu Tah.</span><span class="drv">${proj2.projected}s</span></div>`;
  }
  // Son 5 vardiya
  const recentShifts = getShiftPartsForMonth(u, y, m)
    .slice()
    .sort((a, b) => b.ds.localeCompare(a.ds) || (b.startMin || 0) - (a.startMin || 0))
    .slice(0, 5);
  if (recentShifts.length) {
    perfMini += '<div style="margin-top:8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Son Vardiyalar</div>';
    recentShifts.forEach(part => {
      const ds = part.ds, sh = part.sh;
      const dd = dsToDate(ds);
      const h = Math.max(0, safeNum(part.hours, 0));
      const st = getShiftType(sh);
      perfMini += `<div class="dr-row"><span class="drk">${st.icon} ${dd.getDate()} ${MTR[dd.getMonth()].substring(0,3)}</span><span class="drv">${part.startLabel}–${part.endLabel} <small style="color:var(--t3)">${h.toFixed(1)}s</small></span></div>`;
    });
  }

  el.innerHTML = `<div class="dash-reports">
    <div class="dash-report"><h4><i class="fas fa-chart-pie"></i>Vardiya Dağılımı</h4>${shiftHtml}</div>
    <div class="dash-report"><h4><i class="fas fa-umbrella-beach"></i>İzin Durumu</h4>${leaveMini}</div>
    <div class="dash-report"><h4><i class="fas fa-wallet"></i>Kazanç Detayı</h4>${earnMini}</div>
    <div class="dash-report"><h4><i class="fas fa-chart-line"></i>Performans</h4>${perfMini}</div>
  </div>`;
}

/* ============================================================
   CALENDAR
============================================================ */
function toggleMultiSelect() {
  S.multiSelect = !S.multiSelect;
  S.selectedDates = [];
  const btn = $('multiSelBtn');
  if (btn) {
    btn.className = S.multiSelect ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
    btn.innerHTML = S.multiSelect ? '<i class="fas fa-check"></i>Bitir' : '<i class="fas fa-object-group"></i>Çoklu Seç';
  }
  if (S.multiSelect) toast('Çoklu seçim açık', 'info');
  renderCal();
}

function renderMultiBar() {
  const el = $('multiBar'); if (!el) return;
  if (!S.multiSelect || !S.selectedDates.length) { el.innerHTML = ''; return; }
  el.innerHTML = `<div class="multi-select-bar">
    <span><i class="fas fa-check-circle"></i> ${S.selectedDates.length} gün</span>
    <div class="actions">
      <button class="btn btn-soft btn-xs" onclick="multiApplyShift()"><i class="fas fa-clock"></i>Vardiya</button>
      <button class="btn btn-xs" style="background:rgba(96,165,250,.15);color:var(--leave-annual)" onclick="multiApplyLeave('annual')">Y.İzin</button>
      <button class="btn btn-xs" style="background:var(--p4);color:var(--p)" onclick="multiApplyLeave('weekly')">H.Tatil</button>
      <button class="btn btn-xs" style="background:rgba(251,146,60,.15);color:var(--leave-sick)" onclick="multiApplyLeave('sick')">Rapor</button>
      <button class="btn btn-danger btn-xs" onclick="multiClear()"><i class="fas fa-times"></i></button>
    </div>
  </div>`;
}

/* [FIX] multiApplyShift — validasyon eklendi */
function multiApplyShift() {
  const u = cu(); if (!u || !S.selectedDates.length) return;
  const defaultStart = '08:00', defaultEnd = '16:00', defaultBreak = 30;
  const check = validateShiftInput(defaultStart, defaultEnd, defaultBreak);
  if (!check.ok) { toast(check.msg || 'Geçersiz varsayılan vardiya', 'error'); return; }
  pushUndo('Çoklu vardiya');
  S.selectedDates.forEach(ds => {
    u.shifts[ds] = { start:defaultStart, end:defaultEnd, break:check.breakMinutes, updatedAt:Date.now() };
    if (u.deletedShifts) delete u.deletedShifts[ds];
    if (u.leaves[ds]) { if (!u.deletedLeaves) u.deletedLeaves = {}; u.deletedLeaves[ds] = Date.now(); }
    delete u.leaves[ds];
  });
  toast(S.selectedDates.length + 'g vardiya eklendi', 'success');
  S.selectedDates = [];
  invalidateMDCache();
  saveLS();
  renderActivePage();
}

function multiApplyLeave(t) {
  const u = cu(); if (!u || !S.selectedDates.length) return;
  if (t === 'annual') {
    const blocked = S.selectedDates.filter(ds => !isAnnualLeaveChargeable(ds));
    if (blocked.length) {
      toast(`Yıllık izin hafta sonu/resmi tatil gününe yazılamaz (${blocked[0]})`, 'error');
      return;
    }
    const yg = {};
    S.selectedDates.forEach(ds => {
      const p = parseDS(ds); if (!p) return;
      if (!yg[p.y]) yg[p.y] = [];
      yg[p.y].push(ds);
    });
    for (const [yr, dates] of Object.entries(yg)) {
      const al = annualLeaveTotal(u);
      const alreadyAnnual = dates.filter(ds => u.leaves[ds] && u.leaves[ds].type === 'annual');
      const used = getAnnualUsed(S.cu, parseInt(yr), alreadyAnnual);
      const newCount = dates.filter(ds => !alreadyAnnual.includes(ds)).length;
      if (used + newCount > al) {
        toast(`${yr} izin hakkı yetersiz! (${Math.max(0, al - used)}g kaldı)`, 'error');
        return;
      }
    }
  }
  if (t === 'public_holiday') {
    const blocked = S.selectedDates.filter(ds => !isH(ds));
    if (blocked.length) {
      toast(`Resmi tatil izni resmi tatil olmayan güne yazılamaz (${blocked[0]})`, 'error');
      return;
    }
  }
  if (t === 'ot_comp') {
    const required = S.selectedDates.length * 8;
    const bal = getOTBalance();
    if (bal < required) {
      toast(`FM izin bakiyesi yetersiz! (Mevcut: ${bal.toFixed(1)}s, gereken: ${required}s)`, 'error');
      return;
    }
  }
  pushUndo('Çoklu izin');
  S.selectedDates.forEach(ds => {
    u.leaves[ds] = { type:t, note:'', updatedAt:Date.now() };
    if (t === 'ot_comp') u.leaves[ds].hours = 8;
    if (u.deletedLeaves) delete u.deletedLeaves[ds];
    if (u.shifts[ds]) { if (!u.deletedShifts) u.deletedShifts = {}; u.deletedShifts[ds] = Date.now(); }
    delete u.shifts[ds];
  });
  toast(S.selectedDates.length + 'g izin eklendi', 'success');
  S.selectedDates = [];
  invalidateMDCache();
  saveLS();
  renderActivePage();
}

function multiClear() { S.selectedDates = []; renderCal(); }

function renderCal() {
  const u = cu(); if (!u) return;
  const y = S.cy, m = S.cm;
  setTxt('calTitle', MTR[m] + ' ' + y);
  const g = $('calGrid'); if (!g) return;
  g.innerHTML = '';
  DTR.forEach(d => { const e = document.createElement('div'); e.className = 'cal-dname'; e.textContent = d; g.appendChild(e); });

  const fd = new Date(y, m, 1);
  let sd2 = fd.getDay(); sd2 = sd2 === 0 ? 6 : sd2 - 1;
  const dim = new Date(y, m + 1, 0).getDate();
  const pip = new Date(y, m, 0).getDate();
  const td = dStr(new Date());
  let mH = 0, mD = 0;

  for (let i = sd2 - 1; i >= 0; i--) {
    const e = document.createElement('div');
    e.className = 'cal-cell out';
    e.innerHTML = `<div class="num">${pip - i}</div>`;
    g.appendChild(e);
  }

  /* [FIX] Akıllı Vardiya Önerileri — renderCal başında bir kere hesapla */
  const suggestions = getSmartSuggestions(y, m);

  for (let d = 1; d <= dim; d++) {
    const s = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const e = document.createElement('div');
    let c = 'cal-cell';
    if (s === td) c += ' today';
    const hol = getH(s), sh = u.shifts[s], lv = u.leaves[s];
    const dayParts = getShiftPartsForDate(u, s);
    const dayHours = dayParts.reduce((sum, part) => sum + Math.max(0, part.hours || 0), 0);
    const displayShift = sh || (dayParts[0] && dayParts[0].sh);
    const dow = new Date(y, m, d).getDay();
    const dn = DTR[dow === 0 ? 6 : dow - 1];
    if (dayParts.length && displayShift && displayShift.start && displayShift.end) {
      c += ' has-shift';
      const stp = getShiftType(displayShift);
      if (stp.key.includes('morning')) c += ' shift-morning';
      else if (stp.key.includes('afternoon')) c += ' shift-afternoon';
      else if (stp.key.includes('evening') || stp.key.includes('night')) c += ' shift-evening';
    }
    else if (lv && lv.type) c += ' leave-' + lv.type;
    else if (hol) c += ' holiday';
    if (S.multiSelect && S.selectedDates.includes(s)) c += ' selecting';

    let inner = `<div class="num"><span>${d}</span><small>${dn}</small></div>`;
    /* [FIX] Akıllı öneri ikonu — boş gün ve öneri varsa göster */
    if (!dayParts.length && !lv && suggestions[s]) {
      inner += `<span class="suggestion-dot" title="✅ Yasal sınırlara uygun, eklenebilir (11s dinlenme & 45s/hafta)">💡</span>`;
    }
    if (dayParts.length && displayShift && displayShift.start && displayShift.end) {
      const h = dayHours;
      if (h > 0) { mH += h; mD++; }
      const sType = getShiftType(displayShift);
      const firstPart = dayParts[0];
      const partLabel = dayParts.length === 1 ? `${firstPart.startLabel}–${firstPart.endLabel}` : `${dayParts.length} parça`;
      const shiftLabel = sh ? `${escHtml(sh.start)}–${escHtml(sh.end)}` : `${escHtml(partLabel)} (devam)`;
      /* [FIX L-06] FM yasal olarak 45s/hafta bazlıdır, günlük 9s sınırı yoktur.
         CSS sınıfı 'long-shift' olarak yeniden adlandırıldı; 8.5s üstü uzun vardiya göstergesi. */
      inner += `<div class="hrs-display ${h > 8.5 ? 'long-shift' : ''}">${h.toFixed(1)}s</div>`;
      inner += `<div class="shift-icon">${sType.icon}</div>`;
      inner += `<div class="shift-time">${shiftLabel}${isNightShift(displayShift.start, displayShift.end) ? ' 🌙' : ''}</div>`;
      if (displayShift.note) inner += `<div class="shift-time" style="color:var(--p3);opacity:.7">📝 ${escHtml(displayShift.note.substring(0,20))}</div>`;
      if (hol) inner += `<span class="hol-tag">🏛️ ${escHtml(hol)}</span>`;
    } else if (lv && lv.type) {
      /* [FIX] FM İzni dahil tüm izin türleri */
      const ic = { annual:'fa-umbrella-beach', weekly:'fa-couch', public_holiday:'fa-flag', sick:'fa-notes-medical', unpaid:'fa-ban', ot_comp:'fa-exchange-alt' };
      const lb = { annual:'Y.İzin', weekly:'H.Tatil', public_holiday:'R.Tatil', sick:'Rapor', unpaid:'Ücretsiz', ot_comp:'FM İzni' };
      inner += `<div class="leave-display ld-${lv.type}"><i class="fas ${ic[lv.type]||'fa-circle'}"></i>${lb[lv.type]||''}</div>`;
      inner += `<span class="leave-label ll-${lv.type}">${lb[lv.type]||''}</span>`;
      if (hol) inner += `<span class="hol-tag">${escHtml(hol)}</span>`;
    } else if (hol) {
      inner += `<span class="hol-tag">${escHtml(hol)}</span>`;
    }
    e.className = c;
    e.innerHTML = inner;
    e.dataset.date = s;
    e.setAttribute('tabindex', '0');
    e.setAttribute('role', 'button');
    /* [FIX ERİŞİLEBİLİRLİK-01] Ekran okuyucuya vardiya saatleri ve izin türü iletiliyor */
    const _lvA11y = {annual:'Yıllık İzin',weekly:'Haftalık Tatil',public_holiday:'Resmi Tatil',sick:'Rapor',unpaid:'Ücretsiz İzin',ot_comp:'FM İzni'};
    const _a11yDesc = dayParts.length && displayShift ? `${displayShift.start}–${displayShift.end} (${dayHours.toFixed(1)}s)${hol?' — '+hol:''}` : lv ? (_lvA11y[lv.type]||'İzin') : hol || 'Boş';
    e.setAttribute('aria-label', `${d} ${MTR[m]} ${y}: ${_a11yDesc}`);
    if (sh && sh.start) e.draggable = true;
    g.appendChild(e);
  }

  const tot = sd2 + dim;
  const rem = tot % 7 === 0 ? 0 : 7 - (tot % 7);
  for (let i = 1; i <= rem; i++) {
    const e = document.createElement('div');
    e.className = 'cal-cell out';
    e.innerHTML = `<div class="num">${i}</div>`;
    g.appendChild(e);
  }

  setTxt('calSummary', mD > 0 ? `${mD}g • ${mH.toFixed(1)}s` : '');

  const ceb = $('calEarnBar');
  if (ceb) {
    if (u.netSalary > 0) {
      const md = getMD(y, m);
      if (md.wd > 0 || md.wr > 0 || md.mau > 0 || md.msd > 0) {
        const e2 = calcEarningForMonth(y, m, u.netSalary);
        if (e2) {
          ceb.innerHTML = `<div class="cal-earn-bar">
            <div class="ceb"><i class="fas fa-calendar-day"></i>Günlük: <b>${fm(e2.dailyRate)}</b></div>
            <div class="ceb"><i class="fas fa-calendar-check"></i>Ücretli: <b>${e2.paidDays}g</b></div>
            ${e2.absentDays > 0 ? `<div class="ceb"><i class="fas fa-minus-circle"></i>Eksik: <b style="color:var(--r)">${e2.absentDays}g</b></div>` : ''}
            <div class="ceb"><i class="fas fa-wallet"></i><b class="accent">${fm(e2.totalEarning)}</b></div>
          </div>`;
        } else { ceb.innerHTML = ''; }
      } else { ceb.innerHTML = ''; }
    } else { ceb.innerHTML = ''; }
  }
  renderCopyBar();
  renderMultiBar();
  renderCalMonthSummary();
  renderShiftStats();
}

function chgM(d) {
  S.cm += d;
  if (S.cm > 11) { S.cm = 0; S.cy++; }
  if (S.cm < 0) { S.cm = 11; S.cy--; }
  S.selectedDates = [];
  invalidateMDCache();
  renderActivePage();
}

function goToday() {
  S.cm = new Date().getMonth();
  S.cy = new Date().getFullYear();
  S.selectedDates = [];
  invalidateMDCache();
  renderActivePage();
}

function copyShift() {
  const u = cu(); if (!u || !S.sd) return;
  const sh = u.shifts[S.sd];
  if (sh) {
    S.clipboard = { ...sh };
    renderCopyBar();
    closeM();
    toast('Kopyalandı', 'info');
  }
}

function pasteShift(ds) {
  const u = cu(); if (!u || !S.clipboard) return;
  const clippedShift = normalizeShiftRecord(S.clipboard);
  if (!clippedShift) { toast('Kopyalanan vardiya geçersiz', 'error'); return; }
  const doPaste = () => {
    pushUndo('Yapıştır');
    const nowTs = Date.now();
    if (u.shifts[ds]) { if (!u.deletedShifts) u.deletedShifts = {}; u.deletedShifts[ds] = nowTs; }
    u.shifts[ds] = { ...clippedShift, updatedAt:nowTs };
    if (u.deletedShifts) delete u.deletedShifts[ds];
    if (u.leaves[ds]) { if (!u.deletedLeaves) u.deletedLeaves = {}; u.deletedLeaves[ds] = nowTs; }
    delete u.leaves[ds];
    invalidateMDCache();
    saveLS();
    renderActivePage();
    toast('Yapıştırıldı', 'success');
  };
  /* [FIX N-06] Mevcut izin kaydının üzerine yapıştırma için onay iste */
  if (u.leaves[ds] || u.shifts[ds]) {
    const existingType = u.leaves[ds] ? (u.leaves[ds].type || 'izin') : 'vardiya';
    showConfirm('Kayıt Değiştirilecek', `${ds} için mevcut "${existingType}" kaydı var. Yapıştırılırsa bu kayıt değişecek. Devam?`, doPaste);
  } else {
    doPaste();
  }
}

function pasteAndClose() {
  if (!S.clipboard || !S.sd) return;
  pasteShift(S.sd);
  closeM();
}

function clearClipboard() { S.clipboard = null; renderCopyBar(); }

/* [FEAT F1] Bu haftayı bir sonraki haftaya kopyala — "Sonraki Haftaya Kopyala" */
function copyThisWeekToNext() {
  const u = cu(); if (!u) return;
  const today = new Date();
  const todayDow = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - todayDow);
  const nextMonday = new Date(thisMonday);
  nextMonday.setDate(thisMonday.getDate() + 7);
  const src = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(thisMonday); d.setDate(thisMonday.getDate() + i);
    const ds = dStr(d);
    if (u.shifts[ds]) src.push({ dow: i, shift: { ...u.shifts[ds] } });
    else if (u.leaves[ds]) src.push({ dow: i, leave: { ...u.leaves[ds] } });
  }
  if (!src.length) { toast('Bu haftada veri yok', 'error'); return; }
  const shiftCount = src.filter(s => s.shift).length;
  showConfirm('Sonraki Haftaya Kopyala', `Bu haftanın ${shiftCount} vardiyası bir sonraki haftaya kopyalanacak. Dolu günler korunur.`, () => {
    pushUndo('Sonraki haftaya kopyala');
    let count = 0;
    src.forEach(item => {
      const targetDate = new Date(nextMonday);
      targetDate.setDate(nextMonday.getDate() + item.dow);
      const ds = dStr(targetDate);
      if (u.shifts[ds] || u.leaves[ds]) return;
      if (item.shift) {
        const copiedShift = normalizeShiftRecord(item.shift);
        if (!copiedShift) return;
        u.shifts[ds] = { ...copiedShift, updatedAt: Date.now() };
        if (u.deletedShifts) delete u.deletedShifts[ds];
        count++;
      } else if (item.leave) {
        const copiedLeave = normalizeLeaveRecord(item.leave);
        if (!copiedLeave) return;
        if (copiedLeave.type === 'annual' && !isAnnualLeaveChargeable(ds)) return;
        u.leaves[ds] = { ...copiedLeave, updatedAt: Date.now() };
        if (u.deletedLeaves) delete u.deletedLeaves[ds];
      }
    });
    invalidateMDCache(); saveLS(); renderActivePage();
    toast(`${count} vardiya sonraki haftaya kopyalandı`, 'success');
  });
}

function repeatLastWeek() {
  const u = cu(); if (!u) return;
  const today = new Date();
  const todayDow = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - todayDow);
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);
  const lastWeekShifts = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(lastMonday); d.setDate(lastMonday.getDate() + i);
    const ds = dStr(d);
    if (u.shifts[ds]) lastWeekShifts.push({ dow: i, shift: { ...u.shifts[ds] } });
    else if (u.leaves[ds]) lastWeekShifts.push({ dow: i, leave: { ...u.leaves[ds] } });
  }
  if (!lastWeekShifts.length) { toast('Geçen hafta veri yok', 'error'); return; }
  const shiftCount = lastWeekShifts.filter(s => s.shift).length;
  showConfirm('Haftayı Tekrarla', `Geçen haftanın ${shiftCount} vardiyası bu haftaya kopyalanacak. Boş günler doldurulacak.`, () => {
    pushUndo('Hafta tekrarla');
    let count = 0;
    lastWeekShifts.forEach(item => {
      const targetDate = new Date(thisMonday);
      targetDate.setDate(thisMonday.getDate() + item.dow);
      const ds = dStr(targetDate);
      if (u.shifts[ds] || u.leaves[ds]) return;
      if (item.shift) {
        const copiedShift = normalizeShiftRecord(item.shift);
        if (!copiedShift) return;
        u.shifts[ds] = { ...copiedShift, updatedAt: Date.now() };
        if (u.deletedShifts) delete u.deletedShifts[ds];
        count++;
      } else if (item.leave) {
        const copiedLeave = normalizeLeaveRecord(item.leave);
        if (!copiedLeave) return;
        if (copiedLeave.type === 'annual' && !isAnnualLeaveChargeable(ds)) return;
        u.leaves[ds] = { ...copiedLeave, updatedAt: Date.now() };
        if (u.deletedLeaves) delete u.deletedLeaves[ds];
      }
    });
    invalidateMDCache(); saveLS(); renderActivePage();
    toast(`${count} vardiya bu haftaya kopyalandı`, 'success');
  });
}

/* Vardiya tipini belirle */
function getShiftType(sh) {
  if (!sh || !sh.start || !sh.end) return { key:'unknown', name:'Bilinmiyor', icon:'⏰' };
  const ps = getAllPresets();
  for (const [k, v] of Object.entries(ps)) {
    if (v.start === sh.start && v.end === sh.end) {
      if (k === 'morning') return { key:k, name:'Sabah', icon:'🌅' };
      if (k === 'afternoon') return { key:k, name:'Öğlen', icon:'🌇' };
      if (k === 'evening') return { key:k, name:'Akşam', icon:'🌙' };
      return { key:k, name:v.name||'Özel', icon:v.icon||'⏰' };
    }
  }
  if (isNightShift(sh.start, sh.end)) return { key:'night', name:'Gece', icon:'🌙' };
  const h = parseInt(sh.start.split(':')[0], 10);
  if (h < 12) return { key:'morning_custom', name:'Sabah', icon:'🌅' };
  if (h < 17) return { key:'afternoon_custom', name:'Öğlen', icon:'🌇' };
  return { key:'evening_custom', name:'Akşam', icon:'🌙' };
}

/* Takvim ay özeti kartı */
function renderCalMonthSummary() {
  const el = $('calMonthSummary'); if (!el) return;
  const u = cu(); if (!u) { el.innerHTML = ''; return; }
  const now = new Date();
  const md = getMD(S.cy, S.cm, (S.cy === now.getFullYear() && S.cm === now.getMonth()) ? { throughDay:now.getDate() } : undefined);
  if (md.wd === 0 && md.wr === 0) { el.innerHTML = ''; return; }
  const e = u.netSalary ? calcEarningForMonth(S.cy, S.cm, u.netSalary) : null;
  const avgDaily = md.wd > 0 ? (md.th / md.wd).toFixed(1) : '0';
  el.innerHTML = `<div class="cal-month-summary">
    <div class="cms-item"><span class="cms-val">${md.th.toFixed(1)}</span><span class="cms-lbl">Toplam Saat</span></div>
    <div class="cms-div"></div>
    <div class="cms-item"><span class="cms-val">${md.oh.toFixed(1)}</span><span class="cms-lbl">FM Saat</span></div>
    <div class="cms-div"></div>
    <div class="cms-item"><span class="cms-val">${avgDaily}</span><span class="cms-lbl">Gün Ort.</span></div>
    <div class="cms-div"></div>
    <div class="cms-item"><span class="cms-val">${e ? fm(e.totalEarning) : '—'}</span><span class="cms-lbl">Kazanç</span></div>
  </div>`;
}

/* Vardiya dağılım istatistiklerini render et */
function renderShiftStats() {
  const el = $('shiftStats'); if (!el) return;
  const u = cu(); if (!u) { el.innerHTML = ''; return; }

  /* Aylık verileri topla */
  const y = S.cy, m = S.cm;
  const monthData = {}, yearData = {};

  getShiftPartRows(u).forEach(part => {
    const ds = part.ds, sh = part.sh;
    const p = parseDS(ds);
    if (!p || !sh || !sh.start || !sh.end) return;
    const sType = getShiftType(sh);
    const groupKey = sType.name;
    const h = Math.max(0, safeNum(part.hours, 0));

    /* Yıllık */
    if (p.y === y) {
      if (!yearData[groupKey]) yearData[groupKey] = { icon:sType.icon, days:new Set(), hours:0 };
      yearData[groupKey].days.add(ds);
      yearData[groupKey].hours += h;
    }
    /* Aylık */
    if (p.y === y && p.m === m) {
      if (!monthData[groupKey]) monthData[groupKey] = { icon:sType.icon, days:new Set(), hours:0 };
      monthData[groupKey].days.add(ds);
      monthData[groupKey].hours += h;
    }
  });

  if (Object.keys(monthData).length === 0 && Object.keys(yearData).length === 0) {
    el.innerHTML = '';
    return;
  }

  function buildCards(data) {
    if (Object.keys(data).length === 0) return '<div class="ss-empty">Henüz vardiya verisi yok</div>';
    const sorted = Object.entries(data).sort((a, b) => (b[1].days && b[1].days.size || 0) - (a[1].days && a[1].days.size || 0));
    const topKey = sorted[0][0];
    return '<div class="ss-grid">' + sorted.map(([name, d]) =>
      `<div class="ss-card ${name === topKey ? 'ss-top' : ''}">
        <div class="ss-icon">${d.icon}</div>
        <div class="ss-name">${escHtml(name)}${name === topKey ? ' <i class="fas fa-crown" style="color:var(--g);font-size:8px"></i>' : ''}</div>
        <div class="ss-count">${d.days && d.days.size || 0} <small style="font-size:10px;font-weight:600">gün</small></div>
        <div class="ss-hours">${d.hours.toFixed(1)} saat</div>
      </div>`
    ).join('') + '</div>';
  }

  el.innerHTML = `
    <div class="shift-stats">
      <h3><i class="fas fa-chart-pie"></i>Vardiya Dağılımı</h3>
      <div class="ss-tabs">
        <div class="ss-tab active" onclick="switchSSTab('month',this)">Bu Ay</div>
        <div class="ss-tab" onclick="switchSSTab('year',this)">Yıllık (${y})</div>
      </div>
      <div id="ssMonth">${buildCards(monthData)}</div>
      <div id="ssYear" style="display:none">${buildCards(yearData)}</div>
    </div>`;
}

function switchSSTab(tab, btn) {
  document.querySelectorAll('.ss-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const mEl = $('ssMonth'), yEl = $('ssYear');
  if (mEl) mEl.style.display = tab === 'month' ? 'block' : 'none';
  if (yEl) yEl.style.display = tab === 'year' ? 'block' : 'none';
}

function renderCopyBar() {
  const el = $('copyBar'); if (!el) return;
  if (S.clipboard && S.clipboard.start && S.clipboard.end) {
    const check = validateShiftInput(S.clipboard.start, S.clipboard.end, S.clipboard.break || 0);
    const h = check.ok ? check.netHours : 0;
    el.innerHTML = `<div class="copy-bar"><span><i class="fas fa-clipboard"></i> ${escHtml(S.clipboard.start)}–${escHtml(S.clipboard.end)} (${h.toFixed(1)}s)</span><button class="btn btn-soft btn-xs" onclick="clearClipboard()"><i class="fas fa-times"></i></button></div>`;
  } else { el.innerHTML = ''; }
}

function getAllPresets() {
  const ps = { ...PRESETS_BASE };
  const u = cu();
  if (u && u.customPresets && Array.isArray(u.customPresets)) {
    u.customPresets.forEach((cp, i) => {
      if (cp && cp.start && cp.end) ps['cp_' + i] = { start:cp.start, end:cp.end, break:cp.break||0, name:cp.name||'Özel', icon:cp.icon||'⏰' };
    });
  }
  return ps;
}

/* ============================================================
   SHIFT MODAL
============================================================ */
function openM(ds) {
  S.sd = ds;
  const d = dsToDate(ds);
  const dow = d.getDay();
  const dn = DFL[dow === 0 ? 6 : dow - 1];
  setTxt('mTitle', d.getDate() + ' ' + MTR[d.getMonth()]);
  setTxt('mDate', dn);

  const hol = getH(ds);
  const u = cu(); if (!u) return;
  const sh = u.shifts[ds], lv = u.leaves[ds];

  const al = $('mAlert');
  if (al) {
    if (hol) {
      al.style.display = 'flex';
      setTxt('mAlertTx', `${hol} — Çalışma ek ücret hak eder`);
    } else { al.style.display = 'none'; }
  }

  const cw = $('mConflictWarn');
  if (cw) {
    if (sh && sh.start) {
      cw.style.display = 'flex';
      setTxt('mConflictTx', 'Bu günde zaten vardiya var. Değiştirebilir veya silebilirsiniz.');
    } else if (lv && lv.type) {
      cw.style.display = 'flex';
      setTxt('mConflictTx', 'Bu günde ' + {annual:'yıllık izin',weekly:'hafta tatili',public_holiday:'resmi tatil',sick:'rapor',unpaid:'ücretsiz izin'}[lv.type] + ' var. Üzerine yazabilirsiniz.');
    } else { cw.style.display = 'none'; }
  }

  /* [FIX] Gece vardiyası notu — varsayılan olarak gizli */
  const ni = $('mNightInfo');
  if (ni) ni.style.display = 'none';

  mMode('shift', document.querySelectorAll('.mode-tab')[0]);
  S.lt = null;
  document.querySelectorAll('.lt-opt').forEach(o => o.classList.remove('active'));
  const iNote = $('iNote'), iShiftNote = $('iShiftNote');
  const iStart = $('iStart'), iEnd = $('iEnd'), iBreak = $('iBreak');
  const mDel = $('mDel'), mCopy = $('mCopy');
  if (iNote) iNote.value = '';
  if (iShiftNote) iShiftNote.value = '';
  renderModalPresets();
  const mP = $('mPaste'); if (mP) mP.style.display = S.clipboard ? 'inline-flex' : 'none';

  if (sh && sh.start && sh.end) {
    if (iStart) iStart.value = sh.start;
    if (iEnd) iEnd.value = sh.end;
    if (iBreak) iBreak.value = String(sh.break || 0);
    if (iShiftNote) iShiftNote.value = sh.note || '';
    if (mDel) mDel.style.display = 'inline-flex';
    if (mCopy) mCopy.style.display = 'inline-flex';
    hlPreset(sh);
  } else if (lv && lv.type) {
    mMode('leave', document.querySelectorAll('.mode-tab')[1]);
    const el2 = document.querySelector(`.lt-opt[data-t="${lv.type}"]`);
    if (el2) selLT(lv.type, el2);
    if (iNote) iNote.value = lv.note || '';
    if (mDel) mDel.style.display = 'inline-flex';
    if (mCopy) mCopy.style.display = 'none';
  } else {
    if (iStart) iStart.value = '08:00'; if (iEnd) iEnd.value = '16:00'; if (iBreak) iBreak.value = '30';
    if (mDel) mDel.style.display = 'none'; if (mCopy) mCopy.style.display = 'none';
    const mp = document.querySelector('.preset[data-key="morning"]');
    if (mp) applyPreset('morning', mp);
  }
  updResult();
  const modal = $('modal'); if (modal) modal.classList.add('show');
}

function renderModalPresets() {
  const row = $('presetRow'); if (!row) return;
  const u = cu();
  let h = `
    <div class="preset" data-key="morning" onclick="applyPreset('morning',this)"><span class="p-icon">🌅</span><span class="p-name">Sabah</span><span class="p-time">08–16</span></div>
    <div class="preset" data-key="afternoon" onclick="applyPreset('afternoon',this)"><span class="p-icon">🌇</span><span class="p-name">Öğlen</span><span class="p-time">12–20</span></div>
    <div class="preset" data-key="evening" onclick="applyPreset('evening',this)"><span class="p-icon">🌙</span><span class="p-name">Akşam</span><span class="p-time">16–00</span></div>
  `;
  if (u && u.customPresets && Array.isArray(u.customPresets)) {
    u.customPresets.forEach((cp, i) => {
      if (!cp || !cp.start || !cp.end) return;
      h += `<div class="preset" data-key="cp_${i}" onclick="applyPreset('cp_${i}',this)">
        <span class="p-icon">${escHtml(cp.icon || '⏰')}</span>
        <span class="p-name">${escHtml(cp.name || 'Özel')}</span>
        <span class="p-time">${escHtml(cp.start.substring(0,5))}–${escHtml(cp.end.substring(0,5))}</span>
      </div>`;
    });
  }
  h += `<div class="preset" data-key="custom" onclick="applyPreset('custom',this)"><span class="p-icon">⚙️</span><span class="p-name">Özel</span><span class="p-time">Serbest</span></div>`;
  row.innerHTML = h;
}

function hlPreset(sh) {
  const ps = getAllPresets();
  document.querySelectorAll('.preset').forEach(p => p.classList.remove('active'));
  for (const [k, v] of Object.entries(ps)) {
    if (v.start === sh.start && v.end === sh.end && (v.break || 0) === (sh.break || 0)) {
      const el = document.querySelector(`.preset[data-key="${k}"]`);
      if (el) { el.classList.add('active'); return; }
    }
  }
  const c = document.querySelector('.preset[data-key="custom"]');
  if (c) c.classList.add('active');
}

function closeM() { const m = $('modal'); if (m) m.classList.remove('show'); S.sd = null; const ep = document.getElementById('noteEmojiPicker'); if (ep) ep.remove(); }

function mMode(t, btn) {
  S.mt = t;
  document.querySelectorAll('.mode-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const mSh = $('mShift'); if (mSh) mSh.style.display = t === 'shift' ? 'block' : 'none';
  const mLv = $('mLeave'); if (mLv) mLv.style.display = t === 'leave' ? 'block' : 'none';
  const cw = $('mConflictWarn');
  if (cw && S.sd) {
    const u = cu();
    if (u) {
      const sh = u.shifts[S.sd], lv = u.leaves[S.sd];
      if (t === 'shift' && lv && lv.type) {
        cw.style.display = 'flex';
        setTxt('mConflictTx', 'Bu günde ' + {annual:'yıllık izin',weekly:'hafta tatili',public_holiday:'resmi tatil',sick:'rapor',unpaid:'ücretsiz izin'}[lv.type] + ' var. Kaydetmek üzerine yazacak.');
      } else if (t === 'leave' && sh && sh.start) {
        cw.style.display = 'flex';
        setTxt('mConflictTx', 'Bu günde ' + sh.start + '–' + sh.end + ' vardiyası var. Kaydetmek üzerine yazacak.');
      } else { cw.style.display = 'none'; }
    }
  }
}

function selLT(t, el) {
  S.lt = t;
  document.querySelectorAll('.lt-opt').forEach(o => o.classList.remove('active'));
  if (el) el.classList.add('active');
}

function applyPreset(key, el) {
  document.querySelectorAll('.preset').forEach(p => p.classList.remove('active'));
  if (el) el.classList.add('active');
  const ps = getAllPresets();
  if (key !== 'custom' && ps[key]) {
    const is2 = $('iStart'), ie2 = $('iEnd'), ib2 = $('iBreak');
    if (is2) is2.value = ps[key].start;
    if (ie2) ie2.value = ps[key].end;
    if (ib2) ib2.value = String(ps[key].break || 0);
  }
  updResult();
}

/* [FIX] Haftalık FM hesabı: seçili gün dahil, o haftadaki tüm saatleri toplar */
function getWeekOTForDay(ds, currentNet, currentShift) {
  const u = cu(); if (!u || !ds) return { ot: 0, ot125: 0, weekTotal: 0 };
  const wk = getISOWeek(dsToDate(ds));
  let weekTotal = 0;
  getShiftPartRows(u, part => part.wk === wk && part.sourceDs !== ds)
    .forEach(part => { weekTotal += Math.max(0, part.hours || 0); });
  if (currentShift && currentShift.start && currentShift.end) {
    getShiftDayParts(ds, currentShift).forEach(part => {
      if (getISOWeek(dsToDate(part.ds)) === wk) weekTotal += Math.max(0, part.hours || 0);
    });
  } else {
    weekTotal += Math.max(0, safeNum(currentNet, 0));
  }
  const weeklyContractHours = getWeeklyContractHours(u);
  const ot125 = Math.min(Math.max(0, weekTotal - weeklyContractHours), Math.max(0, 45 - weeklyContractHours));
  const ot = Math.max(0, weekTotal - 45);
  return { ot, ot125, weekTotal, weeklyContractHours };
}

function updResult() {
  const isEl = $('iStart'), ieEl = $('iEnd'), ibEl = $('iBreak');
  if (!isEl || !ieEl || !ibEl) return;
  const s = isEl.value, e = ieEl.value, b = safeInt(ibEl.value, 0);
  if (!s || !e) return;
  const shiftCheck = validateShiftInput(s, e, b, { allowEqual: false });
  const gross = grossHr(s, e);
  if (!shiftCheck.ok) {
    setTxt('rbGross', Number.isFinite(gross) ? gross.toFixed(1) + 's' : '—');
    setTxt('rbBreak', Math.max(0, b) + 'dk');
    setTxt('rbNet', '—');
    setTxt('rbOT', '—');
    const epInvalid = $('mEarningPreview'); if (epInvalid) epInvalid.textContent = '';
    return;
  }
  const net = shiftCheck.netHours;
  setTxt('rbGross', gross.toFixed(1) + 's');
  setTxt('rbBreak', b + 'dk');
  setTxt('rbNet', net.toFixed(1) + 's');
  /* [FIX] FM: haftalık 45s bazlı gösterim (tek vardiya değil) */
  const rbOT = $('rbOT');
  if (rbOT) {
    const weekOT = getWeekOTForDay(S.sd, net, { start:s, end:e, break:b });
    const premiumHours = (weekOT.ot || 0) + (weekOT.ot125 || 0);
    rbOT.textContent = premiumHours > 0 ? '+' + premiumHours.toFixed(1) + 's' : '—';
    rbOT.style.color = premiumHours > 0 ? 'var(--acc)' : 'var(--t3)';
    rbOT.title = premiumHours > 0
      ? `Hafta toplamı: ${weekOT.weekTotal.toFixed(1)}s (${weekOT.weeklyContractHours}s sözleşme, 45s yasal limit)`
      : `Haftalık ${weekOT.weeklyContractHours}s sözleşme eşiği aşılmadı`;
  }

  /* [FIX] Gece vardiyası bilgi notu */
  const ni = $('mNightInfo');
  if (ni) {
    if (isNightShift(s, e)) {
      ni.style.display = 'flex';
      setTxt('mNightTx', 'Gece vardiyası — saatler gün bazında bölünür; rapor ve dışa aktarımda ertesi gün payı ayrıca görünür.');
    } else {
      ni.style.display = 'none';
    }
  }

  /* [FIX Md.68] Zorunlu ara dinlenme kontrolü */
  const bi = $('mBreakInfo');
  if (bi) {
    const minBreak = net > 7.5 ? 60 : net > 4 ? 30 : net > 0 ? 15 : 0;
    if (minBreak > 0 && b < minBreak) {
      bi.style.display = 'flex';
      setTxt('mBreakTx', `Md.68: ${net.toFixed(1)}s çalışma için en az ${minBreak} dk mola zorunlu (girilen: ${b} dk).`);
    } else {
      bi.style.display = 'none';
    }
  }

  const u = cu(); const ep = $('mEarningPreview'); if (!ep) return;
  if (u && u.netSalary > 0 && net > 0) {
    const _mh2 = getMonthlyHours(u);
    const hr = u.netSalary / _mh2;
    const holPay2 = holidayPayWeight(S.sd, { start:s, end:e, break:b });
    /* [FIX L-05] Yalnızca bu vardiyaya atfedilen FM eki gösterilmeli.
       Önceki hafta toplamını (bu gün hariç, 0 saat) alıp farkı hesapla:
       shiftOT = max(0, (öncekiHafta+net) - 45) - max(0, öncekiHafta - 45) */
    const prevWeek = getWeekOTForDay(S.sd, 0);
    const weekWithShift = getWeekOTForDay(S.sd, net, { start:s, end:e, break:b });
    const shiftOT = Math.max(0, weekWithShift.ot - prevWeek.ot);
    const shiftOT125 = Math.max(0, (weekWithShift.ot125 || 0) - (prevWeek.ot125 || 0));
    let earn = 0;
    if (holPay2 > 0) earn += (u.netSalary / 30) * holPay2;  // Md.47: ilave tatil ücreti
    if (shiftOT > 0 && (u.otCompMode || 'pay') !== 'leave') earn += shiftOT * hr * getOTRate(u);
    const shiftP = parseDS(S.sd);
    if (shiftOT125 > 0 && (u.otCompMode || 'pay') !== 'leave') earn += shiftOT125 * hr * payrollCfg(shiftP ? shiftP.y : new Date().getFullYear()).otPartialMultiplier;
    ep.textContent = (Number.isFinite(earn) && earn > 0) ? `💰 Tahmini ek: ~${fm(earn)}` : '';
  } else { ep.textContent = ''; }
}

function saveEntry() {
  const u = cu(); if (!u || !S.sd) return;

  if (S.mt === 'shift') {
    const isE = $('iStart'), ieE = $('iEnd'), ibE = $('iBreak');
    if (!isE || !ieE || !ibE) return;
    const st = isE.value, en = ieE.value, brRaw = safeInt(ibE.value, 0);
    const shiftCheck = validateShiftInput(st, en, brRaw);
    if (!shiftCheck.ok) { toast(shiftCheck.msg, 'error'); return; }
    const br = shiftCheck.breakMinutes;
    const hrs = shiftCheck.netHours;

    /* [FIX Md.68] Zorunlu mola uyarısı — engellemez, bildirir */
    const _minBrk = hrs > 7.5 ? 60 : hrs > 4 ? 30 : hrs > 0 ? 15 : 0;
    if (_minBrk > 0 && br < _minBrk) {
      toast(`Uyarı (Md.68): ${hrs.toFixed(1)}s çalışma için en az ${_minBrk} dk mola girilmeli.`, 'warning');
    }

    /* Gece vardiyası taşma bildirimi: önceki günün vardiyasının bu güne taşan parçası varsa bildir */
    const _sdParsed = parseDS(S.sd);
    if (_sdParsed) {
      const _prevDate = new Date(_sdParsed.y, _sdParsed.m, _sdParsed.d - 1);
      const _prevDs = dStr(_prevDate);
      const _prevShift = u.shifts[_prevDs];
      if (_prevShift) {
        const _prevParts = getShiftDayParts(_prevDs, _prevShift);
        const _spillPart = _prevParts.find(p2 => p2.ds === S.sd);
        if (_spillPart) {
          setTimeout(() => toast(
            `Bilgi: ${_prevDs} gece vardiyasının ${_spillPart.hours.toFixed(2)}s'i bu güne taşıyor — saatler birlikte hesaplanacak.`,
            'info'
          ), 300);
        }
      }
    }

    const doSave = () => {
      pushUndo('Vardiya');
      const snEl = $('iShiftNote');
      const note = (snEl ? snEl.value : '').trim().substring(0, 100);
      /* Canlı Kazanç Bildirimi — kayıt öncesi kazanç */
      const _p = parseDS(S.sd);
      const _eBefore = (_p && u.netSalary) ? calcEarningForMonth(_p.y, _p.m, u.netSalary) : null;
      if (u.shifts[S.sd]) {
        toast('Bu gün için tek vardiya modeli kullanılıyor; mevcut vardiya güncellendi.', 'warning');
      }
      u.shifts[S.sd] = { start:st, end:en, break:br, note, updatedAt:Date.now() };
      if (u.deletedShifts) delete u.deletedShifts[S.sd];
      if (u.leaves[S.sd]) { if (!u.deletedLeaves) u.deletedLeaves = {}; u.deletedLeaves[S.sd] = Date.now(); }
      delete u.leaves[S.sd];
      invalidateMDCache();
      /* Canlı Kazanç Bildirimi — kayıt sonrası kazanç farkı */
      const _eAfter = (_p && u.netSalary) ? calcEarningForMonth(_p.y, _p.m, u.netSalary) : null;
      if (_eBefore && _eAfter && (_eAfter.totalEarning - _eBefore.totalEarning) > 0.5) {
        toast(`✅ ${hrs.toFixed(1)}s eklendi — Kazancına ~${fm(_eAfter.totalEarning - _eBefore.totalEarning)} eklendi`, 'success');
      } else {
        toast(`${hrs.toFixed(1)}s kaydedildi`, 'success');
      }
      /* [FEAT F3] Yasal FM sınırı bildirimi (Md.41) */
      if (_p) {
        const yOT = getYearlyOT(_p.y);
        const qOT = getQuarterlyOT(_p.y, _p.m);
        if (yOT >= 270) {
          setTimeout(() => toast(`⚠️ Yıllık FM sınırı aşıldı: ${yOT.toFixed(0)}s / 270s (Md.41)`, 'error'), 600);
        } else if (yOT >= 240) {
          setTimeout(() => toast(`⚠️ Yıllık FM sınırına ${(270-yOT).toFixed(0)}s kaldı (${yOT.toFixed(0)}/270s)`, 'warning'), 600);
        } else if (yOT >= 200) {
          setTimeout(() => toast(`💡 Yıllık FM: ${yOT.toFixed(0)}s (yasal sınır 270s)`, 'info'), 600);
        } else if (qOT >= 90) {
          setTimeout(() => toast(`⚠️ Son 3 ayda FM: ${qOT.toFixed(0)}s (Md.41 — 3 ay 90s önerisi)`, 'warning'), 600);
        }
      }
      saveLS(); closeM(); renderActivePage();
    };

    // Rest time check
    const restWarn = checkRestTime(S.sd, st);
    if (restWarn) {
      showConfirm('Dinlenme Uyarısı',
        `Önceki vardiya (${restWarn.prevDate}) ${restWarn.prevEnd}'de bitti. Dinlenme: ${restWarn.restHours}s (min ${restWarn.required}s). Devam?`,
        () => {
          if (checkHolidayWork(S.sd)) {
            showConfirm('Tatil Vardiyası', `Bu gün resmi tatil! Tatilde çalışma kaydı eklenecek. Devam?`, doSave);
          } else { doSave(); }
        }
      );
      return;
    }

    /* [FIX Y-02] Mevcut izin kaydının üzerine vardiya yazılmak üzere — onay iste */
    if (u.leaves[S.sd]) {
      const existingLeaveType = u.leaves[S.sd].type || 'izin';
      const proceedAfterLeaveOverwrite = () => {
        if (checkHolidayWork(S.sd)) {
          showConfirm('Tatil Vardiyası', `Bu gün resmi tatil! Tatilde çalışma kaydı eklenecek. Devam?`, doSave);
        } else { doSave(); }
      };
      showConfirm('İzin Kaydı Silinecek', `Bu gün için "${existingLeaveType}" izin kaydı var. Vardiya eklenirse izin silinecek. Devam?`, proceedAfterLeaveOverwrite);
      return;
    }

    if (checkHolidayWork(S.sd)) {
      showConfirm('Tatil Vardiyası', `Bu gün resmi tatil! Tatilde çalışma kaydı eklenecek. Devam?`, doSave);
      return;
    }

    doSave();
    return;
    } else {
    if (!S.lt) { toast('İzin türü seçin', 'error'); return; }
    if (S.lt === 'public_holiday' && !isH(S.sd)) {
      toast('Resmi tatil izni yalnızca resmi tatil gününe yazılabilir', 'error');
      return;
    }
    if (S.lt === 'annual') {
      if (!isAnnualLeaveChargeable(S.sd)) {
        toast('Yıllık izin hafta sonu veya resmi tatil gününe yazılamaz', 'error');
        return;
      }
      const p = parseDS(S.sd);
      if (p) {
        const isAlreadyAnnual = u.leaves[S.sd] && u.leaves[S.sd].type === 'annual';
        const excArr = isAlreadyAnnual ? [S.sd] : [];
        const used = getAnnualUsed(S.cu, p.y, excArr);
        if (used >= annualLeaveTotal(u)) { toast('Yıllık izin hakkı doldu!', 'error'); return; }
      }
    }
    /* [FIX] FM İzni — bakiye kontrolü (her gün = 8 saat FM hakkı) */
    if (S.lt === 'ot_comp') {
      const bal = getOTBalance();
      const required = 8;
      if (bal < required) {
        toast(`FM izin bakiyesi yetersiz! (Mevcut: ${bal.toFixed(1)}s, gereken: ${required}s)`, 'error');
        return;
      }
    }
    /* [FIX Y-02] Mevcut vardiya kaydının üzerine izin yazılmak üzere — onay iste */
    const doSaveLeave = () => {
      pushUndo('İzin');
      const inEl = $('iNote');
      u.leaves[S.sd] = { type:S.lt, note:(inEl ? inEl.value : '').trim().substring(0, 100), updatedAt:Date.now() };
      if (S.lt === 'ot_comp') u.leaves[S.sd].hours = 8;
      if (u.deletedLeaves) delete u.deletedLeaves[S.sd];
      if (u.shifts[S.sd]) { if (!u.deletedShifts) u.deletedShifts = {}; u.deletedShifts[S.sd] = Date.now(); }
      delete u.shifts[S.sd];
      toast('Kaydedildi', 'success');
      if (S.lt === 'annual') {
        const _pl = parseDS(S.sd);
        if (_pl) {
          const total = annualLeaveTotal(u);
          const used = getAnnualUsed(S.cu, _pl.y);
          const remain = total - used;
          if (remain === 0) setTimeout(() => toast('Yıllık izin hakkı bitti (0 gün kaldı)', 'warning'), 500);
          else if (remain > 0 && remain <= 3) setTimeout(() => toast(`${remain} yıllık izin günü kaldı`, 'warning'), 500);
        }
      }
      invalidateMDCache(); saveLS(); closeM(); renderActivePage();
    };
    if (u.shifts[S.sd]) {
      const sh = u.shifts[S.sd];
      showConfirm('Vardiya Silinecek', `Bu gün için ${sh.start}–${sh.end} vardiyası var. İzin eklenirse vardiya silinecek. Devam?`, doSaveLeave);
      return;
    }
    doSaveLeave();
    return;
  }
}

function delEntry() {
  showConfirm('Sil', 'Bu girdiyi silmek istiyor musunuz?', () => {
    const u = cu(); if (!u || !S.sd) return;
    pushUndo('Silme');
    const now = Date.now();
    if (u.shifts[S.sd]) { if (!u.deletedShifts) u.deletedShifts = {}; u.deletedShifts[S.sd] = now; }
    if (u.leaves[S.sd]) { if (!u.deletedLeaves) u.deletedLeaves = {}; u.deletedLeaves[S.sd] = now; }
    delete u.shifts[S.sd];
    delete u.leaves[S.sd];
    invalidateMDCache();
    saveLS();
    closeM();
    renderActivePage();
    toast('Silindi', 'success');
  });
}

/* ============================================================
   STATS
============================================================ */
function renderStats() {
  const u = cu(); if (!u) return;
  const data = getTrendData();
  const el = $('statsContent'); if (!el) return;
  if (!data.length || data.every(d => d.hours === 0)) {
    el.innerHTML = '<div class="empty"><i class="fas fa-chart-line"></i><p>Yeterli veri yok</p></div>';
    return;
  }
  const maxH = Math.max(1, ...data.map(d => d.hours));
  const maxE = Math.max(1, ...data.map(d => d.earning));
  const nonZeroH = data.filter(d => d.hours > 0);
  const nonZeroE = data.filter(d => d.earning > 0);
  const avgH = nonZeroH.length ? nonZeroH.reduce((a, d) => a + d.hours, 0) / nonZeroH.length : 0;
  const avgE = nonZeroE.length ? nonZeroE.reduce((a, d) => a + d.earning, 0) / nonZeroE.length : 0;
  const totalH = data.reduce((a, d) => a + d.hours, 0);
  const totalOT = data.reduce((a, d) => a + d.overtime, 0);
  const totalE = data.reduce((a, d) => a + d.earning, 0);
  const W = 680, H = 220, pad = 50, barW = 60, gap = (W - pad * 2 - barW * 6) / 5;
  let hourBars = '', hourLine = '', hourDots = '', labels = '', gridLines = '';
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const yy = pad + (H - pad * 2) * (1 - i / steps);
    const val = Math.round(maxH * i / steps);
    gridLines += `<line x1="${pad}" y1="${yy}" x2="${W-20}" y2="${yy}" class="trend-grid"/>`;
    if (i > 0) hourBars += `<text x="${pad-8}" y="${yy+4}" text-anchor="end" class="trend-label" font-size="10">${val}</text>`;
  }
  const pts = [];
  data.forEach((d, i) => {
    const x = pad + i * (barW + gap);
    const bH = maxH > 0 ? (d.hours / maxH) * (H - pad * 2) : 0;
    const yy = pad + (H - pad * 2) - bH;
    hourBars += `<rect x="${x}" y="${yy}" width="${barW}" height="${bH}" rx="6" fill="url(#barGrad)" opacity=".7"><title>${escHtml(d.fullLabel)}: ${d.hours.toFixed(1)}s</title></rect>`;
    if (d.overtime > 0) {
      const otH = maxH > 0 ? (d.overtime / maxH) * (H - pad * 2) : 0;
      hourBars += `<rect x="${x}" y="${yy}" width="${barW}" height="${Math.min(otH, bH)}" rx="6" fill="var(--acc)" opacity=".35"><title>FM: ${d.overtime.toFixed(1)}s</title></rect>`;
    }
    const cx = x + barW / 2, cy = yy;
    pts.push(`${cx},${cy}`);
    hourDots += `<circle cx="${cx}" cy="${cy}" r="4" fill="var(--p)" stroke="var(--bg2)" stroke-width="2"><title>${d.hours.toFixed(1)}s</title></circle>`;
    labels += `<text x="${x+barW/2}" y="${H-8}" text-anchor="middle" class="trend-label" font-size="11">${escHtml(d.label)}</text>`;
    hourBars += `<text x="${x+barW/2}" y="${yy-6}" text-anchor="middle" class="trend-val" font-size="11">${d.hours > 0 ? d.hours.toFixed(0) : ''}</text>`;
  });
  if (pts.length > 1) hourLine = `<polyline points="${pts.join(' ')}" class="trend-line" stroke="var(--p)" opacity=".6"/>`;
  let earnBars = '', earnLine2 = '', earnDots2 = '', labels2 = '', gridLines2 = '';
  for (let i = 0; i <= steps; i++) {
    const yy = pad + (H - pad * 2) * (1 - i / steps);
    const val = maxE * i / steps;
    gridLines2 += `<line x1="${pad}" y1="${yy}" x2="${W-20}" y2="${yy}" class="trend-grid"/>`;
    if (i > 0) earnBars += `<text x="${pad-8}" y="${yy+4}" text-anchor="end" class="trend-label" font-size="9">${fm(val)}</text>`;
  }
  const pts2 = [];
  data.forEach((d, i) => {
    const x = pad + i * (barW + gap);
    const bH = maxE > 0 ? (d.earning / maxE) * (H - pad * 2) : 0;
    const yy = pad + (H - pad * 2) - bH;
    earnBars += `<rect x="${x}" y="${yy}" width="${barW}" height="${bH}" rx="6" fill="url(#earnGrad)" opacity=".7"><title>${escHtml(d.fullLabel)}: ${fm(d.earning)}</title></rect>`;
    const cx = x + barW / 2, cy = yy;
    pts2.push(`${cx},${cy}`);
    earnDots2 += `<circle cx="${cx}" cy="${cy}" r="4" fill="var(--g)" stroke="var(--bg2)" stroke-width="2"><title>${fm(d.earning)}</title></circle>`;
    labels2 += `<text x="${x+barW/2}" y="${H-8}" text-anchor="middle" class="trend-label" font-size="11">${escHtml(d.label)}</text>`;
    earnBars += `<text x="${x+barW/2}" y="${yy-6}" text-anchor="middle" class="trend-val" font-size="10">${d.earning > 0 ? fm(d.earning) : ''}</text>`;
  });
  if (pts2.length > 1) earnLine2 = `<polyline points="${pts2.join(' ')}" class="trend-line" stroke="var(--g)" opacity=".6"/>`;
  /* [FIX ERR-HANDLE-14] data boş değilse 5217'deki erken dönüş girer; yine de savunmacı ol */
  const lastM = data.length ? data[data.length-1] : { hours: 0, earning: 0 };
  const prevM = data.length > 1 ? data[data.length-2] : null;
  const hDiff = prevM && prevM.hours > 0 ? ((lastM.hours - prevM.hours) / prevM.hours * 100) : 0;
  const eDiff = prevM && prevM.earning > 0 ? ((lastM.earning - prevM.earning) / prevM.earning * 100) : 0;
  const avgYLine = avgH > 0 && maxH > 0 ? `<line x1="${pad}" y1="${pad+(H-pad*2)*(1-avgH/maxH)}" x2="${W-20}" y2="${pad+(H-pad*2)*(1-avgH/maxH)}" stroke="var(--acc)" stroke-width="1" stroke-dasharray="6 3" opacity=".5"/><text x="${W-18}" y="${pad+(H-pad*2)*(1-avgH/maxH)-4}" class="trend-label" font-size="9" fill="var(--acc)">ort</text>` : '';
  const avgELine = avgE > 0 && maxE > 0 ? `<line x1="${pad}" y1="${pad+(H-pad*2)*(1-avgE/maxE)}" x2="${W-20}" y2="${pad+(H-pad*2)*(1-avgE/maxE)}" stroke="var(--acc)" stroke-width="1" stroke-dasharray="6 3" opacity=".5"/><text x="${W-18}" y="${pad+(H-pad*2)*(1-avgE/maxE)-4}" class="trend-label" font-size="9" fill="var(--acc)">ort</text>` : '';
  el.innerHTML = `
  <div class="stats" style="margin-bottom:20px">
    <div class="stat"><div class="ribbon"></div><div class="ico"><i class="fas fa-clock"></i></div><div class="val">${totalH.toFixed(0)}</div><div class="lbl">6 Ay Toplam Saat</div></div>
    <div class="stat"><div class="ribbon"></div><div class="ico"><i class="fas fa-chart-line"></i></div><div class="val">${avgH.toFixed(0)}s</div><div class="lbl">Aylık Ortalama</div></div>
    <div class="stat"><div class="ribbon"></div><div class="ico"><i class="fas fa-fire"></i></div><div class="val">${totalOT.toFixed(1)}s</div><div class="lbl">6 Ay FM</div></div>
    <div class="stat"><div class="ribbon"></div><div class="ico"><i class="fas fa-wallet"></i></div><div class="val">${fm(totalE)}</div><div class="lbl">6 Ay Kazanç</div></div>
    <div class="stat"><div class="ribbon"></div><div class="ico"><i class="fas fa-arrow-${hDiff>=0?'up':'down'}"></i></div><div class="val">${hDiff>=0?'+':''}${hDiff.toFixed(1)}%</div><div class="lbl">Saat Değişim</div><span class="change ${hDiff>=0?'up':'down'}">Son aya göre</span></div>
    <div class="stat"><div class="ribbon"></div><div class="ico"><i class="fas fa-arrow-${eDiff>=0?'up':'down'}"></i></div><div class="val">${eDiff>=0?'+':''}${eDiff.toFixed(1)}%</div><div class="lbl">Kazanç Değişim</div><span class="change ${eDiff>=0?'up':'down'}">Son aya göre</span></div>
  </div>
  <div class="grid-2">
    <div class="card"><div class="card-head"><h3><i class="fas fa-chart-bar"></i>6 Aylık Trend — Saat</h3><span style="font-size:10px;color:var(--t3)">Ort: ${avgH.toFixed(0)}s</span></div>
      <div class="trend-chart-wrap"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
        <defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--p)" stop-opacity=".9"/><stop offset="100%" stop-color="var(--p2)" stop-opacity=".5"/></linearGradient></defs>
        ${gridLines}${hourBars}${hourLine}${hourDots}${labels}${avgYLine}
      </svg></div>
    </div>
    <div class="card"><div class="card-head"><h3><i class="fas fa-wallet"></i>6 Aylık Trend — Kazanç</h3><span style="font-size:10px;color:var(--t3)">Ort: ${fm(avgE)}</span></div>
      <div class="trend-chart-wrap"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
        <defs><linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--g)" stop-opacity=".9"/><stop offset="100%" stop-color="var(--g)" stop-opacity=".3"/></linearGradient></defs>
        ${gridLines2}${earnBars}${earnLine2}${earnDots2}${labels2}${avgELine}
      </svg></div>
    </div>
  </div>
  <div class="card" style="margin-top:16px">
    <div class="card-head"><h3><i class="fas fa-table"></i>Aylık Detay</h3></div>
    <div style="overflow-x:auto"><table>
      <thead><tr><th>Ay</th><th>Gün</th><th>Saat</th><th>FM</th><th>Tatil</th><th>İzin</th><th>Kazanç</th></tr></thead>
      <tbody>${data.map(d => `<tr>
        <td style="font-weight:700">${escHtml(d.fullLabel)}</td>
        <td>${d.days}</td>
        <td style="font-weight:800">${d.hours.toFixed(1)}</td>
        <td style="font-weight:700;color:${d.overtime>0?'var(--acc)':'inherit'}">${d.overtime.toFixed(1)}</td>
        <td>${d.holidays}</td>
        <td>${d.leaves}</td>
        <td style="font-weight:800;color:var(--g)">${d.earning>0?fm(d.earning):'—'}</td>
      </tr>`).join('')}</tbody>
    </table></div>
  </div>
  ${renderDayOfWeekChart()}
  ${renderStatsShiftDist(data)}
  ${renderStatsProductivity(data)}`;
}

function renderDayOfWeekChart() {
  const stats = getDayOfWeekStats();
  if (!stats || stats.days.every(d => d === 0)) return '';
  const maxD = Math.max(1, ...stats.days);
  let bars = '';
  DTR.forEach((name, i) => {
    const pct = maxD > 0 ? (stats.days[i] / maxD * 100) : 0;
    const avg = stats.days[i] > 0 ? (stats.hours[i] / stats.days[i]).toFixed(1) : '0';
    bars += `<div class="wk-row">
      <span class="label">${name}</span>
      <div class="track"><div class="fill ok" style="width:${pct}%">${stats.days[i]}g</div></div>
      <span class="hrs" title="Ort: ${avg}s">${stats.hours[i].toFixed(0)}s</span>
    </div>`;
  });
  return `<div class="card" style="margin-top:16px">
    <div class="card-head"><h3><i class="fas fa-calendar-day"></i>Gün Bazlı Dağılım</h3><span style="font-size:10px;color:var(--t3)">Tüm zamanlar</span></div>
    ${bars}
  </div>`;
}

/* Stats — 6 Aylık Vardiya Tipi Dağılımı */
function renderStatsShiftDist(trendData) {
  const u = cu(); if (!u) return '';
  const allTypes = {};
  const monthTypes = {};
  trendData.forEach(td => {
    const prefix = `${td.y}-${String(td.m+1).padStart(2,'0')}`;
    monthTypes[td.label] = {};
    for (const [ds, sh] of Object.entries(u.shifts)) {
      if (!sh || !sh.start || !sh.end || !ds.startsWith(prefix)) continue;
      const st = getShiftType(sh);
      if (!allTypes[st.name]) allTypes[st.name] = { icon: st.icon, total: 0 };
      allTypes[st.name].total++;
      if (!monthTypes[td.label][st.name]) monthTypes[td.label][st.name] = 0;
      monthTypes[td.label][st.name]++;
    }
  });
  const typeNames = Object.keys(allTypes).sort((a, b) => allTypes[b].total - allTypes[a].total);
  if (!typeNames.length) return '';

  const colors = ['var(--p)', 'var(--g)', 'var(--acc)', 'var(--s)', '#fb923c', '#f43f5e'];
  let rows = '';
  trendData.forEach(td => {
    const mt = monthTypes[td.label] || {};
    const total = Object.values(mt).reduce((a, v) => a + v, 0) || 1;
    let segs = '';
    typeNames.forEach((tn, ti) => {
      const cnt = mt[tn] || 0;
      if (cnt === 0) return;
      const pct = (cnt / total * 100).toFixed(1);
      segs += `<div style="width:${pct}%;background:${colors[ti % colors.length]};height:100%;border-radius:3px" title="${tn}: ${cnt}g (${pct}%)"></div>`;
    });
    rows += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
      <span style="min-width:40px;font-size:11px;font-weight:700;color:var(--t2)">${escHtml(td.label)}</span>
      <div style="flex:1;height:14px;border-radius:3px;background:rgba(255,255,255,.04);display:flex;gap:1px;overflow:hidden">${segs}</div>
      <span style="min-width:30px;font-size:10px;font-weight:800;color:var(--t3);text-align:right">${Object.values(mt).reduce((a,v)=>a+v,0)}g</span>
    </div>`;
  });
  let legend = '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">';
  typeNames.forEach((tn, ti) => {
    legend += `<span style="display:flex;align-items:center;gap:4px;font-size:10px;font-weight:700;color:var(--t2)">
      <span style="width:10px;height:10px;border-radius:3px;background:${colors[ti % colors.length]};display:inline-block"></span>
      ${allTypes[tn].icon} ${escHtml(tn)} (${allTypes[tn].total}g)
    </span>`;
  });
  legend += '</div>';
  return `<div class="card" style="margin-top:16px">
    <div class="card-head"><h3><i class="fas fa-chart-pie"></i>Vardiya Tipi Dağılımı</h3><span style="font-size:10px;color:var(--t3)">6 aylık trend</span></div>
    ${rows}${legend}
  </div>`;
}

/* Stats — Verimlilik Analizi */
function renderStatsProductivity(trendData) {
  const u = cu(); if (!u) return '';
  const nonZero = trendData.filter(d => d.days > 0);
  if (nonZero.length < 2) return '';
  const avgDailyHrs = nonZero.map(d => d.days > 0 ? d.hours / d.days : 0);
  const maxAvg = Math.max(1, ...avgDailyHrs);
  const otRatios = nonZero.map(d => d.hours > 0 ? (d.overtime / d.hours * 100) : 0);

  let rows = '';
  nonZero.forEach((d, i) => {
    const dAvg = avgDailyHrs[i];
    const otR = otRatios[i];
    const pct = maxAvg > 0 ? (dAvg / maxAvg * 100).toFixed(1) : 0;
    rows += `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.03);font-size:11px">
      <span style="min-width:40px;font-weight:700;color:var(--t2)">${escHtml(d.label)}</span>
      <div style="flex:1;height:8px;border-radius:4px;background:rgba(255,255,255,.06);overflow:hidden">
        <div style="width:${pct}%;height:100%;border-radius:4px;background:var(--pg)"></div>
      </div>
      <span style="min-width:45px;font-weight:800;text-align:right">${dAvg.toFixed(1)}s/g</span>
      <span style="min-width:45px;font-weight:700;text-align:right;color:${otR > 15 ? 'var(--acc)' : 'var(--t3)'}">${otR.toFixed(0)}% FM</span>
    </div>`;
  });

  const overallAvg = nonZero.reduce((a, d) => a + d.hours, 0) / nonZero.reduce((a, d) => a + d.days, 0);
  const bestMonth = nonZero.reduce((best, d, i) => avgDailyHrs[i] > (best.avg || 0) ? { label: d.label, avg: avgDailyHrs[i] } : best, {});
  const mostOT = nonZero.reduce((best, d, i) => otRatios[i] > (best.ratio || 0) ? { label: d.label, ratio: otRatios[i] } : best, {});

  return `<div class="card" style="margin-top:16px">
    <div class="card-head"><h3><i class="fas fa-tachometer-alt"></i>Verimlilik Analizi</h3></div>
    <div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap">
      <div style="font-size:10px;color:var(--t3)">Genel Ort: <b style="color:#fff">${overallAvg.toFixed(1)}s/g</b></div>
      <div style="font-size:10px;color:var(--t3)">En Verimli: <b style="color:var(--g)">${escHtml(bestMonth.label||'—')} (${(bestMonth.avg||0).toFixed(1)}s/g)</b></div>
      <div style="font-size:10px;color:var(--t3)">En Yoğun FM: <b style="color:var(--acc)">${escHtml(mostOT.label||'—')} (${(mostOT.ratio||0).toFixed(0)}%)</b></div>
    </div>
    ${rows}
  </div>`;
}

/* ============================================================
   LEAVES
============================================================ */
function chgLeaveYear(d) {
  S.lvy += d;
  renderLeaves();
}

function renderLeaves() {
  const u = cu(); if (!u) return;
  const y = S.lvy;

  let yau = 0, ysd = 0, wr_year = 0, ud_year = 0;
  Object.entries(u.leaves).forEach(([k, v]) => {
    const p = parseDS(k); if (!p || p.y !== y || !v || !v.type) return;
    if (v.type === 'annual') yau++;
    if (v.type === 'sick') ysd++;
    if (v.type === 'weekly' || v.type === 'public_holiday') wr_year++;
    if (v.type === 'unpaid') ud_year++;
  });

  const at = annualLeaveTotal(u), ar = Math.max(0, at - yau);
  const dr = u.netSalary ? u.netSalary / 30 : 0;
  setTxt('leaveYr', String(y));

  setHtml('leaveCards', `
    <div class="card leave-c"><h4><i class="fas fa-umbrella-beach" style="color:var(--leave-annual)"></i>Yıllık İzin</h4>
      <div class="big" style="color:var(--leave-annual)">${ar} <small>/ ${at}g</small></div>
      <div class="pbar"><div class="pf" style="width:${Math.min(100,at>0?(yau/at)*100:0)}%;background:linear-gradient(90deg,#3b82f6,#60a5fa)"></div></div>
      <div class="meta"><span>Kullanılan: ${yau}</span><span>Kalan: ${ar}</span></div>
    </div>
    <div class="card leave-c"><h4><i class="fas fa-notes-medical" style="color:var(--leave-sick)"></i>Rapor</h4>
      <div class="big" style="color:var(--leave-sick)">${ysd} <small>gün</small></div>
      <div class="pbar"><div class="pf" style="width:${Math.min(100,ysd/20*100)}%;background:linear-gradient(90deg,#f59e0b,#fbbf24)"></div></div>
      <div class="meta"><span>${y} yılı</span><span>${ysd}g</span></div>
    </div>
    <div class="card leave-c"><h4><i class="fas fa-couch" style="color:var(--p)"></i>Hafta Tatili</h4>
      <div class="big" style="color:var(--p)">${wr_year} <small>gün</small></div>
      <div class="pbar"><div class="pf" style="width:${Math.min(100,wr_year/52*100)}%;background:var(--pg)"></div></div>
      <div class="meta"><span>${y} yılı</span><span>${wr_year}g</span></div>
    </div>
    <div class="card leave-c"><h4><i class="fas fa-ban" style="color:var(--r)"></i>Ücretsiz</h4>
      <div class="big" style="color:var(--r)">${ud_year} <small>gün</small></div>
      <div class="pbar"><div class="pf" style="width:${Math.min(100,ud_year/30*100)}%;background:linear-gradient(90deg,#ef4444,#f87171)"></div></div>
      <div class="meta"><span>Kesinti</span><span>${u.netSalary ? fm(ud_year * dr) : '—'}</span></div>
    </div>
  `);

  const sw = $('leaveSearchWrap');
  if (sw && !sw.querySelector('.search-bar')) {
    sw.innerHTML = `<div class="search-bar"><i class="fas fa-search"></i><input type="text" id="leaveSearch" placeholder="Tarih veya not ara..." oninput="renderLeaveTable()"></div>`;
  }

  renderLeaveTable();
}

function renderLeaveTable() {
  const u = cu(); if (!u) return;
  const y = S.lvy;
  const filter = ($('leaveFilter') || {}).value || 'all';
  const searchQ = (($('leaveSearch') || {}).value || '').toLowerCase();

  const all = Object.entries(u.leaves).filter(([k, v]) => {
    const p = parseDS(k); if (!p || p.y !== y || !v || !v.type) return false;
    if (filter !== 'all' && v.type !== filter) return false;
    if (searchQ) {
      const dateStr = k + ' ' + (v.note || '');
      if (!dateStr.toLowerCase().includes(searchQ)) return false;
    }
    return true;
  }).sort((a, b) => b[0].localeCompare(a[0]));

  const lt = $('leaveTable'); if (!lt) return;
  if (!all.length) { lt.innerHTML = '<div class="empty"><i class="fas fa-check-circle"></i><p>Kayıt yok</p></div>'; return; }

  const tl = { annual:'Yıllık', weekly:'H.Tatil', public_holiday:'R.Tatil', sick:'Rapor', unpaid:'Ücretsiz' };
  const tc = { annual:'a', weekly:'w', sick:'s', unpaid:'u' };
  let t = '<table><thead><tr><th>Tarih</th><th>Gün</th><th>Tür</th><th>Not</th><th></th></tr></thead><tbody>';
  all.forEach(([k, v]) => {
    const dd = dsToDate(k);
    const dow = dd.getDay();
    t += `<tr>
      <td>${dd.getDate()} ${MTR[dd.getMonth()]}</td>
      <td>${DFL[dow===0?6:dow-1]}</td>
      <td><span class="tag tag-${tc[v.type]||'u'}">${tl[v.type]||escHtml(v.type)}</span></td>
      <td style="color:var(--t2)">${escHtml(v.note) || '—'}</td>
      <td><button class="btn btn-danger btn-xs del-lv-btn" data-ds="${escHtml(k)}"><i class="fas fa-trash"></i></button></td>
    </tr>`;
  });
  t += '</tbody></table>';
  lt.innerHTML = t;
  lt.querySelectorAll('.del-lv-btn').forEach(btn => {
    btn.addEventListener('click', function() { delLv(this.dataset.ds); });
  });
}

function delLv(k) {
  showConfirm('Sil', 'İzni silmek istiyor musunuz?', () => {
    const u = cu(); if (!u) return;
    pushUndo('İzin silme');
    if (!u.deletedLeaves) u.deletedLeaves = {};
    u.deletedLeaves[k] = Date.now();
    delete u.leaves[k];
    invalidateMDCache();
    saveLS();
    renderActivePage();
    toast('Silindi', 'success');
  });
}

/* ============================================================
   EARNINGS
============================================================ */
function calcCumulativeEarnings(u, upToY, upToM) {
  if (!u || !u.netSalary) return { total: 0, months: 0 };
  const seen = new Set();
  [...Object.keys(u.shifts || {}), ...Object.keys(u.leaves || {})].forEach(d => {
    const parts = d.split('-');
    seen.add(parts[0] + '-' + parts[1]);
  });
  let total = 0, months = 0;
  for (const ym of seen) {
    const [ys, ms] = ym.split('-');
    const y2 = +ys, m2 = +ms - 1;
    if (y2 > upToY || (y2 === upToY && m2 > upToM)) continue;
    const e2 = calcEarningForMonth(y2, m2, u.netSalary);
    if (e2 && !e2.isFutureMonth && e2.totalEarning > 0) {
      total += e2.totalEarning;
      months++;
    }
  }
  return { total, months };
}

function getPaidEarningBreakdown(u, y, m, e) {
  const dailyRate = safeNum(e && e.dailyRate, 0);
  const workDays = Math.max(0, safeNum(e && (e.workPaidDays !== undefined ? e.workPaidDays : e.workedDays), 0));
  const leaveDays = { weekly:0, annual:0, sick:0, ot_comp:0 };
  const standardDailyHours = Math.max(1, getMonthlyHours(u) / 30);

  Object.entries((u && u.leaves) || {}).forEach(([ds, lv]) => {
    const p = parseDS(ds);
    if (!p || p.y !== y || p.m !== m || !lv || !lv.type) return;
    if (u.shifts && u.shifts[ds]) return;
    if (!Object.prototype.hasOwnProperty.call(leaveDays, lv.type)) return;

    const dt = dsToDate(ds);
    if (!dt || isNaN(dt.getTime())) return;
    const naturalFreeDay = dt.getDay() === 0 || dt.getDay() === 6 || holidayWeight(ds) > 0;
    if (naturalFreeDay) return;

    if (lv.type === 'ot_comp') leaveDays.ot_comp += Math.min(1, getOTCompLeaveHours(u, lv) / standardDailyHours);
    else leaveDays[lv.type] += 1;
  });

  const leaveTotal = leaveDays.weekly + leaveDays.annual + leaveDays.sick + leaveDays.ot_comp;
  const workBase = workDays * dailyRate;
  const leaveBase = leaveTotal * dailyRate;
  const paidBase = workBase + leaveBase;
  return {
    workDays,
    leaveDays,
    leaveTotal,
    workBase,
    leaveBase,
    paidDays: workDays + leaveTotal,
    paidBase,
    trackerTotal: paidBase + (safeNum(e && e.overtimePay, 0)) + (safeNum(e && e.overtimePay125, 0)) + (safeNum(e && e.holidayPay, 0))
  };
}

function formatDayCount(v) {
  const n = safeNum(v, 0);
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

function renderDailyEarningsTracker(u, y, m, e) {
  if (!u || !u.netSalary || e.isFutureMonth) return '';
  const isCur  = e.isCurrentMonth;
  const dim    = e.dim;
  const evDays = e.evaluableDays || dim;
  const pct    = Math.min(100, Math.round((evDays / dim) * 100));

  const wd = e.workedDays || 0;
  const wdPct = Math.min(100, dim > 0 ? Math.round((wd / dim) * 100) : 0);

  const progressBar = isCur ? `
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--t2);margin-bottom:5px">
        <span>${wd} / ${dim} gün girildi</span>
        <span style="font-weight:700;color:var(--p)">${wdPct}%</span>
      </div>
      <div style="background:var(--b2);border-radius:6px;height:7px;overflow:hidden">
        <div style="background:linear-gradient(90deg,var(--p),var(--acc));width:${wdPct}%;height:100%;border-radius:6px;transition:.4s ease"></div>
      </div>
    </div>` : '';

  const row = (icon, label, val, col) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--b2)">
      <span style="font-size:13px;color:var(--t2)">${icon}&nbsp;${label}</span>
      <span style="font-size:13px;font-weight:700;color:${col}">${val}</span>
    </div>`;

  const paidBreakdown = getPaidEarningBreakdown(u, y, m, e);

  let rows = row('📅', `${paidBreakdown.workDays}g çalışma × ${fm(e.dailyRate)}`, fm(paidBreakdown.workBase), 'var(--t1)');
  if (paidBreakdown.leaveTotal > 0) {
    const leaveLabels = [];
    if (paidBreakdown.leaveDays.weekly > 0) leaveLabels.push(`${formatDayCount(paidBreakdown.leaveDays.weekly)}g hafta tatili`);
    if (paidBreakdown.leaveDays.annual > 0) leaveLabels.push(`${formatDayCount(paidBreakdown.leaveDays.annual)}g yıllık izin`);
    if (paidBreakdown.leaveDays.sick > 0) leaveLabels.push(`${formatDayCount(paidBreakdown.leaveDays.sick)}g rapor`);
    if (paidBreakdown.leaveDays.ot_comp > 0) leaveLabels.push(`${formatDayCount(paidBreakdown.leaveDays.ot_comp)}g FM izni`);
    rows += row('🏖️', `Ücretli izin (${leaveLabels.join(', ')}) × ${fm(e.dailyRate)}`, fm(paidBreakdown.leaveBase), 'var(--p)');
  }
  if (e.overtimePay > 0)
    rows += row('🔥', `${e.overtimeHours.toFixed(1)}s FM × ${getOTRate(u)}`, '+' + fm(e.overtimePay), '#f97316');
  if ((e.overtimePay125||0) > 0)
    rows += row('⚡', `${(e.overtimeHours125||0).toFixed(1)}s FÇ × ${e.partialRate||1.25}`, '+' + fm(e.overtimePay125), '#fb923c');
  if (e.holidayPay > 0)
    rows += row('🏛️', `${(e.holidayPayDays||e.holidayDays).toFixed(1)}g tatil ilave`, '+' + fm(e.holidayPay), 'var(--g)');
  if ((e.freePassDays || 0) > 0)
    rows += row('📅', `${e.freePassDays}g hafta sonu/tatil (aylık ücrete dahil)`, fm(e.freePassDays * e.dailyRate), 'var(--t2)');

  const cumul = calcCumulativeEarnings(u, y, m);
  const cumulLine = cumul.months > 1 ? `
    <div style="margin-top:10px;padding:10px 12px;background:linear-gradient(135deg,rgba(var(--p-rgb),.12),rgba(var(--acc-rgb),.08));border-radius:10px;border:1px solid rgba(var(--p-rgb),.2)">
      <div style="font-size:10px;color:var(--t2);margin-bottom:3px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">
        <i class="fas fa-layer-group"></i>&nbsp;Son takvim girişine kadar toplam (${cumul.months} ay)
      </div>
      <div style="font-weight:900;font-size:22px;color:var(--p)">${fm(cumul.total)}</div>
    </div>` : '';

  return `
  <div class="earn-section">
    <h3><i class="fas fa-chart-line"></i>GÜNLÜK KAZANÇ TAKİBİ
      ${isCur ? '<span style="font-size:10px;background:var(--p);color:#fff;padding:2px 8px;border-radius:20px;margin-left:6px;font-weight:700">CANLI</span>' : ''}
    </h3>
    ${progressBar}
    ${rows}
      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;margin-top:4px">
        <span style="font-weight:800;font-size:13px;color:#fff"><i class="fas fa-wallet" style="color:var(--p)"></i>&nbsp;BU AY TOPLAM</span>
        <span style="font-weight:900;font-size:20px;color:var(--p)">${fm(e.totalEarning)}</span>
    </div>
    ${cumulLine}
  </div>`;
}

function renderEarn() {
  const u = cu(); if (!u) return;
  const y = S.ey, m = S.em;
  setTxt('earnTitle', MTR[m] + ' ' + y);
  const ec = $('earnContent'); if (!ec) return;

  if (!u.netSalary || u.netSalary <= 0) {
    ec.innerHTML = '<div class="hint"><i class="fas fa-exclamation-triangle"></i><span>Kazanç raporu için Ayarlar\'dan maaş bilginizi girin.</span></div>';
    return;
  }

  const d = getMD(y, m);
  if (d.wd === 0 && d.wr === 0 && d.mau === 0 && d.msd === 0 && d.ud === 0) {
    const e0 = calcEarningForMonth(y, m, u.netSalary);
    ec.innerHTML = '<div class="empty"><i class="fas fa-calendar-times"></i><p>Bu ay için veri yok</p></div>' + renderEmployeeRightsPanel(u, y, m, d, e0);
    return;
  }

  const e = calcEarningForMonth(y, m, u.netSalary);
  if (!e) { ec.innerHTML = ''; return; }
  const paidBreakdown = getPaidEarningBreakdown(u, y, m, e);

  let pm2 = m - 1, py2 = y;
  if (pm2 < 0) { pm2 = 11; py2--; }
  const prevE = calcEarningForMonth(py2, pm2, u.netSalary);
  const diff = prevE && !prevE.isFutureMonth && prevE.totalEarning > 0 ? e.totalEarning - prevE.totalEarning : 0;

  const dim = d.dim;
  const fd = new Date(y, m, 1);
  let fdow = fd.getDay(); fdow = fdow === 0 ? 6 : fdow - 1;
  let dgHtml = '<div style="margin-top:16px"><div style="font-size:11px;font-weight:700;color:var(--t3);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Gün Görünümü</div>';
  dgHtml += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:4px">';
  DTR.forEach(dn => { dgHtml += `<div style="text-align:center;font-size:9px;font-weight:700;color:var(--t3);padding:2px">${dn}</div>`; });
  dgHtml += '</div><div class="earn-day-grid">';
  for (let i = 0; i < fdow; i++) dgHtml += '<div class="edg-cell"></div>';
  for (let d2 = 1; d2 <= dim; d2++) {
    const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d2).padStart(2,'0')}`;
    const parts = getShiftPartsForDate(u, ds);
    const dayHours = parts.reduce((sum, part) => sum + Math.max(0, safeNum(part.hours, 0)), 0);
    const lv = u.leaves[ds];
    const hol2 = isH(ds);
    const today = new Date();
    const isToday = (y === today.getFullYear() && m === today.getMonth() && d2 === today.getDate());
    let cls = 'edg-cell', title = String(d2);
    if (dayHours > 0) {
      cls += dayHours > 7.5 ? ' edg-ot' : ' edg-worked';
    } else if (lv && lv.type) { cls += ' edg-leave'; }
    else if (hol2) { cls += ' edg-hol'; }
    else { const dt = new Date(y, m, d2); const dow = dt.getDay(); if (dow===0||dow===6) cls += ' edg-hol'; else cls += ' edg-absent'; }
    dgHtml += `<div class="${cls}" ${isToday ? 'style="outline:2px solid var(--p);outline-offset:1px"' : ''}>${title}</div>`;
  }
  dgHtml += '</div>';
  dgHtml += '<div style="display:flex;gap:10px;margin-top:6px;flex-wrap:wrap">';
  [{c:'edg-worked',l:'Çalışma'},{c:'edg-ot',l:'FM'},{c:'edg-leave',l:'İzin'},{c:'edg-hol',l:'Tatil'},{c:'edg-absent',l:'Eksik'}].forEach(({c,l}) => {
    dgHtml += `<span style="display:flex;align-items:center;gap:4px;font-size:10px;font-weight:600;color:var(--t2)"><span class="edg-cell ${c}" style="width:14px;height:14px;border-radius:3px;font-size:0;display:inline-block"></span>${l}</span>`;
  });
  dgHtml += '</div></div>';

  const _earnCfg = payrollCfg(y);
  const _minNetWage = computeNetFromGross(_earnCfg.minWageGross, 'single', 0, 0, m, undefined, y).net;
  const _belowMinWage = !e.isFutureMonth && e.totalEarning > 0 && e.totalEarning < _minNetWage;
  ec.innerHTML = `
  ${_belowMinWage ? `<div class="hint" style="background:rgba(251,191,36,.12);border-color:rgba(251,191,36,.35);margin-bottom:8px"><i class="fas fa-exclamation-triangle" style="color:#fbbf24"></i><span style="color:#fbbf24">Hesaplanan kazanç (${fm(e.totalEarning)}) ${y} asgari ücret netinin (${fm(_minNetWage)}) altında. Eksik gün veya kısmi çalışma kontrolü yapın.</span></div>` : ''}
  <div class="earn-hero">
    <div class="sub">KAZANÇ — ${MTR[m].toUpperCase()} ${y}${e.isCurrentMonth ? ' — DEVAM EDİYOR' : ''}</div>
    <div class="amt">${fm(e.totalEarning)}</div>
    <div class="info">${e.isFullMonth ? 'Tam ay' : e.isCurrentMonth ? (e.workedDays || 0) + 'g girildi' : e.absentDays > 0 ? e.absentDays + 'g eksik' : 'Tam'} • ${e.totalHours.toFixed(1)}s</div>
    <div style="margin-top:6px;font-size:10.5px;opacity:.75;line-height:1.4"><i class="fas fa-info-circle"></i> Tahmini net kazanç (panel ile aynı hesaplama). SGK/vergi dilimli kesin net için <b>e-Bordro</b> oluşturun.</div>
    ${prevE && !prevE.isFutureMonth && prevE.totalEarning > 0 ? `<div style="margin-top:8px"><span style="font-size:11px;opacity:.7">${diff>=0?'↑':'↓'} Önceki aya göre ${fm(Math.abs(diff))}</span></div>` : ''}
    <div style="margin-top:14px">
      <button onclick="openEBordroModal(${y},${m})" style="background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.45);color:#fff;padding:7px 16px;border-radius:10px;cursor:pointer;font-size:12.5px;font-weight:600;backdrop-filter:blur(4px);transition:.2s" onmouseover="this.style.background='rgba(255,255,255,.25)'" onmouseout="this.style.background='rgba(255,255,255,.15)'">
        <i class="fas fa-file-invoice"></i> e-Bordro Oluştur
      </button>
    </div>
  </div>
  <div class="esb">
    <div class="esb-title"><i class="fas fa-calculator"></i>Detaylı Hesaplama</div>
    <div class="esb-grid">
      <div class="esb-item"><div class="esb-val" style="color:var(--p)">${e.workedDays}g</div><div class="esb-lbl">Çalışma</div></div>
      <div class="esb-item"><div class="esb-val" style="color:var(--p)">${formatDayCount(paidBreakdown.leaveTotal)}g</div><div class="esb-lbl">Ücretli İzin</div></div>
      <div class="esb-item"><div class="esb-val" style="color:${e.absentDays>0?'var(--r)':'var(--g)'}"><small>${e.absentDays>0?'−'+e.absentDays+'g':'✓ Tam'}</small></div><div class="esb-lbl">Eksik</div></div>
      <div class="esb-item"><div class="esb-val">${fm(e.dailyRate)}</div><div class="esb-lbl">Günlük</div></div>
    </div>
    <div class="esb-detail">
      <div class="esd-head">💰 NET KAZANÇ</div>
      <div class="esd"><span class="ek">Net Maaş</span><span class="ev">${fm(u.netSalary)}</span></div>
      <div class="esd"><span class="ek">Saatlik Ücret</span><span class="ev">${fm(e.hourlyRate)}/s</span></div>
      <div class="esd" style="font-weight:600"><span class="ek">${e.absentDays > 0 ? `Tam Ay Tabanı (${e.dim}g × ${fm(e.dailyRate)})` : `Baz Ücret (${e.dim}g ay · tam)`}</span><span class="ev">${fm(e.absentDays > 0 ? e.dim * e.dailyRate : e.basePay)}</span></div>
      ${e.absentDays > 0 ? `
      <div class="esd-head" style="color:var(--r)">⛔ KESİNTİLER</div>
      ${e.unpaidDays > 0 ? `<div class="esd"><span class="ek">Ücretsiz İzin (${e.unpaidDays}g × ${fm(e.dailyRate)})</span><span class="ev neg">−${fm(e.unpaidDays*e.dailyRate)}</span></div>` : ''}
      ${e.missingDays > 0 ? `<div class="esd"><span class="ek">Eksik Gün (${e.missingDays}g × ${fm(e.dailyRate)})</span><span class="ev neg">−${fm(e.missingDays*e.dailyRate)}</span></div>` : ''}
      ` : ''}
      ${e.overtimePay > 0 ? `
      <div class="esd-head" style="color:#f97316">🔥 FAZLA MESAİ (${getOTRate(u)}×)</div>
      <div class="esd"><span class="ek">${e.overtimeHours.toFixed(1)}s × ${fm(e.hourlyRate)} × ${getOTRate(u)}</span><span class="ev pos">+${fm(e.overtimePay)}</span></div>
      ` : ''}
      ${(e.overtimePay125 || 0) > 0 ? `
      <div class="esd-head" style="color:var(--leave-sick)">⚡ FAZLA SÜRELERLE ÇALIŞMA (${e.partialRate || 1.25}×)</div>
      <div class="esd"><span class="ek">${(e.overtimeHours125||0).toFixed(1)}s × ${fm(e.hourlyRate)} × ${e.partialRate || 1.25}</span><span class="ev pos">+${fm(e.overtimePay125)}</span></div>
      ` : ''}
      ${e.holidayPay > 0 ? `
      <div class="esd-head" style="color:var(--g)">🏛️ TATİL PRİMLERİ</div>
      <div class="esd"><span class="ek">${(e.holidayPayDays || e.holidayDays).toFixed(1)}g tatil × ${fm(e.dailyRate)} ilave (Md.47)</span><span class="ev pos">+${fm(e.holidayPay)}</span></div>
      ${(e.hhOT||0) > 0 ? `<div class="esd" style="color:var(--acc);font-size:11px"><span class="ek" style="padding-left:8px">↳ ${e.hhOT.toFixed(1)}s tatil çalışması haftalık 45'i aşıyor; FM zammı ve Md.47 günlük ek ayrı satırlarda uygulanır.</span><span class="ev"></span></div>` : ''}
      ` : ''}
      <div class="esd total"><span class="ek"><i class="fas fa-wallet"></i><b>NET KAZANÇ</b></span><span class="ev">${fm(e.totalEarning)}</span></div>
    </div>
  </div>
  ${renderDailyEarningsTracker(u, y, m, e)}
  ${dgHtml}
  ${renderEarnWeekly(u, y, m, d, e)}
  ${renderEarnShiftTypes(u, y, m, e)}
  ${renderTaxBracketCard(u, y, m)}
  ${renderEarnYearlyCumul(u, y, e)}
  ${renderEmployeeRightsPanel(u, y, m, d, e)}`;

  renderEarnCompare(u, y, m);
}

function employeeMonthKey(y, m) {
  return `${y}-${String(m + 1).padStart(2, '0')}`;
}
function getPayrollCheck(u, y, m) {
  if (!u.payrollChecks || typeof u.payrollChecks !== 'object') u.payrollChecks = {};
  const key = employeeMonthKey(y, m);
  if (!u.payrollChecks[key]) u.payrollChecks[key] = {};
  return u.payrollChecks[key];
}
function savePayrollCheckField(field, raw) {
  const u = cu(); if (!u) return;
  const allowed = new Set(['actualPaid','priorYTD','slipGross','slipNet','slipSgk','slipIncomeTax','slipStampTax']);
  if (!allowed.has(field)) return;
  const rec = getPayrollCheck(u, S.ey, S.em);
  const val = safeNum(raw, NaN);
  if (raw === '' || raw === null || raw === undefined || !Number.isFinite(val)) delete rec[field];
  else rec[field] = Math.max(0, val);
  if (field === 'priorYTD') {
    const isEmpty = raw === '' || raw === null || raw === undefined || !Number.isFinite(val);
    rec.priorYTDAuto = false;
    rec.priorYTDState = isEmpty ? 'empty' : 'manual';
    if (isEmpty) delete rec.priorYTDSource;
    else rec.priorYTDSource = { type:'manual', updatedAt:new Date().toISOString() };
  }
  rec.updatedAt = Date.now();
  saveLS();
  renderEarn();
}
function estimatePayrollForMonth(u, y, m, d) {
  if (!u || !u.netSalary || u.netSalary <= 0) return null;
  const now = new Date();
  d = d || getMD(y, m, (y === now.getFullYear() && m === now.getMonth()) ? { throughDay:now.getDate() } : undefined);
  /* [N-03] Medeni durum/çocuk sayısı 7349 sy. Kanun sonrası GV hesabını etkilemez (AGİ kaldırıldı).
     Bekâr/çocuksuz varsayımı hesap sonucunu değiştirmiyor. */
  const marital = 'single', children = 0;
  /* [FIX P2] Ocak ayında kümülatif vergi matrahı sıfırlanır */
  const priorYTD = (m === 0) ? 0 : safeNum(getPayrollCheck(u, y, m).priorYTD, 0);
  const earning = calcEarningForMonth(y, m, u.netSalary);
  if (!earning || earning.isFutureMonth) return null;
  const baseNet = Math.max(0, safeNum(earning.basePay, 0));
  if (baseNet <= 0 && d.th <= 0 && d.mau <= 0 && d.msd <= 0 && d.wr <= 0) return null;
  const cfg = payrollCfg(y);
  const payrollHourBasis = getPayrollHourBasis(u, y);
  const fullGross = _bordroRound2(findGrossFromNet(u.netSalary, marital, children, priorYTD, m, undefined, y));
  /* baseGross'u 30 günlük yasal taban üzerinden pro-rate et.
     Türk bordrosu aylık ücreti 30 gün kabul eder; eksik günler 30'dan düşülür.
     paidDays = dim − absentDays olduğundan 31 günlük aylarda paidDays/30 > 1 olup
     brütü şişiriyordu. Doğru oran: (30 − eksikGün)/30. */
  const absentDays = Math.max(0, safeNum(earning.absentDays, 0));
  const proRate = Math.max(0, Math.min(1, (30 - absentDays) / 30));
  const baseGross = _bordroRound2(fullGross * proRate);
  const hrGross = fullGross > 0 ? _bordroRound2(fullGross / getMonthlyHours(u)) : 0;
  const drGross = _bordroRound2(fullGross / 30);
  const compMode = u.otCompMode || 'pay';
  const compRate = getOTRate(u);
  const partialRate = cfg.otPartialMultiplier;
  const otGross = compMode === 'pay' ? _bordroRound2((d.oh || 0) * hrGross * compRate) : 0;
  const ot125Gross = compMode === 'pay' ? _bordroRound2((d.oh125 || 0) * hrGross * partialRate) : 0;
  const holPayDays = d.hpd !== undefined ? d.hpd : d.hdw;
  const holGross = _bordroRound2(holPayDays * drGross);
  const unpaidGross = _bordroRound2(Math.max(0, d.ud || 0) * drGross);
  const weekendGross = _bordroRound2((d.weekendHours || 0) * hrGross * Math.max(0, (cfg.weekendMultiplier || 1) - 1));
  const totalGross = _bordroRound2(Math.max(0, baseGross - unpaidGross) + otGross + ot125Gross + holGross + weekendGross);
  const res = computeNetFromGross(totalGross, marital, children, priorYTD, m, undefined, y);
  return { ...res, baseNet, fullGross, baseGross, otGross, ot125Gross, holGross, weekendGross, unpaidGross, totalGross, holPayDays, payrollHourBasis, cfgYear: cfg.year, _assumption: '2023 sonrası AGİ yok — medeni durum/çocuk sayısı hesabı etkilemiyor.' };
}
function diffBadge(diff) {
  const abs = Math.abs(diff || 0);
  const cls = abs < 1 ? 'var(--g)' : diff < 0 ? 'var(--r)' : 'var(--acc)';
  const sign = diff > 0 ? '+' : diff < 0 ? '-' : '';
  return `<strong style="color:${cls}">${sign}${fm(abs)}</strong>`;
}
function buildWorkLawWarnings(u, y, m, d) {
  const warnings = [];
  const weeklyContractHours = getWeeklyContractHours(u);
  Object.entries(d.weekTotalHrs || {}).forEach(([wk, hrs]) => {
    const h = safeNum(hrs, 0);
    if (h > 45) warnings.push({ level:'warning', text:`${wk} haftasında ${h.toFixed(1)} saat çalışma var; 45 saati aşan bölüm %50 fazla mesai sayılmalı.` });
    else if (h > weeklyContractHours) warnings.push({ level:'warning', text:`${wk} haftasında ${h.toFixed(1)} saat çalışma var; ${weeklyContractHours}s sözleşme üstü bölüm %25 fazla çalışma sayılmalı.` });
  });
  const shifts = [];
  const dim = new Date(y, m + 1, 0).getDate();
  for (let day = 1; day <= dim; day++) {
    const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const sh = u.shifts[ds];
    if (!sh || !sh.start || !sh.end) continue;
    const hrs = calcHr(sh.start, sh.end, sh.break || 0);
    if (hrs > 11) warnings.push({ level:'danger', text:`${ds} vardiyası ${hrs.toFixed(1)} saat; günlük 11 saat sınırı açısından kontrol edilmeli.` });
    const st = parseTime(sh.start), en = parseTime(sh.end);
    if (st !== null && en !== null) {
      const start = new Date(y, m, day, Math.floor(st / 60), st % 60);
      const endDay = en <= st ? day + 1 : day;
      const end = new Date(y, m, endDay, Math.floor(en / 60), en % 60);
      shifts.push({ ds, start, end });
    }
  }
  shifts.sort((a,b) => a.start - b.start);
  for (let i = 1; i < shifts.length; i++) {
    const rest = (shifts[i].start - shifts[i-1].end) / 36e5;
    if (rest >= 0 && rest < 11) warnings.push({ level:'danger', text:`${shifts[i-1].ds} sonrası ${shifts[i].ds} vardiyasına kadar ${rest.toFixed(1)} saat dinlenme var.` });
  }
  /* [FIX P11] 4857/69 — gece çalışması 7,5 saati aşamaz. Vardiyaların gece pencere overlap'ini
     hesapla; 20:00–06:00 toplam çalışma 7,5s'i aşıyorsa danger uyarı. */
  shifts.forEach(s => {
    const startMin = s.start.getHours() * 60 + s.start.getMinutes();
    const sameDay = (s.end.getDate() === s.start.getDate()
                  && s.end.getMonth() === s.start.getMonth()
                  && s.end.getFullYear() === s.start.getFullYear());
    const endMin = sameDay
      ? (s.end.getHours() * 60 + s.end.getMinutes())
      : (s.end.getHours() * 60 + s.end.getMinutes() + 1440);
    const overlap = (a, b, c, d2) => Math.max(0, Math.min(b, d2) - Math.max(a, c));
    // Gece pencereleri: 00:00–06:00 (360), 20:00–24:00 (1200–1440), 24:00–30:00 (1440–1800 = ertesi gün 06:00)
    const nightMin = overlap(startMin, endMin, 0, 360)
                   + overlap(startMin, endMin, 1200, 1440)
                   + overlap(startMin, endMin, 1440, 1800);
    if (nightMin / 60 > 7.5) {
      warnings.push({
        level:'danger',
        text:`${s.ds} vardiyasında gece çalışması ${(nightMin/60).toFixed(1)}s; 4857/69 yedibuçuk saat sınırını aştı.`
      });
    }
  });
  if (!warnings.length) warnings.push({ level:'ok', text:`Bu ay haftalık ${weeklyContractHours}s sözleşme / 45s yasal FM, günlük 11 saat, vardiyalar arası 11 saat dinlenme ve gece 7,5 saat sınırı açısından belirgin uyarı yok.` });
  return warnings;
}
function buildHolidayWorkRows(u, y, m) {
  const rows = [];
  const byDay = {};
  Object.entries((u && u.shifts) || {}).forEach(([startDs, sh]) => {
    if (!sh || !sh.start || !sh.end) return;
    getShiftDayParts(startDs, sh).forEach(part => {
      const p = parseDS(part.ds);
      const h = p && p.y === y && p.m === m ? getHoliday(part.ds) : null;
      if (!h || !part.hours) return;
      if (!byDay[part.ds]) byDay[part.ds] = { ds:part.ds, name:h.n, hours:0, payDays:0 };
      byDay[part.ds].hours += part.hours;
      byDay[part.ds].payDays += holidayPayWeightForPart(part);
    });
  });
  Object.values(byDay).sort((a, b) => a.ds.localeCompare(b.ds)).forEach(row => rows.push(row));
  return rows;
}
function yearlyOvertimeHours(y) {
  const key = `${S.cu}-${y}`;
  if (yearlyOTCache[key] !== undefined) return yearlyOTCache[key];
  let total = 0;
  for (let i = 0; i < 12; i++) {
    const md = getMD(y, i);
    total += (md.oh || 0) + (md.oh125 || 0);
  }
  yearlyOTCache[key] = total;
  return total;
}
function renderEmployeeRightsPanel(u, y, m, d, e) {
  const rec = getPayrollCheck(u, y, m);
  const payroll = estimatePayrollForMonth(u, y, m, d);
  const actualPaid = safeNum(rec.actualPaid, 0);
  const paidDiff = actualPaid > 0 && e ? actualPaid - e.totalEarning : null;
  const annualOT = yearlyOvertimeHours(y);
  const otLeft = 270 - annualOT;
  const warnings = buildWorkLawWarnings(u, y, m, d);
  const holidays = buildHolidayWorkRows(u, y, m);
  const cmp = [];
  if (payroll) {
    [
      ['Brüt', 'slipGross', payroll.gross],
      ['Net', 'slipNet', payroll.net],
      ['SGK İşçi', 'slipSgk', payroll.sgkDeduction],
      ['Gelir Vergisi', 'slipIncomeTax', payroll.netGV],
      ['Damga Vergisi', 'slipStampTax', payroll.stampTax],
    ].forEach(([label, key, expected]) => {
      const entered = safeNum(rec[key], 0);
      if (entered > 0) cmp.push({ label, entered, expected, diff: entered - expected });
    });
  }
  const input = (field, placeholder) => `<input type="number" min="0" step="0.01" value="${rec[field] ?? ''}" placeholder="${placeholder}" onchange="savePayrollCheckField('${field}',this.value)" style="width:100%;padding:8px 10px;border:1px solid var(--b);border-radius:8px;background:var(--bg);color:#fff">`;
  const warnHtml = warnings.map(w => `<div class="ai-suggestion ${w.level==='danger'?'warning':''}" style="margin-bottom:6px"><i class="fas ${w.level==='ok'?'fa-check-circle':'fa-triangle-exclamation'}"></i>${escHtml(w.text)}</div>`).join('');
  const holidayHtml = holidays.length ? holidays.map(h => `<div class="esd"><span class="ek">${h.ds} · ${escHtml(h.name)} · ${h.hours.toFixed(1)}s</span><span class="ev pos">${h.payDays.toFixed(1)}g</span></div>`).join('') : '<div class="ai-empty">Bu ay kayıtlı resmi tatil çalışması yok.</div>';
  return `<div class="card" style="margin-top:16px">
    <div class="card-head">
      <h3><i class="fas fa-scale-balanced"></i>Çalışan Hak Kontrolü</h3>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-outline btn-sm" onclick="exportEmployeeMonthPDF()"><i class="fas fa-file-pdf"></i>PDF</button>
        <button class="btn btn-outline btn-sm" onclick="exportEmployeeMonthExcel()"><i class="fas fa-file-excel"></i>Excel</button>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px">
      <div class="esb" style="margin:0">
        <div class="esb-title"><i class="fas fa-money-check-alt"></i>Maaş Farkı Kontrolü</div>
        <label class="fl">Gerçek yatan net tutar</label>
        ${input('actualPaid','Örn: 42000')}
        <div style="margin-top:8px;font-size:12px;color:var(--t2)">Beklenen: <strong>${e ? fm(e.totalEarning) : '—'}</strong>${paidDiff !== null ? ` · Fark: ${diffBadge(paidDiff)}` : ''}</div>
      </div>
      <div class="esb" style="margin:0">
        <div class="esb-title"><i class="fas fa-receipt"></i>Bordro Doğrulama</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${input('priorYTD','Önceki GV matrahı')}
          ${input('slipGross','Brüt')}
          ${input('slipNet','Net')}
          ${input('slipSgk','SGK')}
          ${input('slipIncomeTax','GV')}
          ${input('slipStampTax','DV')}
        </div>
        <div style="margin-top:8px">${cmp.length ? cmp.map(c => `<div class="esd"><span class="ek">${c.label}: bordro ${fm(c.entered)} / beklenen ${fm(c.expected)}</span><span class="ev">${diffBadge(c.diff)}</span></div>`).join('') : '<div class="ai-empty">Bordro kalemlerini girince farklar burada görünür.</div>'}</div>
        ${payroll && payroll._assumption ? `<div style="font-size:10px;color:var(--t3);margin-top:6px"><i class="fas fa-info-circle"></i> ${escHtml(payroll._assumption)}</div>` : ''}
      </div>
      <div class="esb" style="margin:0">
        <div class="esb-title"><i class="fas fa-hourglass-half"></i>270 Saat FM Takibi</div>
        <div class="esb-grid" style="grid-template-columns:repeat(2,1fr)">
          <div class="esb-item"><div class="esb-val" style="color:${annualOT>270?'var(--r)':annualOT>240?'var(--acc)':'var(--p)'}">${annualOT.toFixed(1)}s</div><div class="esb-lbl">${y} toplam FM</div></div>
          <div class="esb-item"><div class="esb-val">${otLeft >= 0 ? otLeft.toFixed(1)+'s' : '+'+Math.abs(otLeft).toFixed(1)+'s'}</div><div class="esb-lbl">${otLeft >= 0 ? 'Kalan' : 'Aşım'}</div></div>
        </div>
      </div>
      <div class="esb" style="margin:0">
        <div class="esb-title"><i class="fas fa-triangle-exclamation"></i>FM / Dinlenme Uyarıları</div>
        ${warnHtml}
      </div>
      <div class="esb" style="margin:0;grid-column:1/-1">
        <div class="esb-title"><i class="fas fa-flag"></i>Resmi Tatil Hakediş Raporu</div>
        ${holidayHtml}
      </div>
    </div>
  </div>`;
}
function employeeMonthRows(u, y, m) {
  const now = new Date();
  const d = getMD(y, m, (y === now.getFullYear() && m === now.getMonth()) ? { throughDay:now.getDate() } : undefined);
  const e = u.netSalary ? calcEarningForMonth(y, m, u.netSalary) : null;
  const holidays = buildHolidayWorkRows(u, y, m);
  const warnings = buildWorkLawWarnings(u, y, m, d);
  const payroll = estimatePayrollForMonth(u, y, m, d);
  const rec = getPayrollCheck(u, y, m);
  const rows = [
    ['Dönem', `${MTR[m]} ${y}`],
    ['Çalışan', u.name || ''],
    ['Toplam saat', `${d.th.toFixed(1)} saat`],
    ['Fazla çalışma / fazla mesai', `${(d.oh125 || 0).toFixed(1)} / ${(d.oh || 0).toFixed(1)} saat`],
    ['Resmi tatil çalışması', `${((d.hpd !== undefined ? d.hpd : d.hdw) || 0).toFixed(1)} gün`],
    ['Beklenen net kazanç', e ? fm(e.totalEarning) : 'Maaş girilmemiş'],
  ];
  if (safeNum(rec.actualPaid, 0) > 0 && e) rows.push(['Gerçek yatan / fark', `${fm(rec.actualPaid)} / ${(rec.actualPaid - e.totalEarning).toFixed(2)} TL`]);
  if (payroll) {
    rows.push(['Tahmini brüt bordro', fm(payroll.gross)]);
    rows.push(['Önceki kümülatif GV matrahı', fm(safeNum(rec.priorYTD, 0))]);
    rows.push(['Net gelir vergisi', fm(payroll.netGV)]);
    rows.push(['Net damga vergisi', fm(payroll.stampTax)]);
  }
  rows.push(['Yıllık FM toplamı', `${yearlyOvertimeHours(y).toFixed(1)} saat`]);
  holidays.forEach(h => rows.push([`Tatil: ${h.ds}`, `${h.name} · ${h.hours.toFixed(1)}s · ${h.payDays.toFixed(1)}g hakediş`]));
  warnings.forEach(w => rows.push(['Uyarı', w.text]));
  return rows;
}
function exportEmployeeMonthExcel() {
  const u = cu(); if (!u) return;
  const rows = employeeMonthRows(u, S.ey, S.em);
  const htmlRows = rows.map(r => `<tr><td>${escHtml(r[0])}</td><td>${escHtml(r[1])}</td></tr>`).join('');
  const html = `<html><head><meta charset="utf-8"></head><body><table border="1"><tr><th>Kalem</th><th>Değer</th></tr>${htmlRows}</table></body></html>`;
  const blob = new Blob([html], { type:'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `calisan_hak_raporu_${employeeMonthKey(S.ey,S.em)}.xls`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  toast('Excel raporu indirildi', 'success');
}
function exportEmployeeMonthPDF() {
  const u = cu(); if (!u) return;
  const jspdfLib = window.jspdf || {};
  const JsPDF = jspdfLib.jsPDF;
  if (!JsPDF) { toast('PDF kütüphanesi yüklenemedi', 'error'); return; }
  try {
    const doc = new JsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const rows = employeeMonthRows(u, S.ey, S.em).map(r => [pdfStr(String(r[0])), pdfStr(String(r[1]))]);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(16);
    doc.text('Calisan Hak ve Bordro Kontrol Raporu', 14, 16);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    doc.text(pdfStr(`${u.name || ''} | ${MTR[S.em]} ${S.ey}`), 14, 24);
    if (doc.autoTable) {
      doc.autoTable({ startY: 32, head:[['Kalem','Deger']], body:rows, styles:{ font:'helvetica', fontSize:9, cellPadding:3 }, headStyles:{ fillColor:[99,102,241] } });
    } else {
      let y = 34;
      rows.forEach(r => { if (y > 280) { doc.addPage(); y = 16; } doc.text(`${r[0]}: ${r[1]}`, 14, y); y += 6; });
    }
    doc.setFontSize(7); doc.setTextColor(150,150,150);
    doc.text(pdfStr(`Tahmini kontrol raporu; resmi bordro yerine gecmez. ShiftTrack Pro | ${new Date().toLocaleString('tr-TR')}`), 14, 290);
    doc.save(`calisan_hak_raporu_${employeeMonthKey(S.ey,S.em)}.pdf`);
    toast('PDF raporu indirildi', 'success');
  } catch(e) {
    console.error(e);
    toast('PDF oluşturulamadı: ' + e.message, 'error');
  }
}

/* Kazanç — Haftalık Kırılım */
function renderEarnWeekly(u, y, m, d, e) {
  /* [FIX Y-01] Tam yyyy-Wnn stringiyle sırala */
  const wks = Object.entries(d.wh).sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
  if (!wks.length) return '';
  const maxH = Math.max(1, ...wks.map(([, h]) => h));

  /* [FIX BUG-01] Ağırlıklı saat hesabı: FM saatleri 1.5x sayılır.
     Toplam, e.totalEarning'e pro-rata dağıtılır — aylık toplamla tutarlıdır. */
  const weekData = wks.map(([wk, h], i) => {
    const totalW = d.weekTotalHrs[wk] || h;
    const isOT = totalW > getWeeklyContractHours(u);
    let weighted = h;
    if (isOT && totalW > 0) {
      const monthOT = d.weekMonthOTHrs ? (d.weekMonthOTHrs[wk] || 0) : 0;
      const monthOT125 = d.weekMonthOT125Hrs ? (d.weekMonthOT125Hrs[wk] || 0) : 0;
      const _compRate = getOTRate(u);
      const _partialRate = payrollCfg(y).otPartialMultiplier || 1.25;
      weighted = Math.max(0, h - monthOT - monthOT125) + monthOT125 * _partialRate + monthOT * _compRate;
    }
    return { wk, h, totalW, isOT, weighted, idx: i };
  });
  const totalWeighted = weekData.reduce((a, w) => a + w.weighted, 0);

  /* [FIX] Dağıtım tabanı e.totalEarning (hafta sonu/tatil dahil) — hero ile tutarlı. */
  const _wkTotal = safeNum(e.totalEarning, 0);
  let rows = '', totalWkEarn = 0;
  weekData.forEach(({ h, totalW, isOT, weighted, idx }) => {
    const pct = maxH > 0 ? (h / maxH * 100).toFixed(1) : 0;
    const wkEarn = totalWeighted > 0 ? (weighted / totalWeighted) * _wkTotal : 0;
    totalWkEarn += wkEarn;
    rows += `<div class="earn-wk-row">
      <span class="ewk-label">${idx+1}. Hafta</span>
      <div class="ewk-bar"><div class="ewk-fill" style="width:${pct}%;background:${isOT ? 'var(--acc-grad, linear-gradient(90deg,var(--acc),#f97316))' : 'var(--pg)'}"></div></div>
      <span class="ewk-val">${h.toFixed(1)}s</span>
      <span class="ewk-val" style="color:var(--g)">${fm(wkEarn)}</span>
    </div>`;
  });
  const diffNote = Math.abs(totalWkEarn - _wkTotal) > 1 ? `<div style="font-size:10px;color:var(--t3);margin-top:6px;font-style:italic"><i class="fas fa-info-circle" style="margin-right:3px"></i>Haftalık kırılım, girilmiş günlere dağıtılmıştır.</div>` : '';
  return `<div class="earn-section">
    <h3><i class="fas fa-calendar-week"></i>Haftalık Kazanç Dağılımı</h3>
    ${rows}${diffNote}
  </div>`;
}

/* Kazanç — Vardiya Tipi Bazında Kazanç */
function renderEarnShiftTypes(u, y, m, e) {
  const types = {};
  getShiftPartsForMonth(u, y, m).forEach(part => {
    const sh = part.sh;
    if (!sh || !sh.start || !sh.end) return;
    const st = getShiftType(sh);
    if (!types[st.name]) types[st.name] = { icon: st.icon, days: new Set(), hours: 0, earn: 0 };
    types[st.name].days.add(part.sourceDs || part.ds);
    types[st.name].hours += Math.max(0, safeNum(part.hours, 0));
  });
  /* [FIX BUG-05] Kazanç dağıtımı: FM/tatil primlerini de dikkate alan ağırlıklı hesap.
     Toplam, e.totalEarning'e normalize edilir — aylık toplamla tutarlıdır. */
  const totalH = Object.values(types).reduce((a, v) => a + v.hours, 0);
  if (totalH > 0 && e && e.hourlyRate > 0) {
    const _stTotal = safeNum(e.totalEarning, 0);
    const rawTotal = Object.values(types).reduce((a, v) => a + v.hours * e.hourlyRate, 0);
    if (rawTotal > 0) {
      Object.values(types).forEach(v => {
        v.earn = (v.hours * e.hourlyRate / rawTotal) * _stTotal;
      });
    }
  }
  const sorted = Object.entries(types).sort((a, b) => b[1].earn - a[1].earn);
  if (!sorted.length) return '';
  let cards = '<div class="earn-type-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(180px,100%),1fr));gap:8px">';
  sorted.forEach(([name, v]) => {
    const days = v.days && typeof v.days.size === 'number' ? v.days.size : safeInt(v.days, 0);
    const dayAvg = days > 0 ? (v.hours / days).toFixed(1) : '0';
    cards += `<div class="earn-type-card">
      <div class="etc-icon">${v.icon}</div>
      <div class="etc-info">
        <div class="etc-name">${escHtml(name)}</div>
        <div class="etc-detail">${days}g · ${v.hours.toFixed(1)}s · ort ${dayAvg}s/g</div>
      </div>
      <div class="etc-val">${fm(v.earn)}</div>
    </div>`;
  });
  cards += '</div>';
  return `<div class="earn-section">
    <h3><i class="fas fa-chart-pie"></i>Vardiya Tipi Bazında Kazanç <small style="font-weight:400;opacity:.55;font-size:10px">(~yaklaşık)</small></h3>
    ${cards}
  </div>`;
}

/* [FEAT F2] Kümülatif gelir vergisi dilimi takibi
   Model: brüt sabit (maaşlı çalışan varsayımı) — net vergi dilimleri nedeniyle ay ay düşer.
   YTD matrah = sabit brüt × (sgk/unemp kesintileri sonrası) × kümülatif ay sayısı. */
/* Bir ay için GV matrahını döndürür: girilen veri varsa gerçek bordro,
   yoksa tam maaş varsayımıyla sabit brüt matrahı. */
function _monthGVMatrah(u, y, m, cfg, priorYTDForGross) {
  const payroll = estimatePayrollForMonth(u, y, m);
  if (payroll) return Math.max(0, safeNum(payroll.gvMatrah, 0));
  /* Fallback: sabit-net çalışanın brütü yıl içinde dilimler yükseldikçe artar.
     Brütü o ana dek birikmiş matrah (priorYTDForGross) ile bul; 0 verilirse
     her ay Ocak gibi hesaplanıp yüksek dilim çalışanlarında matrah düşük çıkardı. */
  const priorYTD = Math.max(0, safeNum(priorYTDForGross, 0));
  const fixedGross = findGrossFromNet(u.netSalary, 'single', 0, priorYTD, m, undefined, y);
  const sgkBase = Math.min(fixedGross, cfg.sgkCeiling);
  return Math.max(0, fixedGross - sgkBase * (cfg.sgkEmployee + cfg.unemploymentEmployee));
}

/* Kümülatif (YTD) GV matrahı: manuel girilen priorYTD varsa onu temel alır,
   yoksa Ocak'tan o aya kadar her ayın gerçek/tahmini matrahını TOPLAR.
   Eski "cari ay × ay sayısı" yaklaşımı değişken kazançta hatalıydı. */
function estimateCumulativeMatrah(u, y, m) {
  const cfg = payrollCfg(y);
  const setPrior = (m === 0) ? 0 : safeNum(getPayrollCheck(u, y, m).priorYTD, -1);
  let priorMatrah;
  if (setPrior >= 0) {
    priorMatrah = setPrior;
  } else {
    // Önceki ayları sırayla topla; her ayın brütünü o ana dek birikmiş
    // matrahla hesapla ki dilim yükselmeleri doğru yansısın.
    priorMatrah = 0;
    for (let pm = 0; pm < m; pm++) priorMatrah += _monthGVMatrah(u, y, pm, cfg, priorMatrah);
  }
  const monthMatrah = _monthGVMatrah(u, y, m, cfg, priorMatrah);
  return { ytdMatrah: priorMatrah + monthMatrah, monthMatrah };
}

function renderTaxBracketCard(u, y, m) {
  if (!u.netSalary || u.netSalary <= 0) return '';
  try {
    const cfg = payrollCfg(y);
    const brackets = cfg.incomeTaxBrackets;
    /* Gerçek YTD: manuel priorYTD varsa onu, yoksa Ocak'tan bu aya kümülatif
       matrah toplamını kullan. Ocak'ta YTD = bu ayın matrahı. */
    const { ytdMatrah, monthMatrah } = estimateCumulativeMatrah(u, y, m);
    let curIdx = 0, prevUp = 0;
    for (let i = 0; i < brackets.length; i++) {
      if (ytdMatrah <= brackets[i].upTo) { curIdx = i; break; }
      prevUp = brackets[i].upTo;
      curIdx = i + 1;
    }
    const cur = brackets[Math.min(curIdx, brackets.length - 1)];
    const next = brackets[Math.min(curIdx + 1, brackets.length - 1)];
    const intoBracket = Math.max(0, ytdMatrah - prevUp);
    const bracketSize = (cur.upTo === Infinity) ? intoBracket : (cur.upTo - prevUp);
    const pct = cur.upTo === Infinity ? 100 : Math.min(100, (intoBracket / bracketSize) * 100);
    const toNext = cur.upTo === Infinity ? 0 : Math.max(0, cur.upTo - ytdMatrah);
    const monthsToNext = (cur.upTo !== Infinity && monthMatrah > 0) ? Math.ceil(toNext / monthMatrah) : 0;

    const bracketBars = brackets.map((b, i) => {
      const label = (b.upTo === Infinity) ? '∞' : fm(b.upTo);
      const state = i < curIdx ? 'done' : i === curIdx ? 'active' : 'pending';
      return `<div class="tbc-step ${state}" title="${(b.rate*100).toFixed(0)}% · ${label}">
        <div class="tbc-step-bar"><div class="tbc-step-fill" style="width:${i < curIdx ? 100 : i === curIdx ? pct : 0}%"></div></div>
        <div class="tbc-step-lbl"><span>%${(b.rate*100).toFixed(0)}</span><span>${label}</span></div>
      </div>`;
    }).join('');

    const nextInfo = (cur.upTo === Infinity)
      ? `<div class="tbc-note">En üst dilimdesin — ek kazançlar %${(cur.rate*100).toFixed(0)} oranında vergilenir.</div>`
      : `<div class="tbc-note"><b>${fm(toNext)}</b> kümülatif matrah sonra <b>%${(next.rate*100).toFixed(0)}</b> dilimine geçeceksin${monthsToNext > 0 ? ` (~${monthsToNext} ay)` : ''}.</div>`;

    const staleYearNote = (cfg.year !== y)
      ? `<div class="tbc-note" style="color:var(--r)"><i class="fas fa-exclamation-triangle"></i> ${y} yılı için bordro parametreleri tanımlı değil — ${cfg.year} değerleri kullanılıyor.</div>`
      : '';
    return `<div class="earn-section tbc-section">
      <h3><i class="fas fa-percentage"></i>Gelir Vergisi Dilimi (${y} Kümülatif)</h3>
      <div class="tbc-head">
        <div class="tbc-kpi"><div class="tbc-kpi-v">${fm(ytdMatrah)}</div><div class="tbc-kpi-l">YTD Matrah</div></div>
        <div class="tbc-kpi"><div class="tbc-kpi-v" style="color:var(--acc)">%${(cur.rate*100).toFixed(0)}</div><div class="tbc-kpi-l">Güncel Oran</div></div>
        <div class="tbc-kpi"><div class="tbc-kpi-v">${cur.upTo === Infinity ? '—' : fm(toNext)}</div><div class="tbc-kpi-l">Sonraki dilime</div></div>
      </div>
      <div class="tbc-steps">${bracketBars}</div>
      ${nextInfo}
      ${staleYearNote}
    </div>`;
  } catch (err) {
    console.error('renderTaxBracketCard error:', err);
    return '';
  }
}

function renderEarnYearlyCumul(u, y, e) {
  if (!u.netSalary) return '';
  let cumul = 0, maxCumul = 0;
  const months = [];
  for (let mi = 0; mi < 12; mi++) {
    const me = calcEarningForMonth(y, mi, u.netSalary);
    const mEarn = (me && !me.isFutureMonth) ? me.totalEarning : 0;
    cumul += mEarn;
    months.push({ label: MTR[mi].substring(0, 3), earn: mEarn, cumul, isCurrent: mi === new Date().getMonth() && y === new Date().getFullYear() });
    if (cumul > maxCumul) maxCumul = cumul;
  }
  if (maxCumul === 0) return '';
  let bars = '';
  months.forEach((mo, i) => {
    const h = maxCumul > 0 ? (mo.cumul / maxCumul * 100) : 0;
    const isSel = i === S.em;
    const hasData = mo.earn > 0;
    const bg = isSel ? 'var(--pg)' : hasData ? 'var(--p);opacity:.45' : 'var(--bg3);opacity:.3';
    bars += `<div class="earn-cumul-col" style="height:${Math.max(2, h)}%;background:${bg}" title="${mo.label}: ${fm(mo.earn)} / Toplam: ${fm(mo.cumul)}">
      <span class="ecl">${mo.label}</span>
      ${hasData ? '<span class="ecv">' + fm(mo.earn) + '</span>' : ''}
    </div>`;
  });
  const totalYear = months.reduce((a, m2) => a + m2.earn, 0);
  const avgMonth = months.filter(m2 => m2.earn > 0).length;
  const avg = avgMonth > 0 ? totalYear / avgMonth : 0;
  return `<div class="earn-section">
    <h3><i class="fas fa-chart-bar"></i>Yıllık Kazanç Grafiği (${y})</h3>
    <div style="display:flex;gap:16px;margin-bottom:12px;flex-wrap:wrap">
      <div style="font-size:11px;color:var(--t2)"><span style="font-weight:800;color:var(--g);font-size:14px">${fm(totalYear)}</span> yıl toplam</div>
      <div style="font-size:11px;color:var(--t2)"><span style="font-weight:800;color:var(--p3);font-size:14px">${fm(avg)}</span> aylık ort.</div>
    </div>
    <div class="earn-cumul-bar" style="margin-bottom:20px">${bars}</div>
  </div>`;
}

function renderEarnCompare(u, y, m) {
  const el = $('earnCompare'); if (!el || !u.netSalary) { if (el) el.innerHTML = ''; return; }
  let pm = m - 1, py = y;
  if (pm < 0) { pm = 11; py--; }
  const curD = getMD(y, m), prevD = getMD(py, pm);
  const curE = calcEarningForMonth(y, m, u.netSalary);
  const prevE = calcEarningForMonth(py, pm, u.netSalary);
  if (!curE || !prevE || prevE.isFutureMonth) { el.innerHTML = ''; return; }
  function cmpRow(label, icon, cur, prev, isMoney) {
    const diff = cur - prev;
    const pct = prev !== 0 ? ((diff / prev) * 100).toFixed(1) : (cur > 0 ? '100' : '0');
    const color = diff > 0 ? 'var(--g)' : diff < 0 ? 'var(--r)' : 'var(--t3)';
    const arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
    const fmtCur = isMoney ? fm(cur) : cur.toFixed(1);
    const fmtPrev = isMoney ? fm(prev) : prev.toFixed(1);
    return `<div class="cmp-row"><span class="cmp-k"><i class="fas ${icon}" style="color:var(--p)"></i>${label}</span><span class="cmp-v">${fmtPrev}</span><span class="cmp-v">${fmtCur}</span><span class="cmp-d" style="color:${color}">${arrow} ${Math.abs(safeNum(pct, 0))}%</span></div>`;
  }
  el.innerHTML = `<div class="card">
    <div class="card-head"><h3><i class="fas fa-exchange-alt"></i>Ay Karşılaştırma</h3><span style="font-size:10px;color:var(--t3)">${MTR[pm].substring(0,3)} vs ${MTR[m].substring(0,3)}</span></div>
    <div class="cmp-header"><span></span><span>${MTR[pm].substring(0,3)}</span><span>${MTR[m].substring(0,3)}</span><span>Fark</span></div>
    ${cmpRow('Toplam Saat','fa-clock',curD.th,prevD.th,false)}
    ${cmpRow('Çalışma Günü','fa-calendar-check',curD.wd,prevD.wd,false)}
    ${cmpRow('Fazla Mesai','fa-fire',curD.oh,prevD.oh,false)}
    ${cmpRow('Kazanç','fa-wallet',curE.totalEarning,prevE.totalEarning,true)}
    ${cmpRow('FM Eki','fa-coins',curE.overtimePay,prevE.overtimePay,true)}
    ${cmpRow('Tatil Eki','fa-flag',curE.holidayPay,prevE.holidayPay,true)}
  </div>`;
}

function chgE(d) {
  S.em += d;
  if (S.em > 11) { S.em = 0; S.ey++; }
  if (S.em < 0) { S.em = 11; S.ey--; }
  renderEarn();
}

/* ============================================================
   SETTINGS
============================================================ */
function markSettingsUpdated(u) {
  if (u) u.settingsUpdatedAt = Date.now();
}

function loadSet() {
  const u = cu(); if (!u) return;
  const sN = $('sName'), sS = $('sSalary'), sSt = $('sStart'), sB = $('sBirth'), sL = $('sLeave');
  if (sN) sN.value = u.name || '';
  if (sS) sS.value = u.netSalary || '';
  if (sSt) sSt.value = u.startDate || '';
  if (sB) sB.value = u.birthDate || '';
  if (sL) sL.value = annualLeaveTotal(u);
  const sMH = $('sMH'); if (sMH) sMH.value = getMonthlyHours(u);
  const sWCH = $('sWCH'); if (sWCH) sWCH.value = clampInt(u.weeklyContractHours, 15, 45, 45);
  const uN = $('userNotes'); if (uN) uN.value = u.notes || '';
  const sGH = $('sGoalHours'); if (sGH) sGH.value = u.goalHours || '';
  const sGE = $('sGoalEarning'); if (sGE) sGE.value = u.goalEarning || '';
  /* [FIX] FM Yönetimi & Öneriler ayarlarını yükle */
  const sOR = $('sOTRate'); if (sOR) sOR.value = getOTRate(u);
  const _otCalcMode = (u.otCalcMode === 'daily75' || u.otCalcMode === 'hybrid') ? u.otCalcMode : 'weekly45';
  document.querySelectorAll('[data-otcalc-mode="1"]').forEach(r => { r.checked = r.value === _otCalcMode; });
  const otGroupName = `otMode_${S.cu}`;
  document.querySelectorAll('[data-ot-mode="1"]').forEach(r => {
    r.name = otGroupName;
    r.checked = r.value === (u.otCompMode || 'pay');
  });
  const hst = $('hideSuggestionsToggle'); if (hst) hst.checked = !u.hideSuggestions;
  const ltOTC = $('ltOptOTComp');
  if (ltOTC) ltOTC.style.display = (u.otCompMode === 'leave') ? '' : 'none';
  updOTBalanceDisplay();
  updSal();
  updSeniority();
  updPinStatus();
  renderCustomPresets();
  renderWeeklyTemplate();
  renderDataUsage();
  rsSwitch('pct');
  applyTheme(u.theme || 'default');
  _updateInstallCard();
}

function sSet(k, v) {
  const u = cu(); if (!u) return;
  if (k === 'netSalary') { v = Math.max(0, safeNum(v, 0)); }
  if (k === 'annualLeave') { v = clampInt(v, 0, 40, 0); }
  if (k === 'monthlyHours') { v = clampInt(v, 100, 400, 225); }
  if (k === 'weeklyContractHours') { v = clampInt(v, 15, 45, 45); }
  if (k === 'goalHours') { v = Math.max(0, safeNum(v, 0)); }
  if (k === 'goalEarning') { v = Math.max(0, safeNum(v, 0)); }
  /* [FIX] FM Yönetimi yeni ayarlar */
  if (k === 'otCompRate') { v = clampNum(v, 1.5, 3, 1.5); }
  if (k === 'otCalcMode') {
    v = (v === 'daily75' || v === 'hybrid') ? v : 'weekly45';
    document.querySelectorAll('[data-otcalc-mode="1"]').forEach(r => { r.checked = r.value === v; });
  }
  if (k === 'otBalance') { v = Math.max(0, safeNum(v, 0)); }
  if (k === 'otCompMode') {
    v = v === 'leave' ? 'leave' : 'pay';
    const prevMode = u.otCompMode || 'pay';
    document.querySelectorAll('[data-ot-mode="1"]').forEach(r => { r.checked = r.value === v; });
    const ltOTC = $('ltOptOTComp');
    if (ltOTC) ltOTC.style.display = v === 'leave' ? '' : 'none';
    if (v === 'leave' && prevMode === 'pay') {
      setTimeout(() => toast('⚠️ İzin moduna geçildi: Bu tarihten sonraki FM saatleri izin bakiyesine katsayılı eklenir.', 'warning'), 200);
    }
    if (v !== prevMode) {
      const ts = Date.now();
      u.otCompModeChangedAt = ts;
      if (!Array.isArray(u.otCompModeHistory)) u.otCompModeHistory = [];
      u.otCompModeHistory.push({ at: ts, mode: v });
      if (u.otCompModeHistory.length > 60) u.otCompModeHistory = u.otCompModeHistory.slice(-60);
    }
  }
  if (k === 'hideSuggestions') { v = !!v; }
  if (k === 'name') {
    v = (v || '').trim();
    if (!v) { toast('İsim boş olamaz', 'error'); return; }
  }
  if (k === 'startDate' && v) {
    const s2 = new Date(v);
    if (isNaN(s2.getTime()) || s2 > new Date()) { toast('Geçersiz tarih', 'error'); return; }
  }
  if (k === 'birthDate' && v) {
    const b2 = new Date(v);
    if (isNaN(b2.getTime()) || b2 > new Date()) { toast('Geçersiz doğum tarihi', 'error'); return; }
  }
  u[k] = v;
  if ((k === 'startDate' || k === 'birthDate') && u.startDate) {
    u.annualLeave = statutoryAnnualLeaveFromStart(u.startDate, u.birthDate) ?? annualLeaveTotal(u);
    const sL = $('sLeave'); if (sL) sL.value = u.annualLeave;
  }
  /* [FIX L-04] BUG-R3 ile eklenen settingsUpdatedAt: ayar değişikliklerini zaman damgasıyla işaretle.
     deepMergeUser bu zaman damgasını kullanarak daha yeni değişikliği (yerel/cloud) korur. */
  const settingsKeys = ['netSalary','annualLeave','pin','weeklyTemplate','customPresets',
    'goalHours','goalEarning','theme','autoTheme','monthlyHours','weeklyContractHours','payMode',
    'otCompMode','otCalcMode','otCompRate','otBalance','otCompModeChangedAt','hideSuggestions'];
  if (settingsKeys.includes(k)) markSettingsUpdated(u);
  if (k === 'name' || k === 'startDate' || k === 'birthDate') u.profileUpdatedAt = Date.now();
  invalidateMDCache();
  saveLS();
  updTop();
  updSal();
  updSeniority();
  renderActivePage();
  toast('Kaydedildi', 'success');
}

function saveNotes() {
  const u = cu(); if (!u) return;
  const notesEl = $('userNotes');
  u.notes = (notesEl ? notesEl.value : '').substring(0, 1000);
  u.notesUpdatedAt = Date.now();
  saveLS();
  toast('Notlar kaydedildi', 'success');
}

function updSal() {
  const u = cu(); if (!u) return;
  const el = $('salPrev'); if (!el) return;
  if (u.netSalary > 0) {
    el.style.display = 'block';
    setTxt('salAmt', fm(u.netSalary));
    const _mhSal = getMonthlyHours(u);
    const _otRateSal = getOTRate(u);
    setTxt('salDet', `Günlük: ${fm(u.netSalary/30)} | Saatlik: ${fm(u.netSalary/_mhSal)} | FM: ${fm(u.netSalary/_mhSal*_otRateSal)}`);
  } else { el.style.display = 'none'; }
}

function updSeniority() {
  const u = cu(); if (!u) return;
  const el = $('seniorityInfo'); if (!el) return;
  if (u.startDate) {
    const s2 = new Date(u.startDate);
    if (isNaN(s2.getTime())) { el.innerHTML = ''; return; }
    const df = new Date() - s2;
    if (df < 0) { el.innerHTML = '<div style="margin-top:8px;padding:10px;background:rgba(248,113,113,.08);border-radius:8px;font-size:12px;color:var(--r)">Tarih gelecekte!</div>'; return; }
    const yr = Math.floor(df / (365.25 * 864e5)), mo = Math.floor((df % (365.25 * 864e5)) / (30.44 * 864e5));
    el.innerHTML = `<div style="margin-top:8px;padding:10px 12px;background:var(--bg3);border-radius:8px;border:1px solid var(--b1);font-size:12px;color:var(--t2)"><i class="fas fa-briefcase" style="color:var(--p);margin-right:6px"></i>Kıdem: <strong>${yr}y ${mo}a</strong> | İzin: <strong>${annualLeaveTotal(u)}g</strong></div>`;
  } else { el.innerHTML = ''; }
}

/* ============================================================
   CUSTOM PRESETS
============================================================ */
function openCPModal() {
  const cn = $('cpName'), cs = $('cpStart'), ce = $('cpEnd'), cb = $('cpBreak');
  if (cn) cn.value = '';
  if (cs) cs.value = '22:00';
  if (ce) ce.value = '06:00';
  if (cb) cb.value = '30';
  S.cpSelectedEmoji = '⏰';
  renderEmojiGrid();
  updCPPreview();
  const cm = $('cpModal'); if (cm) cm.classList.add('show');
}

function closeCPModal() { const cm = $('cpModal'); if (cm) cm.classList.remove('show'); }

function renderEmojiGrid() {
  const eg = $('emojiGrid'); if (!eg) return;
  eg.innerHTML = PRESET_EMOJIS.map(em =>
    `<button class="emoji-btn ${em === S.cpSelectedEmoji ? 'active' : ''}" onclick="selectEmoji('${em}')">${em}</button>`
  ).join('');
}

function selectEmoji(em) {
  S.cpSelectedEmoji = em;
  renderEmojiGrid();
}

function updCPPreview() {
  const csE = $('cpStart'), ceE = $('cpEnd'), cbE = $('cpBreak');
  if (!csE || !ceE || !cbE) return;
  const s = csE.value, e = ceE.value, b = safeInt(cbE.value, 0);
  const p = $('cpPreview'); if (!p) return;
  if (s && e) {
    const h = calcHr(s, e, b);
    p.textContent = h > 0 ? `${s}–${e} = ${h.toFixed(1)}s` : 'Geçersiz süreler';
  }
}

function saveCPModal() {
  const u = cu(); if (!u) return;
  const cpN = $('cpName'), cpS = $('cpStart'), cpE = $('cpEnd'), cpB = $('cpBreak');
  if (!cpN || !cpS || !cpE || !cpB) return;
  const name = (cpN.value || '').trim();
  if (!name) { toast('Şablon adı gerekli', 'error'); return; }
  const start = cpS.value, end = cpE.value;
  const brk = safeInt(cpB.value, 0);
  const check = validateShiftInput(start, end, brk);
  if (!check.ok) { toast(check.msg, 'error'); return; }
  if (!u.customPresets) u.customPresets = [];
  u.customPresets.push({ name:name.substring(0,30), icon:S.cpSelectedEmoji, start, end, break:check.breakMinutes });
  markSettingsUpdated(u);
  saveLS();
  renderCustomPresets();
  closeCPModal();
  toast(`"${escHtml(name)}" eklendi`, 'success');
}

function renderCustomPresets() {
  const u = cu(); if (!u) return;
  const el = $('customPresets'); if (!el) return;
  if (!u.customPresets) u.customPresets = [];
  if (!u.customPresets.length) { el.innerHTML = '<div style="font-size:12px;color:var(--t3)">Özel şablon yok.</div>'; return; }
  let h = '';
  u.customPresets.forEach((cp, i) => {
    if (!cp) return;
    const hrs = calcHr(cp.start || '08:00', cp.end || '16:00', cp.break || 0);
    h += `<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--bg3);border-radius:8px;margin-bottom:6px;border:1px solid var(--b1)">
      <span style="font-size:18px">${escHtml(cp.icon || '⏰')}</span>
      <div style="flex:1"><div style="font-size:12px;font-weight:700">${escHtml(cp.name || 'Özel')}</div>
      <div style="font-size:10px;color:var(--t3)">${escHtml(cp.start)}–${escHtml(cp.end)} (${hrs.toFixed(1)}s)</div></div>
      <button class="btn btn-danger btn-xs" onclick="delPreset(${i})"><i class="fas fa-trash"></i></button>
    </div>`;
  });
  el.innerHTML = h;
}

function delPreset(i) {
  const u = cu(); if (!u || !u.customPresets || i < 0 || i >= u.customPresets.length) return;
  u.customPresets.splice(i, 1);
  markSettingsUpdated(u);
  saveLS();
  renderCustomPresets();
  toast('Silindi', 'success');
}

/* ============================================================
   WEEKLY TEMPLATE
============================================================ */
function renderWeeklyTemplate() {
  const u = cu(); if (!u) return;
  const el = $('weeklyTemplate'); if (!el) return;
  const wt = u.weeklyTemplate || {};
  let h = '<div class="wt-grid">';
  for (let d = 0; d < 7; d++) {
    const dayConf = wt[d];
    const isOff = !dayConf || dayConf.type === 'off';
    h += `<div class="wt-day ${isOff ? '' : 'wt-active'}" onclick="openWTModal(${d})">
      <span class="wt-name">${DTR[d]}</span>
      ${isOff ? '<span class="wt-off">İzin</span>' : `<span class="wt-shift">${escHtml(dayConf.start||'?')}–${escHtml(dayConf.end||'?')}</span>`}
    </div>`;
  }
  h += '</div>';
  h += `<div style="display:flex;gap:6px;flex-wrap:wrap">
    <button class="btn btn-primary btn-sm" onclick="applyWeeklyTemplate()"><i class="fas fa-calendar-plus"></i>Aya Uygula (${MTR[S.cm]})</button>
    <button class="btn btn-outline btn-sm" onclick="clearWeeklyTemplate()"><i class="fas fa-eraser"></i>Temizle</button>
  </div>`;
  el.innerHTML = h;
}

function openWTModal(d) {
  S.wtEditDay = d;
  setTxt('wtModalTitle', DFL[d]);
  const u = cu(); if (!u) return;
  const wt = u.weeklyTemplate || {};
  const cur = wt[d];
  const ws = $('wtStart'), we = $('wtEnd'), wb = $('wtBreak');
  if (cur && cur.type !== 'off') {
    if (ws) ws.value = cur.start || '08:00';
    if (we) we.value = cur.end || '16:00';
    if (wb) wb.value = String(cur.break || 30);
  } else {
    if (ws) ws.value = '08:00'; if (we) we.value = '16:00'; if (wb) wb.value = '30';
  }
  updWTPreview();
  const wm = $('wtModal'); if (wm) wm.classList.add('show');
}

function closeWTModal() { const wm = $('wtModal'); if (wm) wm.classList.remove('show'); S.wtEditDay = null; }

function wtSetPreset(s, e) { const ws = $('wtStart'), we = $('wtEnd'); if (ws) ws.value = s; if (we) we.value = e; updWTPreview(); }

function wtSetOff() {
  const u = cu(); if (!u || S.wtEditDay === null) return;
  if (!u.weeklyTemplate) u.weeklyTemplate = {};
  u.weeklyTemplate[S.wtEditDay] = { type:'off' };
  markSettingsUpdated(u);
  saveLS(); renderWeeklyTemplate(); closeWTModal();
  toast(DFL[S.wtEditDay] + ' → İzin', 'info');
}

function updWTPreview() {
  const wsE = $('wtStart'), weE = $('wtEnd'), wbE = $('wtBreak');
  if (!wsE || !weE || !wbE) return;
    const s = wsE.value, e = weE.value, b = safeInt(wbE.value, 0);
  const p = $('wtPreview'); if (!p) return;
  if (s && e) {
    const h = calcHr(s, e, b);
    p.textContent = h > 0 ? `${s}–${e} = ${h.toFixed(1)}s` : 'Geçersiz süreler';
  }
}

function saveWTDay() {
  const u = cu(); if (!u || S.wtEditDay === null) return;
  const wsE = $('wtStart'), weE = $('wtEnd'), wbE = $('wtBreak');
  if (!wsE || !weE || !wbE) return;
    const s = wsE.value, e = weE.value, b = safeInt(wbE.value, 0);
  const check = validateShiftInput(s, e, b);
  if (!check.ok) { toast(check.msg, 'error'); return; }
  if (!u.weeklyTemplate) u.weeklyTemplate = {};
  u.weeklyTemplate[S.wtEditDay] = { start:s, end:e, break:check.breakMinutes, type:'shift' };
  markSettingsUpdated(u);
  saveLS(); renderWeeklyTemplate(); closeWTModal();
  toast(DFL[S.wtEditDay] + ' güncellendi', 'success');
}

function applyWeeklyTemplate() {
  const u = cu(); if (!u || !u.weeklyTemplate) return;
  const wt = u.weeklyTemplate;
  const hasShift = Object.values(wt).some(v => v && v.type === 'shift');
  if (!hasShift) { toast('Önce şablon tanımlayın', 'error'); return; }
  showConfirm('Aya Uygula', `${MTR[S.cm]} ${S.cy} ayına haftalık şablon uygulanacak. Mevcut boş günler doldurulacak.`, () => {
    pushUndo('Haftalık şablon');
    const dim = new Date(S.cy, S.cm + 1, 0).getDate();
    let count = 0;
    for (let d = 1; d <= dim; d++) {
      const ds = `${S.cy}-${String(S.cm+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      if (u.shifts[ds] || u.leaves[ds]) continue;
      const dt = new Date(S.cy, S.cm, d);
      let dow = dt.getDay(); dow = dow === 0 ? 6 : dow - 1;
      const conf = wt[dow];
      if (isH(ds)) continue;
      if (!conf) continue; // Şablonda tanımsız gün → atla
      if (conf.type === 'off') {
        // Sadece şablonda açıkça "off" olarak tanımlanmış günlere izin ekle
        u.leaves[ds] = { type:'weekly', note:'Şablon', updatedAt:Date.now() };
        continue;
      }
      const check = validateShiftInput(conf.start, conf.end, conf.break || 30);
      if (!check.ok) continue;
      u.shifts[ds] = { start:conf.start, end:conf.end, break:check.breakMinutes, updatedAt:Date.now() };
      count++;
    }
    invalidateMDCache();
    saveLS();
    renderActivePage();
    toast(count + ' gün dolduruldu', 'success');
  });
}

function clearWeeklyTemplate() {
  const u = cu(); if (!u) return;
  u.weeklyTemplate = {};
  markSettingsUpdated(u);
  saveLS();
  renderWeeklyTemplate();
  toast('Şablon temizlendi', 'info');
}

/* ============================================================
   DATA
============================================================ */
function saveLS() {
  try {
    const d = JSON.stringify({ users:S.u, deletedUsers:S.deletedUsers || {}, version:DATA_VERSION, nextUid:S.nextUid });
    /* [FIX BUG-09] d.length karakter sayısı, localStorage UTF-16 ~5MB = ~2.5M char.
       Uyarı eşiği 2M karaktere (≈4MB) düzeltildi */
    if (d.length > 2 * 1024 * 1024) toast('Veri büyük, yedekleme önerilir', 'warning');
    localStorage.setItem('st_data', d);
    // Cloud'dan gelen veri ise geri push etme
    if (skipNextPush) {
      skipNextPush = false;
      return;
    }
    // Buluta da gönder (debounced)
    debouncedPush();
  } catch(e) {
    if (e.name === 'QuotaExceededError') {
      // [FIX LOCALSTORAGE-QUOTA-01] Sadece 30 günden eski silme kayıtlarını temizle
      // — deepMergeUser ile tutarlı politika; aktif sync geçmişi korunuyor
      try {
        const _now = Date.now(), _ttl = 30 * 24 * 60 * 60 * 1000;
        Object.values(S.u).forEach(u => {
          if (!u) return;
          ['deletedShifts', 'deletedLeaves', 'deletedDocs'].forEach(key => {
            if (!u[key]) return;
            Object.keys(u[key]).forEach(k => {
              if (u[key][k] < _now - _ttl) delete u[key][k];
            });
          });
        });
        const d2 = JSON.stringify({ users:S.u, deletedUsers:S.deletedUsers || {}, version:DATA_VERSION, nextUid:S.nextUid });
        localStorage.setItem('st_data', d2);
        toast('Depolama doldu, 30 günden eski kayıtlar temizlendi', 'warning');
      } catch(e2) {
        // İkinci deneme: tüm silme geçmişini sil
        try {
          Object.values(S.u).forEach(u => {
            if (!u) return;
            u.deletedShifts = {}; u.deletedLeaves = {}; u.deletedDocs = {};
          });
          const d3 = JSON.stringify({ users:S.u, deletedUsers:S.deletedUsers || {}, version:DATA_VERSION, nextUid:S.nextUid });
          localStorage.setItem('st_data', d3);
          toast('Depolama kritik doldu, silme geçmişi temizlendi. Yedek alın!', 'warning');
        } catch(e3) {
          console.error('saveLS quota fatal:', e3);
          toast('Depolama dolu! Veri kaydedilemedi. Yedek alın.', 'error');
        }
      }
    } else {
      /* [FIX ERR-HANDLE-06] SecurityError (private mode), JSON.stringify circular vb. kalan hataları logla */
      console.error('saveLS error:', e);
      toast('Kayıt hatası!', 'error');
    }
  }
}

function resolveDayConflicts(u) {
  if (!u || typeof u !== 'object') return u;
  if (!u.shifts || typeof u.shifts !== 'object') u.shifts = {};
  if (!u.leaves || typeof u.leaves !== 'object') u.leaves = {};
  if (!Array.isArray(u.conflictLog)) u.conflictLog = [];
  const logConflict = (ds, type, detail) => {
    u.conflictLog.push({ at: Date.now(), ds, type, detail });
    if (u.conflictLog.length > 50) u.conflictLog = u.conflictLog.slice(-50);
  };
  Object.keys(u.leaves).forEach(ds => {
    const lv = u.leaves[ds];
    if (lv && lv.type === 'public_holiday' && !isH(ds)) {
      logConflict(ds, 'invalid_public_holiday_leave', 'Gerçek resmi tatil olmayan public_holiday izin kaydı kaldırıldı.');
      if (!u.deletedLeaves) u.deletedLeaves = {};
      u.deletedLeaves[ds] = Date.now();
      delete u.leaves[ds];
    } else if (lv && lv.type === 'annual' && !isAnnualLeaveChargeable(ds)) {
      logConflict(ds, 'invalid_annual_leave_day', 'Yıllık izin hafta sonu/resmi tatil gününe yazılamaz; kayıt kaldırıldı.');
      if (!u.deletedLeaves) u.deletedLeaves = {};
      u.deletedLeaves[ds] = Date.now();
      delete u.leaves[ds];
    }
  });
  Object.keys(u.shifts).forEach(ds => {
    if (!u.leaves[ds]) return;
      const shTime = safeTimestamp(u.shifts[ds] && u.shifts[ds].updatedAt, 0);
      const lvTime = safeTimestamp(u.leaves[ds] && u.leaves[ds].updatedAt, 0);
    if (lvTime > shTime) {
      logConflict(ds, 'shift_leave_conflict', 'Aynı gün vardiya ve izin vardı; daha güncel izin korundu, vardiya kaldırıldı.');
      if (!u.deletedShifts) u.deletedShifts = {};
      u.deletedShifts[ds] = Date.now();
      delete u.shifts[ds];
    } else {
      logConflict(ds, 'shift_leave_conflict', 'Aynı gün vardiya ve izin vardı; daha güncel vardiya korundu, izin kaldırıldı.');
      if (!u.deletedLeaves) u.deletedLeaves = {};
      u.deletedLeaves[ds] = Date.now();
      delete u.leaves[ds];
    }
  });
  return u;
}

function loadLS() {
  try {
    const s = localStorage.getItem('st_data');
    if (!s) return;
    /* [FIX ERR-HANDLE-03] safeParse ile JSON dışı içerik ya da null'da erken dönüş */
    const p = safeParse(s, null);
    if (!p || typeof p !== 'object' || !p.users || typeof p.users !== 'object') return;
    if (p.nextUid) S.nextUid = safeInt(p.nextUid, S.nextUid);
    S.deletedUsers = (p.deletedUsers && typeof p.deletedUsers === 'object') ? p.deletedUsers : {};
    S.u = {};
    Object.keys(p.users).forEach(k => {
      const i = parseInt(k);
      if (!Number.isFinite(i)) return;
      const raw = p.users[k];
      /* [FIX ERR-HANDLE-03] Bozuk / non-object user kaydını atla */
      if (!raw || typeof raw !== 'object') return;
      S.u[i] = Object.assign(mkUser(i), raw);
      if (typeof S.u[i].shifts !== 'object' || !S.u[i].shifts) S.u[i].shifts = {};
      if (typeof S.u[i].leaves !== 'object' || !S.u[i].leaves) S.u[i].leaves = {};
      if (typeof S.u[i].deletedShifts !== 'object' || !S.u[i].deletedShifts) S.u[i].deletedShifts = {};
      if (typeof S.u[i].deletedLeaves !== 'object' || !S.u[i].deletedLeaves) S.u[i].deletedLeaves = {};
      if (typeof S.u[i].deletedDocs !== 'object' || !S.u[i].deletedDocs) S.u[i].deletedDocs = {};
    S.u[i].profileUpdatedAt = safeTimestamp(S.u[i].profileUpdatedAt, 0);
    S.u[i].notesUpdatedAt = safeTimestamp(S.u[i].notesUpdatedAt, 0);
    S.u[i].settingsUpdatedAt = safeTimestamp(S.u[i].settingsUpdatedAt, 0);
      if (!Array.isArray(S.u[i].customPresets)) S.u[i].customPresets = [];
      if (!Array.isArray(S.u[i].documents)) S.u[i].documents = [];
      if (!Array.isArray(S.u[i].conflictLog)) S.u[i].conflictLog = [];
      if (!Array.isArray(S.u[i].otCompModeHistory)) S.u[i].otCompModeHistory = [];
      if (!S.u[i].payrollChecks || typeof S.u[i].payrollChecks !== 'object') S.u[i].payrollChecks = {};
      /* [FIX ERR-HANDLE-03] safeNum/safeInt ile NaN/Infinity propagation engellendi */
      normalizeUserCalculations(S.u[i]);
      S.u[i].annualLeave = annualLeaveTotal(S.u[i]);
      if (typeof S.u[i].notes !== 'string') S.u[i].notes = '';
      resolveDayConflicts(S.u[i]);
      /* [FIX BUG-04] Eski format düz metin PIN migration: hash uzunluğu 64 hex char */
      if (S.u[i].pin && S.u[i].pin.length !== 64) { S.u[i].pin = null; }
    });
    Object.keys(S.deletedUsers || {}).forEach(k => { delete S.u[k]; });
    if (Object.keys(S.u).length === 0) { S.u = { 1: mkUser(1), 2: mkUser(2) }; }
  } catch(e) {
    console.error('loadLS error:', e);
    toast('Veri yükleme hatası, varsayılan profil yüklendi', 'error');
    /* [FIX ERR-HANDLE-04] Corrupt state'te kalmak yerine kullanılabilir fallback kur */
    try { S.u = { 1: mkUser(1), 2: mkUser(2) }; S.deletedUsers = {}; S.nextUid = 3; } catch(_) {}
  }
}

function normalizeImportedUser(i, raw, opts = {}) {
  if (!raw || typeof raw !== 'object') return null;
  const allowed = ['name','netSalary','startDate','birthDate','annualLeave','shifts','leaves','deletedShifts','deletedLeaves',
    'customPresets','weeklyTemplate','notes','profileUpdatedAt','notesUpdatedAt','settingsUpdatedAt','lastLogin',
    'theme','monthlyHours','weeklyContractHours','payMode','goalHours','goalEarning','pin','autoTheme','documents','deletedDocs','payrollChecks','conflictLog',
    'otCompMode','otCalcMode','otCompRate','otBalance','otCompModeChangedAt','otCompModeHistory','hideSuggestions'];
  const u = mkUser(i);
  allowed.forEach(k => { if (raw[k] !== undefined) u[k] = raw[k]; });
  if (typeof u.shifts !== 'object' || !u.shifts) u.shifts = {};
  if (typeof u.leaves !== 'object' || !u.leaves) u.leaves = {};
  if (typeof u.deletedShifts !== 'object' || !u.deletedShifts) u.deletedShifts = {};
  if (typeof u.deletedLeaves !== 'object' || !u.deletedLeaves) u.deletedLeaves = {};
  if (typeof u.deletedDocs !== 'object' || !u.deletedDocs) u.deletedDocs = {};
  if (!u.payrollChecks || typeof u.payrollChecks !== 'object') u.payrollChecks = {};
  u.profileUpdatedAt = safeTimestamp(u.profileUpdatedAt, 0);
  u.notesUpdatedAt = safeTimestamp(u.notesUpdatedAt, 0);
  u.settingsUpdatedAt = safeTimestamp(u.settingsUpdatedAt, 0);
  if (!Array.isArray(u.customPresets)) u.customPresets = [];
  u.documents = Array.isArray(u.documents) ? u.documents.slice(0, 100).map(d => {
    const out = {
      id: String((d && d.id) || '').slice(0, 80),
      name: String((d && d.name) || 'Belge').slice(0, 80),
      category: DOC_CATS[(d && d.category)] ? d.category : 'other',
      fileName: String((d && d.fileName) || '').slice(0, 120),
      mimeType: String((d && d.mimeType) || '').slice(0, 80),
      fileSize: safeNum(d && d.fileSize, 0),
      uploadedAt: safeNum(d && d.uploadedAt, 0)
    };
    if (opts.keepDocUrls && typeof d.url === 'string' && d.url.startsWith('data:') && d.url.length < 950000) out.url = d.url;
    return out.id ? out : null;
  }).filter(Boolean) : [];
  normalizeUserCalculations(u);
  u.annualLeave = annualLeaveTotal(u);
  u.notes = typeof u.notes === 'string' ? u.notes.substring(0, 1000) : '';
  resolveDayConflicts(u);
  if (u.pin && u.pin.length !== 64) u.pin = null;
  return u;
}

function exportD() {
  let url = null;
  try {
    const d = { users:S.u, deletedUsers:S.deletedUsers || {}, exportDate:new Date().toISOString(), version:DATA_VERSION };
    const b = new Blob([JSON.stringify(d, null, 2)], { type:'application/json' });
    url = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shifttrack_${dStr(new Date())}.json`;
    a.click();
    toast('Yedek indirildi', 'success');
  } catch(e) {
    console.error('exportD error:', e);
    toast('İndirme hatası', 'error');
  } finally {
    /* [FIX ERR-HANDLE-12] Revoke'ı finally ile garantile */
    if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

function importD(e) {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = function(ev) {
    try {
      /* [FIX ERR-HANDLE-05] safeParse + yapı ve alan-bazlı sıkı doğrulama */
      const p = safeParse(ev.target.result, null);
      if (!p || typeof p !== 'object' || !p.users || typeof p.users !== 'object') {
        toast('Geçersiz format', 'error'); return;
      }
      if (p.nextUid) S.nextUid = safeInt(p.nextUid, S.nextUid);
      S.deletedUsers = (p.deletedUsers && typeof p.deletedUsers === 'object') ? p.deletedUsers : {};
      Object.keys(p.users).forEach(k => {
        const i = parseInt(k);
        if (!Number.isFinite(i)) return;
        const user = normalizeImportedUser(i, p.users[k], { keepDocUrls:true });
        if (user) S.u[i] = user;
      });
      invalidateMDCache();
      saveLS();
      if (cu()) applyTheme(cu().theme || 'default');
      renderAll(); updTop();
      toast('Yedek yüklendi!', 'success');
    } catch(err) {
      console.error('importD error:', err);
      toast('Geçersiz dosya', 'error');
    }
  };
  r.onerror = function() { toast('Dosya okunamadı', 'error'); };
  r.readAsText(f);
  e.target.value = '';
}

function clearD() {
  showConfirm('Sıfırla', 'Tüm veriler silinecek!', () => {
    const u = cu(); if (!u) return;
    const kl = u.lastLogin, kt = u.theme, kn = u.name;
    const deletedDocs = Object.assign({}, u.deletedDocs || {});
    (u.documents || []).forEach(d => { if (d && d.id) deletedDocs[d.id] = Date.now(); });
    S.u[S.cu] = mkUser(S.cu);
    S.u[S.cu].lastLogin = kl;
    S.u[S.cu].theme = kt;
    S.u[S.cu].name = kn;
    S.u[S.cu].deletedDocs = deletedDocs;
    S.u[S.cu].profileUpdatedAt = Date.now();
    S.u[S.cu].settingsUpdatedAt = Date.now();
    invalidateMDCache();
    saveLS(); renderAll(); updTop(); loadSet();
    toast('Sıfırlandı', 'success');
  });
}

/* ============================================================
   DATA USAGE
============================================================ */
function renderDataUsage() {
  const el = $('dataUsage'); if (!el) return;
  try {
    const d = localStorage.getItem('st_data') || '';
    const bytes = new Blob([d]).size;
    const kb = (bytes / 1024).toFixed(1);
    const maxKB = 5120;
    const pct = Math.min(100, (bytes / 1024 / maxKB) * 100);
    const u = cu();
    const shiftCount = u ? Object.keys(u.shifts).length : 0;
    const leaveCount = u ? Object.keys(u.leaves).length : 0;
    const color = pct > 80 ? 'var(--r)' : pct > 50 ? 'var(--acc)' : 'var(--g)';
    el.innerHTML = `<div style="padding:12px;background:var(--bg3);border-radius:10px;border:1px solid var(--b1)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span style="font-size:11px;font-weight:700;color:var(--t2)"><i class="fas fa-hdd" style="color:var(--p);margin-right:4px"></i>Depolama</span>
        <span style="font-size:11px;font-weight:800;color:${color}">${kb} KB / ${maxKB} KB</span>
      </div>
      <div class="pbar" style="margin:0"><div class="pf" style="width:${pct}%;background:${color}"></div></div>
      <div style="display:flex;gap:12px;margin-top:6px;font-size:10px;color:var(--t3)">
        <span><i class="fas fa-clock" style="margin-right:3px"></i>${shiftCount} vardiya</span>
        <span><i class="fas fa-umbrella-beach" style="margin-right:3px"></i>${leaveCount} izin</span>
      </div>
    </div>`;
  } catch(e) { el.innerHTML = ''; }
}

/* ============================================================
   CSV EXPORT
============================================================ */
function exportCSV() {
  const u = cu(); if (!u) return;
  /* [FIX ERR-HANDLE-11] Tüm alanları quote + newline kaçışı ile sar; virgül ve CR/LF güvenli */
  const csvEsc = v => {
    const s = (v === null || v === undefined) ? '' : String(v);
    return '"' + s.replace(/"/g, '""').replace(/\r?\n/g, ' ') + '"';
  };
  let url = null;
  try {
    let csv = 'Tarih,Gün,Tür,Giriş,Çıkış,Mola(dk),Net Saat,Brüt Saat,Not\n';
    const shiftRows = getShiftPartRows(u);
    const workedDates = new Set();
    shiftRows.forEach(part => {
      workedDates.add(part.ds);
      const d = dsToDate(part.ds);
      const dow = d.getDay();
      const dayName = DFL[dow === 0 ? 6 : dow - 1];
      const gross = Math.max(0, (safeNum(part.endMin, 0) - safeNum(part.startMin, 0)) / 60);
      const allocatedBreak = Math.max(0, Math.round(gross * 60 - safeNum(part.hours, 0) * 60));
      const type = part.sourceDs === part.ds ? 'Vardiya' : `Vardiya (devam: ${part.sourceDs})`;
      csv += [csvEsc(part.ds), csvEsc(dayName), csvEsc(type), csvEsc(part.startLabel), csvEsc(part.endLabel), csvEsc(allocatedBreak), csvEsc(part.hours.toFixed(1)), csvEsc(gross.toFixed(1)), csvEsc((part.sh && part.sh.note) || '')].join(',') + '\n';
    });
    Object.entries(u.leaves || {}).sort((a,b) => a[0].localeCompare(b[0])).forEach(([ds, lv]) => {
      if (!lv || !lv.type || workedDates.has(ds)) return;
      const d = dsToDate(ds);
      const dow = d.getDay();
      const dayName = DFL[dow === 0 ? 6 : dow - 1];
      const tl = {annual:'Yıllık İzin',weekly:'Hafta Tatili',public_holiday:'Resmi Tatil',sick:'Rapor',unpaid:'Ücretsiz',ot_comp:'FM İzni'};
      csv += [csvEsc(ds), csvEsc(dayName), csvEsc(tl[lv.type]||lv.type), '', '', '', '', '', csvEsc(lv.note||'')].join(',') + '\n';
    });
    const bom = '\uFEFF';
    const b = new Blob([bom + csv], { type:'text/csv;charset=utf-8' });
    url = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shifttrack_${dStr(new Date())}.csv`;
    a.click();
    toast('CSV indirildi', 'success');
  } catch(e) {
    console.error('exportCSV error:', e);
    toast('CSV hatası', 'error');
  } finally {
    /* [FIX ERR-HANDLE-12] Revoke'ı finally ile garantile; bazı tarayıcılar anında revoke'da indirmeyi iptal ediyor */
    if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

/* ============================================================
   KEYBOARD SHORTCUTS HELP
============================================================ */
const NOTE_EMOJIS = ['👍','👎','❤️','🔥','⭐','💪','😴','🤒','🎉','✅','❌','⚠️','📝','🏠','🚗','☕','🍕','💼','📞','🎯'];
function toggleNoteEmoji(inputId) {
  const existing = document.getElementById('noteEmojiPicker');
  if (existing) { existing.remove(); return; }
  const inp = $(inputId); if (!inp) return;
  const picker = document.createElement('div');
  picker.id = 'noteEmojiPicker';
  picker.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--card);border:1px solid var(--b1);border-radius:10px;box-shadow:var(--sh2);margin-top:6px';
  NOTE_EMOJIS.forEach(em => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = em;
    btn.style.cssText = 'font-size:18px;border:none;background:transparent;cursor:pointer;padding:4px;border-radius:6px;transition:background .2s';
    btn.onmouseenter = () => { btn.style.background = 'var(--p4)'; };
    btn.onmouseleave = () => { btn.style.background = 'transparent'; };
    btn.onclick = () => { inp.value += em; picker.remove(); inp.focus(); };
    picker.appendChild(btn);
  });
  inp.parentElement.parentElement.appendChild(picker);
}

/* [FEAT F5] Zam Simülatörü */
let _rsMode = 'pct';
function rsSwitch(mode) {
  _rsMode = mode;
  document.querySelectorAll('.rst-tab').forEach(b => b.classList.remove('active'));
  const tabs = document.querySelectorAll('.rst-tab');
  const idx = { pct: 0, net: 1, gross: 2 }[mode] ?? 0;
  if (tabs[idx]) tabs[idx].classList.add('active');
  const lbl = $('rsLabel'), inp = $('rsInput');
  if (lbl) lbl.textContent = mode === 'pct' ? 'Zam Oranı (%)' : mode === 'net' ? 'Hedef Net Maaş (₺)' : 'Hedef Brüt Maaş (₺)';
  if (inp) { inp.value = ''; inp.placeholder = mode === 'pct' ? '25' : mode === 'net' ? '35000' : '45000'; inp.step = mode === 'pct' ? '0.5' : '100'; }
  const res = $('rsResult'); if (res) res.innerHTML = '';
}
function renderRaiseSim() {
  const u = cu(); const res = $('rsResult'); if (!res) return;
  if (!u || !u.netSalary || u.netSalary <= 0) { res.innerHTML = '<div class="rs-empty">Önce aylık net maaş girin.</div>'; return; }
  const inp = $('rsInput'); const raw = inp ? inp.value : '';
  if (raw === '' || raw === null || raw === undefined) { res.innerHTML = ''; return; }
  const val = safeNum(raw, NaN);
  if (!Number.isFinite(val)) { res.innerHTML = ''; return; }
  try {
    const curNet = safeNum(u.netSalary, 0);
    /* Seçili kazanç dönemini ve o dönemin gerçek bordro/puantaj etkisini kullan. */
    const _rsY = Number.isInteger(S.ey) ? S.ey : new Date().getFullYear();
    const _rsM = Number.isInteger(S.em) ? S.em : new Date().getMonth();
    /* [FIX P2] Ocak ayında kümülatif vergi matrahı sıfırlanır */
    const _priorYTD = (_rsM === 0) ? 0 : safeNum(getPayrollCheck(u, _rsY, _rsM).priorYTD, 0);
    const _rsCfg = payrollCfg(_rsY);
    const _rsHourBasis = getPayrollHourBasis(u, _rsY);
    const _rsNow = new Date();
    const _rsMD = getMD(_rsY, _rsM, (_rsY === _rsNow.getFullYear() && _rsM === _rsNow.getMonth()) ? { throughDay:_rsNow.getDate() } : undefined);
    const _rsEarn = calcEarningForMonth(_rsY, _rsM, curNet);
    const _paidRatio = curNet > 0 && _rsEarn ? Math.max(0, Math.min(1, safeNum(_rsEarn.basePay, 0) / curNet)) : 1;
    const _projectByNet = monthlyNet => {
      const fullGross = _bordroRound2(findGrossFromNet(monthlyNet, 'single', 0, _priorYTD, _rsM, undefined, _rsY));
      const baseGross = _bordroRound2(fullGross * _paidRatio);
      const hrGross = fullGross > 0 ? _bordroRound2(fullGross / getMonthlyHours(u)) : 0;
      const drGross = _bordroRound2(fullGross / 30);
      const compRate = getOTRate(u);
      const partialRate = _rsCfg.otPartialMultiplier;
      const otGross = (u.otCompMode || 'pay') === 'pay' ? _bordroRound2((_rsMD.oh || 0) * hrGross * compRate) : 0;
      const ot125Gross = (u.otCompMode || 'pay') === 'pay' ? _bordroRound2((_rsMD.oh125 || 0) * hrGross * partialRate) : 0;
      const holGross = _bordroRound2((_rsMD.hpd !== undefined ? _rsMD.hpd : _rsMD.hdw) * drGross);
      const unpaidGross = _bordroRound2(Math.max(0, _rsMD.ud || 0) * drGross);
      const weekendGross = _bordroRound2((_rsMD.weekendHours || 0) * hrGross * Math.max(0, (_rsCfg.weekendMultiplier || 1) - 1));
      const totalGross = _bordroRound2(Math.max(0, baseGross - unpaidGross) + otGross + ot125Gross + holGross + weekendGross);
      const calc = computeNetFromGross(totalGross, 'single', 0, _priorYTD, _rsM, undefined, _rsY);
      return { monthlyNet, fullGross, baseGross, totalGross, finalNet:calc.net, calc };
    };
    const _projectByGross = monthlyGross => {
      const fullGross = _bordroRound2(Math.max(0, safeNum(monthlyGross, 0)));
      const baseGross = _bordroRound2(fullGross * _paidRatio);
      const hrGross = fullGross > 0 ? _bordroRound2(fullGross / getMonthlyHours(u)) : 0;
      const drGross = _bordroRound2(fullGross / 30);
      const compRate = getOTRate(u);
      const partialRate = _rsCfg.otPartialMultiplier;
      const otGross = (u.otCompMode || 'pay') === 'pay' ? _bordroRound2((_rsMD.oh || 0) * hrGross * compRate) : 0;
      const ot125Gross = (u.otCompMode || 'pay') === 'pay' ? _bordroRound2((_rsMD.oh125 || 0) * hrGross * partialRate) : 0;
      const holGross = _bordroRound2((_rsMD.hpd !== undefined ? _rsMD.hpd : _rsMD.hdw) * drGross);
      const unpaidGross = _bordroRound2(Math.max(0, _rsMD.ud || 0) * drGross);
      const weekendGross = _bordroRound2((_rsMD.weekendHours || 0) * hrGross * Math.max(0, (_rsCfg.weekendMultiplier || 1) - 1));
      const totalGross = _bordroRound2(Math.max(0, baseGross - unpaidGross) + otGross + ot125Gross + holGross + weekendGross);
      const calc = computeNetFromGross(totalGross, 'single', 0, _priorYTD, _rsM, undefined, _rsY);
      return { monthlyNet:calc.net, fullGross, baseGross, totalGross, finalNet:calc.net, calc };
    };
    const curProjection = _projectByNet(curNet);
    const curGross = curProjection.fullGross;
    let newNet, newGross;
    if (_rsMode === 'pct') {
      newNet = curNet * (1 + val / 100);
      newGross = _projectByNet(newNet).fullGross;
    } else if (_rsMode === 'net') {
      newNet = val;
      newGross = _projectByNet(newNet).fullGross;
    } else {
      newGross = val;
      newNet = _projectByGross(newGross).finalNet;
    }
    const newProjection = _rsMode === 'gross' ? _projectByGross(newGross) : _projectByNet(newNet);
    const diffNet = newProjection.finalNet - curProjection.finalNet;
    const diffGross = newGross - curGross;
    const pctNet = curProjection.finalNet > 0 ? (diffNet / curProjection.finalNet * 100) : 0;
    const pctGross = curGross > 0 ? (diffGross / curGross * 100) : 0;
    const yearlyNet = diffNet * 12;
    res.innerHTML = `
      <div class="rs-grid">
        <div class="rs-cell"><div class="rs-l">Mevcut Net</div><div class="rs-v">${fm(curProjection.finalNet)}</div></div>
        <div class="rs-cell"><div class="rs-l">Yeni Net</div><div class="rs-v" style="color:var(--g)">${fm(newProjection.finalNet)}</div></div>
        <div class="rs-cell"><div class="rs-l">Mevcut Brüt</div><div class="rs-v">${fm(curGross)}</div></div>
        <div class="rs-cell"><div class="rs-l">Yeni Brüt</div><div class="rs-v" style="color:var(--g)">${fm(newGross)}</div></div>
      </div>
      <div class="rs-diff">
        <div class="rs-diff-row"><span>Net fark</span><b class="${diffNet>=0?'pos':'neg'}">${diffNet>=0?'+':''}${fm(diffNet)} <small>(%${pctNet.toFixed(1)})</small></b></div>
        <div class="rs-diff-row"><span>Brüt fark</span><b class="${diffGross>=0?'pos':'neg'}">${diffGross>=0?'+':''}${fm(diffGross)} <small>(%${pctGross.toFixed(1)})</small></b></div>
        <div class="rs-diff-row"><span>Yıllık net etki</span><b class="${yearlyNet>=0?'pos':'neg'}">${yearlyNet>=0?'+':''}${fm(yearlyNet)}</b></div>
      </div>
      ${Math.abs(pctNet - pctGross) > 0.5 ? `<div class="rs-note"><i class="fas fa-info-circle"></i> Vergi dilimi etkisi: net zam (%${pctNet.toFixed(1)}) brüt zamdan (%${pctGross.toFixed(1)}) ${pctNet<pctGross?'daha düşük':'daha yüksek'}.</div>` : ''}
      <div class="rs-note rs-assumption"><i class="fas fa-info-circle"></i> Varsayım: Seçili dönem (${MTR[_rsM]} ${_rsY}) puantajı, FM/tatil etkisi ve ${_priorYTD > 0 ? `YTD matrah ${fm(_priorYTD)}` : 'YTD=0'} kullanıldı. Bekâr, çocuksuz (2023 sonrası AGİ yok). Yıllık ortalama için vergi dilimi etkisi ay ay değişir.</div>
    `;
  } catch (err) {
    console.error('renderRaiseSim error:', err);
    res.innerHTML = '<div class="rs-empty">Hesaplama başarısız.</div>';
  }
}

function shareMonthReport() {
  const u = cu(); if (!u) return;
  const now = new Date();
  const md = getMD(S.cy, S.cm, (S.cy === now.getFullYear() && S.cm === now.getMonth()) ? { throughDay:now.getDate() } : undefined);
  const e = u.netSalary ? calcEarningForMonth(S.cy, S.cm, u.netSalary) : null;
  const avgDaily = md.wd > 0 ? (md.th / md.wd).toFixed(1) : '0';
  let text = `📊 ${u.name} — ${MTR[S.cm]} ${S.cy}\n`;
  text += `━━━━━━━━━━━━━━━\n`;
  text += `⏰ Toplam: ${md.th.toFixed(1)} saat (${md.wd} gün)\n`;
  text += `🔥 Fazla Mesai: ${md.oh.toFixed(1)} saat\n`;
  text += `📈 Günlük Ort: ${avgDaily} saat\n`;
  if (e) {
    text += `💰 Kazanç: ${fm(e.totalEarning)}\n`;
    if (e.overtimePay > 0) text += `   FM Eki: +${fm(e.overtimePay)}\n`;
    if (e.holidayPay > 0) text += `   Tatil Eki: +${fm(e.holidayPay)}\n`;
  }
  if (md.wr > 0 || md.mau > 0 || md.msd > 0) {
    text += `🏖 İzin: ${md.mau}g yıllık, ${md.wr}g hafta tatili, ${md.msd}g rapor\n`;
  }
  text += `━━━━━━━━━━━━━━━\n`;
  text += `ShiftTrack Pro`;

  /* [FEAT F4] Web Share API → clipboard fallback → textarea fallback */
  const title = `${MTR[S.cm]} ${S.cy} Raporu`;
  if (navigator.share) {
    navigator.share({ title, text }).then(
      () => toast('Rapor paylaşıldı', 'success'),
      err => {
        if (err && err.name === 'AbortError') return;
        _shareFallback(text);
      }
    );
  } else {
    _shareFallback(text);
  }
}

function _shareFallback(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      () => toast('Rapor panoya kopyalandı', 'success'),
      () => _shareLegacyCopy(text)
    );
  } else {
    _shareLegacyCopy(text);
  }
}
function _shareLegacyCopy(text) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    toast(ok ? 'Rapor panoya kopyalandı' : 'Paylaşım başarısız', ok ? 'success' : 'error');
  } catch (e) {
    console.error('share fallback error:', e);
    toast('Paylaşım başarısız', 'error');
  }
}

function showShortcuts() {
  const shortcuts = [
    ['Ctrl+Z', 'Geri al'],
    ['Escape', 'Modal/diyalog kapat'],
    ['← →', 'Ay değiştir (takvim/kazanç)'],
    ['T', 'Bugüne git (takvim)'],
    ['?', 'Kısayolları göster']
  ];
  let h = '<div style="padding:16px"><h3 style="font-size:16px;font-weight:800;margin-bottom:14px"><i class="fas fa-keyboard" style="color:var(--p);margin-right:6px"></i>Klavye Kısayolları</h3>';
  shortcuts.forEach(([key, desc]) => {
    h += `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--b1)">
      <span style="font-size:12px;color:var(--t2)">${escHtml(desc)}</span>
      <kbd style="padding:3px 8px;border-radius:6px;background:var(--bg3);border:1px solid var(--b1);font-size:11px;font-weight:700;font-family:monospace;color:var(--p)">${escHtml(key)}</kbd>
    </div>`;
  });
  h += '</div>';
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:2025;padding:16px';
  overlay.onclick = function(e) { if (e.target === this) this.remove(); };
  const box = document.createElement('div');
  box.style.cssText = 'background:var(--bg2);border-radius:var(--rad2);max-width:360px;width:100%;border:1px solid var(--b1);box-shadow:var(--sh3);animation:modalPop .3s cubic-bezier(.16,1,.3,1)';
  box.innerHTML = h;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

/* ============================================================
   TOUCH SWIPE
============================================================ */
function initSwipe() {
  let startX = 0, startY = 0, swiping = false;
  const content = document.querySelector('.content');
  if (!content) return;
  content.addEventListener('touchstart', function(e) {
    const t = e.touches[0];
    startX = t.clientX; startY = t.clientY; swiping = true;
  }, { passive: true });
  content.addEventListener('touchend', function(e) {
    if (!swiping) return; swiping = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX, dy = t.clientY - startY;
    if (Math.abs(dx) < 100 || Math.abs(dy) > Math.abs(dx) * 0.5) return;
    const pg = document.querySelector('.page.active'); if (!pg) return;
    if (pg.id === 'pg-calendar') { chgM(dx < 0 ? 1 : -1); }
    else if (pg.id === 'pg-earnings') { chgE(dx < 0 ? 1 : -1); }
  }, { passive: true });
}

/* ============================================================
   DAY-OF-WEEK STATS
============================================================ */
function getDayOfWeekStats() {
  const u = cu(); if (!u) return null;
  const days = [0,0,0,0,0,0,0];
  const hours = [0,0,0,0,0,0,0];
  const seenDays = new Set();
  getShiftPartRows(u).forEach(part => {
    const dt = dsToDate(part.ds);
    if (!dt || isNaN(dt.getTime())) return;
    let dow = dt.getDay(); dow = dow === 0 ? 6 : dow - 1;
    const h = Math.max(0, safeNum(part.hours, 0));
    if (h > 0) {
      if (!seenDays.has(part.ds)) { days[dow]++; seenDays.add(part.ds); }
      hours[dow] += h;
    }
  });
  return { days, hours };
}

/* ============================================================
   PIN SYSTEM
============================================================ */
let pinCallback = null, pinBuffer = '', pinAttempts = 0, pinLockUntil = 0;

function openPIN(title, subtitle, cb) {
  pinCallback = cb; pinBuffer = '';
  setTxt('pinTitle', title);
  setTxt('pinSubtitle', subtitle || '');
  updPinDots();
  const po = $('pinOverlay'); if (po) po.classList.add('show');
}

function pinInput(n) {
  if (pinBuffer.length >= 4) return;
  pinBuffer += String(n);
  updPinDots();
  if (pinBuffer.length === 4) {
    setTimeout(() => {
      const po = $('pinOverlay'); if (po) po.classList.remove('show');
      if (pinCallback) pinCallback(pinBuffer);
      pinCallback = null; pinBuffer = '';
    }, 200);
  }
}

function pinClear() { if (pinBuffer.length > 0) pinBuffer = pinBuffer.slice(0, -1); updPinDots(); }
function pinCancel() { const po = $('pinOverlay'); if (po) po.classList.remove('show'); pinCallback = null; pinBuffer = ''; }
function updPinDots() {
  const dots = $('pinDots'); if (!dots) return;
  const d = dots.children;
  for (let i = 0; i < Math.min(4, d.length); i++) { d[i].classList.toggle('filled', i < pinBuffer.length); }
}

async function hashPIN(pin) {
  const data = new TextEncoder().encode(pin + '_stpro_salt');
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function setupPIN() {
  openPIN('Yeni PIN Belirleyin', 'Hesabınızı koruyun', pin1 => {
    openPIN('PIN Tekrar', 'Doğrulama', async pin2 => {
      if (pin1 === pin2) {
        const u = cu(); if (u) { u.pin = await hashPIN(pin1); markSettingsUpdated(u); saveLS(); updPinStatus(); toast('PIN ayarlandı!', 'success'); }
      } else { toast('PIN eşleşmedi!', 'error'); }
    });
  });
}

function removePIN() {
  const u = cu(); if (!u || !u.pin) return;
  if (Date.now() < pinLockUntil) {
    const sec = Math.ceil((pinLockUntil - Date.now()) / 1000);
    toast(`Çok fazla hatalı deneme. ${sec}sn bekleyin.`, 'error'); return;
  }
  openPIN('Mevcut PIN', 'Kaldırmak için PIN girin', async pin => {
    const h = await hashPIN(pin);
    /* [FIX BUG-R2] Düz metin fallback kaldırıldı — yalnızca hash eşleşmesi */
    if (h === u.pin) { pinAttempts = 0; u.pin = null; markSettingsUpdated(u); saveLS(); updPinStatus(); toast('PIN kaldırıldı', 'info'); }
    else {
      pinAttempts++;
      if (pinAttempts >= 5) { pinLockUntil = Date.now() + 30000; pinAttempts = 0; toast('5 hatalı deneme! 30sn kilitlendi.', 'error'); }
      else { toast(`Yanlış PIN! (${5 - pinAttempts} hak kaldı)`, 'error'); }
    }
  });
}

function updPinStatus() {
  const u = cu(); if (!u) return;
  const st = $('pinStatus'), sb = $('pinSetBtn'), db = $('pinDelBtn');
  if (!st) return;
  if (u.pin) {
    st.innerHTML = '<i class="fas fa-check-circle" style="color:var(--g)"></i> PIN aktif';
    if (sb) sb.style.display = 'none';
    if (db) db.style.display = '';
  } else {
    st.innerHTML = '<i class="fas fa-shield-alt" style="color:var(--t3)"></i> PIN yok';
    if (sb) sb.style.display = '';
    if (db) db.style.display = 'none';
  }
}

/* ============================================================
   USER MANAGEMENT
============================================================ */
function addNewUser() {
  const nm = $('newUserName'); if (nm) nm.value = '';
  const m = $('newUserModal'); if (m) m.classList.add('show');
  setTimeout(() => { if (nm) nm.focus(); }, 200);
}
function closeNewUserModal() { const m = $('newUserModal'); if (m) m.classList.remove('show'); }
function confirmNewUser() {
  const nm = $('newUserName'); if (!nm) return;
  const name = (nm.value || '').trim();
  if (!name) { toast('İsim boş olamaz', 'error'); return; }
  const id = S.nextUid++;
  S.u[id] = mkUser(id);
  S.u[id].name = name;
  S.u[id].profileUpdatedAt = Date.now();
  S.u[id].settingsUpdatedAt = Date.now();
  saveLS();
  updLogin();
  closeNewUserModal();
  toast(`${escHtml(name)} eklendi`, 'success');
}

function deleteCurrentUser() {
  const u = cu(); if (!u) return;
  const userIds = Object.keys(S.u);
  if (userIds.length <= 1) { toast('Son kullanıcı silinemez', 'error'); return; }
  showConfirm('Hesabı Sil', `"${escHtml(u.name)}" hesabı ve tüm verileri silinecek!`, () => {
    if (!S.deletedUsers) S.deletedUsers = {};
    S.deletedUsers[String(S.cu)] = Date.now();
    delete S.u[S.cu];
    saveLS();
    logout();
    toast('Hesap silindi', 'info');
  });
}

/* ============================================================
   PDF EXPORT
============================================================ */
/* [FIX O-01] jsPDF helvetica fontu Türkçe karakterleri desteklemez.
   Bu yardımcı fonksiyon PDF'e yazılacak metni ASCII'ye dönüştürür. */
function pdfStr(s) {
  if (typeof s !== 'string') s = String(s == null ? '' : s);
  return s
    .replace(/İ/g,'I').replace(/Ş/g,'S').replace(/Ğ/g,'G')
    .replace(/Ü/g,'U').replace(/Ö/g,'O').replace(/Ç/g,'C')
    .replace(/ı/g,'i').replace(/ş/g,'s').replace(/ğ/g,'g')
    .replace(/ü/g,'u').replace(/ö/g,'o').replace(/ç/g,'c');
}
/* Dosya adı için ASCII-güvenli slug: Türkçe karakter + boşluk + özel karakterleri temizler. */
function fileSlug(s, fallback) {
  const out = pdfStr(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  return out || (fallback || 'kayit');
}
function exportPDF() {
  const u = cu(); if (!u) { toast('Giriş yapın', 'error'); return; }
  if (typeof window.jspdf === 'undefined') { toast('PDF kütüphanesi yüklenemedi', 'error'); return; }
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const mStr = MTR[S.cm] + ' ' + S.cy;
    let y = 15;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
    doc.text(pdfStr('ShiftTrack Pro - Vardiya Raporu'), 15, y); y += 8;
    doc.setFontSize(12); doc.setFont('helvetica', 'normal');
    doc.text(pdfStr(`${u.name} | ${mStr}`), 15, y); y += 10;

    doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    const cols = ['Tarih','Gun','Tur','Giris','Cikis','Net Saat'];
    const colW = [28, 22, 28, 20, 20, 22];
    let x = 15;
    doc.setFillColor(124, 58, 237); doc.setTextColor(255, 255, 255);
    doc.rect(15, y, 140, 7, 'F');
    cols.forEach((c, i) => { doc.text(c, x + 2, y + 5); x += colW[i]; });
    y += 9; doc.setFont('helvetica', 'normal'); doc.setTextColor(30, 30, 30);

    const dim = new Date(S.cy, S.cm + 1, 0).getDate();
    let totalHrs = 0;
    const workedDaySet = new Set();
    for (let d = 1; d <= dim; d++) {
      const ds = `${S.cy}-${String(S.cm+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const dt = new Date(S.cy, S.cm, d);
      let dow = dt.getDay(); dow = dow === 0 ? 6 : dow - 1;
      const dayName = DTR[dow];
      const parts = getShiftPartsForDate(u, ds);
      const lv = u.leaves[ds];
      if (parts.length) {
        parts.forEach(part => {
          x = 15;
          if (y > 270) { doc.addPage(); y = 15; }
          if (d % 2 === 0) { doc.setFillColor(245, 243, 255); doc.rect(15, y - 4, 140, 6, 'F'); }
          totalHrs += part.hours; workedDaySet.add(ds);
          doc.text(ds, x + 2, y); x += colW[0];
          doc.text(pdfStr(dayName), x + 2, y); x += colW[1];
          doc.text(part.sourceDs === ds ? 'Vardiya' : 'Devam', x + 2, y); x += colW[2];
          doc.text(part.startLabel, x + 2, y); x += colW[3];
          doc.text(part.endLabel, x + 2, y); x += colW[4];
          doc.text(part.hours.toFixed(1) + 's', x + 2, y);
          y += 6;
        });
      } else if (lv && lv.type) {
        x = 15;
        if (y > 270) { doc.addPage(); y = 15; }
        if (d % 2 === 0) { doc.setFillColor(245, 243, 255); doc.rect(15, y - 4, 140, 6, 'F'); }
        const tl = {annual:'Yillik',weekly:'Hafta T.',public_holiday:'R.Tatil',sick:'Rapor',unpaid:'Ucretsiz',ot_comp:'FM Izin'};
        doc.text(ds, x + 2, y); x += colW[0];
        doc.text(pdfStr(dayName), x + 2, y); x += colW[1];
        doc.text(tl[lv.type] || pdfStr(lv.type), x + 2, y);
        y += 6;
      } else if (isH(ds)) {
        x = 15;
        if (y > 270) { doc.addPage(); y = 15; }
        if (d % 2 === 0) { doc.setFillColor(245, 243, 255); doc.rect(15, y - 4, 140, 6, 'F'); }
        doc.text(ds, x + 2, y); x += colW[0];
        doc.text(pdfStr(dayName), x + 2, y); x += colW[1];
        doc.setTextColor(220, 38, 38); doc.text('R.Tatil', x + 2, y); doc.setTextColor(30, 30, 30);
        y += 6;
      } else { continue; }
    }

    y += 8;
    if (y > 260) { doc.addPage(); y = 15; }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.text(pdfStr(`Toplam: ${workedDaySet.size} gun, ${totalHrs.toFixed(1)} saat`), 15, y); y += 6;
    if (u.netSalary > 0) {
      const earn = calcEarningForMonth(S.cy, S.cm, u.netSalary);
      if (earn) doc.text(pdfStr(`Tahmini Kazanc: ${fm(earn.totalEarning)}`), 15, y);
    }

    doc.setFontSize(7); doc.setTextColor(150, 150, 150);
    doc.text(pdfStr(`ShiftTrack Pro | ${new Date().toLocaleString('tr-TR')}`), 15, 290);

    doc.save(`shifttrack_${fileSlug(u.name, 'calisan')}_${fileSlug(mStr)}.pdf`);
    toast('PDF indirildi!', 'success');
  } catch(e) { console.error(e); toast('PDF hatası: ' + e.message, 'error'); }
}

/* ============================================================
   DASHBOARD HEATMAP
============================================================ */
function renderDashWeekSummary() {
  const el = $('dashWeekSummary'); if (!el) return;
  const u = cu(); if (!u) { el.innerHTML = ''; return; }
  const now = new Date();
  const todayDow = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const monday = new Date(now); monday.setDate(now.getDate() - todayDow);
  let wkHrs = 0, wkDays = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday); d.setDate(monday.getDate() + i);
    const ds = dStr(d);
    const parts = getShiftPartsForDate(u, ds);
    const dayHours = parts.reduce((sum, part) => sum + Math.max(0, safeNum(part.hours, 0)), 0);
    if (dayHours > 0) { wkHrs += dayHours; wkDays++; }
  }
  if (wkDays === 0 && S.cy === now.getFullYear() && S.cm === now.getMonth()) {
    el.innerHTML = '';
    return;
  }
  if (S.cy !== now.getFullYear() || S.cm !== now.getMonth()) { el.innerHTML = ''; return; }
  const weeklyLimit = getWeeklyContractHours(u);
  const remaining = Math.max(0, weeklyLimit - wkHrs);
  const pct = Math.min(100, (wkHrs / weeklyLimit) * 100);
  const isOT = wkHrs > weeklyLimit;
  el.innerHTML = `<div class="card" style="margin-bottom:12px;padding:14px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <span style="font-size:12px;font-weight:800;color:#fff"><i class="fas fa-calendar-week" style="color:var(--p);margin-right:6px"></i>Bu Hafta</span>
      <span style="font-size:11px;font-weight:700;color:${isOT ? 'var(--acc)' : 'var(--t2)'}">${wkHrs.toFixed(1)}s / ${weeklyLimit}s ${isOT ? '(FM!)' : ''}</span>
    </div>
    <div class="goal-bar"><div class="goal-fill ${isOT ? 'gf-over' : pct > 80 ? 'gf-ok' : 'gf-warn'}" style="width:${pct}%">${pct.toFixed(0)}%</div></div>
    <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:10px;color:var(--t3)">
      <span>${wkDays} gün çalışıldı</span>
      <span>${isOT ? '+' + (wkHrs - weeklyLimit).toFixed(1) + 's eşik üstü' : remaining.toFixed(1) + 's kaldı'}</span>
    </div>
  </div>`;
}

function renderDashHeatmap() {
  const el = $('dashHeatmap'); if (!el) return;
  const u = cu(); if (!u) { el.innerHTML = ''; return; }
  const now = new Date();
  const y = S.cy, m = S.cm;
  const dim = new Date(y, m + 1, 0).getDate();
  const firstDow = new Date(y, m, 1).getDay();
  const offset = firstDow === 0 ? 6 : firstDow - 1;

  let h = '<div style="font-size:10px;font-weight:800;color:var(--t2);margin-bottom:6px"><i class="fas fa-th" style="color:var(--p);margin-right:4px"></i>Aylık Aktivite</div>';
  h += '<div style="display:flex;gap:2px;margin-bottom:3px;font-size:8px;color:var(--t3);font-weight:700">';
  DTR.forEach(d => { h += `<div style="flex:1;text-align:center">${d}</div>`; });
  h += '</div><div class="heatmap">';

  for (let i = 0; i < offset; i++) h += '<div class="hm-cell" style="visibility:hidden"></div>';
  for (let d = 1; d <= dim; d++) {
    const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const parts = getShiftPartsForDate(u, ds);
    const dayHours = parts.reduce((sum, part) => sum + Math.max(0, safeNum(part.hours, 0)), 0);
    const sh = u.shifts[ds], lv = u.leaves[ds];
    const isToday = d === now.getDate() && m === now.getMonth() && y === now.getFullYear();
    let cls = 'hm-cell';
    if (isToday) cls += ' hm-today';
    if (lv && lv.type) {
      cls += lv.type === 'sick' ? ' hm-holiday' : ' hm-leave';
    /* [FIX L-03] sh.end kontrolü eklendi — eksik bitiş saati yanlış sınıf vermiyecek */
    } else if (dayHours > 0) {
      cls += dayHours > 10 ? ' hm-4' : dayHours > 8 ? ' hm-3' : dayHours > 4 ? ' hm-2' : ' hm-1';
    } else if (isH(ds)) { cls += ' hm-holiday'; }
    else { cls += ' hm-0'; }
    h += `<div class="${cls}" title="${d} ${MTR[m]} - ${dayHours > 0 ? dayHours.toFixed(1)+'s' : lv ? 'İzin' : ''}"></div>`;
  }
  h += '</div>';
  h += '<div class="hm-legend"><span style="background:var(--bg3);opacity:.3"></span>Boş <span style="background:var(--p);opacity:.5"></span>Vardiya <span style="background:var(--s);opacity:.5"></span>İzin <span style="background:var(--r);opacity:.4"></span>Tatil</div>';
  el.innerHTML = h;
}

/* ============================================================
   DASHBOARD: TODAY WIDGET
============================================================ */
function renderDashTodayWidget() {
  const el = $('dashTodayWidget'); if (!el) return;
  const u = cu(); if (!u) { el.innerHTML = ''; return; }
  const now = new Date();
  if (S.cy !== now.getFullYear() || S.cm !== now.getMonth()) { el.innerHTML = ''; return; }
  const ds = dStr(now);
  const parts = getShiftPartsForDate(u, ds);
  const dayHours = parts.reduce((sum, part) => sum + Math.max(0, safeNum(part.hours, 0)), 0);
  const displayPart = parts[0] || null;
  const sh = u.shifts[ds], lv = u.leaves[ds];
  const hol = getH(ds);
  const dow = now.getDay();
  const dayName = DFL[dow === 0 ? 6 : dow - 1];

  // Yarının durumunu kontrol et
  const tmr = new Date(now); tmr.setDate(now.getDate() + 1);
  const tmrDs = dStr(tmr);
  const tmrSh = u.shifts[tmrDs], tmrLv = u.leaves[tmrDs];
  let tmrText = '';
  if (tmrSh && tmrSh.start && tmrSh.end) {
    tmrText = `Yarın: ${tmrSh.start}–${tmrSh.end}`;
  } else if (tmrLv && tmrLv.type) {
    const lb = {annual:'Y.İzin',weekly:'H.Tatil',public_holiday:'R.Tatil',sick:'Rapor',unpaid:'Ücretsiz'};
    tmrText = `Yarın: ${lb[tmrLv.type] || 'İzin'}`;
  } else { tmrText = 'Yarın: Plan yok'; }

  let icon, title, sub, badge;
  if (dayHours > 0 && displayPart) {
    const sType = getShiftType(displayPart.sh);
    icon = sType.icon;
    title = `${dayName} — ${displayPart.startLabel} → ${displayPart.endLabel}${displayPart.sourceDs !== ds ? ' (devam)' : ''}`;
    sub = `${dayHours.toFixed(1)} saat ${hol ? '(Tatil!)' : ''} · ${tmrText}`;
    badge = `${dayHours.toFixed(1)}s`;
  } else if (lv && lv.type) {
    const lb = {annual:'Yıllık İzin',weekly:'Hafta Tatili',public_holiday:'Resmi Tatil',sick:'Rapor',unpaid:'Ücretsiz İzin'};
    const ic = {annual:'🏖️',weekly:'🛋️',public_holiday:'🏛️',sick:'🏥',unpaid:'⛔'};
    icon = ic[lv.type] || '📋';
    title = `${dayName} — ${lb[lv.type] || 'İzin'}`;
    sub = tmrText;
    badge = lb[lv.type] || 'İzin';
  } else if (hol) {
    icon = '🏛️';
    title = `${dayName} — ${hol}`;
    sub = `Resmi tatil · ${tmrText}`;
    badge = 'Tatil';
  } else {
    icon = '📅';
    title = `${dayName} — Kayıt yok`;
    sub = tmrText;
    badge = 'Boş';
  }

  /* [FEAT F6] Bugün için vardiya yoksa hızlı ekle butonları göster */
  let quickAdd = '';
  if (!dayHours && !sh && !lv) {
    const ps = getAllPresets();
    const _names = { morning:'Sabah', afternoon:'Öğlen', evening:'Akşam' };
    const _icons = { morning:'🌅', afternoon:'🌇', evening:'🌙' };
    const btns = ['morning','afternoon','evening']
      .filter(k => ps[k])
      .map(k => `<button class="quick-add-btn" onclick="quickAddToday('${k}')" title="${ps[k].start}–${ps[k].end}"><span class="qa-ic">${_icons[k]}</span><span class="qa-lb">${_names[k]}</span><span class="qa-hr">${ps[k].start}–${ps[k].end}</span></button>`)
      .join('');
    quickAdd = `<div class="quick-add-row" data-ds="${ds}"><div class="qa-title"><i class="fas fa-bolt"></i>Bugünü hızlı ekle</div><div class="qa-btns">${btns}</div></div>`;
  }
  el.innerHTML = `<div class="dash-today">
    <div class="dt-icon">${icon}</div>
    <div class="dt-info"><div class="dt-title">${escHtml(title)}</div><div class="dt-sub">${escHtml(sub)}</div></div>
    <div class="dt-badge">${escHtml(badge)}</div>
  </div>${quickAdd}`;
}

/* [FEAT F6] Tek dokunuşla bugüne preset vardiya ekle */
function quickAddToday(presetKey) {
  const u = cu(); if (!u) return;
  const ps = getAllPresets();
  const p = ps[presetKey];
  if (!p || !p.start || !p.end) { toast('Preset bulunamadı', 'error'); return; }
  const check = validateShiftInput(p.start, p.end, safeInt(p.break, 0));
  if (!check.ok) { toast(check.msg, 'error'); return; }
  const ds = dStr(new Date());
  if (u.shifts[ds] || u.leaves[ds]) { toast('Bugün için kayıt zaten var', 'warning'); return; }
  pushUndo('Hızlı ekle');
  u.shifts[ds] = {
    start: p.start,
    end: p.end,
    break: check.breakMinutes,
    note: '',
    updatedAt: Date.now()
  };
  if (u.deletedShifts) delete u.deletedShifts[ds];
  invalidateMDCache(); saveLS(); renderActivePage();
  const hrs = check.netHours;
  toast(`Vardiya eklendi: ${p.start}–${p.end} (${hrs.toFixed(1)}s)`, 'success');
}

/* ============================================================
   DASHBOARD: MONTHLY PROGRESS BAR
============================================================ */
function renderDashProgressBar() {
  const el = $('dashProgressBar'); if (!el) return;
  const u = cu(); if (!u) { el.innerHTML = ''; return; }
  const now = new Date();
  const y = S.cy, m = S.cm;
  const dim = new Date(y, m + 1, 0).getDate();
  const isCurrent = y === now.getFullYear() && m === now.getMonth();
  const md = getMD(y, m, isCurrent ? { throughDay:now.getDate() } : undefined);
  const dayOfMonth = isCurrent ? now.getDate() : dim;
  const timePct = Math.min(100, (dayOfMonth / dim) * 100);

  // Toplam iş günü sayısı (hafta içi, tatil hariç)
  let totalWorkDays = 0;
  for (let d = 1; d <= dim; d++) {
    const dt = new Date(y, m, d);
    const dow = dt.getDay();
    const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    if (dow !== 0 && dow !== 6 && !isH(ds)) totalWorkDays++;
  }
  const workPct = totalWorkDays > 0 ? Math.min(100, (md.wd / totalWorkDays) * 100) : 0;
  const remainWork = Math.max(0, totalWorkDays - md.wd);
  const workColor = workPct >= timePct ? 'var(--g)' : workPct >= timePct * 0.7 ? 'var(--acc)' : 'var(--r)';

  el.innerHTML = `<div class="dash-progress">
    <div class="dp-row">
      <span class="dp-label"><i class="fas fa-calendar" style="color:var(--p);margin-right:3px"></i>Ay</span>
      <div class="dp-bar"><div class="dp-fill" style="width:${timePct}%;background:var(--p2)"></div></div>
      <span class="dp-val" style="color:var(--p)">${dayOfMonth}/${dim}g</span>
    </div>
    <div class="dp-row">
      <span class="dp-label"><i class="fas fa-briefcase" style="color:var(--g);margin-right:3px"></i>İş</span>
      <div class="dp-bar"><div class="dp-fill" style="width:${workPct}%;background:${workColor}"></div></div>
      <span class="dp-val" style="color:${workColor}">${md.wd}/${totalWorkDays}g</span>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--t3);margin-top:2px">
      <span>${remainWork} iş günü kaldı</span>
      <span>${md.th.toFixed(0)}s çalışıldı</span>
    </div>
  </div>`;
}

/* ============================================================
   DASHBOARD: FM TRACKER
============================================================ */
function renderDashFMTracker() {
  const el = $('dashFMTracker'); if (!el) return;
  const u = cu(); if (!u) { el.innerHTML = ''; return; }
  const now = new Date();
  const md = getMD(S.cy, S.cm, (S.cy === now.getFullYear() && S.cm === now.getMonth()) ? { throughDay:now.getDate() } : undefined);
  const e = u.netSalary ? calcEarningForMonth(S.cy, S.cm, u.netSalary) : null;
  const _mhFM = getMonthlyHours(u);
  const hr = (u.netSalary > 0 && _mhFM > 0) ? u.netSalary / _mhFM : 0;
  /* [FIX] 'leave' modunda FM ek ücreti ödenmez; bakiyeye eklenir */
  const compMode = u.otCompMode || 'pay';
  const fmEarn = compMode === 'leave' ? 0 : md.oh * hr * getOTRate(u);
  const holEarn = u.netSalary > 0 ? (md.hpd !== undefined ? md.hpd : md.hdw) * (u.netSalary / 30) : 0;
  const avgDaily = md.wd > 0 ? md.th / md.wd : 0;
  const fmPct = md.th > 0 ? (md.oh / md.th * 100) : 0;

  if (md.oh <= 0 && md.hh <= 0 && md.th <= 0) { el.innerHTML = ''; return; }

  const fmEkiLabel = compMode === 'leave'
    ? `<span style="color:var(--acc);font-size:10px">🏖️ Bakiyeye ekleniyor</span>`
    : (u.netSalary > 0 ? fm(fmEarn) : '—');

  el.innerHTML = `<div class="fm-tracker">
    <div class="fmt-head">
      <div class="fmt-title"><i class="fas fa-fire"></i>Aylık FM & Ek Ücret</div>
      <div class="fmt-total">${md.oh.toFixed(1)}s</div>
    </div>
    <div class="fmt-grid">
      <div class="fmt-item"><div class="fv" style="color:var(--acc)">${fmPct.toFixed(1)}%</div><div class="fl">FM Oranı</div></div>
      <div class="fmt-item"><div class="fv" style="color:var(--g)">${fmEkiLabel}</div><div class="fl">FM Eki</div></div>
      <div class="fmt-item"><div class="fv" style="color:var(--r)">${u.netSalary > 0 ? fm(holEarn) : '—'}</div><div class="fl">Tatil Eki</div></div>
    </div>
    <div style="margin-top:8px;display:flex;justify-content:space-between;font-size:10px;color:var(--t3)">
      <span>Günlük ort: ${avgDaily.toFixed(1)}s</span>
      <span>Tatil çalışma: ${((md.hpd !== undefined ? md.hpd : md.hdw) || 0).toFixed(1)}g · ${md.hh.toFixed(1)}s</span>
    </div>
  </div>`;
}

/* ============================================================
   [FIX] FM İZİN BAKİYESİ — getOTBalance & renderDashOTComp
============================================================ */

/**
 * FM İzin Bakiyesini hesaplar (saat cinsinden).
 * = Kullanıcının el ile ayarladığı başlangıç bakiyesi
 *   + 'leave' modunda geçmiş aylarda biriken FM saatleri
 *   - Kullanılan ot_comp izin günleri (her gün = 8 saat)
 */
function getOTBalance() {
  const u = cu(); if (!u) return 0;
  let bal = safeNum(u.otBalance, 0);
  const compRate = getOTRate(u);
  const today = new Date();
  /* 24-aylık pencere başlangıcı — FM ekleme ve ot_comp düşme aynı pencereyi kullanır */
  let windowStart = new Date(today.getFullYear(), today.getMonth() - 24, 1);
  const history = Array.isArray(u.otCompModeHistory) ? u.otCompModeHistory
    .map(x => ({ at:safeNum(x && x.at, 0), mode:(x && x.mode) === 'leave' ? 'leave' : 'pay' }))
    .filter(x => x.at > 0)
    .sort((a, b) => a.at - b.at) : [];
  const modeChangedAt = safeNum(u.otCompModeChangedAt, 0);
  if (!history.length && modeChangedAt > 0) {
    const modeStart = new Date(modeChangedAt);
    if (!isNaN(modeStart.getTime()) && modeStart > windowStart) windowStart = new Date(modeStart.getFullYear(), modeStart.getMonth(), 1);
  } else if (!history.length && u.otCompMode === 'leave') {
    windowStart = new Date(today.getFullYear(), today.getMonth(), 1);
  }
  const modeForMonth = (y, m) => {
    const monthEnd = new Date(y, m + 1, 0, 23, 59, 59, 999).getTime();
    if (!history.length) {
      if (u.otCompMode !== 'leave') return 'pay';
      return modeChangedAt > 0 && monthEnd >= modeChangedAt ? 'leave' : (modeChangedAt === 0 && y === today.getFullYear() && m === today.getMonth() ? 'leave' : 'pay');
    }
    let mode = 'pay';
    history.forEach(h => { if (h.at <= monthEnd) mode = h.mode; });
    return mode;
  };
  for (let i = 0; i <= 24; i++) {
    let y2 = today.getFullYear(), m2 = today.getMonth() - i;
    while (m2 < 0) { m2 += 12; y2--; }
    if (y2 < 2020) break;
    if (new Date(y2, m2 + 1, 0) < windowStart) continue;
    if (modeForMonth(y2, m2) !== 'leave') continue;
    const md2 = getMD(y2, m2, (y2 === today.getFullYear() && m2 === today.getMonth()) ? { throughDay:today.getDate() } : undefined);
    const partialRate = payrollCfg(y2).otPartialMultiplier;
    bal += (md2.oh    || 0) * compRate;
    /* [FIX P5] Sub-45 fazla sürelerle çalışma için 1h15 serbest zaman / 1h (4857/41) */
    bal += (md2.oh125 || 0) * partialRate;
  }
  /* [FIX Y-05] Yalnızca 24 aylık pencere içindeki ot_comp izinleri düş */
  Object.entries(u.leaves).forEach(([ds, l]) => {
    if (l && l.type === 'ot_comp') {
      const lDate = dsToDate(ds);
      const leaveHours = getOTCompLeaveHours(u, l);
      if (lDate >= windowStart) bal -= leaveHours;
    }
  });
  return Math.max(0, bal);
}

/** Ayarlar sayfasında FM bakiye etiketini güncelle */
function updOTBalanceDisplay() {
  const el = $('otBalanceDisplay'); if (!el) return;
  const u = cu(); if (!u || u.otCompMode !== 'leave') { el.innerHTML = ''; return; }
  const bal = getOTBalance();
  el.innerHTML = `<div class="otbal-badge"><i class="fas fa-coins" style="color:var(--acc)"></i>FM İzin Bakiyesi: <b>${bal.toFixed(1)} saat</b> (≈ ${(bal/8).toFixed(1)} gün)</div>`;
  // Leave modalindaki bakiye bilgisini güncelle
  const lb = $('ltOptOTCompBal');
  if (lb) lb.textContent = `${bal.toFixed(1)}s bakiye`;
}

/** Dashboard — FM İzin Bakiyesi kartı (yalnızca 'leave' modunda görünür) */
function renderDashOTComp() {
  const el = $('dashOTComp'); if (!el) return;
  const u = cu(); if (!u || u.otCompMode !== 'leave') { el.innerHTML = ''; return; }
  const bal = getOTBalance();
  const now = new Date();
  const md = getMD(S.cy, S.cm, (S.cy === now.getFullYear() && S.cm === now.getMonth()) ? { throughDay:now.getDate() } : undefined);
  el.innerHTML = `<div class="fm-tracker">
    <div class="fmt-head">
      <div class="fmt-title"><i class="fas fa-exchange-alt"></i>FM İzin Bakiyesi</div>
      <div class="fmt-total">${bal.toFixed(1)}s</div>
    </div>
    <div class="fmt-grid">
      <div class="fmt-item"><div class="fv" style="color:var(--acc)">${md.oh.toFixed(1)}s</div><div class="fl">Bu ay FM</div></div>
      <div class="fmt-item"><div class="fv" style="color:var(--g)">${(bal/8).toFixed(1)}g</div><div class="fl">Kullanılabilir</div></div>
      <div class="fmt-item"><div class="fv" style="color:var(--p)">${(md.otcm||0)}g</div><div class="fl">Bu ay kullanıldı</div></div>
    </div>
    <div style="margin-top:8px;font-size:10px;color:var(--t3)">Her FM izin günü bakiyeden 8 saat düşer. Maaş kesintisi uygulanmaz.</div>
  </div>`;
}

/* ============================================================
   [FIX] AKILLI VARDİYA ÖNERİLERİ — getSmartSuggestions
============================================================ */

/**
 * Boş günleri tarayarak yasal sınırlara (11s dinlenme, 45s/hafta)
 * uyan ve gelecekte olan günleri döner. { 'YYYY-MM-DD': true }
 * Referans vardiya: sabah 08:00–16:00 (7.5 net saat)
 */
function getSmartSuggestions(y, m) {
  const u = cu();
  if (!u || u.hideSuggestions) return {};
  const today = new Date(); today.setHours(0,0,0,0);
  const dim = new Date(y, m+1, 0).getDate();
  const CANDIDATE_START = 8 * 60;   // 08:00 = 480 dk
  const CANDIDATE_END   = 16 * 60;  // 16:00 = 960 dk
  const CANDIDATE_HRS   = 7.5;      // Net saat (30dk mola)
  const REST_MIN        = 11 * 60;  // 660 dk
  const weeklyLimit     = getWeeklyContractHours(u);

  // Haftalık saat toplamlarını hesapla
  const weekHrs = {};
  getShiftPartRows(u).forEach(part => {
    const wk2 = part.wk || getISOWeek(dsToDate(part.ds));
    weekHrs[wk2] = (weekHrs[wk2] || 0) + Math.max(0, safeNum(part.hours, 0));
  });

  const result = {};
  for (let d2 = 1; d2 <= dim; d2++) {
    const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d2).padStart(2,'0')}`;
    if (u.shifts[ds] || u.leaves[ds]) continue;    // Zaten dolu
    const dt = new Date(y, m, d2); dt.setHours(0,0,0,0);
    if (dt <= today) continue;                      // Geçmiş gün
    const dow = dt.getDay();
    if (dow === 0 || dow === 6 || isH(ds)) continue; // Hafta sonu / tatil

    // 45s/hafta sınırı
    const wk = getISOWeek(dt);
    if ((weekHrs[wk] || 0) + CANDIDATE_HRS > weeklyLimit) continue;

    // 11s dinlenme — önceki gün
    const prevDs = dStr(new Date(y, m, d2 - 1));
    const prevPart = prevDs ? getShiftPartsForDate(u, prevDs).slice(-1)[0] : null;
    const prevSh = prevPart ? prevPart.sh : (prevDs ? u.shifts[prevDs] : null);
    if (prevSh && prevSh.end) {
      let prevEndMins = parseTime(prevSh.end);
      if (prevEndMins === null) continue;
      if (prevEndMins === 0) prevEndMins = 1440; // 00:00 → 24:00
      // Dinlenme = (bir sonraki günün 08:00) - önceki vardiya bitişi
      const restMins = (1440 - prevEndMins) + CANDIDATE_START;
      if (restMins < REST_MIN) continue;
    }

    // 11s dinlenme — sonraki güne etkisi
    const nextDs = dStr(new Date(y, m, d2 + 1));
    const nextPart = nextDs ? getShiftPartsForDate(u, nextDs)[0] : null;
    const nextSh = nextPart ? nextPart.sh : (nextDs ? u.shifts[nextDs] : null);
    if (nextSh && nextSh.start) {
      const nextStartMins = parseTime(nextSh.start);
      if (nextStartMins === null) continue;
      const restMins = (1440 - CANDIDATE_END) + nextStartMins;
      if (restMins < REST_MIN) continue;
    }

    result[ds] = true;
  }
  return result;
}

/* ============================================================
   [FIX] AI RAPOR ÖZETİ — generateReportSummary & renderDashAISummary
============================================================ */

/**
 * Aylık veriyi kural tabanlı metne döker.
 * Parametre: u=kullanıcı, md=getMD(), earn=calcEarningForMonth()
 * Dönüş: [{icon, text, type}] dizisi
 */
function generateReportSummary(u, md, earn, year = S.cy) {
  const msgs = [];
  if (!md || md.th <= 0) return msgs;

  // ⚠️ Yüksek yorgunluk riski
  if (md.oh > md.th * 0.2) {
    msgs.push({ icon:'⚠️', text:'Yüksek yorgunluk riski. Bu ayki FM saatiniz toplam çalışmanın %20\'sini aştı.', type:'warn' });
  }

  // 💰 Vergi dilimi geçiş riski
  if (earn && earn.totalEarning > 0 && earn.basePay > 0 && earn.totalEarning > earn.basePay * 1.15) {
    msgs.push({ icon:'💰', text:'Vergi dilimi geçiş riski. Toplam kazanç baz maaşın %15 üzerine çıktı, muhasebecine danışmanı öneriyoruz.', type:'warn' });
  }

  // 🔥 Uzun seri uyarısı
  const streak = getStreak();
  if (streak > 7) {
    msgs.push({ icon:'🔥', text:`${streak} günlük kesintisiz seri! Dinlenmeyi ihmal etme, uzun seriler performansı düşürebilir.`, type:'warn' });
  }

  // ✅ Pozitif mesajlar
  if (md.wd > 0 && md.oh === 0) {
    msgs.push({ icon:'✅', text:'Bu ay fazla mesai yok. Dengeli çalışma ritmin için tebrikler!', type:'ok' });
  }
  if (md.wd >= 20 && md.oh === 0) {
    msgs.push({ icon:'🏅', text:'Tam aylık devam ve FM yok — mükemmel iş-yaşam dengesi!', type:'ok' });
  }
  if (earn && earn.totalEarning > 0 && earn.absentDays === 0 && !earn.isCurrentMonth) {
    msgs.push({ icon:'🎯', text:'Tam ay çalışma! Hiç eksik gün yok.', type:'ok' });
  }
  if (streak >= 5 && streak <= 7) {
    msgs.push({ icon:'💪', text:`${streak} günlük aktif seri — harika bir tempo!`, type:'ok' });
  }

  // ⚠️ Yıllık 270 saat FM sınırı (İş Kanunu Madde 41 + Fazla Çalışma Yönetmeliği Md.5)
  const _now41 = new Date();
  const _curY41 = year;
  const _maxMonth41 = year === _now41.getFullYear() ? _now41.getMonth() : 11;
  let _yearlyOT = 0;
  for (let _mi = 0; _mi <= _maxMonth41; _mi++) {
    _yearlyOT += getMD(_curY41, _mi).oh;
  }
  if (_yearlyOT >= 270) {
    msgs.push({ icon:'🚨', text:`Yıllık FM sınırına ulaşıldı! ${_yearlyOT.toFixed(1)}s / 270s — İş Kanunu Md.41 gereği yıllık fazla mesai 270 saati aşamaz.`, type:'warn' });
  } else if (_yearlyOT >= 240) {
    msgs.push({ icon:'⚠️', text:`Yıllık FM sınırına yaklaşılıyor: ${_yearlyOT.toFixed(1)}s / 270s (Md.41 — yıllık limit 270s).`, type:'warn' });
  }

  // Veri yoksa genel mesaj
  if (msgs.length === 0) {
    msgs.push({ icon:'📊', text:'Henüz değerlendirme için yeterli veri yok. Vardiya eklemeye devam et!', type:'info' });
  }
  return msgs;
}

/** Dashboard — AI Rapor Özeti kartı */
function renderDashAISummary() {
  const el = $('dashAISummary'); if (!el) return;
  const u = cu(); if (!u) { el.innerHTML = ''; return; }
  const now = new Date();
  const md = getMD(S.cy, S.cm, (S.cy === now.getFullYear() && S.cm === now.getMonth()) ? { throughDay:now.getDate() } : undefined);
  if (md.th <= 0 && md.wd <= 0) { el.innerHTML = ''; return; }
  const earn = u.netSalary ? calcEarningForMonth(S.cy, S.cm, u.netSalary) : null;
  const msgs = generateReportSummary(u, md, earn, S.cy);
  if (!msgs.length) { el.innerHTML = ''; return; }
  const items = msgs.map(msg => `<div class="ais-item">${msg.icon} <span>${escHtml(msg.text)}</span></div>`).join('');
  el.innerHTML = `<div class="ai-sum-card">
    <div class="ais-head"><i class="fas fa-robot" style="color:var(--acc)"></i>AI Rapor Özeti</div>
    ${items}
  </div>`;
}

/** Dashboard — Yıllık Kümülatif Kazanç widget'ı */
function renderDashYearlyCumul() {
  const el = $('dashYearlyCumul'); if (!el) return;
  const u = cu(); if (!u || !u.netSalary) { el.innerHTML = ''; return; }
  const today = new Date();
  const curY = today.getFullYear(), curM = today.getMonth();
  /* Sadece görüntülenen yıl mevcut yıl ise göster */
  if (S.cy !== curY) { el.innerHTML = ''; return; }

  let cumul = 0, maxVal = 0;
  const months = [];
  for (let mi = 0; mi <= curM; mi++) {
    const me = calcEarningForMonth(curY, mi, u.netSalary);
    const mEarn = (me && !me.isFutureMonth) ? me.totalEarning : 0;
    cumul += mEarn;
    months.push({ label: MTR[mi].substring(0, 3), earn: mEarn, cumul, isCur: mi === curM });
    if (mEarn > maxVal) maxVal = mEarn;
  }
  if (cumul === 0) { el.innerHTML = ''; return; }

  const avg = months.filter(m => m.earn > 0).length > 0
    ? cumul / months.filter(m => m.earn > 0).length : 0;
  const remaining = 12 - (curM + 1);
  const projected = cumul + avg * remaining;
  const progPct = Math.round(((curM + 1) / 12) * 100);

  let bars = '';
  months.forEach(mo => {
    const h = maxVal > 0 ? Math.max(4, (mo.earn / maxVal * 100)) : 4;
    const bg = mo.isCur ? 'var(--pg)' : mo.earn > 0 ? 'var(--p4)' : 'var(--bg3)';
    bars += `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;flex:1;min-width:0" title="${mo.label}: ${fm(mo.earn)}">
      <div style="width:100%;height:${h}px;background:${bg};border-radius:3px 3px 0 0;border:1px solid var(--b1)"></div>
      <span style="font-size:8px;color:var(--t3);font-weight:600">${mo.label}</span>
    </div>`;
  });

  el.innerHTML = `<div class="card" style="margin-bottom:12px">
    <div class="card-head">
      <h3><i class="fas fa-chart-line" style="color:var(--g)"></i>Yıllık Kazanç (${curY})</h3>
      <span style="font-size:10px;color:var(--t3)">${MTR[0].substring(0,3)}–${MTR[curM].substring(0,3)}</span>
    </div>
    <div style="display:flex;gap:12px;margin-bottom:10px;flex-wrap:wrap">
      <div><div style="font-size:18px;font-weight:900;color:var(--g)">${fm(cumul)}</div><div style="font-size:10px;color:var(--t3)">${curM+1} ay toplam</div></div>
      <div><div style="font-size:14px;font-weight:800;color:var(--p3)">${fm(avg)}</div><div style="font-size:10px;color:var(--t3)">aylık ortalama</div></div>
      ${remaining > 0 ? `<div><div style="font-size:12px;font-weight:700;color:var(--t2)">~${fm(projected)}</div><div style="font-size:10px;color:var(--t3)">yıl sonu tahmini</div></div>` : ''}
    </div>
    <div style="display:flex;align-items:flex-end;gap:2px;height:48px;margin-bottom:6px">${bars}</div>
    <div style="background:var(--bg2);border-radius:4px;height:6px;overflow:hidden">
      <div style="height:100%;width:${progPct}%;background:var(--pg);border-radius:4px;transition:width .4s"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:10px;color:var(--t3)">
      <span>Yılın %${progPct}'i geçti</span>
      <span>${remaining > 0 ? remaining + ' ay kaldı' : 'Yıl tamamlandı'}</span>
    </div>
  </div>`;
}

/* ============================================================
   DASHBOARD: LAST 7 DAYS
============================================================ */
function renderDashLast7Days() {
  const el = $('dashLast7Days'); if (!el) return;
  const u = cu(); if (!u) { el.innerHTML = ''; return; }
  const now = new Date();
  if (S.cy !== now.getFullYear() || S.cm !== now.getMonth()) { el.innerHTML = ''; return; }

  let h = '';
  let totalH = 0, totalD = 0;
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    const ds = dStr(d);
    const parts = getShiftPartsForDate(u, ds);
    const dayHours = parts.reduce((sum, part) => sum + Math.max(0, safeNum(part.hours, 0)), 0);
    const sh = u.shifts[ds], lv = u.leaves[ds];
    const hol = isH(ds);
    const isToday = i === 0;
    const dow = d.getDay();
    const dayName = DTR[dow === 0 ? 6 : dow - 1];
    let cls = 'l7-day';
    let content = '';

    if (isToday) cls += ' l7-today';

    if (dayHours > 0) {
      cls += ' l7-worked';
      content = `<div class="l7-hrs">${dayHours.toFixed(1)}s</div>`;
      totalH += dayHours; totalD++;
    } else if (lv && lv.type) {
      cls += ' l7-leave';
      const ic = {annual:'🏖️',weekly:'🛋️',public_holiday:'🏛️',sick:'🏥',unpaid:'⛔'};
      content = `<div class="l7-ico">${ic[lv.type] || '📋'}</div>`;
    } else if (hol) {
      cls += ' l7-holiday';
      content = `<div class="l7-ico">🏛️</div>`;
    } else {
      content = `<div class="l7-ico" style="opacity:.2">·</div>`;
    }

    h += `<div class="${cls}"><div class="l7-dn">${dayName}</div><div class="l7-num">${d.getDate()}</div>${content}</div>`;
  }

  el.innerHTML = `<div class="last7">
    <div class="l7-title"><i class="fas fa-history"></i>Son 7 Gün <span style="margin-left:auto;color:var(--t3);font-weight:600">${totalD}g · ${totalH.toFixed(1)}s</span></div>
    <div class="l7-grid">${h}</div>
  </div>`;
}

/* ============================================================
   GOAL TRACKING
============================================================ */
function renderGoals() {
  const el = $('dashGoal'); if (!el) return;
  const u = cu(); if (!u) { el.innerHTML = ''; return; }
  if (!u.goalHours && !u.goalEarning) { el.innerHTML = ''; return; }

  const now = new Date();
  const md = getMD(S.cy, S.cm, (S.cy === now.getFullYear() && S.cm === now.getMonth()) ? { throughDay:now.getDate() } : undefined);
  const earn = calcEarningForMonth(S.cy, S.cm, u.netSalary);
  const totalHrs = md.th;
  const totalEarning = earn ? earn.totalEarning : 0;
  let h = '<div class="card" style="margin-bottom:12px"><div class="card-head"><h3><i class="fas fa-bullseye"></i>Hedefler</h3><span style="font-size:10px;color:var(--t3)">' + MTR[S.cm] + '</span></div>';

  if (u.goalHours > 0) {
    const pct = Math.min(150, (totalHrs / u.goalHours) * 100);
    const cls = pct > 110 ? 'gf-over' : pct > 80 ? 'gf-ok' : 'gf-warn';
    h += `<div style="margin-bottom:10px"><div style="font-size:11px;font-weight:700;color:var(--t2);margin-bottom:4px"><i class="fas fa-clock" style="color:var(--p);margin-right:4px"></i>Saat Hedefi</div>`;
    h += `<div class="goal-bar"><div class="goal-fill ${cls}" style="width:${Math.min(100, pct)}%">${pct.toFixed(0)}%</div></div>`;
    h += `<div class="goal-info"><span>${totalHrs.toFixed(1)}s / ${u.goalHours}s</span><span>${pct >= 100 ? 'Hedefe ulaşıldı!' : (u.goalHours - totalHrs).toFixed(1) + 's kaldı'}</span></div></div>`;
  }

  if (u.goalEarning > 0 && u.netSalary > 0) {
    const pct = Math.min(150, (totalEarning / u.goalEarning) * 100);
    const cls = pct > 110 ? 'gf-over' : pct > 80 ? 'gf-ok' : 'gf-warn';
    h += `<div><div style="font-size:11px;font-weight:700;color:var(--t2);margin-bottom:4px"><i class="fas fa-lira-sign" style="color:var(--g);margin-right:4px"></i>Kazanç Hedefi</div>`;
    h += `<div class="goal-bar"><div class="goal-fill ${cls}" style="width:${Math.min(100, pct)}%">${pct.toFixed(0)}%</div></div>`;
    h += `<div class="goal-info"><span>${fm(totalEarning)} / ${fm(u.goalEarning)}</span><span>${pct >= 100 ? 'Hedefe ulaşıldı!' : fm(u.goalEarning - totalEarning) + ' kaldı'}</span></div></div>`;
  }

  h += '</div>';
  el.innerHTML = h;
}

/* ============================================================
   REST TIME VALIDATION (11-HOUR RULE)
============================================================ */
function checkRestTime(ds, startTime) {
  const u = cu(); if (!u) return null;
  const d = dsToDate(ds);
  const prev = new Date(d); prev.setDate(prev.getDate() - 1);
  const prevDs = dStr(prev);
  const prevShift = u.shifts[prevDs];
  if (!prevShift || !prevShift.end || !prevShift.start) return null;

  const prevEndMin = parseTime(prevShift.end);
  const prevStartMin = parseTime(prevShift.start);
  const curStartMin = parseTime(startTime);
  if (prevEndMin === null || curStartMin === null || prevStartMin === null) return null;

  // Gece vardiyası tespiti: bitiş < giriş → ertesi güne taşıyor
  let restMinutes;
  if (prevEndMin < prevStartMin) {
    // Gece vardiyası — bitiş saati bugüne taşıyor (ör: 22:00-06:00)
    // Gerçek bitiş bugün prevEndMin'de, bugün başlama curStartMin'de
    restMinutes = curStartMin < prevEndMin ? 0 : curStartMin - prevEndMin;
  } else {
    // Normal vardiya — bitiş dün, başlama bugün
    restMinutes = (1440 - prevEndMin) + curStartMin;
  }

  if (restMinutes < 0) restMinutes += 1440;
  const restHours = restMinutes / 60;
  if (restHours < MIN_REST_HOURS) {
    return { restHours: restHours.toFixed(1), required: MIN_REST_HOURS, prevEnd: prevShift.end, prevDate: prevDs };
  }
  return null;
}

function checkHolidayWork(ds) {
  if (!isH(ds)) return false;
  return true;
}

/* ============================================================
   DRAG & DROP
============================================================ */
let dragData = null;
let wasDragging = false;

function initDragDrop() {
  const cg = $('calGrid'); if (!cg) return;
  cg.addEventListener('dragstart', function(e) {
    const cell = e.target.closest('.cal-cell');
    if (!cell || cell.classList.contains('out')) return;
    const ds = cell.dataset.date; if (!ds) return;
    const u = cu(); if (!u || !u.shifts[ds]) { e.preventDefault(); return; }
    dragData = { date: ds, shift: JSON.parse(JSON.stringify(u.shifts[ds])) };
    wasDragging = true;
    cell.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ds);
  });
  cg.addEventListener('dragover', function(e) {
    e.preventDefault();
    const cell = e.target.closest('.cal-cell');
    if (cell && !cell.classList.contains('out')) {
      e.dataTransfer.dropEffect = 'move';
      cell.classList.add('drag-over');
    }
  });
  cg.addEventListener('dragleave', function(e) {
    const cell = e.target.closest('.cal-cell');
    if (cell) cell.classList.remove('drag-over');
  });
  cg.addEventListener('drop', function(e) {
    e.preventDefault();
    document.querySelectorAll('.drag-over').forEach(c => c.classList.remove('drag-over'));
    if (!dragData) return;
    /* [FIX ERR-HANDLE-07] Sürüklenen vardiyanın bütünlüğünü drop anında yeniden doğrula */
    if (!dragData.shift || typeof dragData.shift !== 'object' || !dragData.shift.start || !dragData.shift.end) {
      dragData = null; return;
    }
    const cell = e.target.closest('.cal-cell');
    if (!cell || cell.classList.contains('out')) return;
    const targetDs = cell.dataset.date; if (!targetDs || targetDs === dragData.date) return;
    if (!parseDS(targetDs)) { dragData = null; return; }
    const u = cu(); if (!u) return;
    const sourceDs = dragData.date;
    const movedShift = normalizeShiftRecord(dragData.shift);
    if (!movedShift) { toast('Sürüklenen vardiya geçersiz', 'error'); dragData = null; return; }
    const applyMove = () => {
      pushUndo('Sürükle bırak');
      const nowTs = Date.now();
      if (!u.deletedShifts) u.deletedShifts = {};
      if (!u.deletedLeaves) u.deletedLeaves = {};
      if (u.shifts[targetDs]) u.deletedShifts[targetDs] = nowTs;
      if (u.leaves[targetDs]) {
        u.deletedLeaves[targetDs] = nowTs;
        delete u.leaves[targetDs];
      }
      u.shifts[targetDs] = Object.assign({}, movedShift, { updatedAt: nowTs });
      u.deletedShifts[sourceDs] = nowTs;
      delete u.shifts[sourceDs];
      invalidateMDCache(); saveLS(); renderCal();
      toast(`Vardiya ${sourceDs} → ${targetDs}`, 'success');
      dragData = null;
    };
    if (u.shifts[targetDs] || u.leaves[targetDs]) {
      showConfirm('Hedef gün dolu', 'Bu güne ait mevcut kayıt silinip vardiya taşınsın mı?', applyMove);
    } else {
      applyMove();
    }
  });
  cg.addEventListener('dragend', function() {
    wasDragging = false; // [FIX JS-ÇAKIŞMA-01] dragend'de sıfırla — sonraki click'in yutulmasını önler
    document.querySelectorAll('.dragging').forEach(c => c.classList.remove('dragging'));
    document.querySelectorAll('.drag-over').forEach(c => c.classList.remove('drag-over'));
    dragData = null;
  });
}

/* ============================================================
   QR CODE DATA SYNC
============================================================ */
function openQR() {
  const qr = $('qrOverlay'); if (!qr) return;
  qr.classList.add('show');
  generateQR();
}
function closeQR() { const qr = $('qrOverlay'); if (qr) qr.classList.remove('show'); }
function qrMode(mode, btn) {
  btn.parentElement.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const exp = $('qrExportPane'), imp = $('qrImportPane');
  if (exp) exp.style.display = mode === 'export' ? '' : 'none';
  if (imp) imp.style.display = mode === 'import' ? '' : 'none';
  if (mode === 'export') generateQR();
}

function generateQR() {
  const el = $('qrCode'); if (!el) return;
  el.innerHTML = '';
  try {
    const data = JSON.stringify({ users: S.u, version: DATA_VERSION, nextUid: S.nextUid });
    const compressed = btoa(encodeURIComponent(data));
    if (compressed.length > 2900) {
      el.innerHTML = '<p style="font-size:11px;color:var(--acc)"><i class="fas fa-exclamation-triangle" style="margin-right:4px"></i> Veri QR kod için çok büyük (' + Math.round(compressed.length/1024) + ' KB). Aşağıdaki "Linki Kopyala" butonunu kullanın.</p>';
      return;
    }
    if (typeof QRCode !== 'undefined') {
      new QRCode(el, { text: compressed, width: 200, height: 200, colorDark: '#1a1625', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.L });
    }
  } catch(e) { el.innerHTML = '<p style="color:var(--r);font-size:11px">QR oluşturulamadı</p>'; }
}

function copyShareLink() {
  try {
    const data = JSON.stringify({ users: S.u, version: DATA_VERSION, nextUid: S.nextUid });
    const encoded = btoa(encodeURIComponent(data));
    navigator.clipboard.writeText(encoded).then(() => toast('Veri kopyalandı!', 'success')).catch(() => {
      const ta = document.createElement('textarea'); ta.value = encoded;
      document.body.appendChild(ta); ta.select(); document.execCommand('copy');
      document.body.removeChild(ta); toast('Kopyalandı!', 'success');
    });
  } catch(e) { toast('Kopyalama hatası', 'error'); }
}

function importFromQR() {
  const el = $('qrImportData'); if (!el) return;
  const raw = el.value.trim();
  if (!raw) { toast('Veri girin', 'error'); return; }
  if (raw.length > 250000) { toast('QR/import verisi çok büyük', 'error'); return; }
  try {
    const decoded = decodeURIComponent(atob(raw));
    /* [FIX ERR-HANDLE-17] safeParse ile JSON dışı içeriği ve null'u kırılmadan ele al */
    const p = safeParse(decoded, null);
    if (!p || typeof p !== 'object' || !p.users || typeof p.users !== 'object') {
      toast('Geçersiz veri', 'error'); return;
    }
    showConfirm('Veri İçe Aktar', 'Mevcut veriler üzerine yazılacak. Devam?', () => {
      if (p.nextUid) S.nextUid = safeInt(p.nextUid, S.nextUid);
      Object.keys(p.users).forEach(k => {
        const i = parseInt(k);
        if (!Number.isFinite(i)) return;
        const user = normalizeImportedUser(i, p.users[k], { keepDocUrls:false });
        if (user) S.u[i] = user;
      });
      invalidateMDCache(); saveLS();
      if (cu()) { applyTheme(cu().theme || 'default'); renderAll(); updTop(); }
      closeQR();
      toast('Veriler içe aktarıldı!', 'success');
    });
  } catch(e) {
    console.error('importFromQR error:', e);
    toast('Geçersiz format', 'error');
  }
}

/* ============================================================
   NOTIFICATIONS
============================================================ */
let notifications = [];

function scheduleNotifications() {
  notifications = [];
  const u = cu(); if (!u) return;
  const now = new Date();
  const todayDs = dStr(now);
  const tmrw = new Date(now); tmrw.setDate(tmrw.getDate() + 1);
  const tmrwDs = dStr(tmrw);

  // Check tomorrow's shift
  if (u.shifts[tmrwDs]) {
    const sh = u.shifts[tmrwDs];
    if (sh.start && sh.end) notifications.push({ icon: 'fa-clock', text: `Yarın vardiya: ${sh.start} - ${sh.end}`, type: 'info' });
  }

  // Check rest time
  if (u.shifts[todayDs] && u.shifts[tmrwDs] && u.shifts[tmrwDs].start) {
    const rest = checkRestTime(tmrwDs, u.shifts[tmrwDs].start);
    if (rest) {
      notifications.push({ icon: 'fa-exclamation-triangle', text: `Dikkat: Dinlenme süresi ${rest.restHours}s (min ${rest.required}s)`, type: 'warning' });
    }
  }

  // Holiday work warnings
  if (u.shifts[todayDs] && isH(todayDs)) {
    notifications.push({ icon: 'fa-star', text: 'Bugün resmi tatilde çalıştınız', type: 'warning' });
  }

  // Goal progress
  const md = getMD(S.cy, S.cm, (S.cy === now.getFullYear() && S.cm === now.getMonth()) ? { throughDay:now.getDate() } : undefined);
  if (u.goalHours > 0) {
    const pct = (md.th / u.goalHours) * 100;
    if (pct >= 100) notifications.push({ icon: 'fa-trophy', text: 'Saat hedefine ulaştınız!', type: 'success' });
    else if (pct >= 80) notifications.push({ icon: 'fa-fire', text: `Saat hedefine %${(100 - pct).toFixed(0)} kaldı!`, type: 'info' });
  }

  // Annual leave reminder — sadece bu yılın izinlerini say
  const currentYear = now.getFullYear();
  const usedLeave = Object.entries(u.leaves).filter(([k, l]) => {
    if (!l || l.type !== 'annual') return false;
    const p = parseDS(k);
    return p && p.y === currentYear;
  }).length;
  const remaining = annualLeaveTotal(u) - usedLeave;
  if (remaining <= 3 && remaining > 0) {
    notifications.push({ icon: 'fa-umbrella-beach', text: `Yıllık izin: ${remaining} gün kaldı`, type: 'warning' });
  }

  // Update badge
  const badge = $('notifBadge');
  if (badge) badge.style.display = notifications.length > 0 ? '' : 'none';

  // Native push notification — yarın vardiya hatırlatması
  if ('Notification' in window && Notification.permission === 'granted') {
    schedulePushReminder();
  }
}

function requestNotifPermission() {
  if (!('Notification' in window)) { toast('Tarayıcı bildirimleri desteklemiyor', 'error'); return; }
  Notification.requestPermission().then(perm => {
    if (perm === 'granted') toast('Bildirimler açıldı!', 'success');
    else toast('Bildirimler reddedildi', 'error');
  });
}

let pushReminderTimer = null;
function schedulePushReminder() {
  if (pushReminderTimer) clearTimeout(pushReminderTimer);
  const u = cu(); if (!u) return;
  const now = new Date();
  const tmrw = new Date(now); tmrw.setDate(tmrw.getDate() + 1);
  const tmrwDs = dStr(tmrw);
  const sh = u.shifts[tmrwDs];
  if (!sh || !sh.start) return;
  // Akşam 20:00'de hatırlat
  const remind = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0, 0);
  const delay = remind.getTime() - now.getTime();
  if (delay > 0 && delay < 12 * 3600000) {
    pushReminderTimer = setTimeout(() => {
      new Notification('ShiftTrack Pro', {
        body: `Yarın vardiya: ${sh.start} - ${sh.end}`,
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect width='192' height='192' rx='32' fill='%238b5cf6'/><text x='96' y='130' font-size='100' text-anchor='middle' fill='white'>⏰</text></svg>",
        tag: 'shift-reminder'
      });
    }, delay);
  }
}

function showNotifications() {
  if (notifications.length === 0) { toast('Bildirim yok', 'info'); return; }
  let h = '<div style="padding:16px"><h3 style="font-size:16px;font-weight:800;margin-bottom:14px"><i class="fas fa-bell" style="color:var(--p);margin-right:6px"></i>Bildirimler</h3>';
  notifications.forEach(n => {
    const color = n.type === 'warning' ? 'var(--acc)' : n.type === 'success' ? 'var(--g)' : 'var(--p)';
    h += `<div style="display:flex;align-items:center;gap:10px;padding:10px;margin-bottom:6px;background:var(--bg3);border-radius:10px;border:1px solid var(--b1)">
      <i class="fas ${n.icon}" style="color:${color};font-size:14px"></i>
      <span style="font-size:12px;color:#fff;font-weight:600">${escHtml(n.text)}</span>
    </div>`;
  });
  h += '</div>';
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:2025;padding:16px';
  overlay.onclick = function(e) { if (e.target === this) this.remove(); };
  const box = document.createElement('div');
  box.style.cssText = 'background:var(--bg2);border-radius:var(--rad2);max-width:400px;width:100%;border:1px solid var(--b1);box-shadow:var(--sh3);animation:modalPop .3s cubic-bezier(.16,1,.3,1)';
  box.innerHTML = h;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

/* ============================================================
   YEAR COMPARISON STATS
============================================================ */
/* [FIX] Yıl karşılaştırması: aynı dönem bazlı (Ocak-şu an) */
function renderYearComparison() {
  const u = cu(); if (!u) return '';
  const cy = S.cy, py = cy - 1;
  const curMonth = S.cm;
  let cyHrs = 0, pyHrs = 0, cyDays = 0, pyDays = 0;
  const cyDates = new Set(), pyDates = new Set();
  getShiftPartRows(u).forEach(part => {
    const p = parseDS(part.ds); if (!p) return;
    const hrs = Math.max(0, safeNum(part.hours, 0));
    if (p.y === cy && p.m <= curMonth) { cyHrs += hrs; cyDates.add(part.ds); }
    else if (p.y === py && p.m <= curMonth) { pyHrs += hrs; pyDates.add(part.ds); }
  });
  cyDays = cyDates.size;
  pyDays = pyDates.size;
  if (pyDays === 0) return '';

  const hrsDiff = cyHrs - pyHrs;
  const hrsIcon = hrsDiff >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
  const hrsColor = hrsDiff >= 0 ? 'var(--g)' : 'var(--r)';
  const period = curMonth < 11 ? `Ock-${MTR[curMonth].substring(0,3)}` : 'Yıl';

  return `<div class="info-row"><span class="k"><i class="fas fa-chart-line"></i>${cy} vs ${py} (${period})</span>
    <span class="v" style="font-size:10px"><i class="fas ${hrsIcon}" style="color:${hrsColor}"></i> ${Math.abs(hrsDiff).toFixed(0)}s ${hrsDiff >= 0 ? 'fazla' : 'az'} (${py}: ${pyHrs.toFixed(0)}s)</span></div>`;
}

/* ============================================================
   MONTH PROJECTION
============================================================ */
function getMonthProjection() {
  const u = cu(); if (!u) return null;
  const now = new Date();
  if (S.cm !== now.getMonth() || S.cy !== now.getFullYear()) return null;

  const today = now.getDate();
  const dim = new Date(S.cy, S.cm + 1, 0).getDate();
  if (today < 5) return null;

  const md = getMD(S.cy, S.cm, { throughDay: today });
  if (md.th <= 0 || md.wd <= 0) return null;

  const avgDaily = md.th / md.wd;
  let remainWorkDays = 0;
  for (let d = today + 1; d <= dim; d++) {
    const ds = `${S.cy}-${String(S.cm+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dt = new Date(S.cy, S.cm, d);
    const dow = dt.getDay();
    if (dow !== 0 && dow !== 6 && !isH(ds)) remainWorkDays++;
  }
  const projected = md.th + (avgDaily * remainWorkDays);

  /* [FIX BUG-03] Sabit maaşlı çalışan için doğru projeksiyon:
     Saat bazlı (projected/MH * salary) yerine mevcut devamsızlık bazlı hesap.
     Kalan günlerde yeni devamsızlık olmayacağı varsayılır (iyimser senaryo). */
  let projectedEarning = 0;
  if (u.netSalary > 0) {
    const curE = calcEarningForMonth(S.cy, S.cm, u.netSalary);
    if (curE) {
      projectedEarning = Math.max(0,
        u.netSalary - curE.absentDays * curE.dailyRate + curE.overtimePay + curE.holidayPay
      );
    }
  }

  return { projected: projected.toFixed(1), projectedEarning, remaining: remainWorkDays };
}

/* ============================================================
   PWA INSTALL
============================================================ */
let deferredPrompt = null;

const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  || window.navigator.standalone === true;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const dismissed = localStorage.getItem('st_install_dismissed');
  if (!dismissed && !isStandalone) {
    const banner = $('installBanner');
    if (banner) banner.style.display = 'flex';
  }
  _updateInstallCard();
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  const b = $('installBanner'); if (b) b.style.display = 'none';
  toast('Uygulama ana ekrana eklendi!', 'success');
  _updateInstallCard();
});

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(r => {
      if (r.outcome === 'accepted') toast('Ana ekrana eklendi!', 'success');
      deferredPrompt = null;
      const b = $('installBanner'); if (b) b.style.display = 'none';
      _updateInstallCard();
    });
  }
}

function triggerInstall() {
  if (deferredPrompt) {
    installPWA();
  } else if (isIOS) {
    showIOSInstall();
  }
}

function dismissInstall() {
  const b = $('installBanner'); if (b) b.style.display = 'none';
  localStorage.setItem('st_install_dismissed', '1');
}

function showIOSInstall() {
  const o = $('iosInstallOverlay');
  if (o) o.style.display = 'flex';
}

function closeIOSInstall(e) {
  if (e && e.target !== $('iosInstallOverlay')) return;
  const o = $('iosInstallOverlay');
  if (o) o.style.display = 'none';
}

function _updateInstallCard() {
  const status = $('installAppStatus');
  const installBtn = $('installAppBtn');
  const iosBtn = $('iosInstallBtn');
  if (!status) return;

  if (isStandalone) {
    status.innerHTML = '<div class="hint"><i class="fas fa-check-circle" style="color:var(--g)"></i><span>Uygulama zaten ana ekranda yüklü.</span></div>';
    if (installBtn) installBtn.style.display = 'none';
    if (iosBtn) iosBtn.style.display = 'none';
  } else if (deferredPrompt) {
    status.innerHTML = '<div class="hint"><i class="fas fa-info-circle"></i><span>Uygulamayı tek tıkla ana ekranınıza ekleyin.</span></div>';
    if (installBtn) installBtn.style.display = 'flex';
    if (iosBtn) iosBtn.style.display = 'none';
  } else if (isIOS) {
    status.innerHTML = '<div class="hint"><i class="fas fa-info-circle"></i><span>Safari\'de "Paylaş → Ana Ekrana Ekle" adımlarını izleyin.</span></div>';
    if (installBtn) installBtn.style.display = 'none';
    if (iosBtn) iosBtn.style.display = 'flex';
  } else {
    status.innerHTML = '<div class="hint"><i class="fas fa-info-circle"></i><span>Bu tarayıcı ana ekrana eklemeyi destekliyor. Tarayıcı menüsünden ekleyebilirsiniz.</span></div>';
    if (installBtn) installBtn.style.display = 'none';
    if (iosBtn) iosBtn.style.display = 'none';
  }
}

// Show iOS banner hint automatically (once, not dismissed)
if (isIOS && !isStandalone && !localStorage.getItem('st_install_dismissed')) {
  setTimeout(() => {
    const banner = $('installBanner');
    if (banner) {
      banner.querySelector('span').textContent = 'Ana ekrana ekle';
      banner.querySelector('.ib-install').textContent = 'Nasıl?';
      banner.querySelector('.ib-install').onclick = showIOSInstall;
      banner.style.display = 'flex';
    }
  }, 3000);
}

/* ============================================================
   FIREBASE CONFIG & AUTH & SYNC
============================================================ */

// ⚠️ Firebase yapılandırması — kendi Firebase projenizin bilgilerini girin!
// https://console.firebase.google.com → Proje Ayarları → Web App → Config

// ⚠️ Firebase yapılandırması
// Firebase API anahtarı gizli değil, genel bir tanımlayıcıdır.
// Güvenlik Firestore kuralları ve Firebase Console'dan HTTP referrer kısıtlaması ile sağlanır:
// Firebase Console → Proje Ayarları → API ve Hizmetler → Kimlik Bilgileri → Browser key → HTTP referans adresleri
if (typeof FIREBASE_CONFIG === 'undefined') {
  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyClbILaI24aeB8yL-9Pdf6YWgrc7PRJGKo",
    authDomain: "shift-a50d2.firebaseapp.com",
    projectId: "shift-a50d2",
    storageBucket: "shift-a50d2.firebasestorage.app",
    messagingSenderId: "555190046824",
    appId: "1:555190046824:web:d168bebfbe8866e4ea2bdd",
    measurementId: "G-3REEMPWMP9"
  };
}

let fbApp = null, fbAuth = null, fbDb = null, fbUser = null;
let syncInProgress = false, lastSyncTime = 0;
let skipNextPush = false; // cloud'dan gelen veriyi geri push etmeyi engeller
const SYNC_DEBOUNCE = 3000; // 3 saniye debounce
const SYNC_TIMEOUT = 15000; // 15 saniye timeout

/* [FIX ERR-HANDLE-10] Bulut hata toast'ları oturumda bir kez gösterilir */
let _cloudFailNotified = false;
function notifyCloudFail(label, err) {
  console.warn('[Cloud]', label, err);
  if (_cloudFailNotified) return;
  _cloudFailNotified = true;
  toast('Bulut senkronizasyonu başarısız, lokal kayıt korundu', 'warning');
}

function initFirebase() {
  try {
    if (FIREBASE_CONFIG.apiKey === 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') {
      skipAuth();
      return;
    }
    fbApp = firebase.initializeApp(FIREBASE_CONFIG);
    fbAuth = firebase.auth();
    fbDb = firebase.firestore();

    // Firestore compat enablePersistence gelecekte kaldırılacak; uygulama offline veriyi localStorage'da korur.

    // Auth state listener
    fbAuth.onAuthStateChanged(user => {
      try {
        fbUser = user;
        if (user) {
          // Sayfa yenilendiğinde zaten giriş yapılmış kullanıcı
          enterAppAfterAuth();
        } else {
          // Giriş yapılmamış — auth ekranını göster
          const skipped = localStorage.getItem('st_auth_skipped');
          const asEl = $('authScreen'), lsEl = $('loginScreen');
          if (skipped) {
            if (asEl) asEl.style.display = 'none';
            if (lsEl) lsEl.style.display = 'flex';
          } else {
            if (asEl) asEl.style.display = 'flex';
            if (lsEl) lsEl.style.display = 'none';
          }
          updSyncUI();
          updCloudAccountUI();
        }
      } catch(e) {
        console.error('Auth state hatası:', e);
        // Hata olursa loginScreen'i göster
        const asEl = $('authScreen'), lsEl = $('loginScreen');
        if (asEl) asEl.style.display = 'none';
        if (lsEl) lsEl.style.display = 'flex';
        updLogin();
      }
    });
  } catch(e) {
    console.error('Firebase init hatası:', e);
    skipAuth();
  }
}

// Auth tab switch
function authTab(tab, btn) {
  if (btn && btn.parentElement) btn.parentElement.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const lp = $('authLoginPane'); if (lp) lp.style.display = tab === 'login' ? '' : 'none';
  const rp = $('authRegisterPane'); if (rp) rp.style.display = tab === 'register' ? '' : 'none';
  hideAuthMessages();
}

function hideAuthMessages() {
  const ae = $('authError'); if (ae) ae.style.display = 'none';
  const as = $('authSuccess'); if (as) as.style.display = 'none';
}

function showAuthError(msg) {
  const el = $('authError'); if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  const as = $('authSuccess'); if (as) as.style.display = 'none';
}

function showAuthSuccess(msg) {
  const el = $('authSuccess'); if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  const ae = $('authError'); if (ae) ae.style.display = 'none';
}

const FIREBASE_ERROR_TR = {
  'auth/email-already-in-use': 'Bu e-posta zaten kayıtlı',
  'auth/invalid-email': 'Geçersiz e-posta adresi',
  'auth/user-not-found': 'Kullanıcı bulunamadı',
  'auth/wrong-password': 'Yanlış şifre',
  'auth/weak-password': 'Şifre en az 6 karakter olmalı',
  'auth/too-many-requests': 'Çok fazla deneme. Lütfen bekleyin',
  'auth/network-request-failed': 'İnternet bağlantısı yok',
  'auth/invalid-credential': 'E-posta veya şifre yanlış'
};

function fbErrMsg(err) {
  return FIREBASE_ERROR_TR[err.code] || err.message || 'Bilinmeyen hata';
}

// Register
function firebaseRegister() {
  hideAuthMessages();
  const emailEl = $('authRegEmail'), passEl = $('authRegPass'), pass2El = $('authRegPass2');
  if (!emailEl || !passEl || !pass2El) return;
  const email = emailEl.value.trim();
  const pass = passEl.value;
  const pass2 = pass2El.value;

  if (!email) { showAuthError('E-posta girin'); return; }
  if (!pass || pass.length < 6) { showAuthError('Şifre en az 6 karakter olmalı'); return; }
  if (pass !== pass2) { showAuthError('Şifreler eşleşmiyor'); return; }

  const btn = $('authRegBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kayıt olunuyor...';

  fbAuth.createUserWithEmailAndPassword(email, pass)
    .then(cred => {
      // İlk kayıtta mevcut lokal veriyi buluta yükle
      try { const existing = localStorage.getItem('st_data'); if (existing) pushToCloud(); } catch(e) { console.warn('İlk kayıt push hatası:', e); }
      // Direkt uygulamaya geç
      enterAppAfterAuth();
    })
    .catch(err => {
      showAuthError(fbErrMsg(err));
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-user-plus" style="margin-right:6px"></i>Kayıt Ol';
    });
}

// Login
function firebaseLogin() {
  hideAuthMessages();
  const emailEl = $('authEmail'), passEl = $('authPass');
  if (!emailEl || !passEl) return;
  const email = emailEl.value.trim();
  const pass = passEl.value;

  if (!email) { showAuthError('E-posta girin'); return; }
  if (!pass) { showAuthError('Şifre girin'); return; }

  const btn = $('authLoginBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Giriş yapılıyor...';

  fbAuth.signInWithEmailAndPassword(email, pass)
    .then(() => {
      enterAppAfterAuth();
    })
    .catch(err => {
      showAuthError(fbErrMsg(err));
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-sign-in-alt" style="margin-right:6px"></i>Giriş Yap';
    });
}

// Password reset
function firebaseResetPass() {
  const emailEl = $('authEmail'), regEmailEl = $('authRegEmail');
  const email = (emailEl ? emailEl.value.trim() : '') || (regEmailEl ? regEmailEl.value.trim() : '');
  if (!email) { showAuthError('Önce e-posta adresinizi girin'); return; }
  const linkWrap = $('authResetLink'), link = linkWrap ? linkWrap.querySelector('a') : null;
  if (link) { link.style.pointerEvents = 'none'; link.style.opacity = '0.5'; link.textContent = 'Gönderiliyor...'; }
  fbAuth.sendPasswordResetEmail(email)
    .then(() => { showAuthSuccess('Şifre sıfırlama e-postası gönderildi!'); if (link) { link.style.pointerEvents = ''; link.style.opacity = ''; link.textContent = 'Şifremi Unuttum'; } })
    .catch(err => { showAuthError(fbErrMsg(err)); if (link) { link.style.pointerEvents = ''; link.style.opacity = ''; link.textContent = 'Şifremi Unuttum'; } });
}

// Logout from Firebase
function firebaseLogout() {
  if (!fbAuth) return;
  showConfirm('Bulut Çıkış', 'Bulut hesabından çıkış yapılacak. Lokal veriler kalır ama senkronizasyon durur.', () => {
    // Bekleyen sync timer'ı temizle
    if (syncTimer) { clearTimeout(syncTimer); syncTimer = null; }
    stopRealtimeSync();
    fbAuth.signOut().then(() => {
      fbUser = null;
      syncInProgress = false;
      updSyncUI();
      updCloudAccountUI();
      toast('Bulut hesabından çıkış yapıldı', 'info');
    }).catch(err => {
      console.error('Çıkış hatası:', err);
      toast('Çıkış yapılamadı. Tekrar deneyin.', 'error');
    });
  });
}

// Skip auth — offline only
function enterAppAfterAuth() {
  const as = $('authScreen'); if (as) as.style.display = 'none';
  const ls = $('loginScreen'); if (ls) ls.style.display = 'flex';
  loadLS();
  applyTheme('default');
  updLogin();
  updSyncUI();
  updCloudAccountUI();
  // Buluttan veri çek — arka planda
  try { pullFromCloud(() => { loadLS(); updLogin(); loadCloudDocs(); }); } catch(e) {}
}

/* Firestore sub-collection'dan belgeleri yükle — her app kullanıcısı için ayrı */
/* [FIX FIREBASE-SENKRON-01] Eş zamanlı çağrı koruması — duplicate belge eklenmesini önler */
let _loadCloudDocsBusy = false;
async function loadCloudDocs() {
  if (!fbDb || !fbUser || _loadCloudDocsBusy) return;
  _loadCloudDocsBusy = true;
  try {
    let changed = false;
    // Tüm app kullanıcıları için yükle
    for (const idxStr of Object.keys(S.u)) {
      const idx = parseInt(idxStr);
      const u = S.u[idx]; if (!u) continue;
      try {
        const snap = await fbDb.collection('userData').doc(fbUser.uid)
          .collection('users').doc(String(idx)).collection('docs').get();
        if (snap.empty) continue;
        if (!Array.isArray(u.documents)) u.documents = [];
        if (!u.deletedDocs) u.deletedDocs = {};
        snap.forEach(docSnap => {
          const cd = docSnap.data();
          if (!cd || !cd.id) return;
          // Silinmiş ise ekleme
          if (u.deletedDocs[cd.id]) return;
          const existing = u.documents.find(d => d.id === cd.id);
          if (!existing) {
            u.documents.push(cd);
            changed = true;
          } else if (!existing.url && cd.url) {
            existing.url = cd.url;
            changed = true;
          }
        });
      } catch(e) {
        console.warn(`Kullanıcı ${idx} belgeleri yüklenemedi:`, e);
      }
    }
    if (changed) {
      saveLS();
      const activePage = document.querySelector('.page.active');
      if (activePage && activePage.id === 'pg-documents') renderDocs();
    }
  } finally {
    _loadCloudDocsBusy = false;
  }
}

function skipAuth() {
  localStorage.setItem('st_auth_skipped', '1');
  const as = $('authScreen'); if (as) as.style.display = 'none';
  const ls = $('loginScreen'); if (ls) ls.style.display = 'flex';
  updSyncUI();
}

// Show auth screen (from settings)
function showAuthScreen() {
  localStorage.removeItem('st_auth_skipped');
  if (fbAuth && fbUser) return; // zaten giriş yapılmış
  const as = $('authScreen'); if (as) as.style.display = 'flex';
  const ma = $('mainApp'); if (ma) ma.style.display = 'none';
  const ls = $('loginScreen'); if (ls) ls.style.display = 'none';
  hideAuthMessages();
}

/* ============================================================
   FIRESTORE SYNC
============================================================ */

function mergeDeletedUsers(a, b) {
  const merged = Object.assign({}, a || {});
  Object.keys(b || {}).forEach(k => { merged[k] = Math.max(merged[k] || 0, b[k] || 0); });
  return merged;
}

function cloneUsersForCloud(users) {
  const out = {};
  Object.keys(users || {}).forEach(k => {
    const u = users[k];
    if (!u) return;
    const uc = Object.assign({}, u);
    if (Array.isArray(uc.documents)) {
      uc.documents = uc.documents.map(d => {
        const dm = Object.assign({}, d);
        delete dm.url;
        return dm;
      });
    }
    out[k] = uc;
  });
  return out;
}

function mergeUsersMap(localUsers, cloudUsers, deletedUsers) {
  const users = {};
  const allKeys = new Set([
    ...Object.keys(localUsers || {}),
    ...Object.keys(cloudUsers || {})
  ]);
  allKeys.forEach(k => {
    if (deletedUsers && deletedUsers[k]) return;
    const i = parseInt(k);
    if (isNaN(i)) return;
    users[k] = deepMergeUser(localUsers ? localUsers[k] : null, cloudUsers ? cloudUsers[k] : null);
  });
  return users;
}

// Push local data to Firestore
function pushToCloud(callback) {
  if (!fbDb || !fbUser || syncInProgress) { if (callback) callback(); return; }
  syncInProgress = true;
  setSyncState('syncing');

  // Timeout — takılmayı engelle
  const timeoutId = setTimeout(() => {
    if (syncInProgress) {
      console.warn('Push timeout — syncInProgress sıfırlandı');
      syncInProgress = false;
      setSyncState('error');
    }
  }, SYNC_TIMEOUT);

  const docRef = fbDb.collection('userData').doc(fbUser.uid);
  let mergedDeletedUsers = null;
  fbDb.runTransaction(async tx => {
    const snap = await tx.get(docRef);
    const cloud = snap.exists ? (snap.data() || {}) : {};
    const deletedUsers = mergeDeletedUsers(S.deletedUsers || {}, cloud.deletedUsers || {});
    mergedDeletedUsers = deletedUsers;
    const usersForCloud = mergeUsersMap(cloneUsersForCloud(S.u), cloud.users || {}, deletedUsers);
    const data = {
      users: usersForCloud,
      deletedUsers,
      version: DATA_VERSION,
      nextUid: Math.max(S.nextUid || 0, cloud.nextUid || 0),
      payrollOverrides: mergePayrollOverridesForCloud(cloud.payrollOverrides),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      deviceId: getDeviceId()
    };
    await tx.set(docRef, data, { merge: true });
  })
    .then(() => {
      clearTimeout(timeoutId);
      if (mergedDeletedUsers) {
        S.deletedUsers = mergedDeletedUsers;
        Object.keys(S.deletedUsers).forEach(k => { delete S.u[k]; });
      }
      lastSyncTime = Date.now();
      setSyncState('online');
      syncInProgress = false;
      if (callback) callback();
    })
    .catch(async err => {
      clearTimeout(timeoutId);
      console.error('Push hatası:', err);
      syncInProgress = false;
      if (err.code === 'permission-denied' || err.code === 'unauthenticated') {
        try {
          if (fbAuth && fbAuth.currentUser) {
            await fbAuth.currentUser.getIdToken(true);
            setSyncState('error');
          } else {
            setSyncState('offline');
            toast('Oturum süresi doldu, lütfen tekrar giriş yapın', 'warning');
          }
        } catch(e2) { setSyncState('offline'); toast('Yeniden giriş gerekiyor', 'warning'); }
      } else {
        setSyncState('error');
      }
      if (callback) callback();
    });
}

// Deep merge — iki kullanıcı verisini birleştirir (shift, leave, note seviyesinde)
function deepMergeUser(local, cloud) {
  const merged = Object.assign(mkUser(0), local || {});
  if (!cloud) {
    normalizeUserCalculations(merged);
    merged.annualLeave = annualLeaveTotal(merged);
    resolveDayConflicts(merged);
    return merged;
  }

  // Silme kayıtlarını birleştir (her iki taraftan en yeni silme zamanını al)
  if (!merged.deletedShifts) merged.deletedShifts = {};
  if (!merged.deletedLeaves) merged.deletedLeaves = {};
  const cloudDelShifts = cloud.deletedShifts || {};
  const cloudDelLeaves = cloud.deletedLeaves || {};
  Object.keys(cloudDelShifts).forEach(k => {
    merged.deletedShifts[k] = Math.max(safeTimestamp(merged.deletedShifts[k], 0), safeTimestamp(cloudDelShifts[k], 0));
  });
  Object.keys(cloudDelLeaves).forEach(k => {
    merged.deletedLeaves[k] = Math.max(safeTimestamp(merged.deletedLeaves[k], 0), safeTimestamp(cloudDelLeaves[k], 0));
  });

  // Shift merge — her iki tarafın shift'lerini birleştir
  const allShiftKeys = new Set([
    ...Object.keys(merged.shifts || {}),
    ...Object.keys(cloud.shifts || {})
  ]);
  allShiftKeys.forEach(k => {
    const ls = merged.shifts[k], cs = cloud.shifts ? cloud.shifts[k] : null;
    if (!ls && cs) merged.shifts[k] = cs; // sadece cloud'da var
    else if (ls && cs) {
      // İkisi de var — daha yeni olanı al (updatedAt varsa), yoksa cloud kazanır
      const lTime = safeTimestamp(ls.updatedAt, 0), cTime = safeTimestamp(cs.updatedAt, 0);
      if (cTime >= lTime) merged.shifts[k] = cs;
    }
  });

  // Silme kayıtlarını uygula — silme zamanından daha eski shift'leri kaldır
  Object.keys(merged.deletedShifts).forEach(k => {
    const delTime = safeTimestamp(merged.deletedShifts[k], 0);
    const sh = merged.shifts[k];
    if (sh && safeTimestamp(sh.updatedAt, 0) <= delTime) {
      delete merged.shifts[k];
    } else if (sh && safeTimestamp(sh.updatedAt, 0) > delTime) {
      // Shift silindikten sonra yeniden oluşturulmuş, silme kaydını temizle
      delete merged.deletedShifts[k];
    }
  });

  // Leave merge
  const allLeaveKeys = new Set([
    ...Object.keys(merged.leaves || {}),
    ...Object.keys(cloud.leaves || {})
  ]);
  allLeaveKeys.forEach(k => {
    if (!merged.leaves[k] && cloud.leaves && cloud.leaves[k]) merged.leaves[k] = cloud.leaves[k];
    else if (cloud.leaves && cloud.leaves[k]) {
      const lTime = safeTimestamp((merged.leaves[k] || {}).updatedAt, 0);
      const cTime = safeTimestamp((cloud.leaves[k] || {}).updatedAt, 0);
      if (cTime >= lTime) merged.leaves[k] = cloud.leaves[k];
    }
  });

  // Silme kayıtlarını uygula — silme zamanından daha eski leave'leri kaldır
  Object.keys(merged.deletedLeaves).forEach(k => {
    const delTime = safeTimestamp(merged.deletedLeaves[k], 0);
    const lv = merged.leaves[k];
    if (lv && safeTimestamp(lv.updatedAt, 0) <= delTime) {
      delete merged.leaves[k];
    } else if (lv && safeTimestamp(lv.updatedAt, 0) > delTime) {
      delete merged.deletedLeaves[k];
    }
  });

  // Eski silme kayıtlarını temizle (30 günden eski)
  const cleanupThreshold = Date.now() - (30 * 24 * 60 * 60 * 1000);
  Object.keys(merged.deletedShifts).forEach(k => {
    if (safeTimestamp(merged.deletedShifts[k], 0) < cleanupThreshold) delete merged.deletedShifts[k];
  });
  Object.keys(merged.deletedLeaves).forEach(k => {
    if (safeTimestamp(merged.deletedLeaves[k], 0) < cleanupThreshold) delete merged.deletedLeaves[k];
  });

  normalizeUserCalculations(merged);
  merged.annualLeave = annualLeaveTotal(merged);
  resolveDayConflicts(merged);

  const localNT = safeTimestamp(merged.notesUpdatedAt, 0);
  const cloudNT = safeTimestamp(cloud.notesUpdatedAt, 0);
  if (cloudNT >= localNT && typeof cloud.notes === 'string') {
    merged.notes = cloud.notes;
    merged.notesUpdatedAt = cloudNT;
  }

  // deletedDocs merge — her iki taraftan silinenleri birleştir
  if (!merged.deletedDocs) merged.deletedDocs = {};
  const cloudDeletedDocs = cloud.deletedDocs || {};
  Object.keys(cloudDeletedDocs).forEach(id => {
    merged.deletedDocs[id] = Math.max(safeTimestamp(merged.deletedDocs[id], 0), safeTimestamp(cloudDeletedDocs[id], 0));
  });

  // Documents — belgeler artık Firestore sub-collection'da saklanır (loadCloudDocs ile yüklenir)
  // Sadece yerel listeyi koru; silinmiş olanları filtrele
  if (!Array.isArray(merged.documents)) merged.documents = [];
  merged.documents = merged.documents.filter(d => !merged.deletedDocs[d.id]);
  if (Array.isArray(cloud.documents)) {
    const localIds = new Set(merged.documents.map(d => d.id));
    cloud.documents.forEach(cd => {
      if (!cd || !cd.id) return;
      if (merged.deletedDocs[cd.id]) return; // Silinmiş — ekleme
      if (!localIds.has(cd.id)) {
        const meta = Object.assign({}, cd);
        delete meta.url;
        merged.documents.push(meta);
      }
    });
  }

  const allPayrollCheckKeys = new Set([
    ...Object.keys(merged.payrollChecks || {}),
    ...Object.keys(cloud.payrollChecks || {})
  ]);
  if (!merged.payrollChecks || typeof merged.payrollChecks !== 'object') merged.payrollChecks = {};
  allPayrollCheckKeys.forEach(k => {
    const lr = merged.payrollChecks[k], cr = cloud.payrollChecks ? cloud.payrollChecks[k] : null;
    if (!lr && cr) merged.payrollChecks[k] = cr;
    else if (lr && cr && (safeTimestamp(cr.updatedAt, 0) >= safeTimestamp(lr.updatedAt, 0))) merged.payrollChecks[k] = cr;
  });

  /* [FIX BUG-R3] Ayarlar için zaman damgası çakışma çözümü.
     settingsUpdatedAt yoksa her iki taraf da 0 kabul edilir — cloud kazanır (geriye uyumlu).
     Yerel daha yeni ise (çevrimdışı değişiklik) yerel korunur. */
  const localST = safeTimestamp(merged.settingsUpdatedAt, 0);
  const cloudST = safeTimestamp(cloud.settingsUpdatedAt, 0);
  if (cloudST >= localST) {
    if (cloud.netSalary !== undefined) merged.netSalary = cloud.netSalary;
    if (cloud.annualLeave !== undefined) merged.annualLeave = cloud.annualLeave;
    if (cloud.pin !== undefined) merged.pin = cloud.pin;
    if (cloud.weeklyTemplate) merged.weeklyTemplate = cloud.weeklyTemplate;
    if (cloud.customPresets) merged.customPresets = cloud.customPresets;
    if (cloud.goalHours !== undefined) merged.goalHours = cloud.goalHours;
    if (cloud.goalEarning !== undefined) merged.goalEarning = cloud.goalEarning;
    if (cloud.theme) merged.theme = cloud.theme;
    if (cloud.autoTheme !== undefined) merged.autoTheme = !!cloud.autoTheme;
    if (cloud.monthlyHours !== undefined) merged.monthlyHours = cloud.monthlyHours;
    if (cloud.weeklyContractHours !== undefined) merged.weeklyContractHours = cloud.weeklyContractHours;
    if (cloud.payMode !== undefined) merged.payMode = cloud.payMode;
    /* [FIX] FM Yönetimi & Öneriler ayarlarını senkronize et */
    if (cloud.otCompMode !== undefined) merged.otCompMode = cloud.otCompMode;
    if (cloud.otCalcMode !== undefined) merged.otCalcMode = cloud.otCalcMode;
    if (cloud.otCompRate !== undefined) merged.otCompRate = cloud.otCompRate;
    if (cloud.otBalance !== undefined) merged.otBalance = cloud.otBalance;
    if (cloud.otCompModeChangedAt !== undefined) merged.otCompModeChangedAt = cloud.otCompModeChangedAt;
    if (Array.isArray(cloud.otCompModeHistory)) merged.otCompModeHistory = cloud.otCompModeHistory;
    if (cloud.hideSuggestions !== undefined) merged.hideSuggestions = cloud.hideSuggestions;
    merged.settingsUpdatedAt = cloudST;
  }
  // Yerel daha yeni ise: merged zaten yerel değerleri taşıdığından değişiklik yok

  const localPT = safeTimestamp(merged.profileUpdatedAt, 0);
  const cloudPT = safeTimestamp(cloud.profileUpdatedAt, 0);
  if (cloudPT >= localPT) {
    if (cloud.name !== undefined) merged.name = cloud.name;
    if (cloud.startDate !== undefined) merged.startDate = cloud.startDate;
    if (cloud.birthDate !== undefined) merged.birthDate = cloud.birthDate;
    merged.profileUpdatedAt = cloudPT;
  }

  normalizeUserCalculations(merged);
  merged.annualLeave = annualLeaveTotal(merged);
  resolveDayConflicts(merged);
  return merged;
}

// Pull data from Firestore
function pullFromCloud(callback) {
  if (!fbDb || !fbUser || syncInProgress) { if (callback) callback(); return; }
  syncInProgress = true;
  setSyncState('syncing');

  var pullTimeout = setTimeout(function() {
    if (syncInProgress) { syncInProgress = false; setSyncState('error'); }
  }, SYNC_TIMEOUT);

  fbDb.collection('userData').doc(fbUser.uid).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        if (data && data.users) {
          if (data.nextUid) S.nextUid = Math.max(S.nextUid, data.nextUid);
          S.deletedUsers = mergeDeletedUsers(S.deletedUsers || {}, data.deletedUsers || {});

          // Tüm kullanıcıları deep merge ile birleştir
          const allKeys = new Set([
            ...Object.keys(S.u || {}),
            ...Object.keys(data.users || {})
          ]);
          allKeys.forEach(k => {
            if (S.deletedUsers && S.deletedUsers[k]) { delete S.u[k]; return; }
            const i = parseInt(k);
            if (isNaN(i)) return;
            S.u[i] = deepMergeUser(S.u[i] || null, data.users[i] || null);
          });

          // saveLS ama push etme (cloud'dan aldık, geri göndermeye gerek yok)
          skipNextPush = true;
          saveLS();
          invalidateMDCache();
        }
        // Bordro override'larını (vergi/SGK parametreleri) da birleştir
        if (data && data.payrollOverrides) mergePayrollOverridesFromCloud(data.payrollOverrides);
      }
      clearTimeout(pullTimeout);
      lastSyncTime = Date.now();
      syncInProgress = false;
      setSyncState('online');
      if (callback) callback();
    })
    .catch(async err => {
      clearTimeout(pullTimeout);
      console.error('Pull hatası:', err);
      syncInProgress = false;
      if (err.code === 'permission-denied' || err.code === 'unauthenticated') {
        try {
          if (fbAuth && fbAuth.currentUser) {
            await fbAuth.currentUser.getIdToken(true);
            setSyncState('error');
          } else {
            setSyncState('offline');
            toast('Oturum süresi doldu, lütfen tekrar giriş yapın', 'warning');
          }
        } catch(e2) { setSyncState('offline'); toast('Yeniden giriş gerekiyor', 'warning'); }
      } else {
        setSyncState('error');
      }
      if (callback) callback();
    });
}

// Realtime listener — cihazlar arası anlık senkronizasyon
let unsubscribeSnapshot = null;
let lastSnapshotJson = ''; // Aynı veriyi tekrar işlemeyi engelle

function startRealtimeSync() {
  if (!fbDb || !fbUser || unsubscribeSnapshot) return;

  unsubscribeSnapshot = fbDb.collection('userData').doc(fbUser.uid)
    .onSnapshot(doc => {
      if (!doc.exists) return;
      const data = doc.data();
      if (!data || !data.users) return;

      // Başka cihazdan gelen güncellemeyi kontrol et
      /* [FIX BUG-R4] deviceId null/undefined olduğunda (eski kayıt, ilk sync) güncelleme atlanıyordu.
         !data.deviceId kontrolü eklenerek deviceId'siz veriler de işlenir. */
      if (!data.deviceId || data.deviceId !== getDeviceId()) {
        // Veri değişmiş mi kontrol et (gereksiz render'ı engelle)
        const newJson = JSON.stringify({ users:data.users, deletedUsers:data.deletedUsers || {}, payrollOverrides:data.payrollOverrides || {} });
        if (newJson === lastSnapshotJson) return;
        lastSnapshotJson = newJson;

        // Deep merge ile birleştir (veri kaybını engelle)
        if (data.nextUid) S.nextUid = Math.max(S.nextUid, data.nextUid);
        S.deletedUsers = mergeDeletedUsers(S.deletedUsers || {}, data.deletedUsers || {});
        const allKeys = new Set([
          ...Object.keys(S.u || {}),
          ...Object.keys(data.users || {})
        ]);
        allKeys.forEach(k => {
          if (S.deletedUsers && S.deletedUsers[k]) { delete S.u[k]; return; }
          const i = parseInt(k);
          if (isNaN(i)) return;
          if (data.users[i]) {
            S.u[i] = deepMergeUser(S.u[i] || null, data.users[i]);
          }
        });

        // Bordro override'larını (vergi/SGK parametreleri) de birleştir
        if (data.payrollOverrides) mergePayrollOverridesFromCloud(data.payrollOverrides);

        // Cloud'dan gelen veriyi geri push etme — bekleyen timer'ı da iptal et
        if (syncTimer) { clearTimeout(syncTimer); syncTimer = null; }
        skipNextPush = true;
        saveLS();
        invalidateMDCache();
        if (cu()) { renderAll(); updTop(); }
        setSyncState('online');
        toast('Diğer cihazdan güncelleme alındı', 'info');
      }
    }, async err => {
      console.error('Realtime sync hatası:', err);
      if (err.code === 'permission-denied' || err.code === 'unauthenticated') {
        stopRealtimeSync();
        try {
          if (fbAuth && fbAuth.currentUser) await fbAuth.currentUser.getIdToken(true);
          else toast('Oturum süresi doldu, lütfen tekrar giriş yapın', 'warning');
        } catch(e2) { toast('Yeniden giriş gerekiyor', 'warning'); }
      } else {
        setSyncState('error');
      }
    });
}

function stopRealtimeSync() {
  if (unsubscribeSnapshot) {
    unsubscribeSnapshot();
    unsubscribeSnapshot = null;
  }
}

// Device ID — her cihazı ayırt etmek için
function getDeviceId() {
  let id = localStorage.getItem('st_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem('st_device_id', id);
  }
  return id;
}

// Manual sync button
function manualSync() {
  if (!fbDb || !fbUser) { toast('Bulut hesabı bağlı değil', 'error'); return; }
  pullFromCloud(() => {
    pushToCloud(() => {
      loadLS();
      if (cu()) { invalidateMDCache(); renderAll(); updTop(); loadSet(); }
      toast('Senkronize edildi!', 'success');
    });
  });
}

// Debounced cloud push — saveLS her çağrıldığında
let syncTimer = null;
function debouncedPush() {
  if (!fbDb || !fbUser) return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => { if (!syncInProgress) pushToCloud(); }, SYNC_DEBOUNCE);
}

// Sekme aktif olunca veya online olunca sync yap
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible' && fbDb && fbUser) {
    // Sekme tekrar aktif olunca cloud'dan çek
    const timeSinceSync = Date.now() - lastSyncTime;
    if (timeSinceSync > 10000) { // 10 saniyeden fazla geçtiyse
      pullFromCloud(function() {
        invalidateMDCache();
        if (cu()) { renderAll(); updTop(); }
      });
    }
  }
});

// Online olunca sync
window.addEventListener('online', function() {
  if (fbDb && fbUser) {
    setSyncState('syncing');
    pullFromCloud(function() {
      pushToCloud(function() {
        invalidateMDCache();
        if (cu()) { renderAll(); updTop(); }
      });
    });
  }
});

window.addEventListener('offline', function() {
  setSyncState('offline');
});

/* [FIX] Çoklu sekme tutarlılığı: başka bir sekme st_data'yı güncellediğinde
   bu sekmenin in-memory mdCache'i stale kalıyordu. storage olayı (yalnızca
   diğer sekmelerde tetiklenir) ile durumu yeniden yükle, cache'i temizle ve
   aktif kullanıcı varsa ekranı tazele. */
window.addEventListener('storage', function(e) {
  // Bordro override'ları (vergi/SGK/asgari ücret) başka sekmede değişirse,
  // bu sekmenin in-memory override + cfg cache'i stale kalır. Sıfırla, tazele.
  if (e.key === PAYROLL_OVERRIDE_KEY) {
    _payrollOverrides = null;
    _payrollCfgCache = {};
    invalidateMDCache();
    if (cu()) renderAll();
    return;
  }
  if (e.key !== 'st_data' || e.newValue == null) return;
  invalidateMDCache();
  try { loadLS(); } catch (err) { console.warn('Sekmeler arası senkron yükleme hatası:', err); }
  if (cu()) { renderAll(); updTop(); }
});

/* ============================================================
   SYNC UI
============================================================ */
function setSyncState(state) {
  const dot = $('syncDot'), txt = $('syncText'), wrap = $('syncStatus');
  if (!dot || !txt) return;
  dot.className = 'sync-dot ' + state;
  const labels = { online:'Senkron', offline:'Çevrimdışı', syncing:'Senkronize ediliyor...', error:'Hata' };
  let label = labels[state] || state;
  /* [FEAT F7] Online durumunda son senkron zamanını göster — "Senkron · 2 dk önce" */
  if (state === 'online' && lastSyncTime > 0) {
    const mins = Math.floor((Date.now() - lastSyncTime) / 60000);
    if (mins < 1) label = 'Senkron · az önce';
    else if (mins < 60) label = `Senkron · ${mins}dk önce`;
    else label = `Senkron · ${Math.floor(mins/60)}sa önce`;
  }
  txt.textContent = label;
  if (wrap) wrap.title = state === 'error' ? 'Hata: dokun, tekrar dene' : (state === 'offline' ? 'Çevrimdışı' : 'Dokun: Şimdi senkronize et');
}

/* [FEAT F7] Kullanıcı sync durum bar'ına dokununca manuel senkronizasyon tetikle */
let _forceSyncBusy = false;
function forceSyncNow() {
  if (_forceSyncBusy) return;
  if (!fbUser || !fbDb) { toast('Önce giriş yapın (Ayarlar → Bulut)', 'warning'); return; }
  if (syncInProgress) { toast('Senkronizasyon zaten aktif', 'info'); return; }
  _forceSyncBusy = true;
  setSyncState('syncing');
  toast('Senkronizasyon başlatıldı...', 'info');
  try {
    pullFromCloud(() => {
      pushToCloud(() => {
        _forceSyncBusy = false;
        invalidateMDCache();
        if (cu()) { renderAll(); updTop(); loadSet(); }
        setSyncState('online');
        toast('Senkronizasyon tamamlandı', 'success');
      });
    });
  } catch (e) {
    _forceSyncBusy = false;
    setSyncState('error');
    toast('Senkronizasyon başarısız', 'error');
  }
  /* Güvenlik: 20s sonra flag'i serbest bırak */
  setTimeout(() => { _forceSyncBusy = false; }, 20000);
}

/* [FEAT F7] Online iken label'ı periyodik yenile ki "X dk önce" yanıltıcı olmasın */
setInterval(() => {
  const dot = $('syncDot');
  if (dot && dot.classList.contains('online')) setSyncState('online');
}, 60000);

function updSyncUI() {
  if (fbUser) {
    setSyncState('online');
    startRealtimeSync();
  } else {
    setSyncState('offline');
    stopRealtimeSync();
  }
}

function updCloudAccountUI() {
  const info = $('cloudAccountInfo');
  const syncBtn = $('cloudSyncBtn');
  const logoutBtn = $('cloudLogoutBtn');
  const loginBtn = $('cloudLoginBtn');
  const cloudUser = $('cloudUserInfo');

  if (fbUser) {
    if (info) info.innerHTML = `<div style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--bg3);border-radius:10px;border:1px solid var(--b1)">
      <i class="fas fa-check-circle" style="color:var(--g);font-size:16px"></i>
      <div><div style="font-size:12px;font-weight:700;color:#fff">${escHtml(fbUser.email)}</div>
      <div style="font-size:10px;color:var(--t3)">Son senkron: ${lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString('tr-TR') : '—'}</div></div>
    </div>`;
    if (syncBtn) syncBtn.style.display = '';
    if (logoutBtn) logoutBtn.style.display = '';
    if (loginBtn) loginBtn.style.display = 'none';
    if (cloudUser) cloudUser.innerHTML = `<i class="fas fa-cloud"></i>${escHtml(fbUser.email.split('@')[0])}`;
  } else {
    if (info) info.innerHTML = `<div style="font-size:12px;color:var(--t3)"><i class="fas fa-cloud-upload-alt" style="margin-right:4px"></i>Bulut hesabı bağlı değil. Veriler sadece bu cihazda.</div>`;
    if (syncBtn) syncBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (loginBtn) loginBtn.style.display = '';
    if (cloudUser) cloudUser.innerHTML = '';
  }
}

/* ============================================================
   START
============================================================ */
// Register service worker
// [FIX SERVICE-WORKER-01] Hata sessizce yutuluyordu; artık loglanıyor
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => { if (reg) console.log('[SW] Kayıt başarılı:', reg.scope); })
    .catch(err => { console.warn('[SW] Kayıt başarısız (offline desteği yok):', err.message || err); });
}

// Sistem teması değişince otomatik geçiş
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    const u = cu();
    if (u && u.autoTheme) {
      const newTheme = e.matches ? 'light' : 'default';
      u.theme = newTheme;
      markSettingsUpdated(u);
      applyTheme(newTheme);
      saveLS();
    }
  });
}

/* ============================================================
   EVRAKLARIM — DOCUMENT PORTFOLIO
============================================================ */
const DOC_CATS = {
  hygiene:     { label: 'Hijyen Belgesi',        icon: '🧼', color: '#22c55e' },
  mastery:     { label: 'Ustalık Belgesi',        icon: '🏆', color: '#f59e0b' },
  payslip:     { label: 'Bordro',                 icon: '🧾', color: '#6366f1' },
  contract:    { label: 'İş Sözleşmesi',          icon: '📑', color: '#14b8a6' },
  sgk:         { label: 'SGK Belgesi',            icon: '🏥', color: '#ef4444' },
  leave_form:  { label: 'İzin Formu',             icon: '🗓️', color: '#0ea5e9' },
  passport:    { label: 'Pasaport',               icon: '📘', color: '#3b82f6' },
  id:          { label: 'Kimlik',                 icon: '🪪', color: '#8b5cf6' },
  certificate: { label: 'Sertifika',              icon: '📜', color: '#ec4899' },
  resume:      { label: 'Özgeçmiş',               icon: '📋', color: '#06b6d4' },
  other:       { label: 'Diğer',                  icon: '📄', color: '#6b7280' }
};

let currentDocFile = null;  // seçilen File nesnesi
let currentViewDoc = null;  // görüntülenen doc metadatası
let docFilterCat = 'all';

function renderDocs() {
  const u = cu(); if (!u) return;
  if (!Array.isArray(u.documents)) u.documents = [];

  // Kategori filtre butonları
  const catEl = $('docCatFilter');
  if (catEl) {
    let catH = `<button class="doc-cat ${docFilterCat==='all'?'active':''}" onclick="filterDocs('all',this)">Tümü (${u.documents.length})</button>`;
    Object.entries(DOC_CATS).forEach(([k, v]) => {
      const cnt = u.documents.filter(d => d.category === k).length;
      if (cnt) catH += `<button class="doc-cat ${docFilterCat===k?'active':''}" onclick="filterDocs('${k}',this)">${v.icon} ${v.label} (${cnt})</button>`;
    });
    catEl.innerHTML = catH;
  }

  const el = $('docsContent'); if (!el) return;
  el.innerHTML = ''; // Her render'da temizle

  const docs = docFilterCat === 'all' ? u.documents : u.documents.filter(d => d.category === docFilterCat);

  if (!fbUser) {
    el.innerHTML = `<div class="hint" style="margin-bottom:14px"><i class="fas fa-cloud"></i><span>Belge yüklemek için <b>Bulut Hesabı</b> bağlayın (Ayarlar → Bulut Hesabı).</span></div>`;
  }

  if (!docs.length) {
    el.innerHTML += `<div class="empty"><i class="fas fa-folder-open" style="font-size:36px;color:var(--t3)"></i><p style="margin-top:8px">Belge yok<br><small style="font-size:11px;color:var(--t3)">Sağ alttaki + butonundan ekleyin</small></p></div>`;
    return;
  }

  let h = '<div class="docs-grid">';
  docs.slice().reverse().forEach(doc => { h += buildDocCard(doc); });
  h += '</div>';
  el.innerHTML += h;

  // Event delegation — tek listener, her render'da tekrar eklenmez
  if (!el._docsHooked) {
    el._docsHooked = true;
    el.addEventListener('click', e => {
      const vBtn = e.target.closest('[data-doc-view]');
      if (vBtn) { viewDocument(vBtn.dataset.docView); return; }
      const wBtn = e.target.closest('[data-doc-wa]');
      if (wBtn) {
        const u2 = cu(); if (!u2) return;
        const doc = (u2.documents || []).find(d => d.id === wBtn.dataset.docWa);
        if (doc) shareDocWA(doc);
        return;
      }
      const dBtn = e.target.closest('[data-doc-del]');
      if (dBtn) deleteDocument(dBtn.dataset.docDel);
    });
  }
}

function buildDocCard(doc) {
  const cat = DOC_CATS[doc.category] || DOC_CATS.other;
  const isImg = doc.mimeType && doc.mimeType.startsWith('image/');
  const dateStr = doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'}) : '—';
  const sizeStr = doc.fileSize ? (doc.fileSize > 1024*1024 ? (doc.fileSize/1024/1024).toFixed(1)+'MB' : Math.round(doc.fileSize/1024)+'KB') : '';
  const thumb = isImg && doc.url
    ? `<img src="${escHtml(doc.url)}" alt="${escHtml(doc.name)}" loading="lazy">`
    : `<div class="doc-type-icon">${doc.mimeType==='application/pdf'?'📄':cat.icon}</div>`;
  return `<div class="doc-card">
    <div class="doc-thumb">
      ${thumb}
      <span class="doc-cat-badge">${cat.icon} ${escHtml(cat.label)}</span>
    </div>
    <div class="doc-info">
      <div class="doc-name" title="${escHtml(doc.name)}">${escHtml(doc.name)}</div>
      <div class="doc-meta">${dateStr}${sizeStr?' · '+sizeStr:''}</div>
      <div class="doc-actions">
        <button class="doc-btn-view" data-doc-view="${escHtml(doc.id)}" title="Görüntüle"><i class="fas fa-eye"></i></button>
        <button class="doc-btn-wa" data-doc-wa="${escHtml(doc.id)}" title="WhatsApp ile paylaş"><i class="fab fa-whatsapp"></i></button>
        <button class="doc-btn-del" data-doc-del="${escHtml(doc.id)}" title="Sil"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  </div>`;
}

function filterDocs(cat, btn) {
  docFilterCat = cat;
  document.querySelectorAll('.doc-cat').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const el = $('docsContent'); if (el) el.innerHTML = '';
  renderDocs();
}

/* ---- UPLOAD MODAL ---- */
function openDocUpload() {
  currentDocFile = null;
  const inp = $('docFileInput'); if (inp) inp.value = '';
  const pw = $('docPreviewWrap'); if (pw) pw.style.display = 'none';
  const ni = $('docNameInput'); if (ni) ni.value = '';
  const prog = $('uploadProgress'); if (prog) { prog.style.display = 'none'; }
  const bar = $('uploadProgressBar'); if (bar) bar.style.width = '0%';
  const btn = $('docSaveBtn'); if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i>Kaydet'; }
  hideDocError();
  const m = $('docUploadModal'); if (m) m.classList.add('show');
}

function closeDocUpload() {
  const m = $('docUploadModal'); if (m) m.classList.remove('show');
  currentDocFile = null;
}

function docDragOver(e) { e.preventDefault(); $('docDropZone').classList.add('drag-over'); }
function docDragLeave(e) { $('docDropZone').classList.remove('drag-over'); }
function docDrop(e) {
  e.preventDefault(); $('docDropZone').classList.remove('drag-over');
  const f = e.dataTransfer.files[0]; if (f) handleDocFile(f);
}
function docFileSelected(inp) { const f = inp.files[0]; if (f) handleDocFile(f); }

function showDocError(msg) {
  const el = $('docErrorMsg');
  if (!el) { toast(msg, 'error'); return; }
  el.innerHTML = '<i class="fas fa-exclamation-circle" style="margin-right:6px"></i>' + escHtml(msg);
  el.style.display = 'block';
}
function hideDocError() { const el = $('docErrorMsg'); if (el) el.style.display = 'none'; }

function handleDocFile(file) {
  hideDocError();
  if (file.size > 700 * 1024) { showDocError('Dosya 700KB sınırını aşıyor (' + (file.size/1024).toFixed(0) + 'KB). Lütfen daha küçük bir dosya seçin.'); return; }
  // MIME type bazı tarayıcılarda boş gelebilir — uzantıyı da kontrol et
  const ext = file.name.split('.').pop().toLowerCase();
  const allowedExts = ['jpg','jpeg','png','webp','heic','heif','pdf'];
  const allowedMimes = ['image/jpeg','image/png','image/webp','image/heic','image/heif','application/pdf',''];
  if (!allowedExts.includes(ext) && !allowedMimes.includes(file.type)) {
    showDocError('Desteklenmeyen dosya türü. JPG, PNG, WEBP veya PDF yükleyin.'); return;
  }
  currentDocFile = file;
  // Varsayılan isim
  const ni = $('docNameInput');
  if (ni && !ni.value) ni.value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g,' ');
  // Önizleme
  const pw = $('docPreviewWrap'), pc = $('docPreviewContent');
  if (pw && pc) {
    pw.style.display = 'block';
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e2 => { pc.textContent = ''; const img = document.createElement('img'); img.src = e2.target.result; img.alt = 'Önizleme'; pc.appendChild(img); };
      reader.readAsDataURL(file);
    } else {
      pc.innerHTML = `<div class="pdf-prev">📄<br><small style="font-size:11px;color:var(--t3)">${escHtml(file.name)}</small></div>`;
    }
  }
}

async function saveDocument() {
  const u = cu(); if (!u) return;
  const ni = $('docNameInput'), cs = $('docCatSelect'), btn = $('docSaveBtn');
  hideDocError();
  const name = (ni ? ni.value.trim() : '');
  if (!name) { showDocError('Belge adı boş olamaz'); return; }
  if (!currentDocFile) { showDocError('Lütfen bir dosya seçin'); return; }

  // Boyut limiti: 700KB (Firestore doküman 1MB sınırı için güvenli)
  if (currentDocFile.size > 700 * 1024) {
    showDocError('Dosya 700KB sınırını aşıyor (' + (currentDocFile.size/1024).toFixed(0) + 'KB). Lütfen daha küçük bir dosya seçin.');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>Kaydediliyor...';

  const docId = 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2,6);
  const cat = cs ? cs.value : 'other';
  const ext = currentDocFile.name.split('.').pop().toLowerCase();
  const mimeMap = { jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', webp:'image/webp', pdf:'application/pdf', heic:'image/heic', heif:'image/heif' };
  const mimeType = currentDocFile.type || mimeMap[ext] || 'application/octet-stream';

  // Dosyayı base64'e çevir
  let url;
  try {
    url = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e2 => resolve(e2.target.result);
      reader.onerror = () => reject(new Error('Dosya okunamadı'));
      reader.readAsDataURL(currentDocFile);
    });
  } catch(e) {
    showDocError('Dosya okunamadı: ' + e.message);
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i>Kaydet';
    return;
  }

  const docData = {
    id: docId,
    name,
    category: cat,
    url,
    fileName: currentDocFile.name,
    mimeType,
    fileSize: currentDocFile.size,
    uploadedAt: Date.now()
  };

  // Bulut varsa kullanıcıya özel Firestore sub-collection'a kaydet
  if (fbDb && fbUser) {
    try {
      await fbDb.collection('userData').doc(fbUser.uid)
        .collection('users').doc(String(S.cu)).collection('docs').doc(docId).set(docData);
    } catch(e) {
      console.warn('Belge buluta kaydedilemedi (yerel olarak saklanıyor):', e);
    }
  }

  if (!Array.isArray(u.documents)) u.documents = [];
  u.documents.push(docData);

  saveLS();
  closeDocUpload();
  renderDocs();
  toast(`"${escHtml(name)}" eklendi`, 'success');
}

/* ---- DELETE ---- */
function deleteDocument(docId) {
  const u = cu(); if (!u || !Array.isArray(u.documents)) return;
  const doc = u.documents.find(d => d.id === docId); if (!doc) return;
  showConfirm('Belgeyi Sil', `"${escHtml(doc.name)}" silinecek. Geri alınamaz.`, async () => {
    // Silme kaydını tut (yeniden yüklemede geri gelmesini engeller)
    if (!u.deletedDocs) u.deletedDocs = {};
    u.deletedDocs[docId] = Date.now();
    // Firestore sub-collection'dan sil — önce bulut, sonra yerel (tutarlılık)
    if (fbDb && fbUser) {
      try {
        await fbDb.collection('userData').doc(fbUser.uid)
          .collection('users').doc(String(S.cu)).collection('docs').doc(docId).delete();
      } catch(e) {
        notifyCloudFail('Firestore belge silinemedi:', e);
        // Bulut silme başarısız: yerel kaydı koru, kullanıcıya bildir
        delete u.deletedDocs[docId];
        saveLS();
        return;
      }
    }
    // Yerel listeden kaldır
    u.documents = u.documents.filter(d => d.id !== docId);
    saveLS();
    renderDocs();
    toast('Belge silindi', 'info');
  });
}

/* ---- VIEW ---- */
function viewDocument(docId) {
  const u = cu(); if (!u) return;
  const doc = (u.documents||[]).find(d => d.id === docId); if (!doc) return;
  currentViewDoc = doc;
  const v = $('docViewer'), dvN = $('dvName'), dvc = $('dvContent');
  if (!v || !dvN || !dvc) return;
  dvN.textContent = doc.name;

  if (!doc.url) {
    // URL henüz yüklenmemiş — Firestore'dan çek
    dvc.innerHTML = `<div style="color:#fff;text-align:center;padding:40px"><i class="fas fa-spinner fa-spin" style="font-size:32px"></i><p style="margin-top:12px;font-size:14px">Yükleniyor...</p></div>`;
    v.classList.add('show');
    if (fbDb && fbUser) {
      fbDb.collection('userData').doc(fbUser.uid)
        .collection('users').doc(String(S.cu)).collection('docs').doc(docId).get().then(snap => {
        if (snap.exists) {
          const cd = snap.data();
          doc.url = cd.url;
          saveLS();
          viewDocument(docId); // tekrar çağır, bu sefer url var
        } else {
          dvc.innerHTML = `<div style="color:#fff;text-align:center;padding:40px"><p>Belge bulunamadı</p></div>`;
        }
      }).catch(err => {
        notifyCloudFail('Belge Firestore lazy-load:', err);
        dvc.innerHTML = `<div style="color:#fff;text-align:center;padding:40px"><p>Belge yüklenemedi</p></div>`;
      });
    }
    return;
  }

  const isImg = doc.mimeType && doc.mimeType.startsWith('image/');
  const isPdf = doc.mimeType === 'application/pdf' || doc.fileName?.endsWith('.pdf');

  if (isImg) {
    dvc.innerHTML = `<img src="${escHtml(doc.url)}" alt="${escHtml(doc.name)}" style="max-width:100%;max-height:100%;object-fit:contain">`;
  } else if (isPdf) {
    // base64 PDF → blob URL ile iframe
    try {
      const blob = dataUrlToBlob(doc.url);
      /* [FIX ERR-HANDLE-16] dataUrlToBlob bozuk data-URL'de null döner; boş iframe yerine indir fallback */
      if (!blob) throw new Error('invalid dataUrl');
      const blobUrl = URL.createObjectURL(blob);
      dvc.textContent = '';
      const iframe = document.createElement('iframe');
      iframe.src = blobUrl;
      iframe.style.cssText = 'width:100%;height:100%;border:none;border-radius:8px';
      dvc.appendChild(iframe);
    } catch(e) {
      dvc.innerHTML = `<div style="color:#fff;text-align:center;padding:20px">
        <div style="font-size:60px;margin-bottom:12px">📄</div>
        <p style="font-size:14px;margin-bottom:14px">${escHtml(doc.name)}</p>
        <button class="btn btn-primary" onclick="downloadDoc(currentViewDoc)"><i class="fas fa-download"></i>İndir</button>
      </div>`;
    }
  } else {
    dvc.innerHTML = `<div style="color:#fff;text-align:center;padding:20px">
      <div style="font-size:60px;margin-bottom:12px">${(DOC_CATS[doc.category]||DOC_CATS.other).icon}</div>
      <p style="font-size:14px;margin-bottom:14px">${escHtml(doc.name)}</p>
      <button class="btn btn-primary" onclick="downloadDoc(currentViewDoc)"><i class="fas fa-download"></i>İndir</button>
    </div>`;
  }
  v.classList.add('show');
}

function dataUrlToBlob(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.includes(',')) return null;
  const [header, data] = dataUrl.split(',');
  const match = header.match(/:(.*?);/);
  if (!match || !match[1]) return null;
  try {
    const binary = atob(data);
    const arr = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
    return new Blob([arr], { type: match[1] });
  } catch(e) { return null; }
}

function downloadDoc(doc) {
  if (!doc || !doc.url) return;
  const a = document.createElement('a');
  a.href = doc.url;
  a.download = doc.fileName || doc.name;
  a.click();
}

function closeDocViewer() {
  const v = $('docViewer'); if (v) v.classList.remove('show');
  currentViewDoc = null;
}

/* ---- WHATSAPP SHARE ---- */
async function shareDocWA(doc) {
  if (!doc || !doc.url) { toast('Belge henüz yüklenmedi', 'error'); return; }
  const cat = DOC_CATS[doc.category] || DOC_CATS.other;
  const u = cu();
  const nameText = `${cat.icon} ${doc.name}`;
  const dateText = new Date(doc.uploadedAt).toLocaleDateString('tr-TR');

  // Web Share API varsa (mobil) — dosyayı direkt paylaş
  if (navigator.share && navigator.canShare) {
    try {
      const blob = dataUrlToBlob(doc.url);
      if (!blob) throw new Error('invalid document data');
      const file = new File([blob], doc.fileName || (doc.name + '.' + (doc.mimeType === 'application/pdf' ? 'pdf' : 'jpg')), { type: blob.type });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: doc.name, text: `${nameText} — ${u ? u.name : ''} (${dateText})` });
        return;
      }
    } catch(e) {
      if (e.name !== 'AbortError') console.warn('Share API hatası:', e);
      else return; // kullanıcı iptal etti
    }
  }

  // Fallback: dosyayı indir, WhatsApp'a yönlendir
  try {
    downloadDoc(doc);
    toast('Dosya indiriliyor... İndirme tamamlandıktan sonra WhatsApp\'tan gönderebilirsiniz.', 'info');
  } catch(e) {
    toast('Paylaşım başarısız', 'error');
  }
}

/* ============================================================
   FEATURE 1: BANKA TATİLLERİ OTOMATİK YÜKLEME
   Yıla göre Türkiye resmi tatillerini takvime otomatik işaretle
============================================================ */
function getAllHolidaysForYear(y) {
  const holidays = [];
  // Sabit resmi tatiller
  FH.forEach(h => {
    const ds = `${y}-${String(h.m).padStart(2,'0')}-${String(h.d).padStart(2,'0')}`;
    holidays.push({ date: ds, name: h.n, type: 'fixed', half: !!h.half });
  });
  // Dini tatiller (yıla göre)
  const rh = RH[y];
  if (rh) {
    rh.forEach(h => {
      const ds = `${y}-${String(h.m).padStart(2,'0')}-${String(h.d).padStart(2,'0')}`;
      holidays.push({ date: ds, name: h.n, type: 'religious', half: !!h.half });
    });
  }
  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}

function renderBankHolidays() {
  const el = $('bankHolidaysSection'); if (!el) return;
  const u = cu(); if (!u) { el.innerHTML = ''; return; }
  const y = S.cy;
  const holidays = getAllHolidaysForYear(y);

  if (!holidays.length) {
    el.innerHTML = `<div class="bh-section"><h3><i class="fas fa-flag"></i>${y} Resmi Tatiller</h3><p style="font-size:12px;color:var(--t3)">Bu yıl için tatil verisi bulunamadı.</p></div>`;
    return;
  }

  // Check which holidays already have shifts or leaves marked
  let loaded = 0, total = holidays.length;
  let listHtml = '';
  holidays.forEach(h => {
    const p = parseDS(h.date); if (!p) return;
    const hasShift = u.shifts[h.date];
    const hasLeave = u.leaves[h.date];
    const isLoaded = hasShift || hasLeave;
    if (isLoaded) loaded++;
    const d = new Date(p.y, p.m, p.d);
    const dow = d.getDay();
    const dayName = DTR[dow === 0 ? 6 : dow - 1];
    const isPast = d < new Date(new Date().setHours(0,0,0,0));
    const typeIcon = h.type === 'religious' ? '🕌' : '🏛️';
    const halfTag = h.half ? ' <small style="color:var(--acc);font-weight:800">(½ gün)</small>' : '';
    listHtml += `<div class="bh-item">
      <span class="bhi-date">${d.getDate()} ${MTR[d.getMonth()].substring(0,3)} ${dayName}</span>
      <span class="bhi-name">${typeIcon} ${escHtml(h.name)}${halfTag}</span>
      ${hasShift ? '<span class="bhi-badge loaded">Çalışıldı</span>' : hasLeave ? '<span class="bhi-badge loaded">İzinli</span>' : isPast ? '<span class="bhi-badge pending">Geçmiş</span>' : ''}
    </div>`;
  });

  /* [FIX P15] Dini tatil veri kapsamı (RH) 2032'ye kadar — sonrası için açık uyarı */
  const _hasReligious = !!RH[y];
  const coverageWarn = (!_hasReligious)
    ? `<div class="hint" style="color:var(--r);margin-top:8px"><i class="fas fa-exclamation-triangle"></i>
        <span>${y} yılı için dini bayram (Ramazan/Kurban) tarihleri tanımlı değil. Bordro hesabı bu tatiller için eksik kalır — RH tablosunu güncelleyin.</span></div>`
    : '';
  el.innerHTML = `<div class="bh-section">
    <h3><i class="fas fa-flag"></i>${y} Resmi Tatiller (${holidays.reduce((sum,h)=>sum+(h.half?0.5:1),0)} gün)</h3>
    <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
      <button class="btn btn-primary btn-sm" onclick="autoLoadHolidays(${y})"><i class="fas fa-calendar-plus"></i>Tatilleri Takvime Yükle</button>
      <button class="btn btn-outline btn-sm" onclick="autoLoadHolidays(${y},'remove')"><i class="fas fa-eraser"></i>Tatil İzinlerini Kaldır</button>
    </div>
    <div class="bh-list">${listHtml}</div>
    ${coverageWarn}
  </div>`;
}

function autoLoadHolidays(y, mode) {
  const u = cu(); if (!u) return;
  const holidays = getAllHolidaysForYear(y);
  if (!holidays.length) { toast('Bu yıl için tatil verisi yok', 'error'); return; }

  if (mode === 'remove') {
    showConfirm('Tatil İzinlerini Kaldır', `${y} yılındaki otomatik yüklenen tatil izinleri kaldırılacak.`, () => {
      pushUndo('Tatil izin kaldır');
      let count = 0;
      holidays.forEach(h => {
        if (u.leaves[h.date] && u.leaves[h.date].note === 'Resmi Tatil') {
          if (!u.deletedLeaves) u.deletedLeaves = {};
          u.deletedLeaves[h.date] = Date.now();
          delete u.leaves[h.date];
          count++;
        }
      });
      invalidateMDCache(); saveLS(); renderActivePage();
      toast(`${count} tatil izni kaldırıldı`, 'success');
    });
    return;
  }

  showConfirm('Tatilleri Yükle', `${y} yılındaki ${holidays.length} resmi tatil takvime yüklenecek. Mevcut vardiya/izin olan günler atlanır.`, () => {
    pushUndo('Tatil otomatik yükle');
    let count = 0;
    holidays.forEach(h => {
      if (u.shifts[h.date] || u.leaves[h.date]) return; // Zaten dolu olan günü atla
      u.leaves[h.date] = { type: 'public_holiday', note: 'Resmi Tatil', updatedAt: Date.now() };
      if (u.deletedLeaves) delete u.deletedLeaves[h.date];
      count++;
    });
    invalidateMDCache(); saveLS(); renderActivePage();
    toast(`${count} tatil takvime yüklendi`, 'success');
  });
}

/* ============================================================
   FEATURE 2: MESAİ HESAP MAKİNESİ
   "X tarihten Y tarihine kadar çalışırsam ne kadar kazanırım?"
============================================================ */
function openCalc() {
  const today = new Date();
  const from = $('calcDateFrom'), to = $('calcDateTo');
  if (from) from.value = dStr(today);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  if (to) to.value = dStr(endOfMonth);
  const cr = $('calcResult'); if (cr) cr.innerHTML = '';
  const co = $('calcOverlay'); if (co) co.classList.add('show');
}
function closeCalc() { const co = $('calcOverlay'); if (co) co.classList.remove('show'); }

function runCalc() {
  const u = cu(); if (!u) { toast('Giriş yapın', 'error'); return; }
  const from = ($('calcDateFrom') || {}).value;
  const to = ($('calcDateTo') || {}).value;
  const start = ($('calcStart') || {}).value;
  const end = ($('calcEnd') || {}).value;
  const brk = safeInt(($('calcBreak') || {}).value, 0);
  const skipWE = ($('calcSkipWeekends') || {}).checked;
  const skipHol = ($('calcSkipHolidays') || {}).checked;

  if (!from || !to) { toast('Tarihleri girin', 'error'); return; }
  if (!start || !end) { toast('Saatleri girin', 'error'); return; }
  const fromD = new Date(from), toD = new Date(to);
  if (fromD > toD) { toast('Başlangıç bitiş tarihinden sonra olamaz', 'error'); return; }

  const shiftCheck = validateShiftInput(start, end, brk, { allowEqual:false });
  if (!shiftCheck.ok) { toast(shiftCheck.msg, 'error'); return; }
  const dailyHrs = shiftCheck.netHours;

  let totalDays = 0, totalHrs = 0, otHrs = 0, ot125Hrs = 0, holWorkedDays = 0, holSkippedDays = 0, holWorkedPayDays = 0, holSkippedPayDays = 0, paidDayEquiv = 0;
  const weekStates = {};
  const weeklyContractHours = getWeeklyContractHours(u);
  const weekStart = dt => {
    const x = new Date(dt);
    const dow = x.getDay() || 7;
    x.setDate(x.getDate() - (dow - 1));
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const getWeekState = dt => {
    const wk = getISOWeek(dt);
    if (weekStates[wk]) return weekStates[wk];
    let used = 0;
    const ws = weekStart(dt);
    const scan = new Date(ws);
    while (scan < fromD && getISOWeek(scan) === wk) {
      const ds0 = dStr(scan);
      getShiftPartsForDate(u, ds0).forEach(part => { used += Math.max(0, safeNum(part.hours, 0)); });
      scan.setDate(scan.getDate() + 1);
    }
    const usedRegular = Math.min(used, weeklyContractHours);
    const usedPartial = Math.min(Math.max(0, used - weeklyContractHours), Math.max(0, 45 - weeklyContractHours));
    weekStates[wk] = {
      normalLeft: Math.max(0, weeklyContractHours - usedRegular),
      partialLeft: Math.max(0, (45 - weeklyContractHours) - usedPartial)
    };
    return weekStates[wk];
  };

  const d = new Date(fromD);
  while (d <= toD) {
    const ds = dStr(d);
    const dow = d.getDay();
    const isWeekend = (dow === 0 || dow === 6);
    const isHoliday = isH(ds);
    if (isWeekend && skipWE) { d.setDate(d.getDate() + 1); continue; }
    if (isHoliday && skipHol) { holSkippedDays++; holSkippedPayDays += holidayWeight(ds) || 1; d.setDate(d.getDate() + 1); continue; }

    totalDays++;
    totalHrs += dailyHrs;
    const st = getWeekState(d);
    const regular = Math.min(dailyHrs, Math.max(0, st.normalLeft));
    let premiumLeft = Math.max(0, dailyHrs - regular);
    const partial = Math.min(premiumLeft, Math.max(0, st.partialLeft));
    premiumLeft = Math.max(0, premiumLeft - partial);
    const overtime = premiumLeft;
    st.normalLeft = Math.max(0, st.normalLeft - regular);
    st.partialLeft = Math.max(0, st.partialLeft - partial);
    ot125Hrs += partial;
    otHrs += overtime;
    /* [FIX P14] denominator /26 → /30; aylıkçı için her gün 1 (saatçi için oransal) */
    const _mhCalc = getMonthlyHours(u);
    const _stdDaily = Math.max(1, _mhCalc / 30);
    const _isHourly = u && u.payMode === 'hourly';
    paidDayEquiv += _isHourly ? Math.min(1, dailyHrs / _stdDaily) : 1;
    if (isHoliday) {
      holWorkedDays++;
      holWorkedPayDays += holidayPayWeight(ds, { start, end, break: brk });
    }

    d.setDate(d.getDate() + 1);
  }
  // Earnings calculation
  const _mh = getMonthlyHours(u);
  const hr = u.netSalary > 0 && _mh > 0 ? u.netSalary / _mh : 0;
  const dr = u.netSalary > 0 ? u.netSalary / 30 : 0;
  const basePay = paidDayEquiv * dr;
  const _otRateCalc = getOTRate(u);
  const _partialRateCalc = payrollCfg(fromD.getFullYear()).otPartialMultiplier || 1.25;
  const otPay = (u.otCompMode || 'pay') === 'leave' ? 0 : (otHrs * hr * _otRateCalc) + (ot125Hrs * hr * _partialRateCalc);
  const holPay = holWorkedPayDays * dr;  // Md.47: yarım gün tatiller ağırlıklı ilave ücret
  const totalEarn = basePay + otPay + holPay;

  const diffMs = toD - fromD;
  const totalCalDays = Math.ceil(diffMs / 864e5) + 1;

  const el = $('calcResult'); if (!el) return;
  el.innerHTML = `<div class="calc-result">
    <div class="cr-total">${u.netSalary > 0 ? fm(totalEarn) : totalHrs.toFixed(1) + ' saat'}</div>
    <div class="cr-sub">${totalDays} iş günü · ${totalHrs.toFixed(1)} saat · ${totalCalDays} takvim günü</div>
    <div class="calc-detail">
      <div class="cd-item"><div class="cd-val" style="color:var(--p)">${totalDays}</div><div class="cd-lbl">İş Günü</div></div>
      <div class="cd-item"><div class="cd-val" style="color:var(--g)">${totalHrs.toFixed(1)}s</div><div class="cd-lbl">Toplam Saat</div></div>
      <div class="cd-item"><div class="cd-val" style="color:var(--acc)">${otHrs.toFixed(1)}s / ${ot125Hrs.toFixed(1)}s</div><div class="cd-lbl">FM %50 / %25</div></div>
      <div class="cd-item"><div class="cd-val" style="color:var(--r)">${(skipHol ? holSkippedPayDays : holWorkedPayDays).toFixed(1)}</div><div class="cd-lbl">${skipHol ? 'Atlanan Tatil' : 'Tatil Çalışma'}</div></div>
      ${u.netSalary > 0 ? `
        <div class="cd-item"><div class="cd-val" style="color:var(--g)">${fm(basePay)}</div><div class="cd-lbl">Baz Maaş</div></div>
        <div class="cd-item"><div class="cd-val" style="color:var(--acc)">${fm(otPay)}</div><div class="cd-lbl">FM Eki</div></div>
        <div class="cd-item"><div class="cd-val">${fm(dr)}</div><div class="cd-lbl">Günlük Ücret</div></div>
        <div class="cd-item"><div class="cd-val">${fm(hr)}</div><div class="cd-lbl">Saatlik (baz)</div></div>
      ` : `<div class="cd-item" style="grid-column:span 2"><div class="cd-val" style="color:var(--t3);font-size:11px">Kazanç için Ayarlar'dan maaş girin</div><div class="cd-lbl">&nbsp;</div></div>`}
    </div>
  </div>`;
}

/* ============================================================
   FEATURE 3: İŞVEREN MODU — TAKIM GÖRÜNÜMÜ
   Birden fazla çalışanın vardiyasını haftalık olarak yönet
============================================================ */
let teamWeekStart = null;

function initTeamWeek() {
  const today = new Date();
  const dow = today.getDay() === 0 ? 6 : today.getDay() - 1;
  teamWeekStart = new Date(today);
  teamWeekStart.setDate(today.getDate() - dow);
  teamWeekStart.setHours(0,0,0,0);
}

function openEmployer() {
  if (!teamWeekStart) initTeamWeek();
  renderTeamView();
  const eo = $('employerOverlay'); if (eo) eo.classList.add('show');
}
function closeEmployer() { const eo = $('employerOverlay'); if (eo) eo.classList.remove('show'); }

function chgTeamWeek(d) {
  if (!teamWeekStart) initTeamWeek();
  teamWeekStart.setDate(teamWeekStart.getDate() + d * 7);
  renderTeamView();
}
function teamGoThisWeek() { initTeamWeek(); renderTeamView(); }

function renderTeamView() {
  const el = $('teamContent'); if (!el) return;
  if (!teamWeekStart) initTeamWeek();
  const ws = new Date(teamWeekStart);
  const we = new Date(ws); we.setDate(ws.getDate() + 6);

  // Title
  const title = $('teamWeekTitle');
  if (title) title.textContent = `${ws.getDate()} ${MTR[ws.getMonth()]} — ${we.getDate()} ${MTR[we.getMonth()]} ${we.getFullYear()}`;

  // Get all users
  const userIds = Object.keys(S.u).sort((a, b) => parseInt(a) - parseInt(b));
  if (userIds.length === 0) { el.innerHTML = '<div class="empty"><p>Kullanıcı yok</p></div>'; return; }

  // Build week dates
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(ws); d.setDate(ws.getDate() + i);
    weekDates.push(dStr(d));
  }

  // Grid header
  let gridHtml = '<div class="team-grid">';
  gridHtml += '<div class="tg-header">Çalışan</div>';
  weekDates.forEach((ds, i) => {
    const d = dsToDate(ds);
    const isToday = ds === dStr(new Date());
    gridHtml += `<div class="tg-header" style="${isToday ? 'color:var(--p);font-weight:900' : ''}">${DTR[i]}<br>${d.getDate()}</div>`;
  });

  // Per-user rows and summary data
  const summaryData = [];

  userIds.forEach(uid => {
    const u = S.u[uid]; if (!u) return;
    const initial = (u.name || 'K')[0].toUpperCase();
    const name = escHtml(u.name || 'Kullanıcı ' + uid);
    gridHtml += `<div class="tg-name"><div class="tg-av">${initial}</div>${name}</div>`;

    let weekHrs = 0, weekDays = 0, weekLeaves = 0;

    weekDates.forEach(ds => {
      const parts = getShiftPartsForDate(u, ds);
      const dayHours = parts.reduce((sum, part) => sum + Math.max(0, safeNum(part.hours, 0)), 0);
      const displayPart = parts[0] || null;
      const sh = u.shifts[ds], lv = u.leaves[ds];
      const hol = isH(ds);
      if (dayHours > 0 && displayPart) {
        weekHrs += dayHours; weekDays++;
        gridHtml += `<div class="tg-cell tg-shift" title="${escHtml(displayPart.startLabel)}–${escHtml(displayPart.endLabel)}${displayPart.sourceDs !== ds ? ' (devam)' : ''}">
          <span class="tg-hrs">${dayHours.toFixed(1)}s</span>
          <span class="tg-time">${escHtml(displayPart.startLabel)}–${escHtml(displayPart.endLabel)}</span>
        </div>`;
      } else if (lv && lv.type) {
        weekLeaves++;
        const icons = { annual:'🏖', weekly:'🛋', public_holiday:'🏛', sick:'🤒', unpaid:'⛔' };
        const labels = { annual:'Yıllık', weekly:'Tatil', public_holiday:'R.Tatil', sick:'Rapor', unpaid:'Ücretsiz' };
        gridHtml += `<div class="tg-cell tg-leave" title="${labels[lv.type]||lv.type}">
          <span>${icons[lv.type]||'📋'}</span>
          <span class="tg-time">${labels[lv.type]||''}</span>
        </div>`;
      } else if (hol) {
        gridHtml += `<div class="tg-cell tg-holiday" title="${getH(ds) || 'Tatil'}"><span>🏛️</span></div>`;
      } else {
        gridHtml += '<div class="tg-cell">—</div>';
      }
    });

    const weeklyLimit = getWeeklyContractHours(u);
    const ot125Hrs = Math.min(Math.max(0, weekHrs - weeklyLimit), Math.max(0, 45 - weeklyLimit));
    const otHrs = Math.max(0, weekHrs - 45);
    summaryData.push({ name, initial, weekHrs, weekDays, weekLeaves, otHrs, ot125Hrs, weeklyLimit, uid });
  });

  gridHtml += '</div>';

  // Summary cards
  let summaryHtml = '<div class="team-summary">';
  summaryData.forEach(s => {
    summaryHtml += `<div class="ts-card">
      <div class="ts-name"><div class="tg-av" style="width:18px;height:18px;font-size:8px">${s.initial}</div>${s.name}</div>
      <div class="ts-stats">
        <div class="ts-stat"><span class="ts-sk">Gün</span><span class="ts-sv">${s.weekDays}</span></div>
        <div class="ts-stat"><span class="ts-sk">Saat</span><span class="ts-sv">${s.weekHrs.toFixed(1)}</span></div>
        <div class="ts-stat"><span class="ts-sk">FÇ/FM</span><span class="ts-sv" style="color:${(s.otHrs + s.ot125Hrs) > 0 ? 'var(--acc)' : 'var(--t3)'}">${s.ot125Hrs.toFixed(1)}/${s.otHrs.toFixed(1)}</span></div>
        <div class="ts-stat"><span class="ts-sk">İzin</span><span class="ts-sv">${s.weekLeaves}</span></div>
      </div>
    </div>`;
  });
  summaryHtml += '</div>';

  // Team totals
  const totalHrs = summaryData.reduce((a, s) => a + s.weekHrs, 0);
  const totalDays = summaryData.reduce((a, s) => a + s.weekDays, 0);
  const totalOT = summaryData.reduce((a, s) => a + s.otHrs + s.ot125Hrs, 0);
  const teamCount = summaryData.length;

  el.innerHTML = `
    <div style="display:flex;gap:12px;margin-bottom:14px;flex-wrap:wrap">
      <div class="stat" style="flex:1;min-width:120px"><div class="ribbon"></div><div class="ico"><i class="fas fa-users"></i></div><div class="val">${teamCount}</div><div class="lbl">Çalışan</div></div>
      <div class="stat" style="flex:1;min-width:120px"><div class="ribbon"></div><div class="ico"><i class="fas fa-clock"></i></div><div class="val">${totalHrs.toFixed(1)}</div><div class="lbl">Toplam Saat</div></div>
      <div class="stat" style="flex:1;min-width:120px"><div class="ribbon"></div><div class="ico"><i class="fas fa-calendar-check"></i></div><div class="val">${totalDays}</div><div class="lbl">İş Günü</div></div>
      <div class="stat" style="flex:1;min-width:120px"><div class="ribbon"></div><div class="ico"><i class="fas fa-fire"></i></div><div class="val">${totalOT.toFixed(1)}</div><div class="lbl">FÇ/FM Saat</div></div>
    </div>
    <div style="overflow-x:auto">${gridHtml}</div>
    ${summaryHtml}`;
}

/* ============================================================
   FEATURE 4: VARDİYA ŞABLONU PAYLAŞIMI — QR KOD İLE AKTAR
============================================================ */
function renderTplShare() {
  const el = $('tplShareSection'); if (!el) return;
  const u = cu(); if (!u) { el.innerHTML = ''; return; }
  const wt = u.weeklyTemplate;
  const hasTemplate = wt && Object.values(wt).some(v => v && v.type === 'shift');

  let html = '';
  if (hasTemplate) {
    html += `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
      <button class="btn btn-primary btn-sm" onclick="shareTplQR()"><i class="fas fa-qrcode"></i>QR ile Paylaş</button>
      <button class="btn btn-soft btn-sm" onclick="copyTplLink()"><i class="fas fa-copy"></i>Kodu Kopyala</button>
    </div>`;
    html += '<div id="tplQRCode" class="tpl-qr-wrap"></div>';
  } else {
    html += '<div style="font-size:12px;color:var(--t3);padding:8px 0">Paylaşmak için önce Haftalık Şablon oluşturun.</div>';
  }

  html += `<div class="tpl-import-area">
    <h4 style="font-size:11px;font-weight:700;color:var(--t2);margin:8px 0 6px"><i class="fas fa-download" style="color:var(--p);margin-right:4px"></i>Şablon Al</h4>
    <div class="fg"><textarea id="tplImportData" placeholder="Paylaşılan şablon kodunu yapıştırın..." rows="2" style="font-size:11px"></textarea></div>
    <button class="btn btn-soft btn-sm" onclick="importTpl()" style="margin-top:4px"><i class="fas fa-download"></i>Şablonu İçe Aktar</button>
  </div>`;

  el.innerHTML = html;
}

function shareTplQR() {
  const u = cu(); if (!u || !u.weeklyTemplate) return;
  const qrEl = $('tplQRCode');
  if (!qrEl) return;
  qrEl.innerHTML = '';

  try {
    const data = JSON.stringify({
      type: 'shifttrack_template',
      name: u.name || 'Kullanıcı',
      template: u.weeklyTemplate,
      presets: u.customPresets || [],
      exportDate: new Date().toISOString()
    });
    const encoded = btoa(encodeURIComponent(data));

    if (encoded.length > 2900) {
      qrEl.innerHTML = '<p style="font-size:11px;color:var(--acc)"><i class="fas fa-exclamation-triangle"></i> Şablon QR için çok büyük. "Kodu Kopyala" butonunu kullanın.</p>';
      return;
    }

    if (typeof QRCode !== 'undefined') {
      new QRCode(qrEl, {
        text: 'STPL:' + encoded,
        width: 180, height: 180,
        colorDark: '#1a1625', colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L
      });
    }
    qrEl.innerHTML += '<p style="font-size:10px;color:var(--t3);margin-top:6px">QR kodu diğer kullanıcının kamerasıyla okutun</p>';
  } catch(e) { qrEl.innerHTML = '<p style="font-size:11px;color:var(--r)">QR oluşturulamadı</p>'; }
}

function copyTplLink() {
  const u = cu(); if (!u || !u.weeklyTemplate) { toast('Şablon yok', 'error'); return; }
  const data = JSON.stringify({
    type: 'shifttrack_template',
    name: u.name || 'Kullanıcı',
    template: u.weeklyTemplate,
    presets: u.customPresets || [],
    exportDate: new Date().toISOString()
  });
  const encoded = 'STPL:' + btoa(encodeURIComponent(data));

  navigator.clipboard.writeText(encoded).then(() => toast('Şablon kodu kopyalandı!', 'success')).catch(() => {
    const ta = document.createElement('textarea'); ta.value = encoded;
    document.body.appendChild(ta); ta.select(); document.execCommand('copy');
    document.body.removeChild(ta); toast('Kopyalandı!', 'success');
  });
}

function importTpl() {
  const u = cu(); if (!u) return;
  const el = $('tplImportData'); if (!el) return;
  let raw = el.value.trim();
  if (!raw) { toast('Şablon kodu girin', 'error'); return; }

  // Remove STPL: prefix if present
  if (raw.startsWith('STPL:')) raw = raw.substring(5);

  try {
    const decoded = decodeURIComponent(atob(raw));
    /* [FIX ERR-HANDLE-17] safeParse ile bozuk JSON'u yut */
    const p = safeParse(decoded, null);

    if (!p || typeof p !== 'object' || p.type !== 'shifttrack_template' || !p.template || typeof p.template !== 'object') {
      toast('Geçersiz şablon kodu', 'error'); return;
    }

    const fromName = p.name || 'Bilinmeyen';
    const templateDays = Object.values(p.template).filter(v => v && v.type === 'shift').length;

    showConfirm('Şablon İçe Aktar',
      `"${escHtml(fromName)}" kullanıcısından ${templateDays} günlük vardiya şablonu alınacak. Mevcut şablonun üzerine yazılır.`, () => {
      u.weeklyTemplate = p.template;
      // İsteğe bağlı: özel şablonları da aktar
      if (p.presets && Array.isArray(p.presets) && p.presets.length > 0) {
        if (!u.customPresets) u.customPresets = [];
        const existingNames = new Set(u.customPresets.map(cp => cp.name));
        p.presets.forEach(cp => {
          if (cp && cp.name && cp.start && cp.end && !existingNames.has(cp.name)) {
            u.customPresets.push(cp);
          }
        });
      }
      saveLS();
      renderWeeklyTemplate();
      renderCustomPresets();
      renderTplShare();
      el.value = '';
      toast(`${escHtml(fromName)}'dan şablon aktarıldı!`, 'success');
    });
  } catch(e) {
    toast('Geçersiz format', 'error');
  }
}

/* ============================================================
   HOOKS — Render pipeline'a yeni özellikleri ekle
   [FIX JS-FONKSİYON-01] _hooked guard: init() iki kez çağrılsa bile
   sarma yalnızca bir kez yapılır → çift tetikleme olmaz
============================================================ */
if (!renderActivePage._hooked) {
  const _origRenderActivePage = renderActivePage;
  renderActivePage = function() {
    _origRenderActivePage();
    const a = document.querySelector('.page.active');
    if (a && a.id === 'pg-calendar') renderBankHolidays();
    if (a && a.id === 'pg-settings') { renderTplShare(); }
  };
  renderActivePage._hooked = true;
}

if (!loadSet._hooked) {
  const _origLoadSet = loadSet;
  loadSet = function() {
    _origLoadSet();
    renderTplShare();
  };
  loadSet._hooked = true;
}

init();
setupKeyboardShortcuts();
initSwipe();
initDragDrop();
initFirebase();

// ===== eBORDRO MODULE START =====
// Türkiye yıl-bazlı bordro parametreleri — yeni yıl için tabloya yeni anahtar ekleyin.
// Hesap fonksiyonları payrollCfg(y) üzerinden yıla göre erişir.
const payrollConfigByYear = {
  2024: {
    year: 2024,
    minWageGross: 20002.50,
    sgkEmployee: 0.14,
    unemploymentEmployee: 0.01,
    incomeTaxBrackets: [
      { upTo: 110000,  rate: 0.15 },
      { upTo: 230000,  rate: 0.20 },
      { upTo: 870000,  rate: 0.27 },
      { upTo: 3000000, rate: 0.35 },
      { upTo: Infinity,rate: 0.40 },
    ],
    stampTaxRate: 0.00759,
    otPartialMultiplier: 1.25,
    weekendMultiplier: 1.0,
    monthlyStandardHours: 225,
    dailyStandardHours: 7.5,
    nightStartMin: 20 * 60,
    nightEndMin: 6 * 60,
    nightDefaultMultiplier: 0.0,
    disabilityDeductions: { 0: 0, 1: 6900, 2: 4000, 3: 1700 },
    besDefaultRate: 0.03,
    mealDailyTaxFree: 170,
    transportDailyTaxFree: 88,
  },
  2025: {
    year: 2025,
    minWageGross: 26005.50,
    sgkEmployee: 0.14,
    unemploymentEmployee: 0.01,
    incomeTaxBrackets: [
      { upTo: 158000,  rate: 0.15 },
      { upTo: 330000,  rate: 0.20 },
      { upTo: 1200000, rate: 0.27 },
      { upTo: 4300000, rate: 0.35 },
      { upTo: Infinity,rate: 0.40 },
    ],
    stampTaxRate: 0.00759,
    otPartialMultiplier: 1.25,
    weekendMultiplier: 1.0,
    monthlyStandardHours: 225,
    dailyStandardHours: 7.5,
    nightStartMin: 20 * 60,
    nightEndMin: 6 * 60,
    nightDefaultMultiplier: 0.0,
    disabilityDeductions: { 0: 0, 1: 9900, 2: 5700, 3: 2400 },
    besDefaultRate: 0.03,
    mealDailyTaxFree: 240,
    transportDailyTaxFree: 126,
  },
  2026: {
    year: 2026,
    minWageGross: 33030,
    sgkEmployee: 0.14,
    unemploymentEmployee: 0.01,
    incomeTaxBrackets: [
      { upTo: 190000,  rate: 0.15 },
      { upTo: 400000,  rate: 0.20 },
      { upTo: 1500000, rate: 0.27 },
      { upTo: 5300000, rate: 0.35 },
      { upTo: Infinity,rate: 0.40 },
    ],
    stampTaxRate: 0.00759,
    otPartialMultiplier: 1.25,
    weekendMultiplier: 1.0,
    monthlyStandardHours: 225,
    dailyStandardHours: 7.5,
    nightStartMin: 20 * 60,
    nightEndMin: 6 * 60,
    nightDefaultMultiplier: 0.0,
    disabilityDeductions: { 0: 0, 1: 9900, 2: 5700, 3: 2400 },
    besDefaultRate: 0.03,
    mealDailyTaxFree: 300,
    transportDailyTaxFree: 158,
  },
};
const _payrollWarnedYears = new Set();

/* ============================================================
   GÜNCEL BORDRO PARAMETRELERİ — KULLANICI OVERRIDE'I
   Vergi/SGK/asgari ücret değerleri her yıl değişir. Sabit varsayılanların
   üzerine, kullanıcının (AI doğrulamalı + onaylı) girdiği güncel değerler
   bindirilir. Evrensel oldukları için global localStorage'da saklanır.
============================================================ */
const PAYROLL_OVERRIDE_KEY = 'st_payroll_overrides';
const PAYROLL_OVERRIDE_FIELDS = ['minWageGross','sgkEmployee','unemploymentEmployee','stampTaxRate','incomeTaxBrackets','disabilityDeductions','mealDailyTaxFree','transportDailyTaxFree','otPartialMultiplier','weekendMultiplier'];
let _payrollOverrides = null;
let _payrollCfgCache = {};

function loadPayrollOverrides() {
  if (_payrollOverrides) return _payrollOverrides;
  try {
    const raw = localStorage.getItem(PAYROLL_OVERRIDE_KEY);
    const p = raw ? JSON.parse(raw) : {};
    _payrollOverrides = (p && typeof p === 'object' && !Array.isArray(p)) ? p : {};
  } catch (e) { _payrollOverrides = {}; }
  return _payrollOverrides;
}

function savePayrollOverride(year, params, meta) {
  const yr = safeInt(year, NaN);
  if (!Number.isFinite(yr)) return false;
  const all = loadPayrollOverrides();
  const clean = {};
  PAYROLL_OVERRIDE_FIELDS.forEach(f => { if (params[f] !== undefined && params[f] !== null) clean[f] = params[f]; });
  clean._meta = Object.assign({ savedAt: new Date().toISOString(), source: 'manual' }, meta || {});
  all[yr] = clean;
  _payrollOverrides = all;
  try { localStorage.setItem(PAYROLL_OVERRIDE_KEY, JSON.stringify(all)); } catch (e) { return false; }
  _payrollCfgCache = {};
  return true;
}

function clearPayrollOverride(year) {
  const yr = safeInt(year, NaN);
  const all = loadPayrollOverrides();
  if (Number.isFinite(yr)) delete all[yr]; else Object.keys(all).forEach(k => delete all[k]);
  _payrollOverrides = all;
  try { localStorage.setItem(PAYROLL_OVERRIDE_KEY, JSON.stringify(all)); } catch (e) {}
  _payrollCfgCache = {};
}

/* Bulut senkronu: bordro override'ları yıl-bazında "son yazan kazanır" ile birleştir.
   Her yılın _meta.savedAt zaman damgası karşılaştırılır. cloud daha yeniyse uygulanır.
   Değişiklik olduysa localStorage'a yazar, cache'leri temizler ve true döner. */
function mergePayrollOverridesFromCloud(cloudOverrides) {
  if (!cloudOverrides || typeof cloudOverrides !== 'object' || Array.isArray(cloudOverrides)) return false;
  const local = loadPayrollOverrides();
  let changed = false;
  const ts = (o) => { const t = o && o._meta && o._meta.savedAt ? Date.parse(o._meta.savedAt) : NaN; return Number.isFinite(t) ? t : 0; };
  Object.keys(cloudOverrides).forEach(yr => {
    const cv = cloudOverrides[yr];
    if (!cv || typeof cv !== 'object') return;
    if (!local[yr] || ts(cv) > ts(local[yr])) { local[yr] = cv; changed = true; }
  });
  if (changed) {
    _payrollOverrides = local;
    try { localStorage.setItem(PAYROLL_OVERRIDE_KEY, JSON.stringify(local)); } catch (e) {}
    _payrollCfgCache = {};
  }
  return changed;
}

/* Push için: cloud override'larını local ile birleştir (yeni olan kazanır) ve
   birleşik haritayı döndür — böylece başka cihazın override'ları push'ta silinmez. */
function mergePayrollOverridesForCloud(cloudOverrides) {
  mergePayrollOverridesFromCloud(cloudOverrides);
  return loadPayrollOverrides();
}

function _withSgkCeiling(cfg) {
  if (!cfg || cfg._withCeiling) return cfg;
  Object.defineProperty(cfg, 'sgkCeiling', { get(){ return this.minWageGross * 9; }, configurable:true });
  cfg._withCeiling = true;
  return cfg;
}
function payrollCfg(y) {
  const yr = safeInt(y, NaN);
  const cacheKey = String(yr);
  if (_payrollCfgCache[cacheKey]) return _payrollCfgCache[cacheKey];

  let base = (Number.isFinite(yr) && payrollConfigByYear[yr]) ? payrollConfigByYear[yr] : null;
  if (!base) {
    const fallbackYear = Object.keys(payrollConfigByYear).map(Number).sort((a,b)=>b-a)[0];
    if (Number.isFinite(yr) && !_payrollWarnedYears.has(yr) && !loadPayrollOverrides()[yr]) {
      _payrollWarnedYears.add(yr);
      setTimeout(() => toast(`⚠️ ${yr} yılı bordro parametreleri tanımlı değil — ${fallbackYear} değerleri kullanılıyor.`, 'warning'), 200);
    }
    base = payrollConfigByYear[fallbackYear];
  }

  const ov = (Number.isFinite(yr) && loadPayrollOverrides()[yr]) ? loadPayrollOverrides()[yr] : null;
  let merged = base;
  if (ov) {
    merged = Object.assign({}, base, { year: yr });
    PAYROLL_OVERRIDE_FIELDS.forEach(f => { if (ov[f] !== undefined && ov[f] !== null) merged[f] = ov[f]; });
    merged._override = true;
    merged._overrideMeta = ov._meta || null;
  }
  merged = _withSgkCeiling(merged);
  _payrollCfgCache[cacheKey] = merged;
  return merged;
}
function _bracketRateFor(ytd, y) {
  const cfg = payrollCfg(y);
  for (const b of cfg.incomeTaxBrackets) if (ytd <= b.upTo) return b.rate;
  return cfg.incomeTaxBrackets.slice(-1)[0].rate;
}
// Geri uyumluluk: mevcut yıl referansı (UI varsayılanı)
const payrollConfig = payrollCfg(new Date().getFullYear());

function _bordroRound2(v) {
  v = safeNum(v, 0);
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

function _bordroClampMoney(id, min, max, fallback) {
  return clampNum(($(id) || {}).value, min, max, fallback);
}

function _bordroLegalHourlyFromDaily(dailyGross, y) {
  const cfg = payrollCfg(y);
  return _bordroRound2(Math.max(0, safeNum(dailyGross, 0)) / cfg.dailyStandardHours);
}

// Kümülatif gelir vergisi hesabı (yıllık matrah üzerinden)
function _bordroCalcGV(ytdMatrah, y) {
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

function _bordroMinWageTaxableBase(gross, y) {
  const cfg = payrollCfg(y);
  const exemptGross = Math.min(Math.max(0, gross || 0), cfg.minWageGross);
  const sgkBase = Math.min(exemptGross, cfg.sgkCeiling);
  const sgkDeduction = _bordroRound2(sgkBase * cfg.sgkEmployee);
  const unemployDeduct = _bordroRound2(sgkBase * cfg.unemploymentEmployee);
  return _bordroRound2(Math.max(0, exemptGross - sgkDeduction - unemployDeduct));
}

// 7349 sayılı Kanun sonrası: AGİ yok; asgari ücrete isabet eden GV/DV istisnası uygulanır.
function _bordroCalcMinWageTaxExemption(gross, thisMonthRawGV, monthIndex, y) {
  const cfg = payrollCfg(y);
  const safeMonth = Math.max(0, Math.min(11, safeInt(monthIndex, 0)));
  const minTaxable = _bordroMinWageTaxableBase(cfg.minWageGross, y);
  const priorMinYTD = minTaxable * safeMonth;
  const minWageGV = _bordroRound2(_bordroCalcGV(priorMinYTD + minTaxable, y) - _bordroCalcGV(priorMinYTD, y));
  const incomeTaxExemption = _bordroRound2(Math.min(Math.max(0, thisMonthRawGV || 0), Math.max(0, minWageGV)));
  const stampTaxExemption = _bordroRound2(Math.min(Math.max(0, gross || 0), cfg.minWageGross) * cfg.stampTaxRate);
  return { incomeTaxExemption, stampTaxExemption };
}

// Brütten net hesaplama (belirli bir ay için kümülatif yöntem)
// opts.disabilityDegree: 0/1/2/3 — GVK md.31 matrah indirimi
// y: bordro yılı (yıl-bazlı parametreler için)
function computeNetFromGross(gross, maritalStatus, children, priorYTDMatrah, monthIndex, opts, y) {
  const cfg = payrollCfg(y);
  gross = _bordroRound2(Math.max(0, safeNum(gross, 0)));
  priorYTDMatrah = _bordroRound2(Math.max(0, safeNum(priorYTDMatrah, 0)));
  const sgkBase        = _bordroRound2(Math.min(gross, cfg.sgkCeiling));
  const sgkDeduction   = _bordroRound2(sgkBase * cfg.sgkEmployee);
  const unemployDeduct = _bordroRound2(sgkBase * cfg.unemploymentEmployee);

  // Engellilik indirimi (GVK md.31) — bu ayın matrahından düşülür
  const disDegree = clampInt(opts && opts.disabilityDegree, 0, 3, 0);
  const disabilityDeduction = _bordroRound2(Math.min(
    Math.max(0, gross - sgkDeduction - unemployDeduct),
    safeNum(cfg.disabilityDeductions[disDegree], 0)
  ));

  const gvMatrah   = _bordroRound2(Math.max(0, gross - sgkDeduction - unemployDeduct - disabilityDeduction));
  const priorYTD   = priorYTDMatrah || 0;
  const ytdMatrah  = _bordroRound2(priorYTD + gvMatrah);

  const rawGVTotal  = _bordroRound2(_bordroCalcGV(ytdMatrah, y));
  const rawGVPrior  = _bordroRound2(_bordroCalcGV(priorYTD, y));
  const thisMonthRawGV = _bordroRound2(rawGVTotal - rawGVPrior);

  const { incomeTaxExemption, stampTaxExemption } = _bordroCalcMinWageTaxExemption(gross, thisMonthRawGV, monthIndex, y);
  const netGV         = _bordroRound2(Math.max(0, thisMonthRawGV - incomeTaxExemption));
  const grossStampTax = _bordroRound2(gross * cfg.stampTaxRate);
  const stampTax      = _bordroRound2(Math.max(0, grossStampTax - stampTaxExemption));

  const net = _bordroRound2(gross - sgkDeduction - unemployDeduct - netGV - stampTax);
  return { gross, sgkDeduction, unemployDeduct, disabilityDeduction, disabilityDegree: disDegree,
    gvMatrah, ytdMatrah, thisMonthRawGV, incomeTaxExemption, stampTaxExemption, grossStampTax, netGV, stampTax, net,
    cfgYear: cfg.year };
}

// Net → Brüt ters hesaplama (ikili arama)
// y: bordro yılı (yıl-bazlı parametreler için)
function findGrossFromNet(targetNet, maritalStatus, children, priorYTDMatrah, monthIndex, opts, y) {
  targetNet = Math.max(0, safeNum(targetNet, 0));
  if (targetNet <= 0) return 0;
  // Üst sınır yüksek dilim için genişletildi (max %40 sonrası ve büyük rakamlar için)
  let lo = targetNet * 0.75, hi = Math.max(targetNet * 5, 1000000);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const { net } = computeNetFromGross(mid, maritalStatus, children, priorYTDMatrah, monthIndex, opts, y);
    if (!Number.isFinite(net)) { hi = mid; continue; }
    if (net < targetNet) lo = mid; else hi = mid;
    if (hi - lo < 0.001) break;
  }
  return (lo + hi) / 2;
}

// Oturum içi hesap sonucu (localStorage'a yazılmaz)
let _eBordroSession = {};

// Kazanç sayfasından modal aç
function openEBordroModal(y, m) {
  const u = cu();
  _eBordroSession = { y, m, userId:S.cu };
  /* Yıl-bazlı parametre tablosunda yıl yoksa payrollCfg() içinde uyarı atılır.
     Tablo dışı yıl seçilirse en yakın yıla fallback. */
  const _yrCfg = payrollCfg(y);
  const _curYear = new Date().getFullYear();
  if (_yrCfg.year !== y) {
    setTimeout(() => toast(`⚠️ Bordro parametreleri ${y} için tanımlı değil — ${_yrCfg.year} değerleri kullanılacak.`, 'warning'), 300);
  }
  const modal = $('eBordroModal');
  if (!modal) return;

  // Dönem etiketi
  const periodEl = $('eb-period');
  if (periodEl) periodEl.textContent = `${MTR[m]} ${y}`;

  // Çalışan adını profil'den ön doldur
  const nameEl = $('eb-empName');
  if (nameEl && u && u.name) nameEl.value = u.name;

  // Net maaşı profil'den ön doldur, hesaplama türü Net→Brüt
  const amountEl = $('eb-amount');
  if (amountEl && u && u.netSalary) amountEl.value = u.netSalary;

  const priorYTDEl = $('eb-priorYTD');
  if (priorYTDEl && u) {
    const rec = getPayrollCheck(u, y, m);
    /* [FIX P2] Ocak ayında kümülatif vergi matrahı sıfırlanır (GVK md.107).
       Aralık YTD'yi yeni yıla taşıma yapmıyoruz. */
    const isJan = (m === 0);
    const prevM = isJan ? null : (m - 1);
    const prevY = isJan ? null : y;
    const prevRec = (prevM === null) ? {} :
      ((u.payrollChecks && u.payrollChecks[employeeMonthKey(prevY, prevM)]) || {});
    const hasManualPrior = rec.priorYTDState === 'manual' || (rec.priorYTDAuto === false && rec.priorYTD !== undefined);
    const autoPrior = isJan ? 0 :
      (hasManualPrior ? safeNum(rec.priorYTD, 0) : (safeNum(rec.priorYTD, 0) || safeNum(prevRec.calculatedYTD, 0) || 0));
    priorYTDEl.value = autoPrior > 0 ? autoPrior.toFixed(2) : '0';
  }

  const calcTypeEl = $('eb-calcType');
  if (calcTypeEl) {
    calcTypeEl.value = 'net2gross';
    _ebUpdateAmountLabel();
    if (!calcTypeEl._ebHooked) {
      calcTypeEl.addEventListener('change', _ebUpdateAmountLabel);
      calcTypeEl._ebHooked = true;
    }
  }
  const earningModeEl = $('eb-earningMode');
  if (earningModeEl && !earningModeEl._ebHooked) {
    earningModeEl.addEventListener('change', _ebUpdateAmountLabel);
    earningModeEl._ebHooked = true;
  }

  // Önizlemeyi sıfırla
  const prev = $('bordroPreview');
  if (prev) prev.innerHTML = '<div class="bordro-empty"><i class="fas fa-info-circle"></i> Bilgileri doldurup "Hesapla &amp; Önizle" butonuna basın</div>';

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeEBordroModal() {
  const modal = $('eBordroModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

function _ebUpdateAmountLabel() {
  const typeEl = $('eb-calcType');
  const modeEl = $('eb-earningMode');
  const labelEl = $('eb-amountLabel');
  const dailyGrossLabelEl = $('eb-dailyGrossLabel');
  const officialNetDaily = modeEl && modeEl.value === 'officialNetDaily';
  if (labelEl) {
    labelEl.textContent = officialNetDaily
      ? 'Günlük Net Ücret (₺)'
      : ((typeEl && typeEl.value === 'net2gross') ? 'Net Maaş (₺)' : 'Brüt Maaş (₺)');
  }
  if (dailyGrossLabelEl) {
    dailyGrossLabelEl.textContent = officialNetDaily ? 'Tatil Günlük Brüt (opsiyonel)' : 'Günlük Brüt (₺)';
  }
}

// Önizlemeyi hesapla ve göster
function renderBordroPreview() {
  const calcType     = ($('eb-calcType') || {}).value || 'net2gross';
  const amount       = clampNum(($('eb-amount') || {}).value, 0, 100000000, 0);
  const marital      = ($('eb-marital') || {}).value || 'single';
  const children     = clampInt(($('eb-children') || {}).value, 0, 10, 0);
  const mealDays     = clampInt(($('eb-mealDays') || {}).value, 0, 31, 0);
  const transportDays= clampInt(($('eb-transportDays') || {}).value, 0, 31, 0);
  const priorYTD     = clampNum(($('eb-priorYTD') || {}).value, 0, 1000000000, 0);
  const earningMode  = (($('eb-earningMode') || {}).value || 'auto');
  const manualDailyGross = _bordroClampMoney('eb-dailyGross', 0, 10000000, 0);
  const manualNormalHours = _bordroClampMoney('eb-normalHours', 0, 744, 0);
  const manualWeeklyRestDays = _bordroClampMoney('eb-weeklyRestDays', 0, 31, 0);
  const manualPublicHolidayDays = _bordroClampMoney('eb-publicHolidayDays', 0, 31, 0);
  const manualPublicHolidayWorkDays = _bordroClampMoney('eb-publicHolidayWorkDays', 0, 31, 0);
  const manualOTHours = _bordroClampMoney('eb-manualOTHours', 0, 744, 0);
  const manualOT125Hours = _bordroClampMoney('eb-manualOT125Hours', 0, 744, 0);
  const manualNightHours = _bordroClampMoney('eb-manualNightHours', 0, 744, 0);
  const disability   = clampInt(($('eb-disability') || {}).value, 0, 3, 0);
  const nightRate    = clampNum(($('eb-nightRate') || {}).value, 0, 1, 0);
  const besRate      = clampNum(($('eb-besRate') || {}).value, 0, 0.15, 0);
  const icra         = clampNum(($('eb-icra') || {}).value, 0, 100000000, 0);
  const avans        = clampNum(($('eb-avans') || {}).value, 0, 100000000, 0);
  const otherDeduct  = clampNum(($('eb-otherDeduct') || {}).value, 0, 100000000, 0);
  const sessionPeriod = _eBordroSession || {};
  const nowForPeriod = new Date();
  const y = clampInt(sessionPeriod.y, 2024, 2100, S.ey || nowForPeriod.getFullYear());
  const m = clampInt(sessionPeriod.m, 0, 11, S.em !== undefined ? S.em : nowForPeriod.getMonth());
  _eBordroSession.y = y;
  _eBordroSession.m = m;

  const isOfficialNetDaily = earningMode === 'officialNetDaily';
  const isManualEarnings = earningMode === 'manual' || isOfficialNetDaily;
  if (!amount || amount <= 0) {
    if (!(earningMode === 'manual' && manualDailyGross > 0)) {
      toast(isOfficialNetDaily ? 'Geçerli günlük net ücret girin' : 'Geçerli bir tutar veya günlük brüt girin', 'error');
      return;
    }
  }
  const hasManualHolidayOTOverlap = isManualEarnings && manualPublicHolidayWorkDays > 0 && (manualOTHours > 0 || manualOT125Hours > 0);
  if (hasManualHolidayOTOverlap) {
    toast('Genel tatil çalışması ve FM birlikte girildi; aynı saatleri iki kez yazmadığınızdan emin olun.', 'warning');
  }

  // 1) Taban brüt maaş (yalnızca sabit maaş, ekler hariç)
  const calcOpts = { disabilityDegree: disability };
  const cfg = payrollCfg(y);
  let seedGross = 0;
  if (amount > 0) {
    seedGross = calcType === 'net2gross'
      ? findGrossFromNet(amount, marital, children, priorYTD, m, calcOpts, y)
      : amount;
  }

  // 2) O aya ait gerçek çalışma verisi (fazla mesai + tatil çalışması)
  const u = cu();
  if (!u) { toast('Çalışan seçili değil', 'error'); return; }
  const now = new Date();
  const d = getMD(y, m, (y === now.getFullYear() && m === now.getMonth()) ? { throughDay:now.getDate() } : undefined);
  const payrollHourBasis = getPayrollHourBasis(u, y);
  const compRate = getOTRate(u);
  const partialRate = cfg.otPartialMultiplier; // %25 zam (sözleşme <45 saat)
  const compMode = (u && u.otCompMode) || 'pay';
  let baseGross = 0, normalGross = 0, weeklyRestGross = 0, publicHolidayGross = 0;
  let publicHolidayWorkGross = 0, otGross = 0, ot125Gross = 0, nightGross = 0;
  let hrGross = 0, drGross = 0, nightHrs = 0, holPayDays = 0, holGross = 0, totalGross = 0;
  let otHours = 0, ot125Hours = 0;
  let unpaidGross = 0;
  let weekendGross = 0;

  if (isOfficialNetDaily) {
    const officialNormalDays = _bordroRound2(manualNormalHours / cfg.dailyStandardHours);
    const officialOtherDays = _bordroRound2(manualWeeklyRestDays + manualPublicHolidayDays + manualPublicHolidayWorkDays);
    const officialPaidDays = _bordroRound2(officialNormalDays + officialOtherDays);
    if (officialPaidDays <= 0) {
      toast('G-Net bordro için normal saat veya tatil günü girin', 'error');
      return;
    }
    const officialTotalNet = _bordroRound2(amount * officialPaidDays);
    const officialNormalNet = _bordroRound2(amount * officialNormalDays);
    const officialTotalGross = findGrossFromNet(officialTotalNet, marital, children, priorYTD, m, calcOpts, y);
    const officialNormalGrossSeed = officialNormalDays > 0
      ? findGrossFromNet(officialNormalNet, marital, children, priorYTD, m, calcOpts, y)
      : 0;
    const officialRestDailyGross = officialOtherDays > 0
      ? (manualDailyGross > 0
        ? _bordroRound2(manualDailyGross)
        : _bordroRound2(Math.max(0, officialTotalGross - officialNormalGrossSeed) / officialOtherDays))
      : 0;
    drGross = officialRestDailyGross || _bordroRound2(officialTotalGross / officialPaidDays);
    weeklyRestGross = _bordroRound2(manualWeeklyRestDays * drGross);
    publicHolidayGross = _bordroRound2(manualPublicHolidayDays * drGross);
    publicHolidayWorkGross = _bordroRound2(manualPublicHolidayWorkDays * drGross);
    normalGross = _bordroRound2(Math.max(0, officialTotalGross - weeklyRestGross - publicHolidayGross - publicHolidayWorkGross));
    hrGross = manualNormalHours > 0 ? _bordroRound2(normalGross / manualNormalHours) : _bordroRound2((drGross * 30) / payrollHourBasis);
    baseGross = _bordroRound2(normalGross + weeklyRestGross + publicHolidayGross);
    otHours = manualOTHours;
    ot125Hours = manualOT125Hours;
    nightHrs = manualNightHours;
    holPayDays = manualPublicHolidayWorkDays;
    otGross = compMode === 'pay' ? _bordroRound2(otHours * hrGross * compRate) : 0;
    ot125Gross = compMode === 'pay' ? _bordroRound2(ot125Hours * hrGross * partialRate) : 0;
    nightGross = _bordroRound2(nightHrs * hrGross * nightRate);
    holGross = publicHolidayWorkGross;
    totalGross = _bordroRound2(baseGross + otGross + ot125Gross + nightGross + holGross + weekendGross);
  } else if (isManualEarnings) {
    drGross = manualDailyGross > 0 ? _bordroRound2(manualDailyGross) : _bordroRound2(seedGross / 30);
    hrGross = _bordroRound2((drGross * 30) / payrollHourBasis);
    normalGross = _bordroRound2(manualNormalHours * hrGross);
    weeklyRestGross = _bordroRound2(manualWeeklyRestDays * drGross);
    publicHolidayGross = _bordroRound2(manualPublicHolidayDays * drGross);
    publicHolidayWorkGross = _bordroRound2(manualPublicHolidayWorkDays * drGross);
    baseGross = _bordroRound2(normalGross + weeklyRestGross + publicHolidayGross);
    if (baseGross <= 0 && seedGross > 0) baseGross = _bordroRound2(seedGross);
    otHours = manualOTHours;
    ot125Hours = manualOT125Hours;
    nightHrs = manualNightHours;
    holPayDays = manualPublicHolidayWorkDays;
    otGross = compMode === 'pay' ? _bordroRound2(otHours * hrGross * compRate) : 0;
    ot125Gross = compMode === 'pay' ? _bordroRound2(ot125Hours * hrGross * partialRate) : 0;
    nightGross = _bordroRound2(nightHrs * hrGross * nightRate);
    holGross = publicHolidayWorkGross;
    totalGross = _bordroRound2(baseGross + otGross + ot125Gross + nightGross + holGross + weekendGross);
    if (totalGross <= 0) { toast('Kalem bazlı bordro için en az bir kazanç kalemi girin', 'error'); return; }
  } else {
    baseGross = _bordroRound2(seedGross);
    drGross = _bordroRound2(baseGross / 30);
    hrGross = baseGross > 0 ? _bordroRound2(baseGross / payrollHourBasis) : _bordroRound2((drGross * 30) / payrollHourBasis);
    /* [FIX] Resmi bordro düzeni: Temel Brüt'ü Normal Çalışma / Hafta Tatili / Genel Tatil kalemlerine ayır */
    weeklyRestGross = _bordroRound2(Math.max(0, d.wr || 0) * drGross);
    publicHolidayGross = _bordroRound2(Math.max(0, d.publicHolidayPaidDays || 0) * drGross);
    normalGross = _bordroRound2(Math.max(0, baseGross - weeklyRestGross - publicHolidayGross));
    unpaidGross = _bordroRound2(Math.max(0, d.ud || 0) * drGross);
    otHours = d.oh || 0;
    ot125Hours = d.oh125 || 0;
    nightHrs = d.nh || 0;
    holPayDays = d.hpd !== undefined ? d.hpd : d.hdw;
    otGross = compMode === 'pay' ? _bordroRound2(otHours * hrGross * compRate) : 0;
    ot125Gross = compMode === 'pay' ? _bordroRound2(ot125Hours * hrGross * partialRate) : 0;
    nightGross = _bordroRound2(nightHrs * hrGross * nightRate);
    holGross = _bordroRound2(holPayDays * drGross);
    weekendGross = _bordroRound2((d.weekendHours || 0) * hrGross * Math.max(0, (cfg.weekendMultiplier || 1) - 1));
    totalGross = _bordroRound2(Math.max(0, baseGross - unpaidGross) + otGross + ot125Gross + nightGross + holGross + weekendGross);
  }

  // 3) Toplam brüt üzerinden vergi/kesinti hesabı (engellilik indirimi dahil)
  const res = computeNetFromGross(totalGross, marital, children, priorYTD, m, calcOpts, y);
  const belowMinWage = totalGross > 0 && totalGross < cfg.minWageGross;
  if (belowMinWage) {
    toast('Hesaplanan brüt asgari ücretin altında; kısmi çalışma/eksik gün politikasını kontrol edin.', 'warning');
  }

  if (u) {
    const curRec = getPayrollCheck(u, y, m);
    curRec.calculatedGross = +res.gross.toFixed(2);
    curRec.calculatedNet = +res.net.toFixed(2);
    curRec.calculatedLegalNet = +res.net.toFixed(2);
    curRec.calculatedGVMatrah = +res.gvMatrah.toFixed(2);
    curRec.calculatedYTD = +res.ytdMatrah.toFixed(2);
    curRec.payrollHourBasis = payrollHourBasis;
    curRec.holidayOvertimePolicy = 'separate_lines';
    curRec.weekendMultiplier = cfg.weekendMultiplier || 1;
    curRec.calculatedSource = {
      type: 'eBordroPreview',
      earningMode,
      calculatedAt: new Date().toISOString()
    };
    curRec.updatedAt = Date.now();
  }

  // [FIX] Kümülatif matrah otomatik aktarımı: sonraki ayın priorYTD alanı boşsa, bu ayın ytdMatrah'ını yaz.
  // Yalnızca kullanıcının MANUEL girdiği değerleri korur; 'empty' (alanı temizleme) kalıcı bloke etmez —
  // yeni bordro oluşturulduğunda tekrar otomatik dolar.
  if (u && m < 11) {
    const nextRec = getPayrollCheck(u, y, m + 1);
    const canAutoPrior = nextRec.priorYTDState !== 'manual';
    if (canAutoPrior && (!nextRec.priorYTD || nextRec.priorYTD <= 0 || nextRec.priorYTDAuto === true)) {
      nextRec.priorYTD = +res.ytdMatrah.toFixed(2);
      nextRec.priorYTDAuto = true;
      nextRec.priorYTDState = 'auto';
      nextRec.priorYTDSource = {
        type: 'eBordroPreview',
        sourceYear: y,
        sourceMonth: m + 1,
        gross: +res.gross.toFixed(2),
        gvMatrah: +res.gvMatrah.toFixed(2),
        ytdMatrah: +res.ytdMatrah.toFixed(2),
        calculatedAt: new Date().toISOString()
      };
      nextRec.updatedAt = Date.now();
      try { saveLS(); } catch(e) { /* yoksay */ }
    }
  }
  if (u) { try { saveLS(); } catch(e) { /* yoksay */ } }

  // Vergiden muaf yan haklar
  const paidDayCap = Math.max(0, Math.min(31, isManualEarnings
    ? (manualNormalHours > 0 ? Math.ceil(manualNormalHours / Math.max(1, cfg.dailyStandardHours)) : manualWeeklyRestDays + manualPublicHolidayDays)
    : (d.workDayEquiv + d.mau + d.msd + d.wr + d.otcm)));
  const effectiveMealDays = Math.min(mealDays, paidDayCap);
  const effectiveTransportDays = Math.min(transportDays, paidDayCap);
  if (mealDays > effectiveMealDays || transportDays > effectiveTransportDays) {
    toast('Yemek/yol günleri ücretli gün sayısına göre sınırlandı.', 'warning');
  }
  const mealTotal      = _bordroRound2(effectiveMealDays * cfg.mealDailyTaxFree);
  const transportTotal = _bordroRound2(effectiveTransportDays * cfg.transportDailyTaxFree);
  const yasalNet       = _bordroRound2(res.net + mealTotal + transportTotal);

  // Özel kesintiler (yasal net sonrası — "ele geçen net")
  // BES otomatik katılım: tabanı SGK prime esas kazanç (gross min SGK tavanı), brüt değil.
  const besBase        = _bordroRound2(Math.min(totalGross, cfg.sgkCeiling));
  const besDeduct      = _bordroRound2(besBase * besRate);
  const privateDeducts = _bordroRound2(besDeduct + icra + avans + otherDeduct);
  const finalNet       = _bordroRound2(Math.max(0, yasalNet - privateDeducts));
  if (u) {
    const curRec = getPayrollCheck(u, y, m);
    curRec.calculatedYasalNet = +yasalNet.toFixed(2);
    curRec.calculatedFinalNet = +finalNet.toFixed(2);
    curRec.calculatedTakeHomeNet = +finalNet.toFixed(2);
    curRec.calculatedPrivateDeductions = +privateDeducts.toFixed(2);
    try { saveLS(); } catch(e) { /* yoksay */ }
  }

  // Sonucu oturuma kaydet (PDF/JSON/XML için)
  _eBordroSession.result = {
    ...res, mealTotal, transportTotal, yasalNet, finalNet, marital, children, priorYTD, y, m,
    userId:S.cu,
    earningMode, baseGross, normalGross, weeklyRestGross, publicHolidayGross, publicHolidayWorkGross,
    normalHours: isManualEarnings ? manualNormalHours : (d.rh || 0), weeklyRestDays: manualWeeklyRestDays, publicHolidayDays: isManualEarnings ? manualPublicHolidayDays : (d.publicHolidayPaidDays || 0),
    otGross, ot125Gross, nightGross, holGross, weekendGross, totalGross,
    otHours, ot125Hours, nightHours: nightHrs, holDays: isManualEarnings ? manualPublicHolidayWorkDays : d.hdw, holPayDays,
    hrGross, drGross, compRate, partialRate, nightRate,
    payrollHourBasis,
    officialDailyNet: isOfficialNetDaily ? amount : 0,
    officialPaidDays: isOfficialNetDaily ? _bordroRound2((manualNormalHours / cfg.dailyStandardHours) + manualWeeklyRestDays + manualPublicHolidayDays + manualPublicHolidayWorkDays) : 0,
    officialNormalDays: isOfficialNetDaily ? _bordroRound2(manualNormalHours / cfg.dailyStandardHours) : 0,
    cfgYear: cfg.year,
    disability, besRate, besBase, besDeduct, icra, avans, otherDeduct, privateDeducts,
    annualLeaveDays: d.mau || 0, sickLeaveDays: d.msd || 0, unpaidDays: d.ud || 0, unpaidGross,
    weekendHours: d.weekendHours || 0, weekendWorkedDays: d.weekendWorkedDays || 0,
    weekendMultiplier: cfg.weekendMultiplier || 1,
    mealDays: effectiveMealDays, transportDays: effectiveTransportDays,
    holidayOvertimePolicy: 'Genel tatil çalışması ilavesi Md.47 olarak ayrı kalemdir; haftalık/günlük FM eşiğini aşan saatler ayrıca FM satırına girer.',
    manualHolidayOTOverlap: hasManualHolidayOTOverlap,
    belowMinWage,
    empName:  (($('eb-empName')  || {}).value || '').slice(0, 120),
    company:  (($('eb-company')  || {}).value || '').slice(0, 120),
    tcNo:     (($('eb-tcNo')     || {}).value || '').replace(/\D/g, '').slice(0, 11),
    disclaimer: 'Tahmini bordro kontrolüdür; resmi bordro ve güncel mevzuat kontrolü yerine geçmez.',
  };

  const fmb = v => formatTRY(v, 2);
  const fmr = v => formatNumTR(v, 2);
  const hasExtras = unpaidGross > 0 || otGross > 0 || ot125Gross > 0 || nightGross > 0 || holGross > 0 || weekendGross > 0;
  const annualLeaveDays = d.mau || 0;
  const sickLeaveDays = d.msd || 0;
  const unpaidDays = d.ud || 0;
  const disabilityLabels = { 1: '1. Derece (≥%80)', 2: '2. Derece (%60–79)', 3: '3. Derece (%40–59)' };
  const hasPrivateDeducts = privateDeducts > 0;
  const baseRowsHtml = isManualEarnings ? `
    ${isOfficialNetDaily ? `<div class="bordro-row info"><span class="bl">G-Net Günlük Ücret</span><span class="bv">${fmb(amount)} × ${fmr(_bordroRound2((manualNormalHours / cfg.dailyStandardHours) + manualWeeklyRestDays + manualPublicHolidayDays + manualPublicHolidayWorkDays))} gün</span></div>` : ''}
    ${normalGross > 0 ? `<div class="bordro-row add"><span class="bl">Normal Çalışma (${fmr(manualNormalHours)}s × ${fmr(hrGross)}₺)</span><span class="bv">${fmb(normalGross)}</span></div>` : ''}
    ${weeklyRestGross > 0 ? `<div class="bordro-row add"><span class="bl">Hafta Tatili (${fmr(manualWeeklyRestDays)}g × ${fmr(drGross)}₺)</span><span class="bv">${fmb(weeklyRestGross)}</span></div>` : ''}
    ${publicHolidayGross > 0 ? `<div class="bordro-row add"><span class="bl">Genel Tatil (${fmr(manualPublicHolidayDays)}g × ${fmr(drGross)}₺)</span><span class="bv">${fmb(publicHolidayGross)}</span></div>` : ''}
    ${baseGross > 0 ? `<div class="bordro-row sub"><span class="bl">TEMEL BRÜT</span><span class="bv">${fmb(baseGross)}</span></div>` : ''}
  ` : `
    ${normalGross > 0 ? `<div class="bordro-row add"><span class="bl">Normal Çalışma (${fmr(d.wd || 0)}g · ${fmr(d.rh || 0)}s)</span><span class="bv">${fmb(normalGross)}</span></div>` : ''}
    ${weeklyRestGross > 0 ? `<div class="bordro-row add"><span class="bl">Hafta Tatili (${fmr(d.wr || 0)}g × ${fmr(drGross)}₺)</span><span class="bv">${fmb(weeklyRestGross)}</span></div>` : ''}
    ${publicHolidayGross > 0 ? `<div class="bordro-row add"><span class="bl">Genel Tatil (${fmr(d.publicHolidayPaidDays || 0)}g × ${fmr(drGross)}₺)</span><span class="bv">${fmb(publicHolidayGross)}</span></div>` : ''}
    <div class="bordro-row sub"><span class="bl">TEMEL BRÜT</span><span class="bv">${fmb(baseGross)}</span></div>
    <div class="bordro-row info"><span class="bl">Yasal Saatlik Bordro Esası</span><span class="bv">${payrollHourBasis}s (${fmr(hrGross)}₺/s)</span></div>
    <div class="bordro-row info"><span class="bl">Sigorta Günü (SGK üst sınır 30)</span><span class="bv">${Math.min(30, Math.round((d.workDayEquiv || d.wd || 0) + (d.wr || 0) + (d.publicHolidayPaidDays || 0) + (d.mau || 0) + (d.msd || 0) + (d.otcm || 0)))} gün</span></div>`;

  const previewEl = $('bordroPreview');
  if (!previewEl) return;
  previewEl.innerHTML = `
    <div class="bordro-preview-title">
      <i class="fas fa-file-invoice"></i> BORDRO ÖNİZLEME — ${MTR[m].toUpperCase()} ${y}
    </div>
    ${baseRowsHtml}
    ${annualLeaveDays > 0 ? `<div class="bordro-row info"><span class="bl">Yıllık İzin (ücretli, baz içinde)</span><span class="bv">${fmr(annualLeaveDays)} gün</span></div>` : ''}
    ${sickLeaveDays > 0 ? `<div class="bordro-row info"><span class="bl">Raporlu / İstirahat (SGK ödemesi ayrı)</span><span class="bv">${fmr(sickLeaveDays)} gün</span></div>` : ''}
    ${(d.weekendWorkedDays || 0) > 0 ? `<div class="bordro-row info"><span class="bl">Hafta Sonu Çalışması (katsayı ${fmr(cfg.weekendMultiplier || 1)})</span><span class="bv">${fmr(d.weekendHours || 0)} saat</span></div>` : ''}
    ${weekendGross > 0 ? `<div class="bordro-row add"><span class="bl">Hafta Sonu Farkı</span><span class="bv">+ ${fmb(weekendGross)}</span></div>` : ''}
    ${belowMinWage ? `<div class="bordro-row info"><span class="bl">Asgari Ücret Kontrolü</span><span class="bv">Altında</span></div>` : ''}
    ${unpaidDays > 0 ? `<div class="bordro-row deduct"><span class="bl">Ücretsiz İzin (baz brütten düşülür)</span><span class="bv">− ${fmb(unpaidGross)}</span></div>` : ''}
    ${(holGross > 0 && (otGross > 0 || ot125Gross > 0)) ? `<div class="bordro-row info"><span class="bl">Tatil + FM Kuralı</span><span class="bv">Ayrı kalem</span></div>` : ''}
    ${ot125Gross > 0 ? `<div class="bordro-row add"><span class="bl">Fazla Çalışma %25 (${ot125Hours.toFixed(1)}s × ${fmr(hrGross)}₺ × ${partialRate})</span><span class="bv">+ ${fmb(ot125Gross)}</span></div>` : ''}
    ${otGross > 0 ? `<div class="bordro-row add"><span class="bl">Fazla Mesai %50 (${otHours.toFixed(1)}s × ${fmr(hrGross)}₺ × ${compRate})</span><span class="bv">+ ${fmb(otGross)}</span></div>` : ''}
    ${nightGross > 0 ? `<div class="bordro-row add"><span class="bl">Gece Çalışma Zammı (${nightHrs.toFixed(1)}s × ${fmr(hrGross)}₺ × ${nightRate})</span><span class="bv">+ ${fmb(nightGross)}</span></div>` : ''}
    ${holGross > 0 ? `<div class="bordro-row add"><span class="bl">Genel Tatil (Çalıştı) — ${fmr(holPayDays)}g × ${fmr(drGross)}₺ ek ücret (Md.47)</span><span class="bv">+ ${fmb(holGross)}</span></div>` : ''}
    ${hasExtras ? `<div class="bordro-row sub"><span class="bl">TOPLAM BRÜT</span><span class="bv">${fmb(totalGross)}</span></div>` : ''}
    <div class="bordro-row deduct"><span class="bl">SGK İşçi Payı (%14)</span><span class="bv">− ${fmb(res.sgkDeduction)}</span></div>
    <div class="bordro-row deduct"><span class="bl">İşsizlik Sigortası (%1)</span><span class="bv">− ${fmb(res.unemployDeduct)}</span></div>
    ${res.disabilityDeduction > 0 ? `<div class="bordro-row add"><span class="bl">Engellilik İndirimi — ${disabilityLabels[res.disabilityDegree]||''} (GVK md.31)</span><span class="bv">− ${fmb(res.disabilityDeduction)}</span></div>` : ''}
    <div class="bordro-row sub"><span class="bl">GV Matrahı</span><span class="bv">${fmb(res.gvMatrah)}</span></div>
    <div class="bordro-row deduct"><span class="bl">Gelir Vergisi (brüt, hesaplanan)</span><span class="bv">− ${fmb(res.thisMonthRawGV)}</span></div>
    <div class="bordro-row add"><span class="bl">Asgari Ücret GV İstisnası</span><span class="bv">+ ${fmb(res.incomeTaxExemption)}</span></div>
    <div class="bordro-row info"><span class="bl">= Net Gelir Vergisi (kesilen)</span><span class="bv">${fmb(res.netGV)}</span></div>
    <div class="bordro-row deduct"><span class="bl">Damga Vergisi (brüt, %0.759)</span><span class="bv">− ${fmb(res.grossStampTax)}</span></div>
    <div class="bordro-row add"><span class="bl">Asgari Ücret DV İstisnası</span><span class="bv">+ ${fmb(res.stampTaxExemption)}</span></div>
    <div class="bordro-row info"><span class="bl">= Net Damga Vergisi (kesilen)</span><span class="bv">${fmb(res.stampTax)}</span></div>
    ${mealTotal > 0 ? `<div class="bordro-row add"><span class="bl">Yemek Yardımı (${effectiveMealDays}g × ${cfg.mealDailyTaxFree}₺)</span><span class="bv">+ ${fmb(mealTotal)}</span></div>` : ''}
    ${transportTotal > 0 ? `<div class="bordro-row add"><span class="bl">Yol Yardımı (${effectiveTransportDays}g × ${cfg.transportDailyTaxFree}₺)</span><span class="bv">+ ${fmb(transportTotal)}</span></div>` : ''}
    ${hasPrivateDeducts ? `<div class="bordro-row sub"><span class="bl">YASAL NET</span><span class="bv">${fmb(yasalNet)}</span></div>` : ''}
    ${besDeduct > 0 ? `<div class="bordro-row deduct"><span class="bl">BES Otomatik Katılım (%${(besRate*100).toFixed(2)})</span><span class="bv">− ${fmb(besDeduct)}</span></div>` : ''}
    ${icra > 0 ? `<div class="bordro-row deduct"><span class="bl">İcra Kesintisi</span><span class="bv">− ${fmb(icra)}</span></div>` : ''}
    ${avans > 0 ? `<div class="bordro-row deduct"><span class="bl">Avans</span><span class="bv">− ${fmb(avans)}</span></div>` : ''}
    ${otherDeduct > 0 ? `<div class="bordro-row deduct"><span class="bl">Diğer Özel Kesinti</span><span class="bv">− ${fmb(otherDeduct)}</span></div>` : ''}
    <div class="bordro-row total"><span class="bl">${hasPrivateDeducts ? 'ELE GEÇEN NET' : 'NET MAAŞ'}</span><span class="bv">${fmb(finalNet)}</span></div>
    <div style="margin-top:8px;font-size:10px;color:var(--t3);line-height:1.35"><i class="fas fa-info-circle"></i> Tahmini bordro kontrolüdür; resmi bordro ve güncel mevzuat kontrolü yerine geçmez.</div>
  `;
  const activePage = document.querySelector('.page.active');
  if (activePage && activePage.id === 'pg-ai') renderAIAssistantPage();
}

// PDF indir (jsPDF + autotable)
function downloadBordroPDF() {
  if (!_eBordroSession.result) { renderBordroPreview(); }
  const r = _eBordroSession.result;
  if (!r) return;

  const jspdfLib = window.jspdf || {};
  const JsPDF = jspdfLib.jsPDF;
  if (!JsPDF) { toast('PDF kütüphanesi yüklenemedi', 'error'); return; }

  /* [FIX ERR-HANDLE-15] jsPDF çağrıları runtime hatası atabilir (font/autoTable eksik, büyük belge); dış try/catch */
  try {
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const fmb = v => v.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';
  // Helvetica Latin Extended desteklemez; PDF'te Türkçe özel karakter yerine ASCII karşılık kullan
  const pdfMTR = ['Ocak','Subat','Mart','Nisan','Mayis','Haziran','Temmuz','Agustos','Eylul','Ekim','Kasim','Aralik'];

  // Başlık bandı
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, 210, 42, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('MAAS BORDROSU', 105, 17, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${pdfMTR[r.m].toUpperCase()} ${r.y}`, 105, 27, { align: 'center' });
  if (r.company) {
    doc.setFontSize(10);
    doc.text(pdfStr(r.company), 105, 35, { align: 'center' });
  }

  // Çalışan bilgileri
  doc.setTextColor(30, 30, 30);
  let yp = 52;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (r.empName) { doc.text('Calisan : ' + pdfStr(r.empName), 15, yp); yp += 6; }
  if (r.tcNo)    { doc.text('TC/SGK  : ' + r.tcNo,    15, yp); yp += 6; }
  doc.text('Donem   : ' + pdfMTR[r.m] + ' ' + r.y, 15, yp); yp += 10;

  // Bordro tablosu
  const rows = [];
  if (r.earningMode === 'manual' || r.earningMode === 'officialNetDaily') {
    if (r.earningMode === 'officialNetDaily') rows.push([`G-Net Gunluk Ucret (${(r.officialPaidDays||0).toFixed(2)}g)`, fmb(r.officialDailyNet || 0), '']);
    if (r.normalGross > 0) rows.push([`Normal Calisma (${(r.normalHours||0).toFixed(2)}s)`, fmb(r.normalGross), '']);
    if (r.weeklyRestGross > 0) rows.push([`Hafta Tatili (${(r.weeklyRestDays||0).toFixed(2)}g)`, fmb(r.weeklyRestGross), '']);
    if (r.publicHolidayGross > 0) rows.push([`Genel Tatil (${(r.publicHolidayDays||0).toFixed(2)}g)`, fmb(r.publicHolidayGross), '']);
    rows.push(['TEMEL BRUT', fmb(r.baseGross || 0), '']);
  } else {
    rows.push(['TEMEL BRUT MAAS', fmb(r.baseGross || r.gross), '']);
  }
  if (r.ot125Gross > 0) rows.push([`Fazla Calisma %25 (${(r.ot125Hours||0).toFixed(1)}s x ${(r.hrGross||0).toFixed(2)} x ${r.partialRate||1.25})`, fmb(r.ot125Gross), '']);
  if (r.otGross > 0)  rows.push([`Fazla Mesai %50 (${(r.otHours||0).toFixed(1)}s x ${(r.hrGross||0).toFixed(2)} x ${r.compRate||1.5})`, fmb(r.otGross), '']);
  if (r.nightGross > 0) rows.push([`Gece Calisma Zammi (${(r.nightHours||0).toFixed(1)}s x ${(r.hrGross||0).toFixed(2)} x ${r.nightRate||0})`, fmb(r.nightGross), '']);
  if (r.holGross > 0) rows.push([`Tatil Cal. Ilavesi (${(r.holPayDays||r.holDays||0).toFixed(2)}g x ${(r.drGross||0).toFixed(2)}) Md.47`, fmb(r.holGross), '']);
  if (r.weekendGross > 0) rows.push([`Hafta Sonu Farki (${(r.weekendHours||0).toFixed(1)}s x ${(r.weekendMultiplier||1).toFixed(2)})`, fmb(r.weekendGross), '']);
  if ((r.unpaidGross || 0) > 0) rows.push([`Ucretsiz Izin (${(r.unpaidDays||0).toFixed(2)}g x ${(r.drGross||0).toFixed(2)})`, '', fmb(r.unpaidGross)]);
  if (r.otGross > 0 || r.ot125Gross > 0 || r.nightGross > 0 || r.holGross > 0 || r.weekendGross > 0 || (r.unpaidGross || 0) > 0) rows.push(['TOPLAM BRUT', fmb(r.gross), '']);
  rows.push(
    ['SGK Isci Payi (%14)',    '',                     fmb(r.sgkDeduction)],
    ['Issizlik Sigortasi (%1)','',                     fmb(r.unemployDeduct)],
  );
  if (r.disabilityDeduction > 0) rows.push([`Engellilik Indirimi (Derece ${r.disabilityDegree}) GVK m.31`, fmb(r.disabilityDeduction), '']);
  // Gelir/Damga vergisi: brüt vergi (kesinti) + asgari ücret istisnası (ekleme).
  // Sütun toplamı net'e ulaşsın diye ayrı "Net" satırı yazılmaz (resmî bordro düzeni;
  // aksi halde brüt + net iki kez kesinti sütununda görünüp çift sayılırdı).
  rows.push(
    ['GV Matrahi',             fmb(r.gvMatrah),        ''],
    ['Gelir Vergisi (Brut)',   '',                     fmb(r.thisMonthRawGV)],
    ['Asgari Ucret GV Ist.',   fmb(r.incomeTaxExemption || 0), ''],
    ['Damga Vergisi (%0.759)', '',                     fmb(r.grossStampTax || r.stampTax)],
    ['Asgari Ucret DV Ist.',   fmb(r.stampTaxExemption || 0), ''],
  );
  if (r.mealTotal > 0)      rows.push(['Yemek Yardimi',     fmb(r.mealTotal),      '']);
  if (r.transportTotal > 0) rows.push(['Yol Yardimi',       fmb(r.transportTotal), '']);
  const _hasPriv = (r.privateDeducts || 0) > 0;
  if (_hasPriv) rows.push(['YASAL NET',           fmb(r.yasalNet || r.net), '']);
  if (r.besDeduct > 0)     rows.push([`BES Otomatik Katilim (%${((r.besRate||0)*100).toFixed(2)})`, '', fmb(r.besDeduct)]);
  if (r.icra > 0)          rows.push(['Icra Kesintisi',     '', fmb(r.icra)]);
  if (r.avans > 0)         rows.push(['Avans',              '', fmb(r.avans)]);
  if (r.otherDeduct > 0)   rows.push(['Diger Ozel Kesinti', '', fmb(r.otherDeduct)]);
  rows.push([_hasPriv ? 'ELE GECEN NET' : 'NET MAAS', fmb(r.finalNet), '']);

  const lastRow = rows.length - 1;
  doc.autoTable({
    startY: yp,
    head: [['KALEM', 'EKLEME (+)', 'KESINTI (-)']],
    body: rows,
    styles: { font: 'helvetica', fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 248, 255] },
    columnStyles: { 0: { cellWidth: 90 }, 1: { halign: 'right' }, 2: { halign: 'right' } },
    didParseCell: function(data) {
      if (data.section === 'body' && data.row.index === lastRow) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [224, 231, 255];
        data.cell.styles.fontSize  = 11;
      }
    }
  });

  const footY = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.text(
    pdfStr(`Tahmini bordro kontroludur; resmi bordro yerine gecmez. Olusturulma: ${new Date().toLocaleString('tr-TR')} | ShiftTrack Pro | payrollConfig ${r.cfgYear || payrollConfig.year}`),
    105, footY, { align: 'center' }
  );

  const fname = `Bordro_${pdfMTR[r.m]}_${r.y}${r.empName ? '_' + fileSlug(r.empName, 'calisan') : ''}.pdf`;
  doc.save(fname);
  toast('PDF indirildi', 'success');
  } catch(e) {
    console.error('downloadBordroPDF error:', e);
    toast('PDF oluşturulamadı', 'error');
  }
}

// JSON dışa aktar
function exportBordroJSON() {
  if (!_eBordroSession.result) { renderBordroPreview(); }
  const r = _eBordroSession.result;
  if (!r) return;

  const data = {
    employee: {
      name:          r.empName || null,
      tcNo:          r.tcNo    || null,
      company:       r.company || null,
      maritalStatus: r.marital,
      children:      r.children,
    },
    period: { year: r.y, month: r.m + 1, monthName: MTR[r.m] },
    earnings: {
      earningMode:         r.earningMode || 'auto',
      officialDailyNet:    +(r.officialDailyNet || 0).toFixed(2),
      officialPaidDays:    +(r.officialPaidDays || 0).toFixed(2),
      officialNormalDays:  +(r.officialNormalDays || 0).toFixed(2),
      baseGross:          +(r.baseGross || r.gross).toFixed(2),
      normalHours:        +(r.normalHours || 0).toFixed(2),
      normalGross:        +(r.normalGross || 0).toFixed(2),
      weeklyRestDays:     +(r.weeklyRestDays || 0).toFixed(2),
      weeklyRestGross:    +(r.weeklyRestGross || 0).toFixed(2),
      publicHolidayDays:  +(r.publicHolidayDays || 0).toFixed(2),
      publicHolidayGross: +(r.publicHolidayGross || 0).toFixed(2),
      overtimePay:        +(r.otGross   || 0).toFixed(2),
      partialOvertimePay: +(r.ot125Gross || 0).toFixed(2),
      nightShiftBonus:    +(r.nightGross || 0).toFixed(2),
      holidayWorkPay:     +(r.holGross  || 0).toFixed(2),
      weekendBonus:       +(r.weekendGross || 0).toFixed(2),
      totalGross:         +r.gross.toFixed(2),
      mealAllowance:      +r.mealTotal.toFixed(2),
      transportAllowance: +r.transportTotal.toFixed(2),
      otHours:            +(r.otHours   || 0).toFixed(2),
      ot125Hours:         +(r.ot125Hours || 0).toFixed(2),
      nightHours:         +(r.nightHours || 0).toFixed(2),
      holDays:            r.holDays    || 0,
      holPayDays:         +(r.holPayDays || r.holDays || 0).toFixed(2),
      annualLeaveDays:    r.annualLeaveDays || 0,
      sickLeaveDays:      r.sickLeaveDays || 0,
      unpaidDays:         r.unpaidDays || 0,
      unpaidGrossDeduction:+(r.unpaidGross || 0).toFixed(2),
      weekendHours:       +(r.weekendHours || 0).toFixed(2),
      weekendWorkedDays:  r.weekendWorkedDays || 0,
      weekendMultiplier:  +(r.weekendMultiplier || 1).toFixed(2),
      payrollHourBasis:    r.payrollHourBasis || payrollCfg(r.y).monthlyStandardHours,
    },
    deductions: {
      sgkEmployee:   +r.sgkDeduction.toFixed(2),
      unemployment:  +r.unemployDeduct.toFixed(2),
      disabilityDegree: r.disabilityDegree || 0,
      disabilityDeduction: +(r.disabilityDeduction || 0).toFixed(2),
      gvMatrah:      +r.gvMatrah.toFixed(2),
      incomeTax:     +r.thisMonthRawGV.toFixed(2),
      incomeTaxExemption: +(r.incomeTaxExemption || 0).toFixed(2),
      netIncomeTax:  +r.netGV.toFixed(2),
      grossStampTax: +(r.grossStampTax || r.stampTax).toFixed(2),
      stampTaxExemption: +(r.stampTaxExemption || 0).toFixed(2),
      stampTax:      +r.stampTax.toFixed(2),
    },
    privateDeductions: {
      besRate:    +(r.besRate || 0).toFixed(4),
      besBase:    +(r.besBase || 0).toFixed(2),
      bes:        +(r.besDeduct || 0).toFixed(2),
      icra:       +(r.icra || 0).toFixed(2),
      avans:      +(r.avans || 0).toFixed(2),
      other:      +(r.otherDeduct || 0).toFixed(2),
      total:      +(r.privateDeducts || 0).toFixed(2),
    },
    yasalNet:  +(r.yasalNet || r.net).toFixed(2),
    net:       +r.finalNet.toFixed(2),
    config:    { year: r.cfgYear || payrollCfg(r.y).year, minWageGross: payrollCfg(r.y).minWageGross },
    policies: {
      holidayOvertime: r.holidayOvertimePolicy || null,
      manualHolidayOTOverlap: !!r.manualHolidayOTOverlap,
      belowMinWage: !!r.belowMinWage,
      payrollHourBasis: r.payrollHourBasis || payrollCfg(r.y).monthlyStandardHours,
      weekendMultiplier: r.weekendMultiplier || 1,
    },
    disclaimer: r.disclaimer || 'Tahmini bordro kontrolüdür; resmi bordro ve güncel mevzuat kontrolü yerine geçmez.',
    timestamp: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `Bordro_${MTR[r.m]}_${r.y}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  toast('JSON indirildi', 'success');
}

// XML dışa aktar (SGK uyumlu yapı)
function exportBordroXML() {
  if (!_eBordroSession.result) { renderBordroPreview(); }
  const r = _eBordroSession.result;
  if (!r) return;

  const xe  = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const fv  = v => (+v).toFixed(2);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Bordro Yil="${r.y}" Ay="${r.m + 1}" OlusturmaTarihi="${new Date().toISOString()}">
  <Aciklama>${xe(r.disclaimer || 'Tahmini bordro kontroludur; resmi bordro ve guncel mevzuat kontrolu yerine gecmez.')}</Aciklama>
  <Calisan>
    <AdSoyad>${xe(r.empName)}</AdSoyad>
    <TCKimlikNo>${xe(r.tcNo)}</TCKimlikNo>
    <SirketAdi>${xe(r.company)}</SirketAdi>
    <MedeniDurum>${xe(r.marital)}</MedeniDurum>
    <CocukSayisi>${r.children}</CocukSayisi>
  </Calisan>
  <Kazanclar>
    <KazancModu>${xe(r.earningMode || 'auto')}</KazancModu>
    <GNetGunlukUcret gun="${(r.officialPaidDays||0).toFixed(2)}" normalGun="${(r.officialNormalDays||0).toFixed(2)}">${fv(r.officialDailyNet||0)}</GNetGunlukUcret>
    <NormalCalisma saat="${(r.normalHours||0).toFixed(2)}">${fv(r.normalGross||0)}</NormalCalisma>
    <HaftaTatili gun="${(r.weeklyRestDays||0).toFixed(2)}">${fv(r.weeklyRestGross||0)}</HaftaTatili>
    <GenelTatil gun="${(r.publicHolidayDays||0).toFixed(2)}">${fv(r.publicHolidayGross||0)}</GenelTatil>
    <TemelBrutMaas>${fv(r.baseGross || r.gross)}</TemelBrutMaas>
    <FazlaCalismaYuzde25 saat="${(r.ot125Hours||0).toFixed(2)}" oran="${r.partialRate||1.25}" kanun="4857/41/4">${fv(r.ot125Gross||0)}</FazlaCalismaYuzde25>
    <FazlaMesaiUcreti saat="${(r.otHours||0).toFixed(2)}" oran="${r.compRate||1.5}">${fv(r.otGross||0)}</FazlaMesaiUcreti>
    <GeceCalismaZammi saat="${(r.nightHours||0).toFixed(2)}" oran="${r.nightRate||0}" kanun="4857/69">${fv(r.nightGross||0)}</GeceCalismaZammi>
    <TatilCalismasiIlavesi gun="${r.holPayDays||r.holDays||0}" takvimGunu="${r.holDays||0}" kanun="Md.47">${fv(r.holGross||0)}</TatilCalismasiIlavesi>
    <UcretsizIzinKesintisi gun="${(r.unpaidDays||0).toFixed(2)}">${fv(r.unpaidGross||0)}</UcretsizIzinKesintisi>
    <HaftaSonuCalismasi gun="${r.weekendWorkedDays||0}" saat="${(r.weekendHours||0).toFixed(2)}" oran="${r.weekendMultiplier||1}">${fv(r.weekendGross||0)}</HaftaSonuCalismasi>
    <TatilFazlaMesaiPolitikasi>${xe(r.holidayOvertimePolicy || '')}</TatilFazlaMesaiPolitikasi>
    <AsgariUcretAltiUyari>${r.belowMinWage ? 'true' : 'false'}</AsgariUcretAltiUyari>
    <ToplamBrut saatlikEsas="${r.payrollHourBasis || payrollCfg(r.y).monthlyStandardHours}">${fv(r.gross)}</ToplamBrut>
    <YemekYardimi>${fv(r.mealTotal)}</YemekYardimi>
    <YolYardimi>${fv(r.transportTotal)}</YolYardimi>
  </Kazanclar>
  <Kesintiler>
    <SGKIsciPayi oran="0.14">${fv(r.sgkDeduction)}</SGKIsciPayi>
    <IssizlikSigortasi oran="0.01">${fv(r.unemployDeduct)}</IssizlikSigortasi>
    <EngellilikIndirimi derece="${r.disabilityDegree||0}" kanun="GVK m.31">${fv(r.disabilityDeduction||0)}</EngellilikIndirimi>
    <GVMatrahi>${fv(r.gvMatrah)}</GVMatrahi>
    <GelirVergisi>${fv(r.thisMonthRawGV)}</GelirVergisi>
    <AsgariUcretGelirVergisiIstisnasi>${fv(r.incomeTaxExemption||0)}</AsgariUcretGelirVergisiIstisnasi>
    <NetGelirVergisi>${fv(r.netGV)}</NetGelirVergisi>
    <DamgaVergisiBrut oran="0.00759">${fv(r.grossStampTax||r.stampTax)}</DamgaVergisiBrut>
    <AsgariUcretDamgaVergisiIstisnasi>${fv(r.stampTaxExemption||0)}</AsgariUcretDamgaVergisiIstisnasi>
    <DamgaVergisi oran="0.00759">${fv(r.stampTax)}</DamgaVergisi>
  </Kesintiler>
  <YasalNet>${fv(r.yasalNet || r.net)}</YasalNet>
  <OzelKesintiler>
    <BES oran="${(r.besRate||0).toFixed(4)}">${fv(r.besDeduct||0)}</BES>
    <Icra>${fv(r.icra||0)}</Icra>
    <Avans>${fv(r.avans||0)}</Avans>
    <DigerKesinti>${fv(r.otherDeduct||0)}</DigerKesinti>
    <Toplam>${fv(r.privateDeducts||0)}</Toplam>
  </OzelKesintiler>
  <NetMaas etiket="${(r.privateDeducts||0)>0?'EleGecenNet':'YasalNet'}">${fv(r.finalNet)}</NetMaas>
  <PayrollConfig Yil="${r.cfgYear || payrollCfg(r.y).year}" AsgariBrut="${payrollCfg(r.y).minWageGross}"/>
</Bordro>`;

  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `Bordro_${MTR[r.m]}_${r.y}.xml`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  toast('XML indirildi', 'success');
}

// ===== CSV EXPORT =====
function exportBordroCSV() {
  if (!_eBordroSession || !_eBordroSession.result) { renderBordroPreview(); }
  const r = _eBordroSession.result;
  if (!r) { toast('Önce hesaplama yapın', 'warning'); return; }
  const cfg = payrollCfg(r.y);
  const fv = v => (+(v||0)).toFixed(2);
  const headers = [
    'Alan', 'Değer', 'Açıklama'
  ];
  const rows = [
    ['Ad Soyad', r.empName || '', ''],
    ['Dönem', `${MTR[r.m]} ${r.y}`, ''],
    ['Hesaplama Türü', r.calcType === 'net2gross' ? 'Net→Brüt' : 'Brüt→Net', ''],
    ['', '', ''],
    ['BRÜT KAZANÇLAR', '', ''],
    ['Brüt Maaş', fv(r.baseGross || 0), ''],
    ['Fazla Mesai %50', fv(r.otGross || 0), `Oran: ${(cfg.otMultiplier||1.5).toFixed(2)}x`],
    ['Fazla Çalışma %25', fv(r.ot125Gross || 0), `Oran: ${(cfg.otPartialMultiplier||1.25).toFixed(2)}x`],
    ['Gece Zammı', fv(r.nightGross || 0), `Oran: ${((r.nightRate||0)*100).toFixed(1)}%`],
    ['Resmi Tatil', fv(r.holGross || 0), ''],
    ['Hafta Tatili', fv(r.weekendGross || 0), `Katsayı: ${(cfg.weekendMultiplier||1).toFixed(1)}x`],
    ['Yemek Yardımı', fv(r.mealAmount || 0), `${r.mealDays||0} gün`],
    ['Yol Yardımı', fv(r.transportAmount || 0), `${r.transportDays||0} gün`],
    ['Toplam Brüt', fv(r.totalGross || 0), ''],
    ['', '', ''],
    ['KESİNTİLER', '', ''],
    ['SGK Primi (%14)', fv(r.sgkDeduct || 0), ''],
    ['İşsizlik Primi (%1)', fv(r.unempDeduct || 0), ''],
    ['Gelir Vergisi', fv(r.taxDeduct || 0), `GV Matrahı: ${fv(r.taxBase||0)}`],
    ['Damga Vergisi', fv(r.stampDeduct || 0), `Oran: ${((cfg.stampTaxRate||0)*100).toFixed(3)}%`],
    ['BES Kesintisi', fv(r.besDeduct || 0), `Oran: ${((r.besRate||0)*100).toFixed(1)}%`],
    ['İcra', fv(r.icra || 0), ''],
    ['Avans', fv(r.avans || 0), ''],
    ['Diğer Kesinti', fv(r.otherDeduct || 0), ''],
    ['Toplam Kesinti', fv(r.totalDeducts || 0), ''],
    ['', '', ''],
    ['NET ÖDEMELER', '', ''],
    ['Yasal Net', fv(r.calculatedLegalNet || r.net || 0), 'Resmi bordro neti'],
    ['Ele Geçen Net', fv(r.finalNet || r.calculatedTakeHomeNet || 0), ''],
    ['', '', ''],
    ['Politika', '', ''],
    ['Asgari Ücret', fv(cfg.minWageGross), `${r.y} yılı asgari brüt`],
    ['Hesaplama Esası', `Aylık ${cfg.monthlyStandardHours || 225} saat`, ''],
    ['Asgari Ücret Uyarısı', r.belowMinWage ? 'EVET - Asgari ücretin altında' : 'Hayır', ''],
  ];
  const csvContent = '\uFEFF' + headers.join(',') + '\n' + rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Bordro_${MTR[r.m]}_${r.y}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  toast('CSV indirildi (Excel uyumlu)', 'success');
}

// ===== KARANLIK MOD OTO-TESPİT =====
(function() {
  try {
    const u = (typeof cu === 'function') ? cu() : null;
    if (u && u.autoTheme) {
      const mq = window.matchMedia('(prefers-color-scheme: light)');
      const applyAuto = function() {
        if (!u || !u.autoTheme) return;
        u.theme = mq.matches ? 'light' : 'default';
        applyTheme(u.theme);
      };
      applyAuto();
      mq.addEventListener('change', applyAuto);
    }
  } catch(_) {}
})();

// ===== AYARLARA TEMA OTO SEÇENEĞİ EKLE =====
(function() {
  if (!renderSettings._hookedAutoTheme) {
    const _orig = renderSettings;
    renderSettings = function() {
      _orig();
      const toggle = $('autoThemeToggle');
      if (toggle) {
        const u = cu();
        if (u) toggle.checked = !!u.autoTheme;
      }
    };
    renderSettings._hookedAutoTheme = true;
  }
})();

// ===== YILLIK İZİN HAK EDİŞ HESAPLAMA =====
function calculateAnnualLeaveEntitlement(u) {
  if (!u) return { entitled: 0, used: 0, remaining: 0, totalServiceYears: 0, entryDate: null };
  const entry = u.startDate ? new Date(u.startDate) : null;
  if (!entry) return { entitled: 0, used: 0, remaining: 0, totalServiceYears: 0, entryDate: null };
  const now = new Date();
  const totalDays = Math.floor((now - entry) / (1000 * 60 * 60 * 24));
  const totalYears = totalDays / 365;
  const sYears = Math.floor(totalYears);
  let entitled = 0;
  if (sYears >= 0 && sYears < 1) entitled = 0;
  else if (sYears >= 1 && sYears < 5) entitled = Math.floor(14 + (totalYears - 1) * 0);
  else if (sYears >= 5 && sYears < 15) entitled = 20;
  else entitled = 26;
  if (entitled < 14 && sYears >= 1) entitled = 14;
  let used = 0;
  if (u.leaves) {
    Object.values(u.leaves).forEach(l => {
      if (l && l.type === 'annual') used += (l.hours || 0) / 7.5;
    });
  }
  const carryOver = u.annualLeaveCarryOver || 0;
  const remaining = Math.max(0, entitled + carryOver - Math.floor(used));
  return { entitled, used: Math.floor(used), remaining, totalServiceYears: sYears, entryDate: entry, carryOver };
}

// ===== İHBAR / KIDEM TAZMİNATI HESAPLAMA =====
function calculateSeveranceAndNotice(u) {
  if (!u) return null;
  const entry = u.startDate ? new Date(u.startDate) : null;
  if (!entry) return { severance: 0, noticePayGross: 0, noticeWeeks: 0, noticeDays: 0, totalServiceDays: 0, lastGrossWage: 0 };
  const now = new Date();
  const totalDays = Math.floor((now - entry) / (1000 * 60 * 60 * 24));
  const totalYears = totalDays / 365;
  const grossWage = u.monthlyGross || u.netSalary || 0;
  const dailyGross = grossWage / 30;
  const severance = Math.floor(totalYears) * 30 * dailyGross;
  let noticeWeeks = 0;
  const d = totalDays;
  if (d < 180) noticeWeeks = 2;
  else if (d < 547) noticeWeeks = 4;
  else if (d < 1095) noticeWeeks = 6;
  else noticeWeeks = 8;
  const noticeDays = noticeWeeks * 7;
  const noticePayGross = noticeDays * dailyGross;
  return {
    severance: Math.round(severance * 100) / 100,
    noticePayGross: Math.round(noticePayGross * 100) / 100,
    noticeWeeks,
    noticeDays,
    totalServiceDays: totalDays,
    lastGrossWage: grossWage,
    dailyGross: Math.round(dailyGross * 100) / 100,
    serviceYears: totalYears.toFixed(1),
    entryDate: entry
  };
}

// ===== VERGİ DİLİMİ HESAPLAMA =====
function calculateTaxBracketProgress(u, y) {
  if (!u) return null;
  y = y || payrollCfg().year;
  const cfg = payrollCfg(y);
  const now = new Date();
  const curM = now.getMonth();
  const curY = now.getFullYear();
  let cumYTD = 0;
  try {
    const pc = typeof getPayrollCheck === 'function' ? getPayrollCheck(u, y, curM) : null;
    if (pc) cumYTD = safeNum(pc.priorYTD, 0);
    if (!cumYTD && u.netSalary) {
      const monthGross = findGrossFromNet(u.netSalary, 'single', 0, 0, 0, undefined, y);
      const monthsToCount = y < curY ? 12 : Math.max(1, curM);
      cumYTD = monthGross * 0.85 * monthsToCount;
    }
  } catch(_) { cumYTD = 0; }
  if (cumYTD <= 0) { cumYTD = (u.netSalary || 0) * 1.5; }
  const brackets = (cfg.incomeTaxBrackets || []);
  const results = [];
  let remaining = cumYTD;
  let totalTax = 0;
  let currentBracket = 0;
  let remainingToNextBracket = 0;
  let highestRateReached = 0;
  brackets.forEach((b, i) => {
    const limit = b.upTo;
    const rate = b.rate;
    const bracketAmount = Math.min(remaining, limit - (i > 0 ? brackets[i-1].upTo : 0));
    if (remaining > 0) {
      const tax = bracketAmount * rate;
      totalTax += tax;
      remaining -= bracketAmount;
      if (bracketAmount > 0) {
        currentBracket = i + 1;
        highestRateReached = rate;
      }
    }
    const exhausted = cumYTD > limit;
    results.push({ bracket: i + 1, upTo: limit, rate: rate * 100, amountInBracket: Math.max(0, bracketAmount), exhausted });
  });
  remainingToNextBracket = brackets[currentBracket] ? brackets[currentBracket].upTo - cumYTD : 0;
  if (remainingToNextBracket < 0) remainingToNextBracket = 0;
  return {
    cumYTD,
    totalTax: Math.round(totalTax * 100) / 100,
    currentBracket,
    remainingToNextBracket: Math.round(remainingToNextBracket * 100) / 100,
    highestRateReached: highestRateReached * 100,
    brackets: results,
    year: y
  };
}

// ===== TAZMİNAT VE İZİN MODAL AÇMA =====
function openSeveranceModal() {
  const u = cu(); if (!u) { toast('Önce kullanıcı profili oluşturun', 'warning'); return; }
  const sv = calculateSeveranceAndNotice(u);
  const lv = calculateAnnualLeaveEntitlement(u);
  let h = '';
  if (!sv || sv.totalServiceDays <= 0) {
    h = '<p style="color:var(--t2);text-align:center;padding:20px">İşe giriş tarihi belirtilmedi. Lütfen Ayarlar → Profil → İşe Giriş Tarihi alanını doldurun.</p>';
  } else {
    h = `
    <div class="card" style="margin-bottom:12px"><div class="card-head"><h3><i class="fas fa-briefcase"></i>İhbar Tazminatı</h3></div>
    <div class="info-list">
      <div class="info-row"><span class="k">İhbar Süresi</span><span class="v">${sv.noticeWeeks} hafta (${sv.noticeDays} gün)</span></div>
      <div class="info-row"><span class="k">Günlük Brüt</span><span class="v">${fm(sv.dailyGross)}</span></div>
      <div class="info-row"><span class="k">İhbar Tazminatı (Brüt)</span><span class="v">${fm(sv.severanceNotice || sv.noticePayGross)}</span></div>
    </div></div>
    <div class="card" style="margin-bottom:12px"><div class="card-head"><h3><i class="fas fa-coins"></i>Kıdem Tazminatı</h3></div>
    <div class="info-list">
      <div class="info-row"><span class="k">Hizmet Süresi</span><span class="v">${sv.serviceYears} yıl (${sv.totalServiceDays} gün)</span></div>
      <div class="info-row"><span class="k">Son Brüt Maaş</span><span class="v">${fm(sv.lastGrossWage)}</span></div>
      <div class="info-row"><span class="k">Kıdem Tazminatı</span><span class="v pos">${fm(sv.severance)}</span></div>
      <div class="info-row"><span class="k">Kıdem Tavanı (2026)</span><span class="v">${fm(42860)}</span></div>
    </div></div>
    <div class="card" style="margin-bottom:12px"><div class="card-head"><h3><i class="fas fa-umbrella-beach"></i>Yıllık İzin</h3></div>
    <div class="info-list">
      <div class="info-row"><span class="k">Hizmet Yılı</span><span class="v">${lv.totalServiceYears} yıl</span></div>
      <div class="info-row"><span class="k">Hak Edilen</span><span class="v">${lv.entitled} gün</span></div>
      <div class="info-row"><span class="k">Kullanılan</span><span class="v warn">${lv.used} gün</span></div>
      <div class="info-row"><span class="k">Devreden</span><span class="v">${lv.carryOver} gün</span></div>
      <div class="info-row"><span class="k" style="font-weight:800">Kalan</span><span class="v pos">${lv.remaining} gün</span></div>
    </div></div>
    <div class="card"><div class="card-head"><h3><i class="fas fa-chart-bar"></i>Vergi Dilimi (${sv.noticePayGross > 0 ? '' : 'Cari Yıl'})</h3></div>
    ${renderTaxBracketSummary(u)}
    </div>`;
  }
  const modal = $('modal'); if (!modal) return;
  const top = modal.querySelector('.modal-top');
  const body = modal.querySelector('.modal-body');
  const foot = modal.querySelector('.modal-foot');
  if (top) top.innerHTML = '<h3><i class="fas fa-calculator"></i> İhbar / Kıdem / İzin / Vergi</h3><button class="modal-x" onclick="closeM()" aria-label="Kapat"><i class="fas fa-times"></i></button>';
  if (body) body.innerHTML = h;
  if (foot) foot.innerHTML = '<button class="btn btn-ghost btn-sm" onclick="closeM()">Kapat</button>';
  modal.classList.add('show');
}

function renderTaxBracketSummary(u) {
  const y = payrollCfg().year;
  const tp = calculateTaxBracketProgress(u, y);
  if (!tp) return '<p style="color:var(--t2);text-align:center">Veri yok</p>';
  let h = `<div class="info-list"><div class="info-row"><span class="k">Kümülatif GV Matrahı</span><span class="v">${fm(tp.cumYTD)}</span></div>
  <div class="info-row"><span class="k">Mevcut Dilim</span><span class="v">${tp.currentBracket}. Dilim (%${tp.highestRateReached})</span></div>
  <div class="info-row"><span class="k">Sonraki Dilime Kalan</span><span class="v">${fm(tp.remainingToNextBracket)}</span></div></div>`;
  h += '<div style="margin-top:10px"><table style="width:100%;font-size:11px;border-collapse:collapse"><tr style="color:var(--t2)"><th style="text-align:left;padding:4px">Dilim</th><th style="text-align:right;padding:4px">Üst Sınır</th><th style="text-align:right;padding:4px">Oran</th><th style="text-align:right;padding:4px">Kullanılan</th></tr>';
  tp.brackets.forEach(b => {
    const style = b.exhausted ? 'opacity:.4' : (b.bracket === tp.currentBracket ? 'font-weight:700;color:var(--p)' : '');
    h += `<tr style="${style};border-bottom:1px solid var(--b1)"><td style="padding:4px">${b.bracket}. Dilim</td><td style="text-align:right;padding:4px">${fm(b.upTo)}</td><td style="text-align:right;padding:4px">%${b.rate}</td><td style="text-align:right;padding:4px">${b.amountInBracket > 0 ? fm(b.amountInBracket) : '-'}</td></tr>`;
  });
  h += '</table></div>';
  return h;
}

// change listener, openEBordroModal() içinde _ebHooked guard ile eklenir
// ===== eBORDRO MODULE END =====