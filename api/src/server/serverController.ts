import { initTRPC } from "@trpc/server";
import { pricingRouter } from "../pricing/pricingRouter";
import { catalogRouter } from "../model-catalog/catalogRouter";
import { benchmarksRouter } from "../benchmarks/benchmarksRouter";
import { capabilityMatchingRouter } from "../capability-matching/capabilityMatchingRouter";
import { suggestionsRouter } from "../suggestions/suggestionsRouter";

const t = initTRPC.create();

export const appRouter = t.router({
  pricing: pricingRouter,
  catalog: catalogRouter,
  benchmarks: benchmarksRouter,
  match: capabilityMatchingRouter,
  suggestions: suggestionsRouter,
});

export type AppRouter = typeof appRouter;
