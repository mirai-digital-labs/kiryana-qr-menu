import { collection, deleteDoc, doc, onSnapshot, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Category, Product } from "../types";

type Err = (e: unknown) => void;

export function subscribeProducts(cb: (p: Product[]) => void, onErr?: Err) {
  return onSnapshot(
    collection(db, "products"),
    (s) => cb(s.docs.map((d) => ({ ...(d.data() as Omit<Product, "id">), id: d.id }))),
    onErr
  );
}

export function subscribeCategories(cb: (c: Category[]) => void, onErr?: Err) {
  return onSnapshot(
    collection(db, "categories"),
    (s) => cb(s.docs.map((d) => ({ ...(d.data() as Omit<Category, "id">), id: d.id }))),
    onErr
  );
}

const clean = <T extends object>(o: T) => JSON.parse(JSON.stringify(o)) as T;

export async function saveProduct(p: Omit<Product, "id"> & { id?: string }) {
  const ref = p.id ? doc(db, "products", p.id) : doc(collection(db, "products"));
  const { id: _id, ...data } = p;
  await setDoc(ref, clean({ ...data, updatedAt: Date.now() }), { merge: true });
  return ref.id;
}

export const deleteProduct = (id: string) => deleteDoc(doc(db, "products", id));

export async function updatePrices(changes: Record<string, number>) {
  const ids = Object.keys(changes);
  for (let i = 0; i < ids.length; i += 400) {
    const b = writeBatch(db);
    ids.slice(i, i + 400).forEach((id) => b.update(doc(db, "products", id), { price: changes[id], updatedAt: Date.now() }));
    await b.commit();
  }
}

export async function setProductFlag(id: string, flag: "inStock" | "active", value: boolean) {
  await setDoc(doc(db, "products", id), { [flag]: value, updatedAt: Date.now() }, { merge: true });
}

export async function bulkAddProducts(items: Omit<Product, "id">[]) {
  for (let i = 0; i < items.length; i += 400) {
    const b = writeBatch(db);
    items.slice(i, i + 400).forEach((p) => b.set(doc(collection(db, "products")), clean(p)));
    await b.commit();
  }
}

export async function saveCategory(c: Omit<Category, "id"> & { id?: string }) {
  const ref = c.id ? doc(db, "categories", c.id) : doc(collection(db, "categories"));
  const { id: _id, ...data } = c;
  await setDoc(ref, clean(data), { merge: true });
  return ref.id;
}

export const deleteCategory = (id: string) => deleteDoc(doc(db, "categories", id));

export async function swapCategoryOrder(a: Category, b: Category) {
  const batch = writeBatch(db);
  batch.update(doc(db, "categories", a.id), { sortOrder: b.sortOrder });
  batch.update(doc(db, "categories", b.id), { sortOrder: a.sortOrder });
  await batch.commit();
}
