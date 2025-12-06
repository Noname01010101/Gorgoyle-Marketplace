import { Prisma, PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export interface SuggestionResult {
  modelId: number;
  modelName: string;
  providerName: string;
  similarityScore: number;
  costDeltaPerMillionTokens: number | null;
  benchmarkDelta: number | null;
  explanation: string;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  return [];
}

function decimalToNumber(value: Prisma.Decimal | number | null | undefined): number | null {
  if (value == null) return null;
  if (typeof value === "number") return value;
  return value.toNumber();
}

function computeJaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);

  const intersectionSize = [...setA].filter((item) => setB.has(item)).length;
  const unionSize = new Set([...a, ...b]).size;

  if (unionSize === 0) return 0;
  return intersectionSize / unionSize;
}

/**
 * SuggestionsService
 *
 * Provides closest-match alternatives based on overlap in capability
 * vectors and pricing signals. This service is read-only and uses the
 * existing catalog + pricing + benchmarks data.
 */
class SuggestionsService {
  static async getSuggestionsForModel(modelId: number): Promise<SuggestionResult[]> {
    const targetModel = await prismaClient.aIModel.findUnique({
      where: { id: modelId },
      include: {
        modelPricings: true,
        benchmarks: true,
      },
    });

    if (!targetModel) {
      throw new Error("Model not found");
    }

    const targetCapabilities = toStringArray(targetModel.capabilities as unknown);
    const targetCost = decimalToNumber(
      targetModel.modelPricings.normalizedPerMillion ?? targetModel.modelPricings.inputPricePerMillion
    );
    const targetAvgBenchmark =
      targetModel.benchmarks.length > 0
        ? targetModel.benchmarks.reduce((acc, b) => acc + b.score, 0) /
          targetModel.benchmarks.length
        : null;

    const otherModels = await prismaClient.aIModel.findMany({
      where: { id: { not: modelId } },
      include: {
        modelPricings: true,
        benchmarks: true,
      },
    });

    const suggestions: SuggestionResult[] = [];

    for (const candidate of otherModels) {
      const candidateCapabilities = toStringArray(candidate.capabilities as unknown);
      const capabilitySimilarity = computeJaccardSimilarity(
        targetCapabilities,
        candidateCapabilities
      );

      const candidateCost = decimalToNumber(
        candidate.modelPricings.normalizedPerMillion ??
          candidate.modelPricings.inputPricePerMillion
      );
      const candidateAvgBenchmark =
        candidate.benchmarks.length > 0
          ? candidate.benchmarks.reduce((acc, b) => acc + b.score, 0) /
            candidate.benchmarks.length
          : null;

      const costDelta =
        targetCost != null && candidateCost != null ? candidateCost - targetCost : null;
      const benchmarkDelta =
        targetAvgBenchmark != null && candidateAvgBenchmark != null
          ? candidateAvgBenchmark - targetAvgBenchmark
          : null;

      // Simple combined score: prioritize capability similarity, then adjust
      // slightly by cost and benchmark deltas.
      const costComponent = costDelta != null ? -Math.tanh(costDelta / 10) * 0.2 : 0;
      const benchmarkComponent = benchmarkDelta != null ? Math.tanh(benchmarkDelta / 10) * 0.2 : 0;
      const similarityScore = capabilitySimilarity * 0.6 + costComponent + benchmarkComponent;

      let explanation = "similar capability profile";
      if (costDelta != null && costDelta < 0) {
        explanation = "cheaper with comparable capabilities";
      } else if (benchmarkDelta != null && benchmarkDelta > 0) {
        explanation = "better benchmarks with similar capabilities";
      }

      suggestions.push({
        modelId: candidate.id,
        modelName: candidate.name,
        providerName: candidate.providerName,
        similarityScore,
        costDeltaPerMillionTokens: costDelta,
        benchmarkDelta,
        explanation,
      });
    }

    suggestions.sort((a, b) => b.similarityScore - a.similarityScore);
    return suggestions;
  }
}

export default SuggestionsService;
