# @ai-store/prisma-db

Prisma database client and schema for the AI Store project.

## Overview

This package contains the Prisma schema, migrations, seed data, and generated Prisma Client for the AI Store database.

## Scripts

- `pnpm generate` - Generate Prisma Client
- `pnpm migrate:dev` - Run migrations in development
- `pnpm migrate:deploy` - Run migrations in production
- `pnpm migrate:reset` - Reset the database
- `pnpm migrate:status` - Check migration status
- `pnpm seed` - Seed the database with test data
- `pnpm studio` - Open Prisma Studio

## Usage

Import the Prisma Client in your application:

```typescript
import { PrismaClient, Prisma } from '@ai-store/prisma-db';

const prisma = new PrismaClient();

// Example: Query models
const models = await prisma.aIModel.findMany();

// Example: Use Decimal type
const price = new Prisma.Decimal(10.50);
```

### Working with Decimal Values

In Prisma 7, the `Decimal` type is accessed through the `Prisma` namespace:

```typescript
import { Prisma } from '@ai-store/prisma-db';

// Create a Decimal value
const value = new Prisma.Decimal(100);

// Type annotation
function processPrice(price: Prisma.Decimal | number) {
  // Your logic here
}
```

## Prisma Version

This package uses Prisma 7.2.0 (latest stable version).

### Breaking Changes from Prisma 6 to 7

- The `url` property in the datasource is no longer in the schema file
- Connection URLs are now managed via `prisma.config.ts` using `DATABASE_URL`
- The `DATABASE_URL` environment variable is still used for connections

## Database Schema

The schema includes models for:
- AIModel - AI models with their versions and capabilities
- AIProvider - AI model providers
- ModelPricing - Pricing information for models
- Benchmark - Benchmark results for models
- Fields - Capability taxonomy

## Migrations

Migrations are stored in `prisma/migrations/` and managed by Prisma Migrate.
