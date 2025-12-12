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

### 1. Database setup (./)

```powershell
docker-compose up db --build -d
```

### 2. Install dependencies (./api)

```powershell
npm install
```

### 3. Environment variables (./api)

Move `.env.dev` to `.env` for development

### 4. Prisma setup (./api)

```powershell
npx prisma generate
npx prisma db push
npm run seed
```

### 5. Testing (./api)

```powershell
npm test
```

---

## Daily Development - After initial setup

This is the common development path.

### 1. Start the database (./)

```powershell
docker-compose up db -d
```

### 2. Test (./api)

```powershell
npm test
```

---
