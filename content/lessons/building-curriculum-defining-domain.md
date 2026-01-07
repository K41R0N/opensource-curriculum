---
title: Defining Your Domain
slug: defining-domain
cluster: building-curriculum
order: 1
description: "Use AI prompts to articulate your curriculum's scope, central questions, and boundaries."
objectives:
  - Learn to articulate your domain clearly and precisely
  - Understand how to identify the boundaries of your curriculum
  - Use the Domain Definition Prompt to generate your curriculum framework
key_concepts:
  - name: "The Central Question"
    explanation: |
      Every good curriculum answers a central question. Not "What topics does this cover?" but "What will someone who completes this be able to understand or do?"

      Examples:
      - "How do social movements create lasting change?"
      - "What makes distributed systems reliable?"
      - "How has colonialism shaped modern economics?"

      Your central question defines what's in scope and what's not.
  - name: "Domain vs. Survey"
    explanation: |
      A domain curriculum goes deep on a specific area. A survey curriculum covers many areas shallowly. This platform is designed for domain curricula.

      Signs you're building a domain curriculum:
      - You can name the foundational texts
      - There's a clear intellectual tradition
      - Mastery requires reading primary sources
      - The field has depth, not just breadth
  - name: "Intellectual Traditions"
    explanation: |
      Most domains exist within intellectual traditions—networks of thinkers who built on each other's work. Your curriculum should identify which tradition(s) you're drawing from.

      For example, a curriculum on "design thinking" might draw from cognitive psychology, industrial design, and business strategy. Naming these traditions helps learners understand where the ideas come from.
assignment:
  instructions: |
    Use the Domain Definition Prompt (below) with your preferred AI assistant (Claude, GPT-4, etc.) to generate an initial framework for your curriculum.

    **Prompt Instructions:**
    1. Copy the prompt from the `prompts/01-domain-definition.md` file
    2. Fill in the bracketed sections with your domain
    3. Review the AI's output critically—it's a starting point, not final
    4. Iterate by asking follow-up questions
  url: /prompts/01-domain-definition.md
  reading_title: "Domain Definition Prompt"
knowledge_check:
  - question: "What's your curriculum's central question?"
    hint: "Frame it as what someone will understand or be able to do after completing it."
  - question: "What intellectual traditions does your domain draw from?"
    hint: "Think about the schools of thought and key thinkers who shaped the field."
additional_resources:
  - title: "How to Define Research Questions"
    author: "Various"
    url: "https://writingcenter.gmu.edu/writing-resources/research-based-writing/how-to-write-a-research-question"
    description: "While focused on academic research, the principles apply to curriculum design."
---

## The Art of Domain Definition

The most common mistake in curriculum design is being too broad. "A curriculum on philosophy" is too broad. "A curriculum on how 20th-century analytic philosophy addressed the mind-body problem" is focused enough to be useful.

Your domain definition should answer:

1. **What is the central question?** What will learners be able to understand or do?
2. **What's the scope?** What's included? What's explicitly excluded?
3. **What traditions does it draw from?** What schools of thought and key thinkers?
4. **Who is the audience?** What do they already know? What do they want?

## Using AI to Help Define Your Domain

Large language models are excellent brainstorming partners for domain definition. They can:

- Suggest canonical texts you might have missed
- Identify adjacent fields worth considering
- Point out potential gaps in your framing
- Generate alternative ways to structure the domain

But remember: the AI is helping you think, not thinking for you. You need to:

- **Critically evaluate** every suggestion
- **Bring your own judgment** about what matters
- **Iterate** until the framing feels right
- **Make choices** the AI can't make for you

## The Domain Definition Prompt

Here's the prompt you'll use. It's also available as a standalone file at `/prompts/01-domain-definition.md`:

```markdown
I want to build a self-directed research curriculum on [YOUR DOMAIN].

Please help me define this curriculum by addressing:

1. **Central Question**: What is the core question this curriculum helps answer? Frame it as: "What will someone who completes this be able to understand or do?"

2. **Scope Definition**:
   - What specific aspects of [YOUR DOMAIN] should be included?
   - What should be explicitly excluded to maintain focus?
   - What level of depth are we aiming for?

3. **Intellectual Traditions**:
   - What schools of thought or academic disciplines inform this domain?
   - Who are the foundational thinkers?
   - What are the key debates or tensions within the field?

4. **Audience**:
   - What prior knowledge should learners have?
   - What are they likely trying to achieve?

5. **Success Criteria**: How would someone know they've "completed" this curriculum? What would they be able to do or discuss?

Please be specific and opinionated. I want a focused curriculum, not a comprehensive survey.
```

Run this prompt, then review the output carefully. Ask follow-up questions to refine the framing.

## Example: A Curriculum on "Device Theory"

Here's how domain definition worked for a curriculum on how material, conceptual, and ritual instruments shape human reality:

**Central Question**: How do devices—material, conceptual, and ritual—mediate human experience and become naturalized as "just how things are"?

**Scope**:
- Included: Social construction theory, media ecology, ritual studies, technology philosophy
- Excluded: Technical implementation, specific technologies, historical surveys

**Traditions**: Phenomenology (Heidegger), sociology of knowledge (Berger/Luckmann), media theory (McLuhan), ritual studies (Bell)

**Audience**: Researchers, designers, and thinkers interested in how technologies shape society—not technologists themselves.

This focused definition made it possible to curate 25 meaningful lessons rather than 100 superficial ones.
