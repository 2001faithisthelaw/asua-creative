/* Seed catalog. The live catalog is read from Upstash (see lib/catalog.ts); a
   release saved from /admin overrides the seed entry with the same code.
   Each track: id (stable, used for likes) + title + audio URL. */
export type Track = { id: string; title: string; audio: string };

export type Release = {
  code: string;      // "ASUA0001"
  key: string;       // lowercase slug used in the URL: "asua0001"
  serial: string;    // stamp shown on the collage
  type: string;      // "Release (R)"
  title: string;
  artist: string;
  prod: string;
  date: string;      // "YYYY-MM-DD"
  cover: string;
  url: string;       // SoundCloud page
  tracks: Track[];
};

export const SEED_RELEASES: Release[] = [
  {
    code: "ASUA0001",
    key: "asua0001",
    serial: "2001",
    type: "Release (R)",
    title: "untitled-08",
    artist: "Joa",
    prod: "Zabtag",
    date: "2026-11-26",
    cover: "/images/asua0001_98.gif",
    url: "https://soundcloud.com/asua-colective/asf-untitled-08joa-prod-zab",
    tracks: [{ id: "asua0001-01", title: "untitled-08", audio: "/audio/asua0001-01.mp3" }],
  },
];

export const HOME_BG = "/images/banner98.gif";
