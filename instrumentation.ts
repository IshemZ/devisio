/**
 * Next.js instrumentation file
 * Exécuté au démarrage du serveur (runtime, pas build time)
 *
 * CRITICAL: Les env vars sont validées ICI et non dans les layouts
 * pour éviter les erreurs au build time sur Vercel
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

import * as Sentry from "@sentry/nextjs";

export async function register() {
  // Supprimer le warning DEP0169 (url.parse) des dépendances
  // Ce warning provient de Sentry/Next.js et sera corrigé dans leurs mises à jour
  if (typeof process !== "undefined" && process.emitWarning) {
    const originalEmitWarning = process.emitWarning;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    process.emitWarning = function (warning, ...args: any[]) {
      // Filtrer uniquement DEP0169 (url.parse deprecation)
      if (typeof warning === "string" && warning.includes("DEP0169")) {
        return; // Ignorer ce warning spécifique
      }
      return originalEmitWarning.call(this, warning, ...args);
    };
  }

  // Node.js runtime (Server Components, API Routes, Server Actions)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Import Sentry config
    await import("./sentry.server.config");

    // SKIP validation pendant le build (Vercel, GitHub Actions, etc.)
    // La validation se fera à la première requête runtime
    const isBuilding = process.env.NEXT_PHASE === "phase-production-build";

    if (!isBuilding) {
      // Validate environment variables au runtime uniquement
      const { getEnv, logEnvSummary } = await import("./lib/env");

      try {
        // Valider les variables d'environnement au démarrage
        getEnv();

        // Log summary en développement
        if (process.env.NODE_ENV === "development") {
          logEnvSummary();
        }
      } catch (error) {
        console.error("❌ Échec de validation des variables d'environnement:");
        console.error(error);

        // Log to Sentry in production
        if (process.env.NODE_ENV === "production") {
          Sentry.captureException(error, {
            tags: { context: "env-validation" },
          });
          throw error;
        }
      }
    }
  }

  // Edge runtime (Middleware)
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Capture unhandled errors in Server Components and API Routes
export const onRequestError = Sentry.captureRequestError;
