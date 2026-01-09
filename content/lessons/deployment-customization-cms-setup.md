---
title: Setting Up the CMS
slug: cms-setup
cluster: deployment-customization
order: 2
description: "Configure authentication so you can edit content through the browser-based CMS."
blocks:
  - type: concept
    name: "What is the CMS?"
    explanation: |
      The CMS (Content Management System) is a web interface for editing your curriculum. Instead of editing raw files, you get:

      - **Visual forms** for filling in titles, descriptions, and content
      - **Rich text editing** like a word processor
      - **Automatic file management** — no need to know where files go

      Access it at `your-site.netlify.app/admin/`. But first, it needs to know you're allowed to edit.
  - type: concept
    name: "Why Do I Need to Log In?"
    explanation: |
      Your curriculum files live on GitHub. When you save changes in the CMS, it updates those files automatically. But GitHub needs to verify it's really you making changes.

      The login flow works like this:
      1. You click "Login with GitHub" in the CMS
      2. GitHub asks "Do you want to let this app edit your files?"
      3. You click "Authorize"
      4. The CMS can now save changes on your behalf

      This is the same process used by thousands of apps that connect to GitHub.
  - type: concept
    name: "The Three Pieces"
    explanation: |
      This setup requires three things to work together:

      1. **GitHub OAuth App** — Tells GitHub which app is asking for permission
      2. **Cloudflare Worker** — A tiny helper that handles the login handshake
      3. **Environment Variables** — Tell your site where to find everything

      It sounds complex, but you'll just be copying and pasting values between websites. Follow the steps in order, and it will work.
assignment:
  instructions: |
    This is the most technical lesson in the curriculum. Set aside 20-30 minutes of focused time.

    **You'll be working across three websites:**
    - GitHub (where your files live)
    - Cloudflare (free helper service)
    - Netlify (where your site is hosted)

    **Before starting, have ready:**
    - Your Netlify site URL (e.g., `https://my-curriculum.netlify.app`)
    - A text file or notes app to temporarily store values you'll copy

    Follow each step in order. Don't skip ahead!
  - type: check
    question: "Why does the CMS need you to log in with GitHub?"
    hint: "Think about who should be allowed to change your curriculum content."
  - type: check
    question: "If something goes wrong, where would you check the callback URL?"
    hint: "The callback URL appears in both GitHub and Cloudflare."
  - type: resource
    title: "Cloudflare Workers Documentation"
    author: "Cloudflare"
    url: "https://developers.cloudflare.com/workers/"
    description: "Learn more about the free service that powers authentication."
---

## Before You Begin

**This is the most technical lesson in the curriculum.** Don't worry—you won't need to write any code. You'll just be copying and pasting values between websites. But it does require careful attention to detail.

**Time required**: 20-30 minutes

**What you'll set up**:
- A way for the CMS to securely verify you're the owner
- The ability to edit content through a friendly web interface

**Tip**: Open a text file or notes app to temporarily store values as you go. You'll copy several codes and URLs that need to be pasted elsewhere.

---

## Overview: What We're Building

```text
You                         CMS                         GitHub
 │                           │                            │
 ├── Click "Login" ─────────→│                            │
 │                           ├── Redirect to GitHub ─────→│
 │                           │                            │
 │←──────────────────────────┼── "Allow access?" ←────────┤
 │                           │                            │
 ├── Click "Authorize" ─────→│                            │
 │                           │                            │
 │                    Cloudflare Worker                   │
 │                           │                            │
 │                           ├── Verify & get token ─────→│
 │                           │                            │
 │←── Now logged in ─────────┤                            │
```

The Cloudflare Worker is a tiny helper (free) that handles the security handshake between the CMS and GitHub. Let's set it all up.

---

## Step 1: Create a Cloudflare Account

Cloudflare provides the helper service that handles login. It's free.

1. Go to [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Enter your email and create a password
3. Verify your email if prompted
4. You'll land on the Cloudflare dashboard

> **Note**: If you already have a Cloudflare account, just log in.

---

## Step 2: Create the Worker

A "Worker" is a small program that runs on Cloudflare's servers. We need one to handle the login process.

### Create a New Worker

1. In the Cloudflare dashboard sidebar, click **Workers & Pages**
2. Click **Create**
3. Select **Create Worker**
4. Give it a name: `curriculum-auth` (or any name you'll remember)
5. Click **Deploy** (we'll edit the code next)

### Edit the Worker Code

1. After deploying, click **Edit code** (or go to your worker and click "Quick edit")
2. **Delete all the existing code** in the editor
3. **Copy the entire code block below** and paste it:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Step 1: Start the login - redirect to GitHub
    if (url.pathname === '/auth') {
      const authUrl = new URL('https://github.com/login/oauth/authorize');
      authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
      authUrl.searchParams.set('scope', 'repo user');
      authUrl.searchParams.set('state', crypto.randomUUID());
      return Response.redirect(authUrl.toString(), 302);
    }

    // Step 2: Handle GitHub's response
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');

      // Exchange the code for an access token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: code
        })
      });

      const tokenData = await tokenResponse.json();

      // Send the token back to the CMS
      const script = `
        <script>
          (function() {
            function receiveMessage(e) {
              window.opener.postMessage(
                'authorization:github:success:${JSON.stringify(tokenData)}',
                e.origin
              );
              window.removeEventListener("message", receiveMessage, false);
            }
            window.addEventListener("message", receiveMessage, false);
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script>
      `;

      return new Response(script, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    return new Response('OAuth Worker - visit /auth to begin', { status: 200 });
  }
};
```

4. Click **Save and Deploy**

### Get Your Worker URL

After deploying, you'll see your worker URL. It looks like:

```text
https://curriculum-auth.YOUR-USERNAME.workers.dev
```

**Write this URL down!** You'll need it in the next steps.

---

## Step 3: Create a GitHub OAuth App

Now we need to tell GitHub about your CMS.

### Navigate to OAuth Apps

1. Go to [github.com](https://github.com) and log in
2. Click your **profile picture** (top right) → **Settings**
3. Scroll down the left sidebar and click **Developer settings**
4. Click **OAuth Apps** → **New OAuth App**

### Fill In the Form

| Field | What to Enter |
|-------|---------------|
| **Application name** | `My Curriculum CMS` (or any name) |
| **Homepage URL** | Your Netlify site URL (e.g., `https://my-curriculum.netlify.app`) |
| **Application description** | Optional — you can leave this blank |
| **Authorization callback URL** | Your worker URL + `/callback` (e.g., `https://curriculum-auth.yourname.workers.dev/callback`) |

5. Click **Register application**

### Copy Your Credentials

After registering, you'll see your app's settings page.

1. **Copy the Client ID** — Save it to your notes
2. Click **Generate a new client secret**
3. **Copy the Client Secret immediately** — You won't be able to see it again!

> **Important**: Keep these safe! The Client Secret is like a password. Don't share it publicly.

---

## Step 4: Configure the Worker Variables

Go back to Cloudflare and add your GitHub credentials to the worker.

1. Go to **Workers & Pages** → click on your worker
2. Click the **Settings** tab
3. Click **Variables and Secrets** (under "Bindings" section)
4. Click **Add** for each variable:

| Variable Name | Value | Type |
|---------------|-------|------|
| `GITHUB_CLIENT_ID` | Your GitHub Client ID | Text |
| `GITHUB_CLIENT_SECRET` | Your GitHub Client Secret | Secret (click "Encrypt") |

5. Click **Deploy** to save the changes

---

## Step 5: Add Netlify Environment Variables

Now tell your Netlify site where to find everything.

1. Go to your site in the **Netlify dashboard**
2. Click **Site settings** → **Environment variables**
3. Add these two variables:

| Variable Name | Value |
|---------------|-------|
| `CMS_REPO` | Your GitHub username/repo (e.g., `myname/my-curriculum`) |
| `CMS_AUTH_URL` | Your Cloudflare Worker URL (e.g., `https://curriculum-auth.yourname.workers.dev`) |

4. Go to **Deploys** → Click **Trigger deploy** → **Deploy site**

Wait 1-2 minutes for Netlify to rebuild your site with the new configuration.

---

## Step 6: Test the Login

The moment of truth!

1. Go to your site's admin page: `https://your-site.netlify.app/admin/`
2. Click **Login with GitHub**
3. GitHub will ask if you want to authorize your app — click **Authorize**
4. You should be redirected back to the CMS dashboard

**If you see the CMS dashboard with your content listed: Success!**

---

## Troubleshooting

### "Failed to fetch" or blank screen after clicking login

**Likely cause**: Environment variables not set correctly, or site not redeployed.

**Fix**:
1. Check that `CMS_AUTH_URL` is set in Netlify environment variables
2. Make sure you triggered a redeploy after adding the variables
3. Visit your worker URL directly (e.g., `https://curriculum-auth.yourname.workers.dev`)
4. You should see "OAuth Worker - visit /auth to begin"

### "Bad credentials" error

**Likely cause**: Client ID or Secret is wrong.

**Fix**:
1. Double-check the values in Cloudflare match exactly what's in GitHub
2. Make sure you didn't accidentally add spaces when copying
3. Try regenerating a new client secret in GitHub and updating Cloudflare

### Login popup closes but nothing happens

**Likely cause**: Callback URL mismatch.

**Fix**:
1. In GitHub OAuth App settings, check the "Authorization callback URL"
2. It should be your worker URL + `/callback`
3. These must match **exactly** (including `https://`)

### "Not found" or 404 errors

**Likely cause**: Worker code isn't right.

**Fix**:
1. Go to your worker in Cloudflare and click "Quick edit"
2. Make sure the code is exactly as shown above
3. Click "Save and Deploy" again

### Can see CMS but changes won't save

**Likely cause**: Repository name is wrong, or you don't have write access.

**Fix**:
1. Check `CMS_REPO` in Netlify matches your exact username and repo name
2. Make sure you're logged into the GitHub account that owns the repository

---

## Success!

Once you can log in and see the CMS dashboard, you're ready to start editing content through the browser. The next lesson covers basic customization options.

**What you can now do**:
- Edit lessons, clusters, and pages through a visual interface
- Save changes that automatically publish to your live site
- Add images and manage content without touching code

The CMS is accessed at `your-site.netlify.app/admin/` whenever you need to edit.
