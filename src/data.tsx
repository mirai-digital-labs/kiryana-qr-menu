import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_SETTINGS } from "./config/store";
import { SAMPLE_CATEGORIES, SAMPLE_PRODUCTS } from "./config/sampleData";
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

const Ctx = createContext<Data>({
  categories: SAMPLE_CATEGORIES,
  products: SAMPLE_PRODUCTS,
  settings: DEFAULT_SETTINGS,
  ready: true,
  error: false,
});
export const useData = () => useContext(Ctx);

export function DataProvider({ children }: { children: ReactNode }) {
  const [categories, setCats] = useState<Category[]>([]);
  const [products, setProds] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Partial<StoreSettings> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const onErr = () => setError(true);
    const u1 = subscribeCategories((c) => { setCats(c); }, onErr);
    const u2 = subscribeProducts((p) => { setProds(p); }, onErr);
    const u3 = subscribeSettings((s) => { setSettings(s); }, onErr);
    return () => { u1(); u2(); u3(); };
  }, []);

  const value = useMemo<Data>(
    () => {
      const activeCats = categories.length > 0 ? categories : SAMPLE_CATEGORIES;
      const activeProds = products.length > 0 ? products : SAMPLE_PRODUCTS;
      return {
        categories: [...activeCats].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
        products: [...activeProds].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.nameEn.localeCompare(b.nameEn)),
        settings: { ...DEFAULT_SETTINGS, ...(settings || {}) },
        ready: true,
        error,
      };
    },
    [categories, products, settings, error]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
