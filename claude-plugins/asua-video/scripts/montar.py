#!/usr/bin/env python3
"""Monta un video corto a partir de tramos de clips y le aplica el look handycam.

Uso:
  montar.py salida.mp4 TRAMO [TRAMO ...] [--fecha "JUN.21 2003"] [--sin-look] [--vertical]

TRAMO = ruta@inicio-fin@velocidad@efectos
  inicio-fin  segundos del clip original (ej. 3-15). Vacío = todo el clip.
  velocidad   2 = el doble de rápido, 0.5 = cámara lenta (sirve para estirar clips cortos).
  efectos     separados por coma:
                wout  -> se quema a blanco al final (la luz se expande)
                win   -> aparece desde blanco
                zoom  -> push-in lento
                ""    -> nada

Ej:
  montar.py op1.mp4 tunel.mp4@3-15@2@wout escalera.mov@@0.6@win,zoom castillo.mp4@@0.3@zoom
"""
import os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
FPS = 24


def probe_dur(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                   "-of", "csv=p=0", path], text=True)
    return float(out.strip())


def seg(path, rng, speed, fx, out, W, H):
    full = probe_dur(path)
    a, b = 0.0, full
    if rng:
        s, e = rng.split("-")
        a = float(s) if s else 0.0
        b = min(float(e), full) if e else full
    speed = float(speed or 1)
    dur = (b - a) / speed
    f = [f"trim=start={a}:end={b}", "setpts=(PTS-STARTPTS)/%s" % speed, f"fps={FPS}",
         f"scale={W}:{H}:force_original_aspect_ratio=increase", f"crop={W}:{H}", "setsar=1"]
    if "zoom" in fx:
        z = f"(1+0.14*t/{dur:.3f})"
        f += [f"scale=w='trunc({W}*{z}/2)*2':h='trunc({H}*{z}/2)*2':eval=frame", f"crop={W}:{H}"]
    if "win" in fx:
        f.append(f"fade=t=in:st=0:d={min(0.8, dur / 2):.2f}:color=white")
    if "wout" in fx:
        d = min(1.0, dur / 2)
        f.append(f"fade=t=out:st={dur - d:.2f}:d={d:.2f}:color=white")
    f.append("format=yuv420p")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-vf", ",".join(f), "-an",
                    "-c:v", "libx264", "-crf", "14", "-preset", "fast", out], check=True)
    return dur


def main(argv):
    fecha, look, vertical, args = "JUN.21 2003", True, False, []
    it = iter(argv)
    for x in it:
        if x == "--fecha":
            fecha = next(it)
        elif x == "--sin-look":
            look = False
        elif x == "--vertical":
            vertical = True
        else:
            args.append(x)
    if len(args) < 2:
        print(__doc__)
        sys.exit(1)
    out, tramos = args[0], args[1:]
    W, H = (720, 1280) if vertical else (960, 720)
    tmp = tempfile.mkdtemp()
    parts, total = [], 0.0
    for i, t in enumerate(tramos):
        p = (t.split("@") + ["", "", ""])[:4]
        path, rng, speed, fx = p
        o = os.path.join(tmp, f"{i:02d}.mp4")
        total += seg(path, rng, speed, fx.split(","), o, W, H)
        parts.append(o)
    lst = os.path.join(tmp, "list.txt")
    with open(lst, "w") as fh:
        fh.writelines(f"file '{p}'\n" for p in parts)
    joined = os.path.join(tmp, "joined.mp4") if look else out
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst,
                    "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", joined], check=True)
    if look:
        env = dict(os.environ, VERTICAL="1" if vertical else "0")
        subprocess.run([os.path.join(HERE, "handycam.sh"), joined, out, fecha], check=True, env=env)
    print(f"listo -> {out} ({total:.1f}s)")


if __name__ == "__main__":
    main(sys.argv[1:])
