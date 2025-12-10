---
title: Docs Quality & Checks
---

# Docs Quality — How to run checks and avoid common warnings

This page explains simple checks you can run locally to reduce markdown warnings and keep docs consistent.

1) Basic checks (bundled)

```powershell
# From repo root
powershell -ExecutionPolicy Bypass -File .\docs\check-markdown.ps1
```

What it checks

- Frontmatter presence (`---` at top of file)
- Excessively long lines (over 200 chars)

2) Recommended linters

- `markdownlint` (npm):

```powershell
npm install -g markdownlint-cli
markdownlint "docs/**/*.md"
```

3) CI suggestion

- Add `markdownlint` to your CI pipeline (run on changed files), and run `docs/check-markdown.ps1` as a lightweight preflight step.

4) Fixing common issues

- Missing frontmatter: add a minimal frontmatter block:

```yaml
---
title: Short title
---
```

- Long lines: wrap text or convert to lists/paragraphs.
