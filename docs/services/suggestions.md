---
title: Suggestions / Equivalency Service
---

# Suggestions / Equivalency

Purpose: provide alternatives and equivalency suggestions (cheaper or similar models).

Primary routes

- `GET /suggestions` — model alternatives and equivalency lists

Where to find code

- Router: `api/src/suggestions/suggestionsRouter.ts`
- Service: `api/src/suggestions/suggestionsService.ts`

Notes

- Uses pricing and catalog data to compute alternatives.
- Prefer precomputed similarity maps for fast responses.
