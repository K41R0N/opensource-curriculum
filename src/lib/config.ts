/**
 * Site Configuration
 *
 * Centralizes configuration that varies between deployments.
 * Uses environment variables where available, with sensible defaults.
 *
 * Environment Variables (set in Netlify):
 * - PUBLIC_SITE_URL: The canonical URL of the site (e.g., https://my-curriculum.netlify.app)
 */

import fs from 'fs';
import path from 'path';
import type { SiteSettings } from '$lib/types/content';
import { DEFAULT_LOCALE, type Locale } from '$lib/i18n';

/**
 * The canonical site URL (no trailing slash)
 * Set PUBLIC_SITE_URL in Netlify environment variables
 */
export const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://devices-curriculum.netlify.app';

/**
 * Load site settings from CMS-managed JSON file
 * This allows forkers to customize via the CMS
 */
export function loadSiteSettings(locale: Locale = DEFAULT_LOCALE): SiteSettings {
	const settingsDir = path.join(process.cwd(), 'content', 'settings');
	let settingsPath: string;

	if (locale === DEFAULT_LOCALE) {
		settingsPath = path.join(settingsDir, 'site.json');
	} else {
		// Try locale-specific file first
		const localizedPath = path.join(settingsDir, `site.${locale}.json`);
		settingsPath = fs.existsSync(localizedPath)
			? localizedPath
			: path.join(settingsDir, 'site.json');
	}

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
