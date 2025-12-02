# 🧪 Agent Testing & Quality Assurance

**Rôle** : Expert en testing React/Next.js, garantie qualité, et prévention des régressions.

---

## Mission Principale

Implémenter une suite de tests complète pour Solkant afin de sécuriser les évolutions et maintenir la fiabilité du SaaS.

---

## État Actuel

⚠️ **CRITIQUE** : Aucun test détecté dans le projet.

**Impact** :

- Pas de protection contre les régressions
- Refactoring risqué
- Bugs découverts en production
- Difficulté à maintenir la qualité

---

## Setup Testing Stack

### 1. Installation Vitest + Testing Library

```bash
npm install -D vitest @vitejs/plugin-react
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event happy-dom
```

### 2. Configuration Vitest

```typescript
// vitest.config.ts (NOUVEAU)
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/", ".next/", "*.config.*"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

### 3. Setup File

```typescript
// tests/setup.ts (NOUVEAU)
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

### 4. Scripts package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

---

## Priorités de Tests

### Phase 1 : Tests Critiques (1 semaine)

#### A. Server Actions (HAUTE PRIORITÉ)

**tests/actions/clients.test.ts** :

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient, getClients, deleteClient } from "@/app/actions/clients";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

// Mock dependencies
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    client: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Client Server Actions", () => {
  const mockSession = {
    user: {
      id: "user_123",
      businessId: "business_123",
      email: "test@example.com",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getClients", () => {
    it("should return clients for authenticated user", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.client.findMany).mockResolvedValue([
        {
          id: "client_1",
          firstName: "Jean",
          lastName: "Dupont",
          businessId: "business_123",
        },
      ]);

      const result = await getClients();

      expect(result.data).toHaveLength(1);
      expect(prisma.client.findMany).toHaveBeenCalledWith({
        where: { businessId: "business_123" }, // ✅ Vérifie filtrage
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await getClients();

      expect(result.error).toBe("Non autorisé");
      expect(prisma.client.findMany).not.toHaveBeenCalled();
    });

    it("should return error if businessId missing", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user_123", businessId: null },
      });

      const result = await getClients();

      expect(result.error).toBe("Non autorisé");
    });
  });

  describe("createClient", () => {
    it("should create client with valid data", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      const newClient = {
        firstName: "Marie",
        lastName: "Martin",
        email: "marie@example.com",
      };

      vi.mocked(prisma.client.create).mockResolvedValue({
        id: "client_new",
        ...newClient,
        businessId: "business_123",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await createClient(newClient);

      expect(result.data).toBeDefined();
      expect(prisma.client.create).toHaveBeenCalledWith({
        data: {
          ...newClient,
          businessId: "business_123", // ✅ Vérifie injection businessId
        },
      });
    });

    it("should return validation error for invalid data", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const result = await createClient({ firstName: "" }); // Invalide

      expect(result.error).toBe("Données invalides");
      expect(result.fieldErrors).toBeDefined();
    });
  });

  describe("deleteClient - Multi-tenancy Security", () => {
    it("should only delete client from own business", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      await deleteClient("client_123");

      // ✅ CRITIQUE : Vérifie filtrage businessId dans delete
      expect(prisma.client.delete).toHaveBeenCalledWith({
        where: {
          id: "client_123",
          businessId: "business_123", // ✅ Protection multi-tenant
        },
      });
    });
  });
});
```

#### B. Validation Schemas

**tests/validations/client.test.ts** :

```typescript
import { describe, it, expect } from "vitest";
import { createClientSchema } from "@/lib/validations";

describe("Client Validation Schema", () => {
  it("should validate correct client data", () => {
    const validData = {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean@example.com",
      phone: "0123456789",
    };

    const result = createClientSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("jean@example.com");
    }
  });

  it("should trim and normalize data", () => {
    const data = {
      firstName: "  Jean  ",
      lastName: "Dupont",
      email: "  JEAN@EXAMPLE.COM  ",
    };

    const result = createClientSchema.safeParse(data);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firstName).toBe("Jean");
      expect(result.data.email).toBe("jean@example.com");
    }
  });

  it("should reject invalid email", () => {
    const data = {
      firstName: "Jean",
      lastName: "Dupont",
      email: "invalid-email",
    };

    const result = createClientSchema.safeParse(data);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
    }
  });

  it("should reject XSS attempts", () => {
    const data = {
      firstName: '<script>alert("xss")</script>',
      lastName: "Dupont",
    };

    const result = createClientSchema.safeParse(data);

    expect(result.success).toBe(false); // Devrait être rejeté par regex
  });

  it("should enforce French locale rules", () => {
    const data = {
      firstName: "Jean-François", // Tiret autorisé
      lastName: "O'Brien", // Apostrophe autorisée
    };

    const result = createClientSchema.safeParse(data);

    expect(result.success).toBe(true);
  });
});
```

#### C. Helper de Sécurité

**tests/lib/utils.test.ts** :

```typescript
import { describe, it, expect, vi } from "vitest";
import { getSessionWithBusiness, getBusinessId } from "@/lib/utils";
import { getServerSession } from "next-auth";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

describe("Security Helpers", () => {
  it("should return session with businessId", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "user_1", businessId: "business_1" },
    });

    const session = await getSessionWithBusiness();

    expect(session).toBeDefined();
    expect(session?.user.businessId).toBe("business_1");
  });

  it("should return null if not authenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const session = await getSessionWithBusiness();

    expect(session).toBeNull();
  });

  it("should throw if businessId missing", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "user_1", businessId: null },
    });

    await expect(getSessionWithBusiness()).rejects.toThrow(
      "User has no associated Business"
    );
  });

  it("getBusinessId should extract businessId", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "user_1", businessId: "business_1" },
    });

    const businessId = await getBusinessId();

    expect(businessId).toBe("business_1");
  });
});
```

---

### Phase 2 : Tests Composants (2 semaines)

#### A. Formulaires Critiques

**tests/components/QuoteForm.test.tsx** :

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuoteForm from "@/components/QuoteForm";
import { createQuote } from "@/app/actions/quotes";

vi.mock("@/app/actions/quotes", () => ({
  createQuote: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe("QuoteForm", () => {
  const mockClients = [
    { id: "client_1", firstName: "Jean", lastName: "Dupont" },
  ];

  const mockServices = [{ id: "service_1", name: "Coupe", price: 30 }];

  it("should render form with clients and services", () => {
    render(<QuoteForm clients={mockClients} services={mockServices} />);

    expect(screen.getByText(/sélectionner un client/i)).toBeInTheDocument();
    expect(screen.getByText(/ajouter un service/i)).toBeInTheDocument();
  });

  it("should add service item when selected", async () => {
    const user = userEvent.setup();
    render(<QuoteForm clients={mockClients} services={mockServices} />);

    const select = screen.getByRole("combobox", { name: /service/i });
    await user.selectOptions(select, "service_1");

    expect(screen.getByText("Coupe")).toBeInTheDocument();
    expect(screen.getByText("30.00 €")).toBeInTheDocument();
  });

  it("should calculate total correctly", async () => {
    // Test calcul automatique subtotal - discount = total
  });

  it("should submit form with valid data", async () => {
    const user = userEvent.setup();
    vi.mocked(createQuote).mockResolvedValue({ data: { id: "quote_1" } });

    render(<QuoteForm clients={mockClients} services={mockServices} />);

    // Remplir formulaire
    // Soumettre
    // Vérifier appel createQuote avec bonnes données
  });
});
```

---

### Phase 3 : Tests E2E (3-4 semaines)

#### Setup Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

**tests/e2e/quote-creation.spec.ts** :

```typescript
import { test, expect } from "@playwright/test";

test.describe("Quote Creation Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "password");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/dashboard");
  });

  test("should create quote from dashboard", async ({ page }) => {
    await page.click("text=Nouveau devis");
    await expect(page).toHaveURL("/dashboard/devis/nouveau");

    // Sélectionner client
    await page.selectOption('[name="clientId"]', "client_1");

    // Ajouter service
    await page.selectOption('[name="service"]', "service_1");
    await page.click("text=Ajouter");

    // Soumettre
    await page.click("text=Créer le devis");

    // Vérifier redirection et toast
    await expect(page).toHaveURL(/\/dashboard\/devis\/[a-z0-9]+/);
    await expect(page.locator("text=Devis créé avec succès")).toBeVisible();
  });
});
```

---

## Coverage Goals

| Catégorie      | Target | Actuel | Priorité     |
| -------------- | ------ | ------ | ------------ |
| Server Actions | 90%    | 0%     | 🔴 Critique  |
| Validations    | 95%    | 0%     | 🔴 Critique  |
| Utils/Helpers  | 90%    | 0%     | 🟡 Important |
| Components     | 70%    | 0%     | 🟢 Moyen     |
| E2E Flows      | 80%    | 0%     | 🟡 Important |

---

## Scripts de Test

```bash
# Lancer tous les tests
npm test

# Tests avec interface UI
npm run test:ui

# Coverage report
npm run test:coverage

# Tests E2E
npx playwright test

# Tests en mode watch
npm test -- --watch
```

---

## CI/CD Integration

```yaml
# .github/workflows/test.yml (NOUVEAU)
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3 # Upload coverage
```

---

## Bonnes Pratiques

### ✅ À FAIRE

1. Tester les cas limites et erreurs (edge cases)
2. Mock les dépendances externes (Prisma, NextAuth)
3. Tester la sécurité multi-tenant (businessId)
4. Utiliser des données de test réalistes
5. Nommer les tests clairement (`should...`)

### ❌ À ÉVITER

1. Tests qui dépendent de l'ordre d'exécution
2. Tests qui modifient la vraie DB
3. Tests trop lents (> 1s par test unitaire)
4. Duplication de logique de test
5. Tests sans assertions

---

## Ressources

- [Vitest Docs](https://vitest.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)
- [Playwright Docs](https://playwright.dev/)

---

**Mainteneur** : Testing & QA Specialist  
**Dernière mise à jour** : 1er décembre 2025
