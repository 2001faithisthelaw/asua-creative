import Link from "next/link";
import { RELEASES } from "@/data/releases";

export default function Home() {
  const releases = Object.entries(RELEASES);

  return (
    <section className="view" id="v-home">
      <div className="listhead">
        <span className="new">[ NEW ]</span>
        <span>
          RELEASES:{" "}
          <span className="pages">
            <span aria-current="page">1</span> <span>2</span> <span>3</span>
          </span>
        </span>
      </div>

      <ul className="rlist">
        {releases.map(([key, rel]) => (
          <li key={key}>
            <Link href={`/release/${key}`} data-s={`ver ${rel.title}`}>
              <img className="mini" src={rel.cover} alt="" width={40} height={40} />
              <span className="rname">{rel.artist} &ndash; {rel.title}</span>
            </Link>
            <span className="rprod">( prod. {rel.prod} )</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
