---
title: tRPC Routes — AI Commerce Store
---

# tRPC Routes Summary

This file lists the top-level tRPC routers composed in `api/src/server/serverController.ts` and where each router lives.


Top-level routers and procedures (exported names)

- `pricing` — `api/src/pricing/pricingRouter.ts`
	- `filterByPriceRangeInput` (input: `{ minInput?: number, maxOutput?: number }`)

- `catalog` — `api/src/model-catalog/catalogRouter.ts`
	- `getFields` (input: `{ name?: string }`)
	- `getModels` (input: `{ name?: string }`)
	- `getProviders` (input: `{ name?: string }`)
	- `getModelByNameAndVersion` (input: `{ name: string, version: string }`)

- `benchmarks` — `api/src/benchmarks/benchmarksRouter.ts`
	- `getModelBenchmarks` (input: `{ name: string, version: string }`)
	- `getModelBenchmarkSummary` (input: `{ name: string, version: string }`)

- `match` — `api/src/capability-matching/capabilityMatchingRouter.ts`
	- `matchModelsForTask` (input: `{ taskDescription: string, constraints?: { maxPricePerMillionTokens?: number }, preferences?: { costWeight?: number } }`)

- `suggestions` — `api/src/suggestions/suggestionsRouter.ts`
	- `getSuggestionsForModel` (input: `{ name: string, version: string }`)

How tRPC is exposed

The app hosts tRPC at the Express path `/trpc` (see `api/host.ts`). Frontend code calls tRPC via the client wrapper in `web-frontend/lib/trpc.ts`.

Calling a procedure

Example HTTP POST to call `catalog.list` (tRPC batchless endpoint):

```http
POST /trpc/catalog.list
Content-Type: application/json

{"input":{}}
```

Extending routers

- Add new procedures inside the router file and update the exported router.
- Keep procedure input/output shapes validated with `zod` where possible.

Notes

- This summary intentionally lists only top-level routers. See individual router files for procedure names and input schemas.
