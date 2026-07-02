# Design Transformation Guide

How to transform the visual design of a BYO Curriculum fork without breaking the CMS, content loading, or build pipeline.

---

## What's Safe to Change

The visual layer is fully decoupled from the content layer. You can completely redesign the site by editing only these files:

| File | Controls |
|------|----------|
| `src/app.css` | CSS variables (colors, fonts, spacing, shadows, radius), global component classes |
| `src/app.html` | Font loading (`<link>` tags), meta tags |
| `src/routes/+page.svelte` | Homepage layout and styles |
| `src/routes/+layout.svelte` | Navigation and footer |
| `src/routes/curriculum/+page.svelte` | Cluster listing page |
| `src/routes/curriculum/[cluster]/+page.svelte` | Lesson list within a cluster |
| `src/routes/curriculum/[cluster]/[lesson]/+page.svelte` | Lesson reading experience |
| `src/routes/about/+page.svelte` | About page |

---

## What NOT to Change

| File | Why |
|------|-----|
| `src/lib/data/curriculum.server.ts` | Content loading logic — breaks all pages |
| `src/lib/types/content.ts` | Type definitions — breaks TypeScript |
| `static/admin/config.template.yml` | CMS field schema — breaks CMS |
| `netlify.toml` | Build/deploy config |
| `workers/cms-auth/*` | Cloudflare Worker — breaks CMS auth |
| `scripts/validate-content.js` | Build validation |

---

## Step-by-Step Transformation

### 1. Define Your Brand

Fill in `.impeccable.md` with your brand personality, colors, fonts, and design principles. This is the source of truth for all visual decisions.

### 2. Choose and Load Fonts

Edit `src/app.html` to add Google Fonts or self-hosted font `<link>` tags:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 3. Set CSS Variables

Edit the `:root` block in `src/app.css`. These variables cascade to every component:

```css
:root {
  /* Colors */
  --color-primary: #6D28FF;
  --color-primary-hover: #5B21D4;
  --color-background: #FFFFFF;
  --color-surface: #F9F9FB;
  --color-surface-elevated: #FFFFFF;
  --color-text: #050505;
  --color-text-muted: #565567;
  --color-text-inverse: #FFFFFF;
  --color-border: #E4E3EB;
  --color-border-light: #F0EFF4;

  /* Typography */
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Shape */
  --radius-base: 0.75rem;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --transition-base: 0.15s ease;
}
```

### 4. Adjust Page Layouts

Each page has a `<style>` block with scoped CSS. You can change layout, spacing, and visual treatment without affecting other pages.

**Key layout patterns to consider:**
- Centered content (default template)
- Asymmetric grids (Swiss style)
- Full-width hero with contained body
- Sidebar navigation (for larger curricula)

### 5. Verify All Pages

After making changes, check each page type:
- `/` — Homepage hero, cluster list, stats
- `/curriculum` — All clusters overview
- `/curriculum/{cluster}` — Lessons within a cluster
- `/curriculum/{cluster}/{lesson}` — Full lesson reading experience
- `/about` — About page
- `/admin` — CMS still loads and works

### 6. Test Responsiveness

The template uses responsive breakpoints. Verify at:
- Mobile (320px-640px)
- Tablet (640px-1024px)
- Desktop (1024px+)

---

## Design Patterns That Work

### Light theme (default)
- White/light background with a single accent color
- High contrast text on light surfaces
- Subtle borders and shadows for depth
- Best for: institutional, professional, educational

### Dark theme
- Near-black background with light text
- Accent color for interactive elements
- Elevated surfaces slightly lighter than background
- Best for: technical, developer-focused, modern

### Warm/paper theme
- Off-white/cream background
- Warm gray text and borders
- Earthy accent colors (terracotta, forest, navy)
- Best for: humanities, editorial, personal

---

## Common Mistakes

1. **Changing CSS variables without updating page styles** — Some pages use hardcoded colors in their `<style>` blocks. Search for hex codes and replace with variables.

2. **Breaking the CMS** — Never modify `config.template.yml` for visual reasons. The CMS schema is content structure, not presentation.

3. **Forgetting mobile** — Always test the lesson reading experience on mobile. Long-form content needs appropriate line-height and padding.

4. **Invisible text** — If you switch from light to dark theme, ensure all text colors flip. Search for `color:` declarations in page styles.

5. **Font loading flash** — Use `font-display: swap` and preconnect hints to minimize FOUT.

---

## Accessibility Checklist

- [ ] Text contrast ratio meets WCAG AA (4.5:1 for body, 3:1 for large text)
- [ ] Interactive elements have visible focus states
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Font sizes are readable (minimum 16px body)
- [ ] Color is not the only indicator of state

---

## Example Transformations

### From default → Dark technical
```css
--color-background: #0f0f14;
--color-surface: #1a1a24;
--color-text: #e4e4e7;
--color-text-muted: #a1a1aa;
--color-primary: #6366f1;
--color-border: #27272a;
```

### From default → Warm editorial
```css
--color-background: #FAF8F5;
--color-surface: #FFFFFF;
--color-text: #1A1A1A;
--color-text-muted: #6B6B6B;
--color-primary: #C45C3E;
--color-border: #E5E2DD;
```

### From default → Vibrant brand
```css
--color-background: #FFFFFF;
--color-surface: #F0F4FF;
--color-text: #1E293B;
--color-text-muted: #64748B;
--color-primary: #2563EB;
--color-border: #E2E8F0;
```

---

*This guide applies to all BYO Curriculum forks. The visual layer is intentionally separate from the content and infrastructure layers so you can redesign freely.*
