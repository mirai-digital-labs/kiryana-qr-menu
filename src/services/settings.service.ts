import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { StoreSettings } from "../types";

export function subscribeSettings(cb: (s: Partial<StoreSettings> | null) => void, onErr?: (e: unknown) => void) {
  return onSnapshot(doc(db, "settings", "store"), (s) => cb(s.exists() ? (s.data() as Partial<StoreSettings>) : null), onErr);
}

export const saveSettings = (s: StoreSettings) => setDoc(doc(db, "settings", "store"), s, { merge: true });
