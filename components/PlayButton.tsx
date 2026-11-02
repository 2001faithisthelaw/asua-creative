"use client";

import type { ReactNode } from "react";
import { usePlayer } from "./Player";

export default function PlayButton({ release, track = 0, className, hint, children }: { release: string; track?: number; className?: string; hint: string; children: ReactNode }) {
  const openPlayer = usePlayer();
  return (
    <button className={className} data-s={hint} onClick={() => openPlayer(release, track, true)}>
      {children}
    </button>
  );
}
