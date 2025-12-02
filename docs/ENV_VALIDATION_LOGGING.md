# 📋 Système de Validation et Logging des Variables d'Environnement

## Vue d'ensemble

Solkant utilise un système robuste de validation des variables d'environnement avec **logs détaillés et structurés** pour faciliter le débogage et la configuration.

---

## Architecture

### Fichier Principal : `lib/env.ts`

Le module contient :

- ✅ **Schéma Zod** : Validation typée des variables
- 📊 **Logs structurés** : Messages d'erreur catégorisés et détaillés
- 🔍 **Feature flags** : Détection automatique des fonctionnalités disponibles
- 📝 **Template generator** : Génération de fichier `.env.local` exemple

---

## Format des Logs d'Erreur

### Structure Hiérarchique

Lorsqu'une validation échoue, le système affiche :

```
================================================================================
❌ ERREUR DE VALIDATION DES VARIABLES D'ENVIRONNEMENT
================================================================================

📋 VARIABLES MANQUANTES :
--------------------------------------------------------------------------------

  ❌ DATABASE_URL
     Description: Neon pooled connection string (pour queries)

  ❌ NEXTAUTH_SECRET
     Description: Secret pour JWT encryption (générer avec: openssl rand -base64 32)


⚠️  VARIABLES INVALIDES :
--------------------------------------------------------------------------------

  ❌ NEXTAUTH_URL
     Raison: NEXTAUTH_URL doit être une URL valide
     Valeur reçue: "not-a-valid-url..."


🔍 DÉTAILS COMPLETS (format JSON) :
--------------------------------------------------------------------------------
{
  "DATABASE_URL": {
    "_errors": ["Required"]
  },
  "NEXTAUTH_SECRET": {
    "_errors": ["Required"]
  }
}

================================================================================
💡 COMMENT CORRIGER :
================================================================================

1. Vérifiez que le fichier .env.local existe à la racine du projet
2. Assurez-vous que toutes les variables requises sont définies
3. Redémarrez le serveur après modification : npm run dev

📄 Générer un template : Consultez la fonction generateEnvTemplate()
================================================================================
```

---

## Catégories d'Erreurs

### 1. Variables Manquantes (📋)

**Déclencheur** : Variable non définie dans `.env.local`

**Exemple** :

```typescript
// .env.local ne contient pas DATABASE_URL

// Console output:
📋 VARIABLES MANQUANTES :
  ❌ DATABASE_URL
     Description: Neon pooled connection string (pour queries)
```

**Comment corriger** :

```bash
# Ajouter dans .env.local
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true"
```

---

### 2. Variables Invalides (⚠️)

**Déclencheur** : Variable présente mais ne respecte pas le format requis

**Exemples courants** :

#### a) URL invalide

```typescript
// .env.local
NEXTAUTH_URL="localhost:3000" // ❌ Manque le protocole

// Console output:
⚠️  VARIABLES INVALIDES :
  ❌ NEXTAUTH_URL
     Raison: NEXTAUTH_URL doit être une URL valide
     Valeur reçue: "localhost:3000..."

// ✅ Correction
NEXTAUTH_URL="http://localhost:3000"
```

#### b) Secret trop court

```typescript
// .env.local
NEXTAUTH_SECRET="trop-court" // ❌ Moins de 32 caractères

// Console output:
⚠️  VARIABLES INVALIDES :
  ❌ NEXTAUTH_SECRET
     Raison: NEXTAUTH_SECRET doit faire au moins 32 caractères
     Valeur reçue: "trop-court..."

// ✅ Correction
# Générer un secret sécurisé :
openssl rand -base64 32
```

#### c) Mauvais protocole de base de données

```typescript
// .env.local
DATABASE_URL="mysql://user:pass@host/db" // ❌ MySQL au lieu de Postgres

// Console output:
⚠️  VARIABLES INVALIDES :
  ❌ DATABASE_URL
     Raison: DATABASE_URL doit être une connexion Postgres
     Valeur reçue: "mysql://user:pass@host/db..."

// ✅ Correction
DATABASE_URL="postgresql://user:pass@host:5432/db"
```

---

### 3. Autres Erreurs (🔴)

Erreurs de validation complexes ou personnalisées.

---

## Workflow de Débogage

### Étape 1 : Identifier le problème

Lors du démarrage de l'application, si une erreur survient :

```bash
npm run dev
```

Le système affiche automatiquement :

- 📋 Liste des variables manquantes
- ⚠️ Variables présentes mais invalides
- 🔍 JSON détaillé pour investigation approfondie

### Étape 2 : Consulter les descriptions

Chaque variable manquante affiche sa **description** issue du schéma Zod :

```typescript
const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .url()
    .describe("Neon pooled connection string (pour queries)"), // ✅ Affiché dans les logs
});
```

### Étape 3 : Corriger `.env.local`

Éditez le fichier et ajoutez/corrigez les variables :

```bash
# .env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-de-32-caracteres-minimum"
```

### Étape 4 : Redémarrer le serveur

```bash
npm run dev
```

Si la configuration est valide, vous verrez :

```
🔧 Environment Configuration:
  NODE_ENV: development
  DATABASE_URL: postgresql://po...mit=1
  DIRECT_URL: postgresql://po...tgres
  NEXTAUTH_URL: http://localhost:3000
  NEXTAUTH_SECRET: Ksjzi...Dg=

✨ Optional Features:
  Google OAuth: ✅
  Sentry Monitoring: ❌
  Rate Limiting: ❌
```

---

## Variables Requises vs Optionnelles

### ✅ Requises (Application ne démarre pas si absentes)

| Variable          | Description                       | Exemple                                                      |
| ----------------- | --------------------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`    | Connexion poolée Neon             | `postgresql://...?pgbouncer=true`                            |
| `DIRECT_URL`      | Connexion directe pour migrations | `postgresql://...`                                           |
| `NEXTAUTH_SECRET` | Secret JWT (32+ caractères)       | Générer avec `openssl rand -base64 32`                       |
| `NEXTAUTH_URL`    | URL de l'application              | `http://localhost:3000` (dev)<br>`https://solkant.fr` (prod) |

### 🔧 Optionnelles (Désactivent fonctionnalités si absentes)

| Variable               | Fonctionnalité     | Check via                   |
| ---------------------- | ------------------ | --------------------------- |
| `GOOGLE_CLIENT_ID`     | Login Google OAuth | `features.googleOAuth`      |
| `GOOGLE_CLIENT_SECRET` | Login Google OAuth | `features.googleOAuth`      |
| `SENTRY_DSN`           | Error monitoring   | `features.sentryMonitoring` |
| `UPSTASH_REDIS_URL`    | Rate limiting      | `features.rateLimiting`     |
| `UPSTASH_REDIS_TOKEN`  | Rate limiting      | `features.rateLimiting`     |

---

## Feature Flags

Vérifier dynamiquement la disponibilité des fonctionnalités :

```typescript
import { features } from "@/lib/env";

// Afficher bouton "Login with Google" seulement si configuré
if (features.googleOAuth) {
  return <GoogleLoginButton />;
}

// Logger vers Sentry seulement si activé
if (features.sentryMonitoring) {
  Sentry.captureException(error);
}

// Activer rate limiting si Redis disponible
if (features.rateLimiting) {
  await rateLimit.check(ip);
}
```

---

## Générer un Template `.env.local`

### Via Code

```typescript
import { generateEnvTemplate } from "@/lib/env";

console.log(generateEnvTemplate());
// Copier-coller le résultat dans .env.local
```

### Via Console

```bash
node -e "const { generateEnvTemplate } = require('./lib/env'); console.log(generateEnvTemplate())"
```

**Sortie** :

```bash
# 🔐 Solkant - Environment Variables
# Copier ce fichier vers .env.local et remplir les valeurs

# ===== DATABASE (REQUIRED) =====
DATABASE_URL="postgres://user:password@host/database?sslmode=require&pgbouncer=true"
DIRECT_URL="postgres://user:password@host/database?sslmode=require"

# ===== AUTH (REQUIRED) =====
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="" # Générer avec: openssl rand -base64 32

# ===== OAUTH (OPTIONAL) =====
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""

# ===== MONITORING (OPTIONAL) =====
# SENTRY_DSN=""

# ===== RATE LIMITING (OPTIONAL) =====
# UPSTASH_REDIS_URL=""
# UPSTASH_REDIS_TOKEN=""

# ===== ENVIRONMENT =====
NODE_ENV="development"
```

---

## Tests Automatisés

### Fichier : `tests/lib/env.test.ts`

Suite de tests complète (13 tests) :

#### Coverage

- ✅ Validation variables valides
- ✅ Détection variables manquantes
- ✅ Détection variables invalides
- ✅ Feature flags (googleOAuth, sentryMonitoring, rateLimiting)
- ✅ Format des logs d'erreur
- ✅ Template generation

#### Lancer les tests

```bash
# Tous les tests
npm test -- tests/lib/env.test.ts

# Avec coverage
npm run test:coverage -- tests/lib/env.test.ts

# Mode watch
npm test -- --watch tests/lib/env.test.ts
```

**Résultat attendu** :

```
✓ Environment Variables Validation (13)
  ✓ validateEnv - Variables valides (2)
  ✓ validateEnv - Variables manquantes (2)
  ✓ validateEnv - Variables invalides (3)
  ✓ Features flags (3)
  ✓ Error message formatting (2)
  ✓ generateEnvTemplate (1)

Test Files  1 passed (1)
Tests       13 passed (13)
```

---

## Sécurité

### Masquage des Secrets

Les logs **masquent automatiquement** les valeurs sensibles :

```typescript
// ❌ MAUVAIS : Afficher secret complet
console.log(env.NEXTAUTH_SECRET);
// "Ksjziwd7hmk3iFVw49Gd2/3NbfltLewCWCWgj94ZkDg="

// ✅ BON : Masqué dans logEnvSummary()
console.log(maskSecret(env.NEXTAUTH_SECRET));
// "Ksjzi...Dg="
```

### Utilisation Côté Client

**⚠️ ATTENTION** : Ne **jamais** importer `lib/env.ts` dans un composant client :

```typescript
// ❌ DANGER : Expose secrets côté client
"use client";
import { getEnv } from "@/lib/env"; // ❌ NE PAS FAIRE

// ✅ SÉCURISÉ : Utiliser seulement côté serveur
// Server Component (pas de 'use client')
import { getEnv } from "@/lib/env"; // ✅ OK

// API Route
export async function GET() {
  const env = getEnv(); // ✅ OK
}

// Server Action
export async function createUser() {
  "use server";
  const env = getEnv(); // ✅ OK
}
```

---

## Bonnes Pratiques

### 1. Toujours Redémarrer Après Modification

```bash
# Arrêter le serveur (Ctrl+C)
# Modifier .env.local
# Redémarrer
npm run dev
```

### 2. Ne Jamais Commit `.env.local`

```bash
# .gitignore (déjà configuré)
.env.local
.env*.local
```

### 3. Documenter les Variables Personnalisées

Si vous ajoutez une nouvelle variable :

```typescript
// lib/env.ts
const envSchema = z.object({
  // ...
  MY_NEW_VAR: z
    .string()
    .min(10)
    .describe("📝 Description claire pour les logs"), // ✅ Importante !
});
```

### 4. Tester Localement Avant Déploiement

```bash
# Tester validation
npm run test:run -- tests/lib/env.test.ts

# Vérifier configuration
npm run dev
# Chercher "✨ Optional Features" dans les logs
```

---

## Dépannage

### Problème : "Invalid environment variables" au démarrage

**Cause** : Variables manquantes ou invalides

**Solution** :

1. Lire attentivement les logs structurés (📋, ⚠️, 🔴)
2. Vérifier que `.env.local` existe à la racine
3. Comparer avec `generateEnvTemplate()`
4. Redémarrer le serveur

### Problème : Variables optionnelles non détectées

**Cause** : Clés présentes mais valeurs vides

```bash
# ❌ Mauvais
GOOGLE_CLIENT_ID=""

# ✅ Bon : Commenter si non utilisé
# GOOGLE_CLIENT_ID=""

# ✅ Ou définir vraie valeur
GOOGLE_CLIENT_ID="846419051834-xxx.apps.googleusercontent.com"
```

### Problème : Erreur TypeScript sur `envSchema.shape`

**Cause** : Accès direct aux propriétés du schéma Zod

**Solution** : Utiliser type assertion ou vérification runtime (déjà implémenté)

---

## Exemples de Configuration

### Développement Local Minimal

```bash
# .env.local
DATABASE_URL="postgresql://localhost:5432/solkant_dev?pgbouncer=true"
DIRECT_URL="postgresql://localhost:5432/solkant_dev"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-32-caracteres-minimum-requis"
NODE_ENV="development"
```

### Production Complète

```bash
# .env.local (Production)
DATABASE_URL="postgresql://prod-host:5432/solkant?pgbouncer=true&ssl=true"
DIRECT_URL="postgresql://prod-host:5432/solkant?ssl=true"
NEXTAUTH_URL="https://solkant.fr"
NEXTAUTH_SECRET="<secret-genere-avec-openssl>"

# OAuth
GOOGLE_CLIENT_ID="846419051834-xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"

# Monitoring
SENTRY_DSN="https://xxx@sentry.io/xxx"

# Rate Limiting
UPSTASH_REDIS_URL="https://xxx.upstash.io"
UPSTASH_REDIS_TOKEN="xxx"

NODE_ENV="production"
```

---

## Ressources

- **Fichier principal** : `lib/env.ts`
- **Tests** : `tests/lib/env.test.ts`
- **Type Definitions** : `export type Env = z.infer<typeof envSchema>`
- **Zod Documentation** : https://zod.dev/

---

**Mainteneur** : Testing & QA Specialist  
**Dernière mise à jour** : 2 décembre 2025  
**Version** : 1.0.0
