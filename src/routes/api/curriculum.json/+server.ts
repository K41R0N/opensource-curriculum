/**
 * Curriculum JSON API
 *
 * Provides the complete curriculum data in JSON format for:
 * - AI agents and LLMs
 * - Third-party integrations
 * - Programmatic access
 * - Data portability
 *
 * @see /CONTENT_ARCHITECTURE.md
 */
import type { RequestHandler } from './$types';
import { loadCurriculum } from '$lib/data/curriculum.server';
import { config } from '$lib/config';

const SITE_URL = config.siteUrl;
const settings = config.settings;

export const GET: RequestHandler = async ({ url }) => {
	const clusters = loadCurriculum();

	// Support optional query params for filtering
	const clusterSlug = url.searchParams.get('cluster');
	const includeUrls = url.searchParams.get('urls') !== 'false';

	let data = clusters;

	// Filter by cluster if specified
	if (clusterSlug) {
		data = clusters.filter(c => c.slug === clusterSlug);
	}

	// Add URLs if requested (default true)
	const enrichedData = data.map(cluster => ({
		...cluster,
		...(includeUrls && { url: `${SITE_URL}/curriculum/${cluster.slug}` }),
		lessons: cluster.lessons.map(lesson => ({
			...lesson,
			...(includeUrls && { url: `${SITE_URL}/curriculum/${cluster.slug}/${lesson.slug}` })
		}))
	}));

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
