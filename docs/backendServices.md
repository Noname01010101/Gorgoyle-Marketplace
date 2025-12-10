
---
title: Backend Services
---

# Backend Services

Purpose: concise reference and operational design for backend services powering the AI Commerce Store.

This document is an index and short reference. Full details live in per-service files under `docs/services/` and runtime guidance is in `docs/development.md`.

---

## Docs Navigation

- [Platform Vision](./main.md) — Vision, problem, solution
- [Web Frontend Pages](./web-frontend-pages.md) — UI, main pages, components
- [API Services](./api-services.md) — Endpoints, usage, data models
- [Setup Guide](../SETUP.md) — Install, run, environment
- [Troubleshooting & FAQ](./troubleshooting.md) — Common issues and quick fixes

---

## Overview

The backend is a small set of focused services. Each service is responsible for a single domain: model metadata, pricing, capability matching, benchmarks, or suggestions.

Services are implemented in Node.js/TypeScript, use Prisma for data access, and are containerized for deployment.

Goals

- Provide authoritative metadata for models and providers.
- Normalize pricing information across providers and compute comparable metrics.
- Offer capability-based matching to recommend models for tasks.
- Surface benchmark comparisons to evaluate model quality vs cost.
- Offer operational-grade observability, security, and test coverage.

## Service Catalogue

Each service below includes purpose, responsibilities, primary routes, and data concerns.

### 1) Model Catalog Service

Purpose

- Maintain model metadata across providers (name, provider, release, deprecation, capabilities, modalities, pricing references).

Responsibilities

- CRUD for model metadata.
- Tagging models with capability vectors and supported modalities.
- Exposing filtered read APIs for search and discovery.

Primary routes (examples)

- `GET /catalog/models` — list models, supports query filters (capability, provider, modality, min_score, priceRange)
- `GET /catalog/models/:id` — model detail
- `POST /catalog/models` — create model (internal/admin)
- `PUT /catalog/models/:id` — update model


Data highlights

- Fields (model):
    - `id`, `name`, `providerId`, `releaseDate`, `deprecated`
    - `capabilities[]`, `modalities[]`, `supportedFormats[]`, `languages[]`
    - `pricingReference` (pointer to Pricing Engine)
    - `metrics[]` (benchmark ids)

Ownership: Platform / Data Team

### 2) Pricing Engine

Purpose

- Collect, normalize, and serve pricing for models/providers.

Responsibilities

- Store raw pricing data (per request, per token) and derived normalized metrics (e.g., price per 1M tokens).
- Answer cost comparison queries and produce recommendations like "cheaper but similar".
- Support time-series price tracking for historical analysis.

Primary routes (examples)

- `GET /pricing/models/:modelId` — current pricing and normalized metrics
- `GET /pricing/compare?modelA=...&modelB=...` — cost equivalence
- `POST /pricing/models/:modelId` — ingest/update price (internal)


Data highlights

- Fields (pricing):
    - `modelId`, `currency`, `unit` (token/request)
    - `price`, `effectiveAt`, `normalizedPerMillionTokens`

Ownership: Pricing Team

### 3) Capability Matching

Purpose

- Score and rank models for a given task using capability vectors + cost + benchmark signals.

Responsibilities

- Maintain capability taxonomy (e.g., OCR, translation, reasoning, code generation, multimodal fusion).
- Provide ranking endpoints and scoring explanation for decisions.

Primary routes (examples)

- `POST /match` — request: task descriptors; response: ranked models with scores and explanation

Ownership: ML Research / Product

### 4) Benchmarks Engine

Purpose

- Store, serve, and compare benchmark results for models.

Responsibilities

- Persist benchmark records (MMLU, GPQA, image benchmarks, custom tests).
- Provide aggregated views and normalized benchmark scores used in ranking.

Primary routes

- `GET /benchmarks/models/:modelId`
- `POST /benchmarks` (ingest)

Ownership: Benchmarks Team

### 5) Equivalency / Suggestion Service

Purpose

- Provide closest-match alternatives based on capability vectors and pricing.

Responsibilities

- Compute similarity in capability space, include cost delta and performance delta.
- Expose suggestion APIs used by frontend and internal UIs.

Primary routes

- `GET /suggestions/:modelId` — returns ranked comparable models with explanation

Ownership: Product / Platform

---

## API Contracts (examples)

Note: below are representative request / response payloads. Final schemas should live in an OpenAPI spec repository and be validated in CI.

Example: GET /catalog/models/:id response

```json
{
    "id": "string",
    "name": "GPT-4.1",
    "provider": "ExampleAI",
    "releaseDate": "2024-11-01",
    "deprecated": false,
    "capabilities": ["nlp","reasoning"],
    "modalities": ["text","image"],
    "supportedFormats": ["text/plain","image/png"],
    "languages": ["en","es"],
    "pricingReference": "/pricing/models/gpt-4.1",
    "metrics": [{"benchmarkId":"mmlu-2024","score":86.4}]
}
```

Example: POST /match request

```json
{
    "taskDescription": "High-quality long-form summarization in English",
    "constraints": { "maxPricePerMillionTokens": 20 },
    "preferences": { "latency": "low", "costWeight": 0.6 }
}
```

Example: POST /match response (partial)

```json
{
    "results": [
        {"modelId":"m-1","score":0.92,"costPer1M":15.2,"explanation":"good mix of summarization and low cost"},
        {"modelId":"m-2","score":0.84,"costPer1M":9.0,"explanation":"cheaper but lower accuracy on summarization"}
    ]
}
```

---

## Data Model (domain-level)

Keep canonical domain schemas in `prisma/schema.prisma`. Key entities:

- Provider: id, name, contact, url
- Model: id, name, providerId, releaseDate, status, capabilities[], modalities[], metadata
- Pricing: id, modelId, unit, currency, price, effectiveAt, normalized
- Benchmark: id, modelId, type, score, runAt, metadata

Normalization rules

- Currency conversions are handled at ingestion and stored in `baseCurrency` (e.g., USD).
- Tokens are normalized to `per_1M_tokens` for comparisons.

---

## Non-functional requirements

- Availability: target 99.9% for read APIs; 99.5% for write/admin APIs.
- Latency: median API response < 120ms for catalog reads at p95 < 500ms.
- Throughput: scale horizontally behind a load balancer; services should be stateless where possible.
- Consistency: authoritative model of record is `Model Catalog` for metadata; cross-service eventual consistency via events.

Scaling strategy

- Use autoscaling groups / k8s HPA based on CPU + request latency.
- Cache catalog reads via Redis CDN where appropriate.

---

## Observability & Monitoring

Metrics

- Request rates, latencies (p50/p95/p99), error rates per route.
- Domain metrics: number of models, pricing update frequency, suggestion hit-rate.

Logging

- Structured JSON logs (level, timestamp, requestId, userId, route, duration, status).

Tracing

- Distributed tracing with W3C Trace Context; sample traces for requests that call multiple services.

Dashboards / Alerts

- Dashboards for API health, error budgets, pricing ingestion success rate.
- Alerts: high error rate (>1% over 5m), latency p95 > 1s, pricing ingestion failures.

---

## Security & Compliance

Authentication & Authorization

- Service-to-service TLS mTLS for internal traffic.
- JWT tokens for external clients; scopes for admin vs read-only operations.

Data protection

- Encrypt PII at rest and in transit. Use KMS for secrets.

Audit & Compliance

- Audit logs for changes to model metadata and pricing.

Secrets

- Use secret manager (e.g., AWS Secrets Manager / Azure KeyVault) for DB credentials and API keys.

---

## Testing strategy

Unit tests

- All services must have unit tests using Vitest/Jest for domain logic.

Integration tests

- API contract tests that assert OpenAPI schema compatibility and end-to-end flows (catalog -> pricing -> match).

E2E

- Synthetic user journeys for key scenarios: search+match+price compare.

Test data

- Use `dbDevData.ts` and clear, isolated dev db instances. Avoid using real provider keys in tests.

CI gating

- Unit tests + lint + typecheck must pass on PRs.

---

## Deployment & CI/CD

Containers

- Build images with reproducible builds and tag by commit SHA.

CI

## Overview (short)

The backend is composed of focused services. For readability, detailed contracts, runbooks, and appendices
are split into per-service pages under `docs/services/`.

See `docs/development.md` for run and test guidance.

### Services (links)

- [Model Catalog Service](./services/model-catalog.md)
- [Pricing Engine](./services/pricing.md)
- [Capability Matching](./services/capability-matching.md)
- [Benchmarks Engine](./services/benchmarks.md)
- [Suggestions / Equivalency](./services/suggestions.md)

### Operational & non-functional guidance

- Observability, security, testing and runbook notes are summarized here and expanded in `docs/development.md` and on the team wiki (internal).

For the full examples (payloads, data model, and runbook steps), see `docs/development.md` and the individual service pages under
`docs/services/`.

Catalog inconsistency: check the event delivery pipeline and follow runbook steps for manual correction.
