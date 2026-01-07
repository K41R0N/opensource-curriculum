import type { PageServerLoad } from './$types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Get all markdown content files from a directory
 * Excludes any files with locale suffixes (e.g., *.es-CO.md)
 */
function getContentFiles(dir: string): string[] {
	const allFiles = fs.readdirSync(dir).filter((f: string) => f.endsWith('.md'));
	return allFiles.filter((f: string) => !f.match(/\.[a-z]{2}(-[A-Z]{2})?\.md$/));
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
				return {
					lesson: {
						...data,
						content
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
