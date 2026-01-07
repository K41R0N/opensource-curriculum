import type { PageServerLoad } from './$types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getLocaleFromParams, DEFAULT_LOCALE, type Locale } from '$lib/i18n';

/**
 * Get all content files for a locale from a directory
 */
function getLocalizedFiles(dir: string, locale: Locale): string[] {
	const allFiles = fs.readdirSync(dir).filter((f: string) => f.endsWith('.md'));

	if (locale === DEFAULT_LOCALE) {
		return allFiles.filter((f: string) => !f.match(/\.[a-z]{2}(-[A-Z]{2})?\.md$/));
	}

	const defaultFiles = allFiles.filter((f: string) => !f.match(/\.[a-z]{2}(-[A-Z]{2})?\.md$/));
	const localizedFiles = allFiles.filter((f: string) => f.endsWith(`.${locale}.md`));

	return defaultFiles.map((defaultFile: string) => {
		const ext = path.extname(defaultFile);
		const base = defaultFile.slice(0, -ext.length);
		const localizedFile = `${base}.${locale}${ext}`;
		return localizedFiles.includes(localizedFile) ? localizedFile : defaultFile;
	});
}

export const load: PageServerLoad = async ({ params }) => {
	const { cluster, lesson } = params;
	const locale = getLocaleFromParams(params);

	// Search through all lesson files to find one matching the cluster and slug
	const contentDir = path.join(process.cwd(), 'content', 'lessons');

	try {
		if (!fs.existsSync(contentDir)) {
			return { lesson: null, hasContent: false };
		}

		const files = getLocalizedFiles(contentDir, locale);

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
