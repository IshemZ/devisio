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
  // Node.js runtime (Server Components, API Routes, Server Actions)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Import Sentry config
    await import("./sentry.server.config");

    // Validate environment variables
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

  // Edge runtime (Middleware)
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Capture unhandled errors in Server Components and API Routes
export const onRequestError = Sentry.captureRequestError;
