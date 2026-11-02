import Link from "next/link";
import type { CSSProperties } from "react";
import PlayButton from "@/components/PlayButton";

const at = (i: number | null, row: string): CSSProperties =>
  (i === null ? { gridRow: row } : { "--i": i, gridRow: row }) as CSSProperties;

export default function Home() {
  return (
    <section className="view" id="v-home">
      <div className="index">
        <div className="feature" style={at(22, "1")}>
          <Link className="thumb" href="/release/asua0001" data-s="ver release"><img src="/images/asua0001_98.gif" alt="Portada de untitled-08" width={240} height={240} /></Link>
          <div className="info">
            <PlayButton className="t" release="asua0001" hint="reproducir untitled-08">untitled-08 <span className="code">(R)</span></PlayButton>
            <span><i className="serif">ASUA0001</i>{"  "}Joa</span>
            <span><i className="serif">prod.</i> Zabtag</span>
            <span className="sub">Disponible en:</span>
            <a href="https://soundcloud.com/asua-colective/asf-untitled-08joa-prod-zab" target="_blank" rel="noopener" data-s="abrir en SoundCloud">SoundCloud &gt;</a>
          </div>
        </div>
        <Link className="tab" href="/" style={at(null, "1")} data-s="todos los releases"><span>Releases</span></Link>

        <div className="row" style={at(28, "2")}><span className="ring" /><span className="lbl" data-s="artista">Joa <span className="code">(A)</span></span></div>
        <Link className="tab" href="/" style={at(null, "2 / span 2")} data-s="artistas del colectivo"><span>Artists</span></Link>
        <div className="row" style={at(31, "3")}><span className="lbl" data-s="productor">Zabtag <span className="code">(A)</span></span><span className="ring" /></div>

        <div className="row" style={at(25, "4")}><span className="ring" /><span className="lbl muted" data-s="sin mixes publicados todavía">Mixes, próximamente <span className="code">(MX)</span></span></div>
        <Link className="tab" href="/" style={at(null, "4")} data-s="mixes"><span>Mixes</span></Link>

        <div className="row" style={at(34, "5")}><Link href="/release/asua0001" data-s="news"><span className="lbl">untitled-08 ya está en SoundCloud</span><span className="ring full" /></Link></div>
        <Link className="tab" href="/" style={at(null, "5")} data-s="novedades"><span>News</span></Link>

        <div className="row" style={at(30, "6")}><Link href="/about" data-s="manifiesto del colectivo"><span className="ring" /><span className="lbl">Authentic Soul Unique Art</span></Link></div>
        <Link className="tab" href="/about" style={at(null, "6")} data-s="manifiesto"><span>About</span></Link>

        <div className="row" style={at(36, "7")}><a href="https://soundcloud.com/asua-colective" target="_blank" rel="noopener" data-s="archivo completo en SoundCloud"><span className="ring arch" /><span className="lbl">ASUA ARCHIVE / SOUNDCLOUD</span></a></div>
        <span className="glyph" style={at(null, "7")} aria-hidden="true">L</span>
      </div>
    </section>
  );
}
