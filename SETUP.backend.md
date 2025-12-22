---
title: Setup Guide
---

# Setup Guide — AI Commerce Store (BACKEND DEVELOPMENT)

- Docker Desktop engine must be running (open Docker Desktop)

---

## Prerequisites

- Node.js 20+
- Docker Desktop

---

## Initial setup

### 1. Database setup

```powershell
docker-compose up db -d --build &&
pnpm --filter @ai-store/prisma-db migrate:dev --name init &&
pnpm --filter @ai-store/prisma-db seed
```

### 2. Install dependencies

```powershell
pnpm install
```

### 3. Environment variables

Move `.env.dev` to `.env` for development

### 4. Testing

```powershell
pnpm --filter api test
```

---

## Daily Development - After initial setup

This is the common development path.

### 1. Start the database

```powershell
docker-compose up db -d
```

### 2. Test

```powershell
npm test --workspace=api
```

---
