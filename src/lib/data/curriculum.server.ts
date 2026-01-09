import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { Cluster, Lesson, HomePage, AboutPage } from './curriculum';

/**
 * Validates that a value is a non-empty string
 */
function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates and coerces a value to an integer
 */
function toValidInteger(value: unknown): number | null {
	if (typeof value === 'number' && Number.isInteger(value)) {
		return value;
	}
	if (typeof value === 'string') {
		const parsed = parseInt(value, 10);
		if (!isNaN(parsed) && Number.isInteger(parsed)) {
			return parsed;
		}
	}
	return null;
}

/**
 * Get all markdown content files from a directory
 */
function getContentFiles(dir: string): string[] {
	return fs.readdirSync(dir).filter((f: string) => f.endsWith('.md'));
}

/**
 * Load and parse all clusters from markdown files (server-side only)
 */
export function loadClusters(): Cluster[] {
	const clustersDir = path.join(process.cwd(), 'content', 'clusters');
	const clustersData: Cluster[] = [];
	const seenOrders = new Set<number>();
	const errors: string[] = [];

	if (!fs.existsSync(clustersDir)) {
		console.warn(`Clusters directory not found: ${clustersDir}`);
		return [];
	}

	const files = getContentFiles(clustersDir);

	for (const file of files) {
		const filepath = path.join(clustersDir, file);

		// Parse frontmatter with error handling
		let data: Record<string, unknown>;
		let body: string;

		try {
			const content = fs.readFileSync(filepath, 'utf-8');
			const parsed = matter(content);
			data = parsed.data;
			body = parsed.content;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			errors.push(`Failed to parse frontmatter in ${filepath}: ${message}`);
			continue;
		}

		// Validate required fields
		const missingFields: string[] = [];

		if (!isNonEmptyString(data.title)) {
			missingFields.push('title (string)');
		}
		if (!isNonEmptyString(data.slug)) {
			missingFields.push('slug (string)');
		}
		if (!isNonEmptyString(data.description)) {
			missingFields.push('description (string)');
		}

		const order = toValidInteger(data.order);
		if (order === null) {
			missingFields.push('order (integer)');
		}

		if (missingFields.length > 0) {
			errors.push(`Invalid cluster ${filepath}: missing or invalid fields: ${missingFields.join(', ')}`);
			continue;
		}

		// Check for duplicate order values
		if (seenOrders.has(order!)) {
			errors.push(`Duplicate cluster order ${order} in ${filepath}. Each cluster must have a unique order value.`);
			continue;
		}
		seenOrders.add(order!);

		// Handle overview/body - trim and convert empty to undefined
		const overview = body?.trim() || undefined;

		clustersData.push({
			id: order!,
			title: data.title as string,
			slug: data.slug as string,
			description: data.description as string,
			overview,
			lessons: []
		});
	}

	// If there were any errors, throw with all of them
	if (errors.length > 0) {
		throw new Error(`Cluster validation errors:\n${errors.map(e => `  - ${e}`).join('\n')}`);
	}

	// Sort clusters by order
	clustersData.sort((a, b) => a.id - b.id);

	return clustersData;
}

/**
 * Load and parse all lessons, associating them with clusters (server-side only)
 */
export function loadLessons(clusters: Cluster[]): void {
	const lessonsDir = path.join(process.cwd(), 'content', 'lessons');
	const clusterMap = new Map(clusters.map(c => [c.slug, c]));
	const errors: string[] = [];
	const orphanedLessons: string[] = [];

	if (!fs.existsSync(lessonsDir)) {
		console.warn(`Lessons directory not found: ${lessonsDir}`);
		return;
	}

	const files = getContentFiles(lessonsDir);

	for (const file of files) {
		const filepath = path.join(lessonsDir, file);

		// Parse frontmatter with error handling
		let data: Record<string, unknown>;

		try {
			const content = fs.readFileSync(filepath, 'utf-8');
			const parsed = matter(content);
			data = parsed.data;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			errors.push(`Failed to parse frontmatter in ${filepath}: ${message}`);
			continue;
		}

		// Validate required fields
		const missingFields: string[] = [];

		if (!isNonEmptyString(data.title)) {
			missingFields.push('title (string)');
		}
		if (!isNonEmptyString(data.slug)) {
			missingFields.push('slug (string)');
		}
		if (!isNonEmptyString(data.cluster)) {
			missingFields.push('cluster (string)');
		}
		if (!isNonEmptyString(data.description)) {
			missingFields.push('description (string)');
		}

		const order = toValidInteger(data.order);
		if (order === null) {
			missingFields.push('order (integer)');
		}

		if (missingFields.length > 0) {
			errors.push(`Invalid lesson ${filepath}: missing or invalid fields: ${missingFields.join(', ')}`);
			continue;
		}

		// Verify cluster exists
		const cluster = clusterMap.get(data.cluster as string);
		if (!cluster) {
			orphanedLessons.push(`${filepath} (references non-existent cluster: "${data.cluster}")`);
			continue;
		}

		// Add valid lesson to cluster
		cluster.lessons.push({
			id: `${cluster.id}-${order}`,
			title: data.title as string,
			slug: data.slug as string,
			author: isNonEmptyString(data.author) ? data.author : undefined,
			description: data.description as string,
			order: order!
		});
	}

	// Collect all errors
	const allErrors: string[] = [...errors];

	if (orphanedLessons.length > 0) {
		allErrors.push(`Orphaned lessons (cluster not found):\n${orphanedLessons.map(l => `    - ${l}`).join('\n')}`);
	}

	// If there were any errors, throw with all of them
	if (allErrors.length > 0) {
		throw new Error(`Lesson validation errors:\n${allErrors.map(e => `  - ${e}`).join('\n')}`);
	}

	// Sort lessons within each cluster by order
	for (const cluster of clusters) {
		cluster.lessons.sort((a, b) => a.order - b.order);
	}
}

/**
 * Load the complete curriculum data (server-side only)
 */
export function loadCurriculum(): Cluster[] {
	const clusters = loadClusters();
	loadLessons(clusters);
	return clusters;
}

// ============================================
// Page Loaders
// ============================================

/**
 * Load home page content from CMS
 */
export function loadHomePage(): HomePage {
	const pagesDir = path.join(process.cwd(), 'content', 'pages');
	const homePath = path.join(pagesDir, 'home.md');

	const defaults: HomePage = {
		title: 'Curriculum Template',
		tagline: 'A self-directed research curriculum.',
		cta_text: 'Begin Reading',
		body: ''
	};

	try {
		if (!fs.existsSync(homePath)) {
			return defaults;
		}

		const fileContent = fs.readFileSync(homePath, 'utf-8');
		const { data, content } = matter(fileContent);

		return {
			title: isNonEmptyString(data.title) ? data.title : defaults.title,
			tagline: isNonEmptyString(data.tagline) ? data.tagline : defaults.tagline,
			cta_text: isNonEmptyString(data.cta_text) ? data.cta_text : defaults.cta_text,
			body: content.trim()
		};
	} catch (e) {
		console.error('Error loading home content:', e);
		return defaults;
	}
}

/**
 * Load about page content from CMS
 */
export async function loadAboutPage(): Promise<AboutPage> {
	const pagesDir = path.join(process.cwd(), 'content', 'pages');
	const aboutPath = path.join(pagesDir, 'about.md');

	const defaults: AboutPage = {
		title: 'About',
		subtitle: '',
		body: ''
	};

	try {
		if (!fs.existsSync(aboutPath)) {
			return defaults;
		}

		const fileContent = fs.readFileSync(aboutPath, 'utf-8');
		const { data, content } = matter(fileContent);

		// Convert markdown body to HTML
		const bodyHtml = content.trim() ? await marked(content.trim()) : '';

		return {
			title: isNonEmptyString(data.title) ? data.title : defaults.title,
			subtitle: isNonEmptyString(data.subtitle) ? data.subtitle : defaults.subtitle,
			body: bodyHtml
		};
	} catch (e) {
		console.error('Error loading about content:', e);
		return defaults;
	}
}

// ============================================
// Full Lesson Loader
// ============================================

/**
 * Parse markdown string to HTML (sync version for simple strings)
 */
function parseMarkdown(content: string): string {
	if (!content) return '';
	return marked.parse(content, { async: false }) as string;
}

/**
 * Load a complete lesson with all fields for the lesson detail page
 */
export async function loadFullLesson(clusterSlug: string, lessonSlug: string): Promise<{ lesson: Lesson | null; hasContent: boolean }> {
	const lessonsDir = path.join(process.cwd(), 'content', 'lessons');

	if (!fs.existsSync(lessonsDir)) {
		return { lesson: null, hasContent: false };
	}

	const files = getContentFiles(lessonsDir);

	for (const file of files) {
		const filepath = path.join(lessonsDir, file);

		try {
			const fileContent = fs.readFileSync(filepath, 'utf-8');
			const { data, content } = matter(fileContent);

			// Check if this is the lesson we're looking for
			if (data.cluster === clusterSlug && data.slug === lessonSlug) {
				// Validate required fields before constructing Lesson
				if (!isNonEmptyString(data.title)) {
					console.warn(`Lesson ${filepath}: missing or invalid title`);
					continue;
				}
				if (!isNonEmptyString(data.slug)) {
					console.warn(`Lesson ${filepath}: missing or invalid slug`);
					continue;
				}
				if (!isNonEmptyString(data.cluster)) {
					console.warn(`Lesson ${filepath}: missing or invalid cluster`);
					continue;
				}
				if (!isNonEmptyString(data.description)) {
					console.warn(`Lesson ${filepath}: missing or invalid description`);
					continue;
				}
				const order = toValidInteger(data.order);
				if (order === null) {
					console.warn(`Lesson ${filepath}: missing or invalid order`);
					continue;
				}

				// Parse markdown body to HTML
				const bodyHtml = content.trim() ? await marked(content.trim()) : '';

				// Parse markdown in key_concepts explanations (with safe checks)
				let parsedConcepts: Array<{ name: string; explanation: string }> | undefined;
				if (Array.isArray(data.key_concepts)) {
					parsedConcepts = data.key_concepts
						.filter((concept): concept is { name: string; explanation: string } =>
							concept &&
							typeof concept === 'object' &&
							isNonEmptyString(concept.name) &&
							typeof concept.explanation === 'string'
						)
						.map((concept) => ({
							...concept,
							explanation: parseMarkdown(concept.explanation)
						}));
				}

				// Parse markdown in assignment instructions (with safe checks)
				let parsedAssignment: { instructions: string; url?: string; reading_title?: string } | undefined;
				if (data.assignment && typeof data.assignment === 'object' && typeof data.assignment.instructions === 'string') {
					parsedAssignment = {
						...data.assignment,
						instructions: parseMarkdown(data.assignment.instructions)
					};
				}

				// Parse markdown in callouts content (with safe checks)
				const validCalloutTypes = ['ask', 'example', 'hint', 'important', 'question', 'when'] as const;
				type CalloutType = typeof validCalloutTypes[number];

				let parsedCallouts: Array<{ type: CalloutType; title?: string; content: string }> | undefined;
				if (Array.isArray(data.callouts)) {
					parsedCallouts = data.callouts
						.filter((callout): callout is { type: string; title?: string; content: string } =>
							callout &&
							typeof callout === 'object' &&
							isNonEmptyString(callout.type) &&
							validCalloutTypes.includes(callout.type as CalloutType) &&
							typeof callout.content === 'string'
						)
						.slice(0, 5) // Enforce max 5 callouts
						.map((callout) => ({
							type: callout.type as CalloutType,
							title: isNonEmptyString(callout.title) ? callout.title : undefined,
							content: parseMarkdown(callout.content)
						}));
				}

				const lesson: Lesson = {
					id: `${data.cluster}-${order}`,
					title: data.title,
					slug: data.slug,
					cluster: data.cluster,
					order: order,
					description: data.description,
					author: isNonEmptyString(data.author) ? data.author : undefined,
					featured_image: isNonEmptyString(data.featured_image) ? data.featured_image : undefined,
					objectives: Array.isArray(data.objectives) ? data.objectives : undefined,
					key_concepts: parsedConcepts,
					assignment: parsedAssignment,
					knowledge_check: Array.isArray(data.knowledge_check) ? data.knowledge_check : undefined,
					additional_resources: Array.isArray(data.additional_resources) ? data.additional_resources : undefined,
					callouts: parsedCallouts,
					content: bodyHtml,
					hidden_sections: Array.isArray(data.hidden_sections) ? data.hidden_sections : undefined
				};

				return { lesson, hasContent: !!bodyHtml };
			}
		} catch (e) {
			console.error(`Error parsing lesson file ${filepath}:`, e);
			continue;
		}
	}

	return { lesson: null, hasContent: false };
}
