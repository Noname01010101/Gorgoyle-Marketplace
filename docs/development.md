---
title: Development Guide
---

# Development — AI Commerce Store

This short developer guide explains the repository layout, quick run commands, and where key code files live.

Repository layout (top-level)

```
api/                # Backend (Node.js/TypeScript, tRPC + Express)
web-frontend/       # Next.js frontend (app dir)
docs/               # Documentation
docker-compose.yml  # Local orchestration (DB + API)
```

Run locally (recommended)

1) Start database and API via Docker (project root):

```powershell
docker-compose up --build
```

2) Run frontend (dev):

```powershell
cd web-frontend
npm install
npm run dev
```

Run the API locally (non-Docker)

Option A — quick (no build):
```powershell
cd api
npx tsx host.ts
```

Option B — build + run (closer to prod):
```powershell
cd api
npm install
npm run build
npm run host
```

Key code pointers

- Main server router: `api/src/server/serverController.ts`
- Model catalog: `api/src/model-catalog/*`
- Pricing: `api/src/pricing/*`
- Benchmarks: `api/src/benchmarks/*`
- Capability matching: `api/src/capability-matching/*`
- Suggestions: `api/src/suggestions/*`

Environment variables

- Backend: set `PORT`, `DATABASE_URL` (used by Prisma)
- Frontend: set `NEXT_PUBLIC_API_URL` in `.env.local` to `http://localhost:1092` (or whichever port)

Testing

- API unit tests: `cd api && npm test` (uses Vitest)
- Frontend: follow `web-frontend/package.json` scripts

Notes

- Use Prisma migrations for DB schema changes: `npx prisma migrate dev` (ensure the DB is running).
- For quick data seeding: `cd api && npm run seed` (runs `prisma/seed.ts`).
