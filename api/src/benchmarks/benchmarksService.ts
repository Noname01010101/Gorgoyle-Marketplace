import { PrismaClient } from '@ai-store/prisma-db';

const prismaClient = new PrismaClient();

export interface BenchmarkSummary {
  modelId: number;
  averageScore: number;
  benchmarksCount: number;
}

export interface BenchmarkAggregationResult {
  averageScore: number | null;
  benchmarksCount: number;
}

/**
 * BenchmarksService
 *
 * Application service responsible for higher-level benchmark operations,
 * such as aggregating scores per model. Keeps domain logic separate from
 * HTTP and raw persistence concerns.
 */
class BenchmarksService {
  static async getBenchmarksForModel(modelId: number) {
    return prismaClient.benchmark.findMany({
      where: { modelId },
      orderBy: { runAt: 'desc' },
    });
  }

  static async getBenchmarkSummaryForModel(modelId: number): Promise<BenchmarkSummary | null> {
    const aggregated = await prismaClient.benchmark.aggregate({
      where: { modelId },
      _avg: { score: true },
      _count: { _all: true },
    });

    if (!aggregated._avg.score || aggregated._count._all === 0) {
      return null;
    }

    return {
      modelId,
      averageScore: aggregated._avg.score,
      benchmarksCount: aggregated._count._all,
    };
  }

  static async getBenchmarkAggregationForModel(
    modelId: number
  ): Promise<BenchmarkAggregationResult> {
    const aggregated = await prismaClient.benchmark.aggregate({
      where: { modelId },
      _avg: { score: true },
      _count: { _all: true },
    });

    return {
      averageScore: aggregated._avg.score ?? null,
      benchmarksCount: aggregated._count._all,
    };
  }
}

export default BenchmarksService;
