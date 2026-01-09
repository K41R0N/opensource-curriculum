---
title: Structuring Into Clusters and Lessons
slug: structuring-content
cluster: building-curriculum
order: 3
description: "Transform your reading list into a coherent curriculum structure with logical progression."
key_concepts:
  - name: "Cluster Design"
    explanation: |
      A cluster is a thematic grouping of 2-5 lessons that share a common focus. Good clusters have:

      - **Clear theme**: What unifies these lessons?
      - **Internal progression**: Do lessons build on each other?
      - **Self-contained value**: Could someone read just this cluster and learn something complete?

      Think of clusters as chapters in a book—each tells part of the story, but together they form a coherent whole.
  - name: "Lesson Structure"
    explanation: |
      Each lesson follows a consistent structure:

      - **Introduction**: Why this reading matters (context)
      - **Key Concepts**: 3-5 ideas to focus on
      - **Assignment**: The primary reading with access link
      - **Knowledge Check**: Reflection questions
      - **Additional Resources**: Further exploration

      This structure ensures every lesson is actionable and complete.
  - name: "Progressive Complexity"
    explanation: |
      Sequence lessons so complexity increases gradually:

      1. **Foundations first**: Start with accessible, broad-reaching texts
      2. **Build vocabulary**: Early lessons establish key terms
      3. **Increase specificity**: Later lessons go deeper
      4. **Connect threads**: Final lessons synthesize earlier concepts

      Learners should never feel thrown into the deep end without preparation.
assignment:
  instructions: |
    Use the Curriculum Structure Prompt to transform your reading list into a complete curriculum structure.

    This is where you make key decisions about organization. Take your time—the structure you choose shapes the learning experience.
  url: /prompts/03-curriculum-structure.md
  reading_title: "Curriculum Structure Prompt"
knowledge_check:
  - question: "What makes a good cluster theme?"
    hint: "Think about what unifies the lessons and what a learner gains from completing them."
  - question: "Why does lesson sequence matter?"
    hint: "Consider how concepts build on each other and how vocabulary gets established."
additional_resources:
  - title: "Backward Design in Education"
    author: "Grant Wiggins & Jay McTighe"
    url: "https://www.ascd.org/books/understanding-by-design-expanded-2nd-edition"
    description: "The classic framework for curriculum design—start with outcomes, work backward."
---

## From Readings to Structure

You have your domain definition and a list of foundational readings. Now comes the creative work: transforming that list into a curriculum learners can actually follow.

## The Curriculum Structure Prompt

Use this prompt to generate your curriculum structure. It's also at `/prompts/03-curriculum-structure.md`:

```markdown
I have a reading list for my curriculum on [YOUR DOMAIN].

Here are the readings I've selected:
[PASTE YOUR READING LIST FROM LESSON 2]

Please help me structure these into a curriculum by:

1. **Grouping into clusters**: Identify 3-7 thematic groupings. For each cluster, provide:
   - Title
   - Description (1-2 sentences)
   - Which readings belong to it
   - Suggested order of readings within the cluster

2. **Sequencing clusters**: What order should clusters appear in? Why?

3. **Identifying dependencies**: Which readings require prior readings? Are there any prerequisite relationships?

4. **Suggesting additions or cuts**: Based on the structure, are there:
   - Gaps that need filling?
   - Redundancies that could be cut?
   - Readings that don't fit?

5. **For each reading, draft**:
   - Description (1-2 sentences on why it matters)
   - 3-5 key concepts to focus on
   - 2-3 knowledge check questions

Make the curriculum progressively complex: foundations first, specialized applications later.
```

## Cluster Design Principles

As you review the AI's suggested structure:

### Unity
Each cluster should have a clear, articulable theme. If you can't explain what unifies the lessons in a sentence, the cluster needs rework.

### Progression
Lessons within a cluster should build on each other. The first lesson establishes concepts; later lessons deepen them.

### Independence
While clusters build on each other, each should deliver standalone value. Someone reading just one cluster should learn something complete.

### Size
Aim for 2-5 lessons per cluster. Fewer than 2 suggests the theme isn't substantial enough. More than 5 suggests it should be split.

## Lesson Structure Deep Dive

Each lesson needs:

### Introduction (body field)
Context for why this reading matters. Connect it to the curriculum's central question. Explain what the reader will gain.

### Key Concepts (key_concepts field)
3-5 ideas the reader should focus on. These aren't summaries—they're signposts that help readers know what to pay attention to.

### Assignment (assignment field)
The primary reading with:
- Clear instructions
- Link to access the text
- Expected time investment (if known)

### Knowledge Check (knowledge_check field)
2-4 reflection questions. Good questions:
- Can't be answered without doing the reading
- Encourage synthesis, not recall
- Connect to broader curriculum themes

### Additional Resources (additional_resources field)
Optional further reading for those who want to go deeper. Not required for completion.

## Example: Structuring a Cluster

Here's how the "Reality Construction" cluster was structured:

**Cluster**: Reality Construction & Media Devices
**Theme**: How media shapes our perception of what's real

| Order | Reading | Why This Sequence |
|-------|---------|-------------------|
| 1 | Berger & Luckmann | Establishes basic framework of social construction |
| 2 | Searle | Adds institutional facts and collective intentionality |
| 3 | Lippmann | Applies construction theory to media/public opinion |

Each reading builds on vocabulary and concepts from the previous one. By the end, learners can analyze how media constructs social reality—a synthesis of all three texts.

## Final Review

Before finalizing your structure:

1. **Read it as a learner**: Does the progression make sense?
2. **Check prerequisites**: Can every lesson be understood with what came before?
3. **Verify access**: Can learners actually get each reading?
4. **Test the time**: Is the overall scope achievable?

Now you're ready to create your content files and deploy.
