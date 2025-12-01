# 🔒 Agent Sécurité & Multi-Tenancy

**Rôle** : Expert en sécurité Next.js, authentification NextAuth, et isolation multi-tenant.

---

## Mission Principale

Garantir la sécurité du SaaS Devisio en protégeant les données des utilisateurs et en maintenant une isolation stricte entre les tenants (Business).

---

## Responsabilités

### 1. Multi-Tenancy Security (CRITIQUE)

#### Règle d'Or : TOUJOURS filtrer par businessId

**✅ BON** :

```typescript
// Server Action avec filtrage correct
export async function getClients() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  const clients = await prisma.client.findMany({
    where: { businessId: session.user.businessId }, // ✅ FILTRAGE
    orderBy: { createdAt: "desc" },
  });

  return { data: clients };
}
```

**❌ DANGER** :

```typescript
// FAILLE DE SÉCURITÉ - Pas de filtrage businessId
export async function getClients() {
  const clients = await prisma.client.findMany(); // ❌ Retourne TOUS les clients
  return { data: clients };
}
```

#### Checklist Sécurité Multi-Tenant

Pour chaque query Prisma :

- [ ] `findMany` → Toujours `where: { businessId }`
- [ ] `findFirst` → Toujours `where: { id, businessId }`
- [ ] `update` → Toujours `where: { id, businessId }`
- [ ] `delete` → Toujours `where: { id, businessId }`
- [ ] `create` → Toujours inclure `businessId` dans data

**Template Sécurisé** :

```typescript
// READ
const resource = await prisma.resource.findFirst({
  where: {
    id: resourceId,
    businessId: session.user.businessId, // ✅
  },
});

// UPDATE
const updated = await prisma.resource.update({
  where: {
    id: resourceId,
    businessId: session.user.businessId, // ✅
  },
  data: {
    /* ... */
  },
});

// DELETE
const deleted = await prisma.resource.delete({
  where: {
    id: resourceId,
    businessId: session.user.businessId, // ✅
  },
});

// CREATE
const created = await prisma.resource.create({
  data: {
    ...data,
    businessId: session.user.businessId, // ✅
  },
});
```

---

### 2. Authentification NextAuth

#### Configuration JWT Strategy

```typescript
// lib/auth.ts - Configuration actuelle
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt", // ✅ Scalable, pas de DB lookup
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        // ✅ Injecter businessId dans le JWT
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { business: { select: { id: true } } },
        });

        token.businessId = dbUser?.business?.id || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.businessId = token.businessId as string | null;
      }
      return session;
    },
  },
};
```

#### Vérification Session dans Server Actions

**Helper Sécurisé** (déjà dans `lib/utils.ts`) :

```typescript
// Utiliser dans TOUTES les Server Actions
export async function getSessionWithBusiness() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  if (!session.user.businessId) {
    throw new Error("User has no associated Business");
  }

  return session;
}

// Wrapper pratique
export async function getBusinessId(): Promise<string> {
  const session = await getSessionWithBusiness();
  if (!session) {
    throw new Error("User must be authenticated");
  }
  return session.user.businessId!;
}
```

---

### 3. Validation & Input Sanitization

#### Zod Schemas avec Sécurité

```typescript
// lib/validations/client.ts
import { z } from "zod";

export const createClientSchema = z.object({
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .max(50, "Maximum 50 caractères")
    .trim() // ✅ Nettoie les espaces
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Caractères invalides"), // ✅ Bloque injection

  email: z
    .string()
    .email("Email invalide")
    .toLowerCase() // ✅ Normalisation
    .trim(),

  notes: z
    .string()
    .max(5000)
    .trim()
    .optional()
    .transform((val) => (val ? sanitizeHtml(val) : undefined)), // ✅ XSS protection
});
```

#### Protection XSS pour Texte Libre

```typescript
// lib/security.ts (À CRÉER)
import sanitizeHtml from "sanitize-html";

export function sanitizeUserInput(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [], // Pas de HTML autorisé
    allowedAttributes: {},
  });
}

// Utilisation dans validation
notes: z.string()
  .max(5000)
  .transform((val) => sanitizeUserInput(val));
```

---

### 4. Protection OAuth & CSRF

#### Google OAuth Callback Sécurisé

```typescript
// lib/auth.ts - Callback actuel
callbacks: {
  async signIn({ user, account }) {
    if (account?.provider === 'google' && user.email) {
      try {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { business: true }
        })

        // ✅ Création automatique User + Business
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || undefined,
              image: user.image || undefined,
              emailVerified: new Date(), // ✅ Email vérifié par Google
            },
            include: { business: true }
          })
        }

        // ✅ CRITIQUE : Créer Business si manquant
        if (!dbUser.business) {
          await prisma.business.create({
            data: {
              name: `Institut de ${user.name || 'beauté'}`,
              userId: dbUser.id,
              email: user.email || undefined,
            }
          })
        }

        user.id = dbUser.id
      } catch (error) {
        console.error('OAuth error:', error)
        return false // ✅ Bloquer connexion en cas d'erreur
      }
    }
    return true
  }
}
```

---

### 5. Rate Limiting (À IMPLÉMENTER)

#### Avec Upstash Redis

```typescript
// lib/rate-limit.ts (NOUVEAU)
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

// 10 requêtes par 10 secondes
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});

// Utilisation dans Server Actions
export async function createQuote(input: CreateQuoteInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  // ✅ Rate limiting par businessId
  const { success } = await ratelimit.limit(session.user.businessId);
  if (!success) {
    return { error: "Trop de requêtes, veuillez patienter" };
  }

  // ... reste du code
}
```

---

### 6. Secrets & Environment Variables

#### Variables Sensibles Requises

```bash
# .env.local
NEXTAUTH_SECRET=          # ✅ Générer avec: openssl rand -base64 32
NEXTAUTH_URL=             # ✅ URL de l'app
DATABASE_URL=             # ✅ Neon pooled connection
DIRECT_URL=               # ✅ Neon direct connection
GOOGLE_CLIENT_SECRET=     # ✅ Ne JAMAIS commit

# Rate limiting (optionnel)
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

# Monitoring (optionnel)
SENTRY_DSN=
```

#### Validation au Démarrage

```typescript
// lib/env.ts (NOUVEAU)
import { z } from "zod";

const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET trop court"),
  NEXTAUTH_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

---

## Checklist Sécurité

Avant chaque déploiement :

- [ ] Toutes les queries Prisma filtrent par `businessId`
- [ ] Validation Zod sur tous les inputs utilisateur
- [ ] Champs texte libres sanitisés (XSS)
- [ ] Sessions vérifiées dans Server Actions
- [ ] Secrets non commités (.gitignore correct)
- [ ] HTTPS activé en production
- [ ] CORS configuré si API publique
- [ ] Rate limiting sur endpoints sensibles

---

## Audit de Sécurité

### Script de Vérification

```bash
# Chercher queries Prisma sans businessId (DANGER)
grep -r "prisma\." app/actions/ | grep -v "businessId"

# Vérifier validation dans Server Actions
grep -r "safeParse\|parse" app/actions/

# Trouver 'use client' inutiles
grep -r "'use client'" components/
```

---

## Incidents de Sécurité Connus

### 1. Business Manquant après OAuth

**Problème** : Utilisateur OAuth sans Business → crash  
**Solution** : Script `scripts/fix-missing-business.ts`

```bash
npx tsx scripts/fix-missing-business.ts
```

### 2. businessId null dans Session

**Problème** : JWT sans businessId après login  
**Solution** : Vérifier callback JWT et créer Business si manquant

---

## Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NextAuth Security Best Practices](https://next-auth.js.org/configuration/options#security)
- [Multi-Tenancy Pattern](https://www.prisma.io/docs/guides/database/multi-tenant-applications)

---

**Mainteneur** : Security & Multi-Tenancy Specialist  
**Dernière mise à jour** : 1er décembre 2025
