---
title: Local Editing with Obsidian
slug: local-editing
cluster: working-with-content
order: 2
description: "Set up a powerful local editing environment for longer writing sessions and offline work."
objectives:
  - Understand when local editing is preferable to the CMS
  - Set up Obsidian with Git sync for your curriculum
  - Develop a comfortable writing workflow
key_concepts:
  - name: "Why Edit Locally?"
    explanation: |
      The web CMS is great for quick edits, but local editing shines for:

      - **Deep work**: No internet distractions, faster interface
      - **Longer sessions**: Better for writing substantial content
      - **Offline access**: Edit anywhere, sync when connected
      - **Power features**: Obsidian's graph view, backlinks, and plugins

      Many curriculum authors use both: CMS for quick fixes, local editing for serious writing.
  - name: "The Git Sync Model"
    explanation: |
      Local editing uses the same Git workflow as the CMS:

      1. **Pull**: Download latest changes from GitHub
      2. **Edit**: Make changes locally
      3. **Commit**: Save changes with a message
      4. **Push**: Upload to GitHub, triggering a rebuild

      The Obsidian Git plugin automates this, so you rarely touch the command line.
  - name: "Obsidian as a Curriculum IDE"
    explanation: |
      Obsidian is a Markdown editor that treats a folder of files as a "vault." For curriculum editing, this means:

      - **Graph view**: Visualize connections between lessons
      - **Quick switcher**: Jump between files instantly
      - **Live preview**: See formatted Markdown as you type
      - **Templates**: Create lesson templates for consistency

      It's like having an IDE specifically for your curriculum.
assignment:
  instructions: |
    Follow the complete Obsidian setup guide to configure your local editing environment.

    The guide covers:
    - Installing Git on Mac or Windows
    - Cloning your repository
    - Setting up Obsidian with your content folder
    - Installing and configuring the Obsidian Git plugin
    - Authenticating with GitHub

    After setup, make a test edit and push it to verify everything works.
  url: /docs/obsidian-setup.md
  reading_title: "Obsidian Setup Guide"
knowledge_check:
  - question: "When would you choose local editing over the CMS?"
    hint: "Think about session length, internet access, and feature needs."
  - question: "What does 'pull before you push' mean and why does it matter?"
    hint: "Consider what happens if someone else edited while you were working."
additional_resources:
  - title: "Obsidian Help Documentation"
    author: "Obsidian"
    url: "https://help.obsidian.md"
    description: "Official documentation for all Obsidian features."
  - title: "Obsidian Git Plugin"
    author: "Vinzent"
    url: "https://github.com/denolehov/obsidian-git"
    description: "The plugin that enables Git sync from within Obsidian."
---

## When to Use Local Editing

The CMS and local editing aren't competing—they're complementary tools for different situations.

**Use the CMS when:**
- Making a quick fix (typo, broken link)
- You're away from your main computer
- You want changes live immediately
- You're less comfortable with Git

**Use local editing when:**
- Writing a new lesson from scratch
- Doing a major revision
- Working without internet
- You want Obsidian's power features

Many authors keep both options available and switch based on the task.

## The Local Editing Workflow

Once you've completed the setup (see the assignment), your daily workflow is simple:

### Starting a Session

1. Open Obsidian
2. Run "Obsidian Git: Pull" (Cmd/Ctrl + P, type "pull")
3. Start editing

The pull step ensures you have the latest changes—important if you sometimes edit via CMS or from another device.

### While Editing

- Files auto-save in Obsidian
- Make as many changes as you want
- Use graph view to see connections
- Use quick switcher (Cmd/Ctrl + O) to jump between files

### Ending a Session

1. Run "Obsidian Git: Commit all changes"
2. Run "Obsidian Git: Push"

Or, if you've enabled auto-backup, just close Obsidian—changes sync automatically.

## Obsidian Features for Curriculum Authors

### Graph View

The graph view (View → Graph view) shows your content as a network of connected nodes. For a curriculum, this reveals:

- Which clusters have the most lessons
- How content is interconnected
- Orphaned files that might need attention

### Quick Switcher

Press Cmd/Ctrl + O to instantly jump to any file by name. This is faster than navigating folders when you're editing multiple lessons.

### Templates

Create a template for new lessons:

1. Create a `templates/` folder in your vault
2. Add a file like `lesson-template.md` with your standard frontmatter
3. Use the Templates core plugin or Templater community plugin to insert it

Example template:

```markdown
---
title: ""
slug: ""
cluster:
order:
description: ""
objectives:
  - ""
key_concepts:
  - name: ""
    explanation: |

---

## Introduction

```

### Search

Use Cmd/Ctrl + Shift + F to search across all files. Useful for:

- Finding all mentions of a concept
- Checking consistency across lessons
- Locating content to link to

## Handling Conflicts

If you edit the same file in two places (say, CMS and local), you'll get a merge conflict when you pull. Here's how to resolve it:

1. Obsidian Git will warn you about the conflict
2. Open the conflicting file
3. Look for markers like `<<<<<<<` and `>>>>>>>`
4. Edit the file to keep the content you want
5. Remove the conflict markers
6. Commit and push

To avoid conflicts:
- Always pull before starting a session
- Don't edit the same file in two places simultaneously
- Use CMS for quick edits, local for deep work (not both at once)

## Tips for Productive Local Editing

### Use Split View

Open the lesson you're writing alongside related content. Obsidian lets you split the view horizontally or vertically.

### Enable Live Preview

In Settings → Editor, enable "Live Preview" mode. You'll see formatted Markdown as you type, while still having full control over the source.

### Create a Writing Ritual

Local editing works best with dedicated time. Set aside blocks for curriculum work:

- Morning: Review and edit existing lessons
- Afternoon: Draft new content
- Weekly: Review the graph, look for gaps

### Back Up Your Work

Git is your backup, but commits only save when you push. Get in the habit of:

- Pushing at least daily
- Enabling auto-backup in Obsidian Git settings
- Occasionally verifying changes appear on GitHub

## Next Steps

Now you can edit content both through the CMS and locally. The next lesson covers the ongoing practice of iteration—how to improve your curriculum over time based on feedback and your own evolving understanding.
