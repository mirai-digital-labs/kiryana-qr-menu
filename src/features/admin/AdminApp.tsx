import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Bi, Btn, Spinner } from "../../components/ui";
import { isFirebaseConfigured } from "../../config/firebaseConfig";
import { DataProvider } from "../../data";
import { Link, usePath } from "../../router";
import { OrdersPage } from "./OrdersPage";
import { ProductsPage } from "./ProductsPage";
import { PricesPage } from "./PricesPage";
import { CategoriesPage } from "./CategoriesPage";
import { SettingsPage } from "./SettingsPage";
import { QrPage } from "./QrPage";

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function go() {
    setBusy(true);
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch {
      setErr("ای میل یا پاسورڈ غلط ہے / Wrong email or password");
    }
    setBusy(false);
  }
  return (
    <div className="page">
      <div className="card center" style={{ marginTop: 40 }}>
        <div style={{ fontSize: 56 }}>🔐</div>
        <h2><Bi ur="ایڈمن لاگ اِن" en="Admin Login" /></h2>
        {!isFirebaseConfigured && <div className="warn">Firebase config paste nahi hui (src/config/firebaseConfig.ts)</div>}
        <div className="field"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></div>
        <div className="field"><label>Password</label><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" onKeyDown={(e) => e.key === "Enter" && go()} /></div>
        {err && <div className="err">{err}</div>}
        <Btn block disabled={busy} onClick={go}>{busy ? "…" : <Bi ur="لاگ اِن" en="Login" />}</Btn>
      </div>
    </div>
  );
}

const TABS = [
  { to: "/admin", ic: "🔔", ur: "آرڈرز", en: "Orders" },
  { to: "/admin/products", ic: "📦", ur: "سامان", en: "Items" },
  { to: "/admin/prices", ic: "💰", ur: "قیمتیں", en: "Prices" },
  { to: "/admin/categories", ic: "🗂", ur: "اقسام", en: "Categories" },
  { to: "/admin/settings", ic: "⚙️", ur: "سیٹنگ", en: "Settings" },
  { to: "/admin/qr", ic: "📱", ur: "کیو آر", en: "QR" },
];

export function AdminApp() {
  const path = usePath().replace(/\/$/, "") || "/admin";
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [newCount, setNewCount] = useState(0);
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (user === undefined) return <div className="page"><Spinner /></div>;
  if (!user) return <Login />;

  return (
    <DataProvider>
      <div className="admin">
        <div className="page">
          {path === "/admin" && <OrdersPage onNewCount={setNewCount} />}
          {path === "/admin/products" && <ProductsPage />}
          {path === "/admin/prices" && <PricesPage />}
          {path === "/admin/categories" && <CategoriesPage />}
          {path === "/admin/settings" && <SettingsPage email={user.email || ""} onLogout={() => signOut(auth)} />}
          {path === "/admin/qr" && <QrPage />}
        </div>
        <nav className="nav">
          {TABS.map((t) => (
            <Link key={t.to} to={t.to} className={path === t.to ? "on" : ""}>
              <span className="ic">{t.ic}</span>
              <Bi ur={t.ur} en={t.en} />
              {t.to === "/admin" && newCount > 0 && <span className="cnt">{newCount}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </DataProvider>
  );
}
