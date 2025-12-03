# 🔍 Guide de Configuration Sentry - Solkant

**Date** : 3 décembre 2025  
**Version** : Sentry v8 + Next.js 16

---

## 📋 Vue d'ensemble

Sentry est intégré dans Solkant pour capturer et monitorer toutes les erreurs en production. Cette intégration permet de :

- 🚨 Détecter les erreurs en temps réel
- 📊 Suivre les performances de l'application
- 🔍 Déboguer avec contexte complet (stack trace, user info, breadcrumbs)
- 📧 Recevoir des alertes par email/Slack

---

## 🎯 Architecture Sentry dans Solkant

### Fichiers de Configuration

```
instrumentation.ts              # Point d'entrée, charge configs + valide env
sentry.server.config.ts         # Config pour Server Components/Actions
sentry.edge.config.ts           # Config pour Edge Runtime (Middleware)
sentry.client.config.ts         # Config pour Client Components (créé par wizard)
```

### Points de Capture

| Composant                | Fichier                     | Type d'erreur                   |
| ------------------------ | --------------------------- | ------------------------------- |
| Server Actions           | `app/actions/*.ts`          | CRUD, validation, Prisma errors |
| Global Error Boundary    | `app/global-error.tsx`      | Erreurs root layout (critiques) |
| Root Error Boundary      | `app/error.tsx`             | Erreurs auth, env validation    |
| Dashboard Error Boundary | `app/(dashboard)/error.tsx` | Erreurs dans le dashboard       |
| Automatic Request Errors | `instrumentation.ts`        | Erreurs non catchées (API, RSC) |

---

## 🚀 Installation (Déjà Effectuée)

```bash
# Package installé
npm install @sentry/nextjs

# Configuration automatique via wizard
npx @sentry/wizard@latest -i nextjs
```

### Fichiers Générés

- ✅ `instrumentation.ts` (modifié pour inclure validation env)
- ✅ `sentry.server.config.ts`
- ✅ `sentry.edge.config.ts`
- ✅ `sentry.client.config.ts` (si créé par wizard)

---

## ⚙️ Configuration des Variables d'Environnement

### Variables Requises

Ajouter dans **Vercel Dashboard** → Settings → Environment Variables :

```bash
# DSN public pour envoyer les erreurs (OBLIGATOIRE)
SENTRY_DSN="https://7adc819bfc7fac9107dfa066d93ee531@o4510468532011008.ingest.de.sentry.io/4510468532469840"

# Organisation Sentry (pour upload source maps)
SENTRY_ORG="your-sentry-org-slug"

# Projet Sentry
SENTRY_PROJECT="solkant"

# Token d'authentification (pour CI/CD et source maps)
SENTRY_AUTH_TOKEN="sntrys_your_auth_token_here"
```

### Obtenir les Credentials

#### 1. Créer un Projet Sentry

1. Aller sur [sentry.io](https://sentry.io)
2. Créer un compte gratuit (5k erreurs/mois)
3. Créer un projet → **Next.js**
4. Copier le **DSN** fourni

#### 2. Obtenir SENTRY_ORG et SENTRY_PROJECT

```
URL Sentry : https://sentry.io/organizations/[SENTRY_ORG]/projects/[SENTRY_PROJECT]/
                                              ^^^^^^^^^^^^^^           ^^^^^^^^^^^^^^
```

#### 3. Générer un Auth Token

1. Settings → Account → API → Auth Tokens
2. Create New Token
3. Scopes : `project:read`, `project:releases`, `org:read`
4. Copier le token (commence par `sntrys_...`)

---

## 🔧 Configuration Actuelle

### `sentry.server.config.ts`

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Sample rate adaptatif (10% en prod pour économiser le quota)
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  environment: process.env.NODE_ENV || "development",
  enableLogs: true,

  // RGPD : Ne pas envoyer de données personnelles (emails, noms)
  sendDefaultPii: false,

  // Ignorer les erreurs non critiques
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
  ],

  initialScope: {
    tags: {
      runtime: "nodejs",
      project: "solkant",
    },
  },
});
```

### Particularités

- **Sample Rate** : 10% en prod = économise le quota gratuit (500 erreurs captées sur 5000 quota)
- **sendDefaultPii: false** : Respecte RGPD (pas d'emails/noms envoyés)
- **ignoreErrors** : Filtre les erreurs React non critiques

---

## 📊 Utilisation dans le Code

### Pattern Server Actions

```typescript
import * as Sentry from "@sentry/nextjs";

export async function createClient(input: CreateClientInput) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  try {
    // ... logique métier
  } catch (error) {
    // Capture avec contexte
    Sentry.captureException(error, {
      tags: {
        action: "createClient",
        businessId: session.user.businessId,
      },
      extra: {
        input: sanitized, // Données input (sans PII)
      },
    });

    console.error("Error creating client:", error);
    return { error: "Erreur lors de la création du client" };
  }
}
```

### Pattern Error Boundaries

```typescript
"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: { location: "dashboard-error-boundary" },
      contexts: {
        errorBoundary: {
          digest: error.digest,
        },
      },
    });
  }, [error]);

  return <ErrorUI error={error} reset={reset} />;
}
```

---

## 🧪 Test de l'Intégration

### Test Local

```typescript
// Ajouter temporairement dans une page
throw new Error("Test Sentry integration");
```

**Vérifier** :

1. Console affiche l'erreur
2. Si `SENTRY_DSN` configuré → Erreur envoyée à Sentry
3. Dashboard Sentry → Issues → Voir l'erreur apparaître

### Test Production

Après déploiement Vercel :

1. Forcer une erreur (ex: supprimer un client inexistant)
2. Vérifier dans Sentry Dashboard → Issues
3. Cliquer sur l'erreur pour voir :
   - Stack trace
   - Tags (`action`, `businessId`)
   - Contexte (`extra`)
   - User info (si session)

---

## 📈 Monitoring en Production

### Dashboard Sentry

**Accès** : [sentry.io/organizations/your-org/issues/](https://sentry.io/organizations/your-org/issues/)

**Métriques Clés** :

- **Issues** : Liste des erreurs groupées
- **Releases** : Suivi par version déployée
- **Performance** : Temps de réponse des transactions
- **Alerts** : Notifications email/Slack

### Configurer les Alertes

1. Settings → Alerts → Create Alert Rule
2. Conditions : "When an event is seen"
3. Filtres :
   - Environment: `production`
   - Tags: `severity:critical`
4. Actions : Email / Slack

### Best Practices

#### ✅ À Faire

- Monitorer `Issues` quotidiennement
- Résoudre les erreurs critiques rapidement
- Taguer les releases avec `sentry-cli releases`
- Configurer des alertes pour erreurs critiques

#### ❌ À Éviter

- Ignorer les erreurs récurrentes
- Envoyer des données sensibles (PII) dans `extra`
- Dépasser le quota gratuit (5k erreurs/mois)

---

## 🔐 Sécurité & RGPD

### Conformité RGPD

```typescript
// ✅ CONFORME : sendDefaultPii désactivé
Sentry.init({
  sendDefaultPii: false, // Ne pas envoyer emails, noms, IP
});

// ✅ CONFORME : Sanitize input avant envoi
Sentry.captureException(error, {
  extra: {
    input: sanitizeObject(input), // Retirer données sensibles
  },
});
```

### Données Capturées

| Type                 | Envoyé ? | Pourquoi                          |
| -------------------- | -------- | --------------------------------- |
| Stack trace          | ✅       | Nécessaire pour debug             |
| URL de la page       | ✅       | Contexte de l'erreur              |
| User Agent (browser) | ✅       | Identifier compatibilité          |
| businessId           | ✅       | Tag custom (pas une donnée perso) |
| Email utilisateur    | ❌       | PII désactivé                     |
| Nom client           | ❌       | Sanitisé dans `extra`             |

---

## 🐛 Dépannage

### Erreur : "SENTRY_DSN not configured"

**Cause** : Variable d'environnement manquante

**Solution** :

```bash
# Local : Ajouter dans .env.local
SENTRY_DSN="https://your-dsn@sentry.io/project-id"

# Vercel : Dashboard → Settings → Environment Variables
```

### Erreurs Non Capturées

**Cause** : `ignoreErrors` trop large ou erreur dans try/catch non rethrow

**Solution** :

1. Vérifier `ignoreErrors` dans `sentry.server.config.ts`
2. S'assurer que `Sentry.captureException()` est appelé dans catch

### Quota Dépassé (5k erreurs)

**Cause** : Trop d'erreurs en production ou sample rate à 100%

**Solution** :

```typescript
// Réduire sample rate à 5% ou 1%
tracesSampleRate: 0.05;
```

---

## 📚 Ressources

- [Documentation Sentry Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Configuration Options](https://docs.sentry.io/platforms/javascript/configuration/options/)
- [Best Practices](https://docs.sentry.io/platforms/javascript/best-practices/)
- [GDPR Compliance](https://docs.sentry.io/product/security-legal-pii/)

---

## ✅ Checklist Déploiement

Avant de déployer en production :

- [ ] `SENTRY_DSN` configuré dans Vercel
- [ ] `SENTRY_ORG` et `SENTRY_PROJECT` configurés
- [ ] `SENTRY_AUTH_TOKEN` créé (pour source maps)
- [ ] Sample rate ajusté à 10% en production
- [ ] `sendDefaultPii: false` vérifié
- [ ] Test d'une erreur en staging/preview
- [ ] Alertes email/Slack configurées
- [ ] Dashboard Sentry accessible à l'équipe

---

**Maintenu par** : Architecture Agent  
**Dernière mise à jour** : 3 décembre 2025
