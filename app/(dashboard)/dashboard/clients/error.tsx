"use client";

import { useEffect } from "react";

export default function ClientsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Clients page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mb-4 text-6xl">😕</div>

        <h2 className="mb-3 text-xl font-bold">
          Impossible de charger les clients
        </h2>

        <p className="mb-6 text-sm text-muted-foreground">
          Une erreur s&apos;est produite lors de la récupération de vos clients.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <p className="mb-4 rounded bg-muted px-3 py-2 text-xs font-mono text-left break-all">
            {error.message}
          </p>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-md bg-foreground px-5 py-2 text-sm font-medium text-background hover:bg-foreground/90"
          >
            Réessayer
          </button>

          <a
            href="/dashboard"
            className="rounded-md border border-input bg-background px-5 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Retour au tableau de bord
          </a>
        </div>
      </div>
    </div>
  );
}
