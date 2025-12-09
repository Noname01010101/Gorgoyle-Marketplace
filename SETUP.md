# Development Setup Guide

## Running the Application

### 1. Start Backend with Docker
```bash
# From project root
docker-compose up --build
```

This will:
- Start MySQL database on port 2100
- Start API server on port 1092

The API will be available at: `http://localhost:1092`

### 2. Start Frontend
```bash
cd web-frontend
npm install
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## Architecture

```
Frontend (Next.js)     Backend API (Express + tRPC)     Database (MySQL)
localhost:3000    -->  localhost:1092              -->  localhost:2100
                       (Docker container)               (Docker container)
```

## API Connection

The frontend connects to the backend via:
1. **Direct connection**: For development, uses `http://localhost:1092/trpc`
2. **Next.js proxy**: The `next.config.ts` rewrites `/trpc/*` to `http://localhost:1092/trpc/*`
3. **CORS enabled**: Backend allows requests from localhost:3000 and localhost:3001

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:1092
```

### Backend (docker-compose.yml)
```yaml
api:
  environment:
    PORT: 1092
    DATABASE_URL: mysql://dev_user:mysql_pwd@db:3306/db
```

## Troubleshooting

### API not responding
1. Check Docker containers are running: `docker ps`
2. Check API logs: `docker-compose logs api`
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
