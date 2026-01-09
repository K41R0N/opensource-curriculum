---
title: Customizing Colors and Fonts
slug: colors-fonts
cluster: making-it-yours
order: 2
description: "Practical guide to changing your site's color palette and typography."
blocks:
  - type: concept
    name: "Color Semantics"
    explanation: |
      Colors aren't just aesthetic—they communicate meaning:

      - **Primary**: Your brand identity. Used for buttons, accents, emphasis.
      - **Background/Surface**: The canvas. Usually white or very light.
      - **Text**: Must have high contrast with background for readability.
      - **Border**: Defines boundaries. Can be subtle or bold.

      When choosing colors, think about what each will communicate.
  - type: concept
    name: "Font Pairing"
    explanation: |
      The site uses two font variables:

      - `--font-heading`: For titles, navigation, emphasis
      - `--font-body`: For paragraphs, descriptions, lists

      Common approaches:

      1. **Same font for both**: Clean, unified look (most common)
      2. **Serif headings, sans body**: Classic, academic feel
      3. **Sans headings, serif body**: Modern but readable

      System fonts (the default) load instantly. Custom fonts add personality but require loading.
  - type: concept
    name: "Contrast and Accessibility"
    explanation: |
      Your text must be readable. The WCAG guidelines recommend:

      - Regular text: 4.5:1 contrast ratio with background
      - Large text: 3:1 contrast ratio

      The default theme uses black on white (21:1 ratio)—maximum contrast. If you lighten text or darken backgrounds, verify you maintain readability.

      Use a contrast checker like [WebAIM's tool](https://webaim.org/resources/contrastchecker/).
  - type: check
    question: "What's the difference between --color-primary and --color-accent?"
    hint: "Think about frequency of use and where each appears."
  - type: check
    question: "Why might you choose system fonts over a custom font like Inter?"
    hint: "Consider loading performance and dependencies."
  - type: resource
    title: "Realtime Colors"
    author: "Juxtopposed"
    url: "https://www.realtimecolors.com/"
    description: "Generate and preview color palettes in real-time."
assignment:
  instructions: |
    Apply a custom color palette to your curriculum site:

    1. Open `src/app.css` in your editor
    2. Choose a color palette from the styling guide (or create your own)
    3. Update the color variables in the `:root` section
    4. Run `pnpm dev` and preview your changes
    5. Test the palette across multiple pages

    **Bonus**: Try a custom font. Add a Google Fonts link to `src/app.html` and update the font variables.
  url: /docs/styling-guide.md
  reading_title: "Styling Guide - Color Palettes"
---

## Choosing a Color Palette

Your curriculum's color palette sets its personality before readers engage with a single word. Here's how to choose wisely.

### Start With Your Primary Color

The primary color is your brand. It appears on:
- Call-to-action buttons
- Hover states
- Accent borders on callouts and concept cards
- Links (in some themes)

**Academic/Serious**: Deep blues (#1e40af), dark grays (#374151), forest green (#166534)

**Warm/Inviting**: Terracotta (#9a3412), amber (#b45309), burgundy (#991b1b)

**Modern/Tech**: Electric blue (#2563eb), purple (#7c3aed), teal (#0d9488)

### Keep Enough Contrast

Whatever primary you choose, ensure your text remains readable:

```css
/* Good: High contrast */
--color-text: #1f2937;        /* Dark gray text */
--color-background: #ffffff;  /* White background */

/* Bad: Low contrast */
--color-text: #9ca3af;        /* Light gray text */
--color-background: #f3f4f6;  /* Light gray background */
```

### Example: Academic Blue Theme

```css
:root {
  --color-primary: #1e40af;
  --color-primary-hover: #1e3a8a;
  --color-accent: #3b82f6;
  --color-background: #ffffff;
  --color-surface: #ffffff;
  --color-text: #1f2937;
  --color-text-muted: #6b7280;
  --color-border: #1e40af;
  --color-border-light: #dbeafe;
}
```

This palette says "scholarly but approachable"—the blue connotes trust and authority without being cold.

## Choosing Fonts

Fonts have distinct personalities. Choose based on what your curriculum communicates.

### System Fonts (Default)

```css
--font-heading: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-body: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Pros**: Loads instantly, looks native on each platform, no external dependencies
**Best for**: Technical curricula, minimalist design, performance priority

### Serif Fonts

```css
--font-heading: Georgia, 'Times New Roman', serif;
--font-body: Georgia, 'Times New Roman', serif;
```

**Pros**: Traditional, academic feel, excellent for long-form reading
**Best for**: Humanities, philosophy, literary analysis

### Custom Sans-Serif (Inter)

First, add to `src/app.html` in the `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Then in `src/app.css`:

```css
--font-heading: 'Inter', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
```

**Pros**: Modern, highly legible, excellent for web
**Best for**: Contemporary topics, design-focused curricula

### Mixed Pairing

```css
--font-heading: Georgia, 'Times New Roman', serif;
--font-body: system-ui, -apple-system, sans-serif;
```

Serif headings add gravitas; sans-serif body maintains readability.

## Testing Your Choices

After making changes, walk through the site:

1. **Homepage**: Is the hero card inviting? Do cluster cards feel cohesive?
2. **Curriculum listing**: Can you scan cluster titles easily?
3. **Lesson page**: Is body text comfortable to read? Do code blocks stand out?
4. **Mobile**: Do colors and fonts work at smaller sizes?

## Common Mistakes

### Too Many Colors

Stick to 3-4 colors maximum:
- Primary (brand)
- Background
- Text
- One accent (optional)

More than this creates visual noise.

### Low Contrast Text

Gray text on gray backgrounds might look "sophisticated" but destroys readability. Your readers will unconsciously strain and leave.

### Slow-Loading Fonts

Every custom font adds load time. If you use Google Fonts, use `display=swap` and limit weights:

```html
<!-- Good: Only needed weights -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap">

<!-- Bad: All weights -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900">
```

## Next Steps

Colors and fonts are the foundation. The next lesson covers advanced customization—border radius, shadows, and custom CSS for when the theme variables aren't enough.
