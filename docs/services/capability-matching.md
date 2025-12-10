---
title: Capability Matching Service
---

# Capability Matching

Purpose: recommend models based on task capabilities and constraints (cost, latency, modalities).

Primary routes

- `GET /capability-matching` — query by capability vector and constraints

Where to find code

- Router: `api/src/capability-matching/capabilityMatchingRouter.ts`
- Service: `api/src/capability-matching/capabilityMatchingService.ts`

Notes

- Matching uses capability vectors stored in the catalog; keep vector schema stable.
- Consider adding precomputed indexes for frequent queries.
