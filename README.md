# 🏪 Kiryana QR Menu + Online Order (PWA)

Customer QR scan kare → Urdu/English menu → order → Firestore mein save + WhatsApp khule.
Admin `/admin` par: live orders (awaaz), status buttons, items, prices, categories, QR poster.

**Tech:** Vite + React + TypeScript, Firebase (Firestore + Auth), Cloudflare Pages. Koi paid service nahi.

---

## ⚡ Setup (sirf 4 kaam, ~20 minute)

### 1) Firebase (muft)
1. https://console.firebase.google.com → **Add project**.
2. **Build → Firestore Database → Create database** (Production mode, region: `asia-south1` ya jo qareeb ho).
3. **Build → Authentication → Get started → Email/Password → Enable**.
   Phir **Users → Add user**: apna admin email + password banayen (yeh `/admin` ka login hai).
4. **Project settings (⚙️) → Your apps → `</>` Web app** banayen. Jo `firebaseConfig` milay woh
   `src/config/firebaseConfig.ts` mein paste karen.
5. **Firestore → Rules** tab: `firestore.rules` ki poori file paste karen, aur
   `PASTE_ADMIN_EMAIL_HERE` ki jagah apna admin email likh kar **Publish** karen.

> ⚠️ Rules mein email likhe bagair admin panel orders nahi dikhayega (permission-denied).

### 2) Dukan ki settings (optional, baad mein admin panel se bhi)
`src/config/store.ts` mein dukan ka naam aur WhatsApp number (`923001234567`, bagair +).

### 3) Live karen (do raaste)

**Raasta A: GitHub + Cloudflare Pages (tajweez, auto-update)**
1. Yeh poora folder GitHub repo mein upload karen.
2. https://dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git**.
3. Build command: `npm run build` · Output directory: `dist` · **Save and Deploy**.
4. Link milega `xxxx.pages.dev`. Firebase Console → **Authentication → Settings → Authorized domains**
   mein yeh domain **add** karen (warna admin login nahi chalega).

**Raasta B: Seedha computer se (GitHub ke bagair)**
```bash
npm install
npm run deploy        # pehli baar Cloudflare login khulega
```

### 4) Pehli baar istemal
1. `https://aap-ka-link/admin` → login.
2. **اقسام / Categories** → "Add sample categories" (ya apni banayen).
3. **سامان / Items** → ＋ naya saman (photo khud WebP ban jati hai) ya **CSV import**.
4. **سیٹنگ / Settings** → WhatsApp number, delivery fee, minimum order.
5. **کیو آر / QR** → apna asli link likh kar **A5 poster print**.
6. Orders tab par **"آواز والے الرٹ شروع کریں"** dabana na bhoolen (browser ki shart).

---

## 🧭 Customer flow
`/` categories → `/c/:id` items → `/cart` → `/checkout` (naam, phone, pata) → `/done/:id` (✓, code, WhatsApp button) → `/order/:id` (live status).
Login/OTP nahi. Naam/phone/pata agli baar khud bhar jate hain.

## 🔔 Notifications — sach
- Order **hamesha** Firestore mein save hota hai aur admin panel mein awaaz ke saath aata hai.
- WhatsApp message customer ke phone se jata hai (`wa.me`): customer "Send" dabaye tab pohanchta hai.
  Is liye admin panel hi asli record hai. Bagair customer ke khud-ba-khud WhatsApp ke liye
  WhatsApp Business Cloud API chahiye (Phase 2, paid). `notify(order)` jaisa hook baad mein add kiya ja sakta hai.
- Admin panel band ho to awaaz nahi bajti (browser tab khula rehna chahiye). Web Push baad ka kaam hai.

## 🖼 Images
Admin photo choose karta hai → browser mein khud square **WebP (~10–25KB)** ban kar Firestore ke product document mein save hoti hai.
Is se Firebase Storage / Blaze plan / card ki zaroorat nahi. (Zyada photos hon to `src/lib/image.ts` aur
`ProductsPage` mein Cloudflare R2/Firebase Storage upload se badla ja sakta hai.)

## 🔒 Security
- Customer sirf products/settings parh sakta hai, order bana sakta hai, aur **apna** order link se dekh sakta hai. Orders ki list sirf admin.
- Order total customer ke browser mein banta hai; admin card par dobara check hota hai aur farq par ⚠️ aata hai.
- Spam bachao (optional): Firebase **App Check** (reCAPTCHA v3) on karen.
- Roz/haftawar backup: Firebase Console → Firestore → Import/Export.

## 🧩 Code structure (expand karne ke liye)
```
src/config/      store.ts, strings.ts (sab bilingual text), firebaseConfig.ts
src/services/    SIRF yahi Firebase se baat karte hain (UI direct nahi)
src/lib/         whatsapp, image(WebP), format, sound
src/features/    customer/, admin/
firestore.rules  security rules
```
Pehle se rakhe hue fields: `paymentMethod/paymentStatus`, `discount`, `storeId`, `stockQty` (payment, coupon, multi-store, stock ke liye).

## 🛠 Local chalana
```bash
npm install
npm run dev         # http://localhost:5173
npm run typecheck
npm run build
```

## ❓ Masail
| Masla | Hal |
|---|---|
| Menu khali | Admin mein categories + items add karen |
| Admin login nahi hota | Authorized domains mein domain add karen; email/password Firebase Users mein banayen |
| "not an admin" | `firestore.rules` mein email likh kar Publish karen |
| Awaaz nahi | "Start sound alerts" dabayen, phone silent na ho |
| Urdu font alag lagta hai | Phone ka Noto Naskh/Nastaliq use hota hai; chahen to font self-host karen (`styles.css`) |
