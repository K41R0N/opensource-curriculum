---
title: Setting Up the CMS
slug: cms-setup
cluster: deployment-customization
order: 2
description: "Configure GitHub OAuth and Cloudflare Workers to enable browser-based content editing."
objectives:
  - Understand why OAuth is needed for CMS authentication
  - Set up a GitHub OAuth application
  - Deploy the authentication worker to Cloudflare
  - Test the CMS login flow
key_concepts:
  - name: "Why OAuth?"
    explanation: |
      The CMS needs to edit files in your GitHub repository. To do this securely, it uses OAuth—a standard protocol that lets you grant limited access without sharing your password.

      When you log into the CMS:
      1. You're redirected to GitHub
      2. GitHub asks if you want to grant access
      3. GitHub sends back a secure token
      4. The CMS uses that token to edit your files

      This is the same flow used by thousands of apps that integrate with GitHub.
  - name: "The Auth Worker"
    explanation: |
      OAuth requires a server to handle the token exchange—but your curriculum is a static site with no server.

      The solution: a tiny Cloudflare Worker that handles just the OAuth flow. It:
      - Receives the callback from GitHub
      - Exchanges the code for an access token
      - Passes the token back to the CMS

      Cloudflare Workers are free for this use case and take about 5 minutes to set up.
  - name: "Sveltia CMS"
    explanation: |
      Sveltia CMS is a modern, open-source content management system designed for static sites. It:

      - Runs entirely in your browser
      - Edits files directly in your GitHub repository
      - Provides a user-friendly interface for non-technical editors
      - Supports all the content types in your curriculum

      Access it at `your-site.netlify.app/admin/`.
assignment:
  instructions: |
    Follow these steps carefully. Each step builds on the previous one.

    **Step 1: Create a GitHub OAuth App**
    1. Go to GitHub → Settings → Developer settings → OAuth Apps
    2. Click "New OAuth App"
    3. Fill in:
       - Application name: `My Curriculum CMS` (or your preferred name)
       - Homepage URL: Your Netlify site URL
       - Authorization callback URL: `https://your-worker-name.your-subdomain.workers.dev/callback`
         (You'll create this worker in Step 2)
    4. Click "Register application"
    5. Copy the **Client ID**
    6. Click "Generate a new client secret" and copy it immediately

    **Step 2: Deploy the Cloudflare Worker**
    1. Go to [workers.cloudflare.com](https://workers.cloudflare.com) and sign up/log in
    2. Click "Create a Worker"
    3. Replace the default code with the OAuth worker code (see lesson content below)
    4. Click "Save and Deploy"
    5. Note your worker URL: `https://your-worker-name.your-subdomain.workers.dev`

    **Step 3: Configure Worker Environment Variables**
    1. In your Cloudflare Worker settings, go to "Variables"
    2. Add these environment variables:
       - `GITHUB_CLIENT_ID`: Your GitHub OAuth Client ID
       - `GITHUB_CLIENT_SECRET`: Your GitHub OAuth Client Secret (mark as encrypted)

    **Step 4: Add Environment Variables in Netlify**
    1. In your Netlify dashboard, go to Site settings → Environment variables
    2. Add `CMS_REPO` with your GitHub username/repo (e.g., `myname/my-curriculum`)
    3. Add `CMS_AUTH_URL` with your Cloudflare Worker URL
    4. Trigger a redeploy for the changes to take effect

    **Step 5: Test the Login**
    1. Go to `your-site.netlify.app/admin/`
    2. Click "Login with GitHub"
    3. Authorize the application
    4. You should see the CMS dashboard
knowledge_check:
  - question: "Why can't the CMS authenticate directly with GitHub without a worker?"
    hint: "Think about what OAuth requires and what a static site can provide."
  - question: "What happens if someone gets your Client Secret?"
    hint: "Consider what access it grants and how to revoke it."
---

## Understanding CMS Authentication

The CMS is how you'll edit your curriculum without touching code. But before it can work, we need to set up secure authentication with GitHub.

## Why This Setup?

Your curriculum lives as files in a GitHub repository. The CMS needs permission to edit those files on your behalf. OAuth provides this permission securely—you never share your password, and you can revoke access anytime.

The setup has three parts:
1. **GitHub OAuth App**: Tells GitHub which application is requesting access
2. **Cloudflare Worker**: Handles the OAuth token exchange (required because static sites can't keep secrets)
3. **CMS Configuration**: Points the CMS to your worker

## Step-by-Step Setup

### 1. Create the GitHub OAuth App

Navigate to GitHub:
1. Click your profile picture → Settings
2. Scroll down to "Developer settings" (left sidebar)
3. Click "OAuth Apps" → "New OAuth App"

Fill in the form:
- **Application name**: Something descriptive (e.g., "Philosophy Curriculum CMS")
- **Homepage URL**: Your Netlify site URL (e.g., `https://my-curriculum.netlify.app`)
- **Authorization callback URL**: Leave blank for now—we'll fill this after creating the worker

After registering:
1. Copy the **Client ID** somewhere safe
2. Click "Generate a new client secret"
3. Copy the **Client Secret** immediately (you won't see it again)

### 2. Deploy the OAuth Worker

Go to [workers.cloudflare.com](https://workers.cloudflare.com):
1. Sign up or log in (free account works)
2. Click "Create a Worker"
3. Give it a name (e.g., `curriculum-oauth`)
4. Replace the code with:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth') {
      const authUrl = new URL('https://github.com/login/oauth/authorize');
      authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
      authUrl.searchParams.set('scope', 'repo user');
      authUrl.searchParams.set('state', crypto.randomUUID());
      return Response.redirect(authUrl.toString(), 302);
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');

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

      const script = `
        <script>
          (function() {
            function receiveMessage(e) {
              console.log("receiveMessage %o", e);
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

    return new Response('Not found', { status: 404 });
  }
};
```

5. Click "Save and Deploy"
6. Copy your worker URL (e.g., `https://curriculum-oauth.yourname.workers.dev`)

### 3. Configure Worker Variables

Still in Cloudflare:
1. Go to your worker's Settings → Variables
2. Add two environment variables:

| Variable | Value |
|----------|-------|
| `GITHUB_CLIENT_ID` | Your GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | Your GitHub OAuth Client Secret (encrypt this) |

3. Click "Save and Deploy"

### 4. Update GitHub OAuth App

Go back to your GitHub OAuth App settings and update:
- **Authorization callback URL**: `https://your-worker.workers.dev/callback`

### 5. Add Netlify Environment Variables

In your Netlify dashboard, go to **Site settings → Environment variables** and add:

| Variable | Value |
|----------|-------|
| `CMS_REPO` | Your GitHub username/repo (e.g., `myname/my-curriculum`) |
| `CMS_AUTH_URL` | Your Cloudflare Worker URL (e.g., `https://my-auth.workers.dev`) |

These variables are used at build time to generate the CMS configuration. After adding them, trigger a redeploy in Netlify (Deploys → Trigger deploy).

### 6. Test Everything

1. Go to `https://your-site.netlify.app/admin/`
2. Click "Login with GitHub"
3. Authorize the application when GitHub prompts you
4. You should land in the CMS dashboard

If it works, you're done! If not, check the troubleshooting section below.

## Troubleshooting

**"Failed to fetch" error**
- Check that `CMS_AUTH_URL` is set correctly in Netlify environment variables
- Verify the worker is deployed (visit the URL directly)
- Make sure you redeployed after adding environment variables

**"Bad credentials" error**
- Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct in Cloudflare
- Make sure `GITHUB_CLIENT_SECRET` is the actual secret, not encrypted

**Stuck on authorization page**
- Check the callback URL matches exactly between GitHub and your worker
- Look at the browser console for error messages

**Can see CMS but can't save**
- Verify your GitHub account has write access to the repository
- Check `CMS_REPO` is set correctly (format: `username/repo-name`)

## Security Notes

- Your Client Secret should never appear in client-side code
- If you suspect the secret is compromised, regenerate it in GitHub
- The worker only has access to repositories you explicitly authorize
- You can revoke access anytime in GitHub Settings → Applications

