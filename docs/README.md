---
title: Documentation Index
---

# Documentation Index — AI Commerce Store

This index provides a clear, clickable navigation for the `docs/` folder so it's easy to browse on GitHub.

Use this page as the starting point for reading or contributing to documentation.

## Quick Links

- [Platform Vision & Problem (main.md)](./main.md)
- [Backend Services (index)](./backendServices.md)
  - [Model Catalog Service](./services/model-catalog.md)
  - [Pricing Engine](./services/pricing.md)
  - [Capability Matching](./services/capability-matching.md)
  - [Benchmarks Engine](./services/benchmarks.md)
  - [Suggestions / Equivalency](./services/suggestions.md)
- [API Services (api-services.md)](./api-services.md)
- [tRPC Routes (trpc-routes.md)](./trpc-routes.md)
- [OpenAPI-style Summary (openapi-summary.md)](./openapi-summary.md)
- [Web Frontend Pages (web-frontend-pages.md)](./web-frontend-pages.md)
- [Developer Guide (development.md)](./development.md)
- [Setup Guide (../SETUP.md)](../SETUP.md)
- [Troubleshooting & FAQ (troubleshooting.md)](./troubleshooting.md)
- [Docs Quality (quality.md)](./quality.md)

## Diagrams

- [Architecture diagram (SVG)](./diagrams/architecture.svg)

## How to navigate on GitHub

- Click any file above to open its rendered Markdown. Use the top-right **Raw** / **Blame** / **History** buttons to access different views.
- Use the repository file tree (left side) to browse folders; this `README.md` will be shown when opening the `docs/` folder.

## Contributing to docs

1. Edit files under `docs/` or add new files under `docs/services/`.
2. Run the basic docs check locally:

```powershell
powershell -ExecutionPolicy Bypass -File .\docs\check-markdown.ps1
```

3. Create a branch and open a PR. Include a short summary of your changes and tag the relevant team (e.g., `@Platform-Engineering`, `@Product-Team`, `@Frontend-Team`).

## For maintainers

- Keep docs short and link to code: when referencing code paths, wrap them like `api/src/model-catalog/catalogRouter.ts`.
- Consider adding GitHub Pages or MkDocs if you want a full-site navigation — this index is intentionally plain so navigation works immediately on GitHub without extra tooling.

## Troubleshooting

- If you see Markdown render warnings in your CI/docs process, run the `docs/check-markdown.ps1` script and follow `docs/quality.md`.

---

Last updated: 2025-12-10
