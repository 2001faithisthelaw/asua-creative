"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Release } from "@/data/releases";

type TrackForm = { id?: string; title: string; audio: string; file?: string };
type Form = {
  editing: boolean;
  code: string; title: string; artist: string; prod: string; date: string;
  serial: string; type: string; url: string; cover: string; tracks: TrackForm[];
};

const today = () => new Date().toISOString().slice(0, 10);
const blank = (): Form => ({
  editing: false, code: "", title: "", artist: "", prod: "", date: today(),
  serial: "2001", type: "Release (R)", url: "", cover: "", tracks: [{ title: "", audio: "" }],
});

export default function AdminPanel({ releases }: { releases: Release[] }) {
  const router = useRouter();
  const [f, setF] = useState<Form>(blank);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((s) => ({ ...s, [k]: v }));
  const setTrack = (i: number, patch: Partial<TrackForm>) =>
    setF((s) => ({ ...s, tracks: s.tracks.map((t, j) => (j === i ? { ...t, ...patch } : t)) }));

  async function fromSoundCloud() {
    if (!f.url) return setMsg("Pegá primero el link de SoundCloud.");
    setBusy(true); setMsg("Buscando en SoundCloud…");
    const r = await fetch("/api/admin/soundcloud?url=" + encodeURIComponent(f.url));
    const d = await r.json();
    setBusy(false);
    if (!r.ok) return setMsg(d.error ?? "No se pudo leer el link.");
    setF((s) => ({
      ...s,
      title: d.title || s.title,
      artist: d.artist || s.artist,
      cover: d.cover || s.cover,
      tracks: s.tracks.length === 1 && !s.tracks[0].title ? [{ ...s.tracks[0], title: d.title || "" }] : s.tracks,
    }));
    setMsg("Listo: revisá título, artista y portada, y subí el mp3.");
  }

  async function uploadTo(kind: "audio" | "cover", file: File): Promise<string> {
    const path = `${kind}/${(f.code || "tmp").toLowerCase()}-${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const blob = await upload(path, file, { access: "public", handleUploadUrl: "/api/admin/upload" });
    return blob.url;
  }

  async function onCover(file: File) {
    setBusy(true); setMsg("Subiendo portada…");
    try { set("cover", await uploadTo("cover", file)); setMsg("Portada subida."); }
    catch (e) { setMsg("No se pudo subir la portada: " + (e as Error).message); }
    setBusy(false);
  }

  async function onAudio(i: number, file: File) {
    setBusy(true); setMsg(`Subiendo ${file.name}…`);
    try { setTrack(i, { audio: await uploadTo("audio", file), file: file.name }); setMsg("Audio subido."); }
    catch (e) { setMsg("No se pudo subir el audio: " + (e as Error).message); }
    setBusy(false);
  }

  function edit(r: Release) {
    setF({
      editing: true, code: r.code, title: r.title, artist: r.artist, prod: r.prod, date: r.date,
      serial: r.serial, type: r.type, url: r.url, cover: r.cover,
      tracks: r.tracks.map((t) => ({ id: t.id, title: t.title, audio: t.audio })),
    });
    setMsg(`Editando ${r.code}.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg("Guardando…");
    const r = await fetch("/api/admin/releases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: f.code, title: f.title, artist: f.artist, prod: f.prod, date: f.date,
        serial: f.serial, type: f.type, url: f.url, cover: f.cover,
        tracks: f.tracks.map((t) => ({ id: t.id, title: t.title || f.title, audio: t.audio })),
      }),
    });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) return setMsg(d.error ?? "No se pudo guardar.");
    setMsg(`Guardado: ${f.code.toUpperCase()} ya está publicado.`);
    setF(blank());
    router.refresh();
  }

  const sorted = [...releases];
  return (
    <div className="admin">
      <h2><span className="ring" />panel del sello</h2>

      <form onSubmit={save}>
        <label>Link de SoundCloud
          <div className="row2">
            <input type="url" value={f.url} onChange={(e) => set("url", e.target.value)} placeholder="https://soundcloud.com/…" required />
            <button type="button" onClick={fromSoundCloud} disabled={busy}>Autocompletar</button>
          </div>
        </label>

        <div className="grid2">
          <label>Código
            <input value={f.code} onChange={(e) => set("code", e.target.value)} placeholder="ASUA0002" required disabled={f.editing} />
          </label>
          <label>Fecha
            <input type="date" value={f.date} onChange={(e) => set("date", e.target.value)} required />
          </label>
          <label>Título
            <input value={f.title} onChange={(e) => set("title", e.target.value)} required />
          </label>
          <label>Artista
            <input value={f.artist} onChange={(e) => set("artist", e.target.value)} required />
          </label>
          <label>Productor
            <input value={f.prod} onChange={(e) => set("prod", e.target.value)} required />
          </label>
          <label>Tipo
            <input value={f.type} onChange={(e) => set("type", e.target.value)} />
          </label>
        </div>

        <label>Portada {f.cover && <small> (ya cargada)</small>}
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onCover(e.target.files[0])} />
          <small>Si no subís una, se usa la del link de SoundCloud.</small>
        </label>

        <fieldset>
          <legend>Tracks</legend>
          {f.tracks.map((t, i) => (
            <div className="track" key={i}>
              <input value={t.title} placeholder="Título del track" onChange={(e) => setTrack(i, { title: e.target.value })} />
              <input type="file" accept="audio/mpeg,audio/mp3" onChange={(e) => e.target.files?.[0] && onAudio(i, e.target.files[0])} />
              <small>{t.audio ? "✓ " + (t.file ?? "audio cargado") : "sin audio"}</small>
              {f.tracks.length > 1 && (
                <button type="button" onClick={() => set("tracks", f.tracks.filter((_, j) => j !== i))}>Quitar</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => set("tracks", [...f.tracks, { title: "", audio: "" }])}>+ Track</button>
        </fieldset>

        <div className="actions">
          <button type="submit" disabled={busy}>{f.editing ? "Guardar cambios" : "Publicar release"}</button>
          {f.editing && <button type="button" onClick={() => { setF(blank()); setMsg(""); }}>Cancelar edición</button>}
        </div>
        {msg && <p className="msg" role="status">{msg}</p>}
      </form>

      <h3>Releases publicados</h3>
      <ul className="list">
        {sorted.map((r) => (
          <li key={r.key}>
            <span>{r.date} · {r.code} · {r.title} / {r.artist}</span>
            <button type="button" onClick={() => edit(r)}>editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
