import { addDoc, arrayUnion, collection, doc, limit, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { STORE_ID } from "../config/store";
import { randomCode } from "../lib/format";
import type { Order, OrderItem, OrderStatus } from "../types";

export interface NewOrderInput {
  customer: Order["customer"];
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export async function createOrder(input: NewOrderInput): Promise<Order> {
  const now = Date.now();
  const data = {
    code: randomCode(4),
    ...input,
    discount: 0,
    status: "new" as OrderStatus,
    statusHistory: [{ status: "new" as OrderStatus, at: now }],
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    createdAt: now,
    updatedAt: now,
    storeId: STORE_ID,
  };
  const ref = await addDoc(collection(db, "orders"), data);
  return { ...data, id: ref.id };
}

export function subscribeOrder(id: string, cb: (o: Order | null) => void, onErr?: (e: unknown) => void) {
  return onSnapshot(
    doc(db, "orders", id),
    (s) => cb(s.exists() ? ({ ...(s.data() as Omit<Order, "id">), id: s.id }) : null),
    onErr
  );
}

/** Admin: pichle `days` din ke orders (max 200), real-time. */
export function subscribeRecentOrders(days: number, cb: (o: Order[]) => void, onErr?: (e: unknown) => void) {
  const since = Date.now() - days * 86400000;
  const q = query(collection(db, "orders"), where("createdAt", ">=", since), orderBy("createdAt", "desc"), limit(200));
  return onSnapshot(q, (s) => cb(s.docs.map((d) => ({ ...(d.data() as Omit<Order, "id">), id: d.id }))), onErr);
}

export function setOrderStatus(id: string, status: OrderStatus) {
  const at = Date.now();
  return updateDoc(doc(db, "orders", id), { status, updatedAt: at, statusHistory: arrayUnion({ status, at }) });
}

export function setPaymentStatus(id: string, paymentStatus: "paid" | "unpaid") {
  return updateDoc(doc(db, "orders", id), { paymentStatus, updatedAt: Date.now() });
}
