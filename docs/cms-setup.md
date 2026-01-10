# CMS Setup Guide

Set up Sveltia CMS authentication using GitHub OAuth and Cloudflare Workers.

---

## Overview

The CMS needs OAuth authentication to commit changes to your GitHub repository:

1. **GitHub OAuth App** — authorizes the CMS to access your repo
2. **Cloudflare Worker** — handles the OAuth token exchange
3. **Netlify environment variables** — connect everything together

Setup takes about 10 minutes.

---

## Quick Setup

### Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in:

| Field | Value |
|-------|-------|
| Application name | `My Curriculum CMS` |
| Homepage URL | Your Netlify URL (e.g., `https://my-curriculum.netlify.app`) |
| Callback URL | `https://your-worker.workers.dev/callback` (update after step 2) |

4. Click **Register application**
5. Copy the **Client ID**
6. Click **Generate a new client secret** and copy it (shown only once)

---

### Step 2: Deploy Auth Worker

**Option A: One-Click Deploy (after forking)**

After forking this repository, create your own deploy button by updating this URL with your GitHub username and repo name:

```
https://deploy.workers.cloudflare.com/?url=https://github.com/YOUR_USERNAME/YOUR_REPO/tree/main/workers/cms-auth
```

After deploying, add environment variables in the Cloudflare dashboard:
- `GITHUB_CLIENT_ID` — your OAuth app client ID
- `GITHUB_CLIENT_SECRET` — your OAuth app client secret (encrypt this)
- `ALLOWED_ORIGINS` (optional) — comma-separated allowed origins (e.g., `https://my-site.netlify.app`)

**Option B: Manual Deploy**

1. Go to [Cloudflare Workers Dashboard](https://dash.cloudflare.com/?to=/:account/workers-and-pages)
2. Click **Create** → **Create Worker**
3. Name it (e.g., `curriculum-cms-auth`)
4. Replace the code with the contents of `workers/cms-auth/index.js`
5. Click **Deploy**
6. Go to **Settings** → **Variables** and add:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET` (click Encrypt)
   - `ALLOWED_ORIGINS` (optional, e.g., `https://my-site.netlify.app`)

---

### Step 3: Update GitHub Callback URL

Go back to your GitHub OAuth App and update the callback URL to match your worker:

```
https://your-worker-name.your-subdomain.workers.dev/callback
```

---

### Step 4: Configure Netlify

Add environment variables in **Netlify** (Site settings → Environment variables):

| Variable | Value | Example |
|----------|-------|---------|
| `CMS_REPO` | Your GitHub username/repo | `johndoe/my-curriculum` |
| `CMS_AUTH_URL` | Your Cloudflare Worker URL | `https://curriculum-cms-auth.johndoe.workers.dev` |

**Important:** Trigger a redeploy after adding these variables.

---

### Step 5: Test

1. Go to `https://your-site.netlify.app/admin/`
2. Click **Login with GitHub**
3. Authorize when prompted
4. You should see the CMS dashboard

---

## Troubleshooting

### "Unable to authenticate"

- Verify worker environment variables are set (not just defined)
- Check callback URL exactly matches `{worker_url}/callback`
- Ensure Netlify environment variables are set

### "Missing code parameter"

- GitHub OAuth flow didn't complete
- Check your OAuth app is active
- Verify callback URL is correct

### CORS errors

- Worker should handle CORS automatically
- Check `CMS_AUTH_URL` has no trailing slash

### Changes not appearing

After saving in CMS:
1. Check GitHub for the commit
2. Check Netlify build status
3. Wait 1-2 minutes for build to complete

---

## Security Notes

- Never commit `GITHUB_CLIENT_SECRET` to the repo
- Use Cloudflare's encrypted environment variables
- OAuth app only needs `repo` and `user` scopes
- For production, set `ALLOWED_ORIGINS` to restrict which sites can authenticate
- The worker validates OAuth state and uses origin-specific postMessage (no wildcard)

---

## Alternative: Netlify Identity

If you prefer not to use Cloudflare Workers:

1. Enable Identity in Netlify (Site settings → Identity)
2. Enable Git Gateway (Identity → Services → Git Gateway)
3. Modify `static/admin/config.template.yml`:

```yaml
backend:
  name: git-gateway
  branch: main
```

No `CMS_REPO` or `CMS_AUTH_URL` needed with this approach.

Note: Netlify Identity has usage limits on the free tier.
