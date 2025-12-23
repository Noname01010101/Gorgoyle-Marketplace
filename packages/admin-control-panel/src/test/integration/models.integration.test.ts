import { beforeAll, afterAll, it, expect } from 'vitest';
import type { AIModel, AIProvider, Fields, ModelPricing, PrismaClient } from '@ai-store/prisma-db';
import {
  describeIfDb,
  makeJsonRequest,
  paramsForId,
  getPrisma,
  type ApiResponse,
  type PaginatedApiResponse,
} from './testUtils';
import { cleanupCreated, createBaseFixture, createTracker, type CreatedIds } from './fixtures';

const ids: CreatedIds = createTracker();

type ModelWithRelations = AIModel & {
  provider: AIProvider;
  modelPricings: ModelPricing;
  fields: Fields[];
};

let prisma: PrismaClient;
let modelsApi: typeof import('../../app/api/models/route');
let modelDetailApi: typeof import('../../app/api/models/[id]/route');
let baseFieldId: number;
let baseProviderName: string;
let basePricingId: number;

describeIfDb('Models API integration', () => {
  beforeAll(async () => {
    prisma = await getPrisma();
    ({
      fieldId: baseFieldId,
      providerName: baseProviderName,
      pricingId: basePricingId,
    } = await createBaseFixture(prisma, ids));
    modelsApi = await import('@/app/api/models/route');
    modelDetailApi = await import('@/app/api/models/[id]/route');
  });

  afterAll(async () => {
    await cleanupCreated(prisma, ids);
    await prisma.$disconnect();
  });

  it('creates, lists, updates, and deletes models', async () => {
    const modelName = 'integration-model';
    const version = 'v-integration';

    const createResponse = await modelsApi.POST(
      makeJsonRequest('http://localhost:3001/api/models', {
        method: 'POST',
        body: JSON.stringify({
          name: modelName,
          version,
          providerName: baseProviderName,
          releaseDate: new Date().toISOString(),
          status: 'production',
          deprecated: false,
          capabilities: ['nlp'],
          modalities: ['text'],
          supportedFormats: ['text/plain'],
          languages: ['en'],
          metadata: { label: 'integration' },
          modelPricingId: basePricingId,
          fieldIds: [baseFieldId],
        }),
      })
    );
    const created = (await createResponse.json()) as ApiResponse<ModelWithRelations>;
    expect(created.success).toBe(true);

    const modelId = created.data.id;
    ids.models.push(modelId);

    const listResponse = await modelsApi.GET(
      makeJsonRequest('http://localhost:3001/api/models?search=integration-model')
    );
    const list = (await listResponse.json()) as PaginatedApiResponse<ModelWithRelations>;
    expect(list.success).toBe(true);
    expect(list.data.items.some((model) => model.id === modelId)).toBe(true);

    const detailResponse = await modelDetailApi.GET(
      makeJsonRequest(`http://localhost:3001/api/models/${modelId}`),
      paramsForId(modelId)
    );
    const detail = (await detailResponse.json()) as ApiResponse<ModelWithRelations>;
    expect(detail.success).toBe(true);
    expect(detail.data.provider.name).toBe(baseProviderName);
    expect(detail.data.fields.length).toBeGreaterThan(0);

    const updateResponse = await modelDetailApi.PUT(
      makeJsonRequest(`http://localhost:3001/api/models/${modelId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: modelName,
          version,
          providerName: baseProviderName,
          releaseDate: new Date().toISOString(),
          status: 'maintenance',
          deprecated: true,
          capabilities: ['nlp', 'routing'],
          modalities: ['text'],
          supportedFormats: ['text/plain'],
          languages: ['en'],
          metadata: { label: 'integration', stage: 'maintenance' },
          modelPricingId: basePricingId,
          fieldIds: [baseFieldId],
        }),
      }),
      paramsForId(modelId)
    );
    const updated = (await updateResponse.json()) as ApiResponse<ModelWithRelations>;
    expect(updated.success).toBe(true);
    expect(updated.data.status).toBe('maintenance');
    expect(updated.data.deprecated).toBe(true);

    await modelDetailApi.DELETE(
      makeJsonRequest(`http://localhost:3001/api/models/${modelId}`, { method: 'DELETE' }),
      paramsForId(modelId)
    );
    const deleted = await prisma.aIModel.findUnique({ where: { id: modelId } });
    expect(deleted).toBeNull();
    ids.models = ids.models.filter((id) => id !== modelId);
  });
});
