---
title: Deploying to Netlify
slug: deploying-netlify
cluster: deployment-customization
order: 1
description: "Fork the repository, connect to Netlify, and get your curriculum online in minutes."
blocks:
  - type: concept
    name: "What is Forking?"
    explanation: |
      "Forking" creates your own copy of a template repository on GitHub. It's like photocopying a workbook—you get an identical copy that you can fill in and modify without affecting the original.

      After forking, you have:
      - Your own repository at `github.com/YOUR-USERNAME/your-curriculum`
      - Full control to edit, delete, or add content
      - No connection to other people's copies
  - type: concept
    name: "What is Netlify?"
    explanation: |
      Netlify is a free service that turns your GitHub repository into a live website. It:

      - **Watches your repository** for changes
      - **Builds your site** automatically when you push updates
      - **Hosts your site** on fast servers worldwide
      - **Provides a free URL** like `your-site.netlify.app`

      You don't need to understand servers or hosting—Netlify handles everything.
  - type: concept
    name: "The Automatic Update Flow"
    explanation: |
      Once deployed, updates are automatic:

      1. You edit content (via CMS, Obsidian, or directly on GitHub)
      2. GitHub receives the change
      3. Netlify detects it and rebuilds your site
      4. Your live site updates in 1-2 minutes

      You never have to manually "upload" or "publish" your site. It just happens.
  - type: check
    question: "Why does the curriculum use static site hosting instead of a traditional server?"
    hint: "Think about speed, security, cost, and maintenance."
  - type: check
    question: "What triggers a rebuild of your site?"
    hint: "Consider what actions push changes to your repository."
  - type: resource
    title: "Netlify Documentation"
    author: "Netlify"
    url: "https://docs.netlify.com/"
    description: "Official documentation for all Netlify features."
assignment:
  instructions: |
    Follow the step-by-step guide below to deploy your curriculum. The whole process takes about 15 minutes.

    **Before you start, you'll need:**
    - A computer with internet access
    - An email address for creating accounts
    - About 15 minutes of uninterrupted time

    No coding or technical knowledge required!
---

## Before You Begin

**This is the most important lesson in this cluster.** Complete it before moving to any other deployment lessons. You cannot set up the CMS or customize your site until your curriculum is deployed.

**Time required**: About 15 minutes

**What you'll accomplish**:
- Create accounts on GitHub and Netlify (both free)
- Get your own copy of the curriculum template
- Deploy it to a live URL you can share
- Verify everything works

---

## Step 1: Create a GitHub Account

GitHub stores your curriculum files and tracks all changes. Think of it as a smart folder in the cloud that remembers every version of every file.

**If you don't have an account:**

1. Go to [github.com/signup](https://github.com/signup)
2. Enter your email address
3. Create a password
4. Choose a username
   - This will appear in your URLs, so pick something professional
   - Example: `jsmith` gives you URLs like `github.com/jsmith/...`
5. Complete the verification puzzle
6. Choose the **Free** plan when asked (it has everything you need)

**If you already have a GitHub account:** Make sure you're logged in at [github.com](https://github.com).

---

## Step 2: Fork the Curriculum Template

"Forking" creates your own copy of the template that you can customize.

### Find the Template

Go to the curriculum template repository:

**`https://github.com/[TEMPLATE-OWNER]/[TEMPLATE-REPO]`**

> **Note**: Replace the URL above with the actual template repository URL provided to you. If you're reading this on a deployed curriculum, the template owner should have this information in their documentation.

### Create Your Fork

1. Click the **Fork** button in the top-right corner of the page
2. On the "Create a new fork" page:
   - **Owner**: Select your GitHub account
   - **Repository name**: Give it a descriptive name (e.g., `philosophy-curriculum`, `design-reading-list`, `my-curriculum`)
   - **Description**: Optional, but helpful (e.g., "My self-directed curriculum on...")
3. Leave "Copy the main branch only" checked
4. Click **Create fork**

**Wait for it to complete.** You'll be redirected to your new repository at `github.com/YOUR-USERNAME/your-repo-name`.

> **Congratulations!** You now have your own curriculum repository. Everything from here on happens in YOUR copy, not the original template.

---

## Step 3: Create a Netlify Account

Netlify will host your site and make it available on the internet.

1. Go to [app.netlify.com/signup](https://app.netlify.com/signup)
2. Click **Sign up with GitHub** (this is the easiest option)
3. Authorize Netlify to access your GitHub account when prompted
4. You'll land on the Netlify dashboard

> **Why sign up with GitHub?** It automatically links your accounts, making the next step easier. You could also sign up with email, but you'd need to link GitHub anyway.

---

## Step 4: Deploy Your Site

Now we'll connect your GitHub repository to Netlify.

### Connect Your Repository

1. On the Netlify dashboard, click **Add new site**
2. Select **Import an existing project**
3. Click **Deploy with GitHub**
4. You may be asked to authorize Netlify again—click **Authorize**
5. **Find your repository** in the list
   - If you don't see it, click "Configure the Netlify app on GitHub" and grant access to your repository
6. Click on your curriculum repository to select it

### Configure Build Settings

Netlify will show you build configuration options:

| Setting | Value | Notes |
|---------|-------|-------|
| Branch to deploy | `main` | Leave as default |
| Build command | `npm run build` | Should be pre-filled |
| Publish directory | `build` | Should be pre-filled |

**These should already be correct!** The template includes a `netlify.toml` file that configures everything.

7. Click **Deploy site**

### Wait for the Build

Netlify will now:
1. Download your repository
2. Install dependencies
3. Build your site
4. Deploy it to their servers

This takes **1-3 minutes**. You'll see a progress log. When it says "Published," your site is live!

---

## Step 5: Get Your Site URL

After deployment, Netlify assigns a random URL like `silly-einstein-a1b2c3.netlify.app`.

### Find Your URL

1. Look at the top of your Netlify site dashboard
2. You'll see your URL displayed prominently
3. Click it to visit your live site!

### Customize Your URL (Optional but Recommended)

That random URL works, but you probably want something nicer:

1. Go to **Site configuration** (or "Site settings" on older interface)
2. Click **Change site name** (or find it under "Domain management")
3. Enter your preferred name (e.g., `my-philosophy-curriculum`)
4. Click **Save**

Your site is now at `my-philosophy-curriculum.netlify.app` (or whatever you chose).

> **Tip**: Choose a name that's short, memorable, and describes your curriculum.

---

## Step 6: Set the Environment Variable

One last configuration step ensures your site works correctly:

1. In Netlify, go to **Site configuration** → **Environment variables**
2. Click **Add a variable**
3. Fill in:
   - **Key**: `PUBLIC_SITE_URL`
   - **Value**: Your full site URL (e.g., `https://my-philosophy-curriculum.netlify.app`)
4. Click **Create variable**

### Trigger a Redeploy

For the variable to take effect:

1. Go to **Deploys** in the sidebar
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete (1-2 minutes)

---

## Step 7: Verify Your Site Works

Visit your site and check that everything loads:

- [ ] Homepage displays with your site title
- [ ] "Explore the Curriculum" button works
- [ ] Curriculum page shows clusters and lessons
- [ ] At least one lesson opens and displays content
- [ ] About page loads

**If something doesn't look right**, see the Troubleshooting section below.

---

## How Updates Work

From now on, your site updates automatically whenever you change content:

| Action | What Happens |
|--------|--------------|
| Edit in CMS | CMS commits to GitHub → Netlify rebuilds → Live in 1-2 min |
| Edit with Obsidian | You push to GitHub → Netlify rebuilds → Live in 1-2 min |
| Edit on GitHub directly | Save triggers → Netlify rebuilds → Live in 1-2 min |

You never need to manually deploy again. Just edit content, and it goes live.

---

## Troubleshooting

### Build Failed

If Netlify shows "Build failed":

1. Click on the failed deploy to see the log
2. Scroll to find the error message (usually in red)
3. Common causes:
   - **Missing dependencies**: Try clicking "Retry deploy"
   - **Content validation error**: Check your content files for missing required fields
   - **Syntax error in content**: Look for malformed YAML in frontmatter

### Site Shows Old Content

1. Go to Netlify **Deploys**
2. Check if the latest deploy succeeded
3. If stuck, click **Trigger deploy** → **Clear cache and deploy site**

### Can't Find My Repository

When connecting GitHub to Netlify:

1. Click "Configure the Netlify app on GitHub"
2. Under "Repository access," select "All repositories" or specifically add yours
3. Save and return to Netlify

### Site URL Not Working

- Make sure you're using `https://` not `http://`
- Wait a few minutes—DNS can take time to propagate
- Check that the deploy completed successfully

---

## Custom Domain (Optional)

Want to use your own domain like `curriculum.yoursite.com`?

1. Go to **Site configuration** → **Domain management**
2. Click **Add a domain**
3. Enter your domain name
4. Follow Netlify's instructions to update your DNS settings
5. Wait for DNS propagation (can take up to 48 hours, usually much faster)
6. Netlify automatically handles SSL certificates

The free `.netlify.app` domain works perfectly well if you don't have a custom domain.

---

## What's Next?

Your site is deployed! In the next lesson, you'll set up the CMS so you can edit content through a friendly web interface instead of editing files directly.
