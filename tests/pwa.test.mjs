import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { existsSync, readFileSync } from 'node:fs';

test('SW activation deletes only obsolete Shiftt version caches', async () => {
  const listeners={},deleted=[]; let task;
  const context=vm.createContext({APP_VERSION:'shifttrack-v74',importScripts() {},
    self:{addEventListener:(name,cb)=>listeners[name]=cb,clients:{claim:async()=>{}}},
    caches:{keys:async()=>['shifttrack-v73','shifttrack-v74','shifttrack-cdn-v1','other-app-cache','workbox-other'],
      delete:async key=>{deleted.push(key);return true;}},
  });
  vm.runInContext(readFileSync(new URL('../sw.js',import.meta.url),'utf8'),context);
  listeners.activate({waitUntil:p=>task=p}); await task;
  assert.deepEqual(deleted,['shifttrack-v73']);
});

test('page bootstrap does not unregister other service workers or clear shared caches', () => {
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  assert.ok(!html.includes('getRegistrations()'));
  assert.ok(!html.includes('caches.delete('));
});

test('raw manifest contains only existing icons and shortcut targets', () => {
  const root=new URL('../',import.meta.url),manifest=JSON.parse(readFileSync(new URL('manifest.json',root)));
  assert.ok(existsSync(new URL(manifest.start_url,root)));
  for (const icon of manifest.icons) assert.ok(existsSync(new URL(icon.src,root)),icon.src);
  for (const shortcut of manifest.shortcuts) {
    const target=new URL(shortcut.url,root); target.search='';
    assert.ok(existsSync(target),shortcut.url);
    for (const icon of shortcut.icons) assert.ok(existsSync(new URL(icon.src,root)),icon.src);
  }
});
