import { useState } from "react";
import { Bi, Btn } from "../../components/ui";
import { S } from "../../config/strings";
import { useData } from "../../data";
import { useCart } from "../../cart";
import { navigate } from "../../router";
import { normalizePhone, qtyLabel, rs, UNITS } from "../../lib/format";
import { createOrder } from "../../services/orders.service";
import { orderToShopText, waLink } from "../../lib/whatsapp";
import { Shell } from "./Home";

export function CartPage() {
  const { lines, add, sub, remove, subtotal } = useCart();
  const { settings } = useData();
  const fee = lines.length ? settings.deliveryFee : 0;
  const total = subtotal + fee;
  const belowMin = subtotal < settings.minOrder;
  return (
    <Shell back hideBar>
      <h3 className="h"><Bi t={S.cart} row /></h3>
      {!lines.length && <div className="card center"><Bi t={S.cartEmpty} /></div>}
      {lines.map(({ product: p, qty, lineTotal }) => {
        const l = qtyLabel(qty, p.unit);
        const u = UNITS[p.unit] ?? UNITS.piece;
        return (
          <div className="card" key={p.id}>
            <div className="row">
              <div>
                <b dir="rtl">{p.nameUr}</b>
                <div className="muted" style={{ fontFamily: "system-ui" }}>{p.nameEn} · {rs(p.price)}/{u.en}</div>
              </div>
              <b className="price">{rs(lineTotal)}</b>
            </div>
            <div className="qty" style={{ marginTop: 10 }}>
              <button className="minus" onClick={() => sub(p)}>−</button>
              <div className="q"><Bi ur={l.ur} en={l.en} /></div>
              <button onClick={() => add(p)}>+</button>
              <Btn kind="danger" className="sm" aria-label="remove" title="ہٹائیں / Remove" onClick={() => remove(p.id)}>🗑</Btn>
            </div>
          </div>
        );
      })}
      {lines.length > 0 && (
        <>
          <div className="card sum">
            <div className="row"><Bi t={S.subtotal} /><b>{rs(subtotal)}</b></div>
            <div className="row"><Bi t={S.delivery} /><b>{rs(fee)}</b></div>
            <div className="row tot"><Bi t={S.total} /><span>{rs(total)}</span></div>
          </div>
          {belowMin && (
            <div className="warn">
              <Bi t={S.minOrder} row /> : <b>{rs(settings.minOrder)}</b>
            </div>
          )}
          <Btn block disabled={belowMin || !settings.isOpen} onClick={() => navigate("/checkout")}>
            <Bi t={S.next} />
          </Btn>
        </>
      )}
    </Shell>
  );
}

const CKEY = "kq.cust.v1";

export function CheckoutPage() {
  const { lines, subtotal, toItems, clear } = useCart();
  const { settings } = useData();
  const saved = (() => { try { return JSON.parse(localStorage.getItem(CKEY) || "{}"); } catch { return {}; } })();
  const [name, setName] = useState<string>(saved.name || "");
  const [phone, setPhone] = useState<string>(saved.phone || "");
  const [address, setAddress] = useState<string>(saved.address || "");
  const [note, setNote] = useState("");
  const [err, setErr] = useState<{ ur: string; en: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const fee = lines.length ? settings.deliveryFee : 0;
  const total = subtotal + fee;

  async function submit() {
    if (busy) return;
    const ph = normalizePhone(phone);
    if (!name.trim()) return setErr(S.errName);
    if (!ph) return setErr(S.errPhone);
    if (!address.trim()) return setErr(S.errAddress);
    if (!lines.length) return navigate("/cart");
    setErr(null);
    setBusy(true);
    // WhatsApp window click ke waqt hi kholte hain taake browser block na kare
    const w = window.open("", "_blank");
    try {
      localStorage.setItem(CKEY, JSON.stringify({ name: name.trim(), phone: ph, address: address.trim() }));
      const order = await createOrder({
        customer: { name: name.trim(), phone: ph, address: address.trim(), note: note.trim() },
        items: toItems(),
        subtotal,
        deliveryFee: fee,
        total,
      });
      clear();
      if (w) w.location.href = waLink(settings.whatsapp, orderToShopText(order, `${settings.nameUr} / ${settings.nameEn}`));
      navigate(`/done/${order.id}`, true);
    } catch {
      w?.close();
      setErr(S.errSend);
      setBusy(false);
    }
  }

  return (
    <Shell back hideBar>
      <h3 className="h"><Bi t={S.details} row /></h3>
      <div className="field">
        <label><Bi t={S.name} /></label>
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      </div>
      <div className="field">
        <label><Bi t={S.phone} /></label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="03XXXXXXXXX" autoComplete="tel" />
      </div>
      <div className="field">
        <label><Bi t={S.address} /></label>
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" />
      </div>
      <div className="field">
        <label><Bi t={S.note} /></label>
        <input value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <div className="card sum">
        <div className="row tot" style={{ borderTop: 0, marginTop: 0 }}><Bi t={S.total} /><span>{rs(total)}</span></div>
        <div className="muted" style={{ marginTop: 6 }}><Bi t={S.cod} /></div>
      </div>
      {err && <div className="err"><Bi ur={err.ur} en={err.en} /></div>}
      <Btn block disabled={busy} onClick={submit}>
        <Bi t={busy ? S.placing : S.placeOrder} />
      </Btn>
    </Shell>
  );
}
