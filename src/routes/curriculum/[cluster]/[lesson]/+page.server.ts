import type { PageServerLoad } from './$types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

/**
 * Configure marked for safe HTML output
 */
marked.setOptions({
	gfm: true,
	breaks: false
});

/**
 * Parse markdown content to HTML
 */
function parseMarkdown(content: string): string {
	if (!content) return '';
	return marked.parse(content, { async: false }) as string;
}

/**
 * Get all markdown content files from a directory
 */
function getContentFiles(dir: string): string[] {
	const allFiles = fs.readdirSync(dir).filter((f: string) => f.endsWith('.md'));
	return allFiles;
}

export const load: PageServerLoad = async ({ params }) => {
	const { cluster, lesson } = params;

	// Search through all lesson files to find one matching the cluster and slug
	const contentDir = path.join(process.cwd(), 'content', 'lessons');

	try {
		if (!fs.existsSync(contentDir)) {
			return { lesson: null, hasContent: false };
		}

		const files = getContentFiles(contentDir);

		for (const file of files) {
			const filepath = path.join(contentDir, file);
			const fileContent = fs.readFileSync(filepath, 'utf-8');
			const { data, content } = matter(fileContent);

			// Match by frontmatter cluster and slug fields
			if (data.cluster === cluster && data.slug === lesson) {
				// Parse markdown content to HTML
				const parsedContent = parseMarkdown(content);

				// Parse markdown in key_concepts explanations
				const parsedConcepts = data.key_concepts?.map((concept: { name: string; explanation: string }) => ({
					...concept,
					explanation: parseMarkdown(concept.explanation)
				}));

				// Parse markdown in assignment instructions
				const parsedAssignment = data.assignment ? {
					...data.assignment,
					instructions: parseMarkdown(data.assignment.instructions)
				} : null;

				return {
					lesson: {
						...data,
						content: parsedContent,
						key_concepts: parsedConcepts,
						assignment: parsedAssignment
					},
					hasContent: true
				};
			}
		}
	} catch (e) {
		console.error('Error loading lesson content:', e);
	}

	// Return empty if no content file found
	return {
		lesson: null,
		hasContent: false
	};
};
