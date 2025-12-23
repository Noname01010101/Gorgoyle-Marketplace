import { beforeAll, afterAll, it, expect } from 'vitest';
import type { Fields, PrismaClient } from '@ai-store/prisma-db';
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
let fieldsApi: typeof import('../../app/api/fields/route');
let fieldDetailApi: typeof import('../../app/api/fields/[id]/route');

describeIfDb('Fields API integration', () => {
  beforeAll(async () => {
    prisma = await getPrisma();
    fieldsApi = await import('@/app/api/fields/route');
    fieldDetailApi = await import('@/app/api/fields/[id]/route');
  });

  afterAll(async () => {
    await cleanupCreated(prisma, ids);
    await prisma.$disconnect();
  });

  it('creates, lists, updates, and deletes fields', async () => {
    const createResponse = await fieldsApi.POST(
      makeJsonRequest('http://localhost:3001/api/fields', {
        method: 'POST',
        body: JSON.stringify({ name: 'integration-field' }),
      })
    );
    const created = (await createResponse.json()) as ApiResponse<Fields>;
    expect(created.success).toBe(true);

    const fieldId = created.data.id;
    ids.fields.push(fieldId);

    const listResponse = await fieldsApi.GET(
      makeJsonRequest('http://localhost:3001/api/fields?search=integration-field&page=1&limit=5')
    );
    const list = (await listResponse.json()) as PaginatedApiResponse<Fields>;
    expect(list.success).toBe(true);
    expect(list.data.items.some((field) => field.id === fieldId)).toBe(true);

    const updatedName = 'integration-field-updated';
    const updateResponse = await fieldDetailApi.PUT(
      makeJsonRequest(`http://localhost:3001/api/fields/${fieldId}`, {
        method: 'PUT',
        body: JSON.stringify({ name: updatedName }),
      }),
      paramsForId(fieldId)
    );
    const updated = (await updateResponse.json()) as ApiResponse<Fields>;
    expect(updated.success).toBe(true);
    expect(updated.data.name).toBe(updatedName);

    await fieldDetailApi.DELETE(
      makeJsonRequest(`http://localhost:3001/api/fields/${fieldId}`, { method: 'DELETE' }),
      paramsForId(fieldId)
    );
    const deleted = await prisma.fields.findUnique({ where: { id: fieldId } });
    expect(deleted).toBeNull();
    ids.fields = ids.fields.filter((id) => id !== fieldId);
  });
});
