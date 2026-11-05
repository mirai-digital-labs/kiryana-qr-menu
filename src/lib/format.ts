import type { Unit } from "../types";

export const UNITS: Record<Unit, { ur: string; en: string; step: number }> = {
  kg: { ur: "کلو", en: "kg", step: 0.25 },
  litre: { ur: "لیٹر", en: "litre", step: 0.25 },
  piece: { ur: "عدد", en: "piece", step: 1 },
  packet: { ur: "پیکٹ", en: "packet", step: 1 },
  dozen: { ur: "درجن", en: "dozen", step: 1 },
};

export const round2 = (n: number) => Math.round(n * 100) / 100;
export const rs = (n: number) => "Rs. " + Math.round(n).toLocaleString("en-US");

const FR: Record<string, string> = { "0.25": "¼", "0.5": "½", "0.75": "¾" };
const FR_UR: Record<string, string> = { "0.25": "پاؤ", "0.5": "آدھا", "0.75": "پون" };

/** 0.25 kg -> {ur:"پاؤ کلو", en:"¼ kg"} */
export function qtyLabel(qty: number, unit: Unit): { ur: string; en: string } {
  const u = UNITS[unit];
  const q = round2(qty);
  const whole = Math.floor(q);
  const frac = round2(q - whole);
  const fk = String(frac);
  if (frac === 0) return { ur: `${whole} ${u.ur}`, en: `${whole} ${u.en}` };
  if (!FR[fk]) return { ur: `${q} ${u.ur}`, en: `${q} ${u.en}` };
  if (whole === 0) return { ur: `${FR_UR[fk]} ${u.ur}`, en: `${FR[fk]} ${u.en}` };
  return { ur: `${whole}${FR[fk]} ${u.ur}`, en: `${whole}${FR[fk]} ${u.en}` };
}

/** Pakistani mobile: 03XXXXXXXXX. Returns normalized or null. */
export function normalizePhone(raw: string): string | null {
  let d = raw.replace(/[^\d+]/g, "");
  if (d.startsWith("+92")) d = "0" + d.slice(3);
  else if (d.startsWith("0092")) d = "0" + d.slice(4);
  else if (d.startsWith("92") && d.length === 12) d = "0" + d.slice(2);
  return /^03\d{9}$/.test(d) ? d : null;
}

export function randomCode(len = 4) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export const timeStr = (ms: number) =>
  new Date(ms).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
