/**
 * RSS 2.0 Feed
 *
 * Provides machine-readable curriculum content for RSS readers,
 * aggregators, and automated systems.
 *
 * Includes full lesson content via <content:encoded> for AI agents
 * and systems that want the complete text.
 *
 * @see /CONTENT_ARCHITECTURE.md
 */
import type { RequestHandler } from './$types';
import { loadCurriculum, loadFullLesson } from '$lib/data/curriculum.server';
import { config } from '$lib/config';

const SITE_URL = config.siteUrl;
const settings = config.settings;
const SITE_TITLE = settings.title;
const SITE_DESCRIPTION = settings.description;

export const GET: RequestHandler = async () => {
	const clusters = loadCurriculum();

	// Flatten all lessons with their cluster context
	const lessonsMetadata = clusters.flatMap(cluster =>
		cluster.lessons.map(lesson => ({
			...lesson,
			clusterTitle: cluster.title,
			clusterSlug: cluster.slug,
			clusterId: cluster.id
		}))
	);

	// Sort by cluster order, then lesson order
	lessonsMetadata.sort((a, b) => {
		if (a.clusterId !== b.clusterId) return a.clusterId - b.clusterId;
		return a.order - b.order;
	});

	// Load full content for each lesson
	const lessonsWithContent = await Promise.all(
		lessonsMetadata.map(async (lesson) => {
			const { lesson: fullLesson } = await loadFullLesson(lesson.clusterSlug, lesson.slug);
			return {
				...lesson,
				content: fullLesson?.content || ''
			};
		})
	);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<channel>
		<title>${escapeXml(SITE_TITLE)}</title>
		<link>${SITE_URL}</link>
		<description>${escapeXml(SITE_DESCRIPTION)}</description>
		<language>en-us</language>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>

		${clusters.map(cluster => `
		<item>
			<title>Cluster ${cluster.id}: ${escapeXml(cluster.title)}</title>
			<link>${SITE_URL}/curriculum/${cluster.slug}</link>
			<guid isPermaLink="true">${SITE_URL}/curriculum/${cluster.slug}</guid>
			<description>${escapeXml(cluster.description)}</description>
			<category>Cluster</category>
			${cluster.overview ? `<content:encoded><![CDATA[${cluster.overview}]]></content:encoded>` : ''}
		</item>`).join('')}

		${lessonsWithContent.map(lesson => `
		<item>
			<title>${escapeXml(lesson.title)}</title>
			<link>${SITE_URL}/curriculum/${lesson.clusterSlug}/${lesson.slug}</link>
			<guid isPermaLink="true">${SITE_URL}/curriculum/${lesson.clusterSlug}/${lesson.slug}</guid>
			<description>${escapeXml(lesson.description)}</description>
			${lesson.author ? `<author>${escapeXml(lesson.author)}</author>` : ''}
			<category>${escapeXml(lesson.clusterTitle)}</category>
			${lesson.content ? `<content:encoded><![CDATA[${lesson.content}]]></content:encoded>` : ''}
		</item>`).join('')}
	</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'max-age=3600' // Cache for 1 hour
		}
	});
};

function escapeXml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
