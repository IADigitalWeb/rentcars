"use client";

import { useSession, signOut } from "next-auth/react";
import { type ReactNode } from "react";

export function SignedIn({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  if (!session) return null;
  return <>{children}</>;
}

export function SignedOut({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  if (session) return null;
  return <>{children}</>;
}

export function SignOutButton({ className }: { className?: string }) {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };
  return (
    <button onClick={handleSignOut} className={className}>
      Déconnexion
    </button>
  );
}
