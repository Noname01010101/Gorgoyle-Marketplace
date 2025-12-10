import { initTRPC } from "@trpc/server";
import { z } from "zod";
import SuggestionsService from "./suggestionsService";
import ModelQuery from "../model-catalog/model";

const t = initTRPC.create();

export const suggestionsRouter = t.router({
  getSuggestionsForModel: t.procedure
    .input(z.object({ name: z.string(), version: z.string() }))
    .query(async ({ input }) => {
      const model = await ModelQuery.getModelByNameAndVersion(
        input.name,
        input.version
      );
      if (!model) {
        return { suggestions: [], error: "Model not found" };
      }
      const suggestions = await SuggestionsService.getSuggestionsForModel(
        model.id
      );
      return { suggestions };
    }),
});

export type SuggestionsRouter = typeof suggestionsRouter;
