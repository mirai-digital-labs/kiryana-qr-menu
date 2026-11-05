import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_SETTINGS } from "./config/store";
import { subscribeCategories, subscribeProducts } from "./services/products.service";
import { subscribeSettings } from "./services/settings.service";
import type { Category, Product, StoreSettings } from "./types";

interface Data {
  categories: Category[];
  products: Product[];
  settings: StoreSettings;
  ready: boolean;
  error: boolean;
}

const Ctx = createContext<Data>({ categories: [], products: [], settings: DEFAULT_SETTINGS, ready: false, error: false });
export const useData = () => useContext(Ctx);

export function DataProvider({ children }: { children: ReactNode }) {
  const [categories, setCats] = useState<Category[]>([]);
  const [products, setProds] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Partial<StoreSettings> | null>(null);
  const [got, setGot] = useState({ c: false, p: false, s: false });
  const [error, setError] = useState(false);

  useEffect(() => {
    const onErr = () => setError(true);
    const u1 = subscribeCategories((c) => { setCats(c); setGot((g) => ({ ...g, c: true })); }, onErr);
    const u2 = subscribeProducts((p) => { setProds(p); setGot((g) => ({ ...g, p: true })); }, onErr);
    const u3 = subscribeSettings((s) => { setSettings(s); setGot((g) => ({ ...g, s: true })); }, onErr);
    return () => { u1(); u2(); u3(); };
  }, []);

  const value = useMemo<Data>(
    () => ({
      categories: [...categories].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
      products: [...products].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.nameEn.localeCompare(b.nameEn)),
      settings: { ...DEFAULT_SETTINGS, ...(settings || {}) },
      ready: got.c && got.p && got.s,
      error,
    }),
    [categories, products, settings, got, error]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
