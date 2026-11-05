import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useData } from "./data";
import { round2 } from "./lib/format";
import type { OrderItem, Product } from "./types";

type CartMap = Record<string, number>;
interface CartCtx {
  qtyOf: (id: string) => number;
  add: (p: Product) => void;
  sub: (p: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  lines: { product: Product; qty: number; lineTotal: number }[];
  count: number;
  subtotal: number;
  toItems: () => OrderItem[];
}

const Ctx = createContext<CartCtx>(null as unknown as CartCtx);
export const useCart = () => useContext(Ctx);
const KEY = "kq.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useData();
  const [map, setMap] = useState<CartMap>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
  });
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(map)); } catch { /* ignore */ }
  }, [map]);

  const add = useCallback((p: Product) => setMap((m) => ({ ...m, [p.id]: round2((m[p.id] || 0) + (p.step || 1)) })), []);
  const sub = useCallback(
    (p: Product) =>
      setMap((m) => {
        const q = round2((m[p.id] || 0) - (p.step || 1));
        const n = { ...m };
        if (q <= 0.001) delete n[p.id];
        else n[p.id] = q;
        return n;
      }),
    []
  );
  const remove = useCallback((id: string) => setMap((m) => { const n = { ...m }; delete n[id]; return n; }), []);
  const clear = useCallback(() => setMap({}), []);

  const value = useMemo<CartCtx>(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    const lines = Object.entries(map)
      .map(([id, qty]) => ({ product: byId.get(id)!, qty }))
      .filter((l) => l.product && l.product.active !== false)
      .map((l) => ({ ...l, lineTotal: Math.round(l.product.price * l.qty) }));
    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
    return {
      qtyOf: (id) => map[id] || 0,
      add, sub, remove, clear, lines,
      count: lines.length,
      subtotal,
      toItems: () =>
        lines.map((l) => ({
          productId: l.product.id,
          nameUr: l.product.nameUr,
          nameEn: l.product.nameEn,
          qty: l.qty,
          unit: l.product.unit,
          price: l.product.price,
          lineTotal: l.lineTotal,
        })),
    };
  }, [map, products, add, sub, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
