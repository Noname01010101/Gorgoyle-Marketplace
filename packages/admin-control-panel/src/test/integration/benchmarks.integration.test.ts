import { beforeAll, afterAll, it, expect } from 'vitest';
import type { AIModel, Benchmark, PrismaClient } from '@ai-store/prisma-db';
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

type BenchmarkWithModel = Benchmark & { model: AIModel };

let prisma: PrismaClient;
let benchmarksApi: typeof import('../../app/api/benchmarks/route');
let benchmarkDetailApi: typeof import('../../app/api/benchmarks/[id]/route');
let baseFieldId: number;
let baseProviderName: string;
let basePricingId: number;

describeIfDb('Benchmarks API integration', () => {
  beforeAll(async () => {
    prisma = await getPrisma();
    ({
      fieldId: baseFieldId,
      providerName: baseProviderName,
      pricingId: basePricingId,
    } = await createBaseFixture(prisma, ids));
    benchmarksApi = await import('@/app/api/benchmarks/route');
    benchmarkDetailApi = await import('@/app/api/benchmarks/[id]/route');
  });

  afterAll(async () => {
    await cleanupCreated(prisma, ids);
    await prisma.$disconnect();
  });

  it('creates, lists, updates, and deletes benchmarks', async () => {
    const model = await prisma.aIModel.create({
      data: {
        name: 'integration-bench-model',
        version: 'v1',
        providerName: baseProviderName,
        releaseDate: new Date(),
        status: 'production',
        deprecated: false,
        capabilities: ['nlp'],
        modalities: ['text'],
        supportedFormats: ['text/plain'],
        languages: ['en'],
        metadata: { source: 'integration' },
        modelPricingId: basePricingId,
        fields: { connect: [{ id: baseFieldId }] },
      },
    });
    ids.models.push(model.id);

    const benchType = 'integration-benchmark';

    const createResponse = await benchmarksApi.POST(
      makeJsonRequest('http://localhost:3001/api/benchmarks', {
        method: 'POST',
        body: JSON.stringify({
          modelId: model.id,
          type: benchType,
          score: 0.99,
          runAt: new Date().toISOString(),
          metadata: { stage: 'integration' },
        }),
      })
    );
    const created = (await createResponse.json()) as ApiResponse<BenchmarkWithModel>;
    expect(created.success).toBe(true);

    const benchmarkId = created.data.id;
    ids.benchmarks.push(benchmarkId);

    const listResponse = await benchmarksApi.GET(
      makeJsonRequest(`http://localhost:3001/api/benchmarks?modelId=${model.id}`)
    );
    const list = (await listResponse.json()) as PaginatedApiResponse<BenchmarkWithModel>;
    expect(list.success).toBe(true);
    expect(list.data.items.some((benchmark) => benchmark.id === benchmarkId)).toBe(true);

    const detailResponse = await benchmarkDetailApi.GET(
      makeJsonRequest(`http://localhost:3001/api/benchmarks/${benchmarkId}`),
      paramsForId(benchmarkId)
    );
    const detail = (await detailResponse.json()) as ApiResponse<BenchmarkWithModel>;
    expect(detail.success).toBe(true);
    expect(detail.data.modelId).toBe(model.id);

    const updateResponse = await benchmarkDetailApi.PUT(
      makeJsonRequest(`http://localhost:3001/api/benchmarks/${benchmarkId}`, {
        method: 'PUT',
        body: JSON.stringify({
          modelId: model.id,
          type: benchType,
          score: 0.75,
          runAt: new Date().toISOString(),
          metadata: { stage: 'integration', note: 'updated' },
        }),
      }),
      paramsForId(benchmarkId)
    );
    const updated = (await updateResponse.json()) as ApiResponse<BenchmarkWithModel>;
    expect(updated.success).toBe(true);
    expect(updated.data.score).toBe(0.75);

    await benchmarkDetailApi.DELETE(
      makeJsonRequest(`http://localhost:3001/api/benchmarks/${benchmarkId}`, { method: 'DELETE' }),
      paramsForId(benchmarkId)
    );
    const deleted = await prisma.benchmark.findUnique({ where: { id: benchmarkId } });
    expect(deleted).toBeNull();
    ids.benchmarks = ids.benchmarks.filter((id) => id !== benchmarkId);

    await prisma.aIModel.delete({ where: { id: model.id } });
    ids.models = ids.models.filter((id) => id !== model.id);
  });
});
