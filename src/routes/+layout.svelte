<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { SITE_URL } from '$lib/config';

	export let data;

	$: currentPath = $page.url.pathname;
	$: settings = data.settings;

	// Build absolute URL from path
	function absoluteUrl(path: string): string {
		const cleanPath = path.startsWith('/') ? path : `/${path}`;
		return `${SITE_URL}${cleanPath}`;
	}
</script>

<svelte:head>
	<link rel="canonical" href={absoluteUrl(currentPath)} />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<nav class="nav">
		<div class="container flex items-center justify-between">
			<a href="/" class="nav-brand">{settings?.title || 'Curriculum'}</a>
			<div class="flex items-center gap-6">
				<a href="/curriculum" class="nav-link" class:active={currentPath.startsWith('/curriculum')}>Curriculum</a>
				<a href="/about" class="nav-link" class:active={currentPath === '/about'}>About</a>
			</div>
		</div>
	</nav>

	<main class="flex-1">
		<slot />
	</main>

	<footer class="footer">
		<div class="container">
			<div class="footer-inner">
				<span class="footer-title">{settings?.title || 'Curriculum'}</span>
				<p class="footer-tagline">{settings?.footer_text || 'Built for depth, not breadth.'}</p>
			</div>
		</div>
	</footer>
</div>

<style>
	.nav-link {
		position: relative;
		transition: color 0.15s ease;
	}

	.nav-link.active {
		color: var(--color-primary);
		font-weight: 600;
	}

	.nav-link.active::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--color-primary);
		border-radius: 1px;
	}

	.footer-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.footer-title {
		font-weight: 600;
		font-size: 0.875rem;
		opacity: 0.7;
	}

	.footer-tagline {
		margin: 0;
	}
</style>
