import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin";
import { saveRelease } from "@/lib/catalog";
import type { Release, Track } from "@/data/releases";

export const dynamic = "force-dynamic";

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isHttps = (v: string) => /^https:\/\//.test(v);

/* POST /api/admin/releases → create or update a release (admin only) */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return NextResponse.json({ error: "Body inválido" }, { status: 400 });

  const code = str(b.code, 20).toUpperCase();
  const title = str(b.title), artist = str(b.artist), prod = str(b.prod);
  const date = str(b.date, 10), url = str(b.url, 300), cover = str(b.cover, 500);
  const serial = str(b.serial, 8) || "2001";
  const type = str(b.type, 40) || "Release (R)";

  const errors: string[] = [];
  if (!/^[A-Z0-9]{3,20}$/.test(code)) errors.push("código: solo letras y números (ej. ASUA0002)");
  if (!title) errors.push("título");
  if (!artist) errors.push("artista");
  if (!prod) errors.push("productor");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push("fecha (YYYY-MM-DD)");
  if (!isHttps(url)) errors.push("link de SoundCloud");
  if (!isHttps(cover)) errors.push("portada");

  const rawTracks = Array.isArray(b.tracks) ? (b.tracks as Record<string, unknown>[]) : [];
  const key = code.toLowerCase();
  const tracks: Track[] = rawTracks.map((t, i) => ({
    id: str(t.id, 60) || `${key}-${String(i + 1).padStart(2, "0")}`,
    title: str(t.title) || `${title}`,
    audio: str(t.audio, 500),
  }));
  if (tracks.length === 0) errors.push("al menos un track");
  tracks.forEach((t, i) => { if (!isHttps(t.audio)) errors.push(`audio del track ${i + 1}`); });
  if (new Set(tracks.map((t) => t.id)).size !== tracks.length) errors.push("ids de track repetidos");

  if (errors.length) {
    return NextResponse.json({ error: "Falta o está mal: " + errors.join(", ") }, { status: 400 });
  }

  const release: Release = { code, key, serial, type, title, artist, prod, date, cover, url, tracks };
  await saveRelease(release);
  return NextResponse.json({ ok: true, key });
}
