// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true, // Masquer le texte pour RGPD
      blockAllMedia: true, // Bloquer les médias
    }),
  ],

  // Adjust sample rate based on environment
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,

  // Set environment tag
  environment: process.env.NODE_ENV || "development",

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Replay sessions (5% in production)
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 0.1,
  replaysOnErrorSampleRate: 0.5,

  // Désactiver PII pour respecter RGPD
  sendDefaultPii: false,

  // Ignorer les erreurs communes non critiques
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
    "Network request failed",
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
