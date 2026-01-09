---
title: Advanced Customization
slug: advanced-customization
cluster: making-it-yours
order: 3
description: "Border radius, shadows, and custom CSS for when theme variables aren't enough."
objectives:
  - Apply border radius to create different visual moods
  - Use shadows for depth and hierarchy
  - Write safe custom CSS that won't break during updates
key_concepts:
  - name: "Border Radius Psychology"
    explanation: |
      Corner roundness communicates mood:

      - **Sharp (0)**: Serious, professional, authoritative
      - **Subtle (0.25rem)**: Clean, refined, slightly softer
      - **Moderate (0.5rem)**: Friendly, approachable, modern
      - **Rounded (0.75rem+)**: Playful, casual, inviting

      The default template uses sharp corners for a minimal, academic feel. Change `--radius-base` to shift the entire mood.
  - name: "Shadows as Hierarchy"
    explanation: |
      Shadows create visual hierarchy by suggesting elevation:

      - No shadow: Flat, equal importance
      - Small shadow: Slight lift, mild emphasis
      - Medium shadow: Floating, interactive element
      - Large shadow: Modal, high importance

      The default is flat (no shadows). Enable them for a more dimensional, Material Design-inspired look.
  - name: "The Custom CSS Escape Hatch"
    explanation: |
      When theme variables don't cover your needs, you can add custom CSS rules at the end of `src/app.css`.

      Rules to follow:
      1. Add after all existing styles
      2. Use specific class selectors (`.concept-card`, not `div`)
      3. Test on all pages and screen sizes
      4. Comment what your custom CSS does

      This is an escape hatch—use sparingly. The more custom CSS you add, the more you'll need to maintain.
knowledge_check:
  - question: "When would you choose rounded corners over sharp ones?"
    hint: "Think about the subject matter and intended audience."
  - question: "Why should custom CSS be added at the end of app.css rather than inline?"
    hint: "Consider maintainability and what happens during theme updates."
additional_resources:
  - title: "CSS Border Radius Generator"
    author: "Various"
    url: "https://cssgenerator.org/border-radius-css-generator.html"
    description: "Visual tool for generating border radius values."
  - title: "Box Shadow CSS Generator"
    author: "CSSmatic"
    url: "https://www.cssmatic.com/box-shadow"
    description: "Visual tool for creating box shadow values."
---

## Border Radius: Setting the Mood

Border radius is one of the most impactful visual changes you can make. It transforms the entire feel of the site with a single variable.

### How to Change It

In `src/app.css`, find:

```css
--radius-base: 0;  /* DEFAULT: Change this to add roundness site-wide */
```

Change the value:

| Value | Effect |
|-------|--------|
| `0` | Sharp, square corners |
| `0.25rem` | Barely perceptible rounding |
| `0.5rem` | Noticeable but subtle |
| `0.75rem` | Clearly rounded |
| `1rem` | Very rounded |

### What Gets Rounded

The `--radius-base` variable affects:

- Cluster and lesson cards
- Concept and resource cards
- Assignment and knowledge check sections
- Callout boxes
- Buttons
- Code blocks

Smaller elements (badges, icons) use `--radius-sm` for proportionally smaller rounding.

### Match Radius to Content

**Philosophy, History, Literary Analysis**
Sharp corners (0) → Serious, traditional, scholarly

**Design, UX, Creative Fields**
Moderate rounding (0.5rem) → Approachable, modern, clean

**Education, Community, Wellness**
More rounding (0.75rem+) → Friendly, warm, inviting

## Shadows: Adding Depth

Shadows create the illusion that elements are floating above the page. This establishes visual hierarchy.

### Enabling Shadows

By default, all shadows are `none`. To enable them, update in `src/app.css`:

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

### How Shadows Are Used

| Variable | Where It Appears |
|----------|------------------|
| `--shadow-sm` | Cards at rest, subtle elevation |
| `--shadow-md` | Cards on hover, interactive feedback |
| `--shadow-lg` | Reserved for modals, high-priority items |

### Shadow + Radius Combinations

**Flat + Sharp**: Minimal, Bauhaus-inspired, serious
**Flat + Rounded**: Soft, modern, clean
**Shadows + Sharp**: Corporate, Material Design
**Shadows + Rounded**: Friendly, contemporary apps

## Writing Custom CSS

When you need changes beyond variables, add custom CSS at the end of `src/app.css`.

### Safe Selectors

These classes are stable and safe to customize:

```css
/* Cards */
.book-cover          /* Homepage hero */
.cluster-item        /* Clusters on homepage */
.cluster-card        /* Clusters on curriculum page */
.lesson-card         /* Lessons in cluster view */
.concept-card        /* Key concepts in lessons */
.resource-card       /* Additional resources */

/* Sections */
.assignment-card           /* Assignment section */
.knowledge-check-section   /* Knowledge check */
.lesson-callout            /* Callout boxes */

/* Buttons */
.book-cta            /* Homepage CTA */
.curriculum-cta      /* Curriculum page CTA */
.assignment-link     /* Assignment reading link */
```

### Example: Custom Hover Effect

Add a scale effect when hovering over cards:

```css
/* Custom: Scale cards on hover */
.cluster-card:hover,
.lesson-card:hover {
  transform: translateY(-2px);
}
```

### Example: Custom Heading Style

Make all lesson titles italic:

```css
/* Custom: Italic lesson titles */
.lesson-title {
  font-style: italic;
}
```

### Example: Accent Color on Callouts

Change the left border color on callouts:

```css
/* Custom: Green callout accent */
.lesson-callout {
  border-left-color: #22c55e;
}
```

### Best Practices for Custom CSS

1. **Comment everything**: Future you will forget why
2. **Be specific**: Use class names, not tag names
3. **Test mobile**: Custom styles can break responsive layouts
4. **Keep it minimal**: Every custom rule is maintenance

## Putting It All Together

Here's a complete theme transformation—from minimal to friendly:

```css
:root {
  /* Colors: Warm and inviting */
  --color-primary: #0d9488;
  --color-primary-hover: #0f766e;
  --color-background: #ffffff;
  --color-surface: #f0fdfa;
  --color-border: #99f6e4;
  --color-border-light: #ccfbf1;

  /* Typography: Modern sans */
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;

  /* Shape: Friendly rounded */
  --radius-base: 0.75rem;
  --radius-sm: 0.375rem;

  /* Depth: Subtle shadows */
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.08);
}
```

This transforms the austere default into something warm and contemporary—same content, completely different feel.

## Congratulations

You've completed the customization cluster. You now understand:

- How the theme system separates styling from content
- How to change colors and typography
- When and how to use border radius and shadows
- How to write safe custom CSS

Your curriculum is now truly yours—visually distinct and aligned with your subject matter.
