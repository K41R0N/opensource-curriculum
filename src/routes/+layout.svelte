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
				<a href="/curriculum">Curriculum</a>
				<a href="/about">About</a>
			</div>
		</div>
	</nav>

	<main class="flex-1">
		<slot />
	</main>

	<footer class="footer">
		<div class="container">
			<p>{settings?.footer_text || 'Built for depth, not breadth.'}</p>
		</div>
	</footer>
</div>
