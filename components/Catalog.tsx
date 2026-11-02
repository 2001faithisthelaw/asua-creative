"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Release } from "@/data/releases";

/* The catalog is read on the server (layout) and handed to the client tree. */
const CatalogContext = createContext<Release[]>([]);

export function CatalogProvider({ releases, children }: { releases: Release[]; children: ReactNode }) {
  return <CatalogContext.Provider value={releases}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
