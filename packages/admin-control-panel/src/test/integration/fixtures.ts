import { randomUUID } from 'crypto';
import type { PrismaClient } from '@ai-store/prisma-db';

export type CreatedIds = {
  fields: number[];
  providers: number[];
  pricing: number[];
  models: number[];
  benchmarks: number[];
};

export const createTracker = (): CreatedIds => ({
  fields: [],
  providers: [],
  pricing: [],
  models: [],
  benchmarks: [],
});

export async function createBaseFixture(prisma: PrismaClient, ids: CreatedIds) {
  const suffix = randomUUID().slice(0, 8);

  const field = await prisma.fields.create({ data: { name: `base-field-${suffix}` } });
  const provider = await prisma.aIProvider.create({
    data: { name: `base-provider-${suffix}`, country: 'US' },
  });
  const pricing = await prisma.modelPricing.create({
    data: {
      name: `base-pricing-${suffix}`,
      inputPricePerMillion: 1.5,
      outputPricePerMillion: 2.5,
      currency: 'USD',
      unit: 'per_1M_tokens',
      effectiveAt: new Date(),
      cachedPricePerMillion: null,
      trainingPricePerMillion: null,
      normalizedPerMillion: null,
    },
  });

  ids.fields.push(field.id);
  ids.providers.push(provider.id);
  ids.pricing.push(pricing.id);

  return {
    fieldId: field.id,
    providerName: provider.name,
    pricingId: pricing.id,
  };
}

export async function cleanupCreated(prisma: PrismaClient, ids: CreatedIds) {
  if (ids.benchmarks.length) {
    await prisma.benchmark.deleteMany({ where: { id: { in: ids.benchmarks } } });
  }
  if (ids.models.length) {
    await prisma.aIModel.deleteMany({ where: { id: { in: ids.models } } });
  }
  if (ids.pricing.length) {
    await prisma.modelPricing.deleteMany({ where: { id: { in: ids.pricing } } });
  }
  if (ids.providers.length) {
    await prisma.aIProvider.deleteMany({ where: { id: { in: ids.providers } } });
  }
  if (ids.fields.length) {
    await prisma.fields.deleteMany({ where: { id: { in: ids.fields } } });
  }
}
