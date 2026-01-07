# Agent Instructions for DEVICES Curriculum

Instructions for AI agents working on this project. Read this entire document before making changes.

## Project Overview

A SvelteKit curriculum website with Git-based CMS. Content is stored as Markdown files and dynamically loaded at build/runtime.

| Aspect | Details |
|--------|---------|
| Framework | SvelteKit with TypeScript |
| CMS | Sveltia CMS (Decap/Netlify CMS compatible) |
| Hosting | Netlify with serverless functions |
| Content | Markdown files with YAML frontmatter |

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
| `static/admin/config.yml` | CMS schema definition | Adding new fields (must match types) |
| `CONTENT_ARCHITECTURE.md` | Content schema documentation | After any schema changes |

### Files You Should NOT Modify (Usually)

| File | Reason |
|------|--------|
| `src/lib/data/curriculum.ts` | Just re-exports types; no logic |
| `netlify.toml` | Build config is correct |
| `svelte.config.js` | Framework config is correct |

---

## Content Schema

### Cluster (`content/clusters/{slug}.md`)

```yaml
---
title: "Cluster Title"           # Required: Display name
slug: cluster-slug               # Required: URL identifier (unique)
order: 1                         # Required: Sort position (1-based, unique)
description: "Brief summary"     # Required: 1-2 sentences
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
objectives:                      # Optional: List of strings
  - "Objective 1"
  - "Objective 2"
key_concepts:                    # Optional: List of objects
  - name: "Concept Name"
    explanation: |
      Markdown explanation...
assignment:                      # Optional: Object
  instructions: |
    Markdown instructions...
  url: "https://..."
  reading_title: "Title"
knowledge_check:                 # Optional: List of objects
  - question: "Question text?"
    hint: "Optional hint"
additional_resources:            # Optional: List of objects
  - title: "Resource Title"
    author: "Author"
    url: "https://..."
    description: "Brief description"
---

Optional markdown body for introduction...
```

### Page (`content/pages/{name}.md`)

**Home page** (`home.md`):
```yaml
---
hero_title: "Main Headline"
hero_subtitle: "Supporting text"
---
Body content...
```

**Other pages** (`about.md`, etc.):
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
4. Optionally add lessons that reference this cluster

### Modifying the CMS Schema

When adding new fields:

1. Update `src/lib/types/content.ts` with TypeScript types
2. Update `static/admin/config.yml` with CMS field definition
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
| Cluster | `{slug}.md` | `mediation-architecture.md` |
| Lesson | `{cluster}-{slug}.md` | `mediation-architecture-framing.md` |
| Page | `{name}.md` | `about.md` |
| Image | Descriptive kebab-case | `social-construction-reality.png` |

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
key_concepts:
- name: Foo
   explanation: Bar  # Wrong indent

# GOOD: Consistent 2-space indent
key_concepts:
  - name: Foo
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
├── clusters/     # 9 cluster files
├── lessons/      # 25 lesson files
├── pages/        # home.md, about.md
└── settings/     # site.json

src/lib/
├── data/
│   ├── curriculum.ts        # Type re-exports only
│   └── curriculum.server.ts # Content loading logic
└── types/
    └── content.ts           # All TypeScript types

static/admin/
└── config.yml               # CMS schema

src/routes/
├── +layout.server.ts        # Loads clusters for all pages
├── api/                     # JSON endpoints
├── feed.xml/                # RSS endpoint
└── curriculum/[cluster]/[lesson]/
    └── +page.server.ts      # Loads individual lesson
```

---

## Related Documentation

- [CONTENT_ARCHITECTURE.md](./CONTENT_ARCHITECTURE.md) — Full schema reference
- [METHODOLOGY.md](./METHODOLOGY.md) — Guide for building curricula
- [README.md](./README.md) — Project overview
