/**
 * SkipLink - Lien de navigation pour utilisateurs clavier
 *
 * Permet aux utilisateurs de clavier/screen readers de sauter
 * directement au contenu principal sans parcourir la navigation.
 *
 * Usage: Ajouter dans le layout, avant la navigation
 */

export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Aller au contenu principal
    </a>
  );
}
