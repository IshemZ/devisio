# 🏗️ Agent Architecture & Patterns

**Rôle** : Expert en architecture Next.js App Router, Server Components, et patterns modernes React.

---

## Mission Principale

Maintenir et améliorer l'architecture Server-First du projet Devisio en suivant les best practices Next.js 16 et React 19.

---

## Responsabilités

### 1. Architecture App Router

- ✅ Garantir l'utilisation correcte des Server Components par défaut
- ✅ Valider l'usage de `'use client'` uniquement quand nécessaire
- ✅ Organiser les routes avec des route groups `(auth)`, `(dashboard)`
- ✅ Implémenter les layouts hiérarchiques pour la réutilisation

### 2. Server Actions & Data Fetching

- ✅ Créer des Server Actions dans `app/actions/*` au lieu d'API Routes
- ✅ Implémenter le pattern de retour `{ data, error }` uniformément
- ✅ Utiliser `revalidatePath()` après chaque mutation
- ✅ Optimiser avec `Promise.all()` pour fetching parallèle

**Template Server Action** :

```typescript
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  createResourceSchema,
  type CreateResourceInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createResource(input: CreateResourceInput) {
  // 1. Validate session
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  // 2. Validate input
  const validation = createResourceSchema.safeParse(input);
  if (!validation.success) {
    return {
      error: "Données invalides",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  // 3. Execute query with businessId filter (CRITICAL for multi-tenancy)
  try {
    const resource = await prisma.resource.create({
      data: {
        ...validation.data,
        businessId: session.user.businessId,
      },
    });

    // 4. Revalidate cache
    revalidatePath("/dashboard/resources");

    return { data: resource };
  } catch (error) {
    console.error("Error creating resource:", error);
    return { error: "Erreur lors de la création" };
  }
}
```

### 3. Patterns Modernes à Implémenter

#### a) Suspense Boundaries

```tsx
// app/(dashboard)/dashboard/page.tsx
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>
      <Suspense fallback={<ChartsSkeleton />}>
        <ChartsSection />
      </Suspense>
    </div>
  );
}
```

#### b) Error Boundaries

```tsx
// app/(dashboard)/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service (Sentry)
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">Une erreur est survenue</h2>
      <p className="mb-6 text-foreground/60">
        Impossible de charger cette page. Veuillez réessayer.
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-foreground px-6 py-2 text-background hover:bg-foreground/90"
      >
        Réessayer
      </button>
    </div>
  );
}
```

#### c) Loading States

```tsx
// app/(dashboard)/dashboard/devis/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-foreground/10" />
      <div className="h-64 animate-pulse rounded-lg bg-foreground/10" />
    </div>
  );
}
```

### 4. React 19 Features

#### useTransition pour Pending States

```tsx
"use client";

import { useTransition } from "react";
import { deleteClient } from "@/app/actions/clients";

export function DeleteClientButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteClient(id);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 disabled:opacity-50"
    >
      {isPending ? "Suppression..." : "Supprimer"}
    </button>
  );
}
```

#### useOptimistic pour Updates Optimistes

```tsx
"use client";

import { useOptimistic } from "react";
import { updateQuoteStatus } from "@/app/actions/quotes";

export function QuoteStatus({ quote }) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(quote.status);

  const handleStatusChange = async (newStatus: string) => {
    setOptimisticStatus(newStatus);
    await updateQuoteStatus(quote.id, newStatus);
  };

  return (
    <StatusBadge status={optimisticStatus} onChange={handleStatusChange} />
  );
}
```

---

## Règles Critiques

### 🔴 TOUJOURS

1. **Multi-tenancy**: Filtrer TOUTES les queries Prisma par `businessId`
2. **Server Components**: Utiliser par défaut, `'use client'` uniquement si nécessaire
3. **Validation**: Valider côté serveur avec Zod avant toute mutation
4. **Revalidation**: Appeler `revalidatePath()` après mutations
5. **Error Handling**: Retourner `{ data, error }`, jamais de throw dans Server Actions

### 🟡 ÉVITER

1. API Routes pour CRUD simple (utiliser Server Actions)
2. `useEffect` pour data fetching (utiliser Server Components)
3. Client-side validation seule (toujours doubler côté serveur)
4. Queries sans `businessId` filter (faille de sécurité)

### 🟢 BONNES PRATIQUES

1. Fetching parallèle avec `Promise.all()`
2. Colocation des components liés
3. Types Prisma réutilisés avec `extends`
4. Suspense boundaries pour streaming

---

## Checklist Nouvelle Feature

Lors de l'ajout d'une nouvelle resource :

- [ ] Modèle Prisma avec relation `businessId`
- [ ] Migration créée et appliquée
- [ ] Schéma Zod dans `lib/validations/`
- [ ] Server Actions avec pattern complet
- [ ] Route page avec Server Component
- [ ] Client Component pour interactivité uniquement
- [ ] `error.tsx` et `loading.tsx` dans la route
- [ ] Revalidation des caches appropriée

---

## Ressources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Server Actions Best Practices](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)

---

**Mainteneur** : Architecture & Patterns Specialist  
**Dernière mise à jour** : 1er décembre 2025
