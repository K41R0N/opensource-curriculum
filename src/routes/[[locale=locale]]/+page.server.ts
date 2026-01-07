import type { PageServerLoad } from './$types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { loadSiteSettings } from '$lib/config';
import { getLocaleFromParams, DEFAULT_LOCALE, type Locale } from '$lib/i18n';

/**
 * Get the localized file path for a page
 */
function getLocalizedPagePath(basePath: string, locale: Locale): string {
	if (locale === DEFAULT_LOCALE) {
		return basePath;
	}

	const ext = path.extname(basePath);
	const base = basePath.slice(0, -ext.length);
	const localizedPath = `${base}.${locale}${ext}`;

	return fs.existsSync(localizedPath) ? localizedPath : basePath;
}

export const load: PageServerLoad = async ({ params }) => {
	const locale = getLocaleFromParams(params);

	// Load home page content
	const pagesDir = path.join(process.cwd(), 'content', 'pages');
	const homePath = getLocalizedPagePath(path.join(pagesDir, 'home.md'), locale);

	let homeContent = {
		title: locale === 'es-CO' ? 'El Currículo de Dispositivos' : 'The Devices Curriculum',
		tagline: locale === 'es-CO'
			? 'Un currículo de investigación autodirigido.'
			: 'A self-directed research curriculum.',
		cta_text: locale === 'es-CO' ? 'Comenzar a Leer' : 'Begin Reading',
		body: ''
	};

	try {
		if (fs.existsSync(homePath)) {
			const fileContent = fs.readFileSync(homePath, 'utf-8');
			const { data, content } = matter(fileContent);
			homeContent = {
				title: data.title || homeContent.title,
				tagline: data.tagline || homeContent.tagline,
				cta_text: data.cta_text || homeContent.cta_text,
				body: content.trim()
			};
		}
	} catch (e) {
		console.error('Error loading home content:', e);
	}

	// Load site settings
	const siteSettings = loadSiteSettings(locale);

	return {
		home: homeContent,
		settings: siteSettings
	};
};
