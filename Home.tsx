import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Bi, Spinner } from "../../components/ui";
import { S } from "../../config/strings";
import { isFirebaseConfigured } from "../../config/firebaseConfig";
import { useData } from "../../data";
import { useCart } from "../../cart";
import { Link, navigate } from "../../router";
import { rs } from "../../lib/format";
import type { Product } from "../../types";
import { ProductCard } from "./ProductCard";

export function Shell({ children, back, hideBar }: { children: ReactNode; back?: boolean; hideBar?: boolean }) {
  const { settings } = useData();
  const { count, subtotal } = useCart();
  const [installEv, setInstallEv] = useState<any>(null);
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone;

  useEffect(() => {
    const f = (e: Event) => { e.preventDefault(); setInstallEv(e); };
    window.addEventListener("beforeinstallprompt", f);
    return () => window.removeEventListener("beforeinstallprompt", f);
  }, []);

  return (
    <div className="page">
      <div className="top">
        {back && (
          <button className="btn btn-ghost sm" style={{ background: "#fff" }} onClick={() => (history.length > 1 ? history.back() : navigate("/"))}>
            ⬅
          </button>
        )}
        <Link to="/" className="logo">🏪</Link>
        <div className="title">
          <b dir="rtl" style={{ fontSize: "1.25em" }}>{settings.nameUr}</b>
          <span style={{ fontSize: 14, opacity: 0.9, fontFamily: "system-ui,sans-serif" }}>{settings.nameEn}</span>
        </div>
        <span className={`badge ${settings.isOpen ? "open" : "closed"}`}>
          <Bi t={settings.isOpen ? S.open : S.closed} />
        </span>
      </div>
      {!settings.isOpen && (
        <div className="bad"><Bi ur={settings.closedMessageUr} en={settings.closedMessageEn} /></div>
      )}
      {!isFirebaseConfigured && <div className="warn"><Bi t={S.setupNeeded} /></div>}
      {children}
      {!standalone && (installEv || isIos) && (
        <div className="center" style={{ marginTop: 20 }}>
          {installEv ? (
            <button className="btn btn-ghost" onClick={() => { installEv.prompt(); setInstallEv(null); }}>
              📲 <Bi t={S.install} />
            </button>
          ) : (
            <div className="muted"><Bi t={S.installIos} /></div>
          )}
        </div>
      )}
      {count > 0 && !hideBar && (
        <div className="cartbar">
          <Link to="/cart">
            <span>🛒 {count} <Bi t={S.items} row /></span>
            <span>{rs(subtotal)}</span>
            <Bi t={S.viewCart} />
          </Link>
        </div>
      )}
    </div>
  );
}

function matches(p: Product, q: string) {
  const hay = `${p.nameEn} ${p.nameUr} ${p.keywords || ""}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
}

export function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [live, setLive] = useState(false);
  const rec = useRef<any>(null);
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const mic = () => {
    if (live) { rec.current?.stop(); return; }
    const r = new SR();
    r.lang = "ur-PK";
    r.onresult = (e: any) => onChange(e.results[0][0].transcript);
    r.onend = () => setLive(false);
    r.onerror = () => setLive(false);
    rec.current = r;
    setLive(true);
    r.start();
  };
  return (
    <div className="search">
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="🔍  تلاش / Search" aria-label="search" />
      {SR && <button className={`mic ${live ? "live" : ""}`} onClick={mic} aria-label="voice">🎤</button>}
    </div>
  );
}

export function Home() {
  const { categories, products, ready, error } = useData();
  const [q, setQ] = useState("");
  const cats = categories.filter((c) => c.active !== false);
  const visible = useMemo(() => products.filter((p) => p.active !== false), [products]);
  const results = q.trim() ? visible.filter((p) => matches(p, q)) : [];
  return (
    <Shell>
      <SearchBox value={q} onChange={setQ} />
      {error && !ready && <div className="bad"><Bi t={S.loadError} /></div>}
      {!ready && !error && <Spinner />}
      {q.trim() ? (
        results.length ? (
          <div className="prods">{results.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        ) : (
          <div className="center muted"><Bi t={S.noItems} /></div>
        )
      ) : (
        <>
          <h3 className="h"><Bi t={S.categories} row /></h3>
          <div className="cats">
            {cats.map((c) => (
              <Link key={c.id} to={`/c/${c.id}`} className="cat">
                <span className="emoji">{c.emoji || "🛒"}</span>
                <Bi ur={c.nameUr} en={c.nameEn} />
              </Link>
            ))}
          </div>
        </>
      )}
    </Shell>
  );
}

export function CategoryPage({ id }: { id: string }) {
  const { categories, products, ready } = useData();
  const [q, setQ] = useState("");
  const cat = categories.find((c) => c.id === id);
  const list = products.filter((p) => p.categoryId === id && p.active !== false && (!q.trim() || matches(p, q)));
  return (
    <Shell back>
      <SearchBox value={q} onChange={setQ} />
      {cat && (
        <h3 className="h" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 30 }}>{cat.emoji}</span> <Bi ur={cat.nameUr} en={cat.nameEn} />
        </h3>
      )}
      {!ready && <Spinner />}
      {ready && !list.length && <div className="center muted"><Bi t={S.noItems} /></div>}
      <div className="prods">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
    </Shell>
  );
}
