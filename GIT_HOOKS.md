# Git Hooks Documentation

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks that ensure code quality and consistency across the team.

## 🎯 Purpose

Git hooks automatically run checks before certain Git actions, preventing problematic code from being committed or pushed.

## 📋 Available Hooks

### 1. **pre-commit** 
Runs before each commit to ensure staged files meet quality standards.

**Checks:**
- ✨ **Lint-Staged**: Automatically formats and lints only staged files
  - Runs ESLint with auto-fix on TypeScript files
  - Runs Prettier to format code
  - Formats JSON, Markdown, and YAML files
- 📝 **Type Checking**: Verifies TypeScript types across all workspaces

**To bypass (not recommended):**
```bash
git commit --no-verify -m "your message"
```

### 2. **commit-msg**
Validates commit message format to maintain a clean git history.

**Format:** [Conventional Commits](https://www.conventionalcommits.org/)
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Allowed types:**
- `feat`: ✨ New feature for the user
- `fix`: 🐛 Bug fix
- `hotfix`: 🚑 Critical hotfix
- `docs`: 📝 Documentation changes
- `style`: 💄 Code style (formatting, missing semi-colons, etc.)
- `refactor`: ♻️  Code refactoring
- `perf`: ⚡ Performance improvements
- `test`: ✅ Adding or updating tests
- `build`: 📦 Build system or dependencies
- `ci`: 👷 CI/CD changes
- `chore`: 🔧 Other changes (maintenance, etc.)
- `revert`: ⏪ Revert previous commit
- `security`: 🔒 Security improvements or fixes
- `deps`: ⬆️  Dependency updates
- `config`: ⚙️  Configuration changes
- `wip`: 🚧 Work in progress (use sparingly)

**Allowed scopes:**
- Core: `api`, `web`, `frontend`, `monorepo`, `workspace`
- Services: `benchmarks`, `capability-matching`, `model-catalog`, `pricing`, `suggestions`
- Frontend: `components`, `pages`, `layout`, `hooks`, `utils`, `types`
- Infrastructure: `database`, `prisma`, `docker`, `deployment`
- Tooling: `husky`, `eslint`, `typescript`, `tests`, `ci`, `build`, `deps`, `config`
- Documentation: `docs`, `readme`
- Release: `release`, `changelog`

**Rules:**
- Type: required, lowercase
- Scope: recommended (warning if omitted), lowercase
- Subject: 10-72 characters, lowercase, imperative mood, no period
- Header: 15-100 characters total
- Body: optional, wrap at 100 characters, blank line before body
- Footer: optional, blank line before footer

**Examples:**
```bash
git commit -m "feat(api): add pricing comparison endpoint"
git commit -m "fix(web): resolve navigation bug on mobile"
git commit -m "docs: update README with setup instructions"
git commit -m "refactor(api): simplify model catalog service"
```

**With body and detailed commit:**
```bash
# Use 'git commit' without -m to open editor with helpful template
git commit

# Example multi-line commit:
# feat(api): add caching layer for model catalog
#
# Implements Redis caching to reduce database load and improve
# response times for frequently accessed model data. Cache
# invalidation occurs on model updates.
#
# Closes #123
```

**💡 Tip:** Run `git commit` (without `-m`) to use the project's commit message template, which includes helpful examples and guidelines.

### 3. **pre-push**
Runs before pushing to remote to ensure code builds and tests pass.

**Checks:**
- 🧪 **Tests**: Runs all unit tests across workspaces
- 🔨 **Builds**: Compiles both API and web-frontend to catch build errors

**To bypass (not recommended):**
```bash
git push --no-verify
```

### 4. **post-merge**
Runs after pulling/merging changes from remote.

**Actions:**
- 📦 Reminds you to run `pnpm install` if package.json or pnpm-lock.yaml changed
- 🗄️ Reminds you to run `pnpm --filter api prisma generate` if Prisma schema changed

### 5. **post-checkout**
Runs after switching branches.

**Actions:**
- 📦 Reminds you to run `pnpm install` if dependencies changed between branches
- 🗄️ Reminds you to update Prisma client if schema changed

## 🚀 Setup

After cloning the repository:

```bash
# Install dependencies
pnpm install

# Initialize Husky (creates .husky directory with hooks)
pnpm prepare
```

## 🛠️ Related Scripts

```bash
# Format all files
pnpm format

# Check formatting without modifying files
pnpm format:check

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Run tests
pnpm test

# Run all quality checks manually
pnpm typecheck && pnpm lint && pnpm test
```

## 🔧 Configuration Files

- **`.husky/`**: Git hook scripts
- **`commitlint.config.mjs`**: Commit message linting rules
- **`.prettierrc`**: Code formatting rules
- **`.prettierignore`**: Files to exclude from formatting
- **`package.json`**: lint-staged configuration

## 💡 Best Practices

1. **Write meaningful commit messages**: Follow the conventional commits format
2. **Commit frequently**: Small, focused commits are easier to review and revert
3. **Don't bypass hooks**: They're there to help maintain code quality
4. **Keep hooks fast**: If pre-commit is slow, consider optimizing what's checked
5. **Update dependencies regularly**: Keep hooks and tools up to date

## 🐛 Troubleshooting

### Hook fails with "command not found"
```bash
# Reinstall dependencies
pnpm install

# Reinitialize Husky
pnpm prepare
```

### Hook takes too long
```bash
# Check what's running slowly
# Consider adjusting lint-staged patterns or splitting checks
```

### Need to commit without running hooks (emergency only)
```bash
# Use --no-verify flag (not recommended)
git commit --no-verify -m "emergency fix"
```

## 📚 Additional Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [lint-staged](https://github.com/okonet/lint-staged)
- [Commitlint](https://commitlint.js.org/)
