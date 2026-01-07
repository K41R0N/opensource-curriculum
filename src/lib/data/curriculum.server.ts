import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Cluster, Lesson } from './curriculum';

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
