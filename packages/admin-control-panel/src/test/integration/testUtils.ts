import path from 'path';
import { config } from 'dotenv';
import { Pool } from 'pg';
import { describe } from 'vitest';
import { NextRequest } from 'next/server';
import type { RequestInit as NextRequestInit } from 'next/dist/server/web/spec-extension/request';
import type { PrismaClient } from '@ai-store/prisma-db';

config({ path: path.resolve(__dirname, '../../../.env') });

async function canReachDb(): Promise<boolean> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return false;

  const pool = new Pool({ connectionString, connectionTimeoutMillis: 2000 });
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  } finally {
    await pool.end().catch(() => undefined);
  }
}

export const dbAvailable = await canReachDb();

if (!dbAvailable) {
  // eslint-disable-next-line no-console
  console.warn(
    'Skipping admin-control-panel integration tests because DATABASE_URL is missing or the database is unreachable.'
  );
}

export const describeIfDb = dbAvailable ? describe : describe.skip;

type SafeRequestInit = Omit<NextRequestInit, 'signal'> & { signal?: AbortSignal };

export const makeJsonRequest = (url: string, init?: SafeRequestInit) => {
  const { signal, headers, ...rest } = init ?? {};
  const safeInit: NextRequestInit = {
    ...rest,
    ...(signal ? { signal } : {}),
    headers: { 'content-type': 'application/json', ...(headers ?? {}) },
  };
  return new NextRequest(url, safeInit);
};

export const paramsForId = (id: number) => ({ params: Promise.resolve({ id: String(id) }) });

export async function getPrisma(): Promise<PrismaClient> {
  const { prisma } = await import('@/lib/prisma');
  return prisma as PrismaClient;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type PaginatedApiResponse<T> = ApiResponse<PaginatedResponse<T>>;
