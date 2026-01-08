#!/usr/bin/env node

/**
 * Sync Content to Notion
 *
 * This script reads all curriculum content from the content/ folder
 * and creates/populates Notion databases with it.
 *
 * Usage:
 *   1. Create a Notion integration at https://www.notion.so/my-integrations
 *   2. Create a parent page in Notion and share it with your integration
 *   3. Set environment variables:
 *      - NOTION_TOKEN: Your integration token
 *      - NOTION_PARENT_PAGE: The page ID where databases will be created
 *   4. Run: node scripts/sync-to-notion.js
 *
 * This will create:
 *   - A "Clusters" database with all clusters
 *   - A "Lessons" database with all lessons (linked to clusters)
 *   - A "Pages" database with home/about pages
 *   - A "Settings" page with site configuration
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Check for required environment variables
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_PARENT_PAGE = process.env.NOTION_PARENT_PAGE;

if (!NOTION_TOKEN || !NOTION_PARENT_PAGE) {
	console.error('Missing required environment variables:');
	if (!NOTION_TOKEN) console.error('  - NOTION_TOKEN');
	if (!NOTION_PARENT_PAGE) console.error('  - NOTION_PARENT_PAGE');
	console.error('\nSee script comments for setup instructions.');
	process.exit(1);
}

// Notion API helpers
const NOTION_API = 'https://api.notion.com/v1';
const headers = {
	'Authorization': `Bearer ${NOTION_TOKEN}`,
	'Notion-Version': '2022-06-28',
	'Content-Type': 'application/json'
};

/**
 * Make a request to the Notion API
 */
async function notionRequest(endpoint, method = 'GET', body = null) {
	const options = { method, headers };
	if (body) options.body = JSON.stringify(body);

	const response = await fetch(`${NOTION_API}${endpoint}`, options);
	const data = await response.json();

	if (!response.ok) {
		throw new Error(`Notion API error: ${data.message || JSON.stringify(data)}`);
	}

	return data;
}

/**
 * Convert markdown text to Notion rich text blocks
 */
function markdownToRichText(text) {
	if (!text) return [];

	// Simple conversion - just plain text for now
	// Could be enhanced with bold, italic, etc.
	return [{
		type: 'text',
		text: { content: text.substring(0, 2000) } // Notion has 2000 char limit per block
	}];
}

/**
 * Convert markdown to Notion blocks (for page content)
 */
function markdownToBlocks(markdown) {
	if (!markdown) return [];

	const blocks = [];
	const lines = markdown.split('\n');
	let currentParagraph = [];

	for (const line of lines) {
		// Heading 1
		if (line.startsWith('# ')) {
			if (currentParagraph.length) {
				blocks.push({
					object: 'block',
					type: 'paragraph',
					paragraph: { rich_text: markdownToRichText(currentParagraph.join('\n')) }
				});
				currentParagraph = [];
			}
			blocks.push({
				object: 'block',
				type: 'heading_1',
				heading_1: { rich_text: markdownToRichText(line.substring(2)) }
			});
		}
		// Heading 2
		else if (line.startsWith('## ')) {
			if (currentParagraph.length) {
				blocks.push({
					object: 'block',
					type: 'paragraph',
					paragraph: { rich_text: markdownToRichText(currentParagraph.join('\n')) }
				});
				currentParagraph = [];
			}
			blocks.push({
				object: 'block',
				type: 'heading_2',
				heading_2: { rich_text: markdownToRichText(line.substring(3)) }
			});
		}
		// Heading 3
		else if (line.startsWith('### ')) {
			if (currentParagraph.length) {
				blocks.push({
					object: 'block',
					type: 'paragraph',
					paragraph: { rich_text: markdownToRichText(currentParagraph.join('\n')) }
				});
				currentParagraph = [];
			}
			blocks.push({
				object: 'block',
				type: 'heading_3',
				heading_3: { rich_text: markdownToRichText(line.substring(4)) }
			});
		}
		// Bullet list
		else if (line.startsWith('- ') || line.startsWith('* ')) {
			if (currentParagraph.length) {
				blocks.push({
					object: 'block',
					type: 'paragraph',
					paragraph: { rich_text: markdownToRichText(currentParagraph.join('\n')) }
				});
				currentParagraph = [];
			}
			blocks.push({
				object: 'block',
				type: 'bulleted_list_item',
				bulleted_list_item: { rich_text: markdownToRichText(line.substring(2)) }
			});
		}
		// Empty line - end paragraph
		else if (line.trim() === '') {
			if (currentParagraph.length) {
				blocks.push({
					object: 'block',
					type: 'paragraph',
					paragraph: { rich_text: markdownToRichText(currentParagraph.join('\n')) }
				});
				currentParagraph = [];
			}
		}
		// Regular text - accumulate
		else {
			currentParagraph.push(line);
		}
	}

	// Flush remaining paragraph
	if (currentParagraph.length) {
		blocks.push({
			object: 'block',
			type: 'paragraph',
			paragraph: { rich_text: markdownToRichText(currentParagraph.join('\n')) }
		});
	}

	return blocks;
}

/**
 * Read all content from the content directory
 */
function readContent() {
	const content = {
		clusters: [],
		lessons: [],
		pages: [],
		settings: null
	};

	// Read clusters
	const clustersDir = path.join(process.cwd(), 'content', 'clusters');
	if (fs.existsSync(clustersDir)) {
		for (const file of fs.readdirSync(clustersDir).filter(f => f.endsWith('.md'))) {
			const raw = fs.readFileSync(path.join(clustersDir, file), 'utf-8');
			const { data, content: body } = matter(raw);
			content.clusters.push({ ...data, body, _file: file });
		}
		content.clusters.sort((a, b) => (a.order || 0) - (b.order || 0));
	}

	// Read lessons
	const lessonsDir = path.join(process.cwd(), 'content', 'lessons');
	if (fs.existsSync(lessonsDir)) {
		for (const file of fs.readdirSync(lessonsDir).filter(f => f.endsWith('.md'))) {
			const raw = fs.readFileSync(path.join(lessonsDir, file), 'utf-8');
			const { data, content: body } = matter(raw);
			content.lessons.push({ ...data, body, _file: file });
		}
		content.lessons.sort((a, b) => {
			if (a.cluster !== b.cluster) return a.cluster.localeCompare(b.cluster);
			return (a.order || 0) - (b.order || 0);
		});
	}

	// Read pages
	const pagesDir = path.join(process.cwd(), 'content', 'pages');
	if (fs.existsSync(pagesDir)) {
		for (const file of fs.readdirSync(pagesDir).filter(f => f.endsWith('.md'))) {
			const raw = fs.readFileSync(path.join(pagesDir, file), 'utf-8');
			const { data, content: body } = matter(raw);
			const slug = file.replace('.md', '');
			content.pages.push({ ...data, body, slug, _file: file });
		}
	}

	// Read settings
	const settingsFile = path.join(process.cwd(), 'content', 'settings', 'site.json');
	if (fs.existsSync(settingsFile)) {
		content.settings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
	}

	return content;
}

/**
 * Create the Clusters database
 */
async function createClustersDatabase(parentPageId) {
	console.log('Creating Clusters database...');

	const database = await notionRequest('/databases', 'POST', {
		parent: { type: 'page_id', page_id: parentPageId },
		title: [{ type: 'text', text: { content: 'Clusters' } }],
		properties: {
			Title: { title: {} },
			Slug: { rich_text: {} },
			Order: { number: {} },
			Description: { rich_text: {} }
		}
	});

	console.log(`  Created: ${database.id}`);
	return database.id;
}

/**
 * Create the Lessons database
 */
async function createLessonsDatabase(parentPageId, clustersDbId) {
	console.log('Creating Lessons database...');

	const database = await notionRequest('/databases', 'POST', {
		parent: { type: 'page_id', page_id: parentPageId },
		title: [{ type: 'text', text: { content: 'Lessons' } }],
		properties: {
			Title: { title: {} },
			Slug: { rich_text: {} },
			Cluster: { relation: { database_id: clustersDbId, single_property: {} } },
			Order: { number: {} },
			Author: { rich_text: {} },
			Description: { rich_text: {} }
		}
	});

	console.log(`  Created: ${database.id}`);
	return database.id;
}

/**
 * Create the Pages database
 */
async function createPagesDatabase(parentPageId) {
	console.log('Creating Pages database...');

	const database = await notionRequest('/databases', 'POST', {
		parent: { type: 'page_id', page_id: parentPageId },
		title: [{ type: 'text', text: { content: 'Pages' } }],
		properties: {
			Title: { title: {} },
			Slug: { rich_text: {} },
			Subtitle: { rich_text: {} },
			Tagline: { rich_text: {} },
			'CTA Text': { rich_text: {} }
		}
	});

	console.log(`  Created: ${database.id}`);
	return database.id;
}

/**
 * Populate clusters database
 */
async function populateClusters(databaseId, clusters) {
	console.log(`Populating ${clusters.length} clusters...`);
	const clusterPageIds = new Map(); // slug -> page_id

	for (const cluster of clusters) {
		const page = await notionRequest('/pages', 'POST', {
			parent: { database_id: databaseId },
			properties: {
				Title: { title: [{ text: { content: cluster.title || '' } }] },
				Slug: { rich_text: [{ text: { content: cluster.slug || '' } }] },
				Order: { number: cluster.order || 0 },
				Description: { rich_text: [{ text: { content: cluster.description || '' } }] }
			},
			children: markdownToBlocks(cluster.body)
		});

		clusterPageIds.set(cluster.slug, page.id);
		console.log(`  ✓ ${cluster.title}`);
	}

	return clusterPageIds;
}

/**
 * Populate lessons database
 */
async function populateLessons(databaseId, lessons, clusterPageIds) {
	console.log(`Populating ${lessons.length} lessons...`);

	for (const lesson of lessons) {
		const clusterPageId = clusterPageIds.get(lesson.cluster);

		const properties = {
			Title: { title: [{ text: { content: lesson.title || '' } }] },
			Slug: { rich_text: [{ text: { content: lesson.slug || '' } }] },
			Order: { number: lesson.order || 0 },
			Author: { rich_text: [{ text: { content: lesson.author || '' } }] },
			Description: { rich_text: [{ text: { content: lesson.description || '' } }] }
		};

		// Add cluster relation if we have the page ID
		if (clusterPageId) {
			properties.Cluster = { relation: [{ id: clusterPageId }] };
		}

		// Build page content from various fields
		let pageContent = lesson.body || '';

		// Add objectives
		if (lesson.objectives?.length) {
			pageContent += '\n\n## Learning Objectives\n';
			pageContent += lesson.objectives.map(o => `- ${o}`).join('\n');
		}

		// Add key concepts
		if (lesson.key_concepts?.length) {
			pageContent += '\n\n## Key Concepts\n';
			for (const concept of lesson.key_concepts) {
				pageContent += `\n### ${concept.name}\n${concept.explanation}\n`;
			}
		}

		// Add assignment
		if (lesson.assignment) {
			pageContent += '\n\n## Assignment\n';
			pageContent += lesson.assignment.instructions || '';
			if (lesson.assignment.url) {
				pageContent += `\n\nReading: ${lesson.assignment.reading_title || lesson.assignment.url}`;
				pageContent += `\nURL: ${lesson.assignment.url}`;
			}
		}

		// Add knowledge check
		if (lesson.knowledge_check?.length) {
			pageContent += '\n\n## Knowledge Check\n';
			for (const q of lesson.knowledge_check) {
				pageContent += `\n- ${q.question}`;
				if (q.hint) pageContent += `\n  - Hint: ${q.hint}`;
			}
		}

		// Add additional resources
		if (lesson.additional_resources?.length) {
			pageContent += '\n\n## Additional Resources\n';
			for (const r of lesson.additional_resources) {
				pageContent += `\n- **${r.title}**`;
				if (r.author) pageContent += ` by ${r.author}`;
				if (r.description) pageContent += `\n  ${r.description}`;
				if (r.url) pageContent += `\n  ${r.url}`;
			}
		}

		await notionRequest('/pages', 'POST', {
			parent: { database_id: databaseId },
			properties,
			children: markdownToBlocks(pageContent)
		});

		console.log(`  ✓ ${lesson.title}`);
	}
}

/**
 * Populate pages database
 */
async function populatePages(databaseId, pages) {
	console.log(`Populating ${pages.length} pages...`);

	for (const page of pages) {
		await notionRequest('/pages', 'POST', {
			parent: { database_id: databaseId },
			properties: {
				Title: { title: [{ text: { content: page.title || '' } }] },
				Slug: { rich_text: [{ text: { content: page.slug || '' } }] },
				Subtitle: { rich_text: [{ text: { content: page.subtitle || '' } }] },
				Tagline: { rich_text: [{ text: { content: page.tagline || '' } }] },
				'CTA Text': { rich_text: [{ text: { content: page.cta_text || '' } }] }
			},
			children: markdownToBlocks(page.body)
		});

		console.log(`  ✓ ${page.title}`);
	}
}

/**
 * Create settings page
 */
async function createSettingsPage(parentPageId, settings) {
	if (!settings) return;

	console.log('Creating Settings page...');

	const content = `# Site Settings

**Title:** ${settings.title || ''}
**Description:** ${settings.description || ''}
**Author:** ${settings.author || ''}
**Author URL:** ${settings.substack_url || ''}
**Footer Text:** ${settings.footer_text || ''}`;

	await notionRequest('/pages', 'POST', {
		parent: { type: 'page_id', page_id: parentPageId },
		properties: {
			title: { title: [{ text: { content: 'Site Settings' } }] }
		},
		children: markdownToBlocks(content)
	});

	console.log('  ✓ Settings page created');
}

/**
 * Main sync function
 */
async function syncToNotion() {
	console.log('╔════════════════════════════════════════╗');
	console.log('║     Sync Content to Notion             ║');
	console.log('╚════════════════════════════════════════╝\n');

	// Read all content
	console.log('Reading content from files...\n');
	const content = readContent();

	console.log(`Found:`);
	console.log(`  - ${content.clusters.length} clusters`);
	console.log(`  - ${content.lessons.length} lessons`);
	console.log(`  - ${content.pages.length} pages`);
	console.log(`  - Settings: ${content.settings ? 'yes' : 'no'}\n`);

	// Create databases
	console.log('Creating Notion databases...\n');
	const clustersDbId = await createClustersDatabase(NOTION_PARENT_PAGE);
	const lessonsDbId = await createLessonsDatabase(NOTION_PARENT_PAGE, clustersDbId);
	const pagesDbId = await createPagesDatabase(NOTION_PARENT_PAGE);

	console.log('');

	// Populate content
	console.log('Populating content...\n');
	const clusterPageIds = await populateClusters(clustersDbId, content.clusters);
	await populateLessons(lessonsDbId, content.lessons, clusterPageIds);
	await populatePages(pagesDbId, content.pages);
	await createSettingsPage(NOTION_PARENT_PAGE, content.settings);

	console.log('\n╔════════════════════════════════════════╗');
	console.log('║     Sync Complete!                     ║');
	console.log('╚════════════════════════════════════════╝\n');

	console.log('Database IDs (save these for your .env):');
	console.log(`  NOTION_CLUSTERS_DB=${clustersDbId}`);
	console.log(`  NOTION_LESSONS_DB=${lessonsDbId}`);
	console.log(`  NOTION_PAGES_DB=${pagesDbId}`);
	console.log('');
	console.log('Next steps:');
	console.log('  1. Set CMS_PROVIDER=notion in your environment');
	console.log('  2. Add the database IDs above to your environment');
	console.log('  3. Redeploy your site');
}

// Run
syncToNotion().catch(err => {
	console.error('Sync failed:', err.message);
	process.exit(1);
});
