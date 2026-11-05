import { useEffect, useState } from "react";
import { Bi, Btn, Spinner } from "../../components/ui";
import { S } from "../../config/strings";
import { useData } from "../../data";
import { Link } from "../../router";
import { subscribeOrder } from "../../services/orders.service";
import { orderToShopText, waLink } from "../../lib/whatsapp";
import { rs } from "../../lib/format";
import type { Order } from "../../types";
import { Shell } from "./Home";

const FLOW = [
  { k: "new", t: S.stNew },
  { k: "preparing", t: S.stPreparing },
  { k: "out", t: S.stOut },
  { k: "delivered", t: S.stDelivered },
] as const;

function Steps({ status }: { status: Order["status"] }) {
  if (status === "cancelled") return <div className="bad center"><b><Bi t={S.stCancelled} /></b></div>;
  const idx = FLOW.findIndex((f) => f.k === status);
  return (
    <div className="steps">
      {FLOW.map((f, i) => (
        <div key={f.k} className={`step ${i < idx ? "done" : ""} ${i === idx ? "now done" : ""}`}>
          <div className="dot">{i <= idx ? "✓" : i + 1}</div>
          <Bi t={f.t} />
        </div>
      ))}
    </div>
  );
}

function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  useEffect(() => subscribeOrder(id, setOrder, () => setOrder(null)), [id]);
  return order;
}

export function DonePage({ id }: { id: string }) {
  const order = useOrder(id);
  const { settings } = useData();
  if (order === undefined) return <Shell><Spinner /></Shell>;
  if (order === null) return <Shell><div className="card center"><Bi t={S.notFound} /></div></Shell>;
  const wa = waLink(settings.whatsapp, orderToShopText(order, `${settings.nameUr} / ${settings.nameEn}`));
  return (
    <Shell>
      <div className="center">
        <div className="tick">✓</div>
        <h2 style={{ color: "var(--g)", margin: "0 0 6px" }}><Bi t={S.received} /></h2>
        <div className="muted"><Bi t={S.weWillCall} /></div>
        <div style={{ margin: "18px 0 4px" }}><Bi t={S.orderCode} /></div>
        <div className="code">{order.code}</div>
        <div className="price" style={{ margin: "6px 0 16px" }}>{rs(order.total)}</div>
        <Steps status={order.status} />
        <div className="card muted"><Bi t={S.waHelp} /></div>
        <a href={wa} target="_blank" rel="noreferrer" style={{ display: "block", marginBottom: 12 }}>
          <Btn kind="wa" block>💬 <Bi t={S.sendWa} /></Btn>
        </a>
        <Link to={`/order/${order.id}`}><Btn kind="ghost" block><Bi t={S.trackOrder} /></Btn></Link>
        <div style={{ height: 12 }} />
        <Link to="/"><Btn kind="ghost" block><Bi t={S.newOrder} /></Btn></Link>
      </div>
    </Shell>
  );
}

export function TrackPage({ id }: { id: string }) {
  const order = useOrder(id);
  if (order === undefined) return <Shell back><Spinner /></Shell>;
  if (order === null) return <Shell back><div className="card center"><Bi t={S.notFound} /></div></Shell>;
  return (
    <Shell back>
      <div className="center">
        <div><Bi t={S.orderCode} /></div>
        <div className="code">{order.code}</div>
        <Steps status={order.status} />
        <div className="price">{rs(order.total)}</div>
      </div>
    </Shell>
  );
}
