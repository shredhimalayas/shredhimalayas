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

// Global Cloud Firestore reference
let db = null;
if (typeof firebase !== 'undefined' && firebase.firestore) {
  try {
    db = firebase.firestore();
  } catch (e) {
    console.warn("Firestore init warning:", e);
  }
}

