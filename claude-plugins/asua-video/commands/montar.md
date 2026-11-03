---
description: Monta un video corto (≈10s) a partir de clips de referencia o generados, con transiciones a blanco y look handycam 2000
argument-hint: <clips o carpeta> [idea / orden / duración / vertical]
allowed-tools: Bash, Read, Glob
---

Armá un video corto estética ASUA con estos clips / pedido: $ARGUMENTS

1. Cargá el skill `heavencore` para la estética y la estructura narrativa.
2. Inspeccioná cada clip con `ffprobe` (duración, resolución) y hacé una hoja de contacto para VERLO antes de decidir tramos:
   `ffmpeg -v error -y -i CLIP -vf "fps=N/DUR,scale=240:-1,tile=Nx1" -frames:v 1 hoja.jpg` y leé la imagen.
   Detectá: dónde está la acción buena, cuándo la luz se quema a blanco, marcas de agua / placas finales (ej. cierre de TikTok) para dejarlas afuera.
3. Planificá los tramos para la duración pedida (default 10 s; si piden "3 opciones", hacé 3 montajes distintos). Clips muy cortos se estiran con velocidad < 1.
4. Montá con:
   `python3 "${CLAUDE_PLUGIN_ROOT}/scripts/montar.py" salida.mp4 "clip@ini-fin@vel@fx" ... --fecha "JUN.21 2003" [--vertical] [--sin-look]`
   fx: `wout` (se quema a blanco al final), `win` (aparece desde blanco), `zoom` (push-in). Ver `--help` en el docstring.
5. Revisá el resultado con una hoja de contacto (leé la imagen) y corregí tiempos si algo queda mal.
6. Entregá los MP4 y una línea por opción explicando el orden de tramos. Avisá si quedaron marcas de agua visibles de material de terceros (Getty, TikTok…): no las borres; recomendá reemplazar ese material antes de publicar.
