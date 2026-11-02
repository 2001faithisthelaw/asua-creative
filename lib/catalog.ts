import { Redis } from "@upstash/redis";
import { SEED_RELEASES, type Release } from "@/data/releases";

/* Releases saved from /admin live in the Redis hash "releases" (field = key).
   The seed catalog is the fallback, so the site still renders if Redis is down. */
const HASH = "releases";

let redis: Redis | null = null;
function db() {
  if (!redis) redis = Redis.fromEnv();
  return redis;
}

export async function getReleases(): Promise<Release[]> {
  const byKey = new Map(SEED_RELEASES.map((r) => [r.key, r]));
  try {
    const saved = await db().hgetall<Record<string, Release>>(HASH);
    if (saved) for (const r of Object.values(saved)) byKey.set(r.key, r);
  } catch (e) {
    console.error("catalog: falling back to seed", e);
  }
  return [...byKey.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getRelease(key: string): Promise<Release | undefined> {
  const k = key.toLowerCase();
  return (await getReleases()).find((r) => r.key === k);
}

export async function saveRelease(r: Release): Promise<void> {
  await db().hset(HASH, { [r.key]: r });
}

export function trackIds(releases: Release[]): Set<string> {
  return new Set(releases.flatMap((r) => r.tracks.map((t) => t.id)));
}
