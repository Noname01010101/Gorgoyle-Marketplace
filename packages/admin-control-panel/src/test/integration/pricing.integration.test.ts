import { beforeAll, afterAll, it, expect } from 'vitest';
import type { ModelPricing, PrismaClient } from '@ai-store/prisma-db';
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
let pricingApi: typeof import('../../app/api/pricing/route');
let pricingDetailApi: typeof import('../../app/api/pricing/[id]/route');

describeIfDb('Pricing API integration', () => {
  beforeAll(async () => {
    prisma = await getPrisma();
    pricingApi = await import('@/app/api/pricing/route');
    pricingDetailApi = await import('@/app/api/pricing/[id]/route');
  });

  afterAll(async () => {
    await cleanupCreated(prisma, ids);
    await prisma.$disconnect();
  });

  it('creates, lists, updates, and deletes pricing entries', async () => {
    const pricingName = 'integration-pricing';

    const createResponse = await pricingApi.POST(
      makeJsonRequest('http://localhost:3001/api/pricing', {
        method: 'POST',
        body: JSON.stringify({
          name: pricingName,
          inputPricePerMillion: 12.5,
          outputPricePerMillion: 25.5,
          currency: 'USD',
          unit: 'per_1M_tokens',
          effectiveAt: new Date().toISOString(),
          cachedPricePerMillion: 5,
          trainingPricePerMillion: null,
          normalizedPerMillion: 12.5,
        }),
      })
    );
    const created = (await createResponse.json()) as ApiResponse<ModelPricing>;
    expect(created.success).toBe(true);

    const pricingId = created.data.id;
    ids.pricing.push(pricingId);

    const listResponse = await pricingApi.GET(
      makeJsonRequest('http://localhost:3001/api/pricing?search=integration-pricing')
    );
    const list = (await listResponse.json()) as PaginatedApiResponse<ModelPricing>;
    expect(list.success).toBe(true);
    expect(list.data.items.some((pricing) => pricing.id === pricingId)).toBe(true);

    const updateResponse = await pricingDetailApi.PUT(
      makeJsonRequest(`http://localhost:3001/api/pricing/${pricingId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: pricingName,
          inputPricePerMillion: 15,
          outputPricePerMillion: 30,
          currency: 'EUR',
          unit: 'per_1M_tokens',
          effectiveAt: new Date().toISOString(),
          cachedPricePerMillion: 6,
          trainingPricePerMillion: null,
          normalizedPerMillion: 15,
        }),
      }),
      paramsForId(pricingId)
    );
    const updated = (await updateResponse.json()) as ApiResponse<ModelPricing>;
    expect(updated.success).toBe(true);
    expect(String(updated.data.currency)).toBe('EUR');

    await pricingDetailApi.DELETE(
      makeJsonRequest(`http://localhost:3001/api/pricing/${pricingId}`, { method: 'DELETE' }),
      paramsForId(pricingId)
    );
    const deleted = await prisma.modelPricing.findUnique({ where: { id: pricingId } });
    expect(deleted).toBeNull();
    ids.pricing = ids.pricing.filter((id) => id !== pricingId);
  });
});
