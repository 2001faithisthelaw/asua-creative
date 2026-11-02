"use client";

import { useEffect } from "react";

/* A small star from the icon pack pops where the user clicks. Pointer events only, no-op on touch. */
export default function ClickBurst() {
  useEffect(() => {
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = document.createElement("img");
      el.src = "/icons/cursor.png";
      el.alt = "";
      el.className = "click-burst";
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, []);
  return null;
}
