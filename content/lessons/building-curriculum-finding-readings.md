---
title: Finding Foundational Readings
slug: finding-readings
cluster: building-curriculum
order: 2
description: "Use AI prompts to discover the canonical texts and influential works in your domain."
objectives:
  - Learn to identify truly foundational vs. merely popular texts
  - Use the Reading Discovery Prompt to generate reading lists
  - Evaluate and prioritize AI-suggested readings
key_concepts:
  - name: "Foundational vs. Popular"
    explanation: |
      Not all well-known texts are foundational. A foundational text is one that:

      - Introduced key concepts still used today
      - Is frequently cited by later work in the field
      - Represents a major intellectual contribution
      - Rewards careful, close reading

      Popular texts might summarize ideas well but don't necessarily reward the same depth of engagement.
  - name: "Primary vs. Secondary Sources"
    explanation: |
      Primary sources are the original works—the texts that introduced ideas. Secondary sources explain, interpret, or build on primary sources.

      A good curriculum emphasizes primary sources. You want learners engaging with Berger & Luckmann's original arguments, not just summaries of them.

      Secondary sources can be valuable as additional resources, but shouldn't be the main readings.
  - name: "The Citation Network"
    explanation: |
      Academic texts form a citation network—each work builds on previous work and influences future work. Foundational texts sit at the nodes of this network.

      When evaluating potential readings, ask: "Is this text cited by the other texts in my curriculum?" Texts that appear repeatedly in citations are likely foundational.
assignment:
  instructions: |
    Use the Reading Discovery Prompt with your AI assistant to generate an initial reading list for your domain.

    **Important**: After generating the list, verify each text actually exists. AI can hallucinate plausible-sounding but non-existent books. Cross-check with Google Scholar, WorldCat, or library catalogs.
  url: /prompts/02-reading-discovery.md
  reading_title: "Reading Discovery Prompt"
knowledge_check:
  - question: "How do you distinguish a foundational text from a popular one?"
    hint: "Think about the text's influence on the field, not just its sales."
  - question: "Why verify AI-suggested readings?"
    hint: "Consider the known limitations of language models."
additional_resources:
  - title: "Google Scholar"
    url: "https://scholar.google.com"
    description: "Use citation counts and 'Cited by' links to identify influential works."
  - title: "Internet Archive"
    url: "https://archive.org"
    description: "Many foundational texts are available for free borrowing."
---

## Finding the Right Readings

The quality of your curriculum depends on the quality of your readings. Surface-level content produces surface-level learning. Foundational texts—the ones that shaped how people think about a domain—produce genuine understanding.

## The Reading Discovery Prompt

Here's the prompt for discovering foundational readings. It's also available at `/prompts/02-reading-discovery.md`:

```markdown
I'm building a self-directed research curriculum on [YOUR DOMAIN].

The central question is: [YOUR CENTRAL QUESTION FROM LESSON 1]

The scope includes: [YOUR SCOPE DEFINITION]

Please suggest foundational readings for this curriculum. For each reading, provide:

1. **Full citation** (author, title, year, publisher if book)
2. **Why it's foundational** (what key ideas it introduces)
3. **What cluster/theme** it might belong to
4. **Prerequisites** (what should be read first, if any)
5. **Difficulty level** (accessible, moderate, challenging)

Prioritize:
- Primary sources over secondary sources
- Texts that introduced key concepts
- Works that are frequently cited in the field
- Readings that reward close engagement

Suggest 15-25 readings organized by theme.

IMPORTANT: Only suggest texts you're confident actually exist. I will verify all citations.
```

## Evaluating the Results

When you get the AI's suggestions:

1. **Verify existence**: Search for each text on Google Scholar or WorldCat. AI can invent plausible-sounding titles.

2. **Check accessibility**: Can you actually get the text? Look for:
   - Internet Archive (free borrowing)
   - Library access
   - Open access versions
   - Legal PDFs

3. **Assess centrality**: How often is this text cited by the other suggested texts? Highly-cited texts are more central.

4. **Consider diversity**: Does the list represent multiple perspectives? Different time periods? Varied methodological approaches?

5. **Trust your judgment**: If you know the field, you'll recognize gaps or questionable inclusions. The AI is a starting point.

## Organizing by Theme

As you evaluate readings, patterns will emerge. You might notice:

- Several texts address the same fundamental concept
- Some texts naturally precede others
- Distinct "schools of thought" become visible

These patterns suggest your cluster structure. Group related readings, and you'll start to see your curriculum take shape.

## Example: Organizing Device Theory Readings

When developing the DEVICES curriculum, readings naturally grouped into:

| Cluster | Theme | Key Texts |
|---------|-------|-----------|
| Foundations | How reality is socially constructed | Berger & Luckmann, Searle |
| Embodiment | How practices become habit | Bourdieu, Mauss, Connerton |
| Technology | How tools shape thought | McLuhan, Postman, Heidegger |
| Ritual | How ceremonies create meaning | Durkheim, Bell, Turner |

This structure emerged from the readings themselves, not from an abstract plan.

## Quality Over Quantity

Resist the temptation to include too many readings. Each lesson should center on one primary reading that rewards careful engagement. A curriculum of 15-25 deep readings produces better learning than 50 skimmed articles.

Ask: "Is this text essential enough that someone couldn't claim expertise without having read it?"

If the answer is "no," consider cutting it or moving it to additional resources.
