// ============================================================
//  STEP 1: Firebase Console > Project settings > Your apps > Web app
//  se jo config milay woh yahan paste karen (yeh secret nahi hota).
// ============================================================
export const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID",
};

export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("PASTE");
