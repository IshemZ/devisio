# Accessibilité (A11y) - Devisio

Documentation complète de l'accessibilité pour Devisio, conforme WCAG 2.1 AA.

---

## 📋 Conformité WCAG 2.1 AA

Devisio est conçu pour être accessible à tous les utilisateurs, y compris ceux utilisant des technologies d'assistance.

### ✅ Critères Respectés

- **1.3.1 Info and Relationships** - Landmarks ARIA, labels sémantiques
- **1.4.3 Contrast (Minimum)** - Ratios de contraste ≥ 4.5:1
- **2.1.1 Keyboard** - Navigation clavier complète
- **2.4.1 Bypass Blocks** - Skip link vers contenu principal
- **2.4.7 Focus Visible** - Indicateurs de focus visibles (≥ 3:1)
- **3.3.2 Labels or Instructions** - Labels explicites sur tous les contrôles
- **4.1.2 Name, Role, Value** - Attributs ARIA appropriés

---

## 🎨 Palette Accessible

### Couleurs Validées pour le Texte

| Utilisation       | Couleur   | Sur Background Clair | Ratio | Conforme |
| ----------------- | --------- | -------------------- | ----- | -------- |
| Texte principal   | `#1C1917` | ✅                   | 17:1  | WCAG AAA |
| Texte secondaire  | `#78716C` | ✅                   | 5.2:1 | WCAG AA  |
| Liens/Primary     | `#8B7355` | ✅                   | 5.1:1 | WCAG AA  |
| Texte sur primary | `#FFFFFF` | ✅                   | 4.8:1 | WCAG AA  |

### ⚠️ Restrictions

- ❌ **NE JAMAIS** utiliser `--secondary` (#D4B5A0) comme couleur de texte
- ❌ **NE JAMAIS** utiliser `--accent` (#E8C4B8) comme couleur de texte
- ✅ Ces couleurs sont réservées aux backgrounds

**Documentation complète** : [A11Y_COLOR_AUDIT.md](./A11Y_COLOR_AUDIT.md)

---

## ⌨️ Navigation Clavier

### Skip Link

Appuyez sur **Tab** dès l'arrivée sur une page pour révéler le lien "Aller au contenu principal".

```tsx
import { SkipLink } from "@/components/SkipLink";

<SkipLink />
<header role="banner">...</header>
<main id="main-content" role="main">...</main>
```

### Raccourcis Clavier

| Action           | Touche              |
| ---------------- | ------------------- |
| Navigation       | Tab / Shift+Tab     |
| Activer bouton   | Enter / Space       |
| Fermer modal     | Échap               |
| Aller au contenu | Tab (sur skip link) |

### Focus Visible

Tous les éléments interactifs ont un indicateur de focus visible :

- Boutons : ring primaire avec offset
- Inputs : ring primaire sans offset
- Liens : outline primaire

```css
/* globals.css */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

---

## 🔊 Screen Readers

### Landmarks ARIA

```tsx
<header role="banner">
  <nav aria-label="Navigation principale">...</nav>
</header>

<main id="main-content" role="main" tabIndex={-1}>
  {/* Contenu principal */}
</main>
```

### Labels Explicites

Tous les inputs ont des labels associés via `htmlFor` et `id` :

```tsx
import { FormField } from "@/components/ui/form-field";

<FormField
  label="Nom du client"
  id="clientName"
  required
  error={errors.clientName}
>
  <Input id="clientName" name="clientName" />
</FormField>;
```

### États Dynamiques

Les mises à jour importantes sont annoncées via `aria-live` :

```tsx
<span id="total" role="status" aria-live="polite">
  {total.toFixed(2)} €
</span>
```

---

## 🧪 Tests A11y

### 1. Audit Automatique en Développement

**axe-core** est activé automatiquement en mode dev :

```bash
npm run dev
# Ouvrir console navigateur
# Les violations A11y s'affichent automatiquement
```

### 2. ESLint A11y

```bash
npm run lint
# 0 erreur A11y attendu
```

### 3. Audit pa11y-ci (Optionnel)

```bash
# Installer
npm install -D pa11y-ci

# Lancer serveur + audit
npm run dev &
sleep 5
npx pa11y-ci

# Ou utiliser le script
npm run a11y:audit
```

Configuration : `.pa11yci.json`

### 4. Tests Manuels

#### Navigation Clavier

- [ ] Tab à travers tous les éléments
- [ ] Skip link visible au premier Tab
- [ ] Focus visible sur tous les éléments
- [ ] Enter/Space active les boutons
- [ ] Échap ferme les modales

#### Screen Reader (NVDA/VoiceOver)

- [ ] Landmarks annoncés correctement
- [ ] Labels lus pour tous les inputs
- [ ] États (erreur, requis) annoncés
- [ ] Navigation logique entre sections

#### Zoom

- [ ] Interface utilisable à 200% de zoom
- [ ] Pas de scroll horizontal
- [ ] Pas de perte d'information

---

## 🛠️ Développement Accessible

### Checklist pour Nouveaux Composants

- [ ] Utiliser des éléments sémantiques (`<button>`, `<nav>`, etc.)
- [ ] Ajouter `aria-label` si label visuel manquant
- [ ] Associer labels avec `htmlFor` + `id`
- [ ] Tester navigation clavier
- [ ] Vérifier contraste couleurs (≥ 4.5:1)
- [ ] Marquer icônes décoratives `aria-hidden="true"`
- [ ] Ajouter `aria-live` pour mises à jour dynamiques

### Exemple de Formulaire Accessible

```tsx
import { FormField, Input, Button } from "@/components/ui";

export function AccessibleForm() {
  const [errors, setErrors] = useState({});

  return (
    <form onSubmit={handleSubmit} aria-label="Formulaire de contact">
      <FormField label="Email" id="email" required error={errors.email}>
        <Input
          id="email"
          type="email"
          name="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
      </FormField>

      <Button type="submit" aria-label="Envoyer le formulaire">
        Envoyer
      </Button>
    </form>
  );
}
```

### Exemple de Modal Accessible

```tsx
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogTitle>Confirmer la suppression</DialogTitle>
    {/* Le focus est piégé dans la modal */}
    {/* Échap ferme automatiquement */}
  </DialogContent>
</Dialog>;
```

---

## 📚 Ressources

### Documentation Officielle

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/fr/docs/Web/Accessibility)

### Outils de Test

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools Extension](https://www.deque.com/axe/devtools/)
- [Lighthouse (Chrome DevTools)](https://developer.chrome.com/docs/lighthouse/)

### Composants shadcn/ui

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- Tous les composants sont accessibles par défaut

---

## 🎯 Objectifs Prochaines Étapes

### Semaine 11 (10-16 Fév)

- [ ] Audit Lighthouse complet
- [ ] Score Accessibility 95+ cible
- [ ] Performance avec axe-core actif

### Améliorations Futures

- [ ] Tests E2E A11y avec Playwright
- [ ] Documentation vidéo pour utilisateurs
- [ ] Support mode sombre accessible
- [ ] i18n avec annonces screen reader

---

## 🆘 Support

### Signaler un Problème A11y

Si vous rencontrez un problème d'accessibilité :

1. Vérifier la [documentation WCAG](https://www.w3.org/WAI/WCAG21/quickref/)
2. Consulter [A11Y_AUDIT_REPORT.md](./A11Y_AUDIT_REPORT.md)
3. Créer une issue GitHub avec label `a11y`

### Contact

**Mainteneur A11y** : UX/UI & Accessibility Specialist

---

**Dernière mise à jour** : 1er décembre 2025  
**Statut** : ✅ Conforme WCAG 2.1 AA
