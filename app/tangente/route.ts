/* /tangente is a standalone piece, served as its own document (no site layout, no player).
   The page itself lives in public/tangente/tangente.html — edit THAT file (HTML, CSS and JS together).
   This handler only wraps it with <head> tags: charset, viewport, a <base> so relative paths resolve
   inside /tangente/, and absolute Open Graph tags so LinkedIn shows a proper preview card. */
const TITLE = "asua tangente";
const DESC = "un archivo de ciclos creativos. no stas perdido, stas explorando.";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const res = await fetch(`${origin}/tangente/tangente.html`, { next: { revalidate: 300 } }).catch(() => null);
  if (!res || !res.ok) return Response.redirect(`${origin}/tangente/tangente.html`, 307);
  const page = await res.text();
  const cut = page.indexOf("</style>") + "</style>".length;
  const url = `${origin}/tangente`;
  const img = `${origin}/tangente/og.jpg`;
  const meta = [
    `<meta charset="utf-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`,
    `<base href="/tangente/">`,
    `<meta name="description" content="${DESC}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="ASUA CREATIVE">`,
    `<meta property="og:title" content="${TITLE}">`,
    `<meta property="og:description" content="${DESC}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${img}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="627">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:image" content="${img}">`,
  ].join("\n");
  const html = `<!doctype html>\n<html lang="es">\n<head>\n${meta}\n${page.slice(0, cut)}\n</head>\n<body>${page.slice(cut)}\n</body>\n</html>\n`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=0, s-maxage=300" } });
}
