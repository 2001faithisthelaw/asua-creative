import Link from "next/link";
import type { CSSProperties } from "react";
import PlayButton from "@/components/PlayButton";
import { getReleases } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const at = (i: number | null, row: string): CSSProperties =>
  (i === null ? { gridRow: row } : { "--i": i, gridRow: row }) as CSSProperties;

/* The feature block and the news line show the newest release. */
export default async function Home() {
  const [latest] = await getReleases();
  return (
    <section className="view" id="v-home">
      <div className="index">
        <div className="feature" style={at(22, "1")}>
          <Link className="thumb" href={`/release/${latest.key}`} data-s="ver release"><img src={latest.cover} alt={"Portada de " + latest.title} width={240} height={240} /></Link>
          <div className="info">
            <PlayButton className="t" release={latest.key} hint={"reproducir " + latest.title}>{latest.title} <span className="code">(R)</span></PlayButton>
            <span>{latest.code}{"  "}{latest.artist}</span>
            <span>prod. {latest.prod}</span>
            <span className="sub">Disponible en:</span>
            <a href={latest.url} target="_blank" rel="noopener" data-s="abrir en SoundCloud">SoundCloud &gt;</a>
          </div>
        </div>
        <Link className="tab" href="/" style={at(null, "1")} data-s="todos los releases"><span>Releases</span></Link>

        <div className="row" style={at(28, "2")}><span className="ring" /><span className="lbl" data-s="artista">Joa <span className="code">(A)</span></span></div>
        <Link className="tab" href="/" style={at(null, "2 / span 2")} data-s="artistas del colectivo"><span>Artists</span></Link>
        <div className="row" style={at(31, "3")}><span className="lbl" data-s="productor">Zabtag <span className="code">(A)</span></span><span className="ring" /></div>

        <div className="row" style={at(25, "4")}><span className="ring" /><span className="lbl muted" data-s="sin mixes publicados todavía">Mixes, próximamente <span className="code">(MX)</span></span></div>
        <Link className="tab" href="/" style={at(null, "4")} data-s="mixes"><span>Mixes</span></Link>

        <div className="row" style={at(34, "5")}><Link href={`/release/${latest.key}`} data-s="news"><span className="lbl">{latest.title} ya está en SoundCloud</span><span className="ring full" /></Link></div>
        <Link className="tab" href="/" style={at(null, "5")} data-s="novedades"><span>News</span></Link>

        <div className="row" style={at(30, "6")}><Link href="/about" data-s="manifiesto del colectivo"><span className="ring" /><span className="lbl">Authentic Soul Unique Art</span></Link></div>
        <Link className="tab" href="/about" style={at(null, "6")} data-s="manifiesto"><span>About</span></Link>

        <div className="row" style={at(36, "7")}><a href="https://soundcloud.com/asua-colective" target="_blank" rel="noopener" data-s="archivo completo en SoundCloud"><span className="ring arch" /><span className="lbl">ASUA ARCHIVE / SOUNDCLOUD</span></a></div>
        <span className="glyph" style={at(null, "7")} aria-hidden="true">L</span>
      </div>
    </section>
  );
}
