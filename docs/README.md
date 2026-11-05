# asua · tangente — static copy

Live at https://asuacreative.is-my.app (free subdomain from is-my.app: they build this repo's `docs/` folder from `main` and host it on Cloudflare Pages; claim file in `tools/is-my-app/`). New commits on `main` are redeployed within about an hour.
Also works on GitHub Pages: repo **Settings → Pages → `main` / `/docs`**.

- `index.html` is the whole game (HTML + CSS + JS). Assets are relative: `images/`, `fonts/`, `audio/`, `og.jpg`.
- No server or build step; any static host works with this folder as is.
- The Vercel route `/tangente` serves `public/tangente/tangente.html`; this folder is a separate copy, so edit both or pick one.
