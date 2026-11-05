import { useEffect, useMemo, useRef, useState } from "react";
import { Bi, Btn, toast } from "../../components/ui";
import { useData } from "../../data";
import { setOrderStatus, setPaymentStatus, subscribeRecentOrders } from "../../services/orders.service";
import { newOrderAlert, unlockSound } from "../../lib/sound";
import { qtyLabel, rs, timeStr } from "../../lib/format";
import { STATUS_MSG, waLink } from "../../lib/whatsapp";
import type { Order, OrderStatus } from "../../types";

const TABS: { k: OrderStatus; ur: string; en: string }[] = [
  { k: "new", ur: "نئے", en: "New" },
  { k: "preparing", ur: "تیار", en: "Preparing" },
  { k: "out", ur: "راستے میں", en: "On the way" },
  { k: "delivered", ur: "مکمل", en: "Done" },
  { k: "cancelled", ur: "منسوخ", en: "Cancelled" },
];
const NEXT: Partial<Record<OrderStatus, { to: OrderStatus; ur: string; en: string }>> = {
  new: { to: "preparing", ur: "تیار کریں", en: "Start preparing" },
  preparing: { to: "out", ur: "راستے میں", en: "Out for delivery" },
  out: { to: "delivered", ur: "پہنچ گیا", en: "Delivered" },
};

function printOrder(o: Order, shop: string) {
  const w = window.open("", "_blank", "width=380,height=600");
  if (!w) return toast("Popup blocked");
  const rows = o.items.map((i) => `<tr><td>${i.nameEn}<br>${i.nameUr}</td><td>${qtyLabel(i.qty, i.unit).en}</td><td align="right">${i.lineTotal}</td></tr>`).join("");
  w.document.write(`<html><head><meta charset="utf-8"><style>body{font-family:sans-serif;width:72mm;font-size:13px}td{padding:2px 0;vertical-align:top}hr{border:0;border-top:1px dashed #000}</style></head><body>
  <h3 style="text-align:center;margin:0">${shop}</h3><hr><b>#${o.code}</b> ${timeStr(o.createdAt)}<br>${o.customer.name}<br>${o.customer.phone}<br>${o.customer.address}<br>${o.customer.note || ""}<hr>
  <table width="100%">${rows}</table><hr>Delivery: ${o.deliveryFee}<br><b>Total: Rs. ${o.total}</b><br>COD<script>window.onload=()=>{window.print()}</script></body></html>`);
  w.document.close();
}

function OrderCard({ o }: { o: Order }) {
  const { settings } = useData();
  const shop = `${settings.nameUr} / ${settings.nameEn}`;
  const next = NEXT[o.status];
  const check = o.items.reduce((s, i) => s + Math.round(i.price * i.qty), 0) + o.deliveryFee;
  const mismatch = check !== o.total;
  const intl = (p: string) => "92" + p.replace(/^0/, "");
  const move = async (s: OrderStatus) => {
    try { await setOrderStatus(o.id, s); } catch { toast("Error"); }
  };
  return (
    <div className="card order">
      <div className="head">
        <span className="code">#{o.code}</span>
        <span className="muted">{timeStr(o.createdAt)}</span>
      </div>
      <div><b>{o.customer.name}</b></div>
      <div><a href={`tel:${o.customer.phone}`} style={{ color: "var(--g)", fontWeight: 800 }}>📞 {o.customer.phone}</a></div>
      <div><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.customer.address)}`} target="_blank" rel="noreferrer">📍 {o.customer.address}</a></div>
      {o.customer.note && <div className="warn" style={{ marginTop: 6 }}>📝 {o.customer.note}</div>}
      <ul>
        {o.items.map((i, k) => {
          const q = qtyLabel(i.qty, i.unit);
          return <li key={k}><b dir="rtl">{i.nameUr}</b> / {i.nameEn} — <b>{q.en}</b> ({q.ur}) = {rs(i.lineTotal)}</li>;
        })}
      </ul>
      <div className="row"><span className="muted">Delivery {rs(o.deliveryFee)}</span><b className="price" style={{ fontSize: 22 }}>{rs(o.total)}</b></div>
      {mismatch && <div className="warn">⚠️ Total match nahi karta (hisab: {rs(check)}). Customer ko call karen.</div>}
      <div className="acts">
        {next && <Btn onClick={() => move(next.to)}><Bi ur={next.ur} en={next.en} /></Btn>}
        <a href={waLink(intl(o.customer.phone), STATUS_MSG[o.status](o.code, shop))} target="_blank" rel="noreferrer">
          <Btn kind="wa" className="sm">💬 <Bi ur="کسٹمر کو بتائیں" en="WhatsApp customer" /></Btn>
        </a>
        <Btn kind="dark" className="sm" onClick={() => printOrder(o, shop)}>🖨 <Bi ur="پرچی" en="Print" /></Btn>
        {o.status === "delivered" && (
          <Btn kind="ghost" className="sm" onClick={() => setPaymentStatus(o.id, o.paymentStatus === "paid" ? "unpaid" : "paid")}>
            {o.paymentStatus === "paid" ? "✅ Paid" : "💵 Mark paid"}
          </Btn>
        )}
        {(o.status === "new" || o.status === "preparing" || o.status === "out") && (
          <Btn kind="danger" className="sm" onClick={() => confirm("Order cancel karna hai? / Cancel this order?") && move("cancelled")}>
            <Bi ur="منسوخ" en="Cancel" />
          </Btn>
        )}
      </div>
    </div>
  );
}

export function OrdersPage({ onNewCount }: { onNewCount: (n: number) => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<OrderStatus>("new");
  const [err, setErr] = useState("");
  const [alertsOn, setAlertsOn] = useState(false);
  const [banner, setBanner] = useState(0);
  const alertsRef = useRef(false);
  const seen = useRef<Set<string> | null>(null);
  alertsRef.current = alertsOn;

  useEffect(
    () =>
      subscribeRecentOrders(
        14,
        (list) => {
          setErr("");
          if (seen.current === null) {
            seen.current = new Set(list.map((o) => o.id));
          } else {
            const fresh = list.filter((o) => !seen.current!.has(o.id) && o.status === "new");
            list.forEach((o) => seen.current!.add(o.id));
            if (fresh.length) {
              setBanner((b) => b + fresh.length);
              if (alertsRef.current) newOrderAlert();
            }
          }
          setOrders(list);
        },
        (e: any) => setErr(e?.code === "permission-denied" ? "یہ اکاؤنٹ ایڈمن نہیں ہے / This account is not an admin (firestore.rules mein email add karen)" : "Error: " + (e?.message || e))
      ),
    []
  );

  const newCount = orders.filter((o) => o.status === "new").length;
  useEffect(() => {
    onNewCount(newCount);
    document.title = newCount ? `(${newCount}) نیا آرڈر / New order` : "Admin";
  }, [newCount, onNewCount]);

  const stats = useMemo(() => {
    const day = new Date(); day.setHours(0, 0, 0, 0);
    const valid = orders.filter((o) => o.status !== "cancelled");
    const today = valid.filter((o) => o.createdAt >= day.getTime());
    const week = valid.filter((o) => o.createdAt >= day.getTime() - 6 * 86400000);
    const sum = (a: Order[]) => a.reduce((s, o) => s + o.total, 0);
    return { tn: today.length, ts: sum(today), wn: week.length, ws: sum(week) };
  }, [orders]);

  const list = orders.filter((o) => o.status === tab);

  return (
    <>
      {banner > 0 && (
        <div className="alertbar">
          <span>🔔 <Bi ur="نیا آرڈر آیا!" en="New order!" /></span>
          <Btn kind="ghost" className="sm" onClick={() => { setTab("new"); setBanner(0); }}><Bi ur="دیکھیں" en="View" /></Btn>
        </div>
      )}
      {!alertsOn && (
        <Btn kind="dark" block style={{ marginBottom: 12 }} onClick={() => setAlertsOn(unlockSound())}>
          🔊 <Bi ur="آواز والے الرٹ شروع کریں" en="Start sound alerts" />
        </Btn>
      )}
      {err && <div className="bad">{err}</div>}
      <div className="stats">
        <div className="stat"><b>{stats.tn}</b><Bi ur="آج کے آرڈر" en="Today orders" /><div className="muted">{rs(stats.ts)}</div></div>
        <div className="stat"><b>{stats.wn}</b><Bi ur="7 دن" en="Last 7 days" /><div className="muted">{rs(stats.ws)}</div></div>
      </div>
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.k} className={`tab ${tab === t.k ? "on" : ""}`} onClick={() => setTab(t.k)}>
            {t.ur} {t.en} ({orders.filter((o) => o.status === t.k).length})
          </button>
        ))}
      </div>
      {!list.length && <div className="card center muted"><Bi ur="کوئی آرڈر نہیں" en="No orders" /></div>}
      {list.map((o) => <OrderCard key={o.id} o={o} />)}
    </>
  );
}
