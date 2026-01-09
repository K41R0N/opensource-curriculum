---
title: Using the CMS
slug: using-cms
cluster: working-with-content
order: 1
description: "Add and edit content through the browser-based CMS without touching code."
blocks:
  - type: concept
    name: "Git-Based CMS"
    explanation: |
      Sveltia CMS is a "git-based" CMS, meaning every edit you make becomes a commit to your GitHub repository. This gives you:

      - **Version history**: Every change is tracked and reversible
      - **No database**: Content lives in files, not a server you maintain
      - **Portability**: Your content is plain Markdown, never locked in

      When you save in the CMS, it commits directly to your repo, which triggers a rebuild of your site.
  - type: concept
    name: "Content Collections"
    explanation: |
      The CMS organizes content into "collections"—groupings of similar content types:

      - **Clusters**: Your thematic groupings (maps to `content/clusters/`)
      - **Lessons**: Individual lessons within clusters (maps to `content/lessons/`)
      - **Pages**: Static pages like Home and About (maps to `content/pages/`)
      - **Settings**: Site-wide configuration (maps to `content/settings/`)

      Each collection has its own fields and validation rules.
  - type: concept
    name: "The Editorial Workflow"
    explanation: |
      The CMS provides a visual editor that handles the Markdown and YAML for you. You fill in fields, and it generates the right file format.

      The workflow is:
      1. Open the CMS at `/admin`
      2. Select a collection (Clusters, Lessons, etc.)
      3. Edit an existing item or create a new one
      4. Fill in the fields using the visual editor
      5. Click "Publish" to commit changes
      6. Wait 1-2 minutes for the site to rebuild
  - type: check
    question: "What happens when you click 'Publish' in the CMS?"
    hint: "Think about what git-based means."
  - type: check
    question: "Where can you see the history of all changes made through the CMS?"
    hint: "Consider where the content actually lives."
---

## Accessing the CMS

Once you've completed the OAuth setup (covered in the Deployment cluster), you can access the CMS at:

```text
https://your-site.netlify.app/admin/
```

You'll be prompted to log in with GitHub. After authenticating, you'll see the CMS dashboard.

## The CMS Interface

The interface has three main areas:

1. **Sidebar**: Lists your content collections (Clusters, Lessons, Pages, Settings)
2. **Content List**: Shows all items in the selected collection
3. **Editor**: The form where you edit content

## Creating a New Lesson

Let's walk through creating a new lesson:

### Step 1: Select the Lessons Collection

Click "Lessons" in the sidebar. You'll see a list of all existing lessons.

### Step 2: Click "New Lesson"

This opens a blank editor with fields for:

- **Title**: The lesson name
- **Slug**: URL identifier (auto-generated from title, but editable)
- **Cluster**: Dropdown to select which cluster this belongs to
- **Order**: Position within the cluster
- **Description**: Brief summary for previews
- And more fields for objectives, concepts, assignments, etc.

### Step 3: Fill In Required Fields

At minimum, every lesson needs:

| Field | Example |
|-------|---------|
| Title | "Understanding Markdown" |
| Slug | `understanding-markdown` |
| Cluster | Select from dropdown |
| Order | `3` (unique within the cluster) |
| Description | "Learn the basics of Markdown formatting." |

### Step 4: Add Content

The main body editor supports Markdown with a visual preview. You can:

- Use the toolbar for formatting (bold, italic, links)
- Switch between "Rich Text" and "Markdown" modes
- Preview how it will look on the site

### Step 5: Publish

Click the "Publish" button. The CMS will:

1. Create a commit with your new lesson
2. Push it to your GitHub repository
3. Trigger a Netlify rebuild

Your new lesson will be live in 1-2 minutes.

## Editing Existing Content

To edit existing content:

1. Click on any item in the content list
2. Make your changes in the editor
3. Click "Publish" to save

Each edit creates a new commit, so you can always see (and revert) the history in GitHub.

## Creating Clusters

Creating a cluster follows the same pattern:

1. Select "Clusters" in the sidebar
2. Click "New Cluster"
3. Fill in Title, Slug, Order, Description
4. Add optional body text
5. Publish

**Important**: Create the cluster *before* creating lessons that belong to it. The Lesson editor's Cluster dropdown only shows existing clusters.

## Tips for Effective CMS Use

### Use Descriptive Slugs

Slugs become URLs. Instead of auto-generated slugs like `lesson-1`, use meaningful ones like `introduction-to-rhetoric`.

### Keep Order Numbers Sequential

Within each cluster, use sequential order numbers (1, 2, 3...). Gaps are fine, but avoid duplicates—the build will fail.

### Preview Before Publishing

The CMS shows a preview, but you can also:

1. Publish to a draft branch (if configured)
2. Check the Netlify deploy preview
3. Review on your live site after publishing

### Use the Rich Text Editor for Complex Formatting

For lists, links, and basic formatting, the Rich Text mode is easier. Switch to Markdown mode when you need:

- Code blocks
- Complex nested structures
- Direct control over formatting

## What If Something Goes Wrong?

### Build Fails After Publishing

Check Netlify's deploy logs. Common causes:

- Duplicate order numbers
- Missing required fields
- Cluster reference that doesn't exist

### Need to Revert a Change?

Every CMS edit is a git commit. In GitHub:

1. Go to your repository
2. Click "Commits"
3. Find the commit to revert
4. Use "Revert" to undo it

### CMS Won't Load?

- Check that OAuth is properly configured
- Try logging out and back in
- Clear browser cache

## Next Steps

The CMS is great for quick edits and creating new content. For longer writing sessions or working offline, you might prefer local editing with Obsidian—covered in the next lesson.
