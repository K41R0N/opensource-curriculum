# Multi-CMS Architecture Plan

This document outlines the architecture for supporting multiple CMS providers (Sveltia, Notion, Obsidian) switchable via environment variables.

---

## Overview

The curriculum platform can source content from different CMS providers without code changes. Users select their provider via a Netlify environment variable:

```bash
CMS_PROVIDER=sveltia  # Default - Git-based with web UI
CMS_PROVIDER=notion   # Notion databases as content source
CMS_PROVIDER=obsidian # File-based with local Obsidian editing
```

---

## Architecture

### Adapter Pattern

All CMS providers implement a common interface:

```typescript
// src/lib/cms/types.ts
interface CMSAdapter {
  loadClusters(): Promise<Cluster[]>;
  loadLessons(clusters: Cluster[]): Promise<void>;
  loadCurriculum(): Promise<Cluster[]>;
  loadLesson(clusterSlug: string, lessonSlug: string): Promise<LessonPageData>;
  loadHomePage(): Promise<HomePage>;
  loadAboutPage(): Promise<AboutPage>;
  loadSettings(): Promise<SiteSettings>;
}
```

### Factory Pattern

```typescript
// src/lib/cms/index.ts
import { env } from '$env/dynamic/private';
import { FileAdapter } from './adapters/file';
import { NotionAdapter } from './adapters/notion';

export function getCMSAdapter(): CMSAdapter {
  const provider = env.CMS_PROVIDER || 'sveltia';

  switch (provider) {
    case 'notion':
      return new NotionAdapter();
    case 'obsidian':
    case 'sveltia':
    default:
      return new FileAdapter();
  }
}
```

---

## Provider Details

### 1. Sveltia CMS (Default)

**How it works:**
- Content stored in `content/` folder as Markdown files
- Web-based CMS at `/admin/` for editing
- Changes committed directly to Git repository
- Requires OAuth setup (see `docs/cms-setup.md`)

**Environment Variables:**
```bash
CMS_PROVIDER=sveltia  # or omit (default)
```

**Pros:**
- Visual editing UI
- Relation fields between content types
- Image uploads

**Cons:**
- Requires OAuth worker setup
- Web-only editing

---

### 2. Notion

**How it works:**
- Content stored in Notion databases
- Fetched via Notion API at build time
- Cached for performance
- No admin UI needed - use Notion directly

**Environment Variables:**
```bash
CMS_PROVIDER=notion
NOTION_TOKEN=secret_xxx           # Integration token
NOTION_CLUSTERS_DB=xxx            # Clusters database ID
NOTION_LESSONS_DB=xxx             # Lessons database ID
NOTION_SETTINGS_PAGE=xxx          # Settings page ID
```

**Notion Database Schema:**

| Clusters Database | Property Type |
|-------------------|---------------|
| Title | Title |
| Slug | Text |
| Order | Number |
| Description | Text |
| Overview | Text (rich text body) |

| Lessons Database | Property Type |
|------------------|---------------|
| Title | Title |
| Slug | Text |
| Cluster | Relation → Clusters |
| Order | Number |
| Author | Text |
| Description | Text |
| Featured Image | Files & Media |
| Objectives | Multi-select or Text |
| Content | Text (page body) |
| Key Concepts | Relation → Concepts DB (optional) |

**Implementation Notes:**
- Notion API is slow (~500ms per request) - must cache aggressively
- Notion blocks need transformation to HTML/Markdown
- Consider using [notion-cms](https://github.com/n6g7/notion-cms) library
- Build-time fetch with ISR (Incremental Static Regeneration) recommended

**Pros:**
- No OAuth setup needed
- Familiar Notion interface
- Real-time collaboration
- Mobile editing via Notion app

**Cons:**
- API rate limits
- Block-to-HTML transformation complexity
- No native relation fields (need separate databases)

---

### 3. Obsidian

**How it works:**
- Same file-based content as Sveltia
- User opens `content/` folder as Obsidian vault
- Edits locally, commits/pushes to trigger deploy
- No admin UI - pure local workflow

**Environment Variables:**
```bash
CMS_PROVIDER=obsidian
```

**Setup:**
1. Clone repository locally
2. Open `content/` folder as Obsidian vault
3. Install Obsidian Git plugin for sync
4. Edit markdown files with full Obsidian features

**Obsidian-Specific Enhancements:**
- Could add `.obsidian/` templates matching content schema
- Dataview queries for content overview
- Wikilinks for internal references

**Pros:**
- Full local control
- Offline editing
- Rich plugin ecosystem
- Graph view for content relationships
- No authentication needed

**Cons:**
- Requires Git knowledge
- No web-based editing
- Manual frontmatter management

---

## Implementation Plan

### Phase 1: Refactor Current Code (Non-Breaking)

1. Create `src/lib/cms/` directory structure
2. Extract current file-based loading into `FileAdapter`
3. Create adapter factory with environment variable check
4. Update all data loading to use factory
5. **No changes to content structure or templates**

```
src/lib/cms/
├── index.ts              # Factory + exports
├── types.ts              # CMSAdapter interface
├── adapters/
│   ├── file.ts           # Current implementation
│   └── notion.ts         # Notion implementation
└── utils/
    ├── markdown.ts       # Shared markdown parsing
    └── cache.ts          # Caching utilities
```

### Phase 2: Notion Adapter

1. Add `@notionhq/client` dependency
2. Implement `NotionAdapter` class
3. Create block-to-markdown transformer
4. Add caching layer (file-based or KV)
5. Create Notion database templates

### Phase 3: Obsidian Enhancements (Optional)

1. Add `.obsidian/` templates to repo
2. Document Obsidian Git plugin setup
3. Create Dataview queries for content management

### Phase 4: Admin UI Conditional Rendering

1. Hide `/admin/` route when `CMS_PROVIDER !== 'sveltia'`
2. Show appropriate "Edit Content" instructions per provider

---

## Environment Variable Reference

| Variable | Provider | Required | Description |
|----------|----------|----------|-------------|
| `CMS_PROVIDER` | All | No | `sveltia` (default), `notion`, or `obsidian` |
| `NOTION_TOKEN` | Notion | Yes | Notion Integration token |
| `NOTION_CLUSTERS_DB` | Notion | Yes | Clusters database ID |
| `NOTION_LESSONS_DB` | Notion | Yes | Lessons database ID |
| `NOTION_SETTINGS_PAGE` | Notion | Yes | Settings page ID |

---

## Migration Path

### From Sveltia to Notion

1. Set up Notion databases matching schema
2. Export content from `content/` folder
3. Import into Notion (manual or scripted)
4. Update environment variables
5. Redeploy

### From Sveltia to Obsidian

1. No migration needed - same content files
2. Update `CMS_PROVIDER=obsidian`
3. Set up local Obsidian vault
4. Disable `/admin/` route

### From Notion to Sveltia/Obsidian

1. Export Notion databases to Markdown
2. Place in `content/` folder
3. Update environment variables
4. Redeploy

---

## Open Questions

1. **Caching strategy for Notion**: File-based cache vs. Cloudflare KV vs. build-time only?
2. **Notion block complexity**: Support full Notion blocks or just basic text/lists?
3. **Key Concepts in Notion**: Separate database with relations, or inline JSON?
4. **Image handling**: Notion images expire - need to proxy or download?

---

## Resources

- [Notion API Documentation](https://developers.notion.com/)
- [notion-cms library](https://github.com/n6g7/notion-cms)
- [Obsidian Git Plugin](https://github.com/denolehov/obsidian-git)
- [Using Notion as a CMS](https://www.thisdot.co/blog/using-notion-as-a-cms)
