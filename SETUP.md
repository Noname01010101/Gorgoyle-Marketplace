---
title: Setup Guide
---

# Setup Guide — AI Commerce Store
---

## Prerequisites

- Node.js 20+
- Docker Desktop

---

## Quick Start

### 1. Start Backend (API & DB)

```powershell
# From project root
docker-compose up --build
```

- Starts MySQL (port 2100) & API (port 1092)

API: [http://localhost:1092](http://localhost:1092)

### 2. Start Frontend

```powershell
cd web-frontend
npm install
npm run dev
```

*Frontend: [http://localhost:3000](http://localhost:3000)*

---

## Architecture Visual

```visual
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ Frontend    │ → │ Backend API │ → │ Database    │
│ (Next.js)   │   │ (Express)   │   │ (MySQL)     │
└─────────────┘   └─────────────┘   └─────────────┘
```

---

## API Connection

- Direct: `http://localhost:1092/trpc`
- Proxy: Next.js rewrites `/trpc/*` to backend
- CORS: Backend allows localhost:3000/3001

---

## Environment Variables

**Frontend (`.env.local`)**

```env
NEXT_PUBLIC_API_URL=http://localhost:1092
```

**Backend (`docker-compose.yml`)**

```yaml
api:
  environment:
    PORT: 1092
    DATABASE_URL: mysql://dev_user:mysql_pwd@db:3306/db
```

---

## Troubleshooting & FAQ

See [Troubleshooting & FAQ](./docs/troubleshooting.md) for common issues and solutions.
3. Verify API is accessible: Open `http://localhost:1092` in browser

### Database connection issues

1. Check database container: `docker-compose logs db`
2. Verify database port 2100 is available
3. Ensure DATABASE_URL in Dockerfile matches docker-compose

### Frontend can't connect

1. Verify API is running on port 1092
2. Check browser console for CORS errors
3. Ensure Next.js dev server restarted after config changes
4. Check `next.config.ts` proxy configuration

## Rebuilding After Changes

### Backend changes

```bash
docker-compose down
docker-compose up --build
```

### Frontend changes

```bash
# No rebuild needed, Next.js hot reloads
# For config changes, restart dev server:
npm run dev
```

## Database Management

### Access database

```bash
docker exec -it <db-container-name> mysql -u dev_user -p
# Password: mysql_pwd
```

### Run migrations

```bash
docker exec -it <api-container-name> npx prisma migrate dev
```

### Seed database

```bash
docker exec -it <api-container-name> npm run seed
```

## Port Reference

- **3000**: Next.js frontend
- **1092**: Backend API (Docker exposed)
- **2100**: MySQL database (Docker exposed, internal 3306)
