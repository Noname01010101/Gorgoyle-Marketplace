---
title: Setup Guide
---

# Setup Guide — AI Commerce Store (FRONTEND DEVELOPMENT)

- Docker Desktop engine must be running (open Docker Desktop)

---

## Prerequisites

- Node.js 20+
- Docker Desktop

---

## Initial setup

### 1. Build Backend

```powershell
docker-compose build
```

### 2. Run And Setup The Backend

```powershell
npm run docker:web
```

### 3. Install dependencies

```powershell
npm install
```

### 4. Start Frontend

Copy `.env.dev` to `.env`, then run:

```powershell
npm run dev:web
```

---

## Daily Development - After initial setup

This is the common development path. Notice that changes in `./api` will require docker building and might require prisma setups if prisma files were modified.

### 1. Start the backend

```powershell
npm run docker:web
```

### 2. Start the frontend

```powershell
npm run dev:web
```

---
