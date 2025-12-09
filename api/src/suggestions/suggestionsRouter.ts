import { initTRPC } from "@trpc/server";
import { z } from "zod";
import SuggestionsService from "./suggestionsService";

const t = initTRPC.create();

export const suggestionsRouter = t.router({
  getSuggestionsForModel: t.procedure
    .input(z.object({ modelId: z.number() }))
    .query(async ({ input }) => {
      const suggestions = await SuggestionsService.getSuggestionsForModel(
        input.modelId
      );
      return { suggestions };
    }),
});

export type SuggestionsRouter = typeof suggestionsRouter;
