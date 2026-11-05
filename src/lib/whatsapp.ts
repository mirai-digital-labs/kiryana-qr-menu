import type { Order, OrderStatus } from "../types";
import { qtyLabel } from "./format";

/** "0300 1234567" / "+92300..." / "92300..." -> "92300..." */
export function waNumber(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = "92" + d.slice(1);
  return d;
}

export const waLink = (number: string, text: string) =>
  `https://wa.me/${waNumber(number)}?text=${encodeURIComponent(text)}`;

/** Customer -> shop message */
export function orderToShopText(o: Order, storeName: string): string {
  const lines = [
    `🛒 *نیا آرڈر / New Order* #${o.code}`,
    storeName,
    ``,
    `👤 ${o.customer.name}`,
    `📞 ${o.customer.phone}`,
    `📍 ${o.customer.address}`,
    ...(o.customer.note ? [`📝 ${o.customer.note}`] : []),
    ``,
    ...o.items.map((i) => {
      const q = qtyLabel(i.qty, i.unit);
      return `• ${i.nameUr} / ${i.nameEn} — ${q.en} = Rs.${i.lineTotal}`;
    }),
    ``,
    `Delivery: Rs.${o.deliveryFee}`,
    `*کل / Total: Rs.${o.total}*`,
    `(نقد / Cash on delivery)`,
  ];
  return lines.join("\n");
}

export const STATUS_MSG: Record<OrderStatus, (code: string, shop: string) => string> = {
  new: (c, s) => `${s}\nآپ کا آرڈر #${c} مل گیا ہے۔ ہم جلد رابطہ کریں گے۔\nYour order #${c} is received. We will contact you soon.`,
  preparing: (c, s) => `${s}\nآپ کا آرڈر #${c} تیار ہو رہا ہے۔\nYour order #${c} is being prepared.`,
  out: (c, s) => `${s}\nآپ کا آرڈر #${c} راستے میں ہے۔\nYour order #${c} is on the way.`,
  delivered: (c, s) => `${s}\nآرڈر #${c} پہنچ گیا۔ شکریہ!\nOrder #${c} delivered. Thank you!`,
  cancelled: (c, s) => `${s}\nمعذرت، آرڈر #${c} منسوخ ہو گیا ہے۔\nSorry, order #${c} was cancelled.`,
};
