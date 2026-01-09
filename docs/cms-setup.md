# CMS Setup Guide

Complete instructions for setting up Sveltia CMS authentication using GitHub OAuth and Cloudflare Workers.

---

## Overview

The CMS needs OAuth authentication to commit changes to your GitHub repository. This requires:

1. A **GitHub OAuth App** that authorizes the CMS
2. A **Cloudflare Worker** that handles the OAuth flow
3. **CMS configuration** pointing to your worker

This setup takes about 15 minutes and only needs to be done once.

---

## Step 1: Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in the form:

| Field | Value |
|-------|-------|
| Application name | `My Curriculum CMS` (or any name) |
| Homepage URL | Your Netlify site URL (e.g., `https://my-curriculum.netlify.app`) |
| Authorization callback URL | `https://your-worker-name.your-subdomain.workers.dev/callback` |

> **Note:** You'll create the worker in the next step. Use a placeholder URL for now and update it after.

4. Click **Register application**
5. Copy the **Client ID** (you'll need this)
6. Click **Generate a new client secret** and copy it immediately (it won't be shown again)

---

## Step 2: Deploy the Auth Worker

The auth worker handles the OAuth token exchange between GitHub and the CMS.

### 2.1: Create a Cloudflare Account

1. Go to [workers.cloudflare.com](https://workers.cloudflare.com)
2. Sign up for a free account (no credit card required)
3. Complete email verification

### 2.2: Create the Worker

1. In the Cloudflare dashboard, go to **Workers & Pages**
2. Click **Create application** → **Create Worker**
3. Name your worker (e.g., `curriculum-cms-auth`)
4. Click **Deploy** to create the initial worker

### 2.3: Add the OAuth Code

1. Click **Edit code** on your new worker
2. Replace the default code with the following:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers for CMS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // OAuth authorize endpoint
    if (url.pathname === '/auth') {
      const authUrl = new URL('https://github.com/login/oauth/authorize');
      authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
      authUrl.searchParams.set('scope', 'repo,user');
      authUrl.searchParams.set('state', crypto.randomUUID());

      return Response.redirect(authUrl.toString(), 302);
    }

    // OAuth callback endpoint
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');

      if (!code) {
        return new Response('Missing code parameter', { status: 400 });
      }

      // Exchange code for token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: code,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        return new Response(`OAuth error: ${tokenData.error_description}`, { status: 400 });
      }

      // Return HTML that posts the token back to the CMS
      const html = `
        <!DOCTYPE html>
        <html>
          <head><title>Authorization Complete</title></head>
          <body>
            <script>
              const token = ${JSON.stringify(tokenData.access_token)};
              const provider = 'github';

              if (window.opener) {
                window.opener.postMessage(
                  'authorization:' + provider + ':success:' + JSON.stringify({ token, provider }),
                  '*'
                );
                window.close();
              }
            </script>
            <p>Authorization complete. This window should close automatically.</p>
          </body>
        </html>
      `;

      return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};
```

3. Click **Save and Deploy**

### 2.4: Add Environment Variables

1. Go to your worker's **Settings** → **Variables**
2. Add the following **Environment Variables**:

| Variable Name | Value |
|---------------|-------|
| `GITHUB_CLIENT_ID` | Your GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | Your GitHub OAuth App Client Secret |

3. Click **Encrypt** for the client secret (recommended)
4. Click **Save and Deploy**

### 2.5: Update GitHub OAuth Callback URL

1. Go back to your [GitHub OAuth App settings](https://github.com/settings/developers)
2. Update the **Authorization callback URL** to your actual worker URL:
   ```
   https://your-worker-name.your-subdomain.workers.dev/callback
   ```
3. Click **Update application**

---

## Step 3: Configure Environment Variables

Add these environment variables in your **Netlify dashboard** (Site settings → Environment variables):

| Variable | Value | Example |
|----------|-------|---------|
| `CMS_REPO` | Your GitHub username/repo | `johndoe/my-curriculum` |
| `CMS_AUTH_URL` | Your Cloudflare Worker URL | `https://my-auth.workers.dev` |

The CMS config is generated automatically at build time from these variables. No file changes needed!

---

## Step 4: Test the Setup

1. Go to `https://your-site.netlify.app/admin/`
2. Click **Login with GitHub**
3. Authorize the OAuth app when prompted
4. You should see the CMS dashboard

If login fails, check:
- Netlify environment variables (`CMS_REPO`, `CMS_AUTH_URL`) are set correctly
- Worker environment variables (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`) are set in Cloudflare
- GitHub OAuth callback URL matches your worker URL
- Trigger a redeploy in Netlify after adding environment variables

---

## Troubleshooting

### "Unable to authenticate" error

1. Check that your worker is deployed and accessible
2. Verify environment variables are set (not just defined)
3. Ensure the callback URL in GitHub exactly matches `{worker_url}/callback`

### "Missing code parameter" error

The GitHub OAuth flow didn't complete. Check:
- Your GitHub OAuth App is active
- The callback URL is correct
- You authorized the app when prompted

### CORS errors in browser console

The worker should handle CORS automatically. If you see CORS errors:
- Verify the worker code includes CORS headers
- Check that `CMS_AUTH_URL` has no trailing slash

### Changes not appearing on site

After saving in the CMS:
1. Check GitHub to confirm the commit was made
2. Check Netlify for build status
3. Wait 1-2 minutes for the build to complete

---

## Security Notes

- **Never commit** your GitHub Client Secret to the repository
- Use Cloudflare's encrypted environment variables
- The OAuth App only needs `repo` and `user` scopes
- Consider restricting the OAuth App to specific repositories

---

## Alternative: Netlify Identity

If you prefer not to use Cloudflare Workers, you can use [Netlify Identity](https://docs.netlify.com/security/secure-access-to-sites/identity/) instead. This requires:

1. Enable Identity in Netlify site settings
2. Enable Git Gateway (Settings → Identity → Services → Git Gateway)
3. Modify `static/admin/config.template.yml` to use git-gateway:

```yaml
backend:
  name: git-gateway
  branch: main
```

With this setup, you don't need the `CMS_REPO` or `CMS_AUTH_URL` environment variables.

Note: Netlify Identity has usage limits on the free tier.
