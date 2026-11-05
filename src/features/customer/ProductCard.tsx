import { Bi } from "../../components/ui";
import { S } from "../../config/strings";
import { useCart } from "../../cart";
import { qtyLabel, rs, UNITS } from "../../lib/format";
import type { Product } from "../../types";

export function ProductCard({ p }: { p: Product }) {
  const { qtyOf, add, sub } = useCart();
  const q = qtyOf(p.id);
  const u = UNITS[p.unit] ?? UNITS.piece;
  const lbl = qtyLabel(q, p.unit);
  return (
    <div className={`prod ${!p.inStock ? "out" : ""}`}>
      <div className="pic">{p.thumb ? <img src={p.thumb} alt={p.nameEn} loading="lazy" width={104} height={104} /> : "🛒"}</div>
      <div className="info">
        <div className="nm">
          <b dir="rtl" style={{ fontSize: "1.1em" }}>{p.nameUr}</b>
          <span style={{ fontSize: 14, color: "var(--mut)", fontFamily: "system-ui,sans-serif" }}>{p.nameEn}</span>
        </div>
        <div className="price">
          {rs(p.price)} <small>/ {u.ur} {u.en}</small>
        </div>
        {!p.inStock ? (
          <div className="badge closed" style={{ alignSelf: "flex-start" }}><Bi t={S.outOfStock} row /></div>
        ) : q === 0 ? (
          <button className="btn btn-primary" onClick={() => add(p)}>
            <span style={{ fontSize: 26 }}>＋</span> <Bi t={S.add} />
          </button>
        ) : (
          <div className="qty">
            <button className="minus" onClick={() => sub(p)} aria-label="minus">−</button>
            <div className="q"><Bi ur={lbl.ur} en={lbl.en} /></div>
            <button onClick={() => add(p)} aria-label="plus">+</button>
          </div>
        )}
      </div>
    </div>
  );
}
