# Self-Directed Research Curriculum Template

A fork-friendly platform for creating self-directed research curricula. Built with SvelteKit, Sveltia CMS, and a front-end agnostic content architecture.

## Deploy Your Own

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/YOUR_REPO)

> **Note:** After deploying, follow the [CMS Setup](#step-3-set-up-cms-authentication) instructions to enable content editing.

## What Is This?

This template helps you create **depth-first learning experiences**—structured paths through foundational texts that help learners go deep on a topic.

**The starter content teaches you how to use it.** Read the included curriculum to learn the methodology, then replace it with your own domain of expertise.

**Features:**
- Browser-based content editing (no code required)
- Markdown + Git for version-controlled content
- Automatic deployment on every change
- Machine-readable APIs for programmatic access
- Mobile-responsive, accessible design

## Quick Start

### Step 1: Fork and Deploy

1. Click "Use this template" or fork this repository
2. Click the "Deploy to Netlify" button
3. Wait for the initial build (~2 minutes)

Your site is now live at a random Netlify URL.

### Step 2: Configure Your URL

1. In Netlify: Site settings → Domain management
2. Click "Options" → "Edit site name"
3. Choose a memorable name (e.g., `my-philosophy-curriculum`)
4. Add environment variable: `PUBLIC_SITE_URL` = your full URL

### Step 3: Set Up CMS Authentication

The CMS needs OAuth to edit your GitHub repository. This requires:

1. **Create a GitHub OAuth App**
   - GitHub → Settings → Developer settings → OAuth Apps → New
   - Set callback URL to your Cloudflare Worker (created next)

2. **Deploy the Auth Worker**
   - Go to [workers.cloudflare.com](https://workers.cloudflare.com)
   - Create a worker with the OAuth code (see `docs/cms-setup.md`)
   - Add your GitHub Client ID and Secret as environment variables

3. **Update CMS Config**
   - Edit `static/admin/config.yml`
   - Set your repository and worker URL

See the "Setting Up the CMS" lesson in the curriculum for detailed instructions.

### Step 4: Start Creating

1. Go to `your-site.netlify.app/admin/`
2. Log in with GitHub
3. Edit clusters, lessons, and pages
4. Changes auto-deploy to your live site

## Project Structure

```plaintext
curriculum-template/
├── content/                    # All content (CMS-managed)
│   ├── clusters/              # Thematic groupings
│   ├── lessons/               # Individual lessons
│   ├── pages/                 # Static pages (home, about)
│   └── settings/              # Site configuration
├── prompts/                   # AI prompts for curriculum building
│   ├── 01-domain-definition.md
│   ├── 02-reading-discovery.md
│   └── 03-curriculum-structure.md
├── src/
│   ├── lib/
│   │   ├── data/              # Content loading logic
│   │   └── types/             # TypeScript definitions
│   └── routes/                # SvelteKit pages & API endpoints
├── static/
│   └── admin/                 # CMS configuration
└── docs/                      # Additional documentation
```

## Content Architecture

Content is stored as Markdown files with YAML frontmatter. The CMS provides a visual editor, but you can also edit files directly.

### Content Types

| Type | Location | Description |
|------|----------|-------------|
| Cluster | `content/clusters/` | Thematic grouping of 2-5 lessons |
| Lesson | `content/lessons/` | Individual reading with context and reflection |
| Page | `content/pages/` | Static pages (home, about) |
| Settings | `content/settings/` | Site title, description, author |

### Lesson Structure

Each lesson includes:
- **Introduction**: Why this reading matters
- **Key Concepts**: 3-5 ideas to focus on
- **Assignment**: The primary reading with instructions
- **Knowledge Check**: Reflection questions
- **Additional Resources**: Optional further reading

### Machine-Readable Endpoints

| Endpoint | Format | Description |
|----------|--------|-------------|
| `/api/curriculum.json` | JSON | Full curriculum data |
| `/api/manifest.json` | JSON-LD | Schema.org structured data |
| `/feed.xml` | RSS 2.0 | Content syndication |
| `/sitemap.xml` | XML | Search engine sitemap |

## Building Your Curriculum

The included starter content teaches the full methodology:

1. **Getting Started** — Understanding the platform and philosophy
2. **Building Your Curriculum** — Defining domains, finding readings, structuring content
3. **Deployment & Customization** — Deploying, CMS setup, branding

### AI-Assisted Workflow

The `prompts/` directory contains ready-to-use prompts for:
- Defining your domain and central question
- Discovering foundational readings
- Structuring content into clusters and lessons

See [METHODOLOGY.md](./METHODOLOGY.md) for the complete curriculum-building guide.

## Local Development

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The site will be available at `http://localhost:5173`.

## Customization

### Site Settings

Edit via CMS (Settings → Site Settings) or directly in `content/settings/site.json`:

```json
{
  "title": "Your Curriculum Title",
  "description": "Your curriculum description",
  "author": "Your Name"
}
```

### Colors and Styling

Edit CSS custom properties in `src/app.css`:

```css
:root {
  --color-primary: #2563eb;
  --color-background: #ffffff;
  --color-text: #1f2937;
}
```

### Adding Content

**Via CMS (recommended):**
- Access `/admin` on your deployed site
- Use the visual editor
- Changes auto-commit to GitHub

**Via Obsidian (local editing):**
- Clone the repo and open `content/` as an Obsidian vault
- Edit with live preview and graph view
- Use the Obsidian Git plugin to sync changes
- See [docs/obsidian-setup.md](./docs/obsidian-setup.md) for the complete guide

**Via Git (manual):**
- Create Markdown files in `content/`
- Follow the frontmatter schema in existing files
- Commit and push to trigger rebuild

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | [SvelteKit](https://kit.svelte.dev) | Web framework with SSR |
| CMS | [Sveltia CMS](https://github.com/sveltia/sveltia-cms) | Git-based headless CMS |
| Auth | [Cloudflare Workers](https://workers.cloudflare.com) | OAuth for CMS |
| Hosting | [Netlify](https://netlify.com) | Continuous deployment |
| Content | Markdown + YAML | Portable, version-controlled |

## Documentation

| Document | Description |
|----------|-------------|
| [METHODOLOGY.md](./METHODOLOGY.md) | Complete curriculum-building guide |
| [CONTENT_ARCHITECTURE.md](./CONTENT_ARCHITECTURE.md) | Content schema and types |
| [AGENTS.md](./AGENTS.md) | Instructions for AI agents |
| [docs/cms-setup.md](./docs/cms-setup.md) | CMS OAuth setup (Sveltia) |
| [docs/obsidian-setup.md](./docs/obsidian-setup.md) | Local editing with Obsidian |

## License

- **Code**: MIT License — Free to use, modify, and distribute
- **Starter Content**: CC0 — Public domain, use freely

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

*Built for depth, not breadth.*
