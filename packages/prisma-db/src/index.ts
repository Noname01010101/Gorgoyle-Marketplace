// Re-export Prisma Client and all types
export { PrismaClient } from '@prisma/client';
export * from '@prisma/client';

// For convenience, also export Prisma namespace explicitly
import { Prisma } from '@prisma/client';
export { Prisma };

// Decimal is available as Prisma.Decimal from the Prisma namespace
export type Decimal = Prisma.Decimal;
