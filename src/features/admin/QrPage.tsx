import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Bi, Btn, toast } from "../../components/ui";
import { useData } from "../../data";

export function QrPage() {
  const { settings } = useData();
  const [url, setUrl] = useState(location.origin);
  const [png, setPng] = useState("");
  useEffect(() => {
    QRCode.toDataURL(url, { width: 900, margin: 2, errorCorrectionLevel: "M" }).then(setPng).catch(() => setPng(""));
  }, [url]);

  function poster() {
    const w = window.open("", "_blank");
    if (!w) return toast("Popup blocked");
    w.document.write(`<html><head><meta charset="utf-8"><title>QR</title><style>
      @page{size:A5;margin:10mm}body{font-family:"Noto Naskh Arabic",system-ui,sans-serif;text-align:center}
      h1{font-size:38px;margin:10px 0 0}h2{font-size:22px;margin:0;color:#444;font-weight:500}
      img{width:78%;margin:14px 0}.s{font-size:30px;font-weight:800;color:#1f7a4d;margin:0}.e{font-size:20px;color:#333;margin:2px 0 8px}
    </style></head><body>
      <h1>${settings.nameUr}</h1><h2>${settings.nameEn}</h2>
      <img src="${png}"/>
      <p class="s">اسکین کریں اور آرڈر کریں</p><p class="e">Scan &amp; Order</p>
      <p class="e">📞 ${settings.whatsapp}</p>
      <script>window.onload=()=>setTimeout(()=>window.print(),300)</script></body></html>`);
    w.document.close();
  }

  return (
    <>
      <h3 className="h"><Bi ur="کیو آر کوڈ" en="QR code" row /></h3>
      <div className="field"><label>Menu link (apna domain)</label><input value={url} onChange={(e) => setUrl(e.target.value)} /></div>
      {png && <div className="card center"><img src={png} alt="QR" style={{ width: "100%", maxWidth: 320 }} /></div>}
      <div className="inline">
        <a href={png} download="menu-qr.png"><Btn>⬇ PNG download</Btn></a>
        <Btn kind="dark" onClick={poster}>🖨 A5 poster print</Btn>
      </div>
      <p className="muted">Domain lagne ke baad yahan apna asli link likh kar QR dobara download karen.</p>
    </>
  );
}
