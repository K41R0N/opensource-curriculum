import type { PageServerLoad } from './$types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export const load: PageServerLoad = async () => {
	const pagesDir = path.join(process.cwd(), 'content', 'pages');
	const aboutPath = path.join(pagesDir, 'about.md');

	let aboutContent = {
		title: 'About',
		subtitle: '',
		body: ''
	};

	try {
		if (fs.existsSync(aboutPath)) {
			const fileContent = fs.readFileSync(aboutPath, 'utf-8');
			const { data, content } = matter(fileContent);

			// Convert markdown body to HTML
			const bodyHtml = content.trim() ? await marked(content.trim()) : '';

			aboutContent = {
				title: data.title || aboutContent.title,
				subtitle: data.subtitle || aboutContent.subtitle,
				body: bodyHtml
			};
		}
	} catch (e) {
		console.error('Error loading about content:', e);
	}

	return {
		about: aboutContent
	};
};
