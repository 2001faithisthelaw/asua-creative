# asua-creative
Website for ASUA CREATIVE (Authentic Soul Unique Art), a collective and label for releases and mixes. Next.js + Vercel, 1998 web aesthetic, music player and likes__ Website for ASUA CREATIVE (Authentic Soul Unique Art), a collective and label for releases and mixes. Next.js + Vercel, 1998 web aesthetic, music player and likes.

## Desarrollo

```bash
cp .env.example .env.local   # completar claves de Clerk y Upstash
npm install
npm run dev
```

- `data/releases.ts`: catálogo (releases, tracks y audio en `/public/audio`).
- `app/api/likes`: `GET ?trackId=` → `{ count, liked }` (público); `POST { trackId }` → toggle con sesión de Clerk. Cada track es un set de Redis `likes:<trackId>` con los userIds.
- Variables: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
