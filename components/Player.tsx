"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import {
  createContext, useCallback, useContext, useEffect, useRef, useState,
  type CSSProperties, type ReactNode,
} from "react";
import type { Release } from "@/data/releases";
import { useCatalog } from "./Catalog";
import { useStatus } from "./Status";

type OpenPlayer = (key: string, i: number, autoplay: boolean) => void;
const PlayerContext = createContext<OpenPlayer>(() => {});

export function usePlayer() {
  return useContext(PlayerContext);
}

const pad2 = (n: number) => String(n).padStart(2, "0");
function fmt(s: number) {
  if (!isFinite(s)) return "0:00";
  s = Math.floor(s);
  return Math.floor(s / 60) + ":" + pad2(s % 60);
}

/* Chrome Y2K player: skin + hotspots, coordinates in % of the 736×728 skin. */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const setS = useStatus();
  const catalog = useCatalog();
  const { isSignedIn } = useAuth();
  const clerk = useClerk();

  const audioRef = useRef<HTMLAudioElement>(null);
  const vizRef = useRef<HTMLCanvasElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const actx = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const raf = useRef(0);
  const drag = useRef<{ y: number; v: number } | null>(null);

  const [rel, setRel] = useState<Release | null>(null);
  const [idx, setIdx] = useState(0);
  const [hidden, setHidden] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [showViz, setShowViz] = useState(true);
  const [listHidden, setListHidden] = useState(true);
  const [time, setTime] = useState("0:00 / 0:00");
  const [seekP, setSeekP] = useState(0);
  const [vol, setVolState] = useState(80);
  const volRef = useRef(80);

  /* ---- visualizer ---- */
  const drawBars = useCallback((data: Uint8Array | null) => {
    const viz = vizRef.current, vx = viz?.getContext("2d");
    if (!viz || !vx) return;
    vx.clearRect(0, 0, viz.width, viz.height);
    const n = 24, w = viz.width / n;
    for (let i = 0; i < n; i++) {
      const v = data ? data[i] / 255 : 0.03, h = Math.max(4, v * viz.height);
      for (let y = viz.height - 6; y > viz.height - h; y -= 8) {
        vx.fillStyle = y < viz.height * 0.3 ? "#c6ff3d" : y < viz.height * 0.6 ? "#8ee000" : "#5fa800";
        vx.fillRect(i * w + 2, y, w - 4, 5);
      }
    }
  }, []);

  const loop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const audio = audioRef.current!;
    const data = new Uint8Array(analyser.current ? analyser.current.frequencyBinCount : 32);
    const f = () => {
      if (audio.paused) { drawBars(null); return; }
      if (analyser.current) analyser.current.getByteFrequencyData(data);
      drawBars(data);
      raf.current = requestAnimationFrame(f);
    };
    f();
  }, [drawBars]);

  /* ---- transport ---- */
  const ensureAudioGraph = useCallback(() => {
    try {
      if (!actx.current) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AC();
        const an = ctx.createAnalyser();
        an.fftSize = 64;
        const src = ctx.createMediaElementSource(audioRef.current!);
        src.connect(an);
        an.connect(ctx.destination);
        actx.current = ctx;
        analyser.current = an;
      }
      if (actx.current.state === "suspended") actx.current.resume();
    } catch {}
  }, []);

  const play = useCallback(() => {
    ensureAudioGraph();
    audioRef.current!.play().then(loop).catch((e: unknown) => {
      const name = e && typeof e === "object" && "name" in e ? String((e as { name: unknown }).name) : "";
      setS("No se pudo reproducir el audio" + (name ? " (" + name + ")" : "") + ".");
    });
  }, [ensureAudioGraph, loop, setS]);

  const pause = useCallback(() => audioRef.current?.pause(), []);

  const load = useCallback((r: Release, i: number) => {
    setRel(r);
    setIdx(i);
    const audio = audioRef.current!;
    audio.src = r.tracks[i].audio;
    setSeekP(0);
    setTime("0:00 / 0:00");
    drawBars(null);
  }, [drawBars]);

  const openPlayer = useCallback<OpenPlayer>((key, i, autoplay) => {
    const r = catalog.find((x) => x.key === key);
    if (!r) return;
    setHidden(false);
    load(r, i);
    if (autoplay) play();
  }, [catalog, load, play]);

  /* ---- volume: vertical slider + dial, kept in sync ---- */
  const setVol = useCallback((v: number) => {
    v = Math.max(0, Math.min(100, Math.round(v)));
    if (audioRef.current) audioRef.current.volume = v / 100;
    volRef.current = v;
    setVolState(v);
  }, []);

  useEffect(() => { setVol(80); }, [setVol]);

  useEffect(() => {
    const dial = dialRef.current;
    if (!dial) return;
    const wheel = (e: WheelEvent) => { e.preventDefault(); setVol(volRef.current - Math.sign(e.deltaY) * 5); };
    dial.addEventListener("wheel", wheel, { passive: false });
    return () => dial.removeEventListener("wheel", wheel);
  }, [setVol]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  /* ---- likes (Clerk + /api/likes) ---- */
  const trackId = rel ? rel.tracks[idx].id : null;
  const [likes, setLikes] = useState<{ count: number | null; liked: boolean }>({ count: null, liked: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!trackId) return;
    let alive = true;
    setLikes({ count: null, liked: false });
    fetch("/api/likes?trackId=" + encodeURIComponent(trackId), { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d: { count: number; liked: boolean }) => { if (alive) setLikes({ count: d.count, liked: d.liked }); })
      .catch(() => {});
    return () => { alive = false; };
  }, [trackId, isSignedIn]);

  const onLike = async () => {
    if (!trackId) return;
    if (!isSignedIn) { clerk.openSignIn(); return; }
    const prev = likes, wasLiked = likes.liked;
    setLikes({ count: prev.count === null ? null : prev.count + (wasLiked ? -1 : 1), liked: !wasLiked });
    setSaving(true);
    try {
      const r = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId }),
      });
      if (!r.ok) throw new Error(String(r.status));
      const d = (await r.json()) as { count: number; liked: boolean };
      setLikes({ count: d.count, liked: d.liked });
      setS(d.liked ? "Te gusta este track" : "Quitaste el me gusta");
    } catch {
      setLikes(prev);
      setS("No se pudo guardar el me gusta.");
    } finally {
      setSaving(false);
    }
  };

  const multi = !!rel && rel.tracks.length > 1;
  const tr = rel ? rel.tracks[idx] : null;
  const title = tr ? (multi ? pad2(idx + 1) + " " : "") + tr.title : "";

  /* marquee only when the title does not fit the screen */
  const titleBox = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    const box = titleBox.current;
    if (!box || hidden) return;
    const measure = () => {
      const span = box.firstElementChild as HTMLElement;
      const text = span.offsetWidth - parseFloat(getComputedStyle(span).paddingLeft || "0");
      setScroll(text > box.clientWidth);
    };
    measure();
    document.fonts?.ready.then(measure);
  }, [title, hidden]);
  const likeHint = !isSignedIn ? "iniciá sesión para dar me gusta" : likes.liked ? "quitar me gusta" : "me gusta";

  return (
    <PlayerContext.Provider value={openPlayer}>
      {children}
      <div className="player" id="player" hidden={hidden} aria-label="Reproductor">
        <img className="skin" src="/images/player-skin.png" alt="" width={736} height={728} />
        <div className="p-screen">
          <img className="p-cover" id="p-cover" alt="" src={rel?.cover || undefined} />
          <div className="p-info">
            <div className={"p-title" + (scroll ? " scroll" : "")} id="p-titlebox" ref={titleBox}><span id="p-title">{title}</span></div>
            <div className="p-sub" id="p-artist">{rel?.artist}</div>
            <div className="p-sub" id="p-prod">{rel ? "prod. " + rel.prod : ""}</div>
            <div className="p-time" id="p-time">{time}</div>
          </div>
          <canvas className="p-viz" id="p-viz" width={400} height={120} ref={vizRef} style={{ visibility: showViz ? "visible" : "hidden" }} />
          <div className="p-foot"><span id="p-code">{rel?.code}</span><span className="p-like" id="p-likes">{likes.count !== null ? "♥ " + likes.count : ""}</span></div>
          <ol className="p-list" id="p-list" hidden={listHidden}>
            {rel?.tracks.map((t, i) => (
              <li key={t.id}>
                <button aria-current={i === idx ? "true" : undefined} onClick={() => { load(rel, i); play(); setListHidden(true); }}>
                  {pad2(i + 1) + "  " + t.title}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <span className="patch ring" id="hide-prev" hidden={multi} style={{ left: "41.2%", top: "72.4%", width: "2.6%", height: "3.6%" }} />
        <span className="patch ring" id="hide-next" hidden={multi} style={{ left: "55.6%", top: "72.4%", width: "2.6%", height: "3.6%" }} />
        <span className="patch thumb" style={{ left: "58.6%", top: "58.2%", width: "5.8%", height: "1.8%" }} />
        <div className="seek">
          <span className="fill" id="seek-fill" style={{ width: seekP * 100 + "%" }} />
          <span className="knob" id="seek-knob" style={{ left: seekP * 100 + "%" }} />
          <input
            id="seek" type="range" min={0} max={1000} value={Math.round(seekP * 1000)} aria-label="Posición" data-s="posición"
            onChange={(e) => {
              const audio = audioRef.current!, v = +e.target.value;
              if (audio.duration) audio.currentTime = (v / 1000) * audio.duration;
              setSeekP(v / 1000);
            }}
          />
        </div>
        <div className="vol">
          <span className="knob" id="vol-knob" style={{ top: 100 - vol + "%" }} />
          <input id="vol" type="range" min={0} max={100} value={vol} aria-label="Volumen" data-s="volumen" onChange={(e) => setVol(+e.target.value)} />
        </div>
        <button className="hs" id="b-play" style={{ left: "44.3%", top: "68.7%", width: "10.1%", height: "10.2%" }} aria-label={playing ? "Pausa" : "Reproducir"} data-s="play / pausa"
          onClick={() => { if (audioRef.current!.paused) play(); else pause(); }} />
        <button className="hs" id="b-pause" style={{ left: "46.4%", top: "64.6%", width: "5.4%", height: "3.4%" }} aria-label="Pausa" data-s="pausa" onClick={pause} />
        <button className="hs" id="b-stop" style={{ left: "46.6%", top: "79.6%", width: "5.4%", height: "3.4%" }} aria-label="Stop" data-s="stop"
          onClick={() => { pause(); audioRef.current!.currentTime = 0; }} />
        <button className="hs" id="b-prev" hidden={!multi} style={{ left: "40.4%", top: "71.6%", width: "3.6%", height: "5%" }} aria-label="Track anterior" data-s="anterior"
          onClick={() => { if (rel && idx > 0) { load(rel, idx - 1); play(); } }} />
        <button className="hs" id="b-next" hidden={!multi} style={{ left: "55%", top: "71.6%", width: "3.6%", height: "5%" }} aria-label="Track siguiente" data-s="siguiente"
          onClick={() => { if (rel && idx < rel.tracks.length - 1) { load(rel, idx + 1); play(); } }} />
        <button className="likebtn" id="b-like" aria-pressed={likes.liked ? "true" : "false"} aria-label="Me gusta" data-s={likeHint} disabled={saving} onClick={onLike}>
          <img src="/icons/like-star.png" alt="" width={96} height={96} />
        </button>
        <div
          className="dial" id="dial" ref={dialRef} role="slider" tabIndex={0} aria-label="Volumen" aria-valuemin={0} aria-valuemax={100} aria-valuenow={vol}
          data-s="volumen (arrastrá o usá la rueda)"
          style={{ "--a": -135 + vol * 2.7 + "deg" } as CSSProperties}
          onPointerDown={(e) => { drag.current = { y: e.clientY, v: volRef.current }; e.currentTarget.setPointerCapture(e.pointerId); }}
          onPointerMove={(e) => { if (drag.current) setVol(drag.current.v + (drag.current.y - e.clientY)); }}
          onPointerUp={() => { drag.current = null; }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowRight") { setVol(volRef.current + 5); e.preventDefault(); }
            if (e.key === "ArrowDown" || e.key === "ArrowLeft") { setVol(volRef.current - 5); e.preventDefault(); }
          }}
        />
        <button className="hs" id="b-viz" style={{ left: "39.9%", top: "85.6%", width: "4.6%", height: "4.7%" }} aria-label="Visualizador" data-s="visualizador / portada" onClick={() => setShowViz((v) => !v)} />
        <button className="hs" id="b-list" style={{ left: "54.8%", top: "85.6%", width: "4.6%", height: "4.7%" }} aria-label="Lista de tracks" data-s="lista de tracks" onClick={() => setListHidden((h) => !h)} />
        <button className="hs" id="b-close" style={{ left: "79.4%", top: "12%", width: "3%", height: "3%" }} aria-label="Cerrar" data-s="cerrar" onClick={() => { pause(); setHidden(true); }} />
        <audio
          id="audio" ref={audioRef} preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => {
            const a = e.currentTarget, p = a.duration ? a.currentTime / a.duration : 0;
            setSeekP(p);
            setTime(fmt(a.currentTime) + " / " + fmt(a.duration));
          }}
          onLoadedMetadata={(e) => setTime("0:00 / " + fmt(e.currentTarget.duration))}
          onEnded={() => { if (rel && idx < rel.tracks.length - 1) { load(rel, idx + 1); play(); } }}
        />
      </div>
    </PlayerContext.Provider>
  );
}
