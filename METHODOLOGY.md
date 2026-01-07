# Methodology: Building a Self-Directed Research Curriculum

A guide to using AI agents and a modular web stack to create and host a personal research curriculum.

---

## Introduction: The Philosophy of Digital Scholarship

In an age of automated, surface-level content, the act of building a personal curriculum is a declaration of intent. It prioritizes depth over breadth, and an earned point of view over fleeting engagement.

This methodology provides a replicable framework for creating a self-directed learning path, using AI as a research partner and a modular web stack for dissemination.

The goal is not just to consume information, but to synthesize it into a coherent body of knowledge that can become a "life's work." This process is inspired by the way we learned to use Wikipedia in school: not as a primary source, but as a map to the primary sources. We start with what we need to learn and let curiosity guide the branching path.

---

## The Stack

This methodology uses a modular, Git-based architecture:

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | SvelteKit | Fast, modern web framework |
| Styling | CSS (Tailwind-ready) | Flexible styling system |
| CMS | Sveltia CMS | Git-based headless CMS for Markdown content |
| Hosting | Netlify | Continuous deployment from GitHub |
| Auth | Cloudflare Workers | OAuth authentication for CMS |

### Key Architecture Principle

**Content drives everything.** The curriculum structure is dynamically loaded from Markdown files—no manual synchronization required. When you add a cluster or lesson in the CMS, the site automatically updates.

```
content/clusters/*.md  ──┐
content/lessons/*.md   ──┼──▶ loadCurriculum() ──▶ All interfaces
content/pages/*.md     ──┘         │
                                   ├── Human UI (website)
                                   ├── JSON API (agents)
                                   └── RSS/Sitemap (crawlers)
```

---

## Phase 1: Domain Definition & Thematic Clustering

Before any research begins, define the central question or domain of your inquiry.

### Step 1.1: Defining Your Core Question

Start with a broad, ambitious question at the intersection of your interests. This is not a research topic; it's a guiding star.

**Examples:**
- How do conceptual and material tools (devices) shape human reality? *(The basis for this project)*
- What are the historical precedents for decentralized autonomous organizations?
- How does narrative structure influence technological adoption?

### Step 1.2: AI-Assisted Thematic Clustering

Use an AI agent to break down your question into foundational thematic clusters:

**Sample Prompt:**
```
I am building a research curriculum around the core question:
"[Your Core Question]"

Based on this question, identify 8-10 foundational thematic clusters
that would be essential to understanding this domain.

For each cluster, provide:
1. A clear, descriptive title
2. A one-sentence description
3. 2-3 key questions this cluster addresses

My background is in [Your Background], so frame the clusters accordingly.
```

---

## Phase 2: AI-Assisted Seminal Research

With clusters defined, populate them with foundational readings—the "seminal texts" that started the conversation in each sub-field.

### Step 2.1: The "Seminal Essays" Prompting Technique

**Sample Prompt:**
```
For the thematic cluster "[Cluster Name]", I need a reading list of
the 3-5 most seminal essays or book chapters that defined this field.

I am not looking for a comprehensive bibliography, but the foundational
texts that a scholar in this area would consider essential.

For each text, provide:
1. Author & Title
2. A one-sentence summary of its core idea
3. A brief explanation of why it is considered seminal
4. A direct link to a publicly accessible PDF or full-text version
   (e.g., from JSTOR, archive.org, university repositories)
```

Repeat for every cluster.

### Step 2.2: Vetting and Curation

AI is a research assistant, not an oracle. Vet the list:
- Read summaries and introductions
- Verify the text's relevance to your core question
- Check that links work and point to legitimate sources
- Discard or replace readings that don't fit

---

## Phase 3: Curriculum Structuring

Translate your reading list into the project's content structure.

### Step 3.1: Understanding the Content Model

The curriculum uses two primary content types:

**Clusters** (`content/clusters/`):
```yaml
---
title: "Mediation Architecture & Reality Framing"
slug: mediation-architecture
order: 1
description: "How devices function as mediating instruments..."
---

Extended overview content as Markdown body...
```

**Lessons** (`content/lessons/`):
```yaml
---
title: The Social Construction of Reality
slug: social-construction-of-reality
cluster: mediation-architecture  # References cluster by slug
author: Peter Berger & Thomas Luckmann
order: 1
description: The foundational text for understanding...
objectives:
  - Understand how reality is socially constructed
  - Analyze the role of institutions in shaping perception
key_concepts:
  - name: Social Construction
    explanation: |
      Detailed explanation of this concept...
assignment:
  instructions: |
    Read chapters 1-2 of the text...
  url: "https://..."
  reading_title: "The Social Construction of Reality"
knowledge_check:
  - question: "How do Berger and Luckmann define..."
    hint: "Think about the role of institutions..."
additional_resources:
  - title: "Related Reading"
    author: "Author Name"
    url: "https://..."
    description: "Brief description..."
---

Introduction/overview content as Markdown body...
```

### Step 3.2: Creating Content Files

**For clusters:**
1. Create `content/clusters/{slug}.md`
2. Add YAML frontmatter with required fields
3. Add optional Markdown body for overview

**For lessons:**
1. Create `content/lessons/{cluster-slug}-{lesson-slug}.md`
2. Add YAML frontmatter matching the schema
3. Add Markdown body for the introduction

**Important:** The `cluster` field in lessons must match a cluster's `slug` exactly.

### Step 3.3: Using the CMS (Recommended)

Instead of manually creating files, use Sveltia CMS at `/admin`:

1. Navigate to **Clusters** → Create your thematic groupings
2. Navigate to **Lessons** → Create lessons and select their parent cluster
3. The CMS handles file naming and YAML formatting automatically

---

## Phase 4: Populating Content with AI

With structure in place, generate full lesson content.

### Step 4.1: The Lesson Generation Prompt

**Sample Prompt:**
```
Based on the seminal text "[Author, Title]", generate content for
a curriculum lesson.

Context: This lesson is part of a curriculum exploring "[Your Core Question]".
It belongs to the cluster "[Cluster Name]" which focuses on [cluster description].

Generate the following in a conversational, direct, scholarly (but not academic) voice:

1. INTRODUCTION (200-250 words):
   An engaging essay explaining why this text is critical for
   understanding the core question.

2. LEARNING OBJECTIVES (3-5 bullet points):
   Specific, measurable takeaways from the reading.

3. KEY CONCEPTS (3-5 concepts, 150-250 words each):
   For each major concept:
   - Name/title of the concept
   - Clear explanation with examples
   - Connection to the broader curriculum theme

4. ASSIGNMENT:
   - Instructions for engaging with the primary text
   - Specific pages/chapters to focus on
   - Guiding questions while reading

5. KNOWLEDGE CHECK (3-4 questions):
   Thought-provoking questions that test comprehension
   and encourage reflection. Include optional hints.

6. ADDITIONAL RESOURCES (2-3 items):
   Related readings, videos, or materials with brief descriptions.

Format as YAML frontmatter + Markdown body, ready to save as a .md file.
```

### Step 4.2: Verification Checklist

Before committing generated content:

- [ ] **YAML validity**: No syntax errors (watch for unquoted colons in titles)
- [ ] **Field completeness**: All required fields present
- [ ] **Slug consistency**: Filename matches `{cluster}-{slug}.md` pattern
- [ ] **Cluster reference**: `cluster` field matches an existing cluster slug
- [ ] **Link verification**: All URLs work and point to legitimate sources
- [ ] **Voice consistency**: Content matches your intended tone
- [ ] **Accuracy**: Key concepts accurately represent the source text

---

## Phase 5: Visual Identity & Asset Generation

Develop a consistent visual style for the curriculum.

### Step 5.1: Defining a Visual Styleguide

Document your visual identity clearly:

| Element | Specification |
|---------|--------------|
| Primary style | Linocut/woodcut print |
| Influences | Polish poster school, constructivism |
| Color palette | Cream (#f3eee5), Vermillion (#d01c1f), Black |
| Typography | Kyrios Standard (headings), Merriweather (body) |
| Composition | Centered, generous negative space, high contrast |

### Step 5.2: Image Generation Workflow

1. **Outline**: List all images needed with pedagogical purpose
2. **Generate iteratively**: One image at a time for approval
3. **Use consistent prompting**:

**Sample Image Prompt:**
```
Linocut woodcut print illustration in the style of Polish poster school
and constructivist art.

[Detailed description of the image's subject and composition]

Style requirements:
- Cream/parchment background (#f3eee5)
- Bold black outlines, carved woodcut texture
- No gradients, high contrast
- Vermillion red (#d01c1f) as the only color accent
- Balanced composition with generous negative space
```

4. **Add to project**: Place in `static/images/lessons/`
5. **Update content**: Set `featured_image` field in lesson frontmatter

---

## Phase 6: Deployment & Maintenance

### Initial Deployment

**Quick Start:** Use the deploy buttons in the README for one-click setup.

**Manual Setup:**

1. **Push to GitHub repository**

2. **Deploy to Netlify**
   - Import the repository
   - Build settings are pre-configured in `netlify.toml`

3. **Configure environment variables** in Netlify Dashboard:

   | Variable | Description |
   |----------|-------------|
   | `PUBLIC_SITE_URL` | Your site's canonical URL (e.g., `https://my-curriculum.netlify.app`) |

4. **Deploy CMS authentication** to Cloudflare Workers:
   - Deploy [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)
   - Set secrets: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ALLOWED_DOMAINS`

5. **Create GitHub OAuth App:**
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Set callback URL to: `https://your-worker.workers.dev/callback`

6. **Update CMS configuration** in `static/admin/config.yml`:
   ```yaml
   backend:
     name: github
     repo: YOUR_USERNAME/YOUR_REPO
     branch: main
     base_url: https://your-worker.workers.dev
   ```

7. **Customize site settings** in `content/settings/site.json`

### Ongoing Maintenance

**Through CMS (Recommended):**
- Access `/admin` on your deployed site
- Edit content with visual interface
- Changes commit directly to GitHub → auto-deploy

**Through Git:**
- Edit Markdown files directly
- Push to main branch → auto-deploy

### Machine-Readable Interfaces

Your curriculum automatically provides:

| Endpoint | Purpose |
|----------|---------|
| `/api/curriculum.json` | Full JSON API for programmatic access |
| `/api/manifest.json` | Schema.org structured data |
| `/feed.xml` | RSS feed for syndication |
| `/sitemap.xml` | Search engine sitemap |
| `/llms.txt` | AI agent guidance |

---

## Appendix: AI Agent Prompts for Common Tasks

### Adding a New Cluster

```
Create a new cluster for my DEVICES curriculum with the following details:

Title: [Cluster Title]
Slug: [cluster-slug]
Order: [number]
Description: [One-sentence description]

Generate the YAML frontmatter and a 2-3 paragraph overview explaining
what this cluster covers and why it matters for understanding how
devices shape reality.

Format as a complete Markdown file ready to save as content/clusters/[slug].md
```

### Adding a New Lesson

```
Create a new lesson for my DEVICES curriculum:

Cluster: [cluster-slug]
Source Text: [Author, Title]
Lesson Order: [number within cluster]

Follow the lesson structure in CONTENT_ARCHITECTURE.md.
Generate complete YAML frontmatter and Markdown body.
Use a conversational, scholarly voice.

The lesson should connect this text to the broader question of
how devices shape human reality.
```

### Redesigning a Page Layout

```
I want to redesign the [page name] for my curriculum site.

Current data contract (from CONTENT_ARCHITECTURE.md):
[Paste relevant interface]

Requirements:
- Must consume the same data structure
- Must work with the existing content schema
- [Your design requirements]

Generate a new Svelte component that:
1. Accepts the documented props
2. Implements [your design vision]
3. Maintains accessibility
4. Works with the existing CSS variables
```

---

## Quick Reference

### File Locations

| Content Type | Location | Naming Pattern |
|--------------|----------|----------------|
| Clusters | `content/clusters/` | `{slug}.md` |
| Lessons | `content/lessons/` | `{cluster}-{slug}.md` |
| Pages | `content/pages/` | `{name}.md` |
| Settings | `content/settings/` | `site.json` |
| Images | `static/images/lessons/` | `{descriptive-name}.png` |

### Required Fields

**Cluster**: `title`, `slug`, `order`, `description`

**Lesson**: `title`, `slug`, `cluster`, `order`, `description`

### Validation

The build will fail if:
- A lesson references a non-existent cluster
- Required fields are missing
- YAML syntax is invalid
- Duplicate order values within a cluster

---

## Conclusion

This methodology provides a robust, repeatable process for creating deeply personal and intellectually rigorous educational projects. By leveraging AI for research and content generation, you can focus on the uniquely human tasks of curation, synthesis, and developing an earned point of view.

The result is not just a website, but a living document of your intellectual journey—accessible to both humans and machines, ready to evolve as your understanding deepens.
