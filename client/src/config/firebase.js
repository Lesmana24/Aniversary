import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase web app configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCDuxe7ACPc2_l-snOloRroxgwEjoTyN6Y",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aniv-fde67.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aniv-fde67",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aniv-fde67.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "780684141360",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:780684141360:web:bde2eac50b9644612adef5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WW6JQ1CK6L"
};

let db = null;
let storage = null;
let isFirebaseConfigured = false;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  isFirebaseConfigured = true;
  console.log("🔥 Firebase Client & Storage SDK initialized successfully!");
} catch (err) {
  console.warn("⚠️ Firebase Client SDK initialization skipped/failed:", err.message);
}

export { db, storage, isFirebaseConfigured };
