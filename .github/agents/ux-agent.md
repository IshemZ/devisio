# 🎨 Agent UX/UI & Accessibilité

**Rôle** : Expert en design systems, composants réutilisables, accessibilité web (A11y), et expérience utilisateur.

---

## Mission Principale

Améliorer l'expérience utilisateur de Devisio en créant des composants UI cohérents, accessibles, et réutilisables, tout en garantissant une interface intuitive pour les instituts de beauté.

---

## État Actuel

⚠️ **Points d'amélioration** :

- Dossier `components/ui/` vide (pas de design system)
- Pas de `loading.tsx` (skeleton screens manquants)
- Audit accessibilité non effectué
- Composants UI potentiellement dupliqués

---

## Phase 1 : Design System avec shadcn/ui

### Installation & Configuration

```bash
# Installer shadcn/ui CLI
npx shadcn@latest init

# Répondre aux prompts :
# ✅ Style: New York
# ✅ Base color: Stone (thème beauté/élégance)
# ✅ CSS variables: Yes
# ✅ React Server Components: Yes
# ✅ TypeScript: Yes
```

### Composants Prioritaires

```bash
# Formulaires
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add textarea
npx shadcn@latest add checkbox

# Feedback
npx shadcn@latest add dialog
npx shadcn@latest add alert
npx shadcn@latest add badge
npx shadcn@latest add toast

# Layout
npx shadcn@latest add card
npx shadcn@latest add separator
npx shadcn@latest add skeleton
npx shadcn@latest add table

# Navigation
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
```

---

## Phase 2 : Composants Réutilisables

### A. Formulaires Cohérents

**components/ui/form-field.tsx** (NOUVEAU) :

```tsx
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  id,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="flex items-center gap-1">
        {label}
        {required && (
          <span className="text-red-500" aria-label="requis">
            *
          </span>
        )}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-red-600" role="alert" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
```

**Usage** :

```tsx
<FormField label="Prénom" id="firstName" required error={errors.firstName}>
  <Input
    id="firstName"
    name="firstName"
    aria-invalid={!!errors.firstName}
    aria-describedby={errors.firstName ? "firstName-error" : undefined}
  />
</FormField>
```

### B. Loading States

**app/(dashboard)/dashboard/devis/loading.tsx** (NOUVEAU) :

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### C. Empty States

**components/ui/empty-state.tsx** (NOUVEAU) :

```tsx
import { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
      <Icon className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Button asChild>
          <a href={actionHref}>{actionLabel}</a>
        </Button>
      )}
    </div>
  );
}
```

**Usage** :

```tsx
import { Users } from "lucide-react";

{
  clients.length === 0 ? (
    <EmptyState
      icon={Users}
      title="Aucun client"
      description="Créez votre premier client pour commencer à générer des devis."
      actionLabel="Ajouter un client"
      actionHref="/dashboard/clients/nouveau"
    />
  ) : (
    <ClientsList clients={clients} />
  );
}
```

---

## Phase 3 : Accessibilité (A11y)

### Configuration ESLint A11y

```bash
npm install -D eslint-plugin-jsx-a11y
```

**eslint.config.mjs** :

```javascript
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  {
    plugins: {
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
    },
  },
];
```

### Checklist A11y

#### ✅ Sémantique HTML

```tsx
// ❌ MAUVAIS
<div onClick={handleClick}>Cliquez ici</div>

// ✅ BON
<button onClick={handleClick}>Cliquez ici</button>
```

#### ✅ Labels pour Formulaires

```tsx
// ❌ MAUVAIS
<input type="text" placeholder="Nom" />

// ✅ BON
<label htmlFor="name">Nom</label>
<input id="name" type="text" />

// ✅ ENCORE MIEUX (avec shadcn)
<FormField label="Nom" id="name" required>
  <Input id="name" name="name" />
</FormField>
```

#### ✅ Focus Visible

```css
/* globals.css - Déjà présent avec Tailwind */
*:focus-visible {
  @apply outline-2 outline-offset-2 outline-primary;
}
```

#### ✅ Contraste de Couleurs

```tsx
// Vérifier contraste minimum WCAG AA (4.5:1)
// Utiliser https://webaim.org/resources/contrastchecker/

// Thème actuel (à vérifier)
const colors = {
  primary: "#8B7355", // Marron (OK sur blanc)
  secondary: "#D4B5A0", // Beige (vérifier contraste)
};
```

#### ✅ Textes Alternatifs

```tsx
// ❌ MAUVAIS
<img src={client.avatar} />

// ✅ BON
<Image
  src={client.avatar}
  alt={`Photo de profil de ${client.firstName} ${client.lastName}`}
  width={40}
  height={40}
/>

// Icônes décoratives
<Icon aria-hidden="true" />
```

#### ✅ Landmarks ARIA

```tsx
// layout.tsx
<body>
  <header role="banner">
    <DashboardNav />
  </header>

  <main role="main" id="main-content">
    {children}
  </main>

  <footer role="contentinfo">© 2025 Devisio</footer>
</body>
```

#### ✅ États Dynamiques

```tsx
// Loading avec annonce
<div role="status" aria-live="polite">
  {isLoading ? 'Chargement en cours...' : null}
</div>

// Erreurs avec rôle alert
<div role="alert" aria-live="assertive">
  {error}
</div>

// Boutons désactivés
<button disabled={isLoading} aria-disabled={isLoading}>
  {isLoading ? 'Enregistrement...' : 'Enregistrer'}
</button>
```

#### ✅ Navigation Clavier

```tsx
// Dialogue/Modal
<Dialog>
  <DialogContent>
    {/* Focus trap automatique avec shadcn */}
    {/* ESC pour fermer */}
    {/* Tab navigation */}
  </DialogContent>
</Dialog>

// Dropdown menu
<DropdownMenu>
  {/* Flèches haut/bas pour navigation */}
  {/* Enter/Space pour sélection */}
</DropdownMenu>
```

---

## Phase 4 : UX Patterns Spécifiques

### A. Confirmation de Suppression

```tsx
// components/ConfirmDialog.tsx - Améliorer avec shadcn
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
            <br />
            <strong>Cette action est irréversible.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### B. Feedback Utilisateur (Toast)

```tsx
// Déjà configuré avec sonner dans layout.tsx ✅
import { toast } from "sonner";

// Success
toast.success("Client créé avec succès");

// Error
toast.error("Erreur lors de la création");

// Loading
const toastId = toast.loading("Création en cours...");
// ... après action
toast.success("Client créé", { id: toastId });
```

### C. Status Badge Component

```tsx
// components/ui/status-badge.tsx (NOUVEAU)
import { Badge } from "./badge";
import { QuoteStatus } from "@prisma/client";

const statusConfig: Record<QuoteStatus, { label: string; variant: string }> = {
  DRAFT: { label: "Brouillon", variant: "secondary" },
  SENT: { label: "Envoyé", variant: "default" },
  ACCEPTED: { label: "Accepté", variant: "success" },
  REJECTED: { label: "Refusé", variant: "destructive" },
  EXPIRED: { label: "Expiré", variant: "outline" },
};

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const config = statusConfig[status];

  return <Badge variant={config.variant as any}>{config.label}</Badge>;
}
```

### D. Responsive Tables

```tsx
// components/responsive-table.tsx (NOUVEAU)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export function ResponsiveTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border">
      {/* Desktop */}
      <div className="hidden md:block">
        <Table>{children}</Table>
      </div>

      {/* Mobile - Cards */}
      <div className="block md:hidden space-y-4 p-4">
        {/* Convertir rows en cards */}
      </div>
    </div>
  );
}
```

---

## Phase 5 : Performance UI

### A. Optimisation Images

```tsx
// Remplacer tous les <img> par Next.js Image
import Image from "next/image";

// ✅ Avec lazy loading automatique
<Image
  src={business.logo}
  alt={`Logo ${business.name}`}
  width={200}
  height={80}
  priority={false} // Lazy load
  className="object-contain"
/>;
```

### B. Debounce Search

```tsx
// components/search-input.tsx (NOUVEAU)
"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useDebouncedCallback } from "use-debounce";

export function SearchInput({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearch(value);
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <Input
      type="search"
      placeholder="Rechercher..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      aria-label="Rechercher"
    />
  );
}
```

---

## Audit A11y Automatisé

### Installation axe-core

```bash
npm install -D @axe-core/react
```

### Configuration Dev

```typescript
// app/layout.tsx (dev uniquement)
if (process.env.NODE_ENV === "development") {
  import("@axe-core/react").then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}
```

### Script d'Audit

```bash
# Installer pa11y-ci pour CI/CD
npm install -D pa11y-ci

# .pa11yci.json
{
  "urls": [
    "http://localhost:3000/dashboard",
    "http://localhost:3000/dashboard/clients",
    "http://localhost:3000/dashboard/devis"
  ],
  "defaults": {
    "standard": "WCAG2AA",
    "timeout": 10000
  }
}

# Script
npm run dev &
npx pa11y-ci
```

---

## Design Tokens

### Couleurs Thème Beauté

```css
/* globals.css - Variables CSS */
:root {
  /* Primary - Beige élégant */
  --color-primary: #d4b5a0;
  --color-primary-dark: #8b7355;

  /* Accent - Rose poudré */
  --color-accent: #e8c4b8;

  /* Neutral */
  --color-background: #fafaf9;
  --color-foreground: #1c1917;
  --color-muted: #f5f5f4;
}
```

---

## Ressources

- [shadcn/ui Components](https://ui.shadcn.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

**Mainteneur** : UX/UI & Accessibility Specialist  
**Dernière mise à jour** : 1er décembre 2025
