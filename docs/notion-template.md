# Notion Database Template

This document provides the exact Notion database structure needed to use Notion as your CMS.

---

## Quick Setup

1. **Create a Notion Integration** at [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. **Copy the template** below to your Notion workspace
3. **Share databases** with your integration
4. **Copy database IDs** to environment variables

---

## Database 1: Clusters

Create a database named "Clusters" with these properties:

| Property Name | Property Type | Required | Notes |
|---------------|---------------|----------|-------|
| Title | Title | Yes | Cluster name (e.g., "Getting Started") |
| Slug | Text | Yes | URL-safe identifier (e.g., "getting-started") |
| Order | Number | Yes | Display order (1, 2, 3...) |
| Description | Text | Yes | 1-2 sentence summary |
| Overview | Text | No | Longer introduction (supports markdown) |

**Example Row:**
```
Title: Getting Started
Slug: getting-started
Order: 1
Description: The conceptual groundwork for understanding this curriculum.
Overview: This cluster introduces the foundational concepts...
```

---

## Database 2: Lessons

Create a database named "Lessons" with these properties:

| Property Name | Property Type | Required | Notes |
|---------------|---------------|----------|-------|
| Title | Title | Yes | Lesson name |
| Slug | Text | Yes | URL-safe identifier |
| Cluster | Relation → Clusters | Yes | Link to parent cluster |
| Order | Number | Yes | Order within cluster (1, 2, 3...) |
| Author | Text | No | Author of primary reading |
| Description | Text | Yes | 1-2 sentence summary |
| Featured Image | Files & media | No | Hero image for lesson |
| Objectives | Text | No | Learning objectives (one per line) |
| Content | Text | No | Main lesson body (markdown) |

**Example Row:**
```
Title: Why Curriculum?
Slug: why-curriculum
Cluster: → Getting Started
Order: 1
Author:
Description: Understanding the value of self-directed learning paths.
Objectives:
  - Understand the philosophy behind structured curricula
  - Identify what makes a curriculum effective
Content: ## The Case for Self-Directed Learning...
```

---

## Database 3: Key Concepts (Optional)

For complex lessons with multiple key concepts:

| Property Name | Property Type | Required | Notes |
|---------------|---------------|----------|-------|
| Name | Title | Yes | Concept name |
| Lesson | Relation → Lessons | Yes | Parent lesson |
| Explanation | Text | Yes | Detailed explanation (markdown) |
| Order | Number | No | Display order within lesson |

**Alternative:** Store key concepts as JSON in a Lessons text property:
```json
[
  {"name": "Concept 1", "explanation": "Explanation here..."},
  {"name": "Concept 2", "explanation": "Another explanation..."}
]
```

---

## Database 4: Pages

Create a database named "Pages" with these properties:

| Property Name | Property Type | Required | Notes |
|---------------|---------------|----------|-------|
| Title | Title | Yes | Page title |
| Slug | Text | Yes | Page identifier (e.g., "about", "home") |
| Subtitle | Text | No | Page subtitle |
| Tagline | Text | No | For home page only |
| CTA Text | Text | No | For home page button |
| Body | Text | Yes | Page content (markdown) |

**Home Page Row:**
```
Title: Building Curricula
Slug: home
Tagline: A meta-curriculum about creating curricula
CTA Text: Begin Reading
Body: (optional approach section)
```

**About Page Row:**
```
Title: About This Curriculum
Slug: about
Subtitle: Why this exists and who it's for
Body: This curriculum was created to...
```

---

## Page: Settings

Create a single page named "Site Settings" with these properties in the page body or as database properties:

| Setting | Value |
|---------|-------|
| Site Title | Your Curriculum Name |
| Description | SEO description (1-2 sentences) |
| Author | Your Name |
| Author URL | https://your-site.com |
| Footer Text | Built for depth, not breadth. |

---

## Getting Database IDs

1. Open each database in Notion
2. Click "Share" → "Copy link"
3. The URL format is: `notion.so/{workspace}/{database_id}?v=...`
4. Copy the database_id portion (32 characters)

**Example:**
```
URL: https://notion.so/myworkspace/abc123def456...?v=xyz
Database ID: abc123def456...
```

---

## Integration Setup

### Step 1: Create Integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Name it (e.g., "Curriculum CMS")
4. Select your workspace
5. Under Capabilities, enable:
   - Read content
   - No other permissions needed
6. Copy the "Internal Integration Token"

### Step 2: Share Databases

For each database (Clusters, Lessons, Pages):

1. Open the database
2. Click "..." menu → "Add connections"
3. Select your integration
4. Click "Confirm"

### Step 3: Configure Environment

In Netlify (or your `.env` file):

```bash
CMS_PROVIDER=notion
NOTION_TOKEN=secret_abc123...
NOTION_CLUSTERS_DB=abc123...
NOTION_LESSONS_DB=def456...
NOTION_PAGES_DB=ghi789...
```

---

## Content Workflow

With Notion as your CMS:

1. **Create content** directly in Notion
2. **Push to deploy** (webhook or manual)
3. **Site rebuilds** fetching fresh content from Notion API

### Automatic Deploys (Optional)

Use a Notion webhook service to trigger Netlify builds:
- [Notion Webhooks](https://www.notion-webhooks.com/)
- [Make.com](https://www.make.com/) with Notion trigger
- Manual: Netlify build hook

---

## Data Transformation

The Notion adapter transforms Notion properties to our schema:

```
Notion Property     →    TypeScript Interface
─────────────────────────────────────────────
Title property      →    title: string
Text property       →    slug/description: string
Number property     →    order: number
Relation property   →    cluster: string (slug)
Files property      →    featured_image: string (URL)
Rich text           →    content: string (markdown)
```

### Rich Text to Markdown

Notion rich text blocks are converted:

```
Notion                          Markdown
────────────────────────────────────────
Bold text                   →   **Bold text**
Italic text                 →   *Italic text*
Code                        →   `code`
Heading 1                   →   # Heading 1
Heading 2                   →   ## Heading 2
Bulleted list               →   - Item
Numbered list               →   1. Item
```

---

## Limitations

1. **API Speed**: Notion API is slow (~500ms per request). Content is cached at build time.

2. **Image Expiration**: Notion-hosted images have expiring URLs. Consider:
   - Downloading images at build time
   - Using external image hosting
   - Proxying through Cloudflare

3. **Complex Fields**: Key concepts, knowledge checks, and resources may need separate databases or JSON-in-text fields.

4. **Rate Limits**: Notion API has rate limits. Large curricula may need batched fetching.

---

## Template Duplication

To quickly set up, duplicate this template workspace:

> **TODO**: Create and link public Notion template

Or create databases manually following the schemas above.
