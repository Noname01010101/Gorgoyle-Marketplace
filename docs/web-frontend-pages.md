---
title: Web Frontend Pages — AI Commerce Store
---

## Web Frontend Pages

This document provides a visual and concise overview of the main pages and UI components in the AI Commerce Store web frontend (Next.js).

## Main Pages

| Page                | Path                        | Purpose / Features                                   |
|---------------------|-----------------------------|------------------------------------------------------|
| Home                | `/`                         | Landing, platform vision, quick links                |
| Benchmarks          | `/benchmarks`               | Model benchmarks, comparisons, charts                |
| Capability Matching | `/capability-matching`      | Find models by capability, filter/search UI          |
| Models              | `/models`                   | Model catalog, details, provider info                |
| Model Detail        | `/models/[name]/[version]`  | Model metadata, pricing, benchmarks, suggestions     |
| Pricing             | `/pricing`                  | Price comparison, ranges, provider breakdown         |
| Suggestions         | `/suggestions`              | Model equivalency, alternatives, recommendations     |
| Learn More          | `/learn-more`               | Platform info, docs, contact, FAQ                    |

## Key UI Components

- **Header**: Navigation, branding
- **Card**: Model/provider display
- **LoadingState**: Progress indicators
- **ErrorState**: Error feedback

## Visual Example

```file
+---------------------------------------------------+
| Header: AI Commerce Store                         |
+---------------------------------------------------+
| [ Home | Models | Benchmarks | Pricing | ... ]     |
+---------------------------------------------------+
|                                                   |
|   [ Model Cards / Charts / Filters / Details ]     |
|                                                   |
+---------------------------------------------------+
| Footer / Contact / Docs                           |
+---------------------------------------------------+
```

## Related Docs

- [Platform Vision & Problem Statement](./main.md)
- [Backend Services](./backendServices.md)

---
For UI/UX suggestions, open a PR and tag `@Frontend-Team`.
