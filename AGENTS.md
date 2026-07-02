# AGENTS.md

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
| `workers/cms-auth/*` | Cloudflare Worker config — do not touch |

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
hidden_sections:                 # Optional: hide without deleting
  - blocks
  - assignment
assignment:                      # Optional: structured assignment
  instructions: |
    Markdown instructions...
  url: "https://..."
  reading_title: "Title"
blocks:                          # Optional: max 15 typed content blocks
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

The lesson body goes here in markdown. This IS the lesson — not just an intro.
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

## Blocks Discipline

Blocks are **supplementary cards** that render alongside the lesson body. They are NOT the lesson itself.

### When to use blocks

- **1-2 blocks per lesson maximum.** More than that creates visual noise.
- Use `objectives` at the start of a cluster's first lesson to set expectations.
- Use `concept` to define a single key term the lesson introduces.
- Use `tip` or `important` for a single critical takeaway.
- Use `resource` to link one essential external reading.
- Use `check` for a single self-assessment question.

### When NOT to use blocks

- Do not use blocks to teach the lesson. The markdown body teaches the lesson.
- Do not use blocks to list every concept. Pick the ONE most important.
- Do not use `objectives` on every lesson — only where orientation is needed.
- Do not use `additional_resources` lists. One resource block is enough.

### The "Do This Now" Convention

Instead of using the frontmatter `assignment:` field, lessons can include a `## Do This Now` section at the end of their markdown body. The system automatically extracts this section and surfaces it as a structured assignment in the JSON API and for AI agents.

This is preferred because:
- The assignment is part of the lesson's narrative flow
- It reads naturally in the rendered page
- It's still machine-readable for agents via the API

### `hidden_sections`

To hide blocks or assignments without deleting them from the file:
```yaml
hidden_sections:
  - blocks      # Hides all blocks
  - assignment  # Hides the assignment card
  - body        # Hides the markdown body (rare)
```

---

## Theming Guide

The visual design lives entirely in `src/app.css` and the page-level `<style>` blocks. You can completely transform the look without touching content or CMS config.

### Safe to change (will not break CMS or content)

| File | What to customize |
|------|-------------------|
| `src/app.css` | CSS variables (colors, fonts, spacing, shadows, radius) |
| `src/app.html` | Font loading (`<link>` tags for Google Fonts or `@font-face`) |
| `src/routes/+page.svelte` | Homepage layout and styles |
| `src/routes/+layout.svelte` | Navigation and footer styles |
| `src/routes/curriculum/+page.svelte` | Cluster listing styles |
| `src/routes/curriculum/[cluster]/+page.svelte` | Lesson list styles |
| `src/routes/curriculum/[cluster]/[lesson]/+page.svelte` | Lesson reading styles |
| `src/routes/about/+page.svelte` | About page styles |

### NOT safe to change (will break things)

| File | Why |
|------|-----|
| `src/lib/data/curriculum.server.ts` | Content loading logic |
| `src/lib/types/content.ts` | Type definitions |
| `static/admin/config.template.yml` | CMS field schema |
| `netlify.toml` | Build/deploy config |
| `workers/cms-auth/*` | Auth worker config |

### CSS Variable System

The template uses CSS custom properties for all visual tokens. Change these in `:root` to transform the entire site:

```css
/* Colors */
--color-primary          /* Main brand color (buttons, links, accents) */
--color-primary-hover    /* Hover state */
--color-background       /* Page background */
--color-surface          /* Card/component backgrounds */
--color-surface-elevated /* Elevated surfaces */
--color-text             /* Primary text */
--color-text-muted       /* Secondary text */
--color-text-inverse     /* Text on primary-colored backgrounds */
--color-border           /* Default borders */
--color-border-light     /* Subtle borders */

/* Typography */
--font-heading           /* Display/title font family */
--font-body              /* Body text font family */
--font-mono              /* Code font family */

/* Shape & Motion */
--radius-base            /* Corner roundness */
--shadow-sm / --shadow-md /* Elevation shadows */
--transition-base        /* Animation timing */
```

### Design Transformation Workflow

1. Define your brand personality in `.impeccable.md`
2. Choose fonts and add them to `src/app.html`
3. Set CSS variables in `src/app.css` `:root`
4. Adjust page-level `<style>` blocks for layout changes
5. Test all pages: home, curriculum list, cluster, lesson, about
6. Verify CMS still works at `/admin`

---

## LLM-Friendly Endpoints

The site exposes content for AI agents at multiple levels of detail:

| Endpoint | Purpose | Best for |
|----------|---------|----------|
| `/llms-full.txt` | Every lesson body in one file | One-shot context loading |
| `/llms.txt` | Course index with URLs and agent guidance | Orientation and navigation |
| `/api/curriculum.json` | Structured JSON with optional content | Programmatic access |
| `/api/curriculum.json?content=true` | JSON with full HTML content + assignments | Rich integration |
| `/api/manifest.json` | Schema.org JSON-LD | Search engines |
| `/feed.xml` | RSS 2.0 | Syndication |
| `/sitemap.xml` | URL list | Crawlers |

### Agent Guidance Pattern

The `/llms.txt` and `/llms-full.txt` endpoints include a "How To Help A User" section that instructs agents to:
1. Read the lesson before guiding the user
2. Stay faithful to the course's own frameworks
3. Help the user do the assignment — not do it for them
4. Reference companion tools when relevant

---

## Common Tasks

### Adding a New Lesson

1. Create `content/lessons/{cluster-slug}-{lesson-slug}.md`
2. Add YAML frontmatter with all required fields
3. Ensure `cluster` field matches an existing cluster's slug
4. Ensure `order` is unique within that cluster
5. Write the lesson body in markdown (this is the actual teaching content)
6. Optionally add a `## Do This Now` section at the end for the assignment
7. Optionally add 1-2 blocks for key concepts or resources

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
├── clusters/     # Cluster files
├── lessons/      # Lesson files
├── pages/        # home.md, about.md
└── settings/     # site.json

src/lib/
├── data/
│   ├── curriculum.ts        # Type re-exports only
│   └── curriculum.server.ts # Content loading + Do This Now extraction
└── types/
    └── content.ts           # All TypeScript types

static/admin/
└── config.template.yml      # CMS schema template (config.yml generated at build)

workers/
└── cms-auth/
    ├── index.js             # OAuth worker code
    └── wrangler.toml        # Worker config (DO NOT MODIFY)

src/routes/
├── +layout.server.ts        # Loads clusters for all pages
├── api/                     # JSON endpoints
├── feed.xml/                # RSS endpoint
├── llms.txt/                # Agent guidance (short index)
├── llms-full.txt/           # Agent guidance (full course dump)
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
| [.impeccable.md](./.impeccable.md) | Brand personality and design system template |
| [DESIGN_TRANSFORMATION.md](./DESIGN_TRANSFORMATION.md) | Visual design documentation |
| [docs/cms-setup.md](./docs/cms-setup.md) | CMS auth configuration |
| [docs/styling-guide.md](./docs/styling-guide.md) | Visual customization guide |
| [README.md](./README.md) | Project overview |
