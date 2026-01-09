---
title: Understanding the CMS Fields
slug: cms-fields
cluster: building-manually
order: 3
description: "What each field in the CMS does, which are required, and what to keep in mind when filling them."
blocks:
  - type: objectives
    items:
      - Understand the purpose of each CMS field
      - Know which fields are required vs. optional
      - Learn how the unified Content Blocks system works
      - Learn best practices for writing effective content in each field
  - type: concept
    name: "Required vs. Optional Fields"
    explanation: |
      **Required** fields (5 total) must be filled for the lesson to work:
      - Title, Slug, Cluster, Order, Description

      **Everything else is optional.** Empty sections simply won't appear on the page.

      **Common combinations**:
      - *Minimal*: Required fields + Introduction + Assignment (reading link)
      - *Standard*: Above + a few Content Blocks
      - *Full*: All sections populated with multiple block types

      You have complete flexibility—use only what each lesson needs.
  - type: concept
    name: "The Slug Field"
    explanation: |
      The slug becomes part of the URL: `yoursite.com/curriculum/cluster-slug/lesson-slug`

      Good slugs are:
      - **Lowercase**: `social-construction` not `Social-Construction`
      - **Hyphenated**: `finding-readings` not `finding_readings`
      - **Descriptive**: `phenomenology-tools` not `lesson-3`
      - **Short but clear**: `media-ecology` not `the-study-of-media-ecology`

      Don't change slugs after publishing—it breaks existing links.
  - type: concept
    name: "Description vs. Introduction"
    explanation: |
      These serve different purposes:

      **Description** (1-2 sentences):
      - Appears in lesson cards and lists
      - Helps learners decide whether to read
      - Should answer: "What will I learn?"

      **Introduction** (paragraphs):
      - Appears at the top of the lesson page
      - Provides context and motivation
      - Sets up why the reading matters
  - type: concept
    name: "Content Blocks System"
    explanation: |
      Content Blocks are a unified system for all card-like content. Instead of separate fields for objectives, concepts, questions, and resources, you use a single **Content Blocks** list.

      Each block has a **type** that determines how it renders:
      - **Learning Objectives**: Bullet list of what learners will achieve
      - **Key Concept**: Named concept with explanation
      - **Knowledge Check**: Reflection question with optional hint
      - **Resource**: External link with description
      - **Callouts**: Ask, Example, Tip, Important, Reflection, Context

      Add blocks in any order. Mix and match types. Maximum 15 blocks per lesson.
  - type: check
    question: "Why shouldn't you change a slug after publishing?"
    hint: "Think about how URLs work and what happens to existing links."
  - type: check
    question: "What's the difference between a lesson description and its body content?"
    hint: "Consider where each appears and what purpose it serves."
  - type: resource
    title: "Sveltia CMS Documentation"
    url: "https://github.com/sveltia/sveltia-cms"
    description: "Full reference for the CMS interface."
assignment:
  instructions: |
    Familiarize yourself with the CMS by creating a test lesson:

    1. Go to `your-site.netlify.app/admin/`
    2. Click "Lessons" → "New Lesson"
    3. Fill in each field according to the guide below
    4. Save and preview the result
    5. Delete the test lesson or keep it as a template

    **Use this as a reference while building your actual lessons.**
---

## CMS Field Reference

This is your complete guide to every field in the lesson editor. Keep this open as you create content.

---

## Flexible Content Structure

**You control what appears on each lesson page.** Only 5 metadata fields are required—everything else is optional and won't render if left empty.

This means you can create:
- **Minimal lessons**: Just a title, description, intro, and reading link
- **Full lessons**: All sections filled with rich content blocks
- **Anything in between**: Mix and match based on what each reading needs

Content Blocks are flexible—add objectives, concepts, questions, resources, and callouts in any order. If you don't add any blocks, that section simply won't appear. The page adapts to whatever content you provide.

---

## Required Fields

These fields must be filled for the lesson to function.

### Title
**What it is**: The lesson name displayed on the site

**Best practices**:
- Be descriptive but concise (5-10 words)
- Use title case: "The Social Construction of Reality"
- Don't include lesson numbers—order is handled separately

**Examples**:
- ✓ "Finding Foundational Readings"
- ✓ "How Institutions Shape Thought"
- ✗ "Lesson 3: Readings" (too vague, includes number)
- ✗ "THE SOCIAL CONSTRUCTION OF REALITY CHAPTER ONE" (too long, all caps)

### Slug
**What it is**: The URL-friendly identifier for this lesson

**Best practices**:
- Lowercase letters and hyphens only
- No spaces, underscores, or special characters
- Keep it short but recognizable
- Never change after publishing

**Examples**:
- ✓ `social-construction`
- ✓ `finding-readings`
- ✗ `Social Construction` (spaces, caps)
- ✗ `lesson_3` (underscore, not descriptive)

### Cluster
**What it is**: Which cluster this lesson belongs to (dropdown)

**Best practices**:
- Create clusters before lessons
- Each lesson belongs to exactly one cluster
- Changing cluster after publishing is okay

### Order
**What it is**: Position within the cluster (number)

**Best practices**:
- Use integers: 1, 2, 3...
- Gaps are okay: 1, 2, 5 works if you might add lessons later
- Lower numbers appear first

### Description
**What it is**: 1-2 sentence summary shown in listings

**Best practices**:
- Answer "What will I learn from this lesson?"
- Be specific, not generic
- Avoid jargon—this is a preview for potential readers

**Examples**:
- ✓ "How Berger and Luckmann explain the process by which human activity becomes objective social reality."
- ✗ "An important reading in sociology." (too vague)
- ✗ "This lesson covers social construction theory including externalization, objectivation, and internalization as described in the 1966 text." (too long for a description)

---

## Core Content Fields

These fields provide the main lesson content.

### Assignment
**What it is**: Instructions for the primary reading

**Structure**:
```yaml
assignment:
  instructions: |
    What to read and how to approach it.
    Markdown formatting works here.
  url: "https://archive.org/..."
  reading_title: "Full citation of the reading"
```

**Best practices**:
- Include specific page ranges if not reading entire work
- Suggest what to pay attention to
- Estimate time if known ("Approximately 90 minutes")
- Verify the URL works before publishing

### Introduction (Body Content)
**What it is**: Introductory paragraphs shown at top of lesson

**Best practices**:
- 2-4 paragraphs
- Explain why this reading matters
- Connect to the curriculum's central question
- Set up what to expect without summarizing

**What to include**:
- Historical context (when/why was this written?)
- Significance (why is this foundational?)
- Connection (how does this relate to other lessons?)
- Reading guidance (what's the text like to read?)

---

## Content Blocks

Content Blocks are a unified system for all card-like content. Instead of separate fields, you use a single **Content Blocks** list with different block types. Maximum 15 blocks per lesson.

### Learning Objectives Block
**What it is**: Bullet list of what learners will achieve

**Structure**:
```yaml
blocks:
  - type: objectives
    items:
      - "First learning objective"
      - "Second learning objective"
```

**Best practices**:
- 3-5 objectives per lesson
- Start with action verbs (Understand, Identify, Apply)
- Be specific about what learners will be able to do

### Key Concept Block
**What it is**: Named concept with detailed explanation

**Structure**:
```yaml
blocks:
  - type: concept
    name: "Concept Name"
    explanation: |
      Explanation paragraphs here.
      Can include **markdown** formatting.
```

**Best practices**:
- Names should be 2-5 words
- Explanations should be 2-4 paragraphs
- Focus on ideas *in the reading*, not general background
- 3-5 concepts per lesson keeps focus

### Knowledge Check Block
**What it is**: Reflection question for self-assessment

**Structure**:
```yaml
blocks:
  - type: check
    question: "The question text"
    hint: "A hint to guide thinking"
```

**Best practices**:
- Questions should require having done the reading
- Focus on understanding, not recall
- Hints should guide without giving answers

### Resource Block
**What it is**: External resource with link and description

**Structure**:
```yaml
blocks:
  - type: resource
    title: "Resource Title"
    author: "Author Name"
    url: "https://..."
    description: "Brief description of what this adds"
```

**Best practices**:
- Include a mix of types (articles, videos, related books)
- These are optional—not required for completing the lesson
- Describe what each resource adds

### Callout Blocks
**What it is**: Contextual blocks for tips, examples, warnings, and questions

**Available types**:
- `ask` - "Ask Yourself" - prompts for critical evaluation
- `example` - "Example" - practical illustrations
- `tip` - "Tip" - helpful tips and guidance
- `important` - "Important" - critical notes or warnings
- `reflection` - "Reflection" - reflection questions
- `context` - "Context" - timing or situational guidance

**Structure**:
```yaml
blocks:
  - type: important
    title: "Custom Title"  # optional - overrides default
    content: |
      Your markdown content here.
      Can include **formatting** and multiple paragraphs.
```

**Best practices**:
- Use sparingly throughout the lesson
- Choose the type that best matches your intent
- Custom titles are optional; defaults work well
- Keep content focused and concise

---

## Optional Fields

These enhance lessons but can be added later.

### Reading Author
**What it is**: The author of the primary reading (optional)

**Best practices**:
- Fill in if you want to credit the reading's author
- This appears on the lesson page
- Leave blank if the author is obvious from context

### Featured Image
**What it is**: Image displayed with the lesson (optional)

**Best practices**:
- Use if you have a relevant, high-quality image
- Ensure you have rights to use it
- Leave blank rather than using a generic placeholder

### Hidden Sections
**What it is**: Toggle visibility of sections without deleting content

**Available options**:
- Introduction
- Assignment
- Content Blocks

**Use cases**:
- Test how lessons look with/without certain sections
- Temporarily hide content that's in draft state
- Create cleaner minimal lessons while preserving work-in-progress content

This is a multi-select field—choose any combination of sections to hide.

---

## Field Checklist for New Lessons

When creating a lesson, work through this checklist:

**Required** (lesson won't save without these 5):
- [ ] Title
- [ ] Slug (checked for lowercase, hyphens)
- [ ] Cluster selected
- [ ] Order number
- [ ] Description (1-2 sentences)

**Everything below is optional**—empty sections won't render at all.

**For minimal lessons** (just the reading):
- [ ] Introduction (why this reading matters)
- [ ] Assignment (instructions + reading URL)

**For richer lessons** (add Content Blocks as needed):
- [ ] Learning objectives block (3-5 bullet points)
- [ ] Key concept blocks (3-5 with explanations)
- [ ] Knowledge check blocks (2-4 reflection questions)
- [ ] Resource blocks (2-4 links)
- [ ] Callout blocks (tips, examples, important notes)
- [ ] Reading author (if relevant)
- [ ] Featured image (if available)

---

## Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Changing slugs | Breaks existing links | Never change after publishing |
| Vague descriptions | Learners don't know what they'll get | Be specific about what's learned |
| Too many concept blocks | Dilutes focus | Stick to 3-5 most important |
| Empty body | Lesson feels incomplete | Write at least 2 paragraphs of context |
| Unverified URLs | Learners can't access reading | Always test links before publishing |
| Recall-based questions | Doesn't test understanding | Ask about implications and connections |
| Too many blocks | Overwhelming for learners | Maximum 15 blocks, focus on essentials |
