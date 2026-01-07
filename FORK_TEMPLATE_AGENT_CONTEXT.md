# Curriculum Template - Agent Context

> **Purpose**: This document provides context for an AI agent tasked with transforming this curriculum project into a streamlined, fork-friendly template that anyone can use to create their own self-directed research curriculum.

## Project Overview

This is a SvelteKit-based curriculum platform with:
- **25 lessons** across **9 thematic clusters**
- **Sveltia CMS** for content management
- **Markdown/YAML** content files
- **i18n support** (English + Spanish)
- **Netlify deployment**

The goal is to transform this from a specific curriculum (DEVICES) into a **generic template** that others can fork and customize with minimal friction.

---

## Current State Assessment

### What Works Well
- Clean content/presentation separation
- Comprehensive CMS schema
- Good documentation (README, METHODOLOGY, CONTENT_ARCHITECTURE, AGENTS)
- Machine-readable APIs (JSON, RSS, sitemap)
- TypeScript throughout

### Pain Points to Address
1. **Authentication complexity**: Requires Cloudflare Worker + GitHub OAuth App
2. **i18n overhead**: Complex for single-language users
3. **No design customization without code**: Colors/fonts require Svelte editing
4. **Content-heavy**: Full DEVICES curriculum included (users must delete)
5. **Multi-file configuration**: Settings scattered across files
6. **No validation tooling**: Content errors surface at build time
7. **No setup wizard**: Manual file editing after deploy
8. **CMS lock-in perception**: No documented alternatives
9. **Prompts buried in prose**: METHODOLOGY.md not copy-paste ready
10. **No component documentation**: Redesign requires code diving

---

## Implementation Plan

### Phase 1: Reduce Barriers (Priority: HIGH)

#### 1.1 Switch to Netlify Identity + Git Gateway

**Current**: Cloudflare Worker OAuth
**Target**: Netlify Identity (zero external services)

**Files to modify**:
- `static/admin/config.yml`

**Changes**:
```yaml
# BEFORE
backend:
  name: github
  repo: USER/REPO
  branch: main
  base_url: https://worker.workers.dev

# AFTER
backend:
  name: git-gateway
  branch: main
```

**Documentation to add**:
- Update README.md setup steps
- Remove Cloudflare Worker instructions
- Add "Enable Netlify Identity" step
- Add "Enable Git Gateway" step (Settings > Identity > Services)

**Keep as alternative**: Document GitHub OAuth + Cloudflare Worker in `docs/ADVANCED_AUTH.md` for teams needing GitHub-based auth.

---

#### 1.2 Create Single-Language Simple Mode

**Goal**: Remove i18n complexity for users who only need one language.

**Option A - Separate Branch** (Recommended):
Create `simple` branch with:
- Routes at `/curriculum/[cluster]/[lesson]` (no `[[locale=locale]]`)
- No locale switcher in layout
- No `.es-CO.md` files
- Simplified CMS config without i18n fields

**Option B - Runtime Toggle**:
Add to `curriculum.config.js`:
```javascript
i18n: {
  enabled: false // removes locale routing and switcher
}
```

**Files affected**:
- `src/routes/` - flatten route structure
- `src/lib/i18n/` - can be removed or stubbed
- `static/admin/config.yml` - remove i18n from all fields
- `content/` - remove all `.es-CO.md` files

---

#### 1.3 Create Minimal Starter Content

**Current**: 9 clusters, 25 lessons (DEVICES-specific)
**Target**: 1 sample cluster, 2 sample lessons (generic)

**Create**:
```
content/
├── clusters/
│   └── getting-started.md
├── lessons/
│   ├── getting-started-introduction.md
│   └── getting-started-first-reading.md
├── pages/
│   ├── about.md (generic template)
│   └── home.md (generic template)
└── settings/
    └── site.json (placeholder values)
```

**Sample cluster content**:
```yaml
---
title: Getting Started
slug: getting-started
order: 1
description: Your first cluster - a thematic grouping of related lessons.
---

This is a sample cluster. Replace this content with your own curriculum theme.

Clusters organize lessons around a central concept or question. Each cluster typically contains 2-5 lessons that build on each other.
```

**Sample lesson content**:
```yaml
---
title: Introduction to Your Curriculum
slug: introduction
cluster: getting-started
author: Your Name
order: 1
description: A template lesson showing the structure and fields available.
objectives:
  - Understand how lessons are structured
  - Learn what fields are available
  - See how content renders on the site
key_concepts:
  - name: Sample Concept
    explanation: |
      This is where you explain a key concept from your reading.

      You can use multiple paragraphs and **markdown formatting**.
assignment:
  instructions: |
    Describe the reading assignment here.

    * What should readers focus on?
    * What questions should guide their reading?
  url: https://example.com/reading
  reading_title: Sample Reading Title
knowledge_check:
  - question: What is a sample question to test understanding?
    hint: Provide a hint to guide reflection.
additional_resources:
  - title: Additional Resource
    author: Author Name
    url: https://example.com
    description: Brief description of why this resource is valuable.
---

This is the lesson introduction. It appears above the structured content sections.

Use this space to contextualize the reading and explain why it matters for your curriculum's central question.
```

---

#### 1.4 Extract Prompts into Standalone Files

**Current**: Prompts embedded in METHODOLOGY.md prose
**Target**: Copy-paste ready prompt files

**Create directory**: `prompts/`

**Files to create**:

`prompts/01-define-domain.md`:
```markdown
# Prompt: Define Your Curriculum Domain

Use this prompt with Claude, ChatGPT, or another AI assistant to define your curriculum's central question.

---

I want to create a self-directed research curriculum exploring [YOUR TOPIC].

Help me:
1. Articulate the central question or thesis my curriculum will explore
2. Identify 5-7 thematic clusters that break down this question
3. For each cluster, suggest 2-4 key readings from foundational texts
4. Explain how each cluster builds toward answering the central question

Format your response as:
- **Central Question**: [one sentence]
- **Clusters**: [numbered list with descriptions]
- **Reading Suggestions**: [organized by cluster]
```

`prompts/02-find-readings.md`:
```markdown
# Prompt: Find Seminal Readings

Use this prompt to identify foundational texts for each cluster.

---

I'm building a curriculum cluster about [CLUSTER THEME].

The cluster should explore: [BRIEF DESCRIPTION]

Help me identify:
1. 3-5 foundational/seminal texts on this topic
2. For each text:
   - Full citation
   - Why it's considered foundational
   - Key concepts it introduces
   - A publicly accessible link (Internet Archive, author's site, open access)
3. Suggested reading order

Prioritize:
- Texts available freely online
- Primary sources over secondary analysis
- Diverse perspectives and time periods
```

`prompts/03-generate-lesson.md`:
```markdown
# Prompt: Generate Lesson Content

Use this prompt to create a complete lesson from a reading.

---

Create a curriculum lesson based on this text:
- **Title**: [BOOK/ARTICLE TITLE]
- **Author**: [AUTHOR NAME]
- **Reading URL**: [LINK]

Generate a lesson in this YAML frontmatter format:

```yaml
title: [Engaging lesson title]
slug: [url-friendly-slug]
cluster: [cluster-slug]
author: [Original author name]
order: [number]
description: [One sentence describing lesson's core insight]
objectives:
  - [3 learning objectives starting with action verbs]
key_concepts:
  - name: [Concept 1]
    explanation: |
      [2-3 paragraph explanation connecting to curriculum theme]
  - name: [Concept 2]
    explanation: |
      [2-3 paragraph explanation]
  - name: [Concept 3]
    explanation: |
      [2-3 paragraph explanation]
assignment:
  instructions: |
    [Reading instructions with guiding questions]
  url: [reading URL]
  reading_title: [Display title for link]
knowledge_check:
  - question: [Reflection question 1]
    hint: [Helpful hint]
  - question: [Reflection question 2]
    hint: [Helpful hint]
additional_resources:
  - title: [Related text]
    author: [Author]
    description: [Why it's relevant]
```

After the frontmatter, write 2-3 paragraphs introducing the reading and its significance.
```

`prompts/04-redesign-component.md`:
```markdown
# Prompt: Redesign a Component

Use this prompt to get help modifying the site's visual design.

---

I'm customizing a SvelteKit curriculum site. I want to modify the [COMPONENT NAME] component.

Current behavior: [DESCRIBE CURRENT STATE]
Desired behavior: [DESCRIBE WHAT YOU WANT]

The component is located at: `src/routes/[PATH]/+page.svelte`

Please provide:
1. The specific code changes needed
2. Any new CSS styles required
3. Explanation of what each change does

Design constraints:
- Use CSS custom properties (variables) from the theme
- Maintain mobile responsiveness
- Keep accessibility (semantic HTML, ARIA labels)
- Use existing Tailwind classes where possible
```

`prompts/05-validate-content.md`:
```markdown
# Prompt: Validate Content Files

Use this prompt to check your content for errors before committing.

---

Review this curriculum content file for errors:

```yaml
[PASTE YOUR CONTENT FILE HERE]
```

Check for:
1. Required fields present (title, slug, cluster, order, description)
2. Valid YAML syntax
3. Consistent slug format (lowercase, hyphens)
4. Cluster reference matches an existing cluster
5. URLs are properly formatted
6. Markdown syntax is correct in explanation fields

Report any issues found and suggest fixes.
```

---

### Phase 2: Improve Customization (Priority: MEDIUM)

#### 2.1 Add Theme Configuration

**Create**: `content/settings/theme.json`

```json
{
  "colors": {
    "primary": "#D01C1F",
    "primary_dark": "#A01518",
    "secondary": "#1a1a1a",
    "background": "#F3EEE5",
    "surface": "#EBE6DD",
    "text": "#1a1a1a",
    "text_muted": "#666666"
  },
  "fonts": {
    "heading": "Roslindale Display Condensed, Georgia, serif",
    "body": "system-ui, -apple-system, sans-serif"
  },
  "borderRadius": "0",
  "spacing": {
    "containerMax": "1200px"
  }
}
```

**Add to CMS config** (`static/admin/config.yml`):
```yaml
- name: theme
  label: Theme Settings
  file: content/settings/theme.json
  fields:
    - label: Colors
      name: colors
      widget: object
      fields:
        - { label: Primary Color, name: primary, widget: color }
        - { label: Primary Dark, name: primary_dark, widget: color }
        - { label: Background, name: background, widget: color }
        - { label: Text Color, name: text, widget: color }
    - label: Fonts
      name: fonts
      widget: object
      fields:
        - { label: Heading Font, name: heading, widget: string }
        - { label: Body Font, name: body, widget: string }
```

**Create**: `src/lib/theme.ts`
```typescript
import themeConfig from '../../content/settings/theme.json';

export function getThemeStyles(): string {
  return `
    :root {
      --color-primary: ${themeConfig.colors.primary};
      --color-primary-dark: ${themeConfig.colors.primary_dark};
      --color-background: ${themeConfig.colors.background};
      --color-text: ${themeConfig.colors.text};
      --font-heading: ${themeConfig.fonts.heading};
      --font-body: ${themeConfig.fonts.body};
    }
  `;
}
```

**Inject in layout**: Use `<svelte:head>` to inject CSS variables.

---

#### 2.2 Add Content Validation Script

**Create**: `scripts/validate-content.js`

```javascript
#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const REQUIRED_CLUSTER_FIELDS = ['title', 'slug', 'order', 'description'];
const REQUIRED_LESSON_FIELDS = ['title', 'slug', 'cluster', 'order', 'description'];

const errors = [];

function validateClusters() {
  const dir = path.join(process.cwd(), 'content/clusters');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && !f.includes('.es-'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data } = matter(content);

    for (const field of REQUIRED_CLUSTER_FIELDS) {
      if (!data[field]) {
        errors.push(`${file}: Missing required field '${field}'`);
      }
    }
  }
}

function validateLessons() {
  const dir = path.join(process.cwd(), 'content/lessons');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && !f.includes('.es-'));

  // Get valid cluster slugs
  const clusterDir = path.join(process.cwd(), 'content/clusters');
  const clusterSlugs = fs.readdirSync(clusterDir)
    .filter(f => f.endsWith('.md') && !f.includes('.es-'))
    .map(f => {
      const content = fs.readFileSync(path.join(clusterDir, f), 'utf-8');
      return matter(content).data.slug;
    });

  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data } = matter(content);

    for (const field of REQUIRED_LESSON_FIELDS) {
      if (!data[field]) {
        errors.push(`${file}: Missing required field '${field}'`);
      }
    }

    if (data.cluster && !clusterSlugs.includes(data.cluster)) {
      errors.push(`${file}: References non-existent cluster '${data.cluster}'`);
    }
  }
}

validateClusters();
validateLessons();

if (errors.length > 0) {
  console.error('Content validation failed:\n');
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('All content valid!');
}
```

**Add to package.json**:
```json
{
  "scripts": {
    "validate": "node scripts/validate-content.js",
    "prebuild": "npm run validate"
  }
}
```

---

#### 2.3 Create Component Documentation Page

**Create**: `src/routes/dev/components/+page.svelte`

A development-only page that renders each component with sample data, showing:
- Component name and file path
- Props/data shape expected
- Live rendered example
- Code snippet for customization

Gate behind `dev` environment or remove in production build.

---

### Phase 3: Polish Experience (Priority: LOWER)

#### 3.1 Post-Deploy Setup Wizard

**Create**: `src/routes/admin/setup/+page.svelte`

A one-time setup flow that:
1. Detects first run (checks if site.json has default values)
2. Collects: site name, author, curriculum topic, primary color
3. Generates initial content via GitHub API
4. Redirects to main CMS

**Implementation considerations**:
- Requires GitHub token (from Netlify Identity session)
- Creates commits directly to repo
- Only shown once, then hidden

---

#### 3.2 Document CMS Alternatives

**Create**: `docs/CMS_ALTERNATIVES.md`

```markdown
# CMS Alternatives

This template uses Sveltia CMS by default, but you can switch to other options.

## Decap CMS (formerly Netlify CMS)
- **Compatibility**: Drop-in replacement, same config format
- **Setup**: Replace `/admin/index.html` script src
- **Pros**: More mature, larger community
- **Cons**: Slower development, fewer features

## Tina CMS
- **Compatibility**: Requires migration
- **Setup**: Install @tinacms/cli, run init
- **Pros**: Visual editing, real-time preview
- **Cons**: Requires Tina Cloud (free tier available)

## No CMS (Direct Editing)
- **Setup**: Edit markdown files directly in VS Code
- **Pros**: Full control, no auth needed
- **Cons**: No visual interface, Git knowledge required

## Sanity
- **Compatibility**: Full migration required
- **Setup**: Create Sanity project, define schemas
- **Pros**: Powerful queries, real-time collaboration
- **Cons**: Hosted service, learning curve
```

---

#### 3.3 Unified Configuration File

**Create**: `curriculum.config.js`

```javascript
/** @type {import('./src/lib/types/config').CurriculumConfig} */
export default {
  // Site metadata
  site: {
    name: 'My Curriculum',
    url: process.env.PUBLIC_SITE_URL || 'http://localhost:5173',
    description: 'A self-directed research curriculum',
    author: 'Your Name',
  },

  // CMS configuration
  cms: {
    backend: 'git-gateway', // 'git-gateway' | 'github'
    repo: '', // Only needed for 'github' backend
    branch: 'main',
  },

  // Feature flags
  features: {
    i18n: false,
    theme: true,
    analytics: false,
  },

  // Localization (if i18n enabled)
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
};
```

**Build process reads this** to generate:
- CMS config
- Environment variables
- Route configuration

---

## File Structure After Changes

```
curriculum-template/
├── content/
│   ├── clusters/
│   │   └── getting-started.md          # Sample cluster
│   ├── lessons/
│   │   ├── getting-started-introduction.md
│   │   └── getting-started-first-reading.md
│   ├── pages/
│   │   ├── about.md
│   │   └── home.md
│   └── settings/
│       ├── site.json
│       └── theme.json                   # NEW: Theme configuration
├── docs/
│   ├── ADVANCED_AUTH.md                 # NEW: GitHub OAuth setup
│   └── CMS_ALTERNATIVES.md              # NEW: CMS options
├── prompts/                             # NEW: AI prompt templates
│   ├── 01-define-domain.md
│   ├── 02-find-readings.md
│   ├── 03-generate-lesson.md
│   ├── 04-redesign-component.md
│   └── 05-validate-content.md
├── scripts/
│   └── validate-content.js              # NEW: Content validator
├── src/
│   ├── lib/
│   │   ├── theme.ts                     # NEW: Theme utilities
│   │   └── ...
│   └── routes/
│       ├── curriculum/                  # Simplified (no locale wrapper)
│       │   ├── [cluster]/
│       │   │   ├── [lesson]/
│       │   │   └── +page.svelte
│       │   └── +page.svelte
│       ├── dev/
│       │   └── components/              # NEW: Component docs
│       └── admin/
│           └── setup/                   # NEW: Setup wizard
├── static/admin/
│   └── config.yml                       # Updated for git-gateway
├── curriculum.config.js                 # NEW: Unified config
├── AGENTS.md
├── CONTENT_ARCHITECTURE.md
├── METHODOLOGY.md
├── README.md                            # Updated with simpler setup
└── package.json                         # Updated scripts
```

---

## Implementation Order

Execute in this order to minimize conflicts:

### Step 1: Create Simple Branch Structure
```bash
git checkout -b simple
# Remove i18n, flatten routes, strip translations
```

### Step 2: Switch Auth to Git Gateway
- Update `static/admin/config.yml`
- Update README.md

### Step 3: Replace Content with Templates
- Delete DEVICES-specific content
- Add sample cluster and lessons
- Update site.json with placeholders

### Step 4: Add Theme System
- Create theme.json
- Add to CMS config
- Create theme.ts utilities
- Update CSS to use variables

### Step 5: Create Prompt Library
- Extract prompts from METHODOLOGY.md
- Create prompts/ directory
- Update METHODOLOGY.md to reference prompts

### Step 6: Add Validation
- Create validate script
- Add to package.json
- Test with sample content

### Step 7: Documentation
- Create CMS_ALTERNATIVES.md
- Create ADVANCED_AUTH.md
- Update README.md with simplified flow

### Step 8: Polish
- Add component documentation page
- Create setup wizard (if time permits)
- Create unified config (if time permits)

---

## Testing Checklist

After implementation, verify:

- [ ] Fresh fork can deploy to Netlify in under 5 minutes
- [ ] CMS loads and shows sample content
- [ ] Can create new cluster via CMS
- [ ] Can create new lesson via CMS
- [ ] Theme colors apply when changed
- [ ] Build passes with sample content
- [ ] Validation script catches missing fields
- [ ] All documentation links work
- [ ] Prompts are copy-paste ready

---

## Notes for Agent

1. **Preserve backwards compatibility** where possible - existing DEVICES deployments should still work
2. **Test incrementally** - run build after each major change
3. **Commit frequently** - small, focused commits with clear messages
4. **Update docs as you go** - don't leave documentation for last
5. **Ask for clarification** on design decisions rather than guessing

The goal is a template that someone can fork, deploy, and start adding their own curriculum content within 15 minutes, with no coding required for basic customization.
