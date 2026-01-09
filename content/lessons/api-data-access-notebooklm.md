---
title: NotebookLM Integration
slug: notebooklm
cluster: api-data-access
order: 3
description: "Use Google's NotebookLM to consume your curriculum or generate new content from source readings."
blocks:
  - type: concept
    name: "Two Integration Directions"
    explanation: |
      NotebookLM can work with your curriculum in two ways:

      | Direction | Input | Output |
      |-----------|-------|--------|
      | **Consumer** | Your curriculum data | Queries, summaries, audio overviews |
      | **Generator** | Your source readings | Insights for writing lessons |

      Both leverage the same insight: structured, well-organized content is easier for AI to work with.
  - type: concept
    name: "Consuming Your Curriculum"
    explanation: |
      Add your curriculum to NotebookLM using the JSON API (`/api/curriculum.json?content=true`) or individual lesson URLs. Once imported, you can:

      - Query across your entire curriculum for connections
      - Generate Audio Overviews (podcast-style discussions) of clusters
      - Create study guides and summaries

      The structured nature of your lessons gives NotebookLM better material to synthesize.
  - type: concept
    name: "Generating Curriculum Content"
    explanation: |
      Upload your foundational readings (PDFs, articles) to NotebookLM, then query it for:

      - Key concepts across multiple texts
      - Connections between readings
      - Draft explanations of difficult ideas
      - Reflection questions grounded in source material

      Export the insights and feed them into your lesson-writing process. NotebookLM does the close reading; you do the curation and editorial judgment.
  - type: check
    question: "Why is the JSON API with ?content=true more useful for NotebookLM than just the basic API?"
    hint: "Think about what NotebookLM needs to generate meaningful insights."
  - type: check
    question: "In the generator workflow, what role does editorial judgment play?"
    hint: "NotebookLM analyzes, but who decides what belongs in the curriculum?"
  - type: resource
    title: "NotebookLM"
    author: "Google"
    url: "https://notebooklm.google.com"
    description: "Google's AI-powered research assistant."
assignment:
  instructions: |
    Try both integration directions:

    **Direction 1: Consume Your Curriculum**

    1. Go to [notebooklm.google.com](https://notebooklm.google.com)
    2. Create a new notebook
    3. Add your curriculum as a source:
       - Paste your JSON API URL: `https://yoursite.netlify.app/api/curriculum.json?content=true`
       - Or add individual lesson URLs
    4. Try these queries:
       - "What are the main topics covered in this curriculum?"
       - "How do the clusters build on each other?"
       - "What key concepts appear across multiple lessons?"
    5. Generate an Audio Overview of one cluster

    **Direction 2: Generate Curriculum Content**

    1. Create a new notebook for a topic you want to add
    2. Upload 3-5 foundational readings (PDFs or URLs)
    3. Query NotebookLM:
       - "What are the key concepts a beginner should understand?"
       - "What connections exist between these readings?"
       - "What would make good reflection questions?"
    4. Use the responses to draft a new lesson
    5. Add it to your curriculum via the CMS
---

## Two Ways to Integrate

NotebookLM and your curriculum can work together in both directions. Your curriculum provides structured data that NotebookLM can consume. NotebookLM's analysis capabilities can help you create better curriculum content.

| Direction | Input | Output |
|-----------|-------|--------|
| **Consumer** | Your curriculum data | Queries, summaries, audio overviews |
| **Generator** | Your source readings | Insights for writing lessons |

Both leverage the same insight: structured, well-organized content is easier for AI to work with.

---

## Direction 1: NotebookLM as Curriculum Consumer

### Adding Your Curriculum

NotebookLM accepts URLs as sources. Your curriculum provides several entry points:

#### Option A: Full Curriculum JSON

```
https://yoursite.netlify.app/api/curriculum.json?content=true
```

This gives NotebookLM your entire curriculum—all clusters, lessons, objectives, key concepts, and body content in one structured file.

#### Option B: Individual Lesson URLs

Add specific lesson pages as sources. Useful when you want to focus on a particular cluster or compare specific lessons.

#### Option C: RSS Feed

```
https://yoursite.netlify.app/feed.xml
```

The RSS feed includes full lesson content via `content:encoded`. Some tools prefer RSS format.

### What You Can Do

Once your curriculum is in NotebookLM:

**Query across lessons:**
- "What prerequisites does Lesson 5 assume?"
- "Which lessons mention [specific concept]?"
- "How does the Getting Started cluster relate to the advanced material?"

**Find hidden connections:**
- "What themes appear across multiple clusters?"
- "Are there concepts that should be introduced earlier?"
- "What's missing from this curriculum?"

**Generate summaries:**
- "Summarize each cluster in one sentence"
- "What are the 10 most important concepts in this curriculum?"
- "Create a study guide for cluster 3"

### Audio Deep Dives

NotebookLM can generate podcast-style audio overviews. This is particularly useful for curricula:

1. Select a cluster's lessons as sources
2. Click "Generate Audio Overview"
3. NotebookLM creates a conversational discussion of the material

**Use cases:**
- Preview audio for learners before they start reading
- Review audio for learners who've completed a cluster
- Accessibility alternative for auditory learners
- Companion content for commutes or workouts

The structured nature of your lessons (clear objectives, defined key concepts) gives NotebookLM better material to synthesize.

---

## Direction 2: NotebookLM as Curriculum Generator

This is where things get interesting. Instead of consuming your finished curriculum, NotebookLM can help you *create* it.

### The Problem NotebookLM Solves

Writing good curriculum requires deep engagement with source material:
- Reading multiple texts
- Identifying what's essential vs. supplementary
- Finding connections across readings
- Translating expert language into accessible explanations

This is time-consuming. NotebookLM can handle the analysis while you focus on curation and judgment.

### The Workflow

```
┌─────────────────┐
│ Upload Sources  │  PDFs, articles, book chapters
└────────┬────────┘
         ▼
┌─────────────────┐
│ Query Insights  │  Key concepts, connections, questions
└────────┬────────┘
         ▼
┌─────────────────┐
│ Export Findings │  Copy useful responses
└────────┬────────┘
         ▼
┌─────────────────┐
│ Feed to Prompts │  Use as input for lesson structure
└────────┬────────┘
         ▼
┌─────────────────┐
│ Generate Lesson │  Write with richer grounding
└────────┬────────┘
         ▼
┌─────────────────┐
│ Publish via CMS │  Add to curriculum
└─────────────────┘
```

### Step 1: Upload Your Sources

Create a NotebookLM notebook for each cluster or topic area. Add:

- The primary readings you want to assign
- Supplementary texts that provide context
- Papers or articles that informed your thinking

NotebookLM handles PDFs, Google Docs, web pages, and pasted text.

### Step 2: Query for Curriculum Insights

Ask questions that help you structure lessons:

**For identifying key concepts:**
```
"What are the 5-7 most important concepts a beginner
should understand from these readings?"
```

**For finding connections:**
```
"What themes or ideas appear across multiple sources?
How do they relate to each other?"
```

**For drafting explanations:**
```
"Explain [concept] in accessible language for someone
new to this field. Use concrete examples."
```

**For generating questions:**
```
"What reflection questions would help someone deeply
engage with these readings?"
```

**For structuring progression:**
```
"If teaching this material, what order would you
introduce these concepts? What builds on what?"
```

### Step 3: Export and Refine

NotebookLM's responses become raw material for your lessons. Copy the useful parts:

- Key concepts become your lesson's `key_concepts` section
- Explanations become starting points for your lesson body
- Questions become `knowledge_check` items
- Structure suggestions inform your cluster organization

### Step 4: Apply Editorial Judgment

NotebookLM analyzes. You curate.

**You decide:**
- Which concepts are truly essential vs. nice-to-know
- What order makes sense for *your* audience
- What tone and level of detail fits your curriculum
- Which connections are meaningful vs. superficial

NotebookLM gives you a head start. It doesn't replace your expertise and judgment about what belongs in the curriculum.

### Step 5: Generate and Publish

Take NotebookLM's insights and feed them into your lesson creation process:

1. Use the structure suggestions to plan your lesson
2. Expand the explanations in your own voice
3. Format for your CMS (frontmatter, markdown body)
4. Add via the admin interface or directly to the content files

---

## Example: Creating a New Lesson

Let's say you're adding a lesson on "Systems Thinking" to a philosophy curriculum.

**In NotebookLM:**

Upload:
- Donella Meadows' "Thinking in Systems" (excerpts)
- A paper on feedback loops
- An article on emergence

Query:
```
"What key concepts from systems thinking would be most
valuable for philosophy students? Focus on concepts that
connect to philosophical questions about causation,
reductionism, and emergence."
```

NotebookLM responds with concepts like feedback loops, stocks and flows, emergence, leverage points—with explanations grounded in your sources.

**In your CMS:**

Create a new lesson with:
- `key_concepts` based on NotebookLM's analysis
- `objectives` refined from what NotebookLM identified as important
- Body content expanding on the explanations, in your voice
- `additional_resources` pointing to the original sources

The lesson is grounded in actual readings, not generated from scratch.

---

## Combining Both Directions

The most powerful workflow combines consumption and generation:

1. **Generate** new lessons using NotebookLM + source readings
2. **Publish** to your curriculum via CMS
3. **Consume** your updated curriculum in a new NotebookLM notebook
4. **Query** for gaps, connections, and improvements
5. **Iterate** based on insights

Your curriculum becomes a living system—NotebookLM helps you both build it and understand it.

---

## Limitations to Know

**NotebookLM as consumer:**
- Source limits (currently ~50 sources per notebook)
- May not handle very large JSON files well
- Audio generation quality varies with source clarity

**NotebookLM as generator:**
- Outputs need human review and editing
- Can miss nuance that close reading would catch
- Doesn't know your specific audience

**General:**
- Requires Google account
- Sources are stored with Google
- Features change as the product evolves

The integration is powerful but not magic. Use it to augment your process, not replace your judgment.
