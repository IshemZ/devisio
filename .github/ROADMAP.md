# 🗺️ Plan d'Action Solkant - Q1 2025

**Période** : Décembre 2025 - Février 2026  
**Objectif** : Passer de 8.5/10 à 9.5/10 en production readiness

---

## 📊 Vue d'Ensemble

### Objectifs Principaux

1. ✅ Implémenter une suite de tests complète (coverage > 85%)
2. ✅ Améliorer l'expérience utilisateur (UX/UI)
3. ✅ Renforcer la sécurité et monitoring
4. ✅ Optimiser les performances

### Métriques de Succès

- **Test Coverage** : 0% → 85%
- **Lighthouse Score** : ? → 95+
- **A11y Compliance** : ? → WCAG 2.1 AA
- **Bug Rate** : Inconnu → < 1 bug/semaine
- **Load Time** : ? → < 2s (p95)

---

## 🗓️ Mois 1 : Décembre 2025 - Fondations Critiques

**Focus** : Tests + Error Handling + Sécurité

### Semaine 1 (2-8 Déc) : Setup Testing Infrastructure

**Agent responsable** : 🧪 Testing Agent

#### Tâches

- [ ] **Jour 1-2** : Configuration Vitest

  ```bash
  npm install -D vitest @vitejs/plugin-react
  npm install -D @testing-library/react @testing-library/jest-dom
  npm install -D @testing-library/user-event happy-dom
  ```

  - Créer `vitest.config.ts`
  - Créer `tests/setup.ts`
  - Ajouter scripts dans `package.json`

- [ ] **Jour 3-4** : Premier test Server Action

  - Créer `tests/actions/clients.test.ts`
  - Tester `getClients()` avec mock session
  - Tester filtrage `businessId` (sécurité critique)

- [ ] **Jour 5** : Tests validation Zod
  - Créer `tests/validations/client.test.ts`
  - Tester cas limites et edge cases
  - Tester protection XSS

**Livrables** :

- ✅ Infrastructure tests fonctionnelle
- ✅ 5+ tests Server Actions clients
- ✅ 10+ tests validation schemas
- ✅ CI/CD basic avec GitHub Actions

---

### Semaine 2 (9-15 Déc) : Tests Server Actions Complets

**Agent responsable** : 🧪 Testing Agent + 🔒 Security Agent

#### Tâches

- [ ] **Clients** : Tests CRUD complets

  - `getClients()`, `createClient()`, `updateClient()`, `deleteClient()`
  - Tester cas d'erreur (session null, businessId manquant)
  - Coverage target : 90%

- [ ] **Services** : Tests CRUD complets

  - `tests/actions/services.test.ts`
  - Tester filtrage multi-tenant
  - Coverage target : 90%

- [ ] **Quotes** : Tests critiques

  - `tests/actions/quotes.test.ts`
  - Tester génération numéro devis
  - Tester calcul totaux (subtotal, discount, total)
  - Tester création avec items

- [ ] **Security Helpers** : Tests utils
  - `tests/lib/utils.test.ts`
  - Tester `getSessionWithBusiness()`
  - Tester `getBusinessId()`

**Livrables** :

- ✅ 30+ tests Server Actions
- ✅ Coverage Server Actions : 85%
- ✅ Audit sécurité multi-tenant passé

---

### Semaine 3 (16-22 Déc) : Error Handling + Loading States

**Agent responsable** : 🏗️ Architecture Agent

#### Tâches

- [ ] **Error Boundaries** : Créer `error.tsx` dans routes

  ```
  app/(dashboard)/error.tsx
  app/(dashboard)/dashboard/clients/error.tsx
  app/(dashboard)/dashboard/devis/error.tsx
  app/(dashboard)/dashboard/services/error.tsx
  ```

  - Gestion élégante des erreurs
  - Bouton retry
  - Log vers Sentry (préparation)

- [ ] **Loading States** : Créer `loading.tsx`

  ```
  app/(dashboard)/dashboard/clients/loading.tsx
  app/(dashboard)/dashboard/devis/loading.tsx
  app/(dashboard)/dashboard/services/loading.tsx
  ```

  - Skeleton screens avec Tailwind
  - Animation pulse cohérente

- [ ] **Suspense Boundaries** : Optimiser dashboard
  - Wrapper sections indépendantes dans `<Suspense>`
  - Améliorer perceived performance

**Livrables** :

- ✅ 4+ error.tsx créés
- ✅ 3+ loading.tsx avec skeletons
- ✅ Dashboard avec Suspense boundaries

---

### Semaine 4 (23-29 Déc) : Audit Sécurité + Docs

**Agent responsable** : 🔒 Security Agent

#### Tâches

- [ ] **Audit Multi-Tenancy** : Vérifier toutes les queries

  ```bash
  # Script d'audit
  grep -r "prisma\." app/actions/ | grep -v "businessId"
  ```

  - Corriger queries manquantes
  - Ajouter tests spécifiques

- [ ] **Input Sanitization** : Protection XSS

  - Installer `sanitize-html`
  - Créer `lib/security.ts`
  - Sanitizer champs texte libres (notes, description)

- [ ] **Environment Validation** : Sécuriser config

  - Créer `lib/env.ts` avec Zod
  - Valider vars au démarrage
  - Documenter variables requises

- [ ] **Documentation** : Mettre à jour agents
  - Update security-agent.md avec findings
  - Documenter incidents résolus

**Livrables** :

- ✅ Audit sécurité complet
- ✅ 100% queries avec businessId
- ✅ XSS protection active
- ✅ Validation env au démarrage

---

## 🗓️ Mois 2 : Janvier 2026 - UX/UI & Composants

**Focus** : Design System + Accessibilité + Performance

### Semaine 5 (30 Déc - 5 Jan) : Design System Setup

**Agent responsable** : 🎨 UX Agent

#### Tâches

- [ ] **Installation shadcn/ui**

  ```bash
  npx shadcn@latest init
  # Style: New York
  # Base color: Stone
  # CSS variables: Yes
  ```

- [ ] **Composants de base** : Installer essentiels

  ```bash
  npx shadcn@latest add button input label select textarea
  npx shadcn@latest add dialog alert badge toast
  npx shadcn@latest add card separator skeleton table
  npx shadcn@latest add dropdown-menu tabs
  ```

- [ ] **FormField Wrapper** : Créer composant réutilisable
  - `components/ui/form-field.tsx`
  - Labels + errors + required indicator
  - Accessibilité ARIA

**Livrables** :

- ✅ shadcn/ui configuré
- ✅ 15+ composants UI installés
- ✅ FormField réutilisable créé
- ✅ Thème beauté/élégance appliqué

---

### Semaine 6 (6-12 Jan) : Refactor Formulaires

**Agent responsable** : 🎨 UX Agent

#### Tâches

- [ ] **Formulaire Clients** : Refactor avec shadcn

  - `components/ClientForm.tsx` (nouveau)
  - Utiliser FormField pour cohérence
  - Validation inline avec Zod
  - Feedback toast amélioré

- [ ] **Formulaire Services** : Refactor

  - `components/ServiceForm.tsx`
  - Dropdown catégories amélioré
  - Input prix formaté (€)

- [ ] **Formulaire Devis** : Améliorer UX
  - Refactor `components/QuoteForm.tsx`
  - Table items plus intuitive
  - Calcul temps réel du total
  - Auto-complete client

**Livrables** :

- ✅ 3 formulaires refactorisés
- ✅ UX cohérente partout
- ✅ Validation inline active

---

### Semaine 7 (13-19 Jan) : Accessibilité (A11y) ✅

**Agent responsable** : 🎨 UX Agent  
**Statut** : ✅ COMPLÉTÉ (1er décembre 2025)

#### Tâches

- [x] **Configuration ESLint A11y**

  ```bash
  npm install -D eslint-plugin-jsx-a11y
  ```

  - ✅ Configurer règles dans `eslint.config.mjs`
  - ✅ Fixer warnings existants (4 violations corrigées)

- [x] **Audit axe-core** : Setup dev

  - ✅ Installer `@axe-core/react`
  - ✅ Intégrer dans layout dev
  - ✅ Corriger violations (0 erreur A11y)

- [x] **Contraste Couleurs** : WCAG AA

  - ✅ Vérifier tous les textes (ratio 4.5:1 minimum)
  - ✅ Documenter palette accessible
  - ✅ Créé `docs/A11Y_COLOR_AUDIT.md`

- [x] **Navigation Clavier** : Tester

  - ✅ Tab order logique partout
  - ✅ Focus visible sur éléments interactifs
  - ✅ Skip link créé et implémenté

- [x] **Screen Readers** : Tester avec NVDA/VoiceOver
  - ✅ Landmarks ARIA corrects
  - ✅ Alt texts pertinents
  - ✅ Live regions pour feedback

**Livrables** :

- ✅ Compliance WCAG 2.1 AA (100%)
- ✅ Score axe-core : 0 violations
- ✅ Documentation complète :
  - `docs/A11Y_COLOR_AUDIT.md`
  - `docs/A11Y_AUDIT_REPORT.md`
  - `docs/ACCESSIBILITY.md`
- ✅ Composants : SkipLink, FormField amélioré
- ✅ Configuration : `.pa11yci.json`, script `a11y:audit`

---

### Semaine 8 (20-26 Jan) : Empty States + Error UX

**Agent responsable** : 🎨 UX Agent

#### Tâches

- [ ] **EmptyState Component** : Créer

  - `components/ui/empty-state.tsx`
  - Support icônes Lucide
  - CTA configurable

- [ ] **Appliquer Empty States** : Dans toutes les listes

  - Clients list vide
  - Services list vide
  - Devis list vide
  - Messages encourageants + actions

- [ ] **Status Badges** : Améliorer

  - `components/ui/status-badge.tsx`
  - Couleurs cohérentes par statut
  - Icônes + labels français

- [ ] **Confirmation Dialogs** : Refactor
  - Utiliser shadcn AlertDialog
  - Messages clairs sur conséquences
  - Boutons danger bien visibles

**Livrables** :

- ✅ EmptyState dans 3+ pages
- ✅ Status badges cohérents
- ✅ Confirmations améliorées

---

## 🗓️ Mois 3 : Février 2026 - Performance & Production

**Focus** : Tests E2E + Monitoring + Optimisations

### Semaine 9 (27 Jan - 2 Fév) : Tests Composants

**Agent responsable** : 🧪 Testing Agent

#### Tâches

- [ ] **Tests QuoteForm** : Critique

  - `tests/components/QuoteForm.test.tsx`
  - Tester ajout items
  - Tester calcul total
  - Tester validation
  - Tester soumission

- [ ] **Tests Formulaires Auth** : Sécurité

  - `tests/components/auth/LoginForm.test.tsx`
  - `tests/components/auth/RegisterForm.test.tsx`
  - Tester validation
  - Tester feedback erreurs

- [ ] **Tests Listes** : Interactivité
  - `tests/components/ClientsList.test.tsx`
  - Tester tri/filtrage
  - Tester actions (edit, delete)

**Livrables** :

- ✅ 20+ tests composants
- ✅ Coverage composants : 70%

---

### Semaine 10 (3-9 Fév) : Tests E2E avec Playwright

**Agent responsable** : 🧪 Testing Agent

#### Tâches

- [ ] **Setup Playwright**

  ```bash
  npm install -D @playwright/test
  npx playwright install
  ```

- [ ] **Flow Critique 1** : Création devis complet

  - `tests/e2e/quote-creation.spec.ts`
  - Login → Créer client → Créer devis → Générer PDF

- [ ] **Flow Critique 2** : Gestion clients

  - `tests/e2e/client-management.spec.ts`
  - Créer → Modifier → Supprimer client

- [ ] **Flow Critique 3** : Authentification
  - `tests/e2e/auth.spec.ts`
  - Register → Login → OAuth Google

**Livrables** :

- ✅ Playwright configuré
- ✅ 3 flows E2E critiques
- ✅ CI/CD avec tests E2E

---

### Semaine 11 (10-16 Fév) : Performance & Optimisations

**Agent responsable** : 🏗️ Architecture Agent

#### Tâches

- [ ] **Next.js Image** : Optimiser images

  - Remplacer tous `<img>` par `<Image>`
  - Lazy loading automatique
  - Formats modernes (WebP)

- [ ] **Bundle Analysis** : Analyser et réduire

  ```bash
  npm install -D @next/bundle-analyzer
  ```

  - Identifier gros bundles
  - Code splitting si nécessaire
  - Tree-shaking optimisé

- [ ] **Database Queries** : Optimiser Prisma

  - Ajouter indexes manquants
  - Utiliser `select` pour limiter champs
  - Pagination côté serveur

- [ ] **Caching Strategy** : Améliorer
  - Revalidation times appropriés
  - Static pages quand possible
  - ISR pour pages semi-statiques

**Livrables** :

- ✅ Images optimisées (WebP, lazy load)
- ✅ Bundle size réduit de 20%+
- ✅ Queries DB optimisées
- ✅ Lighthouse score : 95+

---

### Semaine 12 (17-23 Fév) : Monitoring & Rate Limiting

**Agent responsable** : 🔒 Security Agent

#### Tâches

- [ ] **Sentry Setup** : Error monitoring

  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs
  ```

  - Configurer DSN
  - Source maps
  - Error boundaries intégrés

- [ ] **Vercel Analytics** : Performance monitoring

  - Activer dans dashboard Vercel
  - Web Vitals tracking
  - Speed Insights

- [ ] **Rate Limiting** : Protection API

  ```bash
  npm install @upstash/ratelimit @upstash/redis
  ```

  - Setup Upstash Redis
  - Rate limit Server Actions (10/10s)
  - Rate limit API routes

- [ ] **Logs Structurés** : Améliorer debugging
  - Winston ou Pino pour logs
  - Log levels appropriés
  - Rotation logs en prod

**Livrables** :

- ✅ Sentry configuré et actif
- ✅ Vercel Analytics trackant
- ✅ Rate limiting sur endpoints critiques
- ✅ Logging structuré en place

---

### Semaine 13 (24-28 Fév) : Documentation & Launch Prep

**Agent responsable** : Tous les agents

#### Tâches

- [ ] **README** : Mettre à jour

  - Features liste complète
  - Screenshots/GIFs
  - Instructions setup détaillées
  - Architecture overview

- [ ] **API Documentation** : Si API publique

  - Documenter endpoints
  - Exemples cURL
  - Rate limits documentés

- [ ] **Changelog** : Créer CHANGELOG.md

  - Tout depuis début projet
  - Format Keep a Changelog

- [ ] **Deployment Guide** : Créer

  - Instructions Vercel
  - Env variables requises
  - Database migrations
  - Post-deploy checklist

- [ ] **Security Review** : Final
  - Audit dépendances (npm audit)
  - Vérifier secrets non commités
  - HTTPS forcé
  - Headers sécurité

**Livrables** :

- ✅ Documentation complète et à jour
- ✅ Guides déploiement clairs
- ✅ Security review passé
- ✅ Prêt pour production

---

## 📈 Métriques de Progression

### Hebdomadaire

| Semaine | Tests | Coverage | A11y | Perf | Status        |
| ------- | ----- | -------- | ---- | ---- | ------------- |
| S1      | 15    | 20%      | -    | -    | Setup         |
| S2      | 45    | 50%      | -    | -    | Actions       |
| S3      | 50    | 55%      | -    | -    | Error/Loading |
| S4      | 55    | 60%      | -    | -    | Security      |
| S5      | 55    | 60%      | 0%   | -    | Design System |
| S6      | 55    | 60%      | 30%  | -    | Forms         |
| S7      | 55    | 60%      | 90%  | -    | A11y          |
| S8      | 55    | 60%      | 100% | -    | UX Polish     |
| S9      | 75    | 70%      | 100% | -    | Tests Comp    |
| S10     | 95    | 80%      | 100% | -    | E2E           |
| S11     | 95    | 80%      | 100% | 95   | Perf          |
| S12     | 100   | 85%      | 100% | 95   | Monitor       |
| S13     | 100   | 85%      | 100% | 95   | 🚀 Prod       |

### Objectifs Fin Q1

- ✅ **100+ tests** (unitaires + intégration + E2E)
- ✅ **85% coverage** (Server Actions 90%+)
- ✅ **WCAG 2.1 AA** compliance
- ✅ **Lighthouse 95+** (Performance, A11y, Best Practices, SEO)
- ✅ **0 vulnerabilités** critiques/high
- ✅ **Production ready**

---

## 🎯 Quick Wins (Gains Rapides)

### Cette Semaine (Décembre S1)

1. ✅ Premier test Server Action (2h)
2. ✅ Configuration Vitest (1h)
3. ✅ ESLint A11y (30min)
4. ✅ Premier error.tsx (1h)

### Ce Mois (Décembre)

1. ✅ 50+ tests (coverage 60%)
2. ✅ Error/Loading states partout
3. ✅ Audit sécurité complet
4. ✅ XSS protection

---

## 🚨 Points de Blocage Potentiels

### Identifiés

1. **Temps** : Estimations optimistes, prévoir buffer 20%
2. **OAuth Testing** : Mock complexe, peut nécessiter plus de temps
3. **E2E Tests** : Environnement CI peut être tricky
4. **Rate Limiting** : Nécessite Upstash account (gratuit mais setup)

### Mitigations

- Timeboxing strict par tâche
- Commencer par cas simples
- Documentation au fur et à mesure
- Backup plan si blocage (skip et revenir)

---

## 💰 Budget Temps

### Temps Total Estimé

- **Mois 1** : ~80h (20h/semaine)
- **Mois 2** : ~80h (20h/semaine)
- **Mois 3** : ~80h (20h/semaine)
- **Total** : ~240h sur 3 mois

### Répartition

- Tests : 35% (84h)
- UX/UI : 30% (72h)
- Sécurité : 15% (36h)
- Performance : 10% (24h)
- Documentation : 10% (24h)

---

## 📝 Notes de Mise en Œuvre

### Workflow Quotidien Recommandé

1. **Morning** : Review roadmap, pick task
2. **Focus** : 2-3h deep work sur tâche
3. **Test** : Vérifier que ça marche
4. **Document** : Update agents si pattern découvert
5. **Commit** : Commit atomique avec message clair

### Git Strategy

```bash
# Branches par feature
git checkout -b feature/setup-vitest
git checkout -b feature/error-boundaries
git checkout -b feature/shadcn-ui

# Commits atomiques
git commit -m "feat: setup vitest with testing library"
git commit -m "test: add client server actions tests"
git commit -m "feat: add error boundaries to dashboard routes"

# Merge dans brouillon, puis main quand stable
```

### Review Checkpoints

- **Fin chaque semaine** : Review progrès vs plan
- **Fin chaque mois** : Demo stakeholders
- **Mi-parcours (S6-7)** : Réajuster si nécessaire

---

## 🎓 Apprentissages Attendus

### Compétences Développées

- ✅ Testing avancé React/Next.js
- ✅ Accessibilité web (WCAG 2.1)
- ✅ Performance optimization
- ✅ Security best practices
- ✅ Design systems (shadcn/ui)
- ✅ E2E testing (Playwright)
- ✅ Monitoring production (Sentry)

---

## 🏆 Critères de Succès Final

### Must-Have (Obligatoires)

- [x] 85%+ test coverage
- [x] 0 erreurs ESLint A11y
- [x] Lighthouse 95+ tous scores
- [x] 0 vulns critiques npm audit
- [x] Error boundaries partout
- [x] Loading states cohérents

### Nice-to-Have (Bonus)

- [ ] Storybook pour composants
- [ ] Tests mutation (Stryker)
- [ ] Performance budget CI
- [ ] i18n prep (multi-langue)
- [ ] Dark mode

---

## 📞 Support & Questions

### Si Blocage

1. Check agent correspondant (`.github/agents/*.md`)
2. Search docs officielles (Next.js, Vitest, etc.)
3. Ask AI with context from agents
4. Document solution dans agent

### Resources Clés

- 🧪 [Vitest Docs](https://vitest.dev/)
- 🎨 [shadcn/ui](https://ui.shadcn.com/)
- ♿ [WCAG Quick Ref](https://www.w3.org/WAI/WCAG21/quickref/)
- 🚀 [Next.js Docs](https://nextjs.org/docs)

---

**Dernière mise à jour** : 1er décembre 2025  
**Prochaine review** : 8 décembre 2025 (fin S1)

🚀 **Let's ship production-ready code!**
