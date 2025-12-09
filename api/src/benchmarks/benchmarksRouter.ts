import { initTRPC } from "@trpc/server";
import BenchmarksService from "./benchmarksService";
import z from "zod";

const t = initTRPC.create();

const benchmarksProcedure = t.procedure
  .input(
    z.object({
      modelId: z.number(),
    })
  )
  .query(async ({ input }) => {
    const modelId = input.modelId;

    try {
      const benchmarks = await BenchmarksService.getBenchmarksForModel(modelId);
      return benchmarks;
    } catch (error) {
      return { error: "Failed to fetch benchmarks" };
    }
  });

const benchmarkSummaryProcedure = t.procedure
  .input(
    z.object({
      modelId: z.number(),
    })
  )
  .query(async ({ input }) => {
    const modelId = input.modelId;
    try {
      const summary = await BenchmarksService.getBenchmarkSummaryForModel(
        modelId
      );
      if (!summary) {
        return { error: "No benchmark data found for model" };
      }

      return summary;
    } catch (error: Error | any) {
      return { error: "Failed to fetch benchmark summary" };
    }
  });

export const benchmarksRouter = t.router({
  getModelBenchmarks: benchmarksProcedure,
  getModelBenchmarkSummary: benchmarkSummaryProcedure,
});

export type BenchmarksRouter = typeof benchmarksRouter;
