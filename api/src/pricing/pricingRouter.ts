import { initTRPC } from "@trpc/server";
import { z } from "zod";
import PriceRangeFilter from "./priceRange";

const t = initTRPC.create();

export const pricingRouter = t.router({
  filterByPriceRangeInput: t.procedure
    .input(
      z.object({
        minInput: z.number().default(0),
        maxOutput: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const models = await PriceRangeFilter.filterByRangeInput(
        input.minInput,
        input.maxOutput
      );
      return models;
    }),
});

export type PricingRouter = typeof pricingRouter;
