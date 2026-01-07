<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	// Configuration: number of foundation clusters (first N clusters)
	const FOUNDATION_COUNT = 3;

	// Safe clusters array with defensive check
	$: clusters = Array.isArray(data?.clusters) ? data.clusters : [];

	// Group clusters by foundation vs specialization
	$: foundationClusters = clusters.slice(0, FOUNDATION_COUNT);
	$: specializationClusters = clusters.slice(FOUNDATION_COUNT);

	// Compute curriculum statistics
	$: totalClusters = clusters.length;
	$: totalLessons = clusters.reduce((sum, c) => sum + (c.lessons?.length ?? 0), 0);

	// Quick access to first cluster/lesson
	$: firstCluster = clusters[0];
	$: firstLesson = firstCluster?.lessons?.[0];

	// Format cluster number with leading zero
	function formatNumber(n: number): string {
		return n.toString().padStart(2, '0');
	}
</script>

<svelte:head>
	<title>Curriculum</title>
	<meta name="description" content="A structured journey through foundational concepts and specialized applications." />
</svelte:head>

<!-- Sticky Header -->
<header class="curriculum-header">
	<div class="curriculum-header-content">
		<a href="/" class="header-home-btn" aria-label="Home">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
				<polyline points="9 22 9 12 15 12 15 22"/>
			</svg>
		</a>
		<h2 class="header-title">Curriculum</h2>
		<a href="/about" class="header-about-btn" aria-label="About">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"/>
				<path d="M12 16v-4M12 8h.01"/>
			</svg>
		</a>
	</div>
</header>

<!-- Main Content -->
<main class="curriculum-main">
	<!-- Hero Section -->
	<div class="curriculum-hero">
		<h1 class="curriculum-title">The Curriculum</h1>
		<p class="curriculum-description">
			A structured journey through foundational concepts and specialized applications.
			Start anywhere, but the foundations provide essential context for everything that follows.
		</p>
		<div class="curriculum-stats">
			<span class="stat">
				<strong>{totalClusters}</strong> Clusters
			</span>
			<span class="stat-divider">·</span>
			<span class="stat">
				<strong>{totalLessons}</strong> Lessons
			</span>
		</div>
		{#if firstCluster && firstLesson}
			<a href={`/curriculum/${firstCluster.slug}/${firstLesson.slug}`} class="curriculum-cta">
				Start Reading
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M5 12h14M12 5l7 7-7 7"/>
				</svg>
			</a>
		{/if}
	</div>

	<!-- Foundations Section -->
	{#if foundationClusters.length > 0}
		<section class="cluster-section">
			<div class="section-header">
				<h2 class="section-title">Foundations</h2>
				<p class="section-subtitle">The conceptual groundwork for the entire framework.</p>
			</div>

			<div class="cluster-grid">
				{#each foundationClusters as cluster, i}
					<a href={`/curriculum/${cluster.slug}`} class="cluster-card">
						<div class="cluster-card-content">
							<div class="cluster-number-badge">
								{formatNumber(cluster.id)}
							</div>
							<div class="cluster-info">
								<h3 class="cluster-card-title">{cluster.title}</h3>
								<p class="cluster-card-description">{cluster.description}</p>
								<span class="cluster-lesson-count">{cluster.lessons?.length ?? 0} lessons</span>
							</div>
							<div class="cluster-arrow">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M9 18l6-6-6-6"/>
								</svg>
							</div>
						</div>
					</a>
					{#if i < foundationClusters.length - 1}
						<div class="cluster-connector"></div>
					{/if}
				{/each}
			</div>
		</section>
	{/if}

	<!-- Specializations Section -->
	{#if specializationClusters.length > 0}
		{#if foundationClusters.length > 0}
			<div class="section-divider"></div>
		{/if}

		<section class="cluster-section">
			<div class="section-header">
				<h2 class="section-title">Specializations</h2>
				<p class="section-subtitle">Applying foundational concepts to specific domains.</p>
			</div>

			<div class="cluster-grid">
				{#each specializationClusters as cluster, i}
					<a href={`/curriculum/${cluster.slug}`} class="cluster-card">
						<div class="cluster-card-content">
							<div class="cluster-number-badge">
								{formatNumber(cluster.id)}
							</div>
							<div class="cluster-info">
								<h3 class="cluster-card-title">{cluster.title}</h3>
								<p class="cluster-card-description">{cluster.description}</p>
								<span class="cluster-lesson-count">{cluster.lessons?.length ?? 0} lessons</span>
							</div>
							<div class="cluster-arrow">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M9 18l6-6-6-6"/>
								</svg>
							</div>
						</div>
					</a>
					{#if i < specializationClusters.length - 1}
						<div class="cluster-connector"></div>
					{/if}
				{/each}
			</div>
		</section>
	{/if}

	<!-- Bottom Navigation -->
	<nav class="curriculum-footer-nav">
		<a href="/" class="footer-nav-link">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M19 12H5M12 19l-7-7 7-7"/>
			</svg>
			Back to Home
		</a>
		{#if firstCluster}
			<a href={`/curriculum/${firstCluster.slug}`} class="footer-nav-link footer-nav-primary">
				Start: {firstCluster.title}
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M5 12h14M12 5l7 7-7 7"/>
				</svg>
			</a>
		{/if}
	</nav>
</main>

<style>
	/* Sticky Header */
	.curriculum-header {
		position: sticky;
		top: 0;
		z-index: 50;
		background-color: var(--color-background);
		border-bottom: 1px solid var(--color-border);
	}

	.curriculum-header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
		height: 3rem;
		max-width: 48rem;
		margin: 0 auto;
	}

	.header-home-btn,
	.header-about-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		color: var(--color-text-muted);
		text-decoration: none;
	}

	.header-title {
		font-family: var(--font-heading);
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text);
		letter-spacing: 0.02em;
		margin: 0;
	}

	/* Main Content */
	.curriculum-main {
		max-width: 48rem;
		margin: 0 auto;
		padding: 0 1.25rem 3rem;
	}

	/* Hero Section */
	.curriculum-hero {
		text-align: center;
		padding: 2.5rem 0 2rem;
		border-bottom: 1px solid var(--color-border);
		margin-bottom: 2rem;
	}

	.curriculum-title {
		font-size: 2rem;
		line-height: 1.1;
		margin: 0 0 1rem;
		color: var(--color-text);
	}

	.curriculum-description {
		font-size: 1rem;
		line-height: 1.7;
		color: var(--color-text-muted);
		margin: 0 0 1.5rem;
		max-width: 36rem;
		margin-left: auto;
		margin-right: auto;
	}

	.curriculum-stats {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.stat {
		font-family: var(--font-body);
		font-size: 0.9375rem;
		color: var(--color-text-muted);
	}

	.stat strong {
		color: var(--color-text);
		font-weight: 600;
	}

	.stat-divider {
		color: var(--color-border-light);
	}

	.curriculum-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 0.75rem 1.5rem;
		background-color: var(--color-text);
		color: var(--color-background);
		text-decoration: none;
		border: 1px solid var(--color-border);
	}

	/* Section Styles */
	.cluster-section {
		margin-bottom: 2rem;
	}

	.section-header {
		margin-bottom: 1.25rem;
	}

	.section-title {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		color: var(--color-text);
		margin: 0 0 0.5rem;
		font-weight: 600;
	}

	.section-subtitle {
		font-family: var(--font-body);
		font-size: 0.9375rem;
		color: var(--color-text-muted);
		margin: 0;
	}

	.section-divider {
		width: 60px;
		height: 1px;
		background-color: var(--color-border);
		margin: 2rem auto;
	}

	/* Cluster Grid */
	.cluster-grid {
		display: flex;
		flex-direction: column;
	}

	.cluster-connector {
		width: 1px;
		height: 0.75rem;
		background-color: var(--color-border);
		margin-left: 2rem;
	}

	/* Cluster Card */
	.cluster-card {
		display: block;
		text-decoration: none;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		padding: 1rem;
	}

	.cluster-card-content {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.cluster-number-badge {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		color: var(--color-text);
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.875rem;
	}

	.cluster-info {
		flex: 1;
		min-width: 0;
	}

	.cluster-card-title {
		font-family: var(--font-body);
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 0.375rem;
		line-height: 1.3;
	}

	.cluster-card-description {
		font-size: 0.9375rem;
		color: var(--color-text-muted);
		line-height: 1.6;
		margin: 0 0 0.5rem;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.cluster-lesson-count {
		font-family: var(--font-body);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.cluster-arrow {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2.5rem;
		color: var(--color-text-muted);
	}

	/* Footer Navigation */
	.curriculum-footer-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 2.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
	}

	.footer-nav-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-body);
		font-size: 0.9375rem;
		color: var(--color-text-muted);
		text-decoration: none;
	}

	.footer-nav-primary {
		color: var(--color-text);
		font-weight: 600;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.curriculum-title {
			font-size: 1.75rem;
		}

		.curriculum-description {
			font-size: 0.9375rem;
		}

		.cluster-card-content {
			flex-wrap: wrap;
		}

		.cluster-arrow {
			display: none;
		}

		.curriculum-footer-nav {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
			text-align: center;
		}

		.footer-nav-link {
			justify-content: center;
		}
	}
</style>
