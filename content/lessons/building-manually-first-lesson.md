---
title: Creating Your First Lesson
slug: first-lesson
cluster: building-manually
order: 4
description: "Walk through creating a complete lesson from scratch—from reading to published content."
objectives:
  - Create a complete lesson with all recommended fields
  - Develop a repeatable process for future lessons
  - Publish and verify your first curriculum content
key_concepts:
  - name: "The Reading-First Approach"
    explanation: |
      Before writing anything, engage with the reading itself:

      1. **Read actively**: Take notes on key ideas
      2. **Identify concepts**: What are the 3-5 most important ideas?
      3. **Note confusion**: Where might learners struggle?
      4. **Find connections**: How does this relate to other readings?

      Your lesson content should emerge from your engagement with the text, not be written abstractly.
  - name: "Writing for Learners"
    explanation: |
      Your audience hasn't read the text yet. They need:

      - **Motivation**: Why should I read this?
      - **Context**: Where does this fit in the field?
      - **Guidance**: What should I pay attention to?
      - **Support**: Help with difficult passages

      Don't summarize the reading—set learners up to engage with it well.
  - name: "The Completeness Test"
    explanation: |
      A lesson is complete when a learner can:

      1. Understand why the reading matters (from description + body)
      2. Know what concepts to focus on (from key concepts)
      3. Access and engage with the reading (from assignment)
      4. Test their understanding (from knowledge check)
      5. Go deeper if desired (from additional resources)

      If any of these are missing, the lesson has gaps.
  - name: "Iteration Over Perfection"
    explanation: |
      Your first lesson won't be perfect. That's fine.

      - **Publish early**: A good-enough lesson beats no lesson
      - **Learn from use**: Your own experience reveals gaps
      - **Improve incrementally**: Small fixes over time
      - **Build momentum**: Completing one lesson motivates the next

      Don't let perfectionism stop you from launching.
assignment:
  instructions: |
    Create your first complete lesson:

    **Preparation (30-45 min)**
    1. Choose one reading from your list—preferably one you know well
    2. Re-read or skim to refresh your memory
    3. Note 3-5 key concepts
    4. Write down what a learner needs to know before reading

    **Writing (45-60 min)**
    1. Open the CMS: `your-site.netlify.app/admin/`
    2. Create the cluster this lesson belongs to (if not already done)
    3. Click "Lessons" → "New Lesson"
    4. Fill in each field following the process below

    **Review (15 min)**
    1. Preview the lesson on your live site
    2. Test the reading link
    3. Read through as if you're a learner
    4. Fix any obvious issues

    **Publish**
    - Save in the CMS
    - Wait 1-2 minutes for deployment
    - Verify it appears on your site

knowledge_check:
  - question: "Why engage with the reading before writing lesson content?"
    hint: "Consider where good lesson content comes from."
  - question: "What makes a lesson 'complete' enough to publish?"
    hint: "Think about what a learner needs to successfully engage with the reading."
additional_resources:
  - title: "Working With Content Cluster"
    url: "/curriculum/working-with-content"
    description: "Detailed editing workflows for ongoing content work."
---

## Your First Lesson: A Complete Walkthrough

This lesson guides you through creating one complete lesson, step by step. Use this process for every lesson you create.

## Step 1: Choose and Engage (30-45 minutes)

### Pick Your Reading

For your first lesson, choose:
- A reading you know well
- Something foundational (early in your curriculum)
- A text that clearly connects to your central question

Don't start with the hardest or most obscure reading. Build confidence first.

### Engage With the Text

Even if you've read this before, spend 20-30 minutes re-engaging:

**As you read, note:**
- What are the 3-5 most important ideas?
- What surprised you (or would surprise a newcomer)?
- Where might someone get confused?
- What vocabulary does this text establish?
- How does this connect to other readings in your curriculum?

Write these notes down. They become your lesson content.

## Step 2: Write Your Content (45-60 minutes)

Open your CMS and create the lesson. For each field:

### Title and Basics

| Field | How to Fill It |
|-------|----------------|
| **Title** | The reading's common name or your descriptive title |
| **Slug** | Lowercase, hyphenated version (e.g., `social-construction-reality`) |
| **Cluster** | Select from dropdown |
| **Order** | Position within cluster |
| **Description** | One sentence: what will learners understand after this? |

### Key Concepts

From your notes, select 3-5 concepts. For each:

**Name**: A short phrase identifying the concept
- "The Attention Economy"
- "Institutional Facts"
- "The Medium Is the Message"

**Explanation** (write 2-4 paragraphs):
1. What does this concept mean?
2. Why does it matter for understanding the reading?
3. How will you recognize it in the text?
4. (Optional) How does it connect to other concepts or readings?

Example structure:
```markdown
[Concept name] refers to [definition].

[Author] introduces this idea to explain [purpose].
In the text, you'll see this when [specific example].

This concept matters because [significance].
Understanding it helps you see [broader implication].
```

### Assignment

**Instructions**: Tell learners what to read and how to approach it.

Example:
```markdown
Read chapters 1-2 of *The Social Construction of Reality*
(approximately 60 pages, 90 minutes).

Pay particular attention to the three-step process of
externalization, objectivation, and internalization.
Mark passages where the authors give concrete examples—
these illustrate abstract concepts.

If the philosophical language feels dense, slow down.
This isn't meant to be skimmed.
```

**URL**: Link to where learners can access the reading
- Check Internet Archive first
- Verify the link works

**Reading Title**: Full citation
- "Berger, P. & Luckmann, T. (1966). *The Social Construction of Reality*. Anchor Books."

### Body Content

Write 2-4 paragraphs introducing the lesson. Structure:

**Paragraph 1: Why this matters**
```markdown
Published in 1966, *The Social Construction of Reality*
fundamentally changed how sociologists think about knowledge.
Its central insight—that "reality" is something humans
create together—underpins everything else in this curriculum.
```

**Paragraph 2: Context**
```markdown
Berger and Luckmann were responding to a problem: how do
shared beliefs become so solid they feel like facts?
Their answer draws on phenomenology (Schutz) and
sociology of knowledge (Mannheim) to explain the process.
```

**Paragraph 3: What to expect**
```markdown
The text is theoretical and sometimes dense, but the
examples are clarifying. The authors use everyday
situations—how children learn "the way things are,"
how institutions outlive their creators—to illustrate
abstract points.
```

### Knowledge Check

Write 2-4 questions. Good questions:
- Require having done the reading
- Test understanding, not recall
- Connect to curriculum themes

Example:
```markdown
Question: "How does 'objectivation' make human-created
patterns feel like external facts?"

Hint: "Think about what happens when 'this is how we
do it' becomes 'this is how it's done.'"
```

### Additional Resources

Add 2-4 links for learners who want more:
- Related readings
- Video explanations
- Background material
- Applications of the ideas

For each, write a brief description of what it adds.

## Step 3: Review and Publish (15 minutes)

### Self-Review Checklist

Before publishing, verify:

- [ ] All required fields are filled
- [ ] Reading link works
- [ ] No obvious typos in visible content
- [ ] Key concepts are actually in the reading
- [ ] Description accurately reflects the lesson

### Preview

1. Save the lesson in the CMS
2. Wait 1-2 minutes for deployment
3. Visit your site and navigate to the lesson
4. Read through the page as a learner would
5. Click the assignment link to verify access

### Publish

If everything looks acceptable, you're done. The lesson is live.

Acceptable means "good enough to learn from," not "perfect." You can improve it later.

## Step 4: Repeat

You've now created one complete lesson. The process for lesson #2 is identical:

1. Choose a reading
2. Engage with it (notes on concepts, confusions, connections)
3. Fill in CMS fields
4. Review and publish

Each lesson gets easier. By lesson #5, this will feel routine.

## Common First-Lesson Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Summarizing the reading | Removes reason to read it | Focus on setup and guidance, not summary |
| Too many key concepts | Overwhelming, dilutes focus | Stick to 3-5 most important |
| Generic body content | Doesn't motivate the reading | Be specific about why *this* text matters |
| Untested links | Learners can't access reading | Always click the link before publishing |
| Waiting for perfection | Curriculum never launches | Publish "good enough," improve later |

## After Your First Lesson

Congratulations—you have a live curriculum with real content.

Now:
1. Create the rest of your first cluster's lessons
2. Move to the second cluster
3. Continue until your curriculum is complete

Each lesson teaches you something about your own curriculum design process. Trust the iteration.
