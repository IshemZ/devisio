// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Adjust sample rate based on environment
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Set environment tag
  environment: process.env.NODE_ENV || "development",

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Désactiver PII pour respecter RGPD (données personnelles)
  sendDefaultPii: false,

  // Ignorer les erreurs communes non critiques
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
  ],

  // Ajouter des tags personnalisés
  initialScope: {
    tags: {
      runtime: "nodejs",
      project: "solkant",
    },
  },
});
