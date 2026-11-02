import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import AdminPanel from "@/components/AdminPanel";
import { isAdmin } from "@/lib/admin";
import { getReleases } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Panel · ASUA CREATIVE", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) {
    return (
      <section className="view about">
        <h2><span className="ring" />panel del sello</h2>
        <p>Iniciá sesión para continuar.</p>
        <SignInButton><button type="button">Iniciar sesión</button></SignInButton>
      </section>
    );
  }
  if (!(await isAdmin())) {
    return (
      <section className="view about">
        <h2><span className="ring" />panel del sello</h2>
        <p>Esta cuenta no tiene acceso.</p>
      </section>
    );
  }
  return <AdminPanel releases={await getReleases()} />;
}
