/**
 * Curriculum JSON API
 *
 * Provides the complete curriculum data in JSON format for:
 * - AI agents and LLMs
 * - Third-party integrations
 * - Programmatic access
 * - Data portability
 *
 * Query parameters:
 * - cluster: Filter to a specific cluster by slug
 * - urls: Include URLs (default: true, set to 'false' to omit)
 * - content: Include full lesson content (default: false, set to 'true' to include)
 *
 * @see /CONTENT_ARCHITECTURE.md
 */
import type { RequestHandler } from './$types';
import { loadCurriculum, loadFullLesson } from '$lib/data/curriculum.server';
import { config } from '$lib/config';

const SITE_URL = config.siteUrl;
const settings = config.settings;

export const GET: RequestHandler = async ({ url }) => {
	const clusters = loadCurriculum();

	// Support optional query params for filtering
	const clusterSlug = url.searchParams.get('cluster');
	const includeUrls = url.searchParams.get('urls') !== 'false';
	const includeContent = url.searchParams.get('content') === 'true';

	let data = clusters;

	// Filter by cluster if specified
	if (clusterSlug) {
		data = clusters.filter(c => c.slug === clusterSlug);
	}

	// Build enriched data, optionally with full lesson content
	const enrichedData = await Promise.all(
		data.map(async cluster => {
			// Load full content for lessons if requested
			const enrichedLessons = await Promise.all(
				cluster.lessons.map(async lesson => {
					const baseLesson = {
						...lesson,
						...(includeUrls && { url: `${SITE_URL}/curriculum/${cluster.slug}/${lesson.slug}` })
					};

					if (includeContent) {
						const { lesson: fullLesson } = await loadFullLesson(cluster.slug, lesson.slug);
						if (fullLesson) {
							return {
								...baseLesson,
								objectives: fullLesson.objectives,
								key_concepts: fullLesson.key_concepts,
								assignment: fullLesson.assignment,
								knowledge_check: fullLesson.knowledge_check,
								additional_resources: fullLesson.additional_resources,
								content: fullLesson.content
							};
						}
					}

					return baseLesson;
				})
			);

			return {
				...cluster,
				...(includeUrls && { url: `${SITE_URL}/curriculum/${cluster.slug}` }),
				lessons: enrichedLessons
			};
		})
	);

	const response = {
		$schema: `${SITE_URL}/api/schema.json`,
		version: '1.0',
		generated: new Date().toISOString(),
		site: {
			name: settings.title,
			url: SITE_URL,
			description: settings.description
		},
		stats: {
			totalClusters: clusters.length,
			totalLessons: clusters.reduce((sum, c) => sum + c.lessons.length, 0)
		},
		clusters: enrichedData
	};

	return new Response(JSON.stringify(response, null, 2), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'max-age=3600',
			'Access-Control-Allow-Origin': '*' // Enable CORS for API access
		}
	});
};
