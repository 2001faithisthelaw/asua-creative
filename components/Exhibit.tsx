"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HOME_BG } from "@/data/releases";
import { useCatalog } from "./Catalog";


/* ---- scattered fragments (seeded) ---- */
const SCATTER = (() => {
  let seed = 11;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const out: { x: string; y: string; w: string; h: string; t: string }[] = [];
  for (let n = 0; n < 40; n++) {
    const y = 10 + rnd() * 260, xx = 180 + rnd() * 60 + y * 0.12;
    const w = (2 + rnd() * 4).toFixed(1), h = (2 + rnd() * 3).toFixed(1);
    const t = `rotate(${(rnd() * 80 - 40).toFixed(0)} ${xx.toFixed(1)} ${y.toFixed(1)})`;
    out.push({ x: xx.toFixed(1), y: y.toFixed(1), w, h, t });
  }
  return out;
})();

export default function Exhibit() {
  const pathname = usePathname();
  const m = pathname.match(/^\/release\/([^/]+)/);
  const catalog = useCatalog();
  const slug = m ? decodeURIComponent(m[1]).toLowerCase() : "";
  const rel = slug ? catalog.find((r) => r.key === slug) : undefined;
  const target = rel ? rel.cover : HOME_BG;

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
      <div className="wash" />
      <svg className="layer" viewBox="0 0 640 340" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves={2} seed={7} /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .14 0" /></filter>
        </defs>
        <rect width="640" height="340" filter="url(#grain)" />
        <rect x="140" y="60" width="18" height="250" fill="none" stroke="#031819" strokeOpacity=".2" strokeWidth="4" />
        <path d="M149 100 v12 m-4 -4 l4 4 l4 -4 M149 280 v12 m-4 -4 l4 4 l4 -4" stroke="#031819" strokeOpacity=".3" fill="none" />
        <image href="/icons/diamond.png" x="80" y="112" width="80" height="80" opacity=".55" />
        <g fill="none" stroke="#031819" strokeWidth=".6" strokeOpacity=".7">
          <path d="M350 226 l54 -30 h140 l-54 30 z" />
          <path d="M350 258 l54 -30 h140 l-54 30 z" strokeOpacity=".4" />
          <path d="M350 290 l54 -30 h140 l-54 30 z" strokeOpacity=".25" />
          <path d="M236 206 h140" />
        </g>
        <g fill="none" stroke="#031819" strokeWidth="1.2">
          <path d="M430 330 v-56 h38 v44 h7 v12 z" />
          <path d="M430 302 h8 m22 0 h8" />
        </g>
        <defs>
          <symbol id="mini-star" viewBox="-5 -5 10 10"><path d="M0 -5 L1.1 -1.1 L5 0 L1.1 1.1 L0 5 L-1.1 1.1 L-5 0 L-1.1 -1.1 Z" /></symbol>
        </defs>
        <g fill="#031819" opacity=".4" id="scatter">
          {SCATTER.map((r, i) => <use key={i} href="#mini-star" x={Number(r.x) - 3} y={Number(r.y) - 3} width={Number(r.w) + 2} height={Number(r.w) + 2} transform={r.t} />)}
        </g>
      </svg>
      <Link className="logo" href="/" aria-label="ASUA CREATIVE, inicio"><img src="/images/logo-red.png" alt="" width={124} height={124} /></Link>
      <div className="mark"><img className="title-img" src="/icons/asua-gothic.png" alt="asua" /><span className="legend"><i>R</i><span>Release</span><i>MX</i><span>Mix</span><i>A</i><span>Artist</span></span></div>
      <div className="date">11.26</div>
      <div className="mirror">***-AUTHENTIC SOUL UNIQUE ART-***</div>
    </div>
  );
}
