#!/usr/bin/env tsx
/**
 * Script de vérification des variables d'environnement
 * Usage: npm run env:check
 */

import { validateEnv, logEnvSummary } from "../lib/env";

try {
  console.log("🔍 Vérification des variables d'environnement...\n");
  validateEnv();
  console.log("✅ Configuration valide !\n");
  logEnvSummary();
  process.exit(0);
} catch (error) {
  console.error("\n❌ Erreur de configuration");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
}
