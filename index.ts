export type Unit = "kg" | "litre" | "piece" | "packet" | "dozen";
export type OrderStatus = "new" | "preparing" | "out" | "delivered" | "cancelled";

export interface Category {
  id: string;
  nameUr: string;
  nameEn: string;
  emoji: string;
  sortOrder: number;
  active: boolean;
  storeId?: string;
}

export interface Product {
  id: string;
  nameUr: string;
  nameEn: string;
  keywords: string; // Roman Urdu / extra search words, e.g. "chawal basmati"
  categoryId: string;
  thumb: string; // WebP data URL (auto converted)
  price: number;
  unit: Unit;
  step: number;
  inStock: boolean;
  active: boolean;
  sortOrder: number;
  updatedAt: number;
  storeId?: string;
  stockQty?: number; // future
}

export interface OrderItem {
  productId: string;
  nameUr: string;
  nameEn: string;
  qty: number;
  unit: Unit;
  price: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  code: string;
  customer: { name: string; phone: string; address: string; note: string };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; at: number }[];
  paymentMethod: "cod" | string;
  paymentStatus: "unpaid" | "paid" | string;
  createdAt: number;
  updatedAt: number;
  storeId?: string;
}

export interface StoreSettings {
  nameUr: string;
  nameEn: string;
  whatsapp: string;
  isOpen: boolean;
  deliveryFee: number;
  minOrder: number;
  closedMessageUr: string;
  closedMessageEn: string;
}
