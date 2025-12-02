#!/usr/bin/env tsx
/**
 * Script de génération du template .env.local
 * Usage: npm run env:template
 */

import { generateEnvTemplate } from "../lib/env";

console.log(generateEnvTemplate());
