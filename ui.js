/* ============================================================
   Shiftt v2 — Arayüz kontrolcüsü
   Yerel-öncelik + opsiyonel bulut senkronu. Aylık girişleri saklar,
   gelir vergisi kümülatif matrahını (priorYTD) OTOMATİK zincirler —
   kullanıcı devreden matrah girmek zorunda değildir.
============================================================ */
import { computeBordro, round2, safeNum, setTaxConfig, payrollCfg } from './engine.js';
import * as cloud from './sync.js';

const MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const LS_KEY = 'shiftt_v2';
const $ = (id) => document.getElementById(id);
const mkey = (y, m) => `${y}-${String(m + 1).padStart(2, '0')}`;
const TRY = (n) => '₺' + Number(round2(n)).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const NUM = (n) => Number(round2(n)).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ---------- Durum ---------- */
const DEFAULT_MONTH = { normalDays: 0, weeklyRestDays: 0, publicHolidayDays: 0, publicHolidayWorkedDays: 0, otHours: 0, ot125Hours: 0 };
let state = {
  name: '', dailyNetWage: 0, sgkExemptEarn: 0, otRate: 1.5,
  taxBrackets2026: null,        // [{upTo,rate}] | null
  months: {}, _updatedAt: 0,
};
const now = new Date();
let sel = { y: now.getFullYear(), m: now.getMonth() };
let cloudUser = null;

/* ---------- Kalıcılık ---------- */
function loadLocal() {
  try { const raw = localStorage.getItem(LS_KEY); if (raw) state = { ...state, ...JSON.parse(raw) }; } catch (e) {}
  applyTaxOverride();
}
function persist() {
  state._updatedAt = Date.now();
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {}
  cloud.saveCloud(state);
}
function applyTaxOverride() {
  if (Array.isArray(state.taxBrackets2026) && state.taxBrackets2026.length) {
    setTaxConfig(2026, { incomeTaxBrackets: state.taxBrackets2026.map(b => ({ upTo: b.upTo === null ? Infinity : safeNum(b.upTo, Infinity), rate: safeNum(b.rate, 0) })) });
  }
}
function monthEntry(y, m) { return { ...DEFAULT_MONTH, ...(state.months[mkey(y, m)] || {}) }; }

/* ---------- Kümülatif priorYTD (otomatik zincir) ---------- */
function priorYTDFor(y, m) {
  let prior = 0;
  for (let mm = 0; mm < m; mm++) {
    const e = state.months[mkey(y, mm)];
    if (!e) continue;
    const r = computeBordro({ ...settingsObj(), ...e, priorYTD: prior, year: y, month: mm });
    prior = round2(prior + r.gvMatrah);
  }
  return round2(prior);
}
function settingsObj() {
  return { dailyNetWage: safeNum(state.dailyNetWage, 0), sgkExemptEarn: safeNum(state.sgkExemptEarn, 0), otRate: safeNum(state.otRate, 1.5) };
}
function currentBordro() {
  const e = monthEntry(sel.y, sel.m);
  const prior = priorYTDFor(sel.y, sel.m);
  return computeBordro({ ...settingsObj(), ...e, priorYTD: prior, year: sel.y, month: sel.m });
}

/* ============================================================
   RENDER — ana ekran
============================================================ */
function renderApp() {
  const root = $('root');
  root.innerHTML = `
    <div class="app">
      <div class="topbar">
        <div class="brand"><span class="logo">🧾</span> Bordro</div>
        <div class="spacer"></div>
        <div class="cloud-dot ${cloudUser ? 'on' : 'off'}" id="cloudDot" title="Bulut">
          <i class="fas fa-circle"></i><span>${cloudUser ? 'Senkron' : 'Yerel'}</span>
        </div>
        <button class="icon-btn" id="cloudBtn" title="Hesap"><i class="fas fa-${cloudUser ? 'user-check' : 'cloud'}"></i></button>
      </div>

      <div class="monthbar">
        <button id="prevM"><i class="fas fa-chevron-left"></i></button>
        <div class="cur">${MONTHS[sel.m]} ${sel.y}<small>ÇALIŞMA DÖNEMİ</small></div>
        <button id="nextM"><i class="fas fa-chevron-right"></i></button>
      </div>

      <!-- Ayın çalışması -->
      <div class="card">
        <h2><i class="fas fa-calendar-check"></i> Bu Ayın Çalışması</h2>
        <div class="grid2">
          ${stepper('normalDays', 'Normal çalışma', 'gün')}
          ${stepper('weeklyRestDays', 'Hafta tatili', 'gün')}
          ${stepper('publicHolidayDays', 'Genel tatil', 'gün', 'Ayın tüm resmi tatil günleri')}
          ${stepper('publicHolidayWorkedDays', 'Tatilde çalışılan', 'gün', 'Çift ücret alınan')}
          ${numFld('otHours', 'Fazla mesai', 'saat', '%50 zamlı')}
          ${numFld('ot125Hours', 'Fazla çalışma', 'saat', '%25 (45s altı sözleşme)')}
        </div>
      </div>

      <!-- Bordro çıktısı -->
      <div id="slip"></div>

      <div class="btn-row" style="margin:14px 0 6px">
        <button class="btn btn-ghost" id="printBtn"><i class="fas fa-print"></i> Yazdır / PDF</button>
        <button class="btn btn-ghost" id="setBtn"><i class="fas fa-sliders-h"></i> Ayarlar</button>
      </div>

      <!-- Ayarlar -->
      <div class="card hidden" id="setCard">
        <h2><i class="fas fa-sliders-h"></i> Ayarlar</h2>
        <div class="fld"><label>Ad Soyad</label><input id="s_name" type="text" placeholder="Adınız" value="${esc(state.name)}"></div>
        <div class="fld"><label>Günlük Net Yevmiye (₺) <small>(bordroda ÜCRET PERİYO: G-Net)</small></label>
          <input id="s_daily" type="number" inputmode="decimal" placeholder="1440" value="${state.dailyNetWage || ''}"></div>
        <div class="fld"><label>SGK-Muaf Ek Kazanç (₺) <small>(alış-veriş/yemek kartı — vergiye tabi)</small></label>
          <input id="s_ek" type="number" inputmode="decimal" placeholder="0" value="${state.sgkExemptEarn || ''}"></div>
        <div class="fld"><label>Fazla Mesai Katsayısı</label>
          <input id="s_ot" type="number" inputmode="decimal" step="0.25" placeholder="1.5" value="${state.otRate || 1.5}"></div>

        <div class="collapse-h" id="advHead" style="margin-top:8px;padding-top:12px;border-top:1px solid var(--line)">
          <span class="muted"><i class="fas fa-wrench"></i> Gelişmiş — 2026 gelir vergisi dilimleri</span>
          <i class="fas fa-chevron-down chev"></i>
        </div>
        <div class="hidden" id="advBody" style="margin-top:10px">
          <p class="muted" style="margin-bottom:8px">İşvereninizin kullandığı 2026 dilimleri farklıysa %15 üst sınırını buraya yazın. Boş bırakırsanız varsayılan (190.000 ₺) kullanılır.</p>
          ${taxRow(0, '%15 üst sınır', 190000)}
          ${taxRow(1, '%20 üst sınır', 400000)}
          ${taxRow(2, '%27 üst sınır', 1500000)}
          <button class="btn btn-ghost btn-sm" id="saveTax" style="margin-top:8px">Dilimleri Kaydet</button>
        </div>
      </div>

      <p class="muted" style="text-align:center;margin-top:14px">Tahmini bordro kontrolüdür; resmi bordro yerine geçmez.</p>
    </div>`;

  // statik input değerlerini doldur
  const e = monthEntry(sel.y, sel.m);
  ['normalDays','weeklyRestDays','publicHolidayDays','publicHolidayWorkedDays','otHours','ot125Hours'].forEach(k => {
    const el = $('f_' + k); if (el) el.value = e[k] || '';
  });
  // 2026 dilim alanları
  if (Array.isArray(state.taxBrackets2026)) {
    state.taxBrackets2026.slice(0,3).forEach((b,i)=>{ const el=$('tx_'+i); if(el&&b.upTo!=null) el.value=b.upTo; });
  }
  wire();
  renderSlip();
}

function stepper(key, label, unit, hint) {
  return `<div class="fld"><label>${label} ${hint ? `<small>(${hint})</small>` : ''}</label>
    <div class="stepper">
      <button type="button" data-step="-1" data-k="${key}">−</button>
      <input id="f_${key}" type="number" inputmode="numeric" min="0" placeholder="0">
      <button type="button" data-step="1" data-k="${key}">+</button>
    </div></div>`;
}
function numFld(key, label, unit, hint) {
  return `<div class="fld"><label>${label} ${hint ? `<small>(${hint})</small>` : ''}</label>
    <input id="f_${key}" type="number" inputmode="decimal" min="0" step="0.5" placeholder="0 ${unit}"></div>`;
}
function taxRow(i, label, ph) {
  return `<div class="fld"><label>${label} (₺)</label><input id="tx_${i}" type="number" inputmode="numeric" placeholder="${ph}"></div>`;
}

/* ---------- Bordro kartı ---------- */
function renderSlip() {
  const b = currentBordro();
  const has = b.dailyNetWage > 0 && b.paidDays > 0;
  const slip = $('slip');
  if (!slip) return;
  if (!has) {
    slip.innerHTML = `<div class="card" style="text-align:center;color:var(--txt3)">
      <i class="fas fa-info-circle" style="font-size:22px;color:var(--pri2)"></i>
      <p style="margin-top:8px">Ayarlar'dan <b>günlük net yevmiye</b> girin ve yukarıdan bu ayın günlerini doldurun.</p></div>`;
    return;
  }
  const prior = priorYTDFor(sel.y, sel.m);
  const cfg = payrollCfg(sel.y);
  const bracket = b.ytdMatrah > 0 ? (cfg.incomeTaxBrackets.find(x => b.ytdMatrah <= x.upTo) || cfg.incomeTaxBrackets[cfg.incomeTaxBrackets.length-1]) : cfg.incomeTaxBrackets[0];
  const row = (k, v, cls = '', sub = '') => `<div class="row ${cls}"><span class="k">${k}${sub ? ` <small>${sub}</small>` : ''}</span><span class="v">${v}</span></div>`;

  slip.innerHTML = `
    <div class="slip">
      <div class="slip-head">
        <div><div class="who">${esc(state.name) || 'Çalışan'}</div><div class="per">${MONTHS[sel.m]} ${sel.y} • ${NUM(b.paidDays)} ödenen gün</div></div>
        <div class="net-badge"><div class="lbl">Net Maaş</div><div class="val">${TRY(b.net)}</div></div>
      </div>
      <div class="slip-sec">
        <div class="sec-t">Kazançlar</div>
        ${b.normalGross > 0 ? row('Normal Çalışma', TRY(b.normalGross), 'add', `${NUM(b.normalDays)}g`) : ''}
        ${b.weeklyRestGross > 0 ? row('Hafta Tatili', TRY(b.weeklyRestGross), 'add', `${NUM(b.weeklyRestDays)}g`) : ''}
        ${b.publicHolidayGross > 0 ? row('Genel Tatil', TRY(b.publicHolidayGross), 'add', `${NUM(b.publicHolidayDays)}g`) : ''}
        ${b.publicHolidayWorkGross > 0 ? row('Genel Tatil (Çalıştı)', TRY(b.publicHolidayWorkGross), 'add', `${NUM(b.publicHolidayWorkDays)}g`) : ''}
        ${b.otGross > 0 ? row('Fazla Mesai', TRY(b.otGross), 'add', `${NUM(b.otHours)}s × ${b.otRate}`) : ''}
        ${b.ot125Gross > 0 ? row('Fazla Çalışma', TRY(b.ot125Gross), 'add', `${NUM(b.ot125Hours)}s × ${b.partialRate}`) : ''}
        ${b.sgkExemptEarn > 0 ? row('SGK-Muaf Ek Kazanç', TRY(b.sgkExemptEarn), 'add') : ''}
        ${row('TOPLAM BRÜT', TRY(b.totalGross), 'sum')}
      </div>
      <div class="slip-sec">
        <div class="sec-t">Yasal Kesintiler</div>
        ${row('SGK İşçi Payı', '− ' + TRY(b.sgkDeduction), 'ded', '%14')}
        ${row('İşsizlik Sigortası', '− ' + TRY(b.unemployDeduct), 'ded', '%1')}
        ${row('Gelir Vergisi', '− ' + TRY(b.incomeTax), 'ded', `%${(bracket.rate*100).toFixed(0)} − istisna`)}
        ${row('Damga Vergisi', '− ' + TRY(b.stampTax), 'ded')}
        ${row('KESİNTİ TOPLAMI', '− ' + TRY(b.legalDeductions), 'sum')}
        ${row('NET ÖDENEN', TRY(b.net), 'grand')}
      </div>
      <div class="slip-sec" style="padding-bottom:14px">
        <div class="row" style="border:none"><span class="k muted">Devreden GV matrahı (otomatik)</span><span class="v muted">${TRY(prior)}</span></div>
        <div class="row" style="border:none"><span class="k muted">Tatil/mesai saatlik brüt</span><span class="v muted">${TRY(b.hourlyGross)}</span></div>
      </div>
    </div>`;
}

/* ============================================================
   Olay bağlama
============================================================ */
function wire() {
  $('prevM').onclick = () => { sel.m--; if (sel.m < 0) { sel.m = 11; sel.y--; } renderApp(); };
  $('nextM').onclick = () => { sel.m++; if (sel.m > 11) { sel.m = 0; sel.y++; } renderApp(); };

  // gün/saat inputları
  document.querySelectorAll('[id^="f_"]').forEach(inp => {
    inp.addEventListener('input', () => {
      const k = inp.id.slice(2);
      const ent = { ...monthEntry(sel.y, sel.m), [k]: Math.max(0, safeNum(inp.value, 0)) };
      state.months[mkey(sel.y, sel.m)] = ent;
      persist(); renderSlip();
    });
  });
  document.querySelectorAll('[data-step]').forEach(btn => {
    btn.onclick = () => {
      const k = btn.dataset.k, d = +btn.dataset.step;
      const inp = $('f_' + k);
      const nv = Math.max(0, safeNum(inp.value, 0) + d);
      inp.value = nv || '';
      const ent = { ...monthEntry(sel.y, sel.m), [k]: nv };
      state.months[mkey(sel.y, sel.m)] = ent;
      persist(); renderSlip();
    };
  });

  // ayarlar
  $('setBtn').onclick = () => $('setCard').classList.toggle('hidden');
  $('printBtn').onclick = () => window.print();
  const bindSet = (id, key, num = true) => { const el = $(id); if (el) el.addEventListener('input', () => { state[key] = num ? Math.max(0, safeNum(el.value, 0)) : el.value; persist(); renderSlip(); }); };
  bindSet('s_name', 'name', false);
  bindSet('s_daily', 'dailyNetWage');
  bindSet('s_ek', 'sgkExemptEarn');
  $('s_ot') && $('s_ot').addEventListener('input', () => { state.otRate = Math.min(3, Math.max(1.5, safeNum($('s_ot').value, 1.5))); persist(); renderSlip(); });

  // gelişmiş vergi dilimleri
  $('advHead').onclick = () => { $('advHead').classList.toggle('open'); $('advBody').classList.toggle('hidden'); };
  $('saveTax').onclick = () => {
    const ups = [0,1,2].map(i => safeNum($('tx_' + i).value, 0));
    if (ups.some(u => u <= 0)) { toast('Üç dilim sınırını da girin', 'err'); return; }
    state.taxBrackets2026 = [
      { upTo: ups[0], rate: .15 }, { upTo: ups[1], rate: .20 }, { upTo: ups[2], rate: .27 },
      { upTo: 5300000, rate: .35 }, { upTo: null, rate: .40 },
    ];
    applyTaxOverride(); persist(); renderSlip(); toast('2026 dilimleri kaydedildi', 'ok');
  };

  // bulut / hesap
  $('cloudBtn').onclick = () => cloudUser ? openAccount() : openAuth();
}

/* ============================================================
   Auth ekranı (modal)
============================================================ */
function openAuth() {
  const root = $('root');
  const ov = document.createElement('div');
  ov.className = 'auth-wrap';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:50';
  ov.innerHTML = `
    <div class="auth-card">
      <div class="brand"><span class="logo">🧾</span> Bordro</div>
      <div class="tag">Verilerini buluta kaydet, her cihazda eriş</div>
      <div class="auth-tabs"><button class="on" id="tabLogin">Giriş</button><button id="tabReg">Kayıt</button></div>
      <div class="fld"><label>E-posta</label><input id="a_email" type="email" placeholder="ornek@mail.com"></div>
      <div class="fld"><label>Şifre</label><input id="a_pass" type="password" placeholder="••••••"></div>
      <button class="btn btn-pri" id="a_go" style="margin-top:6px">Giriş Yap</button>
      <div id="a_msg"></div>
      <div class="auth-skip"><a href="#" id="a_forgot">Şifremi unuttum</a> · <a href="#" id="a_close">Yerel devam et</a></div>
    </div>`;
  document.body.appendChild(ov);
  let mode = 'login';
  const setMode = (m) => { mode = m; $('tabLogin').classList.toggle('on', m === 'login'); $('tabReg').classList.toggle('on', m === 'reg'); $('a_go').textContent = m === 'login' ? 'Giriş Yap' : 'Kayıt Ol'; };
  $('tabLogin').onclick = () => setMode('login');
  $('tabReg').onclick = () => setMode('reg');
  const msg = (t, cls) => $('a_msg').innerHTML = `<div class="auth-msg ${cls}">${t}</div>`;
  $('a_go').onclick = async () => {
    const em = $('a_email').value, pw = $('a_pass').value;
    if (!em || !pw) return msg('E-posta ve şifre girin', 'err');
    $('a_go').textContent = '...';
    try {
      if (mode === 'login') await cloud.login(em, pw); else await cloud.register(em, pw);
      ov.remove();
    } catch (e) { msg(cloud.authErrorTR(e), 'err'); $('a_go').textContent = mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'; }
  };
  $('a_forgot').onclick = async (ev) => { ev.preventDefault(); const em = $('a_email').value; if (!em) return msg('Önce e-posta girin', 'err'); try { await cloud.resetPass(em); msg('Sıfırlama e-postası gönderildi', 'ok'); } catch (e) { msg(cloud.authErrorTR(e), 'err'); } };
  $('a_close').onclick = (ev) => { ev.preventDefault(); ov.remove(); };
}
function openAccount() {
  if (confirm(`${cloudUser.email}\n\nÇıkış yapılsın mı? (yerel veriler cihazda kalır)`)) {
    cloud.logout().then(() => toast('Çıkış yapıldı'));
  }
}

/* ============================================================
   Bulut senkron köprüsü
============================================================ */
function adoptRemote(remote) {
  if (!remote) return;
  const localT = safeNum(state._updatedAt, 0), remoteT = safeNum(remote._updatedAt, 0);
  if (remoteT >= localT) {
    state = { ...state, ...remote };
    applyTaxOverride();
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {}
    renderApp();
  } else {
    cloud.saveCloud(state); // yerel daha yeni → buluta it
  }
}

function start() {
  loadLocal();
  renderApp();
  cloud.initCloud({
    onUser: async (u) => {
      cloudUser = u;
      const dot = $('cloudDot');
      if (u) {
        const remote = await cloud.loadOnce();
        adoptRemote(remote);
        if (!remote) cloud.saveCloud(state);
        toast('Buluta bağlandı', 'ok');
      }
      renderApp();
    },
    onRemote: (remote) => adoptRemote(remote),
  });
}

/* ---------- yardımcılar ---------- */
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
let _tt;
function toast(msg, cls = '') {
  let t = $('toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.className = 'toast show ' + cls;
  clearTimeout(_tt); _tt = setTimeout(() => t.className = 'toast ' + cls, 2400);
}

start();
