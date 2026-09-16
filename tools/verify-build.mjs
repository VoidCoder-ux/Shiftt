import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const root=new URL('../dist/',import.meta.url);
const html=readFileSync(new URL('index.html',root),'utf8');
const link=html.match(/rel="manifest" href="([^"]+)"/);
assert.ok(link,'Built page must link a manifest');
const manifestURL=new URL(link[1],root);
const manifest=JSON.parse(readFileSync(manifestURL,'utf8'));
const urls=[manifest.start_url,...manifest.icons.map(i=>i.src),
  ...(manifest.screenshots||[]).map(i=>i.src),
  ...manifest.shortcuts.flatMap(s=>[s.url,...s.icons.map(i=>i.src)])];
for (const path of urls) {
  const target=new URL(path,manifestURL); target.search='';
  assert.ok(existsSync(target),'Missing manifest target: '+path);
}
for (const path of ['app.js','version.js','sw.js']) assert.ok(existsSync(new URL(path,root)),path);
console.log('PWA build verified: manifest start URL, icons, shortcuts and service worker exist.');
