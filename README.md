# Self-Directed Research Curriculum Template

A fork-friendly platform for creating depth-first learning experiences. Built with SvelteKit and Sveltia CMS.

## Deploy Your Own

**1. Deploy the site:**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/YOUR_REPO)

**2. Deploy the CMS auth worker:**

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/YOUR_USERNAME/YOUR_REPO/tree/main/workers/cms-auth)

After deploying, see [Quick Start](#quick-start) to connect everything.

---

## What Is This?

Create **structured curricula** around foundational texts. The included content teaches you how to use the platform—read it, then replace it with your own domain.

**7 clusters, 23 lessons** covering:
- Why depth-first learning matters
- Two paths: AI-assisted or manual curriculum building
- Deployment, CMS setup, and customization
- Working with content and making it yours
- API access for programmatic use

## Quick Start

### 1. Fork & Deploy to Netlify

1. Fork this repository
2. Click "Deploy to Netlify" button above
3. Wait for the build (~2 minutes)

### 2. Set Up CMS Authentication

The CMS needs OAuth to commit to your GitHub repo.

**Create GitHub OAuth App:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers) → OAuth Apps → New
2. Set Homepage URL to your Netlify site
3. Set Callback URL to `https://YOUR-WORKER.workers.dev/callback`

**Deploy the Auth Worker:**
1. Click "Deploy to Cloudflare Workers" button above
2. Add environment variables in Cloudflare:
   - `GITHUB_CLIENT_ID` — from your OAuth app
   - `GITHUB_CLIENT_SECRET` — from your OAuth app
3. Update your GitHub OAuth callback URL to match the worker URL

**Configure Netlify:**
Add these environment variables in Netlify (Site settings → Environment variables):
- `CMS_REPO` = `your-username/your-repo`
- `CMS_AUTH_URL` = `https://your-worker.workers.dev`

Trigger a redeploy, then access `/admin` on your site.

See [docs/cms-setup.md](./docs/cms-setup.md) for detailed instructions.

### 3. Start Creating

1. Go to `your-site.netlify.app/admin/`
2. Log in with GitHub
3. Edit clusters and lessons
4. Changes auto-deploy to your live site

---

## Project Structure

```
content/
├── clusters/          # 7 thematic groupings
├── lessons/           # 23 lessons
├── pages/             # Home, About
└── settings/          # Site configuration

prompts/               # AI prompts for curriculum building
src/                   # SvelteKit application
workers/cms-auth/      # Cloudflare Worker for CMS OAuth
docs/                  # Setup guides
```

## Content Model

| Type | Description |
|------|-------------|
| **Cluster** | Thematic grouping of lessons. Foundation clusters appear in "Start Here"; others in "Specializations" |
| **Lesson** | Individual reading with introduction, key concepts, assignment, and knowledge checks |
| **Page** | Static pages (home, about) |

### Lesson Fields

| Field | Purpose |
|-------|---------|
| `title`, `slug`, `description` | Basic metadata |
| `body` | Introduction/context (markdown) |
| `key_concepts` | 1-3 concepts to focus on |
| `assignment` | Primary reading with instructions |
| `knowledge_check` | Reflection questions |
| `blocks` | Unified content blocks (new format) |

See [CONTENT_ARCHITECTURE.md](./CONTENT_ARCHITECTURE.md) for the complete schema.

## Machine-Readable Endpoints

| Endpoint | Format | Use Case |
|----------|--------|----------|
| `/api/curriculum.json` | JSON | Apps, AI agents |
| `/api/manifest.json` | JSON-LD | Rich search snippets |
| `/feed.xml` | RSS | Syndication |
| `/sitemap.xml` | XML | Search engines |

## Two Paths to Build Your Curriculum

**AI-Assisted** (Building with AI cluster):
Use the prompts in `/prompts/` with Claude, GPT-4, or similar to rapidly generate curriculum structure.

**Manual** (Building Manually cluster):
Step-by-step guide for choosing topics, selecting readings, and structuring lessons without AI.

Both paths are documented in the starter curriculum itself.

## Local Development

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
npm run dev
```

Site runs at `http://localhost:5173`.

## Customization

**Site settings**: Edit via CMS or `content/settings/site.json`

**Colors/fonts**: Edit CSS variables in `src/app.css`

**Content editing**:
- **CMS**: Visual editing at `/admin`
- **Obsidian**: Local editing with Git sync ([setup guide](./docs/obsidian-setup.md))
- **Direct**: Edit markdown files in `content/`

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | [SvelteKit](https://kit.svelte.dev) |
| CMS | [Sveltia CMS](https://github.com/sveltia/sveltia-cms) |
| Auth | [Cloudflare Workers](https://workers.cloudflare.com) |
| Hosting | [Netlify](https://netlify.com) |

## Documentation

| Document | Description |
|----------|-------------|
| [CONTENT_ARCHITECTURE.md](./CONTENT_ARCHITECTURE.md) | Content schema |
| [METHODOLOGY.md](./METHODOLOGY.md) | Curriculum-building philosophy |
| [docs/cms-setup.md](./docs/cms-setup.md) | CMS authentication setup |
| [docs/obsidian-setup.md](./docs/obsidian-setup.md) | Local editing with Obsidian |
| [docs/styling-guide.md](./docs/styling-guide.md) | Visual customization |

## License

- **Code**: MIT License
- **Starter Content**: CC0 (Public Domain)

---

*Built for depth, not breadth.*
