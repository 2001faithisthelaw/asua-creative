---
name: heavencore
description: Estética visual ASUA para videos cortos — heavencore, weirdcore, liminal, found footage de handycam 2000, look PS2, grunge/soul, "trash tercermundista". Usar al planificar, montar o escribir prompts de video para ASUA CREATIVE, o cuando pidan ese look (luz celestial sobreexpuesta, siluetas a contraluz, escaleras al cielo, castillo en las nubes).
---

# Heavencore ASUA

## La imagen
- **Cámara**: handycam / camcorder casera 2000–2004. 4:3 (640×480) o 9:16 para redes. Baja resolución estirada (pixel visible), grano, color corrido, leve fantasmeo, cámara en mano, timestamp `▶ PLAY` + fecha `JUN.21 2003` + hora.
- **Luz**: contraluz extremo, blancos quemados, bloom que se come los bordes. La luz es el personaje principal.
- **Color**: desaturado, sombras levantadas; cielos celeste-lavanda, brumas rosas, arcoíris tenue.
- **Sensación**: liminal (pasillos, túneles, campos vacíos, puertas solas), sueño, nostalgia, gráficos de PS2, algo de "trash" y precario — no prolijo ni cinematográfico 4K.

## Estructura narrativa base (≈10 s)
1. **Hacia la luz** (~6 s): silueta (chica esbelta, pelo largo lacio, minivestido, estilo francés años 60) camina/saltita/corretea de espaldas hacia una luz fuerte: campo, pasillo/puente, túnel o puerta de luz.
2. **Quemado a blanco** (~0.5–1 s): la luz se expande y llena toda la pantalla.
3. **El cielo** (~3–4 s): desde el blanco aparece una escalera que sube a un castillo gótico en el cielo (forma de agujas finas, como el castillo dentro del orbe del logo `public/images/logo.gif` del sitio ASUA), bruma rosa, rayos.

El blanco es el pegamento: une tramos de fuentes distintas sin que se note.

## Montaje (scripts del plugin)
- `scripts/montar.py salida.mp4 "clip@ini-fin@vel@fx" ...` — tramos con `wout` / `win` / `zoom`, aplica el look al final.
- `scripts/handycam.sh in.mp4 out.mp4 "FECHA"` — solo el look (`VERTICAL=1`, `WHITE=1`).
- Ritmo: acelerá caminatas largas ×1.5–2; estirá planos cortos (castillo, escalera) con vel 0.3–0.8 + `zoom`.

## Prompts para IA (Kling / Hailuo, gratis con créditos diarios)
- Un clip = una acción. Usar start frame / end frame cuando el modelo lo permita (end frame blanco para el clip "hacia la luz").
- Pedir la imagen relativamente limpia; el trash lo pone `handycam.sh` para que todo quede parejo.
- No nombrar personas reales: describir el estilo.

**Silueta**: `slender young woman, 1960s french-girl style, long straight hair with bangs, short loose mini dress, thin legs, seen from behind as a pure black silhouette against blinding backlight`

**Video A (ejemplo)**: `handheld camcorder shot from behind: the girl silhouette skips and runs playfully toward the blinding light, dress fluttering, the light grows until it fills the entire frame with pure white. amateur 2000s home video, slight shake, overexposed, dreamy, ethereal`

**Castillo**: `a long pale stone staircase rising from soft white clouds up into the sky, leading to a tall gothic castle silhouette with many thin pointed spires and a central dome, hazy pastel sky, faint rainbow, pink mist, overexposed heavenly light, liminal, early 2000s camcorder, low resolution, heavencore, weirdcore, PS2 era, no people`

**Video B**: `from pure white light, a long stone staircase slowly fades in, rising through clouds toward a gothic castle floating in the sky, slow gentle push forward, heavenly glow, soft bloom, 2000s camcorder, liminal dream`

**Negativo**: `face visible, close-up, sharp modern 4k, cinematic grading, text, watermark, logo, extra limbs, distorted body, multiple people`

## Derechos
Material de stock con marca de agua (Getty) o de TikTok sirve como referencia o borrador. No quitar marcas de agua; para publicar, reemplazar esos tramos por clips propios o generados.
