import { PrismaClient } from '@ai-store/prisma-db';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Prevent multiple Prisma Client instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
  adapter: PrismaPg | undefined;
};

const datasourceUrl = process.env.DATABASE_URL;

if (!datasourceUrl) {
  throw new Error(
    'DATABASE_URL is not set; please configure it in packages/admin-control-panel/.env'
  );
}

const pool = globalForPrisma.pool ?? new Pool({ connectionString: datasourceUrl });
const adapter = globalForPrisma.adapter ?? new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
  globalForPrisma.adapter = adapter;
}
