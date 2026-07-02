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
	 */
	function safeMarkdown(text: string): string {
		if (!text) return '';
		const escaped = text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
		return escaped
			.replace(/\n\n+/g, '</p><p>')
			.replace(/^/, '<p>')
			.replace(/$/, '</p>')
			.replace(/\*([^*]+)\*/g, '<em>$1</em>')
			.replace(/_([^_]+)_/g, '<em>$1</em>');
	}

	$: approachHtml = home?.body ? safeMarkdown(home.body) : '';
</script>

<svelte:head>
	<title>{settings.title}</title>
	<meta name="description" content={settings.description} />
</svelte:head>

<!-- Hero Section -->
<header class="home-hero">
	<div class="container">
		<div class="hero-grid">
			<div class="hero-text">
				<span class="hero-label">{settings?.title || 'Curriculum'}</span>
				<h1 class="hero-title">{home.title}</h1>
				<p class="hero-tagline">{home.tagline}</p>
				<a href={ctaHref} class="hero-cta">{home.cta_text}</a>
			</div>
			<div class="hero-stats">
				<div class="stat-block">
					<span class="stat-number">{clusters.length}</span>
					<span class="stat-label">Clusters</span>
				</div>
				<div class="stat-block">
					<span class="stat-number">{totalLessons}</span>
					<span class="stat-label">Lessons</span>
				</div>
			</div>
		</div>
	</div>
</header>

<!-- Curriculum Overview -->
<main class="home-main">
	{#if foundationClusters.length > 0}
		<section class="cluster-section">
			<div class="section-header">
				<h2 class="section-title">Foundations</h2>
				<p class="section-subtitle">Core concepts to master before specialization.</p>
			</div>
			<div class="cluster-list">
				{#each foundationClusters as cluster, i}
					<a href={`/curriculum/${cluster.slug}`} class="cluster-card" style="animation-delay: {i * 60}ms">
						<div class="cluster-card-content">
							<div class="cluster-card-meta">
								<span class="cluster-number">Cluster {cluster.id}</span>
								<span class="cluster-lessons">{cluster.lessons?.length ?? 0} lessons</span>
							</div>
							<h3 class="cluster-title">{cluster.title}</h3>
							<p class="cluster-description">{cluster.description}</p>
						</div>
						<div class="cluster-card-arrow">→</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	{#if specializationClusters.length > 0}
		<div class="section-divider"></div>
		<section class="cluster-section">
			<div class="section-header">
				<h2 class="section-title">Specializations</h2>
				<p class="section-subtitle">Apply foundational knowledge to specific domains.</p>
			</div>
			<div class="cluster-list">
				{#each specializationClusters as cluster, i}
					<a href={`/curriculum/${cluster.slug}`} class="cluster-card" style="animation-delay: {(foundationClusters.length + i) * 60}ms">
						<div class="cluster-card-content">
							<div class="cluster-card-meta">
								<span class="cluster-number">Cluster {cluster.id}</span>
								<span class="cluster-lessons">{cluster.lessons?.length ?? 0} lessons</span>
							</div>
							<h3 class="cluster-title">{cluster.title}</h3>
							<p class="cluster-description">{cluster.description}</p>
						</div>
						<div class="cluster-card-arrow">→</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Approach Section (from CMS body) -->
	{#if home?.body}
		<div class="section-divider"></div>
		<section class="approach-section">
			<div class="approach-grid">
				<div class="approach-header">
					<h2 class="section-title">The Approach</h2>
				</div>
				<div class="approach-content prose">
					{@html approachHtml}
				</div>
			</div>
		</section>
	{/if}
</main>

<style>
	/* Hero Section */
	.home-hero {
		padding: 4rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.hero-grid {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 3rem;
	}

	.hero-text {
		max-width: 32rem;
	}

	.hero-label {
		font-family: var(--font-body);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--color-primary);
		font-weight: 600;
		display: block;
		margin-bottom: 0.75rem;
	}

	.hero-title {
		font-family: var(--font-heading);
		font-size: 2.5rem;
		line-height: 1.1;
		color: var(--color-text);
		margin: 0 0 1rem;
		font-weight: 700;
	}

	.hero-tagline {
		font-family: var(--font-body);
		font-size: 1.125rem;
		line-height: 1.6;
		color: var(--color-text-muted);
		margin: 0 0 1.5rem;
	}

	.hero-cta {
		display: inline-block;
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 600;
		padding: 0.75rem 1.5rem;
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		text-decoration: none;
		border-radius: var(--radius-base);
		transition: background-color var(--transition-base), transform 0.1s ease;
	}

	.hero-cta:hover {
		background-color: var(--color-primary-hover);
		transform: translateY(-1px);
	}

	.hero-stats {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding-top: 1rem;
	}

	.stat-block {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.stat-number {
		font-family: var(--font-heading);
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--color-text);
		line-height: 1;
	}

	.stat-label {
		font-family: var(--font-body);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-muted);
		margin-top: 0.25rem;
	}

	/* Main Content */
	.home-main {
		max-width: 48rem;
		margin: 0 auto;
		padding: 3rem 1.5rem;
	}

	.section-divider {
		width: 100%;
		height: 1px;
		background-color: var(--color-border);
		margin: 3rem 0;
	}

	/* Cluster Sections */
	.cluster-section {
		/* no extra styles needed */
	}

	.section-header {
		margin-bottom: 1.5rem;
	}

	.section-title {
		font-family: var(--font-heading);
		font-size: 1.75rem;
		color: var(--color-text);
		margin: 0 0 0.375rem;
		font-weight: 700;
	}

	.section-subtitle {
		font-family: var(--font-body);
		font-size: 0.9375rem;
		color: var(--color-text-muted);
		margin: 0;
	}

	/* Cluster Cards */
	.cluster-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.cluster-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		text-decoration: none;
		padding: 1.25rem 1.5rem;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-base);
		transition: border-color var(--transition-base), box-shadow var(--transition-base);
	}

	.cluster-card:hover {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-md);
	}

	.cluster-card:hover .cluster-card-arrow {
		color: var(--color-primary);
		transform: translateX(3px);
	}

	.cluster-card-content {
		flex: 1;
		min-width: 0;
	}

	.cluster-card-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.cluster-number {
		font-family: var(--font-body);
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--color-text-muted);
	}

	.cluster-lessons {
		font-family: var(--font-body);
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--color-primary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.cluster-title {
		font-family: var(--font-heading);
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 0.375rem;
		line-height: 1.3;
	}

	.cluster-description {
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--color-text-muted);
		line-height: 1.5;
		margin: 0;
	}

	.cluster-card-arrow {
		font-size: 1.25rem;
		color: var(--color-text-muted);
		opacity: 0.5;
		transition: color var(--transition-base), transform var(--transition-base);
		flex-shrink: 0;
		margin-left: 1rem;
	}

	/* Approach Section */
	.approach-section {
		/* no extra styles needed */
	}

	.approach-grid {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 2rem;
		align-items: start;
	}

	.approach-header {
		position: sticky;
		top: 2rem;
	}

	.approach-content {
		font-family: var(--font-body);
		font-size: 1rem;
		line-height: 1.7;
		color: var(--color-text-muted);
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
	@media (max-width: 768px) {
		.hero-grid {
			flex-direction: column;
			gap: 2rem;
		}

		.hero-stats {
			flex-direction: row;
			gap: 2rem;
			padding-top: 0;
		}

		.stat-block {
			align-items: flex-start;
		}

		.hero-title {
			font-size: 2rem;
		}

		.approach-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.approach-header {
			position: static;
		}
	}

	@media (max-width: 480px) {
		.home-hero {
			padding: 2.5rem 0;
		}

		.hero-title {
			font-size: 1.75rem;
		}

		.hero-tagline {
			font-size: 1rem;
		}

		.stat-number {
			font-size: 2rem;
		}

		.cluster-card {
			padding: 1rem;
		}

		.cluster-title {
			font-size: 1rem;
		}

		.section-title {
			font-size: 1.5rem;
		}
	}
</style>
