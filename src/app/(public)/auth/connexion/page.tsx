"use client";

import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(error === "CredentialsSignin" ? "Email ou mot de passe incorrect" : error === "ACCOUNT_SUSPENDED" ? "Votre compte a été suspendu. Contactez le support." : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    }).catch((err: unknown) => {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("ACCOUNT_SUSPENDED")) {
        return { error: "ACCOUNT_SUSPENDED" };
      }
      return { error: "CredentialsSignin" };
    });

    if (result?.error) {
      setLoading(false);
      if (result.error === "ACCOUNT_SUSPENDED") {
        setAuthError("Votre compte a été suspendu. Contactez le service client pour toute contestation.");
      } else {
        setAuthError("Email ou mot de passe incorrect");
      }
    } else {
      const dest = callbackUrl !== "/" ? callbackUrl : "/dashboard";
      router.push(dest);
      router.refresh();
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-margin py-xl">
      <div className="w-full max-w-[600px]">
        <div className="text-center mb-lg">
          <h1 className="font-headline-xl text-headline-xl text-on-surface">Connexion</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
            Accédez à votre espace personnel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          {authError && (
            <div className="bg-error-container/50 text-on-error-container px-md py-sm rounded-lg font-body-md text-body-md">
              {authError}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
          />

          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Se connecter
          </Button>
        </form>

        <p className="text-center mt-md font-body-md text-body-md text-on-surface-variant">
          Pas encore de compte ?{" "}
          <Link
            href={`/auth/inscription${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            className="text-primary hover:underline font-label-bold"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense>
      <ConnexionForm />
    </Suspense>
  );
}
