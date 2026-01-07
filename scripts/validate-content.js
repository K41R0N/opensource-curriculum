#!/usr/bin/env node

/**
 * Content Validation Script
 *
 * Validates curriculum content files before build to catch errors early.
 * Run manually: node scripts/validate-content.js
 * Runs automatically: npm run build (via prebuild hook)
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Required fields for each content type
const REQUIRED_CLUSTER_FIELDS = ['title', 'slug', 'order', 'description'];
const REQUIRED_LESSON_FIELDS = ['title', 'slug', 'cluster', 'order', 'description'];

// Collect all errors
const errors = [];
const warnings = [];

/**
 * Validate a value is a non-empty string
 */
function isNonEmptyString(value) {
	return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate a value is a valid integer
 */
function isValidInteger(value) {
	if (typeof value === 'number' && Number.isInteger(value)) return true;
	if (typeof value === 'string') {
		const parsed = parseInt(value, 10);
		return !isNaN(parsed) && Number.isInteger(parsed);
	}
	return false;
}

/**
 * Get all markdown files from a directory
 */
function getMarkdownFiles(dir) {
	if (!fs.existsSync(dir)) return [];
	return fs.readdirSync(dir).filter(f => f.endsWith('.md'));
}

/**
 * Validate cluster files
 */
function validateClusters() {
	const dir = path.join(process.cwd(), 'content', 'clusters');
	const files = getMarkdownFiles(dir);
	const clusters = new Map(); // slug -> data
	const orders = new Map(); // order -> filename

	if (files.length === 0) {
		warnings.push('No cluster files found in content/clusters/');
		return clusters;
	}

	for (const file of files) {
		const filepath = path.join(dir, file);

		try {
			const content = fs.readFileSync(filepath, 'utf-8');
			const { data } = matter(content);

			// Check required fields
			for (const field of REQUIRED_CLUSTER_FIELDS) {
				if (field === 'order') {
					if (!isValidInteger(data[field])) {
						errors.push(`${file}: Missing or invalid '${field}' (must be integer)`);
					}
				} else {
					if (!isNonEmptyString(data[field])) {
						errors.push(`${file}: Missing or invalid '${field}' (must be non-empty string)`);
					}
				}
			}

			// Check for duplicate slugs
			if (data.slug) {
				if (clusters.has(data.slug)) {
					errors.push(`${file}: Duplicate slug '${data.slug}' (also in ${clusters.get(data.slug).file})`);
				} else {
					clusters.set(data.slug, { file, data });
				}
			}

			// Check for duplicate orders
			if (isValidInteger(data.order)) {
				const order = parseInt(data.order, 10);
				if (orders.has(order)) {
					errors.push(`${file}: Duplicate order '${order}' (also in ${orders.get(order)})`);
				} else {
					orders.set(order, file);
				}
			}

			// Check slug format
			if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
				warnings.push(`${file}: Slug '${data.slug}' should be lowercase with hyphens only`);
			}

		} catch (err) {
			errors.push(`${file}: Failed to parse - ${err.message}`);
		}
	}

	return clusters;
}

/**
 * Validate lesson files
 */
function validateLessons(validClusterSlugs) {
	const dir = path.join(process.cwd(), 'content', 'lessons');
	const files = getMarkdownFiles(dir);
	const lessonsByCluster = new Map(); // cluster -> Map(order -> filename)

	if (files.length === 0) {
		warnings.push('No lesson files found in content/lessons/');
		return;
	}

	for (const file of files) {
		const filepath = path.join(dir, file);

		try {
			const content = fs.readFileSync(filepath, 'utf-8');
			const { data } = matter(content);

			// Check required fields
			for (const field of REQUIRED_LESSON_FIELDS) {
				if (field === 'order') {
					if (!isValidInteger(data[field])) {
						errors.push(`${file}: Missing or invalid '${field}' (must be integer)`);
					}
				} else {
					if (!isNonEmptyString(data[field])) {
						errors.push(`${file}: Missing or invalid '${field}' (must be non-empty string)`);
					}
				}
			}

			// Check cluster reference exists
			if (data.cluster && !validClusterSlugs.has(data.cluster)) {
				errors.push(`${file}: References non-existent cluster '${data.cluster}'`);
			}

			// Check for duplicate orders within same cluster
			if (data.cluster && isValidInteger(data.order)) {
				const order = parseInt(data.order, 10);
				if (!lessonsByCluster.has(data.cluster)) {
					lessonsByCluster.set(data.cluster, new Map());
				}
				const clusterLessons = lessonsByCluster.get(data.cluster);
				if (clusterLessons.has(order)) {
					errors.push(`${file}: Duplicate order '${order}' in cluster '${data.cluster}' (also in ${clusterLessons.get(order)})`);
				} else {
					clusterLessons.set(order, file);
				}
			}

			// Check slug format
			if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
				warnings.push(`${file}: Slug '${data.slug}' should be lowercase with hyphens only`);
			}

			// Check optional fields have correct types if present
			if (data.objectives && !Array.isArray(data.objectives)) {
				warnings.push(`${file}: 'objectives' should be an array`);
			}
			if (data.key_concepts && !Array.isArray(data.key_concepts)) {
				warnings.push(`${file}: 'key_concepts' should be an array`);
			}
			if (data.knowledge_check && !Array.isArray(data.knowledge_check)) {
				warnings.push(`${file}: 'knowledge_check' should be an array`);
			}
			if (data.additional_resources && !Array.isArray(data.additional_resources)) {
				warnings.push(`${file}: 'additional_resources' should be an array`);
			}

		} catch (err) {
			errors.push(`${file}: Failed to parse - ${err.message}`);
		}
	}
}

/**
 * Validate page files
 */
function validatePages() {
	const dir = path.join(process.cwd(), 'content', 'pages');
	const files = getMarkdownFiles(dir);

	for (const file of files) {
		const filepath = path.join(dir, file);

		try {
			const content = fs.readFileSync(filepath, 'utf-8');
			const { data } = matter(content);

			// Check for title at minimum
			if (!isNonEmptyString(data.title)) {
				errors.push(`${file}: Missing or invalid 'title'`);
			}

		} catch (err) {
			errors.push(`${file}: Failed to parse - ${err.message}`);
		}
	}
}

/**
 * Validate settings files
 */
function validateSettings() {
	const settingsFile = path.join(process.cwd(), 'content', 'settings', 'site.json');

	if (!fs.existsSync(settingsFile)) {
		errors.push('content/settings/site.json: File not found');
		return;
	}

	try {
		const content = fs.readFileSync(settingsFile, 'utf-8');
		const data = JSON.parse(content);

		if (!isNonEmptyString(data.title)) {
			errors.push('site.json: Missing or invalid "title"');
		}
		if (!isNonEmptyString(data.description)) {
			errors.push('site.json: Missing or invalid "description"');
		}
		if (!isNonEmptyString(data.author)) {
			warnings.push('site.json: Missing "author" field');
		}

	} catch (err) {
		errors.push(`site.json: Failed to parse - ${err.message}`);
	}
}

// Run validation
console.log('Validating curriculum content...\n');

const clusters = validateClusters();
validateLessons(clusters);
validatePages();
validateSettings();

// Report results
if (warnings.length > 0) {
	console.log('Warnings:');
	warnings.forEach(w => console.log(`  ⚠ ${w}`));
	console.log('');
}

if (errors.length > 0) {
	console.error('Errors:');
	errors.forEach(e => console.error(`  ✗ ${e}`));
	console.log('');
	console.error(`Validation failed with ${errors.length} error(s).`);
	process.exit(1);
} else {
	console.log(`✓ All content valid! (${clusters.size} clusters found)`);
	process.exit(0);
}
