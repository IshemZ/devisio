# 🎨 Guide des Composants UI - Devisio

## Vue d'ensemble

Devisio utilise **shadcn/ui** comme design system avec un thème beauté/élégance personnalisé.

### Thème de couleurs

- **Primary** : Marron élégant `#8B7355`
- **Secondary** : Beige doux `#D4B5A0`
- **Accent** : Rose poudré `#E8C4B8`
- **Background** : Blanc crème

---

## Composants de Formulaire

### FormField

Wrapper réutilisable pour tous les champs de formulaire avec accessibilité ARIA.

```tsx
import { FormField, Input } from "@/components/ui";

<FormField
  label="Prénom"
  id="firstName"
  required
  error={errors.firstName}
  hint="Entrez le prénom du client"
>
  <Input
    id="firstName"
    name="firstName"
    aria-invalid={!!errors.firstName}
    aria-describedby={errors.firstName ? "firstName-error" : "firstName-hint"}
  />
</FormField>;
```

**Props :**

- `label` (string, requis) : Label du champ
- `id` (string, requis) : ID du champ (pour htmlFor)
- `error` (string, optionnel) : Message d'erreur
- `required` (boolean, optionnel) : Affiche l'astérisque requis
- `hint` (string, optionnel) : Texte d'aide
- `children` (ReactNode) : Le champ input/select/textarea

---

### Input, Textarea, Select

Utilisez toujours avec FormField pour la cohérence :

```tsx
// Input simple
<FormField label="Email" id="email" required>
  <Input type="email" id="email" name="email" />
</FormField>

// Textarea
<FormField label="Notes" id="notes">
  <Textarea id="notes" name="notes" rows={4} />
</FormField>

// Select
<FormField label="Statut" id="status" required>
  <Select name="status">
    <SelectTrigger id="status">
      <SelectValue placeholder="Choisir..." />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="DRAFT">Brouillon</SelectItem>
      <SelectItem value="SENT">Envoyé</SelectItem>
    </SelectContent>
  </Select>
</FormField>
```

---

## Composants de Feedback

### EmptyState

Affiche un état vide avec une icône, un message et un CTA optionnel.

```tsx
import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui";

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

**Props :**

- `icon` (LucideIcon, requis) : Icône Lucide
- `title` (string, requis) : Titre principal
- `description` (string, requis) : Description
- `actionLabel` (string, optionnel) : Texte du bouton
- `actionHref` (string, optionnel) : Lien du bouton
- `onAction` (function, optionnel) : Callback onClick (alternatif à href)

---

### QuoteStatusBadge

Badge coloré pour afficher le statut d'un devis.

```tsx
import { QuoteStatusBadge } from "@/components/ui";

<QuoteStatusBadge status={quote.status} />;
```

**Statuts supportés :**

- `DRAFT` → Brouillon (gris)
- `SENT` → Envoyé (bleu)
- `ACCEPTED` → Accepté (vert)
- `REJECTED` → Refusé (rouge)
- `EXPIRED` → Expiré (gris foncé)

---

### LoadingSpinner

Spinner de chargement accessible.

```tsx
import { LoadingSpinner } from "@/components/ui";

// Taille par défaut (md)
<LoadingSpinner />

// Tailles disponibles
<LoadingSpinner size="sm" />
<LoadingSpinner size="md" />
<LoadingSpinner size="lg" />

// Dans un bouton
<Button disabled={isLoading}>
  {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
  {isLoading ? 'Enregistrement...' : 'Enregistrer'}
</Button>
```

---

### Alert

Affiche des messages d'information, de succès, d'avertissement ou d'erreur.

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui";
import { AlertCircle } from "lucide-react";

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Erreur</AlertTitle>
  <AlertDescription>
    Une erreur est survenue lors de la création du client.
  </AlertDescription>
</Alert>;
```

**Variants :** `default`, `destructive`

---

### AlertDialog (Confirmation)

Dialogue de confirmation pour les actions destructives.

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui";

<AlertDialog open={showDelete} onOpenChange={setShowDelete}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Supprimer le client ?</AlertDialogTitle>
      <AlertDialogDescription>
        Cette action est irréversible. Le client et tous ses devis seront
        supprimés.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Annuler</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
        className="bg-destructive hover:bg-destructive/90"
      >
        Supprimer
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>;
```

---

## Composants de Layout

### Card

Conteneur pour regrouper du contenu.

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";

<Card>
  <CardHeader>
    <CardTitle>Statistiques du mois</CardTitle>
    <CardDescription>Résumé de votre activité</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-3xl font-bold">1 234 €</p>
  </CardContent>
  <CardFooter>
    <p className="text-sm text-muted-foreground">+12% vs mois dernier</p>
  </CardFooter>
</Card>;
```

---

### Table

Tableau accessible pour lister des données.

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

<Table>
  <TableCaption>Liste des clients (23 résultats)</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Nom</TableHead>
      <TableHead>Email</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {clients.map((client) => (
      <TableRow key={client.id}>
        <TableCell className="font-medium">
          {client.firstName} {client.lastName}
        </TableCell>
        <TableCell>{client.email}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm">
            Modifier
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>;
```

---

### Skeleton

Placeholder de chargement pour améliorer la perception de performance.

```tsx
import { Skeleton } from "@/components/ui";

// Utilisé dans loading.tsx
export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
```

---

## Composants de Navigation

### Tabs

Navigation par onglets.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

<Tabs defaultValue="infos">
  <TabsList>
    <TabsTrigger value="infos">Informations</TabsTrigger>
    <TabsTrigger value="devis">Devis (5)</TabsTrigger>
  </TabsList>
  <TabsContent value="infos">
    <ClientInfos client={client} />
  </TabsContent>
  <TabsContent value="devis">
    <ClientQuotes quotes={quotes} />
  </TabsContent>
</Tabs>;
```

---

### DropdownMenu

Menu déroulant pour actions multiples.

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { MoreVertical } from "lucide-react";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuItem onClick={handleEdit}>Modifier</DropdownMenuItem>
    <DropdownMenuItem onClick={handleDuplicate}>Dupliquer</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
      Supprimer
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

---

## Bonnes Pratiques

### Accessibilité (A11y)

✅ **DO**

```tsx
// Labels explicites
<FormField label="Nom complet" id="fullName" required>
  <Input id="fullName" aria-invalid={!!error} />
</FormField>

// Texte alternatif pour icônes décoratives
<Icon aria-hidden="true" />

// Feedback annoncé
<p role="alert">{error}</p>
```

❌ **DON'T**

```tsx
// Pas de label
<input placeholder="Nom" />

// Div cliquable au lieu de button
<div onClick={handleClick}>Cliquer</div>
```

---

### Import depuis index

Toujours importer depuis `@/components/ui` :

```tsx
// ✅ BON
import { Button, Input, FormField } from "@/components/ui";

// ❌ ÉVITER
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
```

---

### Composition

Préférer la composition à la configuration :

```tsx
// ✅ BON - Flexible
<FormField label="Email" id="email" error={error}>
  <Input type="email" id="email" />
</FormField>

// ❌ ÉVITER - Trop de props
<FormInput
  label="Email"
  type="email"
  error={error}
  required
  placeholder="..."
  className="..."
/>
```

---

## Toast Notifications

Nous utilisons **Sonner** (déjà configuré dans layout.tsx) :

```tsx
import { toast } from "sonner";

// Success
toast.success("Client créé avec succès");

// Error
toast.error("Erreur lors de la création");

// Loading → Success
const toastId = toast.loading("Création en cours...");
// ... après action
toast.success("Client créé", { id: toastId });

// Avec description
toast.success("Devis envoyé", {
  description: `Le devis ${quoteNumber} a été envoyé à ${client.email}`,
});
```

---

## Ressources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI (primitives)](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Dernière mise à jour** : 1er décembre 2025
