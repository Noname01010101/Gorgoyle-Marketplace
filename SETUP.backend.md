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
docker-compose up db --build -d
```

### 2. Install dependencies

```powershell
npm install --workspace=api
```

### 3. Environment variables

Move `.env.dev` to `.env` for development

### 4. Prisma setup

```powershell
npm run prisma:setup:api
```

### 5. Testing

```powershell
npm test --workspace=api
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
