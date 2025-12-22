---
applyTo: '**'
---

# AI Agent Quick Context

- Platform: Gorgoyle Marketplace for model discovery, pricing comparisons, benchmarks, and capability-based matching/suggestions across providers.
- Backend: TypeScript Express + tRPC in api/src; routers `pricing`, `catalog`, `benchmarks`, `match`, `suggestions` exposed under /trpc (see api/src/server/serverController.ts, host.ts). Data access via Prisma schema in packages/prisma-db/prisma/schema.prisma; seed with workspace prisma-db `seed` script when needed.
- Frontend: Next.js App Router in web-frontend/app with pages for home, models, pricing, benchmarks, capability-matching, suggestions; shared components under web-frontend/components; tRPC client wrapper in web-frontend/lib/trpc.ts; styled with Tailwind.
- Docs: High-level vision in docs/main.md; backend/service summaries in docs/backendServices.md and docs/trpc-routes.md; UI/page notes in docs/web-frontend-pages.md.
- Tooling: Workspaces via pnpm; backend tests with Vitest; linting with ESLint; typechecking with TypeScript (`tsc --noEmit`).

# Finish Coding Checklist

- Navigate to the relevant package before running commands (api/ or web-frontend/) and prefer the package scripts.
- Typecheck everything (including tests): run `pnpm typecheck` at repo root, or per package (`pnpm --filter pricing-api typecheck`, `pnpm --filter @ai-store/web-frontend typecheck`).
- Lint: run `pnpm lint` at root, or per package (`pnpm --filter pricing-api lint`, `pnpm --filter @ai-store/web-frontend lint`).
- Tests: run `pnpm test` or per-package (`pnpm --filter pricing-api test`); ensure any test file edits still typecheck.
- If you change Prisma schema or seed data, regenerate/seed via workspace scripts before relying on API results.
