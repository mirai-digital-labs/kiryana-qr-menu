import { useState } from "react";
import { Bi, Btn, toast } from "../../components/ui";
import { useData } from "../../data";
import { updatePrices } from "../../services/products.service";
import { UNITS } from "../../lib/format";

export function PricesPage() {
  const { categories, products } = useData();
  const [chg, setChg] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);
  const n = Object.keys(chg).length;

  async function save() {
    setBusy(true);
    try { await updatePrices(chg); setChg({}); toast(`✓ ${n} qeematein save`); } catch { toast("Error"); }
    setBusy(false);
  }

  return (
    <>
      <h3 className="h"><Bi ur="سب قیمتیں ایک جگہ" en="All prices in one place" row /></h3>
      {categories.map((c) => {
        const ps = products.filter((p) => p.categoryId === c.id);
        if (!ps.length) return null;
        return (
          <div className="card" key={c.id}>
            <b>{c.emoji} {c.nameUr} / {c.nameEn}</b>
            <table className="tbl">
              <tbody>
                {ps.map((p) => (
                  <tr key={p.id}>
                    <td><b dir="rtl">{p.nameUr}</b><div className="muted">{p.nameEn} / {UNITS[p.unit]?.en}</div></td>
                    <td style={{ width: 110 }}>
                      <input
                        type="number"
                        inputMode="decimal"
                        className={chg[p.id] !== undefined ? "chg" : ""}
                        value={chg[p.id] ?? p.price}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setChg((m) => {
                            const x = { ...m };
                            if (v === p.price || !(v >= 0)) delete x[p.id];
                            else x[p.id] = v;
                            return x;
                          });
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      {n > 0 && (
        <div className="savebar"><Btn block disabled={busy} onClick={save}>💾 Save {n} <Bi ur="قیمتیں" en="prices" row /></Btn></div>
      )}
    </>
  );
}
