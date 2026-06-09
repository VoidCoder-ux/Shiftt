// ESLint yapılandırması — pragmatik başlangıç.
// app.js tarayıcı için tek-parça global script olduğundan (modül sistemi yok),
// onda yalnızca GERÇEK hata yakalayan kurallar açık tutulur; stil kuralları ve
// global tanım gerektiren kurallar (no-undef/no-unused-vars) kapalıdır.
// Test/yapılandırma dosyaları (ESM) tam recommended set ile denetlenir.
import js from '@eslint/js';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'config.js'] },

  // ESM dosyaları: testler + vite config
  {
    files: ['tests/**/*.mjs', 'vite.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { process: 'readonly', console: 'readonly', URL: 'readonly' },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  // Tarayıcı global script'leri: app.js, sw.js, version.js
  {
    files: ['app.js', 'sw.js', 'version.js', 'config.example.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
    },
    rules: {
      // Yalnızca hata yakalayan çekirdek kurallar — global'ler dosyalar arası
      // paylaşıldığından no-undef/no-unused-vars bu aşamada kapalı.
      'no-dupe-keys': 'error',
      'no-dupe-args': 'error',
      'no-duplicate-case': 'error',
      'no-unreachable': 'error',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': 'error',
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-self-assign': 'error',
      'no-self-compare': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
      'no-debugger': 'error',
      // app.js render hook'ları fonksiyon bildirimlerini bilinçli sarmalayıp
      // yeniden atar ([FIX JS-FONKSİYON-01] _hooked deseni) — kapalı.
      'no-func-assign': 'off',
      'no-import-assign': 'error',
      'no-obj-calls': 'error',
      'no-sparse-arrays': 'error',
      'no-unsafe-negation': 'error',
      'getter-return': 'error',
      'no-setter-return': 'error',
      'no-async-promise-executor': 'error',
      'no-misleading-character-class': 'error',
      'no-prototype-builtins': 'off',
    },
  },
];
