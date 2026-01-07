<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { localizedPath, type Locale } from '$lib/i18n';

	export let data: PageData;

	// Locale from layout data
	$: locale = (data.locale || 'en') as Locale;

	$: clusters = data.clusters;
	$: cluster = clusters.find(c => c.slug === $page.params.cluster);
	$: lessonMeta = cluster?.lessons.find(l => l.slug === $page.params.lesson);
	$: lessonIndex = cluster?.lessons.findIndex(l => l.slug === $page.params.lesson) ?? -1;
	$: prevLesson = lessonIndex > 0 ? cluster?.lessons[lessonIndex - 1] : null;
	$: nextLesson = cluster && lessonIndex < cluster.lessons.length - 1 ? cluster.lessons[lessonIndex + 1] : null;

	$: lesson = data.hasContent ? data.lesson : lessonMeta;

	// Reading progress
	let scrollProgress = 0;

	// Estimate reading time (roughly 200 words per minute)
	$: readingTime = lesson?.content
		? Math.max(1, Math.ceil(lesson.content.split(/\s+/).length / 200))
		: 5;

	// Translations
	$: t = {
		minRead: locale === 'es-CO' ? 'min de lectura' : 'min read',
		learningObjectives: locale === 'es-CO' ? 'Objetivos de Aprendizaje' : 'Learning Objectives',
		keyConcepts: locale === 'es-CO' ? 'Conceptos Clave' : 'Key Concepts',
		assignment: locale === 'es-CO' ? 'Tarea' : 'Assignment',
		read: locale === 'es-CO' ? 'Leer:' : 'Read:',
		primaryReading: locale === 'es-CO' ? 'Lectura Principal' : 'Primary Reading',
		knowledgeCheck: locale === 'es-CO' ? 'Verificación de Conocimientos' : 'Knowledge Check',
		reflectOnTopics: locale === 'es-CO' ? 'Reflexiona sobre los temas clave de esta lección.' : 'Reflect on the key topics in this lesson.',
		hint: locale === 'es-CO' ? 'Pista:' : 'Hint:',
		additionalResources: locale === 'es-CO' ? 'Recursos Adicionales' : 'Additional Resources',
		supplementaryMaterials: locale === 'es-CO' ? 'Materiales suplementarios para una exploración más profunda.' : 'Supplementary materials for deeper exploration.',
		comingSoon: locale === 'es-CO' ? 'Contenido Próximamente' : 'Lesson Content Coming Soon',
		comingSoonDesc: locale === 'es-CO' ? 'El contenido completo de la lección estará disponible pronto. Vuelve más tarde o explora otras lecciones.' : 'Full lesson content will be available soon. Check back later or explore other lessons.',
		previousLesson: locale === 'es-CO' ? 'Lección Anterior' : 'Previous Lesson',
		backToCluster: locale === 'es-CO' ? 'Volver al Cluster' : 'Back to Cluster',
		nextLesson: locale === 'es-CO' ? 'Siguiente Lección' : 'Next Lesson',
		allClusters: locale === 'es-CO' ? 'Todos los Clusters' : 'All Clusters',
		viewCurriculum: locale === 'es-CO' ? 'Ver Currículo' : 'View Curriculum',
		lessonNotFound: locale === 'es-CO' ? 'Lección no encontrada' : 'Lesson not found',
		returnToCurriculum: locale === 'es-CO' ? 'Volver al currículo' : 'Return to curriculum'
	};

	onMount(() => {
		const updateProgress = () => {
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			scrollProgress = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
		};

		window.addEventListener('scroll', updateProgress, { passive: true });
		updateProgress();

		return () => window.removeEventListener('scroll', updateProgress);
	});
</script>

<svelte:head>
	<title>{lesson?.title || 'Lesson'} | DEVICES Curriculum</title>
</svelte:head>

{#if cluster && lesson}
	<!-- Sticky Header with Progress -->
	<header class="lesson-header">
		<div class="lesson-header-content">
			<a href={localizedPath(`/curriculum/${cluster.slug}`, locale)} class="header-back-btn" aria-label={t.backToCluster}>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M19 12H5M12 19l-7-7 7-7"/>
				</svg>
			</a>
			<h2 class="header-title">DEVICES</h2>
			<a href={localizedPath('/curriculum', locale)} class="header-menu-btn" aria-label="Curriculum">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M3 12h18M3 6h18M3 18h18"/>
				</svg>
			</a>
		</div>
		<div class="progress-bar-track">
			<div class="progress-bar-fill" style="width: {scrollProgress}%"></div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="lesson-main">
		<!-- Hero Section -->
		<div class="lesson-hero">
			<div class="lesson-meta">
				<span class="lesson-badge">Cluster {cluster.id} · Lesson {lessonIndex + 1}</span>
				<span class="lesson-reading-time">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"/>
						<path d="M12 6v6l4 2"/>
					</svg>
					{readingTime} {t.minRead}
				</span>
			</div>

			<h1 class="lesson-title">{lesson.title}</h1>

			{#if lesson.author}
				<p class="lesson-author">{lesson.author}</p>
			{/if}

			{#if lesson.featured_image}
				<figure class="lesson-featured-image">
					<div class="image-overlay"></div>
					<img src={lesson.featured_image} alt={lesson.title} />
				</figure>
			{/if}

			{#if lesson.description}
				<p class="lesson-description">{lesson.description}</p>
			{/if}
		</div>

		<!-- Article Body -->
		<article class="lesson-article">
			{#if data.hasContent}
				{#if lesson.content}
					<div class="lesson-content">
						{@html lesson.content}
					</div>
				{/if}

				{#if lesson.objectives && lesson.objectives.length > 0}
					<div class="lesson-callout lesson-callout-objectives">
						<div class="callout-icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<circle cx="12" cy="12" r="10"/>
								<path d="M12 16v-4M12 8h.01"/>
							</svg>
						</div>
						<div class="callout-content">
							<h3>{t.learningObjectives}</h3>
							<ul>
								{#each lesson.objectives as objective}
									<li>{objective}</li>
								{/each}
							</ul>
						</div>
					</div>
				{/if}

				{#if lesson.key_concepts && lesson.key_concepts.length > 0}
					<section class="lesson-section">
						<h2>{t.keyConcepts}</h2>
						{#each lesson.key_concepts as concept}
							<div class="concept-card">
								<div class="concept-accent"></div>
								<div class="concept-icon">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
									</svg>
								</div>
								<div class="concept-content">
									<h4>{concept.name}</h4>
									<div class="concept-explanation">
										{@html concept.explanation}
									</div>
								</div>
							</div>
						{/each}
					</section>
				{/if}

				{#if lesson.assignment}
					<section class="lesson-section">
						<div class="assignment-card">
							<div class="assignment-header">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
								</svg>
								<h3>{t.assignment}</h3>
							</div>
							<div class="assignment-body">
								{@html lesson.assignment.instructions}
							</div>
							{#if lesson.assignment.url}
								<a
									href={lesson.assignment.url}
									target="_blank"
									rel="noopener noreferrer"
									class="assignment-link"
								>
									{t.read} {lesson.assignment.reading_title || t.primaryReading}
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M5 12h14M12 5l7 7-7 7"/>
									</svg>
								</a>
							{/if}
						</div>
					</section>
				{/if}

				{#if lesson.knowledge_check && lesson.knowledge_check.length > 0}
					<section class="lesson-section">
						<div class="knowledge-check-section">
							<div class="knowledge-check-header">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
								</svg>
								<h3>{t.knowledgeCheck}</h3>
							</div>
							<p class="knowledge-check-intro">
								{t.reflectOnTopics}
							</p>
							<div class="knowledge-check-questions">
								{#each lesson.knowledge_check as question, i}
									<div class="question-card">
										<span class="question-number">{i + 1}</span>
										<div class="question-content">
											<p class="question-text">{question.question}</p>
											{#if question.hint}
												<p class="question-hint">
													<strong>{t.hint}</strong> {question.hint}
												</p>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					</section>
				{/if}

				{#if lesson.additional_resources && lesson.additional_resources.length > 0}
					<section class="lesson-section">
						<h2>{t.additionalResources}</h2>
						<p class="section-subtitle">{t.supplementaryMaterials}</p>
						<div class="resources-grid">
							{#each lesson.additional_resources as resource}
								<div class="resource-card">
									<h4>
										{#if resource.url}
											<a href={resource.url} target="_blank" rel="noopener noreferrer">
												{resource.title}
												<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
													<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
												</svg>
											</a>
										{:else}
											{resource.title}
										{/if}
									</h4>
									{#if resource.author}
										<p class="resource-author">{resource.author}</p>
									{/if}
									{#if resource.description}
										<p class="resource-description">{resource.description}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}
			{:else}
				<p class="lesson-description">{lesson.description}</p>

				<div class="lesson-callout lesson-callout-coming-soon">
					<div class="callout-icon">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10"/>
							<path d="M12 6v6l4 2"/>
						</svg>
					</div>
					<div class="callout-content">
						<h3>{t.comingSoon}</h3>
						<p>{t.comingSoonDesc}</p>
					</div>
				</div>
			{/if}
		</article>

		<!-- Chapter Navigation Footer -->
		<nav class="lesson-navigation">
			<a href={localizedPath(prevLesson ? `/curriculum/${cluster.slug}/${prevLesson.slug}` : `/curriculum/${cluster.slug}`, locale)} class="nav-prev">
				<span class="nav-label">
					{prevLesson ? t.previousLesson : t.backToCluster}
				</span>
				<span class="nav-title">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M19 12H5M12 19l-7-7 7-7"/>
					</svg>
					{prevLesson ? prevLesson.title : cluster.title}
				</span>
			</a>
			<a href={localizedPath(nextLesson ? `/curriculum/${cluster.slug}/${nextLesson.slug}` : '/curriculum', locale)} class="nav-next">
				<span class="nav-label">
					{nextLesson ? t.nextLesson : t.allClusters}
				</span>
				<span class="nav-title">
					{nextLesson ? nextLesson.title : t.viewCurriculum}
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M5 12h14M12 5l7 7-7 7"/>
					</svg>
				</span>
			</a>
		</nav>
	</main>
{:else}
	<div class="content-section">
		<div class="container">
			<h1>{t.lessonNotFound}</h1>
			<p>
				<a href={localizedPath('/curriculum', locale)}>{t.returnToCurriculum}</a>
			</p>
		</div>
	</div>
{/if}

<style>
	/* Sticky Header */
	.lesson-header {
		position: sticky;
		top: 0;
		z-index: 50;
		background-color: rgba(243, 238, 229, 0.95);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid rgba(208, 28, 31, 0.15);
	}

	.lesson-header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
		height: 3.5rem;
	}

	.header-back-btn,
	.header-menu-btn {
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
	.header-menu-btn:hover {
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

	.progress-bar-track {
		height: 3px;
		background-color: rgba(208, 28, 31, 0.15);
	}

	.progress-bar-fill {
		height: 100%;
		background-color: var(--color-red);
		transition: width 0.1s ease-out;
	}

	/* Main Content */
	.lesson-main {
		max-width: 42rem;
		margin: 0 auto;
		padding: 0 1.25rem 5rem;
	}

	/* Hero Section */
	.lesson-hero {
		padding: 2rem 0;
	}

	.lesson-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.lesson-badge {
		display: inline-block;
		padding: 0.25rem 0.625rem;
		background-color: rgba(208, 28, 31, 0.1);
		color: var(--color-red);
		font-family: var(--font-body);
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.lesson-reading-time {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		color: var(--color-black-light);
		font-size: 0.8125rem;
	}

	.lesson-reading-time svg {
		opacity: 0.7;
	}

	.lesson-title {
		font-size: 2.5rem;
		line-height: 1.15;
		margin: 0 0 0.75rem;
		letter-spacing: -0.01em;
	}

	.lesson-author {
		font-style: italic;
		color: var(--color-black-light);
		margin: 0 0 1.5rem;
		font-size: 1.0625rem;
	}

	.lesson-featured-image {
		position: relative;
		width: 100%;
		margin: 0 0 2rem;
		overflow: hidden;
		border: 1px solid rgba(208, 28, 31, 0.2);
	}

	.lesson-featured-image img {
		width: 100%;
		height: auto;
		display: block;
	}

	.lesson-featured-image .image-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.1));
		pointer-events: none;
	}

	.lesson-description {
		font-size: 1.1875rem;
		line-height: 1.7;
		color: var(--color-black-light);
		margin: 0;
	}

	/* Article Body */
	.lesson-article {
		padding-top: 1rem;
	}

	.lesson-content {
		font-size: 1.0625rem;
		line-height: 1.85;
		margin-bottom: 2.5rem;
	}

	.lesson-content :global(p) {
		margin-bottom: 1.5rem;
	}

	.lesson-content :global(h2) {
		margin-top: 2.5rem;
		margin-bottom: 1rem;
	}

	.lesson-content :global(h3) {
		margin-top: 2rem;
		margin-bottom: 0.75rem;
	}

	/* Callouts */
	.lesson-callout {
		display: flex;
		gap: 1rem;
		background-color: var(--color-cream);
		border: 1px solid rgba(208, 28, 31, 0.15);
		border-left: 4px solid var(--color-red);
		padding: 1.25rem;
		margin: 2rem 0;
	}

	.callout-icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		background-color: rgba(208, 28, 31, 0.1);
		color: var(--color-red);
		border-radius: 0.5rem;
	}

	.callout-content h3 {
		margin: 0 0 0.75rem;
		font-size: 1.125rem;
	}

	.callout-content ul {
		margin: 0;
		padding-left: 1.25rem;
	}

	.callout-content li {
		margin-bottom: 0.375rem;
	}

	.callout-content p {
		margin: 0;
	}

	/* Sections */
	.lesson-section {
		margin: 3rem 0;
	}

	.lesson-section h2 {
		margin-bottom: 1rem;
	}

	.section-subtitle {
		color: var(--color-black-light);
		margin-bottom: 1.5rem;
	}

	/* Concept Cards */
	.concept-card {
		position: relative;
		display: flex;
		gap: 1rem;
		background-color: var(--color-cream);
		border: 1px solid rgba(208, 28, 31, 0.15);
		padding: 1.25rem;
		margin-bottom: 1rem;
		overflow: hidden;
	}

	.concept-accent {
		position: absolute;
		top: 0;
		left: 0;
		width: 4px;
		height: 100%;
		background-color: var(--color-red);
	}

	.concept-icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		background-color: rgba(208, 28, 31, 0.1);
		color: var(--color-red);
		border-radius: 0.5rem;
	}

	.concept-content h4 {
		font-family: var(--font-heading);
		font-size: 1.125rem;
		color: var(--color-red);
		margin: 0 0 0.5rem;
		font-weight: 400;
	}

	.concept-explanation {
		font-size: 0.9375rem;
		line-height: 1.7;
		color: var(--color-black-light);
	}

	.concept-explanation :global(p) {
		margin: 0;
	}

	.concept-explanation :global(p + p) {
		margin-top: 0.75rem;
	}

	/* Assignment Card */
	.assignment-card {
		background-color: rgba(208, 28, 31, 0.04);
		border: 1px solid rgba(208, 28, 31, 0.2);
		padding: 1.5rem;
	}

	.assignment-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
		color: var(--color-red);
	}

	.assignment-header h3 {
		margin: 0;
		font-size: 1.25rem;
	}

	.assignment-body {
		margin-bottom: 1.25rem;
		line-height: 1.75;
	}

	.assignment-body :global(p) {
		margin: 0 0 0.75rem;
	}

	.assignment-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-body);
		font-size: 0.9375rem;
		font-weight: 700;
		padding: 0.75rem 1.25rem;
		background-color: var(--color-red);
		color: var(--color-cream);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.assignment-link:hover {
		background-color: var(--color-red-dark);
		color: var(--color-cream);
	}

	/* Knowledge Check */
	.knowledge-check-section {
		background-color: rgba(208, 28, 31, 0.04);
		border: 1px solid rgba(208, 28, 31, 0.15);
		padding: 1.5rem;
	}

	.knowledge-check-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
		color: var(--color-red);
	}

	.knowledge-check-header h3 {
		margin: 0;
		font-size: 1.25rem;
	}

	.knowledge-check-intro {
		color: var(--color-black-light);
		margin: 0 0 1.25rem;
		font-size: 0.9375rem;
	}

	.knowledge-check-questions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.question-card {
		display: flex;
		gap: 1rem;
		background-color: var(--color-cream);
		border: 1px solid rgba(208, 28, 31, 0.12);
		padding: 1rem;
	}

	.question-number {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		background-color: rgba(208, 28, 31, 0.1);
		color: var(--color-red);
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 0.8125rem;
	}

	.question-content {
		flex: 1;
	}

	.question-text {
		font-weight: 500;
		margin: 0;
		line-height: 1.6;
	}

	.question-hint {
		font-size: 0.875rem;
		color: var(--color-black-light);
		margin: 0.5rem 0 0;
		font-style: italic;
	}

	.question-hint strong {
		font-style: normal;
	}

	/* Resources Grid */
	.resources-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.resource-card {
		background-color: var(--color-cream);
		border: 1px solid rgba(208, 28, 31, 0.15);
		padding: 1rem 1.25rem;
		transition: all 0.2s ease;
	}

	.resource-card:hover {
		border-color: var(--color-red);
		box-shadow: 0 2px 8px rgba(208, 28, 31, 0.1);
	}

	.resource-card h4 {
		font-family: var(--font-heading);
		font-size: 1.0625rem;
		color: var(--color-red);
		margin: 0 0 0.25rem;
		font-weight: 400;
	}

	.resource-card h4 a {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		text-decoration: none;
	}

	.resource-card h4 a:hover {
		text-decoration: underline;
	}

	.resource-author {
		font-size: 0.875rem;
		color: var(--color-black-light);
		font-style: italic;
		margin: 0 0 0.375rem;
	}

	.resource-description {
		font-size: 0.9375rem;
		margin: 0;
		color: var(--color-black-light);
	}

	/* Navigation Footer */
	.lesson-navigation {
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
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-black-light);
		margin-bottom: 0.25rem;
	}

	.nav-next .nav-label {
		color: var(--color-red);
		font-weight: 600;
	}

	.nav-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-heading);
		font-size: 1.125rem;
		color: var(--color-black);
		font-weight: 400;
		transition: transform 0.2s ease;
	}

	.nav-prev:hover .nav-title {
		transform: translateX(-4px);
		color: var(--color-red);
	}

	.nav-next:hover .nav-title {
		transform: translateX(4px);
		color: var(--color-red);
	}

	.nav-title svg {
		flex-shrink: 0;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.lesson-title {
			font-size: 2rem;
		}

		.lesson-navigation {
			grid-template-columns: 1fr;
		}

		.nav-next {
			align-items: flex-start;
			text-align: left;
			padding-top: 1rem;
			border-top: 1px solid rgba(208, 28, 31, 0.1);
		}

		.nav-next .nav-title {
			flex-direction: row-reverse;
		}

		.lesson-callout {
			flex-direction: column;
			gap: 0.75rem;
		}

		.concept-card {
			flex-direction: column;
			gap: 0.75rem;
			padding-left: 1.5rem;
		}
	}
</style>
