/* One object per release. Each track: id + title + audio file in /public.
   A release with more than one track shows the previous / next controls. */
export type Track = { id: string; title: string; audio: string };

export type Release = {
  code: string;
  serial: string;
  type: string;
  title: string;
  artist: string;
  prod: string;
  cover: string;
  url: string;
  tracks: Track[];
};

export const RELEASES: Record<string, Release> = {
  asua0001: {
    code: "ASUA0001",
    serial: "2001",
    type: "Release (R)",
    title: "untitled-08",
    artist: "Joa",
    prod: "Zabtag",
    cover: "/images/asua0001_98.gif",
    url: "https://soundcloud.com/asua-colective/asf-untitled-08joa-prod-zab",
    tracks: [{ id: "asua0001-01", title: "untitled-08", audio: "/audio/asua0001-01.mp3" }],
  },
};

export const HOME_BG = "/images/banner98.gif";

export function getRelease(codigo: string): Release | undefined {
  return RELEASES[codigo.toLowerCase()];
}

export const TRACK_IDS = new Set(
  Object.values(RELEASES).flatMap((r) => r.tracks.map((t) => t.id)),
);
