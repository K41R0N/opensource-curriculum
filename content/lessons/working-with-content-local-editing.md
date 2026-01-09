---
title: Local Editing with Obsidian
slug: local-editing
cluster: working-with-content
order: 2
description: "Set up a powerful local editing environment for longer writing sessions and offline work."
key_concepts:
  - name: "Why Edit Locally?"
    explanation: |
      The web CMS is great for quick edits, but local editing shines for:

      - **Deep work**: No internet distractions, faster interface
      - **Longer sessions**: Better for writing substantial content
      - **Offline access**: Edit anywhere, sync when connected
      - **Power features**: Obsidian's graph view, backlinks, and plugins

      Many curriculum authors use both: CMS for quick fixes, local editing for serious writing.
  - name: "What is Git?"
    explanation: |
      Git is version control software that tracks changes to files. Think of it like "Track Changes" in Word, but for your entire project.

      **Key terms:**
      - **Repository (repo)**: Your project folder, tracked by Git
      - **Clone**: Download a copy of a repository to your computer
      - **Commit**: Save a snapshot of your changes with a description
      - **Push**: Upload your commits to GitHub
      - **Pull**: Download changes from GitHub to your computer

      You don't need to master Git—the Obsidian Git plugin handles most of this automatically.
  - name: "Obsidian as a Curriculum Editor"
    explanation: |
      Obsidian is a free Markdown editor that treats a folder of files as a "vault." For curriculum editing, this means:

      - **Graph view**: Visualize connections between lessons
      - **Quick switcher**: Jump between files instantly (Cmd/Ctrl + O)
      - **Live preview**: See formatted Markdown as you type
      - **Templates**: Create lesson templates for consistency

      It's like having a specialized editor built for your curriculum.
assignment:
  instructions: |
    Complete the step-by-step setup below. Each step builds on the previous one. Allow about 30 minutes for the full setup.

    **What you'll need before starting:**
    - Your GitHub account (from earlier in this curriculum)
    - Your repository URL (find it on your GitHub repository page)
    - About 30 minutes of uninterrupted time

    The detailed reference guide is available if you get stuck or want more context.
  url: "/docs/obsidian-setup.md"
  reading_title: "Detailed Obsidian Setup Reference"
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

---

## Complete Setup Guide

This setup has 6 parts. Follow them in order—each step builds on the previous one.

**Time required**: About 30 minutes for first-time setup.

### Part 1: Install Git

Git is the tool that syncs your changes between your computer and GitHub.

#### On Mac

1. Open **Terminal** (press Cmd + Space, type "Terminal", press Enter)
2. Type this command and press Enter:
   ```bash
   git --version
   ```
3. If Git isn't installed, a popup will appear asking to install developer tools
4. Click **Install** and wait for it to complete (this may take a few minutes)
5. Run `git --version` again to confirm—you should see something like `git version 2.39.0`

#### On Windows

1. Go to [git-scm.com/download/win](https://git-scm.com/download/win)
2. The download should start automatically
3. Run the installer
4. **Important**: Accept all the default options—just keep clicking "Next"
5. Click "Install" and wait for completion
6. Open **Command Prompt** (press Windows key, type "cmd", press Enter)
7. Type `git --version` and press Enter to confirm installation

> **Troubleshooting**: If you see "command not found," restart your computer and try again. The installer sometimes needs a restart to complete.

### Part 2: Configure Git with Your Identity

Git needs to know who you are (for tracking who made each change).

Open Terminal (Mac) or Command Prompt (Windows) and run these two commands, replacing the placeholder text with your actual information:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Use the same email as your GitHub account.** This connects your local work to your GitHub identity.

### Part 3: Clone Your Repository

"Cloning" downloads your curriculum files to your computer.

#### Step 1: Get Your Repository URL

1. Go to your curriculum repository on GitHub
2. Click the green **Code** button
3. Make sure **HTTPS** is selected (not SSH)
4. Click the copy button (📋) next to the URL

The URL looks like: `https://github.com/yourusername/your-curriculum.git`

#### Step 2: Choose Where to Store It

Pick a location on your computer. We recommend your Documents folder:

- **Mac**: `/Users/yourname/Documents/`
- **Windows**: `C:\Users\yourname\Documents\`

#### Step 3: Clone

Open Terminal (Mac) or Command Prompt (Windows):

```bash
# Navigate to your Documents folder
cd ~/Documents

# Clone your repository (paste your URL)
git clone https://github.com/yourusername/your-curriculum.git
```

**Replace** `yourusername/your-curriculum` with your actual repository path.

You'll see output showing files being downloaded. When it finishes, you have a complete copy of your curriculum on your computer.

### Part 4: Set Up Obsidian

#### Step 1: Download and Install Obsidian

1. Go to [obsidian.md/download](https://obsidian.md/download)
2. Download the version for your operating system
3. Install it (drag to Applications on Mac, or run the installer on Windows)
4. Open Obsidian

#### Step 2: Open Your Content as a Vault

1. In Obsidian, click **Open folder as vault**
2. Navigate to where you cloned your repository
3. Select the **content** folder inside your repository (not the root folder)
   - Example path: `Documents/your-curriculum/content`
4. Click **Open**

> **Why the content folder?** This keeps Obsidian focused on your actual content files, not the code files you don't need to edit.

#### Step 3: Trust the Folder

Obsidian may ask if you trust this folder. Click **Trust author and enable plugins**.

You should now see your curriculum structure:
```
clusters/          ← Your thematic groupings
lessons/           ← Individual lessons
pages/             ← Home and About pages
settings/          ← Site configuration
```

### Part 5: Install the Obsidian Git Plugin

This plugin lets you sync changes without leaving Obsidian.

1. In Obsidian, click the gear icon (⚙️) in the bottom-left to open Settings
2. Go to **Community plugins** in the left sidebar
3. Click **Turn on community plugins** if prompted, then confirm
4. Click **Browse**
5. Search for **"Obsidian Git"**
6. Click on **Obsidian Git** by Vinzent
7. Click **Install**
8. Click **Enable**

#### Configure the Plugin

1. Still in Settings, scroll down to **Obsidian Git** in the left sidebar
2. Recommended settings:

| Setting | Value | Why |
|---------|-------|-----|
| Auto backup interval | `10` | Saves changes every 10 minutes |
| Auto pull interval | `10` | Checks for remote changes |
| Commit message | `Update content` | Default message for auto-commits |
| Push on backup | ✅ On | Automatically pushes when backing up |

### Part 6: Authenticate with GitHub

The first time you try to push, Git needs to verify you have permission.

#### Create a Personal Access Token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Give it a name: "Obsidian Curriculum" (or anything descriptive)
4. Under **Expiration**, choose "No expiration" (or set a reminder to renew)
5. Under **Select scopes**, check **repo** (this grants access to your repositories)
6. Click **Generate token**
7. **Copy the token immediately**—you won't be able to see it again

> **Keep this token safe!** It's like a password. Store it in a password manager or secure note.

#### Test the Connection

Let's verify everything works:

1. In Obsidian, open any file (try `pages/about.md`)
2. Make a small change (add a word, fix a typo)
3. Open the command palette: **Cmd+P** (Mac) or **Ctrl+P** (Windows)
4. Type "Git" to see available commands
5. Select **Obsidian Git: Commit all changes**
6. Select **Obsidian Git: Push**

The first time you push, you'll be prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Paste your Personal Access Token (not your GitHub password)

If successful, check your GitHub repository—you should see your commit!

---

## Your Daily Workflow

Once setup is complete, your daily workflow is simple:

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

---

## Troubleshooting Common Issues

### "Authentication failed" when pushing

**Cause**: Your GitHub credentials are missing or expired.

**Solution**:
1. Generate a new [Personal Access Token](https://github.com/settings/tokens)
2. On Mac: Open "Keychain Access" app, search for "github", delete old entries
3. On Windows: Open "Credential Manager" (search in Start menu), find GitHub entries, remove them
4. Try pushing again—you'll be prompted for new credentials

### "Repository not found" error

**Cause**: The repository URL is wrong, or you don't have access.

**Solution**:
1. Check the URL matches your actual repository
2. Make sure you forked the template (not just cloned it)
3. Verify you're logged into the correct GitHub account

### "Merge conflict" when pulling

**Cause**: You edited the same file in two places (like CMS and locally).

**Solution**:
1. Open the conflicting file in Obsidian
2. Look for lines starting with `<<<<<<<`, `=======`, and `>>>>>>>`
3. These show both versions—choose which content to keep
4. Delete the conflict markers entirely
5. Save, commit, and push

**Prevention**: Always pull before starting a session.

### Obsidian Git commands not appearing

**Cause**: Plugin isn't enabled or installed.

**Solution**:
1. Go to Settings → Community plugins
2. Make sure community plugins are turned on
3. Check that "Obsidian Git" is both installed AND enabled
4. Try restarting Obsidian

### Changes not appearing on live site

**Cause**: Changes weren't pushed, or the build failed.

**Solution**:
1. In Obsidian, run "Obsidian Git: Push" manually
2. Go to your GitHub repository and check if your commit appears
3. If the commit is there, check Netlify's deploy logs for build errors
4. Common build errors: missing required fields, duplicate order numbers

---

## Next Steps

Now you can edit content both through the CMS and locally. The next lesson covers the ongoing practice of iteration—how to improve your curriculum over time based on feedback and your own evolving understanding.
