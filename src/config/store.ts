import type { StoreSettings } from "../types";

// Default dukan settings. Admin panel > Settings se badli ja sakti hain
// (wahan ki values Firestore mein save hoti hain aur in par ghalib aati hain).
export const DEFAULT_SETTINGS: StoreSettings = {
  nameUr: "المدینہ کریانہ اینڈ جنرل اسٹور",
  nameEn: "Al-Madina Kiryana & General Store",
  whatsapp: "923116506833", // country code ke saath, bagair + ke
  isOpen: true,
  deliveryFee: 50,
  minOrder: 300,
  closedMessageUr: "دکان ابھی بند ہے۔ کل دوبارہ آئیں۔",
  closedMessageEn: "The shop is closed right now. Please come back later.",
};

export const STORE_ID = "main"; // future: multi-store
