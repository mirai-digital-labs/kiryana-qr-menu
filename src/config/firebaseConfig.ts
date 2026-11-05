// ============================================================
// Firebase Configuration
// Yeh config .env file se aati hai ya neeche default values se.
// ============================================================
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA7TTWhAQoVV9acRkqydVi4ENe5n5AbeH8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kiryana-qr-menu.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kiryana-qr-menu",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kiryana-qr-menu.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "600684523171",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:600684523171:web:895f7330f8a29031c15916",
};

export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("PASTE") && firebaseConfig.apiKey.length > 5;
