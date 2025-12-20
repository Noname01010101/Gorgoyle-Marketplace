# Migration to pnpm and Husky Setup

This project has been configured to use pnpm instead of npm and includes Husky for git hooks.

## Initial Setup

1. **Install pnpm** (if not already installed):
   ```bash
   npm install -g pnpm
   ```

2. **Remove old npm dependencies**:
   ```bash
   pnpm clean
   ```

3. **Install dependencies with pnpm**:
   ```bash
   pnpm install
   ```

4. **Initialize Husky**:
   ```bash
   pnpm prepare
   ```

## Available Scripts

### Root Level Scripts

- `pnpm clean` - Clean all workspaces (removes dist, .next, node_modules, .turbo)
- `pnpm typecheck` - Run TypeScript type checking across all workspaces
- `pnpm lint` - Run linting across all workspaces
- `pnpm test` - Run tests in all workspaces

### API Workspace Scripts

- `pnpm --filter api clean` - Clean API build artifacts
- `pnpm --filter api typecheck` - Type check API
- `pnpm --filter api lint` - Lint API code
- `pnpm --filter api test` - Run API tests
- `pnpm --filter api build` - Build API
- `pnpm --filter api host` - Start API server

### Web Frontend Workspace Scripts

- `pnpm --filter web-frontend clean` - Clean web-frontend build artifacts
- `pnpm --filter web-frontend typecheck` - Type check web-frontend
- `pnpm --filter web-frontend lint` - Lint web-frontend code
- `pnpm --filter web-frontend dev` - Start development server
- `pnpm --filter web-frontend build` - Build for production
- `pnpm --filter web-frontend start` - Start production server

## Git Hooks

Husky has been configured with the following hooks:

- **pre-commit**: Runs `pnpm typecheck` and `pnpm lint`
- **pre-push**: Runs `pnpm test`

These hooks ensure code quality before committing and pushing changes.

## Package Manager Enforcement

The project is configured with `"packageManager": "pnpm@9.0.0"` to ensure consistency across all developers.

## Workspace Configuration

The project uses pnpm workspaces defined in `pnpm-workspace.yaml`:
- api
- web-frontend
