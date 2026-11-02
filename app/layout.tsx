import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import Exhibit from "@/components/Exhibit";
import { PlayerProvider } from "@/components/Player";
import { StatusProvider } from "@/components/Status";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASUA CREATIVE",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap" />
      </head>
      <body>
        <ClerkProvider>
          <StatusProvider>
            <PlayerProvider>
              <div className="wrap">
                <Exhibit />
                {children}
                <footer>
                  <a href="https://soundcloud.com/asua-colective" target="_blank" rel="noopener" data-s="soundcloud">soundcloud.com/asua-colective</a>
                  <span className="copy">©2026 ASUA CREATIVE. Las obras pertenecen a sus autores.</span>
                </footer>
              </div>
            </PlayerProvider>
          </StatusProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
