---
applyTo: 'api/**'
---

# API backend Instructions

- After opening any terminal, navigate to the `api` directory by running:
  ```bash
  cd api
  ```

- before running any command related to running the project, chack out package.json scripts and run them with npm run <name-of-script>.

- To push changes to the database schema, use Prisma Migrations. First, make your schema changes in `prisma/schema.prisma`, then run:
  ```bash
  npx prisma db push
  ```

- For development, seed the database with initial data by running:
  ```bash
  npm run seed
  ```
