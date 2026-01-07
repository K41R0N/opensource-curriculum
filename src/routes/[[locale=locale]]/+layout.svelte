<script lang="ts">
	import { page } from '$app/stores';
	import { localizedPath, LOCALE_NAMES, SUPPORTED_LOCALES, type Locale } from '$lib/i18n';
	import { SITE_URL } from '$lib/config';

	export let data;

	$: locale = data.locale as Locale;
	$: currentPath = $page.url.pathname;

	// Build path without locale prefix for switching
	$: basePath = locale === 'en'
		? currentPath
		: currentPath.replace(`/${locale}`, '') || '/';

	// Build absolute URL from path
	function absoluteUrl(path: string): string {
		const cleanPath = path.startsWith('/') ? path : `/${path}`;
		return `${SITE_URL}${cleanPath}`;
	}

	// Get alternate locale URLs with absolute URLs for SEO
	$: alternateUrls = SUPPORTED_LOCALES.map(l => ({
		locale: l,
		url: localizedPath(basePath, l),
		absoluteUrl: absoluteUrl(localizedPath(basePath, l)),
		name: LOCALE_NAMES[l],
		isCurrent: l === locale
	}));
</script>

<svelte:head>
	<!-- Add hreflang for SEO with absolute URLs -->
	{#each alternateUrls as alt}
		<link rel="alternate" hreflang={alt.locale} href={alt.absoluteUrl} />
	{/each}
</svelte:head>

<div class="min-h-screen flex flex-col">
	<nav class="nav">
		<div class="container flex items-center justify-between">
			<a href={localizedPath('/', locale)} class="nav-brand">Devices</a>
			<div class="flex items-center gap-6">
				<a href={localizedPath('/curriculum', locale)}>
					{locale === 'es-CO' ? 'Currículo' : 'Curriculum'}
				</a>
				<a href={localizedPath('/about', locale)}>
					{locale === 'es-CO' ? 'Acerca de' : 'About'}
				</a>
				<a href="https://k41r0n.substack.com" target="_blank" rel="noopener">K41R0N</a>

				<!-- Language Switcher -->
				<div class="language-switcher">
					{#each alternateUrls as alt}
						{#if !alt.isCurrent}
							<a href={alt.url} class="lang-link" title="Switch to {alt.name}">
								{alt.locale === 'en' ? 'EN' : 'ES'}
							</a>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</nav>

	<main class="flex-1">
		<slot />
	</main>

	<footer class="footer">
		<div class="container">
			<p>{locale === 'es-CO' ? 'Construido para profundidad, no amplitud.' : 'Built for depth, not breadth.'}</p>
			<p style="margin-top: 0.5rem;">
				<a href="https://k41r0n.substack.com" target="_blank" rel="noopener">K41R0N</a>
			</p>
		</div>
	</footer>
</div>

<style>
	.language-switcher {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-left: 0.75rem;
		border-left: 1px solid var(--color-border);
	}

	.lang-link {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-muted);
		text-decoration: none;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.lang-link:hover {
		color: var(--color-text);
		background: var(--color-surface-elevated);
	}
</style>
