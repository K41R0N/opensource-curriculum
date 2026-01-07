---
title: Customizing Your Curriculum
slug: customization
cluster: deployment-customization
order: 3
description: "Brand your curriculum with custom colors, logos, and site settings—no code required."
objectives:
  - Update site metadata and branding through the CMS
  - Understand the CSS custom properties system
  - Customize colors and typography to match your brand
key_concepts:
  - name: "Site Settings"
    explanation: |
      Core site information is stored in `content/settings/site.json`:

      - **title**: Your curriculum's name (appears in browser tabs)
      - **description**: Meta description for search engines
      - **author**: Creator attribution
      - **logo**: Path to your logo image

      Edit these through the CMS under "Settings" → "Site Settings".
  - name: "CSS Custom Properties"
    explanation: |
      The curriculum uses CSS custom properties (variables) for theming. Key variables in `src/app.css`:

      ```css
      :root {
        --color-primary: #2563eb;
        --color-background: #ffffff;
        --color-text: #1f2937;
        --font-body: system-ui, sans-serif;
        --font-heading: system-ui, sans-serif;
      }
      ```

      Change these values to instantly update colors across the entire site.
  - name: "Content-First Customization"
    explanation: |
      The most important customization isn't visual—it's your content.

      Before tweaking colors:
      1. Write compelling cluster and lesson descriptions
      2. Craft a clear About page explaining your curriculum's purpose
      3. Define your domain and audience clearly

      Good content with default styling beats poor content with custom branding.
assignment:
  instructions: |
    Customize your curriculum in this order:

    **1. Site Identity (CMS)**
    1. Log into the CMS at `/admin/`
    2. Go to "Settings" → "Site Settings"
    3. Update:
       - Site title
       - Site description (for SEO)
       - Author name
    4. Save and publish

    **2. About Page (CMS)**
    1. Go to "Pages" → "About"
    2. Write a compelling description of your curriculum
    3. Include:
       - What learners will gain
       - Who this is for
       - Your background/credibility
    4. Save and publish

    **3. Colors (Code)**
    If you want custom colors, edit `src/app.css`:
    1. Find the `:root` section
    2. Change `--color-primary` to your brand color
    3. Commit and push

    **4. Logo (Files)**
    To add a logo:
    1. Add your logo image to `static/images/`
    2. Update the logo path in Site Settings
    3. Or edit the header component directly
knowledge_check:
  - question: "What should you customize before changing colors?"
    hint: "Think about what visitors actually read vs. what they see."
  - question: "How do CSS custom properties make theming easier?"
    hint: "Consider what happens when you change a variable in one place."
---

## Making It Yours

Your curriculum is deployed and the CMS works. Now it's time to make it feel like yours.

## Priority Order

Resist the temptation to start with colors and logos. The most impactful customizations are:

1. **Content** - What you teach matters most
2. **Messaging** - Clear descriptions of what learners gain
3. **Visual identity** - Colors, logos, typography

Work in this order for maximum impact with minimum effort.

## Site Settings

The CMS provides a simple interface for core settings:

1. Navigate to `/admin/`
2. Click "Settings" in the sidebar
3. Select "Site Settings"

Here you can update:
- **Site Title**: Appears in browser tabs and search results
- **Description**: The meta description for SEO
- **Author**: Attribution shown in the footer

Changes save to `content/settings/site.json` and trigger a rebuild.

## The About Page

Your About page is often the second page visitors read. Make it count.

Good About pages include:
- **The problem**: What gap does this curriculum fill?
- **The approach**: How is this different from alternatives?
- **The outcome**: What will learners be able to do?
- **Your credibility**: Why should they trust this curriculum?

Edit it through the CMS under "Pages" → "About".

## Color Theming

The curriculum uses CSS custom properties for easy theming. To change colors:

1. Open `src/app.css` in your code editor
2. Find the `:root` block (near the top)
3. Modify the color variables:

```css
:root {
  /* Primary color - used for links, buttons, accents */
  --color-primary: #2563eb;

  /* Background colors */
  --color-background: #ffffff;
  --color-surface: #f9fafb;

  /* Text colors */
  --color-text: #1f2937;
  --color-text-muted: #6b7280;

  /* Other colors */
  --color-border: #e5e7eb;
  --color-success: #10b981;
}
```

### Choosing Colors

For academic curricula, consider:
- **Muted, professional tones** - Blues, greens, warm grays
- **High contrast** - Ensure text is readable
- **Consistency** - One primary color, used consistently

Tools for color selection:
- [Coolors](https://coolors.co) - Palette generator
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - Accessibility verification

### Dark Mode

The template includes basic dark mode support via `prefers-color-scheme`. To customize dark mode colors, add:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1f2937;
    --color-surface: #374151;
    --color-text: #f9fafb;
    /* ... other dark mode colors */
  }
}
```

## Typography

To change fonts:

1. Add your font (Google Fonts, local files, etc.)
2. Update the font variables:

```css
:root {
  --font-body: 'Inter', system-ui, sans-serif;
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

For academic content, consider:
- **Serif headings** - Traditional, scholarly feel
- **Sans-serif body** - Clean, readable on screens
- **Generous line height** - 1.5-1.7 for body text

## Adding a Logo

To add a logo:

1. Create or obtain your logo (SVG preferred for quality)
2. Save it to `static/images/logo.svg`
3. The header component will display it

For text-only branding, the site title displays in the header by default.

## Favicon

To change the browser tab icon:

1. Create a favicon (use [favicon.io](https://favicon.io) for generation)
2. Replace `static/favicon.png`
3. Redeploy

## Advanced Customization

For deeper changes, you can edit the Svelte components directly:

- `src/routes/+layout.svelte` - Site-wide layout
- `src/routes/+page.svelte` - Homepage
- Component styling in each `.svelte` file

This requires basic knowledge of HTML, CSS, and Svelte. The codebase is intentionally simple to make customization accessible.

## What Not to Customize

Some things are better left alone:
- **Content structure** - The cluster/lesson hierarchy works
- **CMS configuration** - Unless you understand the implications
- **Build settings** - The defaults are optimized

Focus your energy on content and light visual tweaks. The infrastructure should fade into the background.

