---
title: Understanding the Data Endpoints
slug: endpoints
cluster: api-data-access
order: 1
description: "Explore the built-in APIs that expose your curriculum as structured data."
key_concepts:
  - name: "Four Built-In Endpoints"
    explanation: |
      Every curriculum automatically exposes its content through machine-readable formats:

      | Endpoint | Format | Purpose |
      |----------|--------|---------|
      | `/api/curriculum.json` | JSON | Full data for apps and AI |
      | `/feed.xml` | RSS 2.0 | Feed reader subscriptions |
      | `/sitemap.xml` | XML | Search engine indexing |
      | `/api/manifest.json` | JSON-LD | Rich snippets in search |

      These update automatically when you edit content through the CMS.
  - name: "The JSON API"
    explanation: |
      The primary endpoint is `/api/curriculum.json`. It returns your complete curriculum structure with query parameters for filtering:

      - `?cluster=getting-started` — Filter to a single cluster
      - `?urls=false` — Omit URL fields for smaller response
      - `?content=true` — Include full lesson content for AI agents
  - name: "Discovery & Syndication"
    explanation: |
      The other endpoints enable discovery and distribution:

      - **RSS Feed** (`/feed.xml`) — Subscribers get notified of new content. Works with Feedly, automation tools like Zapier, and AI agents.
      - **Sitemap** (`/sitemap.xml`) — Helps Google and other search engines index your content efficiently.
      - **Schema.org Manifest** (`/api/manifest.json`) — Enables rich snippets in search results using structured vocabulary.
assignment:
  instructions: |
    Explore each endpoint on your deployed site:

    1. **JSON API**: Visit `https://yoursite.netlify.app/api/curriculum.json`
       - Note the structure: site info, stats, clusters, and lessons
       - Try adding `?cluster=getting-started` to filter results

    2. **RSS Feed**: Visit `https://yoursite.netlify.app/feed.xml`
       - Copy this URL and add it to an RSS reader if you use one
       - Notice how clusters and lessons appear as separate items

    3. **Sitemap**: Visit `https://yoursite.netlify.app/sitemap.xml`
       - See how every page is listed with priorities
       - This is what Google sees when it crawls your site

    4. **Manifest**: Visit `https://yoursite.netlify.app/api/manifest.json`
       - Notice the Schema.org vocabulary (`@type`, `@context`)
       - Find the `_links` section that references all other endpoints
knowledge_check:
  - question: "Which endpoint would you use to build a mobile app that displays your curriculum?"
    hint: "You need structured data that's easy to parse in code."
  - question: "What's the difference between the RSS feed and the JSON API?"
    hint: "Think about who or what is consuming each format."
additional_resources:
  - title: "Schema.org Course Type"
    author: "Schema.org"
    url: "https://schema.org/Course"
    description: "Documentation for the Course schema used in the manifest."
---

## Available Endpoints

Your curriculum automatically provides four machine-readable endpoints. No configuration needed—they work out of the box.

| Endpoint | Format | Purpose |
|----------|--------|---------|
| `/api/curriculum.json` | JSON | Full curriculum data for applications |
| `/api/manifest.json` | JSON-LD | Schema.org structured data |
| `/feed.xml` | RSS 2.0 | Feed reader subscriptions |
| `/sitemap.xml` | XML | Search engine indexing |

All endpoints are publicly accessible and support CORS (for JSON endpoints), meaning external applications can fetch them directly from browsers.

---

## The Curriculum JSON API

This is the primary endpoint for programmatic access. It returns everything about your curriculum in a structured format.

### Basic Request

```bash
curl https://yoursite.netlify.app/api/curriculum.json
```

### Response Structure

```json
{
  "$schema": "https://yoursite.netlify.app/api/schema.json",
  "version": "1.0",
  "generated": "2024-01-15T10:30:00.000Z",
  "site": {
    "name": "My Curriculum",
    "url": "https://yoursite.netlify.app",
    "description": "A self-directed learning path"
  },
  "stats": {
    "totalClusters": 5,
    "totalLessons": 23
  },
  "clusters": [
    {
      "id": 1,
      "title": "Getting Started",
      "slug": "getting-started",
      "description": "...",
      "url": "https://yoursite.netlify.app/curriculum/getting-started",
      "lessons": [
        {
          "id": "1-1",
          "title": "Welcome",
          "slug": "welcome",
          "description": "...",
          "url": "https://yoursite.netlify.app/curriculum/getting-started/welcome"
        }
      ]
    }
  ]
}
```

### Query Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `cluster` | (all) | Filter to a specific cluster by slug |
| `urls` | `true` | Set to `false` to omit URL fields |
| `content` | `false` | Set to `true` to include full lesson content |

**Examples:**

Filter to a specific cluster:

```bash
curl "https://yoursite.netlify.app/api/curriculum.json?cluster=getting-started"
```

Omit URLs for a smaller payload:

```bash
curl "https://yoursite.netlify.app/api/curriculum.json?urls=false"
```

**Include full content** (for AI agents and content syndication):

```bash
curl "https://yoursite.netlify.app/api/curriculum.json?content=true"
```

With `?content=true`, each lesson includes:
- `objectives` — Learning objectives array
- `key_concepts` — Concepts with explanations (HTML)
- `assignment` — Assignment instructions (HTML)
- `knowledge_check` — Quiz questions
- `additional_resources` — External links
- `content` — Full lesson body (HTML)

---

## RSS Feed

The RSS feed makes your curriculum subscribable. When you add new lessons, subscribers get notified.

### Feed URL

```
https://yoursite.netlify.app/feed.xml
```

### What's Included

- **Clusters** appear as items with category "Cluster"
- **Lessons** appear as items categorized by their cluster name
- **Authors** are included when specified in lesson frontmatter
- **Full content** via `<content:encoded>` — the complete lesson body as HTML

The `content:encoded` tag means RSS readers and AI agents can access the full text of each lesson, not just summaries.

### Using the Feed

Add the feed URL to any RSS reader:
- **Feedly**: Paste the URL in the search/add bar
- **NetNewsWire**: File → New Feed → paste URL
- **Inoreader**: Click the + button, paste URL

You can also use the feed with automation tools like Zapier or IFTTT to trigger actions when new content is published.

---

## Sitemap

The sitemap helps search engines discover all your content efficiently.

### Sitemap URL

```
https://yoursite.netlify.app/sitemap.xml
```

### Structure

Pages are prioritized:
- **Home page**: 1.0 (highest)
- **Curriculum index**: 0.9
- **About page**: 0.8
- **Cluster pages**: 0.8
- **Lesson pages**: 0.7

Change frequency hints:
- Static pages: monthly
- Cluster pages: weekly
- Lesson pages: monthly

### Search Console

For faster indexing, submit your sitemap to Google Search Console:
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add and verify your site
3. Go to Sitemaps → Add sitemap → enter `sitemap.xml`

---

## Schema.org Manifest

This endpoint provides rich structured data that search engines and AI systems understand semantically.

### Manifest URL

```
https://yoursite.netlify.app/api/manifest.json
```

### Schema Structure

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "My Curriculum",
  "description": "...",
  "hasCourseInstance": [
    {
      "@type": "CourseInstance",
      "name": "Getting Started",
      "teaches": [
        {
          "@type": "LearningResource",
          "name": "Welcome",
          "url": "..."
        }
      ]
    }
  ],
  "_links": {
    "curriculum": "https://.../api/curriculum.json",
    "feed": "https://.../feed.xml",
    "sitemap": "https://.../sitemap.xml"
  }
}
```

The `_links` section provides discovery—any system that finds the manifest can discover all other endpoints.

---

## CORS and Caching

### Cross-Origin Access

The JSON endpoints include CORS headers:

```
Access-Control-Allow-Origin: *
```

This means JavaScript running on any domain can fetch your curriculum data. Useful for embedding widgets or building external tools.

### Caching

All endpoints return a 1-hour cache header:

```
Cache-Control: max-age=3600
```

This balances freshness with performance. After editing content, it may take up to an hour for cached responses to update.

---

## Next Steps

Now that you understand what's available, the next lesson explores practical use cases: feeding content to AI agents, building custom dashboards, and automating workflows.
