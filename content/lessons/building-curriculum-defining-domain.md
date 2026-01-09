---
title: Defining Your Domain
slug: defining-domain
cluster: building-curriculum
author: ''
order: 1
description: Use AI prompts to articulate your curriculum's scope, central questions, and boundaries.
key_concepts:
  - name: The Central Question
    explanation: |-
      Every good curriculum answers a central question. Not "What topics does this cover?" but "What will someone who completes this be able to understand or do?"

      Examples:
      - "How do social movements create lasting change?"
      - "What makes distributed systems reliable?"

      Your central question defines what's in scope and what's not.
  - name: AI as Brainstorming Partner
    explanation: |-
      LLMs are excellent for domain definition. They can suggest canonical texts, identify adjacent fields, point out gaps in your framing, and generate alternative structures.

      But remember: the AI is helping you think, not thinking for you. You need to critically evaluate every suggestion and bring your own judgment about what matters.
assignment:
  instructions: |-
    Use the Domain Definition Prompt (below) with your preferred AI assistant (Claude, GPT-4, etc.) to generate an initial framework for your curriculum.

    **Prompt Instructions:**

    1. Copy the prompt from the `prompts/01-domain-definition.md` file
    2. Fill in the bracketed sections with your domain
    3. Review the AI's output critically—it's a starting point, not final
    4. Iterate by asking follow-up questions
  url: /prompts/01-domain-definition.md
  reading_title: Domain Definition Prompt
knowledge_check:
  - question: What's your curriculum's central question?
    hint: Frame it as what someone will understand or be able to do after completing it.
  - question: What intellectual traditions does your domain draw from?
    hint: Think about the schools of thought and key thinkers who shaped the field.
additional_resources:
  - title: How to Define Research Questions
    author: Various
    url: https://writingcenter.gmu.edu/writing-resources/research-based-writing/how-to-write-a-research-question
    description: While focused on academic research, the principles apply to curriculum design.
---
## The Art of Domain Definition

**_Prefer working without AI?_** See the [Building Manually](/curriculum/building-manually) cluster for a hands-on approach.

The most common mistake in curriculum design is being too broad. "A curriculum on philosophy" is too broad. "A curriculum on how 20th-century analytic philosophy addressed the mind-body problem" is focused enough to be useful.

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
