import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Connexion | Solkant",
  description: "Connectez-vous à votre compte Solkant",
};

function ErrorDisplay({ searchParams }: { searchParams: { error?: string } }) {
  if (!searchParams.error) return null;

  const errorMessages: Record<string, string> = {
    Configuration: "Erreur de configuration OAuth",
    AccessDenied: "Accès refusé",
    Verification: "Erreur de vérification",
    OAuthSignin: "Erreur lors de la connexion OAuth",
    OAuthCallback: "Erreur de callback OAuth",
    OAuthCreateAccount: "Erreur lors de la création du compte",
    EmailCreateAccount: "Erreur lors de la création du compte email",
    Callback: "Erreur de callback",
    OAuthAccountNotLinked:
      "Ce compte OAuth est déjà lié à un autre utilisateur",
    EmailSignin: "Erreur d'envoi de l'email de connexion",
    CredentialsSignin: "Email ou mot de passe invalide",
    SessionRequired: "Session requise",
    Default: "Une erreur est survenue lors de la connexion",
  };

  const message = errorMessages[searchParams.error] || errorMessages.Default;

  return (
    <div className="mb-4 rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{message}</h3>
          <p className="mt-1 text-xs text-red-700">
            Code: {searchParams.error}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Solkant
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Connectez-vous à votre compte
          </p>
        </div>

        <Suspense fallback={<div>Chargement...</div>}>
          <ErrorDisplay searchParams={searchParams} />
        </Suspense>

        <LoginForm />

        <p className="text-center text-sm text-foreground/60">
          Pas encore de compte ?{" "}
          <a
            href="/register"
            className="font-medium text-foreground hover:underline"
          >
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  );
}
