// ====================================================
// SHRED HIMALAYAS — FIREBASE INITIALIZATION
// Initializes Firebase App & Cloud Firestore Service
// ====================================================

const firebaseConfig = {
  apiKey: "AIzaSyCPe-7_DM6DLYR2x9tW5g6Ts0mTlu8R3Mg",
  authDomain: "shredhimalayas.firebaseapp.com",
  projectId: "shredhimalayas",
  storageBucket: "shredhimalayas.firebasestorage.app",
  messagingSenderId: "933312356543",
  appId: "1:933312356543:web:ea5a6dbdcb40755e2e260a",
  measurementId: "G-D6L84B4DWV"
};

// Initialize Firebase App if not already initialized
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Global Cloud Firestore reference (used by site-data.js)
var db = null;
if (typeof firebase !== 'undefined' && firebase.firestore) {
  try {
    db = firebase.firestore();
    console.log('[Firebase] Firestore connected to project: shredhimalayas');
  } catch (e) {
    console.warn('[Firebase] Firestore init warning:', e);
  }
}

// Global Cloud Storage reference (used for direct image/PDF uploads)
var storage = null;
if (typeof firebase !== 'undefined' && firebase.storage) {
  try {
    storage = firebase.storage();
    console.log('[Firebase] Storage connected to bucket: shredhimalayas.firebasestorage.app');
  } catch (e) {
    console.warn('[Firebase] Storage init warning:', e);
  }
}

