import { beforeAll, afterAll, it, expect } from 'vitest';
import type { AIProvider, PrismaClient } from '@ai-store/prisma-db';
import {
  describeIfDb,
  makeJsonRequest,
  paramsForId,
  getPrisma,
  type ApiResponse,
  type PaginatedApiResponse,
} from './testUtils';
import { cleanupCreated, createTracker, type CreatedIds } from './fixtures';

const ids: CreatedIds = createTracker();

let prisma: PrismaClient;
let providersApi: typeof import('../../app/api/providers/route');
let providerDetailApi: typeof import('../../app/api/providers/[id]/route');

describeIfDb('Providers API integration', () => {
  beforeAll(async () => {
    prisma = await getPrisma();
    providersApi = await import('@/app/api/providers/route');
    providerDetailApi = await import('@/app/api/providers/[id]/route');
  });

  afterAll(async () => {
    await cleanupCreated(prisma, ids);
    await prisma.$disconnect();
  });

  it('creates, lists, updates, and deletes providers', async () => {
    const providerName = 'integration-provider';

    const createResponse = await providersApi.POST(
      makeJsonRequest('http://localhost:3001/api/providers', {
        method: 'POST',
        body: JSON.stringify({ name: providerName, country: 'USA' }),
      })
    );
    const created = (await createResponse.json()) as ApiResponse<AIProvider>;
    expect(created.success).toBe(true);

    const providerId = created.data.id;
    ids.providers.push(providerId);

    const listResponse = await providersApi.GET(
      makeJsonRequest('http://localhost:3001/api/providers?search=integration-provider')
    );
    const list = (await listResponse.json()) as PaginatedApiResponse<AIProvider>;
    expect(list.success).toBe(true);
    expect(list.data.items.some((provider) => provider.id === providerId)).toBe(true);

    const updateResponse = await providerDetailApi.PUT(
      makeJsonRequest(`http://localhost:3001/api/providers/${providerId}`, {
        method: 'PUT',
        body: JSON.stringify({ name: providerName, country: 'Canada' }),
      }),
      paramsForId(providerId)
    );
    const updated = (await updateResponse.json()) as ApiResponse<AIProvider>;
    expect(updated.success).toBe(true);
    expect(updated.data.country).toBe('Canada');

    await providerDetailApi.DELETE(
      makeJsonRequest(`http://localhost:3001/api/providers/${providerId}`, { method: 'DELETE' }),
      paramsForId(providerId)
    );
    const deleted = await prisma.aIProvider.findUnique({ where: { id: providerId } });
    expect(deleted).toBeNull();
    ids.providers = ids.providers.filter((id) => id !== providerId);
  });
});
