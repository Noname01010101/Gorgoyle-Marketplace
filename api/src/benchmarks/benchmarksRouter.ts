import { initTRPC } from "@trpc/server";
import BenchmarksService from "./benchmarksService";
import z from "zod";
import ModelQuery from "../model-catalog/model";

const t = initTRPC.create();

const benchmarksProcedure = t.procedure
  .input(
    z.object({
      name: z.string(),
      version: z.string(),
    })
  )
  .query(async ({ input }) => {
    try {
      const model = await ModelQuery.getModelByNameAndVersion(
        input.name,
        input.version
      );
      if (!model) {
        return { error: "Model not found" };
      }
      const benchmarks = await BenchmarksService.getBenchmarksForModel(
        model.id
      );
      return benchmarks;
    } catch (error) {
      return { error: "Failed to fetch benchmarks" };
    }
  });

const benchmarkSummaryProcedure = t.procedure
  .input(
    z.object({
      name: z.string(),
      version: z.string(),
    })
  )
  .query(async ({ input }) => {
    try {
      const model = await ModelQuery.getModelByNameAndVersion(
        input.name,
        input.version
      );
      if (!model) {
        return { error: "Model not found" };
      }
      const summary = await BenchmarksService.getBenchmarkSummaryForModel(
        model.id
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
