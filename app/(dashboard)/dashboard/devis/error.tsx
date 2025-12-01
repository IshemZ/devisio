"use client";

import { useEffect } from "react";

export default function DevisError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Devis page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mb-4 text-6xl">📄</div>

        <h2 className="mb-3 text-xl font-bold">
          Impossible de charger les devis
        </h2>

        <p className="mb-6 text-sm text-muted-foreground">
          Une erreur s&apos;est produite lors de la récupération de vos devis. Vos
          données sont en sécurité.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mb-4 rounded bg-muted p-3 text-left">
            <p className="text-xs font-mono break-all">{error.message}</p>
            {error.digest && (
              <p className="mt-1 text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-md bg-foreground px-5 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
          >
            Réessayer
          </button>

          <a
            href="/dashboard"
            className="rounded-md border border-input bg-background px-5 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Retour au tableau de bord
          </a>
        </div>
      </div>
    </div>
  );
}
