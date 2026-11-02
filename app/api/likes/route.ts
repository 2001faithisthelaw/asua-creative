import { auth } from "@clerk/nextjs/server";
import { Redis } from "@upstash/redis";
import { NextResponse, type NextRequest } from "next/server";
import { TRACK_IDS } from "@/data/releases";

export const dynamic = "force-dynamic";

let redis: Redis | null = null;
function db() {
  if (!redis) redis = Redis.fromEnv();
  return redis;
}

const key = (trackId: string) => `likes:${trackId}`;

function badTrack(trackId: string | null): trackId is null {
  return !trackId || !TRACK_IDS.has(trackId);
}

/* GET /api/likes?trackId=… → { count, liked } (public) */
export async function GET(req: NextRequest) {
  const trackId = req.nextUrl.searchParams.get("trackId");
  if (badTrack(trackId)) return NextResponse.json({ error: "trackId inválido" }, { status: 400 });
  const { userId } = await auth();
  const [count, liked] = await Promise.all([
    db().scard(key(trackId)),
    userId ? db().sismember(key(trackId), userId) : Promise.resolve(0),
  ]);
  return NextResponse.json({ count, liked: liked === 1 });
}

/* POST /api/likes { trackId } → toggles the like of the signed-in user, returns { count, liked } */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { trackId?: unknown } | null;
  const trackId = typeof body?.trackId === "string" ? body.trackId : null;
  if (badTrack(trackId)) return NextResponse.json({ error: "trackId inválido" }, { status: 400 });
  const k = key(trackId);
  const removed = await db().srem(k, userId);
  if (!removed) await db().sadd(k, userId);
  const count = await db().scard(k);
  return NextResponse.json({ count, liked: !removed });
}
