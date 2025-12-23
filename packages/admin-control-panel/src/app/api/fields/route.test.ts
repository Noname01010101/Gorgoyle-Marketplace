import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/fields/route';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    fields: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('Fields API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/fields', () => {
    it('returns paginated fields', async () => {
      const mockFields = [
        { id: 1, name: 'Field 1', _count: { aiModels: 5 } },
        { id: 2, name: 'Field 2', _count: { aiModels: 3 } },
      ];

      const { prisma } = await import('@/lib/prisma');
      vi.mocked(prisma.fields.findMany).mockResolvedValue(mockFields as any);
      vi.mocked(prisma.fields.count).mockResolvedValue(2);

      const request = new NextRequest('http://localhost:3001/api/fields?page=1&limit=10');
      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data.items).toEqual(mockFields);
      expect(data.data.total).toBe(2);
    });
  });

  describe('POST /api/fields', () => {
    it('creates a new field', async () => {
      const newField = { id: 1, name: 'Test Field' };
      const { prisma } = await import('@/lib/prisma');
      vi.mocked(prisma.fields.create).mockResolvedValue(newField as any);

      const request = new NextRequest('http://localhost:3001/api/fields', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test Field' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data).toEqual(newField);
    });

    it('returns error for invalid data', async () => {
      const request = new NextRequest('http://localhost:3001/api/fields', {
        method: 'POST',
        body: JSON.stringify({ name: '' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });
  });
});
