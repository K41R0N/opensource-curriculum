<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { SITE_URL } from '$lib/config';

	export let data;

	$: currentPath = $page.url.pathname;
	$: settings = data.settings;

	let mobileMenuOpen = false;

	function toggleMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMenu() {
		mobileMenuOpen = false;
	}

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
			<div class="nav-links-desktop">
				<a href="/curriculum" class="nav-link" class:active={currentPath.startsWith('/curriculum')}>Curriculum</a>
				<a href="/about" class="nav-link" class:active={currentPath === '/about'}>About</a>
			</div>
			<button class="nav-toggle" on:click={toggleMenu} aria-label="Toggle menu">
				{#if mobileMenuOpen}
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				{:else}
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="3" y1="6" x2="21" y2="6"></line>
						<line x1="3" y1="12" x2="21" y2="12"></line>
						<line x1="3" y1="18" x2="21" y2="18"></line>
					</svg>
				{/if}
			</button>
		</div>
		{#if mobileMenuOpen}
			<div class="nav-mobile">
				<a href="/curriculum" class="nav-link" class:active={currentPath.startsWith('/curriculum')} on:click={closeMenu}>Curriculum</a>
				<a href="/about" class="nav-link" class:active={currentPath === '/about'} on:click={closeMenu}>About</a>
			</div>
		{/if}
	</nav>

	<main class="flex-1">
		<slot />
	</main>

	<footer class="footer">
		<div class="container">
			<div class="footer-inner">
				<span class="footer-title">{settings?.title || 'Curriculum'}</span>
				<p class="footer-tagline">{settings?.footer_text || 'Built for depth, not breadth.'}</p>
				<p class="footer-agents">
					<span class="footer-agents-label">For AI assistants:</span>
					<a href="/llms.txt" class="footer-link">/llms.txt</a>
					<span class="footer-sep">&middot;</span>
					<a href="/llms-full.txt" class="footer-link">/llms-full.txt</a>
					<span class="footer-sep">&middot;</span>
					<a href="/api/curriculum.json" class="footer-link">/api/curriculum.json</a>
				</p>
			</div>
		</div>
	</footer>
</div>

<style>
	/* Nav links - desktop */
	.nav-links-desktop {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.nav-link {
		position: relative;
		transition: color 0.15s ease;
		font-weight: 500;
	}

	.nav-link:hover {
		color: var(--color-primary);
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

	/* Mobile toggle */
	.nav-toggle {
		display: none;
		background: none;
		border: none;
		color: var(--color-text);
		cursor: pointer;
		padding: 0.25rem;
	}

	.nav-mobile {
		display: none;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem 1.5rem 1.25rem;
		border-top: 1px solid var(--color-border);
	}

	/* Footer */
	.footer-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.footer-title {
		font-weight: 600;
		font-size: 0.875rem;
		opacity: 0.7;
	}

	.footer-tagline {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.footer-agents {
		margin: 0.75rem 0 0;
		font-size: 0.75rem;
		color: var(--color-text-muted);
		display: flex;
		align-items: center;
		gap: 0.375rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.footer-agents-label {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.6875rem;
		opacity: 0.6;
	}

	.footer-link {
		font-family: var(--font-mono, monospace);
		font-size: 0.75rem;
		color: var(--color-text-muted);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.footer-link:hover {
		color: var(--color-primary);
	}

	.footer-sep {
		opacity: 0.4;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.nav-links-desktop {
			display: none;
		}

		.nav-toggle {
			display: block;
		}

		.nav-mobile {
			display: flex;
		}
	}
</style>
