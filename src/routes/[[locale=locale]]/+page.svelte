<script lang="ts">
	import type { PageData } from './$types';
	import { localizedPath, type Locale } from '$lib/i18n';

	export let data: PageData;

	// Configuration: number of foundation clusters (first N clusters)
	const FOUNDATION_COUNT = 3;

	// Locale from layout data
	$: locale = (data.locale || 'en') as Locale;

	// Defensive access to page data
	$: home = data.home;
	$: settings = data.settings;

	// Safe clusters array with defensive check
	$: clusters = Array.isArray(data?.clusters) ? data.clusters : [];

	// Group clusters by foundation vs specialization
	$: foundationClusters = clusters.slice(0, FOUNDATION_COUNT);
	$: specializationClusters = clusters.slice(FOUNDATION_COUNT);

	// Compute total lessons across all clusters
	$: totalLessons = clusters.reduce((sum, c) => sum + (c.lessons?.length ?? 0), 0);

	// Safe access to first lesson for CTA
	$: firstCluster = clusters[0];
	$: firstLesson = firstCluster?.lessons?.[0];

	// Safe CTA href - falls back to /curriculum if no lesson available
	$: ctaHref = localizedPath(
		firstCluster?.slug && firstLesson?.slug
			? `/curriculum/${firstCluster.slug}/${firstLesson.slug}`
			: '/curriculum',
		locale
	);

	/**
	 * Safely convert simple markdown to HTML
	 * Escapes HTML entities first to prevent XSS, then applies safe transformations
	 */
	function safeMarkdown(text: string): string {
		if (!text) return '';

		// First, escape HTML entities to prevent XSS
		const escaped = text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');

		// Then apply safe markdown transformations
		return escaped
			// Convert double newlines to paragraph breaks
			.replace(/\n\n+/g, '</p><p>')
			// Wrap in paragraph tags
			.replace(/^/, '<p>')
			.replace(/$/, '</p>')
			// Convert *italic* (but not escaped asterisks)
			.replace(/\*([^*]+)\*/g, '<em>$1</em>')
			// Convert _italic_ alternative
			.replace(/_([^_]+)_/g, '<em>$1</em>');
	}

	// Pre-compute safe HTML for approach section
	$: approachHtml = home?.body ? safeMarkdown(home.body) : '';
</script>

<svelte:head>
	<title>{settings.title}</title>
	<meta name="description" content={settings.description} />
</svelte:head>

<!-- Hero Section -->
<header class="home-hero">
	<div class="hero-content">
		<!-- Book Cover Card -->
		<div class="book-cover">
			<span class="book-label">{locale === 'es-CO' ? 'Investigación Autodirigida' : 'Self-Directed Research'}</span>
			<h1 class="book-title">{home.title}</h1>
			<p class="book-tagline">{home.tagline}</p>
			<a href={ctaHref} class="book-cta">
				{home.cta_text}
			</a>
		</div>
	</div>
</header>

<!-- Curriculum Overview -->
<main class="home-main">
	{#if foundationClusters.length > 0}
		<!-- Foundations -->
		<section class="cluster-group">
			<h2 class="group-title">{locale === 'es-CO' ? 'Fundamentos' : 'Foundations'}</h2>
			<p class="group-subtitle">{locale === 'es-CO' ? 'La base conceptual—mediación, encarnación y ritual.' : 'The conceptual groundwork—mediation, embodiment, and ritual.'}</p>

			<div class="cluster-list">
				{#each foundationClusters as cluster}
					<a href={localizedPath(`/curriculum/${cluster.slug}`, locale)} class="cluster-item">
						<span class="cluster-number">{locale === 'es-CO' ? 'Cluster' : 'Cluster'} {cluster.id}</span>
						<h3 class="cluster-title">{cluster.title}</h3>
						<p class="cluster-description">{cluster.description}</p>
						<span class="cluster-lessons">{cluster.lessons?.length ?? 0} {locale === 'es-CO' ? 'lecciones' : 'lessons'}</span>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	{#if specializationClusters.length > 0}
		{#if foundationClusters.length > 0}
			<div class="section-divider"></div>
		{/if}

		<!-- Specializations -->
		<section class="cluster-group">
			<h2 class="group-title">{locale === 'es-CO' ? 'Especializaciones' : 'Specializations'}</h2>
			<p class="group-subtitle">{locale === 'es-CO' ? 'Aplicando los fundamentos a tecnología, medios, ideología y evolución social.' : 'Applying the foundations to technology, media, ideology, and social evolution.'}</p>

			<div class="cluster-list">
				{#each specializationClusters as cluster}
					<a href={localizedPath(`/curriculum/${cluster.slug}`, locale)} class="cluster-item">
						<span class="cluster-number">{locale === 'es-CO' ? 'Cluster' : 'Cluster'} {cluster.id}</span>
						<h3 class="cluster-title">{cluster.title}</h3>
						<p class="cluster-description">{cluster.description}</p>
						<span class="cluster-lessons">{cluster.lessons?.length ?? 0} {locale === 'es-CO' ? 'lecciones' : 'lessons'}</span>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Approach Section (from CMS body) -->
	{#if home?.body}
		{#if clusters.length > 0}
			<div class="section-divider"></div>
		{/if}
		<section class="approach-section">
			<h2 class="approach-title">{locale === 'es-CO' ? 'El Enfoque' : 'The Approach'}</h2>
			<div class="approach-content">
				{@html approachHtml}
			</div>
		</section>
	{/if}

	<!-- Footer -->
	<footer class="home-footer">
		{#if settings?.footer_text}
			<p class="footer-tagline">{settings.footer_text}</p>
		{/if}
		{#if settings?.author}
			<p class="footer-author">
				{#if settings.substack_url}
					<a href={settings.substack_url} target="_blank" rel="noopener">{settings.author}</a>
				{:else}
					{settings.author}
				{/if}
			</p>
		{/if}
	</footer>
</main>

<style>
	/* Hero Section */
	.home-hero {
		background-color: var(--color-parchment-dark);
		padding: 5rem 1.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.hero-content {
		max-width: 24rem;
		text-align: center;
	}

	/* Book Cover Card */
	.book-cover {
		background-color: var(--color-cream);
		padding: 3rem 2.5rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.book-label {
		font-family: var(--font-body);
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--color-black-light);
	}

	.book-title {
		font-family: var(--font-heading);
		font-size: 2.25rem;
		line-height: 1.1;
		color: var(--color-red);
		margin: 0;
		font-weight: 400;
	}

	.book-tagline {
		font-family: var(--font-body);
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color-black-light);
		margin: 0;
		font-style: italic;
	}

	.book-cta {
		display: inline-block;
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 0.875rem 2rem;
		background-color: var(--color-red);
		color: var(--color-cream);
		text-decoration: none;
		border: 2px solid var(--color-red);
		transition: all 0.2s ease;
		margin-top: 0.5rem;
	}

	.book-cta:hover {
		background-color: transparent;
		color: var(--color-red);
	}

	/* Main Content */
	.home-main {
		max-width: 40rem;
		margin: 0 auto;
		padding: 4rem 1.5rem;
	}

	.section-divider {
		width: 60px;
		height: 1px;
		background-color: rgba(208, 28, 31, 0.25);
		margin: 3rem auto;
	}

	/* Cluster Groups */
	.cluster-group {
		text-align: center;
	}

	.group-title {
		font-family: var(--font-heading);
		font-size: 2rem;
		color: var(--color-red);
		margin: 0 0 0.5rem;
		font-weight: 400;
	}

	.group-subtitle {
		font-family: var(--font-body);
		font-size: 0.9375rem;
		font-style: italic;
		color: var(--color-black-light);
		margin: 0 0 2rem;
	}

	/* Cluster List */
	.cluster-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.cluster-item {
		display: block;
		text-decoration: none;
		text-align: center;
		padding: 1.5rem;
		background-color: var(--color-cream);
		border: 1px solid rgba(208, 28, 31, 0.1);
		transition: all 0.2s ease;
	}

	.cluster-item:hover {
		border-color: var(--color-red);
		box-shadow: 0 4px 12px rgba(208, 28, 31, 0.1);
	}

	.cluster-item:hover .cluster-title {
		color: var(--color-red);
	}

	.cluster-number {
		font-family: var(--font-body);
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--color-black-light);
		display: block;
		margin-bottom: 0.5rem;
	}

	.cluster-title {
		font-family: var(--font-body);
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-black);
		margin: 0 0 0.5rem;
		line-height: 1.3;
		transition: color 0.2s ease;
	}

	.cluster-description {
		font-family: var(--font-body);
		font-size: 0.9375rem;
		color: var(--color-black-light);
		line-height: 1.6;
		margin: 0 0 0.75rem;
	}

	.cluster-lessons {
		font-family: var(--font-body);
		font-size: 0.75rem;
		color: var(--color-red);
		font-weight: 600;
	}

	/* Approach Section */
	.approach-section {
		text-align: center;
		max-width: 32rem;
		margin: 0 auto;
	}

	.approach-title {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		color: var(--color-red);
		margin: 0 0 1.5rem;
		font-weight: 400;
	}

	.approach-content {
		font-family: var(--font-body);
		font-size: 1rem;
		line-height: 1.8;
		color: var(--color-black-light);
		text-align: left;
	}

	.approach-content :global(p) {
		margin: 0 0 1rem;
	}

	.approach-content :global(p:last-child) {
		margin-bottom: 0;
	}

	.approach-content :global(em) {
		font-style: italic;
	}

	/* Footer */
	.home-footer {
		text-align: center;
		margin-top: 4rem;
		padding-top: 2rem;
		border-top: 1px solid rgba(208, 28, 31, 0.15);
	}

	.footer-tagline {
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-style: italic;
		color: var(--color-black-light);
		margin: 0 0 0.5rem;
	}

	.footer-author {
		margin: 0;
	}

	.footer-author a {
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-red);
		text-decoration: none;
	}

	.footer-author a:hover {
		text-decoration: underline;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.home-hero {
			padding: 3rem 1rem;
		}

		.book-cover {
			padding: 2rem 1.5rem;
		}

		.book-title {
			font-size: 1.875rem;
		}

		.book-tagline {
			font-size: 0.9375rem;
		}

		.group-title {
			font-size: 1.75rem;
		}

		.cluster-item {
			padding: 1.25rem;
		}

		.cluster-title {
			font-size: 1.125rem;
		}
	}
</style>
