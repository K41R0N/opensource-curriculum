/**
 * Dynamic Sitemap
 *
 * Provides a complete sitemap for search engine crawlers.
 * Automatically includes all clusters and lessons from the CMS.
 *
 * @see /CONTENT_ARCHITECTURE.md
 */
import type { RequestHandler } from './$types';
import { loadCurriculum } from '$lib/data/curriculum.server';
import { config } from '$lib/config';

const SITE_URL = config.siteUrl;

export const GET: RequestHandler = async () => {
	const clusters = loadCurriculum();
	const today = new Date().toISOString().split('T')[0];

	const staticPages = [
		{ url: '/', priority: '1.0', changefreq: 'weekly' },
		{ url: '/about', priority: '0.8', changefreq: 'monthly' },
		{ url: '/curriculum', priority: '0.9', changefreq: 'weekly' }
	];

	const clusterPages = clusters.map(cluster => ({
		url: `/curriculum/${cluster.slug}`,
		priority: '0.8',
		changefreq: 'weekly'
	}));

	const lessonPages = clusters.flatMap(cluster =>
		cluster.lessons.map(lesson => ({
			url: `/curriculum/${cluster.slug}/${lesson.slug}`,
			priority: '0.7',
			changefreq: 'monthly'
		}))
	);

	const allPages = [...staticPages, ...clusterPages, ...lessonPages];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `	<url>
		<loc>${SITE_URL}${page.url}</loc>
		<lastmod>${today}</lastmod>
		<changefreq>${page.changefreq}</changefreq>
		<priority>${page.priority}</priority>
	</url>`).join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=3600'
		}
	});
};
