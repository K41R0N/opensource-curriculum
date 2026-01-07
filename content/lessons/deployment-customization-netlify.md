---
title: Deploying to Netlify
slug: deploying-netlify
cluster: deployment-customization
order: 1
description: "Fork the repository, connect to Netlify, and get your curriculum online in minutes."
objectives:
  - Fork the curriculum template to your GitHub account
  - Connect your repository to Netlify for automatic deployment
  - Configure basic site settings
key_concepts:
  - name: "Fork and Deploy"
    explanation: |
      Deployment is a three-step process:

      1. **Fork**: Copy the template repository to your GitHub account
      2. **Connect**: Link your fork to Netlify
      3. **Configure**: Set your site URL and basic settings

      Every time you push changes to your repository (or save in the CMS), Netlify automatically rebuilds and deploys your site.
  - name: "Static Site Hosting"
    explanation: |
      Your curriculum is a static site—all pages are pre-built at deploy time. This means:

      - **Fast**: No server processing on each visit
      - **Secure**: No database to hack
      - **Cheap**: Netlify's free tier handles most curricula
      - **Reliable**: CDN-distributed worldwide

      The tradeoff is that content updates require a rebuild (typically 1-2 minutes).
  - name: "Environment Variables"
    explanation: |
      Some settings are configured as environment variables in Netlify rather than in files:

      - `PUBLIC_SITE_URL`: Your curriculum's canonical URL

      These are set in Netlify's dashboard under Site settings → Environment variables.
assignment:
  instructions: |
    Follow these steps to deploy your curriculum:

    **Step 1: Fork the Repository**
    1. Go to the template repository on GitHub
    2. Click "Fork" in the top right
    3. Choose your account and repository name
    4. Wait for the fork to complete

    **Step 2: Connect to Netlify**
    1. Go to [netlify.com](https://netlify.com) and sign up/log in
    2. Click "Add new site" → "Import an existing project"
    3. Choose "Deploy with GitHub"
    4. Authorize Netlify to access your GitHub account
    5. Select your forked repository
    6. Keep the default build settings (they're pre-configured)
    7. Click "Deploy site"

    **Step 3: Configure Your URL**
    1. Once deployed, go to Site settings → Domain management
    2. Click "Options" → "Edit site name" to change your URL
    3. Add a custom domain if desired

    **Step 4: Set Environment Variables**
    1. Go to Site settings → Environment variables
    2. Add: `PUBLIC_SITE_URL` = your site's full URL (e.g., `https://my-curriculum.netlify.app`)

    Your site should now be live!
knowledge_check:
  - question: "Why does the curriculum use static site hosting instead of a traditional server?"
    hint: "Think about speed, security, cost, and maintenance."
  - question: "What triggers a rebuild of your site?"
    hint: "Consider what actions push changes to your repository."
---

## Getting Online

The fastest path from "I have a curriculum idea" to "It's live on the internet" is about 10 minutes. Here's how.

## Prerequisites

You'll need:
- A GitHub account (free at [github.com](https://github.com))
- A Netlify account (free at [netlify.com](https://netlify.com))

No coding knowledge required. If you can click buttons and fill in forms, you can deploy.

## Step-by-Step Deployment

### 1. Fork the Template

Forking creates your own copy of the template repository:

1. Visit the template repository
2. Click the "Fork" button (top right)
3. Select your GitHub account
4. Give it a descriptive name (e.g., `philosophy-curriculum`)
5. Click "Create fork"

You now have your own repository with all the curriculum infrastructure.

### 2. Connect to Netlify

Netlify will automatically build and host your site:

1. Log into [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Select "Deploy with GitHub"
4. Authorize Netlify if prompted
5. Find and select your forked repository
6. Keep all default settings (build command, publish directory are pre-configured)
7. Click "Deploy site"

Netlify will now build your site. This takes 1-2 minutes.

### 3. Customize Your URL

By default, Netlify assigns a random URL like `hungry-turing-a1b2c3.netlify.app`. To change it:

1. Go to "Site settings" → "Domain management"
2. Click "Options" next to your Netlify domain
3. Select "Edit site name"
4. Enter your preferred name (e.g., `my-philosophy-curriculum`)
5. Your site is now at `my-philosophy-curriculum.netlify.app`

### 4. Set Environment Variables

One configuration step remains:

1. Go to "Site settings" → "Environment variables"
2. Click "Add a variable"
3. Key: `PUBLIC_SITE_URL`
4. Value: Your full site URL (e.g., `https://my-philosophy-curriculum.netlify.app`)
5. Click "Create variable"
6. Trigger a redeploy: "Deploys" → "Trigger deploy" → "Deploy site"

This ensures canonical URLs and SEO metadata are correct.

## Verifying Deployment

Your site should now be live! Check:

1. Homepage loads at your URL
2. Curriculum page shows your clusters
3. At least one lesson is accessible
4. About page displays correctly

If something looks wrong, check the deploy logs in Netlify for errors.

## Automatic Updates

The best part: future updates are automatic.

- Edit content in the CMS → saves to GitHub → triggers rebuild
- Edit files directly in GitHub → triggers rebuild
- Push changes from your computer → triggers rebuild

Your live site updates within 1-2 minutes of any change.

## Custom Domains

Want to use your own domain (e.g., `curriculum.yourdomain.com`)?

1. Go to "Domain management" → "Add a domain"
2. Enter your domain name
3. Follow Netlify's instructions to update your DNS
4. Netlify handles SSL certificates automatically

This is optional—the `.netlify.app` domain works great for most uses.
