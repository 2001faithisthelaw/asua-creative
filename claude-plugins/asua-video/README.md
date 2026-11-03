# asua-video (plugin de Claude Code)

Videos cortos con la estética ASUA: heavencore, weirdcore, liminal, found footage de handycam 2000.

## Comandos
- `/asua-video:montar <clips> [idea]` — arma un video (≈10 s) con tramos de tus clips, transiciones a blanco y el look.
- `/asua-video:look <video>` — solo el look handycam 2000 / PS2.
- `/asua-video:prompts <idea>` — brief + prompts para generar los clips gratis en Kling o Hailuo.
- Skill `heavencore` — guía de estética que Claude usa solo.

## Instalar
Desde Claude Code:
```
/plugin marketplace add 2001faithisthelaw/asua-creative
/plugin install asua-video@asua
```
O local, con el repo clonado: `/plugin marketplace add ./ruta/a/asua-creative`.

## Requisitos
`ffmpeg`, `python3`, `bash` (en Windows: Git Bash o WSL).

## Scripts sueltos
```bash
python3 scripts/montar.py salida.mp4 "tunel.mp4@3-15@2@wout" "escalera.mov@@0.6@win,zoom" "castillo.mp4@@0.3@zoom" --fecha "JUN.21 2003"
scripts/handycam.sh in.mp4 out.mp4 "JUN.21 2003"
```
