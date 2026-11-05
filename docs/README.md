# asua · tangente — static copy

Live: https://asuacreative.netlify.app (Netlify site name "asuacreative", connected to this repo: base directory `docs`, no build command, publish `docs`).
Also works on GitHub Pages: repo **Settings → Pages → Deploy from a branch → `main` / `/docs`**.

- `index.html` is the whole game (HTML + CSS + JS). Assets are relative: `images/`, `fonts/`, `audio/`, `og.jpg`.
- No server or build step. Any static host works (Netlify Drop, Cloudflare Pages): upload this folder.
- The Vercel route `/tangente` serves `public/tangente/tangente.html`; this folder is a separate copy, so edit both or pick one.
