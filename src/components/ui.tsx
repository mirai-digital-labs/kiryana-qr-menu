import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import type { T } from "../config/strings";

/** Bilingual text: Urdu bara, English neeche. */
export function Bi({ t, ur, en, row, className = "" }: { t?: T; ur?: string; en?: string; row?: boolean; className?: string }) {
  const u = t?.ur ?? ur ?? "";
  const e = t?.en ?? en ?? "";
  return (
    <span className={`bi ${row ? "bi-row" : ""} ${className}`}>
      <span className="ur" dir="rtl">{u}</span>
      <span className="en">{e}</span>
    </span>
  );
}

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind?: "primary" | "ghost" | "danger" | "wa" | "dark";
  block?: boolean;
}
export function Btn({ kind = "primary", block, className = "", children, ...rest }: BtnProps) {
  return (
    <button {...rest} className={`btn btn-${kind} ${block ? "btn-block" : ""} ${className}`}>
      {children}
    </button>
  );
}

export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: ReactNode }) {
  return (
    <button type="button" className={`switch ${on ? "on" : ""}`} onClick={() => onChange(!on)} aria-pressed={on}>
      <span className="knob" />
      {label && <span className="switch-label">{label}</span>}
    </button>
  );
}

export function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function toast(msg: string) {
  window.dispatchEvent(new CustomEvent("kq-toast", { detail: msg }));
}

export function Toaster() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    let tm: number;
    const f = (e: Event) => {
      setMsg((e as CustomEvent).detail);
      clearTimeout(tm);
      tm = window.setTimeout(() => setMsg(""), 2600);
    };
    window.addEventListener("kq-toast", f);
    return () => window.removeEventListener("kq-toast", f);
  }, []);
  return msg ? <div className="toast">{msg}</div> : null;
}

export function Spinner() {
  return <div className="spinner" aria-label="loading" />;
}
