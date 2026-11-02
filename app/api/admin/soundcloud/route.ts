import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

/* GET /api/admin/soundcloud?url=… → title, artist and artwork from SoundCloud's oEmbed (admin only).
   Only soundcloud.com links are accepted, so this can't be used to fetch arbitrary URLs. */
export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const raw = req.nextUrl.searchParams.get("url") ?? "";
  let u: URL;
  try { u = new URL(raw); } catch { return NextResponse.json({ error: "Link inválido" }, { status: 400 }); }
  if (u.protocol !== "https:" || !(u.hostname === "soundcloud.com" || u.hostname.endsWith(".soundcloud.com"))) {
    return NextResponse.json({ error: "Tiene que ser un link de soundcloud.com" }, { status: 400 });
  }

  const r = await fetch("https://soundcloud.com/oembed?format=json&url=" + encodeURIComponent(u.toString()), {
    cache: "no-store",
  });
  if (!r.ok) return NextResponse.json({ error: "SoundCloud no devolvió datos de ese link" }, { status: 502 });
  const d = (await r.json()) as { title?: string; author_name?: string; thumbnail_url?: string };
  return NextResponse.json({
    title: d.title ?? "",
    artist: d.author_name ?? "",
    cover: d.thumbnail_url ?? "",
  });
}
