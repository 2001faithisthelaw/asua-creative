"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HOME_BG, getRelease } from "@/data/releases";

/* ---- barcode (deterministic, same as referencia.html) ---- */
const BARCODE: { x: number; w: number }[] = (() => {
  const s = "ASUA2001JOAUNTITLED08", out: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    for (let k = 0; k < 4; k++) {
      const w = 1 + ((ch >> k) & 1) * 2 + ((ch >> (k + 3)) & 1);
      if (k % 2 === 0) out.push({ x, w });
      x += w;
    }
  }
  return out;
})();

export default function Exhibit() {
  const pathname = usePathname();
  const m = pathname.match(/^\/release\/([^/]+)/);
  const rel = m ? getRelease(decodeURIComponent(m[1])) : undefined;
  const target = rel ? rel.cover : HOME_BG;
  const serial = rel ? rel.serial : "2001";

  /* stage crossfade between two layers */
  const [st, setSt] = useState({ a: HOME_BG, b: "", front: "a" as "a" | "b", current: HOME_BG });
  useEffect(() => {
    setSt((s) => {
      if (target === s.current) return s;
      return s.front === "a"
        ? { a: s.a, b: target, front: "b", current: target }
        : { a: target, b: s.b, front: "a", current: target };
    });
  }, [target]);

  const bg = (src: string) => (src ? { backgroundImage: `url("${src}")` } : undefined);

  return (
    <div className="exhibit" aria-label="ASUA CREATIVE">
      <div className={"photo" + (st.front === "a" ? "" : " off")} id="ph-a" style={bg(st.a)} />
      <div className={"photo" + (st.front === "b" ? "" : " off")} id="ph-b" style={bg(st.b)} />
      <div className="veil" />
      <div className="wash" />
      <svg className="layer" viewBox="0 0 640 340" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves={2} seed={7} /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .14 0" /></filter>
        </defs>
        <rect width="640" height="340" filter="url(#grain)" opacity=".5" />
        <g fill="none" stroke="#999" strokeWidth=".5" vectorEffect="non-scaling-stroke">
          <rect x="140" y="60" width="18" height="250" vectorEffect="non-scaling-stroke" />
          <path d="M149 100 v12 m-4 -4 l4 4 l4 -4 M149 280 v12 m-4 -4 l4 4 l4 -4" vectorEffect="non-scaling-stroke" />
          <path d="M86 150 h44 v44 h-44 z M100 138 h44 v44 h-44 z M86 150 l14 -12 M130 150 l14 -12 M130 194 l14 -12" vectorEffect="non-scaling-stroke" />
          <path d="M86 194 l14 -12" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
        </g>
        <text x="102" y="176" fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic" fontSize="8" fill="#666">0.1</text>
        <g id="barcode" fill="#333" transform="translate(300 270) scale(.6)">
          {BARCODE.map((r, i) => <rect key={i} x={r.x} y={0} width={r.w} height={34} />)}
        </g>
        <g fill="none" stroke="#999" strokeWidth=".5">
          <path d="M430 330 v-56 h38 v44 h7 v12 z" vectorEffect="non-scaling-stroke" />
          <path d="M430 302 h8 m22 0 h8" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
      <Link className="logo" href="/" aria-label="ASUA CREATIVE, inicio"><img src="/images/logo.gif" alt="" width={124} height={124} /></Link>
      <div className="mark"><b>asua</b><span className="legend"><i>R</i><span>Release</span><i>MX</i><span>Mix</span><i>A</i><span>Artist</span></span></div>
      <div className="date">11.26</div>
      <div className="serial" id="serial">{serial}</div>
      <div className="mirror">***-AUTHENTIC SOUL UNIQUE ART-***</div>
    </div>
  );
}
