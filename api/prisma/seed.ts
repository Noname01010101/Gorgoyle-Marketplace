import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Providers
  const exampleProvider = await prisma.aIProvider.upsert({
    where: { name: "ExampleAI" },
    update: {},
    create: {
      name: "ExampleAI",
      country: "US",
    },
  });

  const altProvider = await prisma.aIProvider.upsert({
    where: { name: "AltAI" },
    update: {},
    create: {
      name: "AltAI",
      country: "US",
    },
  });

  // Fields / capability taxonomy
  const nlpField = await prisma.fields.upsert({
    where: { name: "nlp" },
    update: {},
    create: { name: "nlp" },
  });

  const visionField = await prisma.fields.upsert({
    where: { name: "vision" },
    update: {},
    create: { name: "vision" },
  });

  // Pricing entries
  const gpt4Pricing = await prisma.modelPricing.upsert({
    where: { name: "gpt-4.1" },
    update: {},
    create: {
      name: "gpt-4.1",
      inputPricePerMillion: new Prisma.Decimal(10),
      outputPricePerMillion: new Prisma.Decimal(30),
      cachedPricePerMillion: null,
      trainingPricePerMillion: null,
      currency: "USD",
      unit: "per_1M_tokens",
      effectiveAt: new Date("2024-11-01T00:00:00.000Z"),
      normalizedPerMillion: new Prisma.Decimal(10),
    },
  });

  const economyPricing = await prisma.modelPricing.upsert({
    where: { name: "gpt-4.1-economy" },
    update: {},
    create: {
      name: "gpt-4.1-economy",
      inputPricePerMillion: new Prisma.Decimal(5),
      outputPricePerMillion: new Prisma.Decimal(15),
      cachedPricePerMillion: null,
      trainingPricePerMillion: null,
      currency: "USD",
      unit: "per_1M_tokens",
      effectiveAt: new Date("2024-11-01T00:00:00.000Z"),
      normalizedPerMillion: new Prisma.Decimal(5),
    },
  });

  // Models
  const gpt4Model = await prisma.aIModel.upsert({
    where: { name_version: { name: "gpt-4.1", version: "2024-11" } },
    update: {},
    create: {
      name: "gpt-4.1",
      version: "2024-11",
      providerName: exampleProvider.name,
      releaseDate: new Date("2024-11-01T00:00:00.000Z"),
      status: "production",
      deprecated: false,
      capabilities: ["nlp", "reasoning", "code"],
      modalities: ["text", "image"],
      supportedFormats: ["text/plain", "image/png"],
      languages: ["en", "es"],
      metadata: { family: "gpt", contextWindowTokens: 128000 },
      modelPricingId: gpt4Pricing.id,
      fields: {
        connect: [{ name: nlpField.name }, { name: visionField.name }],
      },
    },
  });

  const economyModel = await prisma.aIModel.upsert({
    where: { name_version: { name: "gpt-4.1-economy", version: "2024-11" } },
    update: {},
    create: {
      name: "gpt-4.1-economy",
      version: "2024-11",
      providerName: altProvider.name,
      releaseDate: new Date("2024-11-01T00:00:00.000Z"),
      status: "production",
      deprecated: false,
      capabilities: ["nlp", "summarization"],
      modalities: ["text"],
      supportedFormats: ["text/plain"],
      languages: ["en"],
      metadata: { family: "gpt", contextWindowTokens: 64000 },
      modelPricingId: economyPricing.id,
      fields: {
        connect: [{ name: nlpField.name }],
      },
    },
  });

  // Benchmarks
  await prisma.benchmark.createMany({
    data: [
      {
        modelId: gpt4Model.id,
        type: "mmlu-2024",
        score: 86.4,
        runAt: new Date("2024-11-15T00:00:00.000Z"),
        metadata: { dataset: "MMLU", split: "test" },
      },
      {
        modelId: economyModel.id,
        type: "mmlu-2024",
        score: 80.1,
        runAt: new Date("2024-11-15T00:00:00.000Z"),
        metadata: { dataset: "MMLU", split: "test" },
      },
    ],
  });
}

async function run() {
  try {
    await main();
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
