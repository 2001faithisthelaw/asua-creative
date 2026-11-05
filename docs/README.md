# asua · tangente — static copy

Live on GitHub Pages: https://2001faithisthelaw.github.io/asua-creative/
Repo **Settings → Pages → Deploy from a branch → `main` / `/docs`**. Every push to `main` that touches this folder republishes it.

- `index.html` is the whole game (HTML + CSS + JS). Assets are relative: `images/`, `fonts/`, `audio/`, `og.jpg`.
- No server or build step; any static host works with this folder as is.
- The Vercel route `/tangente` serves `public/tangente/tangente.html`; this folder is a separate copy, so edit both or pick one.
