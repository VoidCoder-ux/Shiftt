import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
function functionSource(name) {
  const start = source.indexOf('function ' + name + '(');
  assert.ok(start >= 0, name);
  const prefix = source.slice(start - 6, start) === 'async ' ? 'async ' : '';
  return prefix + source.slice(start, source.indexOf('\n}', start) + 2);
}
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const tick = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
function sandbox(extra = {}) {
  const timers = new Map(), saved = [], statuses = [], storage = new Map();
  let timerId = 0;
  const context = vm.createContext({
    console: { warn() {}, error() {} }, Date, Math, JSON, Set, Promise,
    S: { u: {}, deletedUsers: {}, nextUid:3, cu:1 }, fbUser:{uid:'A'}, fbDb:{},
    _authEpoch:0, _syncGen:0, syncInProgress:false, syncTimer:null,
    lastSyncTime:0, lastSnapshotJson:'', unsubscribeSnapshot:null,
    _documentUploadTask:null, _loadCloudDocsBusy:false, _cloudFailNotified:false,
    SYNC_DEBOUNCE:3000, SYNC_TIMEOUT:15000, DATA_VERSION:1,
    setTimeout(fn) { const id = ++timerId; timers.set(id, fn); return id; },
    clearTimeout(id) { timers.delete(id); },
    saveLS(options) { saved.push(options); return true; },
    setSyncState(state) { statuses.push(state); },
    localStorage: { removeItem:key=>storage.delete(key), setItem:(k,v)=>storage.set(k,v), getItem:k=>storage.get(k) ?? null },
    sessionStorage:{removeItem() {}}, PAYROLL_OVERRIDE_KEY:'st_payroll_overrides',
    undoStack:[], _payrollOverrides:{}, _payrollCfgCache:{}, _eBordroSession:{}, _rsBaseCache:{},
    currentDocFile:null, currentViewDoc:null, _forceSyncBusy:false,
    invalidateMDCache() {}, toast() {}, notifyCloudFail() {}, cu:()=>null,
    mergeDeletedUsers:(a,b)=>({...a,...b}), deepMergeUser:(a,b)=>({...b,...a}),
    mergePayrollOverridesFromCloud() {}, mergePayrollOverridesForCloud:x=>x || {},
    safeInt:v=>Number(v)||0, getDeviceId:()=> 'local',
    firebase:{firestore:{FieldValue:{serverTimestamp:()=>123}}},
    document:{querySelector:()=>null},
    ...extra,
  });
  for (const name of ['cloudSession','isCloudSessionCurrent','invalidateCloudSession','stopRealtimeSync',
    'wipeLocalSensitiveData','cloneUsersForCloud','mergeUsersMap','pushToCloud','pullFromCloud',
    'startRealtimeSync','debouncedPush','uploadPendingDocuments','loadCloudDocs','saveDocument']) {
    vm.runInContext(functionSource(name), context);
  }
  return { c:context, timers, saved, statuses, storage };
}
const snapshot = users => ({ exists:true, data:()=>({users, deviceId:'remote'}) });

test('late pull after account switch cannot apply data or invoke callback', async () => {
  const read = deferred(); let callback = 0;
  const {c,saved} = sandbox({fbDb:{collection:()=>({doc:()=>({get:()=>read.promise})})}});
  const job = c.pullFromCloud(()=>callback++);
  c.invalidateCloudSession(); c.fbUser={uid:'B'};
  c.S.u={2:{name:'B'}};
  read.resolve(snapshot({1:{name:'A private'}})); await job;
  assert.equal(c.S.u[1],undefined); assert.equal(c.S.u[2].name,'B');
  assert.equal(saved.length,0); assert.equal(callback,0);
});

test('late pull after timeout/new operation cannot override newer state', async () => {
  const read = deferred(); const {c,timers} = sandbox({fbDb:{collection:()=>({doc:()=>({get:()=>read.promise})})}});
  const job=c.pullFromCloud(); [...timers.values()][0]();
  c._syncGen++; c.S.u={1:{name:'new'}};
  read.resolve(snapshot({2:{name:'stale'}})); await job;
  assert.equal(c.S.u[2],undefined);
});

test('push transaction retry after account switch never writes new account state to old path', async () => {
  const read=deferred(); let writes=0, callbacks=0;
  const {c}=sandbox({fbDb:{collection:()=>({doc:uid=>({uid})}),runTransaction:fn=>fn({get:()=>read.promise,set:()=>writes++})}});
  c.S.u={1:{name:'A'}};
  const job=c.pushToCloud(()=>callbacks++); await tick();
  c.invalidateCloudSession(); c.fbUser={uid:'B'}; c.S.u={1:{name:'B'}};
  read.resolve(snapshot({})); await job;
  assert.equal(writes,0); assert.equal(callbacks,0); assert.equal(c.S.u[1].name,'B');
});

test('late acknowledged push cannot merge old cloud data after switching accounts', async () => {
  const commit=deferred();
  const {c}=sandbox({fbDb:{collection:()=>({doc:()=>({})}),runTransaction:async fn=>{
    await fn({get:async()=>snapshot({2:{name:'A cloud'}}),set() {}}); return commit.promise;
  }}});
  c.S.u={1:{name:'A'}}; const job=c.pushToCloud(); await tick();
  c.invalidateCloudSession(); c.fbUser={uid:'B'}; c.S.u={1:{name:'B'}};
  commit.resolve(); await job;
  assert.equal(c.S.u[2],undefined); assert.equal(c.S.u[1].name,'B');
});

test('account wipe clears tombstones, payroll overrides, undo and pending callbacks', () => {
  const {c,timers,storage}=sandbox();
  c.S.deletedUsers={1:123}; c.S.clipboard={secret:true}; c.undoStack.push({secret:true});
  storage.set('st_payroll_overrides','private'); storage.set('st_data','private');
  c.debouncedPush(); c.wipeLocalSensitiveData();
  assert.equal(Object.keys(c.S.deletedUsers).length,0);
  assert.equal(c.S.nextUid,3); assert.equal(c.undoStack.length,0); assert.equal(c.S.clipboard,null);
  assert.equal(timers.size,0); assert.equal(storage.size,0); assert.equal(c._payrollOverrides,null);
});

test('new account keeps a profile with the same ID as a deleted old profile', async () => {
  const {c}=sandbox({fbDb:{collection:()=>({doc:()=>({get:async()=>snapshot({1:{name:'B'}})})})}});
  c.S.deletedUsers={1:123}; c.wipeLocalSensitiveData(); c.fbUser={uid:'B'};
  await c.pullFromCloud(); assert.equal(c.S.u[1].name,'B');
});

test('remote snapshot preserves scheduled local edit upload and merged data', () => {
  let snapshotHandler;
  const {c,timers,saved}=sandbox({fbDb:{collection:()=>({doc:()=>({onSnapshot:cb=>{snapshotHandler=cb;return ()=>{};}})})}});
  c.S.u={1:{localEdit:true}}; c.debouncedPush();
  const pending=c.syncTimer; c.startRealtimeSync(); snapshotHandler(snapshot({1:{remoteEdit:true}}));
  assert.equal(c.syncTimer,pending); assert.ok(timers.has(pending));
  assert.equal(c.S.u[1].localEdit,true); assert.equal(c.S.u[1].remoteEdit,true);
  assert.equal(saved[0].noPush,true);
});

test('queued realtime callback from a signed-out account is ignored', () => {
  let handler;
  const {c}=sandbox({fbDb:{collection:()=>({doc:()=>({onSnapshot:cb=>{handler=cb;return ()=>{};}})})}});
  c.startRealtimeSync(); c.invalidateCloudSession(); c.fbUser={uid:'B'};
  handler(snapshot({1:{name:'A'}})); assert.equal(c.S.u[1],undefined);
});

function documentDB(set) {
  const node={collection:()=>node,doc:()=>node,set,delete:async()=>{}};
  return node;
}
const localDoc=()=>({id:'d1',url:'data:application/pdf;base64,QQ==',name:'Belge'});

test('legacy local-only document uploads, acknowledges locally and excludes body from root payload', async () => {
  const writes=[]; const {c,saved}=sandbox({fbDb:documentDB(async d=>writes.push(d))});
  c.S.u={1:{documents:[localDoc()]}};
  await c.uploadPendingDocuments(); await c.uploadPendingDocuments();
  assert.equal(writes.length,1); assert.ok(writes[0].url);
  assert.equal(c.S.u[1].documents[0].cloudStored,true); assert.equal(saved[0].noPush,true);
  const cloud=c.cloneUsersForCloud(c.S.u); assert.equal(cloud[1].documents[0].url,undefined);
  assert.equal(cloud[1].documents[0].cloudStored,undefined);
});

test('failed document upload survives reload and retries with the same document ID', async () => {
  const {c,timers}=sandbox({fbDb:documentDB(async()=>{throw Error('offline');})});
  c.S.u={1:{documents:[localDoc()]}};
  await assert.rejects(c.uploadPendingDocuments(),/offline/);
  assert.ok(timers.size); assert.ok(c.S.u[1].documents[0].url); assert.ok(!c.S.u[1].documents[0].cloudStored);
  const writes=[]; const next=sandbox({fbDb:documentDB(async d=>writes.push(d))}).c;
  next.S.u=JSON.parse(JSON.stringify(c.S.u)); await next.uploadPendingDocuments();
  assert.equal(writes[0].id,'d1'); assert.equal(next.S.u[1].documents[0].cloudStored,true);
});

test('concurrent document upload triggers share one task', async () => {
  const write=deferred(); let writes=0;
  const {c}=sandbox({fbDb:documentDB(()=>{writes++;return write.promise;})});
  c.S.u={1:{documents:[localDoc()]}};
  const first=c.uploadPendingDocuments(),second=c.uploadPendingDocuments();
  write.resolve(); await Promise.all([first,second]); assert.equal(writes,1);
});

test('document upload failure does not prevent root shift synchronization', async () => {
  const db=documentDB(async()=>{ throw Error('document denied'); });
  let written;
  db.runTransaction=fn=>fn({get:async()=>snapshot({}),set:(ref,data)=>{written=data;}});
  const {c,timers}=sandbox({fbDb:db});
  c.S.u={1:{documents:[localDoc()],shifts:{today:{start:'09:00'}}}};
  await c.pushToCloud();
  assert.equal(written.users[1].shifts.today.start,'09:00');
  assert.ok(c.S.u[1].documents[0].url); assert.ok(!c.S.u[1].documents[0].cloudStored);
  assert.ok(timers.size,'document retry remains scheduled');
});

test('document upload completion from old account cannot mark new account documents uploaded', async () => {
  const write=deferred(); const {c,saved}=sandbox({fbDb:documentDB(()=>write.promise)});
  c.S.u={1:{documents:[localDoc()]}}; const job=c.uploadPendingDocuments();
  c.invalidateCloudSession(); c.fbUser={uid:'B'}; c.S.u={1:{documents:[localDoc()]}};
  write.resolve(); await job;
  assert.equal(c.S.u[1].documents[0].cloudStored,undefined); assert.equal(saved.length,0);
});

test('document read from old account is discarded before local mutation', async () => {
  const read=deferred(), node={collection:()=>node,doc:()=>node,get:()=>read.promise};
  const {c,saved}=sandbox({fbDb:node}); c.S.u={1:{documents:[]}};
  const oldUser=c.S.u[1],job=c.loadCloudDocs(); c.invalidateCloudSession(); c.fbUser={uid:'B'};
  read.resolve({empty:false,forEach:cb=>cb({data:()=>localDoc()})}); await job;
  assert.equal(oldUser.documents.length,0); assert.equal(saved.length,0);
});

test('saveDocument persists the body before any network write', async () => {
  const file={name:'a.pdf',size:1,type:'application/pdf'}; let calls=0;
  const elements={docNameInput:{value:'Belge'},docCatSelect:{value:'other'},docSaveBtn:{}};
  const {c}=sandbox({currentDocFile:file,cu:()=>c.S.u[1],$:id=>elements[id],hideDocError() {},
    closeDocUpload() {},renderDocs() {},showDocError() {},
    fbDb:documentDB(async()=>calls++),
    FileReader:class { readAsDataURL() { this.onload({target:{result:localDoc().url}}); } },
  });
  c.S.u={1:{documents:[]}}; await c.saveDocument();
  assert.equal(calls,0); assert.equal(c.S.u[1].documents[0].url,localDoc().url);
  assert.equal(c.S.u[1].documents[0].cloudStored,false);
});

test('saveDocument leaves form open and rolls back in-memory insertion when storage fails', async () => {
  const file={name:'a.pdf',size:1,type:'application/pdf'}; let closed=false,error='';
  const elements={docNameInput:{value:'Belge'},docCatSelect:{value:'other'},docSaveBtn:{}};
  const {c}=sandbox({currentDocFile:file,cu:()=>c.S.u[1],$:id=>elements[id],hideDocError() {},
    saveLS:()=>false,closeDocUpload:()=>{closed=true;},renderDocs() {},showDocError:m=>{error=m;},
    FileReader:class { readAsDataURL() { this.onload({target:{result:localDoc().url}}); } },
  });
  c.S.u={1:{documents:[]}}; await c.saveDocument();
  assert.equal(c.S.u[1].documents.length,0); assert.equal(closed,false); assert.ok(error);
});
