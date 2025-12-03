"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Global error boundary - catches ALL errors including root layout errors
 * This is the last line of defense for error handling
 *
 * NOTE: Must include <html> and <body> tags as it replaces the entire root layout
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-errors-in-root-layouts
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error, {
      tags: { location: "global-error-boundary", severity: "critical" },
      contexts: {
        errorBoundary: {
          digest: error.digest,
          message: error.message,
        },
      },
    });
    console.error("Critical global error:", error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundColor: "#ffffff",
          color: "#000000",
        }}
      >
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "28rem" }}>
            <h1
              style={{
                marginBottom: "1rem",
                fontSize: "1.875rem",
                fontWeight: "bold",
              }}
            >
              Une erreur est survenue
            </h1>

            <p
              style={{
                marginBottom: "1.5rem",
                fontSize: "1.125rem",
                opacity: 0.7,
              }}
            >
              Nous sommes désolés, une erreur inattendue s&apos;est produite
              lors du chargement de l&apos;application.
            </p>

            {process.env.NODE_ENV === "development" && error.message && (
              <details
                style={{
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "0.5rem",
                  textAlign: "left",
                  fontSize: "0.875rem",
                }}
              >
                <summary style={{ cursor: "pointer", fontWeight: 500 }}>
                  Détails techniques
                </summary>
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    wordBreak: "break-all",
                  }}
                >
                  {error.message}
                </p>
                {error.stack && (
                  <pre
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.75rem",
                      overflow: "auto",
                      maxHeight: "10rem",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {error.stack}
                  </pre>
                )}
                {error.digest && (
                  <p style={{ marginTop: "0.25rem", fontSize: "0.75rem" }}>
                    ID: {error.digest}
                  </p>
                )}
              </details>
            )}

            <button
              onClick={reset}
              style={{
                padding: "0.625rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#ffffff",
                backgroundColor: "#000000",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Réessayer
            </button>

            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                Si le problème persiste :
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a
                  href="/"
                  style={{
                    fontSize: "0.875rem",
                    textDecoration: "underline",
                    color: "inherit",
                  }}
                >
                  Retour à l&apos;accueil
                </a>
                <a
                  href="mailto:alaneicos@gmail.com"
                  style={{
                    fontSize: "0.875rem",
                    textDecoration: "underline",
                    color: "inherit",
                  }}
                >
                  Contacter le support
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
