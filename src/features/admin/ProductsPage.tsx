import { useState } from "react";
import { Bi, Btn, Modal, Switch, toast } from "../../components/ui";
import { useData } from "../../data";
import { bulkAddProducts, deleteProduct, saveCategory, saveProduct, setProductFlag } from "../../services/products.service";
import { dataUrlKB, toWebpDataUrl } from "../../lib/image";
import { rs, UNITS } from "../../lib/format";
import type { Product, Unit } from "../../types";

const blank = (categoryId: string): Partial<Product> => ({
  nameUr: "", nameEn: "", keywords: "", categoryId, thumb: "", price: 0, unit: "kg", step: 0.25, inStock: true, active: true, sortOrder: 0,
});

function ProductForm({ init, onClose }: { init: Partial<Product>; onClose: () => void }) {
  const { categories } = useData();
  const [p, setP] = useState<Partial<Product>>(init);
  const [busy, setBusy] = useState(false);
  const [imgInfo, setImgInfo] = useState("");

  async function pick(f?: File) {
    if (!f) return;
    try {
      const url = await toWebpDataUrl(f);
      setP((x) => ({ ...x, thumb: url }));
      setImgInfo(`✓ WebP ${dataUrlKB(url)} KB`);
    } catch {
      toast("یہ تصویر نہیں ہے / This is not an image");
    }
  }

  async function save() {
    if (!p.nameUr?.trim() || !p.nameEn?.trim()) return toast("Urdu + English naam likhen");
    if (!p.categoryId) return toast("Category chunen");
    if (!(Number(p.price) > 0)) return toast("Qeemat likhen");
    setBusy(true);
    try {
      await saveProduct({
        ...(p as Product),
        nameUr: p.nameUr.trim(),
        nameEn: p.nameEn.trim(),
        keywords: (p.keywords || "").trim(),
        price: Number(p.price),
        thumb: p.thumb || "",
        updatedAt: Date.now(),
      });
      toast("✓ Save ho gaya");
      onClose();
    } catch {
      toast("Error: save nahi hua");
    }
    setBusy(false);
  }

  return (
    <Modal onClose={onClose}>
      <h3>{p.id ? "✏️ Edit" : "＋ Naya saman / نیا سامان"}</h3>
      <div className="field">
        <label>📷 Photo (camera / gallery)</label>
        <div className="inline">
          {p.thumb ? <img className="thumb" style={{ width: 90, height: 90 }} src={p.thumb} /> : <div className="thumb" style={{ width: 90, height: 90, fontSize: 36 }}>🛒</div>}
          <input type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0])} style={{ minHeight: 0, border: 0, width: "auto" }} />
        </div>
        <div className="muted">{imgInfo || "Photo khud chhoti WebP ban jati hai"}</div>
      </div>
      <div className="field"><label>اردو نام / Urdu name</label><input dir="rtl" value={p.nameUr || ""} onChange={(e) => setP({ ...p, nameUr: e.target.value })} /></div>
      <div className="field"><label>English name</label><input value={p.nameEn || ""} onChange={(e) => setP({ ...p, nameEn: e.target.value })} /></div>
      <div className="field"><label>Search words (Roman Urdu, optional) e.g. chawal basmati</label><input value={p.keywords || ""} onChange={(e) => setP({ ...p, keywords: e.target.value })} /></div>
      <div className="field">
        <label>Category / قسم</label>
        <select value={p.categoryId || ""} onChange={(e) => setP({ ...p, categoryId: e.target.value })}>
          <option value="">—</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.nameEn} / {c.nameUr}</option>)}
        </select>
      </div>
      <div className="inline">
        <div className="field" style={{ flex: 1 }}><label>Qeemat / قیمت (Rs)</label><input type="number" inputMode="decimal" value={p.price || ""} onChange={(e) => setP({ ...p, price: Number(e.target.value) })} /></div>
        <div className="field" style={{ flex: 1 }}>
          <label>Unit</label>
          <select value={p.unit} onChange={(e) => { const u = e.target.value as Unit; setP({ ...p, unit: u, step: UNITS[u].step }); }}>
            {(Object.keys(UNITS) as Unit[]).map((u) => <option key={u} value={u}>{UNITS[u].en} / {UNITS[u].ur}</option>)}
          </select>
        </div>
      </div>
      <div className="inline" style={{ gap: 20 }}>
        <Switch on={p.inStock ?? true} onChange={(v) => setP({ ...p, inStock: v })} label="Hai / موجود" />
        <Switch on={p.active ?? true} onChange={(v) => setP({ ...p, active: v })} label="Dikhayen / ظاہر" />
      </div>
      <div className="inline" style={{ marginTop: 16 }}>
        <Btn disabled={busy} onClick={save}>💾 Save</Btn>
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        {p.id && <Btn kind="danger" onClick={async () => { if (confirm("Delete? / حذف کریں؟")) { await deleteProduct(p.id!); onClose(); } }}>🗑</Btn>}
      </div>
    </Modal>
  );
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === "," || c === "\t") { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cur); cur = "";
      if (row.some((x) => x.trim())) rows.push(row);
      row = [];
    } else cur += c;
  }
  row.push(cur);
  if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}

const SAMPLE = "nameUr,nameEn,price,unit,category\nباسمتی چاول,Basmati Rice,380,kg,Rice\nکوکنگ آئل,Cooking Oil,520,litre,Oil\nلکس صابن,Lux Soap,110,piece,Soap\n";

function CsvImport({ onClose }: { onClose: () => void }) {
  const { categories, products } = useData();
  const [rows, setRows] = useState<string[][] | null>(null);
  const [busy, setBusy] = useState(false);
  const body = rows ? rows.slice(1) : [];

  async function load(f?: File) {
    if (!f) return;
    setRows(parseCsv((await f.text()).replace(/^\uFEFF/, "")));
  }

  async function run() {
    setBusy(true);
    try {
      const cats = [...categories];
      let order = cats.reduce((m, c) => Math.max(m, c.sortOrder ?? 0), 0);
      const out: Omit<Product, "id">[] = [];
      for (const r of body) {
        const [nameUr, nameEn, price, unit, cat] = r.map((x) => (x || "").trim());
        if (!nameEn || !(Number(price) > 0)) continue;
        let c = cats.find((x) => x.nameEn.toLowerCase() === cat.toLowerCase() || x.nameUr === cat);
        if (!c && cat) {
          const id = await saveCategory({ nameUr: cat, nameEn: cat, emoji: "🛒", sortOrder: ++order, active: true });
          c = { id, nameUr: cat, nameEn: cat, emoji: "🛒", sortOrder: order, active: true };
          cats.push(c);
        }
        const u = (UNITS[unit as Unit] ? unit : "piece") as Unit;
        out.push({
          nameUr: nameUr || nameEn, nameEn, keywords: "", categoryId: c?.id || "", thumb: "", price: Number(price), unit: u,
          step: UNITS[u].step, inStock: true, active: true, sortOrder: products.length + out.length, updatedAt: Date.now(),
        });
      }
      await bulkAddProducts(out);
      toast(`✓ ${out.length} items add ho gaye`);
      onClose();
    } catch {
      toast("Import error");
    }
    setBusy(false);
  }

  return (
    <Modal onClose={onClose}>
      <h3>📥 CSV import</h3>
      <p className="muted">Columns: nameUr, nameEn, price, unit (kg/litre/piece/packet/dozen), category. Excel se "CSV" save karen.</p>
      <a href={"data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURIComponent(SAMPLE)} download="sample.csv"><Btn kind="ghost" className="sm">⬇ Sample CSV</Btn></a>
      <div className="field" style={{ marginTop: 12 }}><input type="file" accept=".csv,.txt" onChange={(e) => load(e.target.files?.[0])} /></div>
      {rows && (
        <>
          <div className="muted">{body.length} rows — preview:</div>
          <div style={{ overflowX: "auto", maxHeight: 220 }}>
            <table className="tbl"><tbody>{body.slice(0, 8).map((r, i) => <tr key={i}>{r.slice(0, 5).map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table>
          </div>
          <Btn block disabled={busy} style={{ marginTop: 10 }} onClick={run}>✅ Import {body.length}</Btn>
        </>
      )}
    </Modal>
  );
}

export function ProductsPage() {
  const { categories, products } = useData();
  const [cat, setCat] = useState("");
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Partial<Product> | null>(null);
  const [csv, setCsv] = useState(false);
  const list = products.filter(
    (p) => (!cat || p.categoryId === cat) && (!q.trim() || `${p.nameEn} ${p.nameUr} ${p.keywords}`.toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <>
      <div className="row" style={{ marginBottom: 10 }}>
        <h3 className="h" style={{ margin: 0 }}><Bi ur="سامان" en={`Items (${products.length})`} row /></h3>
        <div className="inline">
          <Btn kind="ghost" className="sm" onClick={() => setCsv(true)}>📥 CSV</Btn>
          <Btn onClick={() => setEdit(blank(cat || categories[0]?.id || ""))}>＋ <Bi ur="نیا سامان" en="New item" row /></Btn>
        </div>
      </div>
      {!categories.length && <div className="warn">Pehle "اقسام / Categories" tab mein category banayen.</div>}
      <div className="search"><input placeholder="🔍 Search" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="tabs">
        <button className={`tab ${!cat ? "on" : ""}`} onClick={() => setCat("")}>All</button>
        {categories.map((c) => <button key={c.id} className={`tab ${cat === c.id ? "on" : ""}`} onClick={() => setCat(c.id)}>{c.emoji} {c.nameEn}</button>)}
      </div>
      {list.map((p) => (
        <div className="card" key={p.id} style={{ opacity: p.active === false ? 0.55 : 1 }}>
          <div className="row" onClick={() => setEdit(p)} style={{ cursor: "pointer" }}>
            <div className="inline">
              {p.thumb ? <img className="thumb" src={p.thumb} /> : <div className="thumb">🛒</div>}
              <div><b dir="rtl">{p.nameUr}</b><div className="muted">{p.nameEn}</div></div>
            </div>
            <b className="price">{rs(p.price)}<small>/{UNITS[p.unit]?.en}</small></b>
          </div>
          <div className="inline" style={{ gap: 18, marginTop: 6 }}>
            <Switch on={p.inStock} onChange={(v) => setProductFlag(p.id, "inStock", v)} label={p.inStock ? "Hai / موجود" : "Khatam / ختم"} />
            <Switch on={p.active !== false} onChange={(v) => setProductFlag(p.id, "active", v)} label={p.active !== false ? "Dikhta hai" : "Chhupa hai"} />
          </div>
        </div>
      ))}
      {edit && <ProductForm init={edit} onClose={() => setEdit(null)} />}
      {csv && <CsvImport onClose={() => setCsv(false)} />}
    </>
  );
}
