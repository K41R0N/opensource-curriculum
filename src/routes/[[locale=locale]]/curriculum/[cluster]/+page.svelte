<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { localizedPath, type Locale } from '$lib/i18n';

	export let data: PageData;

	// Locale from layout data
	$: locale = (data.locale || 'en') as Locale;

	$: clusters = data.clusters;
	$: cluster = clusters.find(c => c.slug === $page.params.cluster);
	$: clusterIndex = clusters.findIndex(c => c.slug === $page.params.cluster);
	$: prevCluster = clusterIndex > 0 ? clusters[clusterIndex - 1] : null;
	$: nextCluster = clusterIndex < clusters.length - 1 ? clusters[clusterIndex + 1] : null;

	// Format lesson number with leading zero
	function formatNumber(n: number): string {
		return n.toString().padStart(2, '0');
	}

	// Translations
	$: t = {
		lessons: locale === 'es-CO' ? 'Lecciones' : 'Lessons',
		previousCluster: locale === 'es-CO' ? 'Cluster Anterior' : 'Previous Cluster',
		nextCluster: locale === 'es-CO' ? 'Siguiente Cluster' : 'Next Cluster',
		allClusters: locale === 'es-CO' ? 'Todos los Clusters' : 'All Clusters',
		curriculum: locale === 'es-CO' ? 'Currículo' : 'Curriculum',
		clusterNotFound: locale === 'es-CO' ? 'Cluster no encontrado' : 'Cluster not found',
		returnToCurriculum: locale === 'es-CO' ? 'Volver al currículo' : 'Return to curriculum'
	};
</script>

<svelte:head>
	<title>{cluster?.title || 'Cluster'} | DEVICES Curriculum</title>
</svelte:head>

{#if cluster}
	<!-- Sticky Header -->
	<header class="cluster-header">
		<div class="cluster-header-content">
			<a href={localizedPath('/curriculum', locale)} class="header-back-btn" aria-label="Back to curriculum">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M19 12H5M12 19l-7-7 7-7"/>
				</svg>
			</a>
			<h2 class="header-title">Cluster {cluster.id}</h2>
			<a href={localizedPath('/', locale)} class="header-home-btn" aria-label="Home">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
					<polyline points="9 22 9 12 15 12 15 22"/>
				</svg>
			</a>
		</div>
	</header>

	<!-- Main Content -->
	<main class="cluster-main">
		<!-- Hero Section -->
		<div class="cluster-hero">
			<span class="cluster-badge">Cluster {formatNumber(cluster.id)}</span>
			<h1 class="cluster-title">{cluster.title}</h1>
			<p class="cluster-description">{cluster.description}</p>
			<p class="cluster-count">{cluster.lessons.length} {t.lessons}</p>
		</div>

		<!-- Lesson List -->
		<div class="lesson-list">
			{#each cluster.lessons as lesson, i}
				<!-- Lesson Card -->
				<a href={localizedPath(`/curriculum/${cluster.slug}/${lesson.slug}`, locale)} class="lesson-card">
					<div class="lesson-card-content">
						<div class="lesson-number-badge">
							{formatNumber(i + 1)}
						</div>
						<div class="lesson-info">
							<h3 class="lesson-title">{lesson.title}</h3>
							{#if lesson.author}
								<p class="lesson-author">{lesson.author}</p>
							{/if}
							<p class="lesson-description">{lesson.description}</p>
						</div>
						<div class="lesson-arrow">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M9 18l6-6-6-6"/>
							</svg>
						</div>
					</div>
				</a>

				<!-- Connecting Line (except after last lesson) -->
				{#if i < cluster.lessons.length - 1}
					<div class="connector-line"></div>
				{/if}
			{/each}
		</div>

		<!-- Cluster Navigation -->
		<nav class="cluster-navigation">
			<a href={localizedPath(prevCluster ? `/curriculum/${prevCluster.slug}` : '/curriculum', locale)} class="nav-prev">
				<span class="nav-label">
					{prevCluster ? t.previousCluster : t.allClusters}
				</span>
				<span class="nav-cluster-title">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M19 12H5M12 19l-7-7 7-7"/>
					</svg>
					{prevCluster ? prevCluster.title : t.curriculum}
				</span>
			</a>
			{#if nextCluster}
				<a href={localizedPath(`/curriculum/${nextCluster.slug}`, locale)} class="nav-next">
					<span class="nav-label">{t.nextCluster}</span>
					<span class="nav-cluster-title">
						{nextCluster.title}
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M5 12h14M12 5l7 7-7 7"/>
						</svg>
					</span>
				</a>
			{/if}
		</nav>
	</main>
{:else}
	<div class="content-section">
		<div class="container">
			<h1>{t.clusterNotFound}</h1>
			<p>
				<a href={localizedPath('/curriculum', locale)}>{t.returnToCurriculum}</a>
			</p>
		</div>
	</div>
{/if}

<style>
	/* Sticky Header */
	.cluster-header {
		position: sticky;
		top: 0;
		z-index: 50;
		background-color: rgba(243, 238, 229, 0.95);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid rgba(208, 28, 31, 0.15);
	}

	.cluster-header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
		height: 3.5rem;
		max-width: 42rem;
		margin: 0 auto;
	}

	.header-back-btn,
	.header-home-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		color: var(--color-black-light);
		text-decoration: none;
		border-radius: 50%;
		transition: all 0.2s ease;
	}

	.header-back-btn:hover,
	.header-home-btn:hover {
		color: var(--color-red);
		background-color: rgba(208, 28, 31, 0.1);
	}

	.header-title {
		font-family: var(--font-heading);
		font-size: 1rem;
		font-weight: 400;
		color: var(--color-red);
		letter-spacing: 0.05em;
		margin: 0;
	}

	/* Main Content */
	.cluster-main {
		max-width: 42rem;
		margin: 0 auto;
		padding: 0 1.25rem 4rem;
	}

	/* Hero Section */
	.cluster-hero {
		padding: 2.5rem 0 2rem;
		text-align: center;
	}

	.cluster-badge {
		display: inline-block;
		font-family: var(--font-body);
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--color-red);
		margin-bottom: 0.75rem;
	}

	.cluster-title {
		font-size: 2.25rem;
		line-height: 1.15;
		margin: 0 0 1rem;
		color: var(--color-red);
	}

	.cluster-description {
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-black-light);
		font-style: italic;
		margin: 0 0 1.5rem;
		max-width: 32rem;
		margin-left: auto;
		margin-right: auto;
	}

	.cluster-count {
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-black-light);
		margin: 0;
	}

	/* Lesson List */
	.lesson-list {
		display: flex;
		flex-direction: column;
	}

	/* Connector Line */
	.connector-line {
		width: 2px;
		height: 1.25rem;
		background-color: rgba(208, 28, 31, 0.2);
		margin-left: 2.25rem;
	}

	/* Lesson Card */
	.lesson-card {
		display: block;
		text-decoration: none;
		background-color: var(--color-cream);
		border: 1px solid rgba(208, 28, 31, 0.12);
		padding: 1.25rem;
		transition: all 0.2s ease;
	}

	.lesson-card:hover {
		border-color: var(--color-red);
		box-shadow: 0 4px 16px rgba(208, 28, 31, 0.12);
	}

	.lesson-card:hover .lesson-title {
		color: var(--color-red);
	}

	.lesson-card:hover .lesson-number-badge {
		background-color: var(--color-red);
		color: var(--color-cream);
	}

	.lesson-card:hover .lesson-arrow {
		transform: translateX(4px);
		color: var(--color-red);
	}

	.lesson-card-content {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.lesson-number-badge {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		background-color: rgba(208, 28, 31, 0.1);
		color: var(--color-red);
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 1rem;
		border-radius: 0.5rem;
		transition: all 0.2s ease;
	}

	.lesson-info {
		flex: 1;
		min-width: 0;
	}

	.lesson-title {
		font-family: var(--font-body);
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-black);
		margin: 0 0 0.25rem;
		line-height: 1.3;
		transition: color 0.2s ease;
	}

	.lesson-author {
		font-size: 0.8125rem;
		font-style: italic;
		color: var(--color-black-light);
		margin: 0 0 0.375rem;
	}

	.lesson-description {
		font-size: 0.9375rem;
		color: var(--color-black-light);
		line-height: 1.6;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.lesson-arrow {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2.75rem;
		color: var(--color-black-light);
		opacity: 0.5;
		transition: all 0.2s ease;
	}

	/* Cluster Navigation */
	.cluster-navigation {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid rgba(208, 28, 31, 0.2);
	}

	.nav-prev,
	.nav-next {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		padding: 0.5rem 0;
	}

	.nav-prev {
		align-items: flex-start;
		text-align: left;
	}

	.nav-next {
		align-items: flex-end;
		text-align: right;
	}

	.nav-label {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-black-light);
		margin-bottom: 0.25rem;
	}

	.nav-next .nav-label {
		color: var(--color-red);
		font-weight: 600;
	}

	.nav-cluster-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-heading);
		font-size: 1rem;
		color: var(--color-black);
		font-weight: 400;
		transition: transform 0.2s ease;
	}

	.nav-prev:hover .nav-cluster-title {
		transform: translateX(-4px);
		color: var(--color-red);
	}

	.nav-next:hover .nav-cluster-title {
		transform: translateX(4px);
		color: var(--color-red);
	}

	.nav-cluster-title svg {
		flex-shrink: 0;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.cluster-title {
			font-size: 1.875rem;
		}

		.lesson-card-content {
			flex-wrap: wrap;
		}

		.lesson-arrow {
			display: none;
		}

		.cluster-navigation {
			grid-template-columns: 1fr;
		}

		.nav-next {
			align-items: flex-start;
			text-align: left;
			padding-top: 1rem;
			border-top: 1px solid rgba(208, 28, 31, 0.1);
		}

		.nav-next .nav-cluster-title {
			flex-direction: row-reverse;
		}
	}
</style>
