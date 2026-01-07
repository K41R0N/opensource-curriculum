import type { PageServerLoad } from './$types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { loadSiteSettings } from '$lib/config';

export const load: PageServerLoad = async () => {
	// Load home page content
	const pagesDir = path.join(process.cwd(), 'content', 'pages');
	const homePath = path.join(pagesDir, 'home.md');

	let homeContent = {
		title: 'Curriculum Template',
		tagline: 'A self-directed research curriculum.',
		cta_text: 'Begin Reading',
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
	const siteSettings = loadSiteSettings();

	return {
		home: homeContent,
		settings: siteSettings
	};
};
