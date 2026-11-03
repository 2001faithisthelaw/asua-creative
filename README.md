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
- Variables: see `.env.example`.

### Panel `/admin` (cargar releases)

Solo la cuenta cuyo id de Clerk está en `ADMIN_USER_ID` puede entrar.

1. Clerk dashboard → Users → copiá el id (`user_…`) de tu cuenta y ponelo en `ADMIN_USER_ID`.
2. Vercel → Storage → crear un **Blob** store y conectarlo al proyecto (carga `BLOB_READ_WRITE_TOKEN`).
3. En `/admin`: pegá el link de SoundCloud y tocá **Autocompletar** (título, artista y portada). Revisá la fecha, subí el mp3 de cada track y publicá. Aparece en el sitio al instante.

Los releases guardados están en Upstash (hash `releases`) y tienen prioridad sobre `data/releases.ts`, que queda como semilla. El release más nuevo (por fecha) es el que aparece en el bloque destacado del index.

## Video con Claude Code

Al abrir Claude Code en este repo:

- Se ofrece instalar el plugin **ai-video-producer** (marketplace `danielrosehill`, configurado en `.claude/settings.json`). Comandos: `/setup-credentials` (una vez), `/install-video-workspace`, `/onboard`, `/draft-script`, `/storyboard`, `/run-pipeline`, `/assemble`. Conviene correrlos en una carpeta aparte por video, no en la raíz del sitio.
- Skills en `.claude/skills/` copiados de [claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit) (MIT): `ffmpeg`, `remotion-official`, `playwright-recording`.

Los comandos `/setup` y `/video` del toolkit y sus herramientas con IA (voz, música, imágenes) necesitan el repo completo: clonalo aparte y abrí `claude` dentro de esa carpeta.

### Plugin propio: `asua-video`

En `claude-plugins/asua-video` (marketplace `asua` en `.claude-plugin/marketplace.json`). Comandos `/asua-video:montar`, `/asua-video:look`, `/asua-video:prompts` y skill `heavencore`. Ver su README. Requiere `ffmpeg` y `python3`.
