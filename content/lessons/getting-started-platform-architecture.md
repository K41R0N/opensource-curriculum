---
title: How This Platform Works
slug: platform-architecture
cluster: getting-started
order: 2
description: "Technical overview of the curriculum platform: content structure, CMS, and deployment."
objectives:
  - Understand the cluster → lesson content hierarchy
  - Learn how content is stored as Markdown files
  - See how the CMS provides a visual editing interface
key_concepts:
  - name: "Content Hierarchy"
    explanation: |
      The curriculum is organized into two levels:

      **Clusters** are thematic groupings—like chapters in a book. Each cluster has a title, description, and optional overview text.

      **Lessons** are the atomic units of content. Each lesson typically covers one primary reading or concept. Lessons belong to exactly one cluster and have a defined order within it.

      This two-level hierarchy is simple enough to understand immediately but flexible enough to handle complex curricula.
  - name: "Markdown + Frontmatter"
    explanation: |
      All content is stored as Markdown files with YAML frontmatter. For example:

      ```yaml
      ---
      title: The Social Construction of Reality
      slug: social-construction
      cluster: foundations
      order: 1
      description: How shared meanings create reality.
      ---

      Your lesson content goes here in Markdown...
      ```

      This format is human-readable, version-controlled, and works with any text editor. The CMS provides a visual interface, but you can always edit files directly.
  - name: "Sveltia CMS"
    explanation: |
      The CMS (Content Management System) provides a visual interface for editing content. It's powered by Sveltia CMS, which:

      - Reads your content schema from `config.yml`
      - Provides form-based editing for each field
      - Commits changes directly to your GitHub repository

      You access the CMS at `yoursite.com/admin`. It requires GitHub authentication to edit.
knowledge_check:
  - question: "What's the relationship between clusters and lessons?"
    hint: "Think of clusters like chapters containing multiple lessons."
  - question: "Why use Markdown files instead of a database?"
    hint: "Consider version control, portability, and editing flexibility."
---

## Platform Architecture

This platform is built with simplicity and longevity in mind. Here's how the pieces fit together:

### Content Storage

All content lives in the `/content` directory as plain Markdown files:

```
content/
├── clusters/           # Cluster definitions
│   ├── getting-started.md
│   └── building-curriculum.md
├── lessons/            # Individual lessons
│   ├── getting-started-why-curriculum.md
│   └── getting-started-platform-architecture.md
├── pages/              # Static pages (home, about)
│   ├── home.md
│   └── about.md
└── settings/           # Site configuration
    └── site.json
```

Each file combines YAML frontmatter (structured data) with Markdown content (prose). This means your entire curriculum is portable, version-controlled, and readable without any special tools.

### The Build Process

When you deploy, the platform:

1. Reads all Markdown files from `/content`
2. Validates the content against expected fields
3. Builds a static website with all your lessons
4. Deploys to Netlify's global CDN

The result is a fast, secure, static site with no database or server to maintain.

### The CMS Interface

While you *can* edit Markdown files directly, the CMS provides a friendlier interface:

- **Visual forms** for each field (title, description, etc.)
- **Rich text editing** for lesson content
- **Relationship fields** to link lessons to clusters
- **Image uploads** that go directly to your repository

The CMS is powered by [Sveltia CMS](https://github.com/sveltia/sveltia-cms), an open-source Git-based CMS. When you save changes, it commits them to your GitHub repository—no separate database required.

### Technology Stack

For the technically curious:

- **Framework**: SvelteKit (fast, modern, great developer experience)
- **Styling**: CSS Custom Properties for easy theming
- **CMS**: Sveltia CMS (Git-based, no backend needed)
- **Hosting**: Netlify (free tier handles most curricula)
- **Auth**: GitHub OAuth via Cloudflare Workers

The entire stack is free or very low cost for typical usage.

## Key Files to Know

| File | Purpose |
|------|---------|
| `static/admin/config.yml` | CMS schema definition |
| `content/settings/site.json` | Site title, description, author |
| `content/pages/home.md` | Homepage content |
| `src/app.css` | Color, font, and theme customization |

You'll interact with these files when customizing your curriculum. The following lessons will walk you through each one.

## What You Don't Need to Worry About

This platform handles the technical complexity so you can focus on content:

- **No server management**: Everything runs on Netlify's free tier
- **No database**: Content is stored as files in your repository
- **No deployment scripts**: Push to GitHub, site updates automatically
- **No coding required**: The CMS handles content editing visually

You *can* customize the code if you want to, but it's entirely optional.
