---
title: AI Commerce Store
---

# AI Commerce Store

> Visual, modular platform for AI model discovery, pricing, benchmarking, and capability matching.

---

## Quick Navigation
| Section                | Description                                 |
|------------------------|---------------------------------------------|
| [Vision & Problem](./docs/main.md)         | Platform goals, user value, solution         |
| [Backend Services](./docs/backendServices.md) | API, data models, service catalogue          |
| [Web Frontend Pages](./docs/web-frontend-pages.md) | UI, main pages, components, visuals         |
| [API Services](./docs/api-services.md)     | Endpoints, usage, data models                |
| [Setup Guide](./SETUP.md)                  | Install, run, environment, troubleshooting   |
| [Troubleshooting & FAQ](./docs/troubleshooting.md) | Common issues, FAQ, support                 |

---

## Visual Architecture

```visual
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ Frontend    │ → │ Backend API │ → │ Database    │
│ (Next.js)   │   │ (Express)   │   │ (MySQL)     │
└─────────────┘   └─────────────┘   └─────────────┘
```

---

## Project Structure

```text
api/           # Backend (Node.js, Express, Prisma)
web-frontend/  # Frontend (Next.js)
docs/          # Docs (Markdown)
docker-compose.yml
SETUP.md
README.md
```

---

## Get Started

See [Setup Guide](./SETUP.md) for step-by-step instructions.

---

## Docs & Support

- For doc updates, open a PR and tag the relevant team.
- For issues, see [Troubleshooting & FAQ](./docs/troubleshooting.md).
- VSCode (recommended)
- Git

### Getting Started

1. **Clone the repository:**

    ```sh
    git clone https://github.com/Noname01010101/ai-store.git
    cd ai-store
    ```

2. **Install dependencies:**

    ```sh
    cd api
    npm install
    # Repeat for other services as needed
    ```

3. **Setup environment:**
    - Copy `.env.dev` to `.env` in each service for local development
4. **Start database:**

    ```sh
    docker-compose up <db-service-name> --build
    ```

5. **Run Prisma migrations and seed:**

    At each backend api:

    ```sh
    npx prisma generate
    npx prisma db push
    npm run seed
    ```

6. **Start development server:**

    1. Start the apis with docker-compose.

    2. At the service you're developing's context:

    ```sh
    npm run dev
    ```

---

## Testing & Quality

- All services use Vitest for unit/integration tests
- Linting and type-checking enforced in CI
- See [Backend Services Documentation](./docs/backendServices.md#testing-strategy)

---

## Deployment

- Containerized via Docker
- Orchestrated with `docker-compose` (dev) or Kubernetes (prod)
- Blue/green and canary deploys supported
- See [Backend Services Documentation](./docs/backendServices.md#deployment--cicd)

---

## Contributing

We welcome contributions! Please:

- Read the [Platform Vision](./docs/main.md) and [Backend Services Documentation](./docs/backendServices.md)
- Open issues for bugs/feature requests
- Fork and submit PRs with clear descriptions
- Follow our [Code of Conduct](./CODE_OF_CONDUCT.md) (if present)

---

## Contact & Support

- For business/enterprise: [Contact Page](./docs/web-frontend-pages.md#contact-page)
- For technical support: open an issue or contact the Platform Engineering Team
- Slack: #platform-ops (internal)

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
