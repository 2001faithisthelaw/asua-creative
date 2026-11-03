---
description: Aplica el look handycam 2000 / PS2 / heavencore a un video
argument-hint: <video> [fecha "MES.DD AAAA"] [vertical] [blanco al final]
allowed-tools: Bash, Read
---

Aplicá el look a: $ARGUMENTS

Usá `"${CLAUDE_PLUGIN_ROOT}/scripts/handycam.sh" entrada.mp4 salida.mp4 "JUN.21 2003"`.
- `VERTICAL=1` antes del comando para 9:16.
- `WHITE=1` para quemar a blanco el último 1.2 s.
- Si la fuente del timestamp falla, pasá `FONT=/ruta/a/fuente.ttf`.
Guardá la salida al lado del original con sufijo `-handycam.mp4`, sacá un frame y miralo para confirmar.
