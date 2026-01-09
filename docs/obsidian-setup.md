# Editing Content with Obsidian

A beginner-friendly guide to editing your curriculum content locally using Obsidian, a free markdown editor. No coding required.

---

## Why Obsidian?

[Obsidian](https://obsidian.md) is a free, powerful markdown editor that works on Mac, Windows, Linux, and mobile. Benefits:

- **Works offline** — Edit content anywhere, sync when ready
- **Beautiful editor** — Live preview, syntax highlighting, graph view
- **No login required** — Your content stays on your computer
- **Automatic backups** — With the Git plugin, changes are versioned

---

## Overview

Here's what we'll set up:

```text
Your Computer                          GitHub                         Your Website
─────────────────                      ──────                         ────────────
Obsidian                               Repository                     Netlify
  ↓ edit files                           ↑                              ↑
content/ folder  ──── Git push ────→   main branch  ──── triggers ───→  Auto-deploy
```

Once set up, your workflow becomes:
1. Open Obsidian
2. Edit content
3. Click "Push" (or let it auto-sync)
4. Site updates automatically

---

## Prerequisites

Before starting, you'll need:

- [ ] A [GitHub account](https://github.com/signup) (free)
- [ ] Your curriculum repository (forked and deployed to Netlify)
- [ ] [Obsidian](https://obsidian.md/download) installed on your computer

---

## Part 1: Install Git

Git is the version control system that syncs your changes to GitHub.

### Mac

1. Open **Terminal** (search for it in Spotlight)
2. Type `git --version` and press Enter
3. If Git isn't installed, you'll be prompted to install it
4. Follow the prompts to install

### Windows

1. Download [Git for Windows](https://git-scm.com/download/win)
2. Run the installer
3. Accept all default options (just keep clicking "Next")
4. Click "Install"

### Verify Installation

Open Terminal (Mac) or Command Prompt (Windows) and type:

```bash
git --version
```

You should see something like `git version 2.39.0`. If you see an error, restart your computer and try again.

---

## Part 2: Configure Git

Tell Git who you are (this appears in your edit history):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Use the same email as your GitHub account.

---

## Part 3: Clone Your Repository

"Cloning" downloads your curriculum files to your computer.

### Step 1: Get the Repository URL

1. Go to your curriculum repository on GitHub
2. Click the green **Code** button
3. Make sure **HTTPS** is selected
4. Click the copy button (📋)

The URL looks like: `https://github.com/yourusername/your-curriculum.git`

### Step 2: Choose a Location

Decide where to store your curriculum on your computer. We recommend:

- **Mac**: `/Users/yourname/Documents/curriculum`
- **Windows**: `C:\Users\yourname\Documents\curriculum`

### Step 3: Clone

Open Terminal (Mac) or Command Prompt (Windows):

```bash
# Navigate to your Documents folder
cd ~/Documents

# Clone the repository
git clone https://github.com/yourusername/your-curriculum.git

# Enter the folder
cd your-curriculum
```

You now have all your curriculum files on your computer!

---

## Part 4: Set Up Obsidian

### Step 1: Open as Vault

1. Open Obsidian
2. Click **Open folder as vault**
3. Navigate to `your-curriculum/content`
4. Click **Open**

> **Important**: Open the `content` folder specifically, not the whole repository. This keeps Obsidian focused on your content files.

### Step 2: Trust the Folder

Obsidian may ask if you trust this folder. Click **Trust author and enable plugins**.

### Step 3: Explore Your Content

You should now see your curriculum structure:

```text
content/
├── clusters/          ← Thematic groupings
├── lessons/           ← Individual lessons
├── pages/             ← Home and About pages
└── settings/          ← Site configuration
```

Click any `.md` file to edit it!

---

## Part 5: Install Obsidian Git Plugin

This plugin lets you sync changes without leaving Obsidian.

### Step 1: Open Settings

1. Click the gear icon (⚙️) in the bottom-left
2. Go to **Community plugins**
3. Click **Turn on community plugins** if prompted
4. Click **Browse**

### Step 2: Install the Plugin

1. Search for **"Obsidian Git"**
2. Click on **Obsidian Git** by Vinzent
3. Click **Install**
4. Click **Enable**

### Step 3: Configure the Plugin

1. Go to **Settings** → **Obsidian Git**
2. Set these options:

| Setting | Recommended Value |
|---------|-------------------|
| Auto backup interval | `10` (minutes) or `0` to disable |
| Auto pull interval | `10` (minutes) |
| Commit message | `Update content` |
| Push on backup | ✅ Enabled |

### Step 4: Set Up Authentication

The first time you push, Git needs to verify it's you.

### Option A: Personal Access Token (Recommended)

1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Give it a name like "Obsidian Curriculum"
4. Select scopes: `repo` (full control of repositories)
5. Click **Generate token**
6. **Copy the token immediately** (you won't see it again!)

When Git asks for your password, paste this token instead.

### Option B: GitHub Desktop

If you prefer a visual interface:

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. It handles authentication automatically

---

## Part 6: Your First Edit

Let's make a test edit to verify everything works.

### Step 1: Edit a File

1. In Obsidian, open `pages/about.md`
2. Make a small change (add a word, fix a typo)
3. The file auto-saves

### Step 2: Commit and Push

**Using Obsidian Git Plugin:**

1. Open the command palette: `Cmd+P` (Mac) or `Ctrl+P` (Windows)
2. Type "Git" to see available commands
3. Select **Obsidian Git: Commit all changes**
4. Select **Obsidian Git: Push**

Or use the sidebar icons if you enabled them in plugin settings.

**Using Terminal (alternative):**

```bash
cd ~/Documents/your-curriculum
git add .
git commit -m "Update about page"
git push
```

### Step 3: Verify

1. Go to your GitHub repository
2. You should see your commit with the message "Update about page"
3. Netlify will automatically rebuild your site (takes ~1-2 minutes)
4. Check your live site to see the change!

---

## Daily Workflow

Once set up, your daily workflow is simple:

### Start of Session

1. Open Obsidian
2. Run **Obsidian Git: Pull** to get any changes (if you edit from multiple devices)

### While Editing

- Just edit! Files auto-save
- If auto-backup is on, changes sync automatically every 10 minutes

### End of Session

1. Run **Obsidian Git: Commit all changes**
2. Run **Obsidian Git: Push**

Or just close Obsidian if auto-backup handles it.

---

## Understanding the Content Files

### Clusters

Files in `clusters/` define your thematic groupings:

```yaml
---
title: "Getting Started"
slug: getting-started
order: 1
description: "Introduction to the curriculum"
---

Optional overview text here...
```

### Lessons

Files in `lessons/` are your actual content:

```yaml
---
title: "Lesson Title"
slug: lesson-slug
cluster: getting-started    ← Must match a cluster's slug
order: 1
description: "What this lesson covers"
author: "Author Name"
objectives:
  - "First learning objective"
  - "Second learning objective"
---

Your lesson introduction here...
```

### Key Rules

- **slug** must be lowercase with hyphens only (e.g., `my-lesson`)
- **cluster** must exactly match an existing cluster's slug
- **order** must be unique within each cluster
- Don't delete required fields (title, slug, order, description)

---

## Troubleshooting

### "Authentication failed"

Your GitHub credentials need updating:

1. Generate a new [Personal Access Token](https://github.com/settings/tokens)
2. When prompted for password, use the token instead

**Mac**: You may need to update Keychain Access
**Windows**: You may need to update Credential Manager

### "Merge conflict"

This happens if you edited the same file in two places:

1. Open Terminal in your repository folder
2. Run `git pull`
3. Open the conflicting file
4. Look for `<<<<<<<` markers and choose which version to keep
5. Remove the conflict markers
6. Commit and push again

### "Push rejected"

Someone else (or you from another device) pushed changes:

1. Run **Obsidian Git: Pull** first
2. Then **Obsidian Git: Push**

### Build Failed on Netlify

Your content has an error. Check:

1. All required fields are present
2. `cluster` references exist
3. No YAML syntax errors (watch for colons in titles)

Run `npm run validate` locally to see detailed errors.

---

## Tips for Better Editing

### Use Templates

Create a template for new lessons:

1. Create `templates/` folder in your vault
2. Add `lesson-template.md` with your standard frontmatter
3. Use **Templater** or **Templates** plugin to insert it

### Preview Your Content

- Use Obsidian's **Reading view** to see rendered markdown
- Use **Live Preview** mode for real-time rendering

### Organize with Tags

Add tags to your frontmatter for organization:

```yaml
tags:
  - draft
  - needs-review
```

### Use the Graph View

Obsidian's graph view shows relationships between your content. Enable it via **View → Graph view**.

---

## Getting Help

- **Obsidian Help**: [help.obsidian.md](https://help.obsidian.md)
- **Obsidian Git Plugin**: [GitHub](https://github.com/denolehov/obsidian-git)
- **Git Basics**: [GitHub's Git Guide](https://docs.github.com/en/get-started/using-git)

---

## Quick Reference

### Obsidian Git Commands

| Command | What it does |
|---------|--------------|
| Commit all changes | Save your edits with a message |
| Push | Upload commits to GitHub |
| Pull | Download changes from GitHub |
| Open Git control view | See changed files |

### Keyboard Shortcuts

| Action | Mac | Windows |
|--------|-----|---------|
| Command palette | `Cmd+P` | `Ctrl+P` |
| Quick switcher | `Cmd+O` | `Ctrl+O` |
| Search | `Cmd+Shift+F` | `Ctrl+Shift+F` |

### Content Locations

| Content Type | Folder | Example File |
|--------------|--------|--------------|
| Clusters | `clusters/` | `getting-started.md` |
| Lessons | `lessons/` | `getting-started-introduction.md` |
| Pages | `pages/` | `about.md` |
| Settings | `settings/` | `site.json` |
