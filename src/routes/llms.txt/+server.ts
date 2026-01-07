/**
 * LLMs.txt - Guidance for AI Agents
 *
 * A human and machine-readable file that helps LLMs and AI agents
 * understand what this site is about and how to access its content.
 *
 * @see https://llmstxt.org/
 */
import type { RequestHandler } from './$types';
import { loadCurriculum } from '$lib/data/curriculum.server';
import { config } from '$lib/config';

const SITE_URL = config.siteUrl;
const settings = config.settings;

export const GET: RequestHandler = async () => {
	const clusters = loadCurriculum();
	const totalLessons = clusters.reduce((sum, c) => sum + c.lessons.length, 0);

	const content = `# ${settings.title}

> ${settings.description}

## About This Site

This is an educational curriculum organized into ${clusters.length} thematic clusters containing ${totalLessons} lessons total. Each lesson explores how various "devices" (tools, technologies, rituals, concepts) mediate human experience and construct reality.

The curriculum draws from sociology, philosophy, anthropology, media studies, and science & technology studies.

## Content Structure

- **Clusters**: Thematic groupings (e.g., "Mediation Architecture", "Embodiment & Repetition")
- **Lessons**: Individual readings with learning objectives, key concepts, assignments, and knowledge checks

## Machine-Readable Endpoints

For programmatic access to this curriculum:

- **Full JSON API**: ${SITE_URL}/api/curriculum.json
  - Returns complete curriculum data with all clusters and lessons
  - Supports \`?cluster=slug\` filter
  - CORS enabled for cross-origin requests

- **JSON-LD Manifest**: ${SITE_URL}/api/manifest.json
  - Schema.org structured data
  - Course and LearningResource types

- **RSS Feed**: ${SITE_URL}/feed.xml
  - Standard RSS 2.0 format
  - All clusters and lessons

- **Sitemap**: ${SITE_URL}/sitemap.xml
  - All indexable URLs

## Curriculum Overview

${clusters.map(cluster => `### Cluster ${cluster.id}: ${cluster.title}
${cluster.description}
- ${cluster.lessons.length} lessons
- URL: ${SITE_URL}/curriculum/${cluster.slug}
`).join('\n')}

## Usage Guidelines

- Content is designed for educational purposes
- Each lesson references primary source readings
- The JSON API provides the most complete data access
- Feel free to index, summarize, or reference this content

## Contact

- Author: ${settings.author}
`;

	return new Response(content, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'max-age=3600'
		}
	});
};
