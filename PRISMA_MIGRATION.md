# Prisma Migration Guide - Version 6.19 to 7.2.0

This document describes the migration from Prisma 6.19 to Prisma 7.2.0 and the restructuring of the database package.

## Overview of Changes

### 1. Package Structure
- **Before**: Prisma schema was located in `api/prisma/`
- **After**: Prisma is now a separate package at `packages/prisma-db/`

### 2. Version Upgrade
- **Before**: Prisma 6.19.0
- **After**: Prisma 7.2.0 (latest stable)

### 3. Breaking Changes in Prisma 7

#### Database URL Configuration
- **Before (Prisma 6)**: The `url` was defined in `schema.prisma`
  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  ```

- **After (Prisma 7)**: The `url` is removed from schema and managed in `prisma.config.ts`
  ```prisma
  datasource db {
    provider = "postgresql"
  }
  ```

  And in `prisma.config.ts` (root of packages/prisma-db):
  ```ts
  import 'dotenv/config';
  import { defineConfig } from 'prisma/config';

  export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: { path: 'prisma/migrations', seed: 'tsx prisma/seed.ts' },
    datasource: {
      url: process.env.DATABASE_URL ?? '',
    },
  });
  ```

#### Decimal Type Usage
- **Before**: `Decimal` was imported from `@prisma/client/runtime/library`
  ```typescript
  import { Decimal } from "@prisma/client/runtime/library";
  const value = new Decimal(10);
  ```

- **After**: `Decimal` is accessed through the `Prisma` namespace
  ```typescript
  import { Prisma } from "@prisma/client";
  const value = new Prisma.Decimal(10);
  ```

## Migration Steps

### Step 1: Create New Package
Created `packages/prisma-db/` with:
- `package.json` - Package configuration with Prisma 7.2.0
- `tsconfig.json` - TypeScript configuration
- `src/index.ts` - Export file for PrismaClient
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Seed data
- `prisma/migrations/` - Migration history
- `prisma.config.ts` - Prisma CLI configuration (datasource URL, migrations path, seed)

### Step 2: Update Workspace Configuration
Updated `pnpm-workspace.yaml`:
```yaml
packages:
  - 'api'
  - 'web-frontend'
  - 'packages/*'
```

### Step 3: Update Dependencies
- Removed Prisma dependencies from `api/package.json`
- Added `@ai-store/prisma-db: "workspace:*"` to API dependencies

### Step 4: Update Root Scripts
Updated `package.json` scripts to use the new package:
```json
{
  "prisma:generate": "pnpm --filter @ai-store/prisma-db generate",
  "prisma:migrate:dev": "pnpm --filter @ai-store/prisma-db migrate:dev",
  "prisma:migrate:deploy": "pnpm --filter @ai-store/prisma-db migrate:deploy",
  "prisma:studio": "pnpm --filter @ai-store/prisma-db studio",
  "seed:api": "pnpm --filter @ai-store/prisma-db seed"
}
```

### Step 5: Update Imports
Updated all API service imports:
```typescript
// Before
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// After
import { PrismaClient, Prisma } from "@ai-store/prisma-db";
// Use Prisma.Decimal instead of Decimal
```

### Step 6: Update Decimal Usage
Replaced all `new Decimal(...)` with `new Prisma.Decimal(...)`
Updated type annotations from `Decimal` to `Prisma.Decimal`

## Files Modified

### New Files
- `packages/prisma-db/package.json`
- `packages/prisma-db/tsconfig.json`
- `packages/prisma-db/src/index.ts`
- `packages/prisma-db/prisma.config.ts`
- `packages/prisma-db/prisma/schema.prisma`
- `packages/prisma-db/prisma/seed.ts`
- `packages/prisma-db/README.md`

### Modified Files
- `pnpm-workspace.yaml`
- `package.json` (root)
- `api/package.json`
- `api/src/pricing/priceRange.ts`
- `api/src/pricing/similarPrices.ts`
- `api/src/suggestions/suggestionsService.ts`
- `api/src/capability-matching/capabilityMatchingService.ts`
- `api/src/model-catalog/fields.ts`
- `api/src/model-catalog/model.ts`
- `api/src/model-catalog/provider.ts`
- `api/src/benchmarks/benchmarksService.ts`

## Running Commands

### Generate Prisma Client
```bash
pnpm prisma:generate
# or
pnpm --filter @ai-store/prisma-db generate
```

### Run Migrations (Development)
```bash
pnpm prisma:migrate:dev
# or
pnpm --filter @ai-store/prisma-db migrate:dev
```

### Run Migrations (Production)
```bash
pnpm prisma:migrate:deploy
# or
pnpm --filter @ai-store/prisma-db migrate:deploy
```

### Seed Database
```bash
pnpm seed:api
# or
pnpm --filter @ai-store/prisma-db seed
```

### Open Prisma Studio
```bash
pnpm prisma:studio
# or
pnpm --filter @ai-store/prisma-db studio
```

## Environment Variables

The `DATABASE_URL` environment variable is still used and should be set:
```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

## Benefits of This Migration

1. **Separation of Concerns**: Database logic is now in its own package
2. **Reusability**: The prisma-db package can be imported by multiple packages
3. **Latest Features**: Using Prisma 7 with latest improvements and bug fixes
4. **Better Type Safety**: Improved TypeScript types in Prisma 7
5. **Consistent Versioning**: Single source of truth for Prisma version

## Troubleshooting

### Issue: "Cannot find module '@ai-store/prisma-db'"
**Solution**: Run `pnpm install` at the root to link workspace packages

### Issue: "Prisma Client has not been generated"
**Solution**: Run `pnpm prisma:generate`

### Issue: Migration errors
**Solution**: Ensure `prisma.config.ts` resolves `DATABASE_URL` (or set `DATABASE_URL` before running Prisma commands)

## References

- [Prisma 7 Release Notes](https://github.com/prisma/prisma/releases/tag/7.0.0)
- [Prisma 7 Migration Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
