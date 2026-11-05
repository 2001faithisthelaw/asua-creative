# asua · tangente — static copy

Free hosting with GitHub Pages: repo **Settings → Pages → Deploy from a branch → `main` / `/docs`**.
It goes live at https://2001faithisthelaw.github.io/asua-creative/

- `index.html` is the whole game (HTML + CSS + JS). Assets are relative: `images/`, `fonts/`, `audio/`, `og.jpg`.
- No server or build step. Any static host works (Netlify Drop, Cloudflare Pages): upload this folder.
- The Vercel route `/tangente` serves `public/tangente/tangente.html`; this folder is a separate copy, so edit both or pick one.
