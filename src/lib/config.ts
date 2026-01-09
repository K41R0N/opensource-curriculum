/**
 * Site Configuration
 *
 * Centralizes configuration that varies between deployments.
 * Uses environment variables where available, with sensible defaults.
 *
 * Environment Variables (set in Netlify):
 * - PUBLIC_SITE_URL: The canonical URL of the site (e.g., https://byocurriculum.dev)
 */

import fs from 'fs';
import path from 'path';
import type { SiteSettings } from '$lib/types/content';

/**
 * The canonical site URL (no trailing slash)
 * Set PUBLIC_SITE_URL in Netlify environment variables
 */
export const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://byocurriculum.dev';

/**
 * Load site settings from CMS-managed JSON file
 * This allows forkers to customize via the CMS
 */
export function loadSiteSettings(): SiteSettings {
	const settingsPath = path.join(process.cwd(), 'content', 'settings', 'site.json');

	try {
		const content = fs.readFileSync(settingsPath, 'utf-8');
		return JSON.parse(content) as SiteSettings;
	} catch {
		// Return defaults if file doesn't exist
		return {
			title: 'Curriculum',
			description: 'A self-directed research curriculum.',
			author: 'Author'
		};
	}
}

/**
 * Combined config object for convenience
 */
export const config = {
	get siteUrl() {
		return SITE_URL;
	},
	get settings() {
		return loadSiteSettings();
	}
};

/**
 * Get the site URL, with optional path appended
 */
export function getSiteUrl(path?: string): string {
	if (!path) return SITE_URL;
	return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
