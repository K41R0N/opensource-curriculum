---
title: Understanding the Theme System
slug: theme-system
cluster: making-it-yours
order: 1
description: "How the site's styling is organized and why it's safe to customize."
objectives:
  - Understand the separation between content, structure, and styling
  - Learn where theme variables are defined
  - Know what you can and cannot safely change
key_concepts:
  - name: "CSS Custom Properties"
    explanation: |
      The site uses CSS custom properties (also called CSS variables) to control its appearance. These are defined once in `src/app.css` and used throughout all components.

      For example, `--color-primary` defines your main brand color. Change it once, and every button, link, and accent updates automatically.

      This means you can transform the entire look of the site by editing a handful of values in one file.
  - name: "The Three Layers"
    explanation: |
      The site is built in three distinct layers:

      1. **Content** — Markdown files in `content/`. Managed by the CMS.
      2. **Structure** — Svelte components in `src/routes/`. Defines layout and behavior.
      3. **Styling** — CSS variables in `src/app.css`. Controls visual appearance.

      You customize layer 3 (styling) without touching layers 1 or 2. This separation means your visual changes won't break content or functionality.
  - name: "Safe vs. Unsafe Changes"
    explanation: |
      **Safe to change:**
      - Values of CSS variables (colors, fonts, sizes)
      - Adding custom CSS rules at the end of `app.css`

      **Unsafe to change:**
      - Variable *names* (components reference these exactly)
      - HTML structure in Svelte files
      - Field names in the CMS config

      Stick to changing values, not names, and you'll never break anything.
knowledge_check:
  - question: "Where are all the theme variables defined?"
    hint: "It's a single CSS file at the root of the src directory."
  - question: "Why is it safe to change variable values but not variable names?"
    hint: "Think about what happens when a component tries to use a variable that doesn't exist."
---

## How Styling Works in This Template

Every component in this site—cards, buttons, headers, code blocks—gets its colors, fonts, and sizes from CSS custom properties defined in one central file.

Here's a simplified view of how it works:

```css
/* In src/app.css */
:root {
  --color-primary: #000000;
}

/* In a component */
.button {
  background-color: var(--color-primary);
}
```

When you change `--color-primary` to `#2563eb` (a blue), every element using that variable updates automatically. You don't need to find and replace colors throughout the codebase.

## The Theme File

All theme variables live in `src/app.css`. Open this file and you'll see sections for:

| Section | What It Controls |
|---------|------------------|
| Colors | Primary, background, text, borders |
| Typography | Font families, weights |
| Border Radius | Corner roundness |
| Shadows | Depth effects |
| Spacing | Consistent margins and padding |

Each section has comments explaining the options and how to change them.

## What Components Use the Theme

The theme variables are used by every visual element:

**Cards and Panels**
- Cluster cards on the curriculum page
- Lesson cards in cluster views
- Concept cards within lessons
- Assignment and knowledge check sections

**Interactive Elements**
- Call-to-action buttons
- Navigation links
- Copy buttons on code blocks

**Content Elements**
- Headings and body text
- Code blocks and inline code
- Blockquotes and callouts

## The "No Surprises" Principle

The theme system follows a simple principle: changing a value should do exactly what you expect, everywhere.

- Change `--color-primary`? All primary-colored elements update.
- Change `--radius-base`? All card corners update.
- Change `--font-heading`? All headings update.

There are no hidden dependencies or surprising side effects. If you change a color, it changes that color—nothing more, nothing less.

## Trying It Out

The best way to understand the theme system is to experiment:

1. Open `src/app.css` in your editor
2. Find `--color-primary: #000000;`
3. Change it to `--color-primary: #dc2626;` (a red)
4. Save and watch the dev server hot-reload
5. See how buttons, accents, and borders all change

Now you understand the power of the theme system. The next lesson covers practical customization of colors and typography.
