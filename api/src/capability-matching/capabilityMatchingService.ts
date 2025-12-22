import { PrismaClient, Prisma } from '@ai-store/prisma-db';

const prismaClient = new PrismaClient();

export interface MatchConstraints {
  maxPricePerMillionTokens?: number;
}

export interface MatchPreferences {
  costWeight?: number; // 0..1, higher means cost is more important
}

export interface CapabilityMatchRequest {
  taskDescription: string;
  constraints?: MatchConstraints;
  preferences?: MatchPreferences;
}

export interface CapabilityMatchResult {
  modelId: number;
  modelName: string;
  providerName: string;
  score: number;
  costPerMillionTokens: number | null;
  averageBenchmarkScore: number | null;
  explanation: string;
}

function decimalToNumber(value: Prisma.Decimal | number | null | undefined): number | null {
  if (value == null) return null;
  if (typeof value === 'number') return value;
  return value.toNumber();
}

/**
 * CapabilityMatchingService
 *
 * Ranks models for a given task using a simple heuristic that combines
 * cost and benchmark performance. This is intentionally lightweight and
 * deterministic, and can evolve as the domain matures.
 */
class CapabilityMatchingService {
  static async matchModelsForTask(
    request: CapabilityMatchRequest
  ): Promise<CapabilityMatchResult[]> {
    const { constraints, preferences } = request;
    const maxPrice = constraints?.maxPricePerMillionTokens;
    const costWeight = preferences?.costWeight ?? 0.5;

    const models = await prismaClient.aIModel.findMany({
      include: {
        provider: true,
        modelPricings: true,
        benchmarks: true,
      },
    });

    const scored: CapabilityMatchResult[] = [];

    for (const model of models) {
      const cost = decimalToNumber(
        model.modelPricings.normalizedPerMillion ?? model.modelPricings.inputPricePerMillion
      );
      const benchmarks = model.benchmarks;
      const avgBenchmarkScore =
        benchmarks.length > 0
          ? benchmarks.reduce((acc: number, b: { score: number }) => acc + b.score, 0) /
            benchmarks.length
          : null;

      if (maxPrice != null && cost != null && cost > maxPrice) {
        // Respect explicit cost constraint
        continue;
      }

      const normalizedCostScore = cost != null ? 1 / (1 + cost) : 0.5;
      const normalizedBenchmarkScore =
        avgBenchmarkScore != null ? Math.min(Math.max(avgBenchmarkScore / 100, 0), 1) : 0.5;

      const combinedScore =
        costWeight * normalizedCostScore + (1 - costWeight) * normalizedBenchmarkScore;

      let explanation = 'balanced trade-off between cost and benchmark performance';
      if (avgBenchmarkScore != null && cost != null) {
        if (avgBenchmarkScore >= 85 && cost <= (maxPrice ?? cost + 1)) {
          explanation = 'strong benchmarks while staying within cost constraints';
        } else if (cost < (maxPrice ?? cost + 1)) {
          explanation = 'prioritizes lower cost while maintaining reasonable performance';
        } else {
          explanation = 'higher performance at a relatively higher cost';
        }
      }

      scored.push({
        modelId: model.id,
        modelName: model.name,
        providerName: model.providerName,
        score: combinedScore,
        costPerMillionTokens: cost,
        averageBenchmarkScore: avgBenchmarkScore,
        explanation,
      });
    }

    scored.sort((a, b) => b.score - a.score);
    return scored;
  }
}

export default CapabilityMatchingService;
