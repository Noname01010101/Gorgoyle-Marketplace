import CapabilityMatchingService from "./capabilityMatchingService";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

export const capabilityMatchingRouter = t.router({
  matchModelsForTask: t.procedure
    .input(
      z.object({
        taskDescription: z.string(),
        constraints: z
          .object({
            maxPricePerMillionTokens: z.number().optional(),
          })
          .optional(),
        preferences: z
          .object({
            costWeight: z.number().min(0).max(1).optional(),
          })
          .optional(),
      })
    )
    .query(async ({ input }) => {
      const results = await CapabilityMatchingService.matchModelsForTask({
        taskDescription: input.taskDescription,
        constraints: input.constraints,
        preferences: input.preferences,
      });
      return { results };
    }),
});

export type CapabilityMatchingRouter = typeof capabilityMatchingRouter;
