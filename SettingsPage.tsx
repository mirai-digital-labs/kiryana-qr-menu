import { useEffect, useState } from "react";
import { Bi, Btn, Switch, toast } from "../../components/ui";
import { useData } from "../../data";
import { saveSettings } from "../../services/settings.service";
import type { StoreSettings } from "../../types";

export function SettingsPage({ email, onLogout }: { email: string; onLogout: () => void }) {
  const { settings } = useData();
  const [s, setS] = useState<StoreSettings>(settings);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (!dirty) setS(settings); }, [settings, dirty]);
  const set = <K extends keyof StoreSettings>(k: K, v: StoreSettings[K]) => { setS((x) => ({ ...x, [k]: v })); setDirty(true); };

  async function save() {
    try { await saveSettings(s); setDirty(false); toast("✓ Save ho gaya"); } catch { toast("Error"); }
  }

  return (
    <>
      <h3 className="h"><Bi ur="دکان کی سیٹنگ" en="Shop settings" row /></h3>
      <div className="card">
        <Switch on={s.isOpen} onChange={(v) => set("isOpen", v)} label={s.isOpen ? "🟢 Dukan khuli hai / دکان کھلی ہے" : "🔴 Dukan band hai / دکان بند ہے"} />
      </div>
      <div className="field"><label>دکان کا نام (اردو)</label><input dir="rtl" value={s.nameUr} onChange={(e) => set("nameUr", e.target.value)} /></div>
      <div className="field"><label>Shop name (English)</label><input value={s.nameEn} onChange={(e) => set("nameEn", e.target.value)} /></div>
      <div className="field"><label>WhatsApp number (e.g. 923001234567)</label><input inputMode="tel" value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} /></div>
      <div className="inline">
        <div className="field" style={{ flex: 1 }}><label>Delivery fee (Rs)</label><input type="number" inputMode="numeric" value={s.deliveryFee} onChange={(e) => set("deliveryFee", Number(e.target.value))} /></div>
        <div className="field" style={{ flex: 1 }}><label>Minimum order (Rs)</label><input type="number" inputMode="numeric" value={s.minOrder} onChange={(e) => set("minOrder", Number(e.target.value))} /></div>
      </div>
      <div className="field"><label>Band hone ka paigham (اردو)</label><input dir="rtl" value={s.closedMessageUr} onChange={(e) => set("closedMessageUr", e.target.value)} /></div>
      <div className="field"><label>Closed message (English)</label><input value={s.closedMessageEn} onChange={(e) => set("closedMessageEn", e.target.value)} /></div>
      <Btn block disabled={!dirty} onClick={save}>💾 <Bi ur="محفوظ کریں" en="Save" row /></Btn>
      <div className="card" style={{ marginTop: 20 }}>
        <div className="muted">Login: {email}</div>
        <Btn kind="danger" className="sm" style={{ marginTop: 8 }} onClick={onLogout}>🚪 Logout</Btn>
      </div>
    </>
  );
}
