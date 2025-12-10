---
title: API Services — AI Commerce Store
---

## API Services Overview

This document summarizes the API endpoints, data models, and usage patterns for backend services powering the AI Commerce Store.

## Service Endpoints

### Model Catalog

- `GET /catalog/models` — List/search models
- `GET /catalog/models/:id` — Model details
- `POST /catalog/models` — Create model (admin)
- `PUT /catalog/models/:id` — Update model

### Pricing Engine

- `GET /pricing/range` — Price ranges by provider/model
- `GET /pricing/similar` — Find similar-priced models

### Capability Matching

- `GET /capability-matching` — List/filter by capability

### Benchmarks

- `GET /benchmarks` — List benchmarks
- `GET /benchmarks/:id` — Benchmark details

### Suggestions/Equivalency

- `GET /suggestions` — Model alternatives

## Code pointers & where to extend

- Main router: `api/src/server/serverController.ts` — composes individual tRPC routers.
- Model catalog router: `api/src/model-catalog/catalogRouter.ts`
- Pricing helpers: `api/src/pricing/priceRange.ts`, `api/src/pricing/similarPrices.ts`
- Benchmarks: `api/src/benchmarks/*`
- Capability matching: `api/src/capability-matching/*`
- Suggestions: `api/src/suggestions/*`

## Quick run & test (local)

Run API (quick):
```powershell
cd api
npx tsx host.ts
```

Build + run (prod-like):
```powershell
cd api
npm install
npm run build
npm run host
```

Validate API is running by visiting: `http://localhost:<PORT>` (default from `docker-compose` is `1092`).

## Example usage

1) Health check:

```http
GET /
```

2) tRPC call example (JSON POST to tRPC endpoint)

```http
POST /trpc/catalog.list
Content-Type: application/json

{"input":{}}
```

Note: frontend uses `web-frontend/lib/trpc.ts` for client calls; examine it for client usage patterns.

## Data Models

- **Model**: id, name, provider, capabilities, modalities, price, benchmarks
- **Provider**: id, name, contact, models
- **Benchmark**: id, modelId, metric, score
- **PriceRange**: modelId, providerId, min, max

## Usage Example

```http
GET /catalog/models?capability=vision&priceRange=0-10
```

## Related Docs

- [Backend Services](./backendServices.md)
- [Platform Vision](./main.md)

---
For API questions, open a PR and tag `@Backend-Team`.
