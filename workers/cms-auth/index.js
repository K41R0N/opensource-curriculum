/**
 * CMS OAuth Worker for Sveltia CMS
 *
 * Handles GitHub OAuth authentication for the git-based CMS.
 * Deploy to Cloudflare Workers and configure environment variables.
 *
 * Required environment variables:
 *   GITHUB_CLIENT_ID - Your GitHub OAuth App Client ID
 *   GITHUB_CLIENT_SECRET - Your GitHub OAuth App Client Secret
 */

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		// CORS headers for CMS
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
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
					Accept: 'application/json'
				},
				body: JSON.stringify({
					client_id: env.GITHUB_CLIENT_ID,
					client_secret: env.GITHUB_CLIENT_SECRET,
					code: code
				})
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
