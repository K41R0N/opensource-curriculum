# Agent Instructions

Instructions for AI agents working on this project. Read this entire document before making changes.

## Project Overview

A SvelteKit curriculum website with Git-based CMS. Content is stored as Markdown files and dynamically loaded at build/runtime. This is a **fork-friendly template** — replace the starter content with your own curriculum while keeping the infrastructure.

| Aspect | Details |
|--------|---------|
| Framework | SvelteKit with TypeScript |
| CMS | Sveltia CMS (Decap/Netlify CMS compatible) |
| Hosting | Netlify with serverless functions |
| Content | Markdown files with YAML frontmatter |
| Auth | Cloudflare Worker (GitHub OAuth) |

### Key Architecture Principle

**Content is dynamically loaded.** There is no manual "curriculum.ts" to update. When you add/edit content files, the site automatically reflects changes.

```
content/clusters/*.md  ──┐
content/lessons/*.md   ──┼──▶ loadCurriculum() ──▶ Website + APIs
content/pages/*.md     ──┘
```

---

## Critical Files

| File | Purpose | When to Modify |
|------|---------|----------------|
| `src/lib/data/curriculum.server.ts` | Loads & validates content | Changing content loading logic |
| `src/lib/types/content.ts` | TypeScript type definitions | Adding new content fields |
| `static/admin/config.template.yml` | CMS schema template | Adding new fields (must match types) |
| `CONTENT_ARCHITECTURE.md` | Content schema documentation | After any schema changes |
| `CURRICULUM_OUTLINE.md` | Course structure blueprint | When adding/restructuring clusters |

### Files You Should NOT Modify (Usually)

| File | Reason |
|------|--------|
| `src/lib/data/curriculum.ts` | Just re-exports types; no logic |
| `netlify.toml` | Build config is correct |
| `svelte.config.js` | Framework config is correct |

---

## Course Structure Template

This template ships with 7 clusters and 23 lessons demonstrating the platform. Replace with your own curriculum:

| # | Cluster | Type | Purpose |
|---|---------|------|---------|
| 1 | Getting Started | Foundation | Why depth-first learning matters |
| 2 | Building with AI | Foundation | AI-assisted curriculum building |
| 3 | Building Manually | Foundation | Step-by-step manual approach |
| 4 | Deployment & Customization | Specialization | Setup and branding |
| 5 | Working with Content | Specialization | Editing workflows |
| 6 | Making It Yours | Specialization | Visual customization |
| 7 | API & Data Access | Specialization | Programmatic access |

### Pedagogical Design

The template demonstrates **deliberate friction** — learners build understanding through effort:
- Structured reading → reflection → action
- Foundation clusters establish mental models before specialization
- Knowledge checks require honest self-evaluation

---

## Content Schema

### Cluster (`content/clusters/{slug}.md`)

```yaml
---
title: "Cluster Title"           # Required: Display name
slug: cluster-slug               # Required: URL identifier (unique)
order: 1                         # Required: Sort position (1-based, unique)
description: "Brief summary"     # Required: 1-2 sentences
is_foundation: true              # Required: true for foundation clusters
---

Optional markdown body for extended overview...
```

### Lesson (`content/lessons/{cluster}-{slug}.md`)

```yaml
---
title: "Lesson Title"            # Required
slug: lesson-slug                # Required: Unique within cluster
cluster: cluster-slug            # Required: Must match a cluster's slug
order: 1                         # Required: Position within cluster
description: "Brief summary"     # Required
author: "Author Name"            # Optional
featured_image: "/images/..."    # Optional
assignment:                      # Optional: Object
  instructions: |
    Markdown instructions...
  url: "https://..."
  reading_title: "Title"
blocks:                          # Optional: Typed content blocks (max 15)
  - type: objectives
    items: ["Objective 1", "Objective 2"]
  - type: concept
    name: "Concept Name"
    explanation: |
      Markdown explanation...
  - type: check
    question: "Question?"
    hint: "Optional hint"
  - type: resource
    title: "Resource Title"
    url: "https://..."
    description: "Brief description"
  - type: ask | example | tip | important | reflection | context
    title: "Optional override title"
    content: |
      Markdown content...
---

Optional markdown body for introduction...
```

### Page (`content/pages/{name}.md`)

**Home page** (`home.md`):
```yaml
---
title: "Curriculum Title"        # Book cover title
tagline: "One-sentence value proposition"
cta_text: "Begin Reading"
---

Optional markdown body for philosophy/approach section...
```

**About page** (`about.md`):
```yaml
---
title: "Page Title"
subtitle: "Optional subtitle"
---

Body content...
```

### Settings (`content/settings/site.json`)

```json
{
  "title": "Site Name",
  "description": "SEO description",
  "author": "Author Name",
  "substack_url": "https://...",
  "footer_text": "Footer tagline"
}
```

---

## Common Tasks

### Adding a New Lesson

1. Create `content/lessons/{cluster-slug}-{lesson-slug}.md`
2. Add YAML frontmatter with all required fields
3. Ensure `cluster` field matches an existing cluster's slug
4. Ensure `order` is unique within that cluster
5. Add markdown body content

**Validation happens at build time.** If required fields are missing or cluster doesn't exist, build fails with descriptive error.

### Adding a New Cluster

1. Create `content/clusters/{slug}.md`
2. Add YAML frontmatter with required fields
3. Ensure `order` is unique among clusters
4. Set `is_foundation: true` for "Start Here" clusters
5. Optionally add lessons that reference this cluster

### Modifying the CMS Schema

When adding new fields:

1. Update `src/lib/types/content.ts` with TypeScript types
2. Update `static/admin/config.template.yml` with CMS field definition
3. Update `CONTENT_ARCHITECTURE.md` documentation
4. Update `curriculum.server.ts` if field needs special handling

**Keep these three in sync:** Types ↔ CMS Config ↔ Documentation

### Redesigning UI Components

The UI is decoupled from content. To redesign:

1. Read component contracts in `CONTENT_ARCHITECTURE.md`
2. Components receive data via SvelteKit load functions
3. Create new `.svelte` files that consume the same data shapes
4. Content files remain unchanged

**Data flow:**
```
+layout.server.ts loads clusters ──▶ Available in all pages as data.clusters
+page.server.ts loads lesson    ──▶ Available as data.lesson, data.hasContent
```

### Testing Changes

```bash
# Type checking
pnpm check

# Build (includes content validation)
pnpm build

# Preview production build
pnpm preview
```

---

## API Endpoints

The site provides machine-readable content at:

| Endpoint | Returns |
|----------|---------|
| `/api/curriculum.json` | Full curriculum JSON with CORS |
| `/api/manifest.json` | Schema.org JSON-LD |
| `/feed.xml` | RSS 2.0 feed |
| `/sitemap.xml` | XML sitemap |
| `/llms.txt` | Human-readable site guide |
| `/robots.txt` | Crawler instructions |

These are SvelteKit server endpoints in `src/routes/`. They use the same `loadCurriculum()` function as the website.

---

## Validation Rules

The content loader enforces these rules at build time:

### Clusters
- `title`, `slug`, `order`, `description` are required
- `order` must be unique across all clusters
- `slug` must be unique

### Lessons
- `title`, `slug`, `cluster`, `order`, `description` are required
- `cluster` must reference an existing cluster's slug
- `order` must be unique within the cluster
- Filename should be `{cluster}-{slug}.md`

### Build Failures

If validation fails, you'll see errors like:
```
Error: Cluster validation errors:
  - Invalid cluster content/clusters/foo.md: missing fields: order (integer)

Error: Lesson validation errors:
  - content/lessons/bar.md (references non-existent cluster: "invalid-cluster")
```

---

## File Naming Conventions

| Content | Pattern | Example |
|---------|---------|---------|
| Cluster | `{slug}.md` | `getting-started.md` |
| Lesson | `{cluster}-{slug}.md` | `getting-started-why-curriculum.md` |
| Page | `{name}.md` | `about.md` |
| Image | Descriptive kebab-case | `featured-image.png` |

---

## YAML Gotchas

Common YAML issues to avoid:

```yaml
# BAD: Unquoted colon in value
title: Part 1: Introduction

# GOOD: Quote strings with colons
title: "Part 1: Introduction"

# BAD: Unescaped quotes
instructions: Read the author's essay

# GOOD: Use block scalar for complex text
instructions: |
  Read the author's essay "Title" carefully.

# BAD: Inconsistent indentation
blocks:
  - type: concept
   name: Foo  # Wrong indent

# GOOD: Consistent 2-space indent
blocks:
  - type: concept
    name: Foo
    explanation: Bar
```

---

## Deployment

- Push to `main` branch triggers Netlify build
- Build command: `npm run build`
- Publish directory: `build`
- Node version: 20 (set in `netlify.toml`)

**Do not:**
- Manually deploy
- Modify build settings in Netlify UI
- Push to branches other than `main` for production

---

## Quick Reference

### Required Environment

- Node.js 20+
- pnpm (preferred) or npm

### Key Commands

```bash
pnpm dev        # Development server
pnpm build      # Production build
pnpm preview    # Preview build
pnpm check      # TypeScript validation
```

### File Locations Summary

```
content/
├── clusters/     # Cluster files (7 default)
├── lessons/      # Lesson files (23 default)
├── pages/        # home.md, about.md
└── settings/     # site.json

src/lib/
├── data/
│   ├── curriculum.ts        # Type re-exports only
│   └── curriculum.server.ts # Content loading logic
└── types/
    └── content.ts           # All TypeScript types

static/admin/
└── config.template.yml      # CMS schema template (config.yml generated at build)

workers/
└── cms-auth/
    ├── index.js             # OAuth worker code
    └── wrangler.toml        # Worker config

src/routes/
├── +layout.server.ts        # Loads clusters for all pages
├── api/                     # JSON endpoints
├── feed.xml/                # RSS endpoint
└── curriculum/[cluster]/[lesson]/
    └── +page.server.ts      # Loads individual lesson
```

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| [CONTENT_ARCHITECTURE.md](./CONTENT_ARCHITECTURE.md) | Full schema reference with TypeScript types |
| [CURRICULUM_OUTLINE.md](./CURRICULUM_OUTLINE.md) | Course structure blueprint |
| [METHODOLOGY.md](./METHODOLOGY.md) | Curriculum-building philosophy |
| [.impeccable.md](./.impeccable.md) | Brand personality and design system |
| [DESIGN_TRANSFORMATION.md](./DESIGN_TRANSFORMATION.md) | Visual design documentation |
| [docs/cms-setup.md](./docs/cms-setup.md) | CMS auth configuration |
| [docs/styling-guide.md](./docs/styling-guide.md) | Visual customization guide |
| [README.md](./README.md) | Project overview |
