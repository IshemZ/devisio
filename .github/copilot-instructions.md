# Devisio - AI Coding Agent Instructions

## Project Overview

**Devisio** is a French-language quote/estimate management SaaS for beauty salons and service businesses. Built with Next.js 16 (App Router), NextAuth v4, Prisma ORM, and PostgreSQL.

## Architecture

### Data Model Hierarchy

```
User (auth) → Business (1:1) → Clients, Services, Quotes (1:many)
Quote → QuoteItems (line items referencing Services)
```

Every authenticated user MUST have a Business record. The `businessId` is stored in JWT tokens and used for multi-tenant data isolation.

### Authentication Pattern

- **JWT Strategy**: Session stored in JWT (not database), configured in `lib/auth.ts`
- **Providers**: Credentials (email/password with bcrypt) + Google OAuth
- **Session Extension**: Custom `businessId` added via JWT/session callbacks
- **Google OAuth Flow**: Auto-creates User + Business on first login in `signIn` callback
- **Protected Routes**: Use `(dashboard)` route group with layout checking `getServerSession()`

### Server Actions Pattern

All CRUD operations use Next.js Server Actions in `app/actions/*.ts`:

1. Validate session → extract `businessId` from JWT
2. Validate input with Zod schemas from `lib/validations/`
3. Query Prisma with `businessId` filter (security-critical for multi-tenancy)
4. Call `revalidatePath()` after mutations (e.g., `/dashboard/devis`)
5. Return `{ data, error }` object structure

**Example**:

```typescript
export async function createClient(input: CreateClientInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) return { error: "Non autorisé" };

  const validation = createClientSchema.safeParse(input);
  // ... create with businessId filter
  revalidatePath("/dashboard/clients");
  return { data: client };
}
```

### Validation Architecture

- **Centralized Exports**: All schemas exported from `lib/validations/index.ts`
- **Zod v4**: Using `zod@4.1.13` - note `z.string().cuid()` for ID validation
- **French Messages**: All validation errors in French (e.g., "Le nom est requis")
- **Helper Functions**: Use `validateAction()`, `formatZodErrors()` from `lib/validations/helpers.ts`

### PDF Generation

- **Library**: `@react-pdf/renderer` for declarative PDF components
- **Pattern**: Create React-PDF component (`components/QuotePDF.tsx`) → render via API route
- **API Route**: `app/api/quotes/[id]/pdf/route.ts` uses `renderToStream()` for streaming response
- **Styling**: Inline StyleSheet objects (similar to React Native) with French locale formatting

## Development Workflows

### Database Management

```bash
# Prisma commands (always with direct connection)
npx prisma migrate dev      # Create & apply migration
npx prisma generate          # Regenerate client after schema changes
npx prisma studio            # GUI database explorer

# Required env vars: DATABASE_URL (pooler), DIRECT_URL (direct connection)
```

### Scripts

- **Fix Missing Business**: `npx tsx scripts/fix-missing-business.ts` - repairs users without Business records (common after OAuth bugs)
- **Sitemap**: Auto-generates via `next-sitemap` in `postbuild` script

### Environment Setup

Required `.env.local`:

```
DATABASE_URL=          # Neon pooled connection
DIRECT_URL=            # Neon direct connection (migrations)
NEXTAUTH_URL=          # App URL
NEXTAUTH_SECRET=       # JWT secret (generate with: openssl rand -base64 32)
GOOGLE_CLIENT_ID=      # OAuth (optional)
GOOGLE_CLIENT_SECRET=  # OAuth (optional)
```

## Code Conventions

### File Organization

- **Route Handlers**: Use `(group)` folders for layout sharing without URL segments
- **Server Actions**: One file per resource (`actions/clients.ts`, `actions/quotes.ts`)
- **Components**: Flat structure in `components/` (no deep nesting except `ui/`, `auth/`)
- **Validations**: One schema file per model in `lib/validations/` + index for exports

### TypeScript Patterns

- **Prisma Types**: Use `import type { Quote, Client } from '@prisma/client'`
- **Relations**: Define interface extending model: `interface QuoteWithRelations extends Quote { client: Client }`
- **NextAuth Types**: Extended in `types/next-auth.d.ts` to add `businessId` to Session/User/JWT

### French Locale

- **UI Text**: All user-facing strings in French
- **Status Enums**: Use English in code (`DRAFT`, `SENT`) but translate in UI
- **Date Formatting**: `toLocaleDateString('fr-FR')` for consistency
- **Currency**: Format as `{price.toFixed(2)} €` (space before €)

### Quote Number Generation

Auto-generated in format `DEVIS-{YEAR}-{SEQUENCE}` (e.g., `DEVIS-2024-001`). The `generateQuoteNumber()` function in `actions/quotes.ts` queries last quote for the year and increments.

## Critical Gotchas

1. **Business Creation**: Every User needs a Business. OAuth callback handles this, but credentials login doesn't - ensure Business exists after registration.

2. **Multi-Tenancy Security**: ALWAYS filter Prisma queries by `businessId` from session. Missing this filter = data leak between tenants.

3. **Prisma Singleton**: Import from `lib/prisma.ts`, NOT `new PrismaClient()` directly (prevents connection leaks in dev).

4. **Route Params in App Router**: `params` is a Promise in Next.js 16: `const { id } = await params`

5. **PDF Streaming**: Use `renderToStream()` not `renderToBuffer()` for better performance with large PDFs.

6. **Zod v4 Changes**: String validation methods changed (e.g., `.cuid()` vs `.uuid()`). See `lib/validations/` for patterns.

## Common Tasks

### Adding New Resource

1. Update `prisma/schema.prisma` with model + `businessId` relation
2. Run `npx prisma migrate dev --name add_resource`
3. Create Zod schema in `lib/validations/resource.ts` + export from `index.ts`
4. Create Server Actions in `app/actions/resource.ts` with session checks
5. Build UI components + route pages in `app/(dashboard)/dashboard/resource/`

### Debugging Auth Issues

- Check JWT token: Install browser extension to decode `next-auth.session-token` cookie
- Verify `businessId` in session: Log `session.user.businessId` in Server Actions
- Run fix script: `npx tsx scripts/fix-missing-business.ts` if Business missing

### Testing in Development

```bash
npm run dev              # Start dev server on :3000
npx prisma studio        # Inspect database
npm run lint             # ESLint check
```

## External Integrations

- **Neon PostgreSQL**: Serverless Postgres with connection pooling
- **NextAuth**: v4 (pre-v5) - callbacks API differs from v5
- **Tailwind CSS v4**: Note different configuration format in `postcss.config.mjs`
- **next-sitemap**: SEO sitemap generation post-build
