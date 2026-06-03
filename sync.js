/* ============================================================
   Shiftt v2 — Bulut senkronu (Firebase modüler SDK)
   Eski projeyle aynı: proje shift-a50d2, e-posta/şifre auth,
   userData/{uid} dokümanı. Yeni uygulama verisini 'bordro2'
   alanına yazar (merge), eski veriye dokunmaz.
============================================================ */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, sendPasswordResetEmail }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const FIREBASE_CONFIG = (typeof window !== 'undefined' && window.FIREBASE_CONFIG) || {
  apiKey: "AIzaSyClbILaI24aeB8yL-9Pdf6YWgrc7PRJGKo",
  authDomain: "shift-a50d2.firebaseapp.com",
  projectId: "shift-a50d2",
  storageBucket: "shift-a50d2.firebasestorage.app",
  messagingSenderId: "555190046824",
  appId: "1:555190046824:web:d168bebfbe8866e4ea2bdd",
  measurementId: "G-3REEMPWMP9"
};
const FIELD = 'bordro2';   // yeni uygulamanın veri alanı (eski veriden ayrı)

let app, auth, db, user = null, unsub = null;
let _onUser = () => {}, _onRemote = () => {};

export function initCloud({ onUser, onRemote }) {
  _onUser = onUser || _onUser;
  _onRemote = onRemote || _onRemote;
  try {
    app = initializeApp(FIREBASE_CONFIG);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.warn('[cloud] init başarısız', e);
    _onUser(null);
    return;
  }
  onAuthStateChanged(auth, (u) => {
    user = u || null;
    if (unsub) { unsub(); unsub = null; }
    if (user) startListen();
    _onUser(user ? { uid: user.uid, email: user.email } : null);
  });
}

function startListen() {
  const ref = doc(db, 'userData', user.uid);
  unsub = onSnapshot(ref, (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    if (data && data[FIELD]) _onRemote(data[FIELD], data[FIELD + 'UpdatedAt'] || 0);
  }, (err) => console.warn('[cloud] snapshot', err));
}

export function isLoggedIn() { return !!user; }
export function currentUser() { return user ? { uid: user.uid, email: user.email } : null; }

export async function loadOnce() {
  if (!user) return null;
  try {
    const snap = await getDoc(doc(db, 'userData', user.uid));
    const data = snap.exists() ? snap.data() : null;
    return data && data[FIELD] ? data[FIELD] : null;
  } catch (e) { console.warn('[cloud] loadOnce', e); return null; }
}

let _saveTimer = null;
export function saveCloud(state) {
  if (!user) return;
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(async () => {
    try {
      await setDoc(doc(db, 'userData', user.uid),
        { [FIELD]: state, [FIELD + 'UpdatedAt']: Date.now(), updatedAt: serverTimestamp() },
        { merge: true });
    } catch (e) { console.warn('[cloud] save', e); }
  }, 1200);
}

/* ---- Auth eylemleri ---- */
export async function login(email, pass) {
  await signInWithEmailAndPassword(auth, email.trim(), pass);
}
export async function register(email, pass) {
  await createUserWithEmailAndPassword(auth, email.trim(), pass);
}
export async function logout() {
  if (unsub) { unsub(); unsub = null; }
  await signOut(auth);
}
export async function resetPass(email) {
  await sendPasswordResetEmail(auth, email.trim());
}

/* Firebase hata kodlarını TR mesaja çevir */
export function authErrorTR(e) {
  const c = (e && e.code) || '';
  const map = {
    'auth/invalid-email': 'Geçersiz e-posta adresi.',
    'auth/user-not-found': 'Bu e-posta ile kayıt yok.',
    'auth/wrong-password': 'Hatalı şifre.',
    'auth/invalid-credential': 'E-posta veya şifre hatalı.',
    'auth/email-already-in-use': 'Bu e-posta zaten kayıtlı.',
    'auth/weak-password': 'Şifre en az 6 karakter olmalı.',
    'auth/too-many-requests': 'Çok fazla deneme. Biraz sonra tekrar deneyin.',
    'auth/network-request-failed': 'Ağ hatası. Bağlantınızı kontrol edin.',
  };
  return map[c] || (e && e.message) || 'Bir hata oluştu.';
}
