---
title: Setup Guide
---

# Setup Guide — AI Commerce Store (FRONTEND DEVELOPMENT)

- This setup requires the initial setup from README.md's "Getting Started".
- Docker Desktop engine must be running (open Docker Desktop)

---

## Prerequisites

- Node.js 20+
- Docker Desktop

---

## Initial setup

### 1. Build Backend (./)

```powershell
# From project root
docker-compose build
```

### 2. Run The Backend (./)

```powershell
# From project root
docker-compose up -d
```

### 3. Configure Database (./)

```powershell
docker exec api-service npx prisma generate 
docker exec api-service npx prisma db push 
docker exec api-service npm run seed
```

### 4. Install dependencies (./web-frontend)

```powershell
npm install
```

### 5. Start Frontend (./web-frontend)

Copy `.env.dev` to `.env`, then run:

```powershell
npm run dev
```

---

## Daily Development - After initial setup

This is the common development path. Notice that changes in `./api` will require docker building and might require prisma setups if prisma files were modified.

### 1. Start the backend (./)

```powershell
docker-compose up
```

### 2. Start the frontend (./web-frontend)

```powershell
npm run dev
```

---
