# Styling Customization Guide

A comprehensive guide to customizing the visual appearance of your curriculum site without breaking the CMS or content structure.

---

## Overview

The site's styling is controlled by CSS custom properties (variables) defined in `src/app.css`. You can completely transform the look and feel by editing these variables—no need to modify component code.

### What You Can Customize

| Category | What It Controls |
|----------|------------------|
| **Colors** | Brand colors, backgrounds, text, borders |
| **Typography** | Font families, weights |
| **Border Radius** | Corner roundness (sharp to pill-shaped) |
| **Shadows** | Depth and elevation effects |
| **Spacing** | Consistent margins and padding |

### What You Should NOT Change

- **Variable names** — Components reference these exactly
- **Component HTML structure** — Breaking this breaks the CMS preview
- **CMS field names** — These map to content files

---

## Quick Start: Color Palettes

Open `src/app.css` and find the `:root` section. Here are ready-to-use color palettes:

### Academic Blue

```css
--color-primary: #1e40af;
--color-primary-hover: #1e3a8a;
--color-accent: #3b82f6;
--color-border: #1e40af;
```

### Forest Green

```css
--color-primary: #166534;
--color-primary-hover: #14532d;
--color-accent: #22c55e;
--color-border: #166534;
```

### Warm Terracotta

```css
--color-primary: #9a3412;
--color-primary-hover: #7c2d12;
--color-accent: #f97316;
--color-border: #9a3412;
```

### Deep Purple

```css
--color-primary: #6b21a8;
--color-primary-hover: #581c87;
--color-accent: #a855f7;
--color-border: #6b21a8;
```

### Soft Gray (Less Contrast)

```css
--color-primary: #374151;
--color-primary-hover: #1f2937;
--color-border: #d1d5db;
--color-border-light: #e5e7eb;
```

---

## Typography

### Changing Fonts

The site uses two font variables:

```css
--font-heading: /* for titles */
--font-body: /* for body text */
```

**Option 1: System Fonts (Default)**

Fast loading, no external dependencies:

```css
--font-heading: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-body: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Option 2: Classic Serif**

Academic, traditional feel:

```css
--font-heading: Georgia, 'Times New Roman', serif;
--font-body: Georgia, 'Times New Roman', serif;
```

**Option 3: Modern Sans (Inter)**

Clean, contemporary look. Add to `src/app.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Then in `src/app.css`:

```css
--font-heading: 'Inter', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
```

**Option 4: Mixed (Serif headings, Sans body)**

```css
--font-heading: Georgia, 'Times New Roman', serif;
--font-body: system-ui, -apple-system, sans-serif;
```

### Font Weights

Adjust boldness throughout the site:

```css
--font-weight-normal: 400;    /* Regular text */
--font-weight-medium: 500;    /* Slightly emphasized */
--font-weight-semibold: 600;  /* Headings, buttons */
--font-weight-bold: 700;      /* Strong emphasis */
```

---

## Border Radius

Add roundness to cards, buttons, and other elements by changing `--radius-base`:

| Style | Value | Effect |
|-------|-------|--------|
| Sharp | `0` | Square corners (default) |
| Subtle | `0.25rem` | Barely noticeable rounding |
| Moderate | `0.5rem` | Friendly, approachable |
| Rounded | `0.75rem` | Modern, softer feel |
| Very Rounded | `1rem` | Playful, casual |

**Example: Moderate rounding**

```css
--radius-base: 0.5rem;
```

### Which Elements Use Border Radius

The theming system applies radius to:

| Element | Variable Used |
|---------|---------------|
| Cards (cluster, lesson, concept) | `--radius-base` |
| Buttons | `--radius-base` |
| Callouts and panels | `--radius-base` |
| Code blocks | `--radius-base` |
| Number badges | `--radius-sm` |
| Inline code | `--radius-sm` |

Elements that DON'T have radius (by design):
- Navigation bar
- Full-width dividers
- Progress bars

---

## Shadows

Enable depth effects for a more dimensional look:

**Flat (Default)**

```css
--shadow-sm: none;
--shadow-md: none;
--shadow-lg: none;
```

**Subtle Depth**

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

**Pronounced Shadows**

```css
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.15), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.15), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

---

## Complete Theme Examples

### 1. Minimal Academic

Sharp corners, serif fonts, no shadows:

```css
:root {
  --color-primary: #1f2937;
  --color-primary-hover: #111827;
  --color-border: #1f2937;
  --font-heading: Georgia, 'Times New Roman', serif;
  --font-body: Georgia, 'Times New Roman', serif;
  --radius-base: 0;
  --shadow-sm: none;
  --shadow-md: none;
}
```

### 2. Friendly Modern

Rounded corners, blue accents, subtle shadows:

```css
:root {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-border: #e5e7eb;
  --color-border-light: #f3f4f6;
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --radius-base: 0.5rem;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

### 3. Nature-Inspired

Green palette, organic feel:

```css
:root {
  --color-primary: #166534;
  --color-primary-hover: #14532d;
  --color-accent: #22c55e;
  --color-background: #fefefe;
  --color-surface: #f0fdf4;
  --color-border: #86efac;
  --color-border-light: #bbf7d0;
  --font-heading: Georgia, serif;
  --font-body: system-ui, sans-serif;
  --radius-base: 0.75rem;
  --shadow-sm: 0 1px 3px 0 rgb(22 101 52 / 0.1);
}
```

### 4. Dark Mode (Experimental)

Invert for dark backgrounds:

```css
:root {
  --color-primary: #60a5fa;
  --color-primary-hover: #93c5fd;
  --color-background: #111827;
  --color-surface: #1f2937;
  --color-surface-elevated: #374151;
  --color-text: #f9fafb;
  --color-text-muted: #9ca3af;
  --color-text-inverse: #111827;
  --color-border: #374151;
  --color-border-light: #4b5563;
  --color-code-bg: #1f2937;
  --color-code-border: #374151;
}
```

---

## Component Reference

### Cards

Cards appear throughout the site for clusters, lessons, concepts, and resources.

**Affected by:**
- `--color-surface` (background)
- `--color-border` (border)
- `--radius-base` (corners)
- `--shadow-sm` / `--shadow-md` (depth)

**Hover behavior:**
- Border changes to `--color-primary`
- Shadow increases to `--shadow-md`

### Buttons

Primary call-to-action buttons (Start Reading, assignments).

**Affected by:**
- `--color-primary` (background)
- `--color-text-inverse` (text)
- `--radius-base` (corners)
- `--transition-base` (hover animation)

### Callouts

Information boxes for objectives, coming soon notices.

**Affected by:**
- `--color-surface` (background)
- `--color-primary` (left accent border)
- `--radius-base` (corners)

### Code Blocks

Fenced code blocks in markdown content.

**Affected by:**
- `--color-code-bg` (background)
- `--color-code-border` (border)
- `--font-mono` (font)
- `--radius-base` (corners)

### Number Badges

Cluster and lesson numbers in lists.

**Affected by:**
- `--color-border` (border)
- `--radius-sm` (corners—smaller for badges)
- `--font-weight-semibold` (text weight)

---

## Advanced: Adding Custom CSS

For changes beyond theming variables, add custom styles at the end of `src/app.css`:

```css
/* Custom overrides - add after the @layer blocks */

/* Example: Make cluster titles italic */
.cluster-title {
  font-style: italic;
}

/* Example: Add hover underline to resource links */
.resource-card h4 a:hover {
  text-decoration-thickness: 2px;
}
```

### Safe Custom Selectors

These classes are stable and safe to customize:

| Selector | Element |
|----------|---------|
| `.book-cover` | Homepage hero card |
| `.cluster-item` | Cluster cards on homepage |
| `.cluster-card` | Cluster cards on curriculum page |
| `.lesson-card` | Lesson cards in cluster view |
| `.concept-card` | Key concept cards in lessons |
| `.assignment-card` | Assignment section |
| `.knowledge-check-section` | Knowledge check section |
| `.resource-card` | Additional resource cards |
| `.lesson-callout` | Callout boxes |

---

## Testing Your Theme

After making changes:

1. **Run the dev server:**
   ```bash
   pnpm dev
   ```

2. **Check key pages:**
   - Homepage (hero, cluster list)
   - Curriculum listing (all clusters)
   - A cluster page (lesson list)
   - A lesson page (content, concepts, assignment)

3. **Test responsiveness:**
   - Resize your browser
   - Check on mobile

4. **Verify CMS still works:**
   - Go to `/admin`
   - Create/edit a test item
   - Confirm it saves and renders correctly

---

## Troubleshooting

### Changes not appearing?

1. Hard refresh: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)
2. Clear browser cache
3. Restart dev server

### Build fails after CSS changes?

- Check for syntax errors (missing semicolons, unclosed brackets)
- Ensure variable names match exactly
- Run `pnpm check` for TypeScript errors

### CMS preview looks different?

The CMS uses its own preview styling. Your theme won't affect the CMS admin interface—that's expected.

---

## Quick Reference

### File Locations

| File | Purpose |
|------|---------|
| `src/app.css` | All theme variables and global styles |
| `src/app.html` | Add Google Fonts links here |
| `src/routes/+page.svelte` | Homepage-specific styles |
| `src/routes/curriculum/+page.svelte` | Curriculum list styles |
| `src/routes/curriculum/[cluster]/+page.svelte` | Cluster page styles |
| `src/routes/curriculum/[cluster]/[lesson]/+page.svelte` | Lesson page styles |

### Essential Variables

```css
/* Colors */
--color-primary         /* Main brand color */
--color-background      /* Page background */
--color-text            /* Main text color */
--color-border          /* Border color */

/* Typography */
--font-heading          /* Titles and headings */
--font-body             /* Body text */

/* Shape */
--radius-base           /* Corner roundness */

/* Effects */
--shadow-md             /* Card shadows */
```
