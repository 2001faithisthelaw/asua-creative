#!/usr/bin/env bash
# Look "handycam 2000 / PS2 / heavencore": baja resolución, bloom quemado, grano,
# color corrido, fantasmeo y timestamp de cámara casera.
# Uso: handycam.sh entrada.mp4 salida.mp4 ["JUN.21 2003"]
#   VERTICAL=1  -> 9:16 (480x854) en vez de 4:3 (640x480)
#   WHITE=1     -> quema a blanco el último 1.2 s
#   NOOSD=1     -> sin PLAY / fecha / hora
#   BLOOM=0.85  -> intensidad del brillo quemado (0.3 suave … 1 fuerte)
#   BRIGHT=0.04 -> brillo general
#   TONE=cold   -> tono frío / drainer (default warm)
#   FONT=/ruta/fuente.ttf para el timestamp
set -euo pipefail
IN="$1"; OUT="$2"; DATE="${3:-JUN.21 2003}"

if [ -z "${FONT:-}" ]; then
  if command -v fc-match >/dev/null 2>&1; then FONT="$(fc-match -f '%{file}' 'DejaVu Sans Mono:bold')"
  elif [ -f /System/Library/Fonts/Menlo.ttc ]; then FONT=/System/Library/Fonts/Menlo.ttc
  elif [ -f /c/Windows/Fonts/consola.ttf ]; then FONT=/c/Windows/Fonts/consola.ttf
  fi
fi
FONTOPT=""; [ -n "${FONT:-}" ] && FONTOPT="fontfile=${FONT}:"

if [ "${VERTICAL:-0}" = "1" ]; then W=480; H=854; LW=240; LH=426; else W=640; H=480; LW=320; LH=240; fi

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
WHITE_FILTER=""
if [ "${WHITE:-0}" = "1" ]; then
  ST=$(awk -v d="$DUR" 'BEGIN{printf "%.2f", d-1.2}')
  WHITE_FILTER=",fade=t=out:st=${ST}:d=1.2:color=white"
fi
if [ "${TONE:-warm}" = "cold" ]; then
  CURVES="curves=r='0/0.02 0.5/0.46 1/0.95':g='0/0.03 0.5/0.50 1/0.98':b='0/0.08 0.5/0.57 1/1'"
else
  CURVES="curves=r='0/0.03 0.5/0.55 1/1':g='0/0.02 0.5/0.52 1/0.98':b='0/0.06 0.5/0.5 1/0.95'"
fi
TXT="fontsize=20:fontcolor=white@0.85:shadowcolor=black@0.6:shadowx=2:shadowy=2"

OSD=""
if [ "${NOOSD:-0}" != "1" ]; then
  OSD=",drawtext=${FONTOPT}text='▶ PLAY':x=28:y=24:${TXT}, drawtext=${FONTOPT}text='${DATE}':x=w-tw-28:y=h-th-50:${TXT}, drawtext=${FONTOPT}text='17\:23\:%{eif\:mod(14+t\,60)\:d\:2}':x=w-tw-28:y=h-th-24:${TXT}"
fi
ffmpeg -v error -y -i "$IN" -filter_complex "
[0:v]fps=24,scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},
 eq=contrast=1.12:brightness=${BRIGHT:-0.04}:saturation=0.82:gamma=1.08,
 ${CURVES},
 split[base][glow];
[glow]curves=all='0/0 0.6/0 1/1',gblur=sigma=18[bloom];
[base][bloom]blend=all_mode=screen:all_opacity=${BLOOM:-0.85},
 scale=${LW}:${LH}:flags=bilinear,
 chromashift=cbh=3:crh=-3,
 noise=alls=14:allf=t,
 scale=${W}:${H}:flags=neighbor,
 tmix=frames=2:weights='1 0.45',
 vignette=PI/4.5
 ${OSD}
 ${WHITE_FILTER},format=yuv420p[v]" \
 -map "[v]" -an -c:v libx264 -crf 20 -preset medium -movflags +faststart "$OUT"
echo "ok -> $OUT"
