/**
 * Next.js instrumentation file
 * Exécuté au démarrage du serveur (runtime, pas build time)
 *
 * CRITICAL: Les env vars sont validées ICI et non dans les layouts
 * pour éviter les erreurs au build time sur Vercel
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Server-side only
  if (process.env.NEXT_RUNTIME === "nodejs") {
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

      // En production, on laisse l'app crasher (erreur critique)
      if (process.env.NODE_ENV === "production") {
        throw error;
      }
    }
  }
}
