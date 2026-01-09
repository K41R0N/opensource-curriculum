---
title: Auto-Populating Your CMS
slug: auto-populate
cluster: building-curriculum
order: 4
description: "Use AI to generate complete lesson content and batch-populate your curriculum for first deployment."
key_concepts:
  - name: "The Batch Generation Approach"
    explanation: |
      Rather than writing each lesson from scratch, you can use AI to generate a complete first draft of your entire curriculum. This gives you:

      - **Speed**: A full curriculum in hours, not weeks
      - **Consistency**: Uniform structure across all lessons
      - **A starting point**: Something to edit rather than a blank page

      The goal isn't perfection—it's a complete draft you can refine over time.
  - name: "The Lesson Generation Prompt"
    explanation: |
      For each reading in your curriculum, the Lesson Generation Prompt creates:

      - Introduction explaining why the reading matters
      - 3-5 key concepts to focus on
      - Assignment instructions with reading link
      - Knowledge check questions
      - Additional resource suggestions

      Feed it your reading list and domain context, and it produces structured lesson content ready for the CMS.
  - name: "Formatting for CMS Entry"
    explanation: |
      The CMS expects specific fields:

      - **title**: Lesson name
      - **slug**: URL-friendly identifier (e.g., `social-construction-reality`)
      - **description**: 1-2 sentence summary
      - **key_concepts**: Name + explanation pairs
      - **assignment**: Instructions and reading link
      - **knowledge_check**: Question + hint pairs
      - **body**: Main lesson content (markdown)

      Ask the AI to output in this format so you can copy directly into CMS fields.
  - name: "Quality vs. Speed Tradeoff"
    explanation: |
      AI-generated content is a draft, not a finished product. Common issues to watch for:

      - **Generic explanations**: May lack your unique perspective
      - **Hallucinated resources**: Always verify links and citations
      - **Inconsistent depth**: Some lessons may need more context
      - **Missing connections**: AI doesn't see your full vision

      Plan to spend 5-10 minutes reviewing each generated lesson before publishing.
assignment:
  instructions: |
    Generate complete lesson content for your curriculum:

    1. **Prepare your inputs**:
       - Your domain definition (from Lesson 1)
       - Your reading list with themes (from Lesson 2)
       - Your cluster structure (from Lesson 3)

    2. **Run the Lesson Generation Prompt** for each cluster:
       - Feed it 3-5 readings at a time
       - Ask for output formatted for your CMS fields
       - Save each response

    3. **Enter into the CMS**:
       - Go to `your-site.netlify.app/admin/`
       - Create each cluster first
       - Add lessons, copying from AI output
       - Save frequently

    4. **Quick review pass**:
       - Verify all links work
       - Check for obvious errors
       - Don't perfect—just publish

    Your curriculum is now live. Refinement comes next.
knowledge_check:
  - question: "Why generate a complete draft before refining individual lessons?"
    hint: "Think about momentum and having something to react to."
  - question: "What should you always verify in AI-generated lesson content?"
    hint: "Consider what AI is known to get wrong."
additional_resources:
  - title: "Sveltia CMS Documentation"
    url: "https://github.com/sveltia/sveltia-cms"
    description: "Reference for the CMS interface and field types."
---

## The Case for Batch Generation

Many curriculum creators stall at content creation. Defining the domain is exciting. Finding readings feels productive. But sitting down to write 20+ lessons? That's where projects die.

Batch generation solves this by giving you something to edit instead of a blank page. A mediocre first draft you can improve beats no draft at all.

## The Lesson Generation Prompt

Use this prompt for each cluster of readings:

```markdown
I'm building a self-directed research curriculum on [YOUR DOMAIN].

Here are readings for the "[CLUSTER NAME]" cluster:

1. [READING 1 - Author, Title, Year]
2. [READING 2 - Author, Title, Year]
3. [READING 3 - Author, Title, Year]

For each reading, generate a complete lesson with:

## Lesson: [Title]

**slug**: [url-friendly-version]

**description**: [1-2 sentences on why this reading matters]

**key_concepts**:
- name: "[Concept 1]"
  explanation: |
    [2-3 paragraphs explaining this concept]

- name: "[Concept 2]"
  explanation: |
    [2-3 paragraphs explaining this concept]

- name: "[Concept 3]"
  explanation: |
    [2-3 paragraphs explaining this concept]

**assignment**:
  instructions: |
    [Clear instructions for engaging with the reading]
  url: [Link to access the reading, if known]
  reading_title: "[Full citation]"

**knowledge_check**:
- question: "[Reflection question 1]"
  hint: "[Hint to guide thinking]"
- question: "[Reflection question 2]"
  hint: "[Hint to guide thinking]"

**body**: |
  [2-4 paragraphs introducing the reading, its context,
  why it matters for the curriculum, and what to pay attention to]

---

Make explanations accessible to someone new to the field.
Focus on what makes each reading foundational, not just what it contains.
```

## Entering Content into the CMS

### Step 1: Create Your Clusters First

1. Go to `your-site.netlify.app/admin/`
2. Navigate to "Clusters" in the sidebar
3. Create each cluster with title, slug, description, and order
4. Save each one before moving on

### Step 2: Add Lessons to Each Cluster

For each generated lesson:

1. Click "Lessons" → "New Lesson"
2. Fill in basic fields:
   - **Title**: From your AI output
   - **Slug**: URL-friendly version (e.g., `social-construction`)
   - **Cluster**: Select from dropdown
   - **Order**: Position within cluster
   - **Description**: 1-2 sentence summary

3. Add key concepts:
   - Click "Add key concept"
   - Paste name and explanation
   - Repeat for each concept

4. Add assignment:
   - Paste instructions
   - Add reading URL if available
   - Add reading title

5. Add knowledge check:
   - Click "Add question"
   - Paste question and hint
   - Repeat for each question

6. Add body content:
   - Paste the introduction/context paragraphs
   - This appears at the top of the lesson page

7. **Save** → Triggers automatic deployment

### Step 3: Batch Your Work

Don't try to perfect each lesson as you enter it. Instead:

- **First pass**: Enter all content quickly
- **Second pass**: Review and fix obvious errors
- **Ongoing**: Refine individual lessons over time

A complete curriculum with rough edges beats three perfect lessons and seventeen empty placeholders.

## Example: Generated Lesson

Here's what AI-generated content might look like for a social theory curriculum:

**Input**: "Berger & Luckmann - The Social Construction of Reality (1966)"

**Output**:

```yaml
title: The Social Construction of Reality
slug: social-construction-reality
description: "The foundational text on how societies create and maintain shared reality through ongoing interaction."

key_concepts:
  - name: "Externalization, Objectivation, Internalization"
    explanation: |
      Berger and Luckmann describe a three-step process by which human activity becomes social reality...

  - name: "Institutional Facts"
    explanation: |
      Some facts exist only because we collectively agree they do...

assignment:
  instructions: |
    Read Part I of The Social Construction of Reality, focusing on the dialectical relationship between humans and social reality...
  url: "https://archive.org/details/..."
  reading_title: "Berger, P. & Luckmann, T. (1966). The Social Construction of Reality. Anchor Books."

knowledge_check:
  - question: "How does 'objectivation' transform human activity into something that feels external and given?"
    hint: "Think about how habits become institutions."

body: |
  Published in 1966, The Social Construction of Reality became one of the most influential works in sociology...
```

This output is ready to paste into your CMS fields.

## Handling Multiple Readings

For efficiency, generate 3-5 lessons per prompt. More than that and quality drops. Structure your session:

| Time | Activity |
|------|----------|
| 10 min | Generate lessons for Cluster 1 |
| 15 min | Enter Cluster 1 into CMS |
| 10 min | Generate lessons for Cluster 2 |
| 15 min | Enter Cluster 2 into CMS |
| ... | Continue for remaining clusters |

A 5-cluster curriculum with 3 lessons each takes roughly 2-3 hours to fully populate.

## What Comes Next

Your curriculum is now live but imperfect. That's exactly right.

The next lesson covers how to refine AI-generated content over time—fixing explanations, adding your perspective, improving based on feedback. The goal was never to publish AI content directly. It was to have something real to improve.
