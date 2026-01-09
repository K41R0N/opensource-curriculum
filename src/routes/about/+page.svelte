<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: about = data.about;
</script>

<svelte:head>
	<title>{about.title} | Curriculum</title>
	<meta name="description" content={about.subtitle || 'About this curriculum and its approach to self-directed research.'} />
</svelte:head>

<div class="page-header">
	<div class="container">
		<h1>{about.title}</h1>
		{#if about.subtitle}
			<p>{about.subtitle}</p>
		{/if}
	</div>
</div>

<section class="content-section">
	<div class="container">
		<div class="prose">
			{@html about.body}
		</div>
	</div>
</section>

<style>
	.page-header {
		background-color: var(--color-surface);
		padding: 3rem 1.5rem;
		border-bottom: 1px solid var(--color-border);
		text-align: center;
	}

	.page-header .container {
		max-width: 40rem;
		margin: 0 auto;
	}

	.page-header h1 {
		font-family: var(--font-heading);
		font-size: 2rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 0.5rem;
	}

	.page-header p {
		font-family: var(--font-body);
		font-size: 1.125rem;
		color: var(--color-text-muted);
		margin: 0;
	}

	.content-section {
		padding: 3rem 1.5rem;
	}

	.content-section .container {
		max-width: 40rem;
		margin: 0 auto;
	}

	.prose {
		font-family: var(--font-body);
		font-size: 1rem;
		line-height: 1.7;
		color: var(--color-text);
	}

	.prose :global(h2) {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 2rem 0 1rem;
	}

	.prose :global(h2:first-child) {
		margin-top: 0;
	}

	.prose :global(h3) {
		font-family: var(--font-heading);
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 1.5rem 0 0.75rem;
	}

	.prose :global(p) {
		margin: 0 0 1rem;
	}

	.prose :global(ul),
	.prose :global(ol) {
		margin: 0 0 1rem;
		padding-left: 1.5rem;
	}

	.prose :global(li) {
		margin-bottom: 0.5rem;
	}

	.prose :global(strong) {
		font-weight: 600;
	}

	.prose :global(em) {
		font-style: italic;
	}

	.prose :global(a) {
		color: var(--color-primary);
		text-decoration: underline;
	}

	.prose :global(a:hover) {
		color: var(--color-primary-hover);
	}

	@media (max-width: 640px) {
		.page-header {
			padding: 2rem 1rem;
		}

		.page-header h1 {
			font-size: 1.75rem;
		}

		.content-section {
			padding: 2rem 1rem;
		}

		.prose :global(h2) {
			font-size: 1.25rem;
		}
	}
</style>
