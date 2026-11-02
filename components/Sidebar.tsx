import Link from "next/link";
import AuthButton from "@/components/AuthButton";

export default function Sidebar() {
  return (
    <aside className="side">
      <Link className="brand" href="/" aria-label="ASUA CREATIVE, inicio" data-s="inicio">
        <img className="brand-logo" src="/images/logo.gif" alt="" width={48} height={48} />
        <span className="brand-name">asua</span>
      </Link>
      <p className="tagline">***-AUTHENTIC SOUL UNIQUE ART-***</p>

      <div className="banner" role="img" aria-label="Banner ASUA CREATIVE" />

      <nav className="menu" aria-label="Principal">
        <Link href="/" data-s="todos los releases">.releases</Link>
        <Link href="/" data-s="mixes, próximamente">.mixes</Link>
        <Link href="/about" data-s="manifiesto del colectivo">.about</Link>
      </nav>

      <AuthButton />
    </aside>
  );
}
