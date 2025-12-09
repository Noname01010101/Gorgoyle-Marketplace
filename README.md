# AI Commerce Store

> The authoritative platform for AI model discovery, pricing, benchmarking, and capability matching.

---

## Index

- [Platform Vision & Problem Statement](./docs/main.md)
- [Backend Services Documentation](./docs/backendServices.md)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Setup & Development](#setup--development)
- [Testing & Quality](#testing--quality)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Contact & Support](#contact--support)

---

## Architecture Overview

The AI Commerce Store is a modular, enterprise-grade platform designed to:

- Aggregate and normalize AI model metadata and pricing across providers
- Enable fast, transparent model discovery and comparison
- Provide robust APIs and a modern frontend for developers, businesses, and researchers

**Core services:**

- Model Catalog
- Pricing Engine
- Capability Matching
- Benchmarks Engine
- Equivalency/Suggestion Service

See [Backend Services Documentation](./docs/backendServices.md) for full details.

---

## Project Structure

```folder
├── api/                # Backend services (Node.js/TypeScript, Express, Prisma)
├── model-catalog-api/  # Standalone model catalog API (dev)
├── pricing-api/        # Standalone pricing API (dev)
├── web-frontend/       # Next.js frontend
├── docs/               # Enterprise documentation (Markdown)
├── docker-compose.yml  # Multi-service orchestration
└── README.md           # Project entry point
```

---

## Setup & Development

### Prerequisites

- Node.js 20+
- Docker Desktop (for DB and service orchestration)
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
