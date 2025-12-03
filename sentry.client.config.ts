// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,

  // Adjust sample rate based on environment
  // Client-side errors are less critical than server errors
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,

  // Set environment tag
  environment: process.env.NODE_ENV || "development",

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Désactiver PII pour respecter RGPD
  sendDefaultPii: false,

  // Replay sessions for debugging (5% in production)
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 0.5,

  // Ignorer les erreurs communes non critiques côté client
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    "Non-Error promise rejection captured",
    "Network request failed", // Erreurs réseau temporaires
    "Load failed", // Ressources bloquées par ad-blockers
  ],

  // Ajouter des tags personnalisés
  initialScope: {
    tags: {
      runtime: "browser",
      project: "solkant",
    },
  },

  // Intégrations browser
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true, // Masquer le texte pour RGPD
      blockAllMedia: true, // Bloquer les médias
    }),
  ],
});
