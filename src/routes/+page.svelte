<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	// Defensive access to page data
	$: home = data.home;
	$: settings = data.settings;

	// Safe clusters array with defensive check
	$: clusters = Array.isArray(data?.clusters) ? data.clusters : [];

	// Group clusters by foundation vs specialization (user-configurable via CMS)
	$: foundationClusters = clusters.filter(c => c.is_foundation);
	$: specializationClusters = clusters.filter(c => !c.is_foundation);

	// Compute total lessons across all clusters
	$: totalLessons = clusters.reduce((sum, c) => sum + (c.lessons?.length ?? 0), 0);

	// Safe access to first lesson for CTA
	$: firstCluster = clusters[0];
	$: firstLesson = firstCluster?.lessons?.[0];

	// Safe CTA href - falls back to /curriculum if no lesson available
	$: ctaHref = firstCluster?.slug && firstLesson?.slug
		? `/curriculum/${firstCluster.slug}/${firstLesson.slug}`
		: '/curriculum';

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
			<span class="book-label">Self-Directed Research</span>
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
			<h2 class="group-title">Foundations</h2>
			<p class="group-subtitle">The conceptual groundwork for the curriculum.</p>

			<div class="cluster-list">
				{#each foundationClusters as cluster}
					<a href={`/curriculum/${cluster.slug}`} class="cluster-item">
						<span class="cluster-number">Cluster {cluster.id}</span>
						<h3 class="cluster-title">{cluster.title}</h3>
						<p class="cluster-description">{cluster.description}</p>
						<span class="cluster-lessons">{cluster.lessons?.length ?? 0} lessons</span>
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
			<h2 class="group-title">Specializations</h2>
			<p class="group-subtitle">Applying foundational concepts to specific domains.</p>

			<div class="cluster-list">
				{#each specializationClusters as cluster}
					<a href={`/curriculum/${cluster.slug}`} class="cluster-item">
						<span class="cluster-number">Cluster {cluster.id}</span>
						<h3 class="cluster-title">{cluster.title}</h3>
						<p class="cluster-description">{cluster.description}</p>
						<span class="cluster-lessons">{cluster.lessons?.length ?? 0} lessons</span>
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
			<h2 class="approach-title">The Approach</h2>
			<div class="approach-content">
				{@html approachHtml}
			</div>
		</section>
	{/if}

</main>

<style>
	/* Hero Section */
	.home-hero {
		background-color: var(--color-background);
		padding: 4rem 1.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid var(--color-border);
	}

	.hero-content {
		max-width: 24rem;
		text-align: center;
	}

	/* Book Cover Card */
	.book-cover {
		background-color: var(--color-surface);
		padding: 2.5rem 2rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-base);
		box-shadow: var(--shadow-md);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
	}

	.book-label {
		font-family: var(--font-body);
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--color-text-muted);
	}

	.book-title {
		font-family: var(--font-heading);
		font-size: 2rem;
		line-height: 1.1;
		color: var(--color-text);
		margin: 0;
		font-weight: 600;
	}

	.book-tagline {
		font-family: var(--font-body);
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color-text-muted);
		margin: 0;
	}

	.book-cta {
		display: inline-block;
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 0.75rem 1.5rem;
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		text-decoration: none;
		border: 1px solid var(--color-primary);
		border-radius: var(--radius-base);
		margin-top: 0.5rem;
		transition: background-color var(--transition-base);
	}

	.book-cta:hover {
		background-color: var(--color-primary-hover);
	}

	/* Main Content */
	.home-main {
		max-width: 40rem;
		margin: 0 auto;
		padding: 3rem 1.5rem;
	}

	.section-divider {
		width: 60px;
		height: 1px;
		background-color: var(--color-border);
		margin: 2.5rem auto;
	}

	/* Cluster Groups */
	.cluster-group {
		text-align: center;
	}

	.group-title {
		font-family: var(--font-heading);
		font-size: 1.75rem;
		color: var(--color-text);
		margin: 0 0 0.5rem;
		font-weight: 600;
	}

	.group-subtitle {
		font-family: var(--font-body);
		font-size: 0.9375rem;
		color: var(--color-text-muted);
		margin: 0 0 1.5rem;
	}

	/* Cluster List */
	.cluster-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.cluster-item {
		display: block;
		text-decoration: none;
		text-align: center;
		padding: 1.25rem;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-base);
		box-shadow: var(--shadow-sm);
		transition: box-shadow var(--transition-base), border-color var(--transition-base);
	}

	.cluster-item:hover {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-md);
	}

	.cluster-number {
		font-family: var(--font-body);
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--color-text-muted);
		display: block;
		margin-bottom: 0.5rem;
	}

	.cluster-title {
		font-family: var(--font-body);
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 0.5rem;
		line-height: 1.3;
	}

	.cluster-description {
		font-family: var(--font-body);
		font-size: 0.9375rem;
		color: var(--color-text-muted);
		line-height: 1.6;
		margin: 0 0 0.75rem;
	}

	.cluster-lessons {
		font-family: var(--font-body);
		font-size: 0.75rem;
		color: var(--color-text);
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
		color: var(--color-text);
		margin: 0 0 1.5rem;
		font-weight: 600;
	}

	.approach-content {
		font-family: var(--font-body);
		font-size: 1rem;
		line-height: 1.7;
		color: var(--color-text-muted);
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

	/* Responsive */
	@media (max-width: 640px) {
		.home-hero {
			padding: 3rem 1rem;
		}

		.book-cover {
			padding: 2rem 1.5rem;
		}

		.book-title {
			font-size: 1.75rem;
		}

		.book-tagline {
			font-size: 0.9375rem;
		}

		.group-title {
			font-size: 1.5rem;
		}

		.cluster-item {
			padding: 1rem;
		}

		.cluster-title {
			font-size: 1rem;
		}
	}
</style>
