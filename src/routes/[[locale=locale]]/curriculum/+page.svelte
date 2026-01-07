<script lang="ts">
	import type { PageData } from './$types';
	import { localizedPath, type Locale } from '$lib/i18n';

	export let data: PageData;

	// Configuration: number of foundation clusters (first N clusters)
	// Keep in sync with homepage FOUNDATION_COUNT
	const FOUNDATION_COUNT = 3;

	// Locale from layout data
	$: locale = (data.locale || 'en') as Locale;

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

	// Translations
	$: t = {
		curriculum: locale === 'es-CO' ? 'Currículo' : 'Curriculum',
		theCurriculum: locale === 'es-CO' ? 'El Currículo' : 'The Curriculum',
		description: locale === 'es-CO'
			? 'Un viaje estructurado a través de conceptos fundacionales y aplicaciones especializadas.'
			: 'A structured journey through foundational concepts and specialized applications.',
		startAnywhere: locale === 'es-CO'
			? 'Comienza donde quieras, pero los fundamentos proporcionan contexto esencial para todo lo que sigue.'
			: 'Start anywhere, but the foundations provide essential context for everything that follows.',
		clusters: locale === 'es-CO' ? 'Clusters' : 'Clusters',
		lessons: locale === 'es-CO' ? 'Lecciones' : 'Lessons',
		startReading: locale === 'es-CO' ? 'Comenzar a Leer' : 'Start Reading',
		foundations: locale === 'es-CO' ? 'Fundamentos' : 'Foundations',
		foundationsDesc: locale === 'es-CO' ? 'La base conceptual para todo el marco.' : 'The conceptual groundwork for the entire framework.',
		specializations: locale === 'es-CO' ? 'Especializaciones' : 'Specializations',
		specializationsDesc: locale === 'es-CO' ? 'Aplicando conceptos fundacionales a dominios específicos.' : 'Applying foundational concepts to specific domains.',
		backToHome: locale === 'es-CO' ? 'Volver al Inicio' : 'Back to Home',
		start: locale === 'es-CO' ? 'Comenzar' : 'Start'
	};
</script>

<svelte:head>
	<title>{t.curriculum} | DEVICES</title>
	<meta name="description" content={t.description} />
</svelte:head>

<!-- Sticky Header -->
<header class="curriculum-header">
	<div class="curriculum-header-content">
		<a href={localizedPath('/', locale)} class="header-home-btn" aria-label="Home">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
				<polyline points="9 22 9 12 15 12 15 22"/>
			</svg>
		</a>
		<h2 class="header-title">{t.curriculum}</h2>
		<a href={localizedPath('/about', locale)} class="header-about-btn" aria-label="About">
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
		<h1 class="curriculum-title">{t.theCurriculum}</h1>
		<p class="curriculum-description">
			{t.description}
			{t.startAnywhere}
		</p>
		<div class="curriculum-stats">
			<span class="stat">
				<strong>{totalClusters}</strong> {t.clusters}
			</span>
			<span class="stat-divider">·</span>
			<span class="stat">
				<strong>{totalLessons}</strong> {t.lessons}
			</span>
		</div>
		{#if firstCluster && firstLesson}
			<a href={localizedPath(`/curriculum/${firstCluster.slug}/${firstLesson.slug}`, locale)} class="curriculum-cta">
				{t.startReading}
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
				<h2 class="section-title">{t.foundations}</h2>
				<p class="section-subtitle">{t.foundationsDesc}</p>
			</div>

			<div class="cluster-grid">
				{#each foundationClusters as cluster, i}
					<a href={localizedPath(`/curriculum/${cluster.slug}`, locale)} class="cluster-card">
						<div class="cluster-card-content">
							<div class="cluster-number-badge">
								{formatNumber(cluster.id)}
							</div>
							<div class="cluster-info">
								<h3 class="cluster-card-title">{cluster.title}</h3>
								<p class="cluster-card-description">{cluster.description}</p>
								<span class="cluster-lesson-count">{cluster.lessons?.length ?? 0} {locale === 'es-CO' ? 'lecciones' : 'lessons'}</span>
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
				<h2 class="section-title">{t.specializations}</h2>
				<p class="section-subtitle">{t.specializationsDesc}</p>
			</div>

			<div class="cluster-grid">
				{#each specializationClusters as cluster, i}
					<a href={localizedPath(`/curriculum/${cluster.slug}`, locale)} class="cluster-card">
						<div class="cluster-card-content">
							<div class="cluster-number-badge">
								{formatNumber(cluster.id)}
							</div>
							<div class="cluster-info">
								<h3 class="cluster-card-title">{cluster.title}</h3>
								<p class="cluster-card-description">{cluster.description}</p>
								<span class="cluster-lesson-count">{cluster.lessons?.length ?? 0} {locale === 'es-CO' ? 'lecciones' : 'lessons'}</span>
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
		<a href={localizedPath('/', locale)} class="footer-nav-link">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M19 12H5M12 19l-7-7 7-7"/>
			</svg>
			{t.backToHome}
		</a>
		{#if firstCluster}
			<a href={localizedPath(`/curriculum/${firstCluster.slug}`, locale)} class="footer-nav-link footer-nav-primary">
				{t.start}: {firstCluster.title}
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
		background-color: rgba(243, 238, 229, 0.95);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid rgba(208, 28, 31, 0.15);
	}

	.curriculum-header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
		height: 3.5rem;
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
		color: var(--color-black-light);
		text-decoration: none;
		border-radius: 50%;
		transition: all 0.2s ease;
	}

	.header-home-btn:hover,
	.header-about-btn:hover {
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
	.curriculum-main {
		max-width: 48rem;
		margin: 0 auto;
		padding: 0 1.25rem 4rem;
	}

	/* Hero Section */
	.curriculum-hero {
		text-align: center;
		padding: 3rem 0 2.5rem;
		border-bottom: 1px solid rgba(208, 28, 31, 0.1);
		margin-bottom: 2.5rem;
	}

	.curriculum-title {
		font-size: 2.5rem;
		line-height: 1.1;
		margin: 0 0 1rem;
		color: var(--color-red);
	}

	.curriculum-description {
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-black-light);
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
		color: var(--color-black-light);
	}

	.stat strong {
		color: var(--color-red);
		font-weight: 700;
	}

	.stat-divider {
		color: rgba(208, 28, 31, 0.4);
	}

	.curriculum-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 0.75rem 1.5rem;
		background-color: var(--color-red);
		color: var(--color-cream);
		text-decoration: none;
		border: 2px solid var(--color-red);
		transition: all 0.2s ease;
	}

	.curriculum-cta:hover {
		background-color: transparent;
		color: var(--color-red);
	}

	/* Section Styles */
	.cluster-section {
		margin-bottom: 2rem;
	}

	.section-header {
		margin-bottom: 1.5rem;
	}

	.section-title {
		font-family: var(--font-heading);
		font-size: 1.75rem;
		color: var(--color-red);
		margin: 0 0 0.5rem;
		font-weight: 400;
	}

	.section-subtitle {
		font-family: var(--font-body);
		font-size: 0.9375rem;
		font-style: italic;
		color: var(--color-black-light);
		margin: 0;
	}

	.section-divider {
		width: 60px;
		height: 1px;
		background-color: rgba(208, 28, 31, 0.25);
		margin: 2.5rem auto;
	}

	/* Cluster Grid */
	.cluster-grid {
		display: flex;
		flex-direction: column;
	}

	.cluster-connector {
		width: 2px;
		height: 1rem;
		background-color: rgba(208, 28, 31, 0.2);
		margin-left: 2.25rem;
	}

	/* Cluster Card */
	.cluster-card {
		display: block;
		text-decoration: none;
		background-color: var(--color-cream);
		border: 1px solid rgba(208, 28, 31, 0.12);
		padding: 1.25rem;
		transition: all 0.2s ease;
	}

	.cluster-card:hover {
		border-color: var(--color-red);
		box-shadow: 0 4px 16px rgba(208, 28, 31, 0.12);
	}

	.cluster-card:hover .cluster-card-title {
		color: var(--color-red);
	}

	.cluster-card:hover .cluster-number-badge {
		background-color: var(--color-red);
		color: var(--color-cream);
	}

	.cluster-card:hover .cluster-arrow {
		transform: translateX(4px);
		color: var(--color-red);
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

	.cluster-info {
		flex: 1;
		min-width: 0;
	}

	.cluster-card-title {
		font-family: var(--font-body);
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-black);
		margin: 0 0 0.375rem;
		line-height: 1.3;
		transition: color 0.2s ease;
	}

	.cluster-card-description {
		font-size: 0.9375rem;
		color: var(--color-black-light);
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
		color: var(--color-red);
	}

	.cluster-arrow {
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

	/* Footer Navigation */
	.curriculum-footer-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid rgba(208, 28, 31, 0.2);
	}

	.footer-nav-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-body);
		font-size: 0.9375rem;
		color: var(--color-black-light);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.footer-nav-link:hover {
		color: var(--color-red);
	}

	.footer-nav-primary {
		color: var(--color-red);
		font-weight: 600;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.curriculum-title {
			font-size: 2rem;
		}

		.curriculum-description {
			font-size: 1rem;
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
