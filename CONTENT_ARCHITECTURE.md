# Content Architecture

This document defines the content model for the DEVICES Curriculum. The architecture is **front-end agnostic** - any presentation layer can consume this content as long as it respects the schema.

## Design Principles

1. **Semantic Naming**: Field names describe WHAT the content is, not WHERE it appears
2. **Content Completeness**: Content is meaningful without any presentation layer
3. **Single Source of Truth**: The CMS schema defines all content structure
4. **Relationship-Based**: Content types reference each other by slug, not by ID
5. **Progressive Enhancement**: Required fields are minimal; optional fields add richness

---

## Content Types

### 1. Cluster

A thematic grouping of related lessons. Clusters organize the curriculum into conceptual units.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Display name of the cluster |
| `slug` | string | yes | URL-safe identifier (unique) |
| `order` | integer | yes | Sort position in curriculum (1-based) |
| `description` | text | yes | Brief summary (1-2 sentences) |
| `body` | markdown | no | Extended overview content |

**File Location**: `content/clusters/{slug}.md`

**Example**:
```yaml
---
title: "Mediation Architecture & Reality Framing"
slug: mediation-architecture
order: 1
description: "How devices function as mediating instruments that frame reality."
---

Extended overview content goes here as markdown body...
```

---

### 2. Lesson

An individual learning unit within a cluster. Lessons are the core content of the curriculum.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Display name of the lesson |
| `slug` | string | yes | URL-safe identifier (unique within cluster) |
| `cluster` | relation | yes | Reference to parent cluster by slug |
| `order` | integer | yes | Sort position within cluster (1-based) |
| `description` | text | yes | Brief summary (1-2 sentences) |
| `author` | string | no | Original author of the source material |
| `featured_image` | image | no | Hero/thumbnail image |
| `objectives` | list[string] | no | Learning objectives |
| `key_concepts` | list[KeyConcept] | no | Core concepts explained |
| `assignment` | Assignment | no | Primary reading/task |
| `knowledge_check` | list[Question] | no | Reflection questions |
| `additional_resources` | list[Resource] | no | Supplementary materials |
| `body` | markdown | no | Introduction/overview content |

**File Location**: `content/lessons/{cluster}-{slug}.md`

**Nested Types**:

```yaml
# KeyConcept
- name: string (required)
  explanation: markdown (required)

# Assignment
assignment:
  instructions: markdown (required)
  url: string (optional)
  reading_title: string (optional)

# Question
- question: string (required)
  hint: text (optional)

# Resource
- title: string (required)
  author: string (optional)
  url: string (optional)
  description: text (optional)
```

---

### 3. Page

Static pages with flexible content (About, Home, etc.).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Page title |
| `subtitle` | string | no | Secondary heading |
| `body` | markdown | yes | Main content |

**File Location**: `content/pages/{name}.md`

**Special Pages**:

#### Home Page (`content/pages/home.md`)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Main curriculum title (book cover) |
| `tagline` | text | yes | One-sentence value proposition |
| `cta_text` | string | yes | Call-to-action button text |
| `body` | markdown | no | Optional approach/philosophy section |

#### About Page (`content/pages/about.md`)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Page title |
| `subtitle` | string | no | Subheading |
| `body` | markdown | yes | Main content |

---

### 4. Site Settings

Global configuration that applies across all pages.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Site name |
| `description` | text | yes | SEO/meta description |
| `author` | string | yes | Site author/owner |
| `substack_url` | string | no | External blog link |
| `footer_text` | string | no | Footer tagline |

**File Location**: `content/settings/site.json`

---

## Content Relationships

```
┌─────────────────────────────────────────────────────────┐
│                    Site Settings                         │
│                  (content/settings/)                     │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      Pages                               │
│                  (content/pages/)                        │
│              home.md, about.md, etc.                     │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     Clusters                             │
│                 (content/clusters/)                      │
│         Ordered collection of thematic units             │
└─────────────────────────────────────────────────────────┘
                           │
                           │ 1:many (cluster → lessons)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      Lessons                             │
│                  (content/lessons/)                      │
│     References cluster by slug, ordered within cluster   │
└─────────────────────────────────────────────────────────┘
```

---

## URL Structure

The URL structure is **derived from content**, not hardcoded:

| Content Type | URL Pattern | Example |
|--------------|-------------|---------|
| Home | `/` | `/` |
| About | `/about` | `/about` |
| Curriculum Index | `/curriculum` | `/curriculum` |
| Cluster | `/curriculum/{cluster.slug}` | `/curriculum/mediation-architecture` |
| Lesson | `/curriculum/{cluster.slug}/{lesson.slug}` | `/curriculum/mediation-architecture/framing` |
| Admin | `/admin` | `/admin` |

---

## Component Contracts

Components consume content through **typed interfaces**. The presentation layer must implement these contracts.

### ClusterCard
Displays a cluster in a list/grid context.

**Required Data**:
```typescript
interface ClusterCardData {
  id: number;           // cluster.order
  title: string;        // cluster.title
  slug: string;         // cluster.slug
  description: string;  // cluster.description
  lessonCount: number;  // cluster.lessons.length
}
```

### LessonCard
Displays a lesson in a list context.

**Required Data**:
```typescript
interface LessonCardData {
  title: string;        // lesson.title
  slug: string;         // lesson.slug
  description: string;  // lesson.description
  author?: string;      // lesson.author
  order: number;        // lesson.order
  clusterSlug: string;  // parent cluster slug
}
```

### LessonFull
Displays complete lesson content.

**Required Data**:
```typescript
interface LessonFullData {
  title: string;
  slug: string;
  description: string;
  author?: string;
  content?: string;              // markdown body
  featured_image?: string;
  objectives?: string[];
  key_concepts?: KeyConcept[];
  assignment?: Assignment;
  knowledge_check?: Question[];
  additional_resources?: Resource[];
}
```

### Navigation Context
For prev/next navigation within a cluster.

**Required Data**:
```typescript
interface NavigationContext {
  cluster: { title: string; slug: string; id: number };
  currentIndex: number;          // 0-based position in cluster
  prevLesson?: { title: string; slug: string };
  nextLesson?: { title: string; slug: string };
}
```

---

## Migration Guidelines

When redesigning the front-end:

### DO:
- Keep all content files unchanged
- Keep the CMS config unchanged
- Create new components that consume the same data contracts
- Use the same URL structure (or implement redirects)

### DON'T:
- Rename content fields to match new component names
- Add presentation-specific fields to content (e.g., `show_sidebar`)
- Hardcode content in components
- Change the content directory structure

### If You Need New Fields:
1. Document the field in this file first
2. Add it to the CMS config
3. Make it optional to avoid breaking existing content
4. Update the TypeScript interfaces

---

## File Structure

```
content/
├── clusters/
│   ├── mediation-architecture.md
│   ├── embodiment-repetition.md
│   └── ... (9 total)
├── lessons/
│   ├── mediation-architecture-framing.md
│   ├── mediation-architecture-culture-in-action.md
│   └── ... (25 total)
├── pages/
│   ├── home.md
│   └── about.md
└── settings/
    └── site.json

static/
├── admin/
│   ├── index.html          # CMS entry point
│   └── config.yml          # CMS schema (mirrors this doc)
└── images/
    └── lessons/            # Lesson images
```

---

## TypeScript Definitions

For front-end implementations, use these types:

```typescript
// content/types.ts

export interface Cluster {
  id: number;              // derived from order
  title: string;
  slug: string;
  description: string;
  overview?: string;       // markdown body
  lessons: Lesson[];       // populated by loader
}

export interface Lesson {
  id: string;              // "{cluster.id}-{order}"
  title: string;
  slug: string;
  cluster: string;         // cluster slug reference
  order: number;
  description: string;
  author?: string;
  featured_image?: string;
  objectives?: string[];
  key_concepts?: KeyConcept[];
  assignment?: Assignment;
  knowledge_check?: Question[];
  additional_resources?: Resource[];
  content?: string;        // markdown body
}

export interface KeyConcept {
  name: string;
  explanation: string;     // markdown
}

export interface Assignment {
  instructions: string;    // markdown
  url?: string;
  reading_title?: string;
}

export interface Question {
  question: string;
  hint?: string;
}

export interface Resource {
  title: string;
  author?: string;
  url?: string;
  description?: string;
}

export interface SiteSettings {
  title: string;
  description: string;
  author: string;
  substack_url?: string;
  footer_text?: string;
}

export interface Page {
  title: string;
  subtitle?: string;
  body: string;            // markdown
}

export interface HomePage {
  title: string;           // Main curriculum title (book cover)
  tagline: string;         // One-sentence value proposition
  cta_text: string;        // Call-to-action button text
  body?: string;           // Optional approach/philosophy section (markdown)
}
```

---

## Machine-Readable Endpoints

The curriculum provides multiple machine-readable formats for programmatic access, SEO, and AI agents.

### API Endpoints

| Endpoint | Format | Description |
|----------|--------|-------------|
| `/api/curriculum.json` | JSON | Full curriculum data with all clusters and lessons |
| `/api/manifest.json` | JSON-LD | Schema.org structured data for the course |
| `/feed.xml` | RSS 2.0 | Syndication feed for all content |
| `/sitemap.xml` | XML | Search engine sitemap |
| `/robots.txt` | Text | Crawler guidance |
| `/llms.txt` | Text | AI agent guidance |

### JSON API (`/api/curriculum.json`)

Returns complete curriculum data. Supports query parameters:

```bash
# Full curriculum
GET /api/curriculum.json

# Filter by cluster
GET /api/curriculum.json?cluster=mediation-architecture

# Without URLs (lighter payload)
GET /api/curriculum.json?urls=false
```

**Response Structure**:
```json
{
  "$schema": "https://devices-curriculum.netlify.app/api/schema.json",
  "version": "1.0",
  "generated": "2025-01-03T00:00:00.000Z",
  "site": {
    "name": "DEVICES Curriculum",
    "url": "https://devices-curriculum.netlify.app",
    "description": "..."
  },
  "stats": {
    "totalClusters": 9,
    "totalLessons": 25
  },
  "clusters": [...]
}
```

### JSON-LD Manifest (`/api/manifest.json`)

Schema.org structured data using `Course` and `LearningResource` types. Useful for:
- Rich search results
- Knowledge graph integration
- Semantic web applications

### LLMs.txt (`/llms.txt`)

Human and machine-readable guidance for AI agents explaining:
- What the site is about
- How to access content programmatically
- Content structure overview
- Usage guidelines

### RSS Feed (`/feed.xml`)

Standard RSS 2.0 feed including:
- All clusters as items
- All lessons as items
- Category tags for organization

### Design Principles for Machine Endpoints

1. **Same Source**: All endpoints use `loadCurriculum()` - same data as human UI
2. **CORS Enabled**: API endpoints allow cross-origin requests
3. **Cached**: All endpoints have appropriate cache headers
4. **Self-Documenting**: Include schema references and metadata

---

## Versioning

- **Schema Version**: 1.0
- **Last Updated**: 2025-01-03
- **Breaking Changes**: None yet

When making breaking changes to the schema:
1. Increment the major version
2. Document migration steps
3. Update all content files
4. Update the CMS config
