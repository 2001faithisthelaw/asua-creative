import Link from "next/link";
import { notFound } from "next/navigation";
import PlayButton from "@/components/PlayButton";
import { RELEASES, getRelease } from "@/data/releases";

export function generateStaticParams() {
  return Object.keys(RELEASES).map((codigo) => ({ codigo }));
}

export default async function ReleasePage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const rel = getRelease(codigo);
  if (!rel) notFound();
  const key = codigo.toLowerCase();

  return (
    <section className="view" id="v-release">
      <div className="release">
        <div className="body">
          <PlayButton className="cover" release={key} hint="reproducir"><img id="r-img" src={rel.cover} alt={"Portada de " + rel.title} width={240} height={240} /></PlayButton>
          <div className="meta">
            <PlayButton className="t" release={key} hint="reproducir">{rel.title + " "}<span className="code">(R)</span></PlayButton>
            <span id="r-artist">{rel.artist}</span>
            <dl>
              <dt>cat.</dt><dd id="r-code">{rel.code}</dd>
              <dt>prod.</dt><dd id="r-prod">{rel.prod}</dd>
              <dt>tipo</dt><dd id="r-type">{rel.type}</dd>
            </dl>
            <ol className="tracks" id="r-tracks">
              {rel.tracks.map((tr, i) => (
                <li key={tr.id}>
                  <PlayButton release={key} track={i} hint={"reproducir " + tr.title}><span className="n">{String(i + 1).padStart(2, "0")}</span>{tr.title}</PlayButton>
                </li>
              ))}
            </ol>
            <span className="sub">Disponible en:</span>
            <a id="r-link" href={rel.url} target="_blank" rel="noopener" data-s="abrir en SoundCloud">SoundCloud &gt;</a>
          </div>
        </div>
        <Link className="tab" href="/" style={{ gridColumn: "2", gridRow: "1 / span 2" }} data-s="volver al index"><span>Releases</span></Link>
        <Link className="back" href="/">&larr; index</Link>
      </div>
    </section>
  );
}
