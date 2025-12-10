---
title: Benchmarks Engine
---

# Benchmarks Engine

Purpose: store and surface benchmark results to compare model quality vs cost.

Primary routes

- `GET /benchmarks` — list benchmarks
- `GET /benchmarks/:id` — benchmark details

Where to find code

- Router: `api/src/benchmarks/benchmarksRouter.ts`
- Service: `api/src/benchmarks/benchmarksService.ts`

Notes

- Include metadata (dataset, evaluation date, metric details).
- Benchmarks may be large; paginate and cache for performance.
