"use client";

import { useAuth, useClerk } from "@clerk/nextjs";

export default function AuthButton() {
  const { isLoaded, isSignedIn } = useAuth();
  const clerk = useClerk();

  if (isLoaded && isSignedIn) {
    return (
      <button type="button" className="authbtn" onClick={() => clerk.signOut()} data-s="cerrar sesión">
        salir
      </button>
    );
  }

  return (
    <button type="button" className="authbtn" onClick={() => clerk.openSignIn()} disabled={!isLoaded} data-s="entrar o crear usuario">
      entrar / crear usuario
    </button>
  );
}
