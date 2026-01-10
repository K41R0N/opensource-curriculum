/**
 * CMS OAuth Worker for Sveltia CMS
 *
 * Handles GitHub OAuth authentication for the git-based CMS.
 * Deploy to Cloudflare Workers and configure environment variables.
 *
 * Required environment variables:
 *   GITHUB_CLIENT_ID - Your GitHub OAuth App Client ID
 *   GITHUB_CLIENT_SECRET - Your GitHub OAuth App Client Secret
 *
 * Optional environment variables:
 *   ALLOWED_ORIGINS - Comma-separated list of allowed origins (e.g., "https://my-site.netlify.app")
 *                     If not set, defaults to allowing common Netlify patterns
 */

const FETCH_TIMEOUT_MS = 10000; // 10 second timeout for GitHub API calls

/**
 * Check if an origin is allowed for CORS and postMessage
 */
function isOriginAllowed(origin, env) {
	if (!origin) return false;

	// If ALLOWED_ORIGINS is set, use it as whitelist
	if (env.ALLOWED_ORIGINS) {
		const allowedList = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
		return allowedList.includes(origin);
	}

	// Default: allow common hosting patterns (Netlify, Vercel, localhost)
	const allowedPatterns = [
		/^https:\/\/[a-z0-9-]+\.netlify\.app$/,
		/^https:\/\/[a-z0-9-]+\.vercel\.app$/,
		/^http:\/\/localhost:\d+$/,
		/^http:\/\/127\.0\.0\.1:\d+$/
	];

	return allowedPatterns.some((pattern) => pattern.test(origin));
}

/**
 * Create CORS headers for a specific origin
 */
function getCorsHeaders(origin, env) {
	const allowedOrigin = isOriginAllowed(origin, env) ? origin : '';

	return {
		'Access-Control-Allow-Origin': allowedOrigin,
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		Vary: 'Origin'
	};
}

/**
 * Create a signed state parameter that encodes the origin
 * This allows us to validate the callback and know where to postMessage
 */
async function createState(origin, secret) {
	const data = JSON.stringify({ origin, timestamp: Date.now() });
	const encoder = new TextEncoder();

	// Create HMAC signature
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);

	const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));

	// Combine data and signature, base64url encode
	const combined = {
		data,
		sig: btoa(String.fromCharCode(...new Uint8Array(signature)))
	};

	return btoa(JSON.stringify(combined)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Verify and decode a signed state parameter
 */
async function verifyState(state, secret) {
	try {
		// Base64url decode
		const padded = state.replace(/-/g, '+').replace(/_/g, '/');
		const combined = JSON.parse(atob(padded));

		const encoder = new TextEncoder();

		// Verify HMAC signature
		const key = await crypto.subtle.importKey(
			'raw',
			encoder.encode(secret),
			{ name: 'HMAC', hash: 'SHA-256' },
			false,
			['verify']
		);

		const sigBytes = Uint8Array.from(atob(combined.sig), (c) => c.charCodeAt(0));
		const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(combined.data));

		if (!valid) return null;

		const data = JSON.parse(combined.data);

		// Check timestamp (valid for 10 minutes)
		if (Date.now() - data.timestamp > 10 * 60 * 1000) {
			return null;
		}

		return data;
	} catch {
		return null;
	}
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url, options, timeoutMs = FETCH_TIMEOUT_MS) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal
		});
		clearTimeout(timeoutId);
		return response;
	} catch (error) {
		clearTimeout(timeoutId);
		if (error.name === 'AbortError') {
			throw new Error('Request timed out');
		}
		throw error;
	}
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const origin = request.headers.get('Origin') || request.headers.get('Referer')?.replace(/\/$/, '');
		const corsHeaders = getCorsHeaders(origin, env);

		// Handle preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		// OAuth authorize endpoint
		if (url.pathname === '/auth') {
			// Get the origin from Referer header to encode in state
			const referer = request.headers.get('Referer');
			const refererOrigin = referer ? new URL(referer).origin : null;

			if (!refererOrigin || !isOriginAllowed(refererOrigin, env)) {
				return new Response('Unauthorized origin', { status: 403 });
			}

			// Create signed state with origin
			const state = await createState(refererOrigin, env.GITHUB_CLIENT_SECRET);

			const authUrl = new URL('https://github.com/login/oauth/authorize');
			authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
			authUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
			authUrl.searchParams.set('scope', 'repo,user');
			authUrl.searchParams.set('state', state);

			return Response.redirect(authUrl.toString(), 302);
		}

		// OAuth callback endpoint
		if (url.pathname === '/callback') {
			const code = url.searchParams.get('code');
			const state = url.searchParams.get('state');

			if (!code) {
				return new Response('Missing code parameter', { status: 400 });
			}

			if (!state) {
				return new Response('Missing state parameter', { status: 400 });
			}

			// Verify state and extract origin
			const stateData = await verifyState(state, env.GITHUB_CLIENT_SECRET);
			if (!stateData) {
				return new Response('Invalid or expired state parameter', { status: 400 });
			}

			const targetOrigin = stateData.origin;

			// Double-check origin is still allowed
			if (!isOriginAllowed(targetOrigin, env)) {
				return new Response('Unauthorized origin', { status: 403 });
			}

			// Exchange code for token with timeout
			let tokenData;
			try {
				const tokenResponse = await fetchWithTimeout('https://github.com/login/oauth/access_token', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json'
					},
					body: JSON.stringify({
						client_id: env.GITHUB_CLIENT_ID,
						client_secret: env.GITHUB_CLIENT_SECRET,
						code: code
					})
				});

				tokenData = await tokenResponse.json();
			} catch (error) {
				return new Response(`OAuth error: ${error.message}`, { status: 500 });
			}

			if (tokenData.error) {
				return new Response(`OAuth error: ${tokenData.error_description}`, { status: 400 });
			}

			// Return HTML that posts the token back to the CMS
			// Use the validated origin from state, not wildcard
			const html = `
<!DOCTYPE html>
<html>
  <head><title>Authorization Complete</title></head>
  <body>
    <script>
      const token = ${JSON.stringify(tokenData.access_token)};
      const provider = 'github';
      const targetOrigin = ${JSON.stringify(targetOrigin)};
      if (window.opener) {
        window.opener.postMessage(
          'authorization:' + provider + ':success:' + JSON.stringify({ token, provider }),
          targetOrigin
        );
        window.close();
      }
    </script>
    <p>Authorization complete. This window should close automatically.</p>
  </body>
</html>`;

			return new Response(html, {
				headers: { 'Content-Type': 'text/html' }
			});
		}

		// Health check / info endpoint
		if (url.pathname === '/') {
			return new Response(
				JSON.stringify({
					service: 'CMS OAuth Worker',
					endpoints: {
						'/auth': 'Start OAuth flow',
						'/callback': 'OAuth callback (internal)'
					}
				}),
				{
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders
					}
				}
			);
		}

		return new Response('Not found', { status: 404 });
	}
};
