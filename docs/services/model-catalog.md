---
title: Model Catalog Service
---

# Model Catalog Service

Purpose: store and expose model metadata used across the platform.

Key responsibilities

- CRUD model records (name, provider, versions, release/deprecation)
- Tagging: capabilities, modalities, languages
- Search & filter APIs used by frontend pages

Primary routes (examples)

- `GET /catalog/models` — list models, supports `capability`, `provider`, `modality`, `min_score`, `priceRange`
- `GET /catalog/models/:id` — model details
- `POST /catalog/models` — create model (admin/internal)
- `PUT /catalog/models/:id` — update model

Where to find code

- Router: `api/src/model-catalog/catalogRouter.ts`
- Data types / fields: `api/src/model-catalog/fields.ts`
- Model helpers: `api/src/model-catalog/model.ts`

Notes for contributors

- Use Prisma schema (`api/prisma/schema.prisma`) for DB changes.
- Keep tags/capability vectors small and documented.
