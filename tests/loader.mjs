// Faz 0 test yükleyici — app.js'i DEĞİŞTİRMEDEN saf fonksiyonları izole eder.
// app.js tarayıcı için tek-parça global script olduğundan (modül sistemi yok), burada
// hedef fonksiyonların geçişli (transitive) bağımlılık kapanışını kaynaktan çıkarıp
// izole bir sandbox'ta değerlendiririz. Böylece firebase/DOM yüklemeden bordro/sayı
// fonksiyonlarını GERÇEK koddan test edebiliriz.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = readFileSync(join(__dirname, '..', 'app.js'), 'utf-8');
const LINES = SRC.split('\n');

const FN_RE = /^function ([a-zA-Z_$][\w$]*)\s*\(/;
const CONST_RE = /^(?:const|let|var) ([a-zA-Z_$][\w$]*)\s*=/;

// Tüm top-level function ve basit const/var tanımlarını brace eşleyerek indeksle.
const defs = new Map();
for (let i = 0; i < LINES.length; ) {
  const l = LINES[i];
  let m = FN_RE.exec(l);
  if (m) {
    let depth = 0, started = false, j = i;
    for (; j < LINES.length; j++) {
      for (const ch of LINES[j]) { if (ch === '{') { depth++; started = true; } else if (ch === '}') depth--; }
      if (started && depth <= 0) break;
    }
    defs.set(m[1], [i, j]); i = j + 1; continue;
  }
  m = CONST_RE.exec(l);
  if (m) {
    let depth = 0, j = i;
    for (; j < LINES.length; j++) {
      for (const ch of LINES[j]) {
        if ('{[('.includes(ch)) depth++; else if (')]}'.includes(ch)) depth--;
      }
      if (depth <= 0 && LINES[j].trimEnd().endsWith(';')) break;
    }
    defs.set(m[1], [i, j]); i = j + 1; continue;
  }
  i++;
}

function bodyOf(name) { const [a, b] = defs.get(name); return LINES.slice(a, b + 1).join('\n'); }

function depsOf(name) {
  const b = bodyOf(name);
  const ids = new Set();
  for (const mm of b.matchAll(/\b([a-zA-Z_$][\w$]*)\b/g)) {
    if (defs.has(mm[1]) && mm[1] !== name) ids.add(mm[1]);
  }
  return ids;
}

// İstenen hedeflerin geçişli bağımlılık kapanışını topla, kaynak sırasını koruyarak
// izole bir Function sandbox'ında değerlendir ve hedefleri dışa ver.
export function loadFns(targets) {
  const seen = new Set();
  const stack = [...targets];
  while (stack.length) {
    const n = stack.pop();
    if (seen.has(n) || !defs.has(n)) continue;
    seen.add(n);
    for (const d of depsOf(n)) if (!seen.has(d)) stack.push(d);
  }
  const ordered = [...seen].filter(n => defs.has(n)).sort((a, b) => defs.get(a)[0] - defs.get(b)[0]);
  const code = ordered.map(bodyOf).join('\n');
  const ret = '\nreturn {' + targets.filter(t => defs.has(t)).join(',') + '};';
  // eslint-disable-next-line no-new-func
  return Function('"use strict";' + code + ret)();
}

export const hasDef = (name) => defs.has(name);
