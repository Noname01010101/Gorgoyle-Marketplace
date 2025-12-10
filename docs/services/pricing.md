---
title: Pricing Engine
---

# Pricing Engine

Purpose: normalize and compute comparable pricing metrics across providers and models.

Features

- Price ingestion from providers (manual or automated)
- Compute normalized metrics (price per 1M tokens, per request)
- Provide ranges and similarity lookups

Primary routes

- `GET /pricing/range` — price ranges by provider/model
- `GET /pricing/similar` — find similar-priced models

Where to find code

- Router: `api/src/pricing/pricingRouter.ts`
- Helpers: `api/src/pricing/priceRange.ts`, `api/src/pricing/similarPrices.ts`

Notes

- Keep provider-specific edge cases in provider adapters.
- Add unit tests for normalization calculations.
