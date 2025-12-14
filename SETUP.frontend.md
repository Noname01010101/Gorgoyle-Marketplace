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

### 1. Docker setup

```powershell
docker-compose up -d --build
```
### 2. Install dependencies

```powershell
npm install
```

### 3. Start Frontend

Copy `.env.dev` to `.env`, then run:

```powershell
npm run dev:web
```

---

## Daily Development - After initial setup

This is the common development path. Notice that changes in `./api` will require docker building and might require prisma setups if prisma files were modified.

### 1. Start the backend

```powershell
docker-compose up -d
```

### 2. Start the frontend

```powershell
npm run dev:web
```

---
