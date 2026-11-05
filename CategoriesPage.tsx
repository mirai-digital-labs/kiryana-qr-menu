import { useState } from "react";
import { Bi, Btn, Modal, Switch, toast } from "../../components/ui";
import { useData } from "../../data";
import { deleteCategory, saveCategory, swapCategoryOrder } from "../../services/products.service";
import type { Category } from "../../types";

const SAMPLE_CATS: [string, string, string][] = [
  ["آٹا چاول", "Flour & Rice", "🍚"], ["دالیں", "Pulses", "🫘"], ["تیل گھی", "Oil & Ghee", "🛢️"],
  ["چائے چینی", "Tea & Sugar", "🍵"], ["صابن سرف", "Soap & Detergent", "🧼"], ["بسکٹ سنیکس", "Biscuits & Snacks", "🍪"],
  ["ٹھنڈے مشروب", "Cold Drinks", "🥤"], ["دودھ دہی", "Dairy", "🥛"], ["مصالحے", "Spices", "🧂"], ["انڈے ڈبل روٹی", "Eggs & Bread", "🥚"],
];

const EMOJIS = ["🍚", "🫘", "🛢️", "🍵", "🧼", "🍪", "🥤", "🥛", "🧂", "🍞", "🥚", "🧴", "🍬", "🥫", "🧻", "🛒"];

export function CategoriesPage() {
  const { categories, products } = useData();
  const [edit, setEdit] = useState<Partial<Category> | null>(null);

  async function save() {
    if (!edit?.nameUr?.trim() || !edit?.nameEn?.trim()) return toast("Urdu + English naam likhen");
    const max = categories.reduce((m, c) => Math.max(m, c.sortOrder ?? 0), 0);
    await saveCategory({
      id: edit.id,
      nameUr: edit.nameUr.trim(),
      nameEn: edit.nameEn.trim(),
      emoji: edit.emoji || "🛒",
      sortOrder: edit.sortOrder ?? max + 1,
      active: edit.active ?? true,
    });
    setEdit(null);
    toast("✓ Save ho gaya");
  }

  return (
    <>
      <div className="row" style={{ marginBottom: 12 }}>
        <h3 className="h" style={{ margin: 0 }}><Bi ur="اقسام" en="Categories" row /></h3>
        <Btn onClick={() => setEdit({ emoji: "🛒", active: true })}>＋ <Bi ur="نئی قسم" en="New" row /></Btn>
      </div>
      {!categories.length && (
        <div className="card center">
          <p className="muted">ابھی کوئی قسم نہیں / No categories yet</p>
          <Btn kind="ghost" onClick={async () => {
            for (let i = 0; i < SAMPLE_CATS.length; i++) {
              const [ur, en, emoji] = SAMPLE_CATS[i];
              await saveCategory({ nameUr: ur, nameEn: en, emoji, sortOrder: i + 1, active: true });
            }
            toast("✓ Sample categories add ho gayin");
          }}>✨ <Bi ur="نمونہ اقسام شامل کریں" en="Add sample categories" row /></Btn>
        </div>
      )}
      {categories.map((c, i) => (
        <div className="card row" key={c.id}>
          <div className="inline">
            <span style={{ fontSize: 32 }}>{c.emoji}</span>
            <Bi ur={c.nameUr} en={c.nameEn} />
            {c.active === false && <span className="badge closed">hidden</span>}
          </div>
          <div className="inline">
            <Btn kind="ghost" className="sm" disabled={i === 0} onClick={() => swapCategoryOrder(c, categories[i - 1])}>↑</Btn>
            <Btn kind="ghost" className="sm" disabled={i === categories.length - 1} onClick={() => swapCategoryOrder(c, categories[i + 1])}>↓</Btn>
            <Btn kind="dark" className="sm" onClick={() => setEdit(c)}>✏️</Btn>
          </div>
        </div>
      ))}
      {edit && (
        <Modal onClose={() => setEdit(null)}>
          <h3>{edit.id ? "Edit" : "New"} category</h3>
          <div className="field"><label>اردو نام / Urdu name</label><input dir="rtl" value={edit.nameUr || ""} onChange={(e) => setEdit({ ...edit, nameUr: e.target.value })} /></div>
          <div className="field"><label>English name</label><input value={edit.nameEn || ""} onChange={(e) => setEdit({ ...edit, nameEn: e.target.value })} /></div>
          <div className="field">
            <label>Icon</label>
            <div className="inline">
              {EMOJIS.map((e) => (
                <button key={e} className={`tab ${edit.emoji === e ? "on" : ""}`} style={{ fontSize: 26 }} onClick={() => setEdit({ ...edit, emoji: e })}>{e}</button>
              ))}
            </div>
          </div>
          <Switch on={edit.active ?? true} onChange={(v) => setEdit({ ...edit, active: v })} label="Dikhayen / Show" />
          <div className="inline" style={{ marginTop: 14 }}>
            <Btn onClick={save}>💾 Save</Btn>
            <Btn kind="ghost" onClick={() => setEdit(null)}>Cancel</Btn>
            {edit.id && (
              <Btn
                kind="danger"
                onClick={async () => {
                  const n = products.filter((p) => p.categoryId === edit.id).length;
                  if (n) return toast(`Is mein ${n} items hain, pehle unhein hataen`);
                  if (confirm("Delete?")) { await deleteCategory(edit.id!); setEdit(null); }
                }}
              >🗑</Btn>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
