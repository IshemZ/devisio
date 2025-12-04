# 📊 Configuration Google Analytics

Guide complet pour intégrer Google Analytics 4 à Solkant.

---

## 📋 Prérequis

1. Compte Google
2. Accès à [Google Analytics](https://analytics.google.com)
3. Site déployé en production (recommandé)

---

## 🚀 Étapes de Configuration

### 1. Créer une Propriété Google Analytics

1. Allez sur [Google Analytics](https://analytics.google.com)
2. Cliquez sur **Admin** (icône engrenage en bas à gauche)
3. Dans la colonne **Compte**, cliquez sur **Créer un compte** (si besoin)
4. Dans la colonne **Propriété**, cliquez sur **Créer une propriété**
5. Configurez votre propriété :
   - **Nom de la propriété** : `Solkant`
   - **Fuseau horaire** : `France (GMT+1)`
   - **Devise** : `Euro (€)`
6. Cliquez sur **Suivant**

### 2. Configurer les Détails de l'Entreprise

1. **Secteur d'activité** : Services professionnels
2. **Taille de l'entreprise** : Selon votre cas
3. **Objectifs** : Cochez les options pertinentes
4. Cliquez sur **Créer**
5. Acceptez les conditions d'utilisation

### 3. Configurer un Flux de Données Web

1. Sélectionnez **Web** comme plateforme
2. Configurez le flux :
   - **URL du site Web** : `https://votre-domaine.com`
   - **Nom du flux** : `Solkant Production`
3. Activez les **mesures améliorées** (recommandé)
4. Cliquez sur **Créer un flux**

### 4. Récupérer l'ID de Mesure

1. Une fois le flux créé, vous verrez l'**ID de mesure**
2. Format : `G-XXXXXXXXXX` (ex: `G-ABC123XYZ`)
3. **Copiez cet ID** - vous en aurez besoin pour la configuration

---

## 🔧 Configuration dans Solkant

### 1. Variables d'Environnement

#### En Production (Vercel)

1. Allez sur votre projet Vercel
2. **Settings** → **Environment Variables**
3. Ajoutez une nouvelle variable :
   - **Key** : `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value** : `G-XXXXXXXXXX` (votre ID de mesure)
   - **Environments** : Cochez **Production** uniquement
4. Cliquez sur **Save**
5. Redéployez votre application

#### En Développement Local

Ajoutez à votre fichier `.env.local` :

```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

**Note** : Il est recommandé de ne PAS activer GA en développement pour éviter de polluer vos statistiques avec du trafic de test.

### 2. Vérification de l'Installation

L'intégration est déjà complète dans le code :

- ✅ Package `@next/third-parties` installé
- ✅ Composant `GoogleAnalytics` créé dans `components/analytics/`
- ✅ Intégré dans `app/layout.tsx`
- ✅ Validation ajoutée dans `lib/env.ts`

Le composant se chargera automatiquement si `NEXT_PUBLIC_GA_MEASUREMENT_ID` est défini.

---

## ✅ Tester l'Installation

### 1. Test en Temps Réel

1. Déployez votre site avec la variable d'environnement configurée
2. Allez sur [Google Analytics](https://analytics.google.com)
3. Dans votre propriété, cliquez sur **Rapports** → **Temps réel**
4. Ouvrez votre site dans un nouvel onglet
5. Vous devriez voir votre visite apparaître en temps réel

### 2. Vérification Technique

Ouvrez la console du navigateur sur votre site et vérifiez :

```javascript
// Vérifier que le script GA est chargé
window.gtag !== undefined; // Devrait être true

// Vérifier les appels GA dans l'onglet Network
// Filtrer par "google-analytics.com" ou "gtag"
```

### 3. Extensions Navigateur

Installez des extensions pour débugger GA :

- **Google Tag Assistant** (Chrome)
- **GA Debug** (Chrome/Firefox)

---

## 📊 Événements Suivis Automatiquement

Avec les **mesures améliorées** activées, GA4 suit automatiquement :

- ✅ **Pages vues** : Chaque navigation
- ✅ **Scrolling** : Pourcentage de scroll (25%, 50%, 75%, 90%)
- ✅ **Clics sortants** : Liens vers d'autres domaines
- ✅ **Recherche sur site** : Si vous avez un champ de recherche
- ✅ **Téléchargements** : Clics sur fichiers PDF, etc.
- ✅ **Engagement vidéo** : Si vous avez des vidéos

---

## 🎯 Événements Personnalisés (Optionnel)

Pour suivre des actions spécifiques (ex: création de devis, envoi de formulaire), vous pouvez ajouter des événements personnalisés.

### Exemple : Suivre la Création d'un Devis

```typescript
// Dans app/actions/quotes.ts
export async function createQuote(input: CreateQuoteInput) {
  // ... logique existante ...

  // Envoyer événement à GA (côté client uniquement)
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "quote_created", {
      quote_id: quote.id,
      total_amount: quote.totalPrice,
    });
  }

  return { data: quote };
}
```

### Déclarer le Type `gtag`

Créez `types/gtag.d.ts` :

```typescript
interface Window {
  gtag?: (
    command: "config" | "event" | "set",
    targetId: string,
    config?: Record<string, unknown>
  ) => void;
}
```

---

## 🔒 Conformité RGPD

### Points Importants

1. **Anonymisation IP** : Google Analytics 4 anonymise automatiquement les IPs
2. **Cookie Consent** : Considérez d'ajouter un bandeau de consentement
3. **Politique de confidentialité** : Mentionnez l'utilisation de GA

### Implémentation Bandeau Cookies (Optionnel)

Pour respecter le RGPD, vous pouvez utiliser :

- **cookieyes.com** (gratuit jusqu'à 5000 pages vues/mois)
- **osano.com**
- **tarteaucitron.js** (solution française open-source)

Le composant `GoogleAnalytics` ne se charge que si la variable est définie, donc vous pouvez conditionner son chargement au consentement :

```typescript
// components/analytics/GoogleAnalytics.tsx
"use client";

import { GoogleAnalytics as GA } from "@next/third-parties/google";
import { useEffect, useState } from "react";

export function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    // Vérifier le consentement cookie
    const consent = localStorage.getItem("cookie_consent");
    setHasConsent(consent === "accepted");
  }, []);

  if (!gaId || !hasConsent) {
    return null;
  }

  return <GA gaId={gaId} />;
}
```

---

## 📈 Rapports Utiles

### Rapports de Base

1. **Temps réel** : Visiteurs actuels
2. **Acquisition** : D'où viennent vos visiteurs
3. **Engagement** : Pages les plus vues
4. **Monétisation** : (si e-commerce configuré)
5. **Rétention** : Visiteurs récurrents

### Créer un Rapport Personnalisé

1. Allez dans **Explore** (Explorer)
2. Cliquez sur **Blank** (Vide)
3. Ajoutez des dimensions et métriques :
   - **Dimension** : Page path, Source, Device category
   - **Métriques** : Users, Sessions, Engagement rate

---

## 🐛 Dépannage

### Le Trafic n'Apparaît Pas

1. ✅ Vérifier que `NEXT_PUBLIC_GA_MEASUREMENT_ID` est défini (format `G-XXX`)
2. ✅ Vérifier que le site est déployé en production
3. ✅ Attendre 24-48h pour les premiers rapports (temps réel instantané)
4. ✅ Désactiver les bloqueurs de pub (AdBlock, etc.)
5. ✅ Vérifier la console navigateur pour erreurs JS

### Script GA ne se Charge Pas

```typescript
// Vérifier dans la console
console.log(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
// Devrait afficher "G-XXXXXXXXXX"
```

### Données Incohérentes

- Attendre 24-48h pour la collecte complète
- Vérifier qu'aucun filtre n'est appliqué dans GA
- S'assurer que le fuseau horaire est correct

---

## 🔗 Ressources

- [Documentation Google Analytics 4](https://support.google.com/analytics/answer/10089681)
- [Next.js Third Parties Package](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries#google-analytics)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [RGPD et Analytics](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi)

---

**Date de création** : 4 décembre 2025  
**Dernière mise à jour** : 4 décembre 2025
