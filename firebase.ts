import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../config/firebaseConfig";

export const app = initializeApp(firebaseConfig);

// Persistent cache: menu weak internet par bhi nazar aata hai, aur reads kam hote hain.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

export const auth = getAuth(app);
