---
title: OpenAPI Summary (lightweight)
---

# OpenAPI-style Summary

This file contains a minimal mapping between tRPC procedures and a simple HTTP view.

Servers:

- `http://localhost:1092`

Key tRPC procedures (examples):

- `catalog.getModels` — list models
- `catalog.getModelByNameAndVersion` — get model by name/version
- `pricing.filterByPriceRangeInput` — filter by price range

Notes

- The backend is tRPC-first. For a full OpenAPI spec, use a generator (e.g., `trpc-openapi`) or create a small extractor.
