import { initTRPC } from "@trpc/server";
import { z } from "zod";
import FieldsQuery from "./fields";
import ModelQuery from "./model";
import ProviderQuery from "./provider";

const t = initTRPC.create();

export const catalogRouter = t.router({
  getFields: t.procedure
    .input(z.object({ name: z.string().optional() }))
    .query(async ({ input }) => {
      if (input.name) {
        return await FieldsQuery.getFieldByName(input.name);
      }
      return await FieldsQuery.getAllFields();
    }),

  getModels: t.procedure
    .input(z.object({ name: z.string().optional() }))
    .query(async ({ input }) => {
      if (input.name) {
        return await ModelQuery.getModelsByName(input.name);
      }
      return await ModelQuery.getAllModels();
    }),

  getProviders: t.procedure
    .input(z.object({ name: z.string().optional() }))
    .query(async ({ input }) => {
      if (input.name) {
        return await ProviderQuery.getProviderByName(input.name);
      }
      return await ProviderQuery.getAllProviders();
    }),

  getModelByNameAndVersion: t.procedure
    .input(z.object({ name: z.string(), version: z.string() }))
    .query(async ({ input }) => {
      return await ModelQuery.getModelByNameAndVersion(
        input.name,
        input.version
      );
    }),
});

export type CatalogRouter = typeof catalogRouter;
