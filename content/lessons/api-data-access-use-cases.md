---
title: Use Cases and Integrations
slug: use-cases
cluster: api-data-access
order: 2
description: "Practical applications for the curriculum APIs—from AI agents to custom dashboards."
objectives:
  - Understand how AI agents can consume your curriculum
  - Build awareness of automation possibilities
  - Explore ideas for custom integrations
key_concepts:
  - name: "AI Agent Integration"
    explanation: |
      AI assistants and agents can consume your curriculum directly via the JSON API. This enables scenarios like:

      - **Tutoring bots** that know your curriculum structure and can guide learners
      - **Research assistants** that reference your content when answering questions
      - **Content tools** that help you write new lessons consistent with existing material

      By pointing an AI at `/api/curriculum.json`, it instantly understands what you teach and how it's organized.
  - name: "Claude Projects & Custom GPTs"
    explanation: |
      Modern AI platforms let you create specialized assistants with custom knowledge:

      **Claude Projects**: Add your curriculum JSON as project knowledge. Claude can then answer questions about your curriculum, suggest which lesson covers a topic, or help learners navigate.

      **Custom GPTs**: Upload your curriculum data or configure the GPT to fetch from your API. Build a "curriculum guide" that knows your content deeply.

      The structured JSON format makes it easy for AI to understand relationships between clusters, lessons, and concepts.
  - name: "RSS Automation"
    explanation: |
      RSS feeds integrate with automation platforms:

      - **Zapier/Make**: Trigger workflows when new items appear in the feed
      - **IFTTT**: Post to social media, send emails, or update spreadsheets
      - **Discord/Slack**: Notify a channel when new lessons are published

      Example: When you publish a new lesson, automatically tweet about it or send a newsletter notification.
  - name: "Custom Dashboards"
    explanation: |
      The JSON API enables custom UIs:

      - **Progress trackers**: Build an app that tracks which lessons a user has completed
      - **Analytics dashboards**: Visualize your curriculum structure and growth
      - **Mobile apps**: Create a native app that fetches and displays your curriculum
      - **Embeddable widgets**: Show a lesson list on another website

      Since the API supports CORS, client-side JavaScript can fetch data directly.
  - name: "Content Syndication"
    explanation: |
      Publish your curriculum across multiple platforms:

      - **Documentation sites**: Pull lesson content into docs
      - **Learning management systems**: Import structure and metadata
      - **Partner sites**: Let others embed your curriculum

      The API acts as a single source of truth that other systems can read from.
assignment:
  instructions: |
    Choose one integration to explore:

    **Option A: AI Assistant Setup**
    1. Copy your curriculum JSON from `/api/curriculum.json`
    2. Create a new Claude Project or Custom GPT
    3. Paste the JSON as knowledge/context
    4. Test by asking "What topics does this curriculum cover?" or "Which lesson should I read to learn about X?"

    **Option B: RSS Automation**
    1. Sign up for Zapier (free tier) or Make
    2. Create a new automation with RSS as the trigger
    3. Use your `/feed.xml` URL as the feed source
    4. Configure an action (email, Slack, etc.)
    5. Test by adding a new lesson and watching the automation trigger

    **Option C: Simple Dashboard**
    1. Create an HTML file with this starter code:
    ```html
    <!DOCTYPE html>
    <html>
    <head><title>My Curriculum</title></head>
    <body>
      <h1>Curriculum Overview</h1>
      <div id="stats"></div>
      <div id="clusters"></div>
      <script>
        fetch('https://YOURSITE.netlify.app/api/curriculum.json')
          .then(r => r.json())
          .then(data => {
            document.getElementById('stats').innerHTML =
              `<p>${data.stats.totalClusters} clusters, ${data.stats.totalLessons} lessons</p>`;
            document.getElementById('clusters').innerHTML =
              data.clusters.map(c => `<h2>${c.title}</h2><ul>${c.lessons.map(l => `<li>${l.title}</li>`).join('')}</ul>`).join('');
          });
      </script>
    </body>
    </html>
    ```
    2. Replace `YOURSITE` with your actual domain
    3. Open the HTML file in a browser
knowledge_check:
  - question: "Why is structured JSON better than scraping HTML for AI integrations?"
    hint: "Think about reliability, clarity of relationships, and maintenance."
  - question: "What's a practical automation you could build with the RSS feed for your curriculum?"
    hint: "Consider how you'd want to notify your audience about new content."
additional_resources:
  - title: "Claude Projects Documentation"
    author: "Anthropic"
    url: "https://support.anthropic.com/en/articles/9517075-what-are-projects"
    description: "How to create Claude Projects with custom knowledge."
  - title: "Zapier RSS Integration"
    author: "Zapier"
    url: "https://zapier.com/apps/rss/integrations"
    description: "Connect RSS feeds to thousands of apps."
  - title: "Building with the Fetch API"
    author: "MDN"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch"
    description: "JavaScript documentation for fetching data from APIs."
---

## Why Expose Your Curriculum as Data?

A curriculum website is valuable. A curriculum that machines can read is *powerful*.

When your content is available as structured data:
- **AI agents** can learn your material and help students
- **Automation** can spread the word when you publish
- **Custom tools** can build on top of your content
- **Other systems** can integrate without manual work

The APIs are already built. This lesson shows you what to do with them.

---

## Use Case 1: AI Tutoring Assistant

### The Concept

Imagine an AI assistant that knows your curriculum deeply—not just the text, but the structure. It can:

- Recommend which lesson to read based on a question
- Explain how topics connect across clusters
- Quiz learners on key concepts
- Suggest what to study next

### How to Build It

**With Claude Projects:**

1. Go to [claude.ai](https://claude.ai) and create a new Project
2. In Project Knowledge, add a new file
3. Fetch your curriculum: `curl https://yoursite.netlify.app/api/curriculum.json > curriculum.json`
4. Upload `curriculum.json` to the project
5. Start chatting—Claude now knows your entire curriculum

**Example prompts to try:**
- "What topics does this curriculum cover?"
- "I want to learn about [topic]. Which lesson should I start with?"
- "Summarize the key concepts from the Getting Started cluster"
- "Create a quiz based on lesson 2 of cluster 1"

**With Custom GPTs:**

1. Go to ChatGPT and create a new GPT
2. In the configuration, under Knowledge, upload your curriculum JSON
3. Or configure it to fetch from your API URL
4. Set instructions like: "You are a tutor for this curriculum. Help students navigate and understand the material."

### Why This Works

The JSON structure tells the AI:
- What clusters exist and how they're ordered
- What lessons belong to each cluster
- Titles, descriptions, and slugs for linking
- The overall scope and progression

This is far better than the AI just reading your website—it understands the *structure*.

---

## Use Case 2: Social Media Automation

### The Concept

Every time you publish a new lesson, automatically:
- Tweet about it
- Post to LinkedIn
- Send a newsletter
- Notify a Discord server

### How to Build It

**With Zapier:**

1. Create a Zapier account (free tier works)
2. Create a new Zap
3. **Trigger**: Choose "RSS by Zapier" → "New Item in Feed"
4. **Feed URL**: `https://yoursite.netlify.app/feed.xml`
5. **Action**: Choose your destination (Twitter, Slack, Email, etc.)
6. **Configure**: Use the feed item's title, link, and description

**Example Zap: RSS → Twitter**
```
When: New item in RSS feed
Post to Twitter:
  "New lesson published: {{title}}
   {{link}}
   #learning #curriculum"
```

**With Make (Integromat):**

Similar flow—RSS module as trigger, social media as action. Make offers more complex branching if you want different actions for clusters vs. lessons.

**With IFTTT:**

1. Create an IFTTT applet
2. "If RSS feed has new item" → "Then post to Twitter/Slack/etc."
3. Simple but effective for basic notifications

### Pro Tips

- Filter by category to only announce lessons (not clusters)
- Add a delay so you can catch mistakes before auto-posting
- Include hashtags relevant to your curriculum topic

---

## Use Case 3: Progress Tracking App

### The Concept

Build a companion app where learners:
- See all available lessons
- Mark lessons as complete
- Track their progress through clusters
- Get suggestions for what to learn next

### How to Build It

**Simple Browser-Based Tracker:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Learning Progress</title>
  <style>
    .completed { text-decoration: line-through; opacity: 0.6; }
    .lesson { cursor: pointer; padding: 4px; }
    .lesson:hover { background: #f0f0f0; }
  </style>
</head>
<body>
  <h1>Progress Tracker</h1>
  <div id="curriculum"></div>

  <script>
    const STORAGE_KEY = 'curriculum_progress';

    // Load saved progress
    const progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    fetch('https://YOURSITE.netlify.app/api/curriculum.json')
      .then(r => r.json())
      .then(data => {
        const html = data.clusters.map(cluster => `
          <h2>${cluster.title}</h2>
          <ul>
            ${cluster.lessons.map(lesson => `
              <li class="lesson ${progress[lesson.id] ? 'completed' : ''}"
                  onclick="toggleLesson('${lesson.id}', this)">
                ${lesson.title}
              </li>
            `).join('')}
          </ul>
        `).join('');

        document.getElementById('curriculum').innerHTML = html;
        updateStats(data);
      });

    function toggleLesson(id, element) {
      progress[id] = !progress[id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      element.classList.toggle('completed');
    }
  </script>
</body>
</html>
```

This saves progress to the browser's local storage. Click a lesson to mark it complete.

**More Advanced Options:**

- Add a backend to sync progress across devices
- Build a React Native app for mobile
- Integrate with a learning management system
- Add spaced repetition for knowledge checks

---

## Use Case 4: Embedding on Other Sites

### The Concept

Display your curriculum on another website—a blog, documentation site, or partner page.

### How to Build It

**Embeddable Widget:**

```html
<!-- Add this where you want the curriculum to appear -->
<div id="curriculum-embed"></div>
<script>
  fetch('https://YOURSITE.netlify.app/api/curriculum.json')
    .then(r => r.json())
    .then(data => {
      document.getElementById('curriculum-embed').innerHTML = `
        <h3>${data.site.name}</h3>
        <p>${data.stats.totalClusters} modules, ${data.stats.totalLessons} lessons</p>
        <ul>
          ${data.clusters.map(c =>
            `<li><a href="${c.url}">${c.title}</a> (${c.lessons.length} lessons)</li>`
          ).join('')}
        </ul>
        <a href="${data.site.url}">View full curriculum →</a>
      `;
    });
</script>
```

Anyone can add this snippet to their site to display your curriculum structure with links back to your site.

---

## Use Case 5: Analytics and Visualization

### The Concept

Visualize your curriculum's structure and growth over time.

### Ideas

- **Curriculum map**: D3.js visualization showing clusters and lessons as a network
- **Growth chart**: Track how many lessons you've added over time
- **Coverage analysis**: See which topics have the most/least content
- **Complexity metrics**: Analyze lesson lengths, concept counts, etc.

### Simple Stats Dashboard

```javascript
fetch('https://YOURSITE.netlify.app/api/curriculum.json')
  .then(r => r.json())
  .then(data => {
    console.log('Curriculum Stats:');
    console.log(`Total Clusters: ${data.stats.totalClusters}`);
    console.log(`Total Lessons: ${data.stats.totalLessons}`);
    console.log(`Average lessons per cluster: ${(data.stats.totalLessons / data.stats.totalClusters).toFixed(1)}`);

    data.clusters.forEach(c => {
      console.log(`  ${c.title}: ${c.lessons.length} lessons`);
    });
  });
```

---

## Use Case 6: Content Syndication

### The Concept

Feed your curriculum into other platforms:

- **Learning Management Systems** (Moodle, Canvas): Import course structure
- **Documentation generators**: Pull content into docs
- **Email courses**: Drip lessons to subscribers
- **Podcast show notes**: Link to relevant lessons

### How It Works

Most platforms that import content accept:
- **RSS** for sequential content
- **JSON** for structured data
- **OPML** for outlines (you could generate this from the API)

The key is that your curriculum is the *source of truth*. Other systems read from it rather than duplicating content.

---

## Best Practices

### Rate Limiting

The API caches for 1 hour. If you're building a high-traffic application, cache responses on your end too.

### Error Handling

Always handle fetch errors gracefully:

```javascript
fetch(url)
  .then(r => {
    if (!r.ok) throw new Error('Failed to fetch');
    return r.json();
  })
  .catch(err => {
    console.error('Could not load curriculum:', err);
    // Show fallback UI
  });
```

### Attribution

If you build something cool with someone else's curriculum API, consider crediting them and linking back.

---

## What Will You Build?

The APIs are ready. The use cases are endless:

- A study buddy AI that knows your material
- Automatic social posting when you publish
- A mobile app for learning on the go
- A dashboard to track your curriculum's growth
- Integrations with tools your audience already uses

Start with one simple integration. Once you see how easy it is, you'll think of many more.
