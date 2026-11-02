"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const StatusContext = createContext<(t?: string) => void>(() => {});

export function useStatus() {
  return useContext(StatusContext);
}

/* Bevelled status bar: shows the data-s hint of whatever is hovered / focused. */
export function StatusProvider({ children }: { children: ReactNode }) {
  const [text, setText] = useState("Listo");
  const setS = useCallback((t?: string) => setText(t || "Listo"), []);

  useEffect(() => {
    const hint = (e: Event) => (e.target as Element | null)?.closest?.("[data-s]") as HTMLElement | null;
    const over = (e: Event) => { const el = hint(e); if (el) setS(el.dataset.s); };
    const out = (e: Event) => { const el = hint(e); if (el) setS(""); };
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    document.addEventListener("focusin", over);
    return () => {
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.removeEventListener("focusin", over);
    };
  }, [setS]);

  return (
    <StatusContext.Provider value={setS}>
      {children}
      <div className="status" aria-live="polite"><span id="status">{text}</span></div>
    </StatusContext.Provider>
  );
}
