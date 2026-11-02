"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const VARIANTS = {
  "19": { family: "Xposed", png: "/images/asua-titulo-19.png" },
  "05": { family: "Primitive", png: "/images/asua-titulo-05.png" },
  "07": { family: "BuGothic", png: "/images/asua-titulo-07.png" },
} as const;

type VariantId = keyof typeof VARIANTS;

const ALIASES: Record<string, VariantId> = { a: "19", b: "05", c: "07", "19": "19", "05": "05", "07": "07" };
const PNG_ONLY_ALIASES: Record<string, VariantId> = { "05png": "05", bpng: "05" };
const DEFAULT_VARIANT: VariantId = "19";

function TitleView({ id, pngOnly = false }: { id: VariantId; pngOnly?: boolean }) {
  const { family, png } = VARIANTS[id];
  const [fontFailed, setFontFailed] = useState(pngOnly);
  const [pngFailed, setPngFailed] = useState(false);

  useEffect(() => {
    if (pngOnly) return;
    let cancelled = false;
    document.fonts
      .load(`32px "${family}"`, "asua")
      .then((faces) => { if (!cancelled) setFontFailed(faces.length === 0); })
      .catch(() => { if (!cancelled) setFontFailed(true); });
    return () => { cancelled = true; };
  }, [family, pngOnly]);

  const showPng = fontFailed && !pngFailed;

  return (
    <div className={`site-title v${id}${showPng ? " is-png" : ""}`} data-variant={id}>
      <h1>
        {showPng ? (
          <img src={png} alt="ASUA" onError={() => setPngFailed(true)} />
        ) : (
          <span className="word">asua</span>
        )}
      </h1>
      <p className="tagline">authentic soul unique art</p>
    </div>
  );
}

function TitleFromParams() {
  const param = useSearchParams().get("titulo")?.toLowerCase() ?? "";
  const id = ALIASES[param] ?? DEFAULT_VARIANT;
  return <TitleView key={id} id={id} />;
}

export default function SiteTitle() {
  return (
    <Suspense fallback={<TitleView id={DEFAULT_VARIANT} />}>
      <TitleFromParams />
    </Suspense>
  );
}
