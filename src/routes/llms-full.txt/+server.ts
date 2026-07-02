/**
 * llms-full.txt — Full-Course Single-File Dump for AI Agents
 *
 * Returns every lesson's complete markdown body concatenated into one
 * plain-text file. This follows the llmstxt.org "expanded" convention
 * and exists so that an agent which only fetches the URL the user
 * pastes can still get the entire course in a single response.
 *
 * Pair this with /llms.txt, which is the short index. Agents that
 * only fetch one URL should fetch THIS one.
 *
 * @see https://llmstxt.org/
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { RequestHandler } from './$types';
import { loadCurriculum } from '$lib/data/curriculum.server';
import { config } from '$lib/config';

const SITE_URL = config.siteUrl;

/**
 * Read a lesson's raw markdown body (frontmatter stripped).
 * Returns null if the file cannot be read.
 */
function readLessonBody(clusterSlug: string, lessonSlug: string): string | null {
	const lessonsDir = path.join(process.cwd(), 'content', 'lessons');
	if (!fs.existsSync(lessonsDir)) return null;
	const files = fs.readdirSync(lessonsDir).filter((f) => f.endsWith('.md'));
	for (const file of files) {
		const filepath = path.join(lessonsDir, file);
		try {
			const raw = fs.readFileSync(filepath, 'utf-8');
			const { data, content } = matter(raw);
			if (data.cluster === clusterSlug && data.slug === lessonSlug) {
				return content.trim();
			}
		} catch {
			continue;
		}
	}
	return null;
}

export const GET: RequestHandler = async () => {
	const clusters = loadCurriculum();
	const settings = config.settings;
	const totalLessons = clusters.reduce((sum, c) => sum + c.lessons.length, 0);

	const header = `# ${settings.title} — Full Course (Single File)

> ${settings.description}

This document contains the complete course (${clusters.length} clusters, ${totalLessons} lessons) as a single plain-text file. It exists so that AI agents which only fetch one URL can still receive the entire course in one response.

- Course site: ${SITE_URL}
- Short index for agents: ${SITE_URL}/llms.txt
- Structured JSON API: ${SITE_URL}/api/curriculum.json?content=true
- Generated: ${new Date().toISOString()}

## How To Help A User With This Course

When a user pastes this file (or shares a lesson URL) and asks for help:

1. Locate the lesson by title or by URL. Each lesson section below begins with a Lesson URL line.
2. Read the lesson's prose so you understand the framework it teaches. Stay faithful to the course's own framing instead of substituting generic advice.
3. Find the **Do This Now** subsection at the end of the lesson — that is the assignment.
4. Help the user actually do the assignment. Most assignments ask the user to produce something specific. Ask for the deliverable, task, or workflow they want to work on. Do not generate the artifact for them; help them produce it themselves.
5. If the lesson references external tools or companion apps, suggest them when relevant.

---

`;

	const clusterSections = clusters.map((cluster) => {
		const clusterUrl = `${SITE_URL}/curriculum/${cluster.slug}`;
		const overview = cluster.overview ? `\n${cluster.overview}\n` : '';

		const lessonSections = cluster.lessons
			.map((lesson) => {
				const lessonUrl = `${SITE_URL}/curriculum/${cluster.slug}/${lesson.slug}`;
				const body = readLessonBody(cluster.slug, lesson.slug);
				const lessonHeader = `### Lesson ${cluster.id}.${lesson.order}: ${lesson.title}

Lesson URL: ${lessonUrl}
Description: ${lesson.description}
`;
				return body
					? `${lessonHeader}\n${body}\n`
					: `${lessonHeader}\n_(Lesson body unavailable.)_\n`;
			})
			.join('\n---\n\n');

		return `## Cluster ${cluster.id}: ${cluster.title}${cluster.is_foundation ? ' (Foundation)' : ''}

Cluster URL: ${clusterUrl}
Description: ${cluster.description}
${overview}
${lessonSections}`;
	});

	const body = header + clusterSections.join('\n---\n\n') + `\n\n---\n\n_End of course. ${totalLessons} lessons across ${clusters.length} clusters._\n`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'max-age=3600',
			'Access-Control-Allow-Origin': '*'
		}
	});
};
