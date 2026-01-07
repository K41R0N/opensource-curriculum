import fs from 'fs';
import path from 'path';

/**
 * Supported locales for the site
 */
export const SUPPORTED_LOCALES = ['en', 'es-CO'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Default locale (English)
 */
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Locale display names
 */
export const LOCALE_NAMES: Record<Locale, string> = {
	en: 'English',
	'es-CO': 'Español (CO)'
};

/**
 * Check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
	return SUPPORTED_LOCALES.includes(locale as Locale);
}

/**
 * Get the locale from route params, defaulting to English
 */
export function getLocaleFromParams(params: { locale?: string }): Locale {
	if (params.locale && isValidLocale(params.locale)) {
		return params.locale;
	}
	return DEFAULT_LOCALE;
}

/**
 * Get the localized file path for a content file
 * - For default locale (en): Returns original path (e.g., about.md)
 * - For other locales: Returns suffixed path (e.g., about.es-CO.md)
 * - Falls back to default locale if translation doesn't exist
 */
export function getLocalizedFilePath(basePath: string, locale: Locale): string {
	// Default locale uses the base file
	if (locale === DEFAULT_LOCALE) {
		return basePath;
	}

	// Build localized path: about.md -> about.es-CO.md
	const ext = path.extname(basePath);
	const base = basePath.slice(0, -ext.length);
	const localizedPath = `${base}.${locale}${ext}`;

	// Check if localized file exists, fall back to default if not
	if (fs.existsSync(localizedPath)) {
		return localizedPath;
	}

	return basePath;
}

/**
 * Get the localized filename pattern for a folder
 * - For default locale (en): Returns *.md (files without locale suffix)
 * - For other locales: Returns *.{locale}.md
 */
export function getLocalizedFilePattern(locale: Locale): { suffix: string; isDefault: boolean } {
	if (locale === DEFAULT_LOCALE) {
		return { suffix: '', isDefault: true };
	}
	return { suffix: `.${locale}`, isDefault: false };
}

/**
 * Build a localized URL path
 * - For default locale: /curriculum/...
 * - For other locales: /es-CO/curriculum/...
 */
export function localizedPath(path: string, locale: Locale): string {
	if (locale === DEFAULT_LOCALE) {
		return path;
	}
	return `/${locale}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Get alternate locale URLs for a path (for language switcher and hreflang)
 */
export function getAlternateLocaleUrls(
	currentPath: string,
	currentLocale: Locale
): Array<{ locale: Locale; url: string }> {
	// Remove current locale prefix if present
	let basePath = currentPath;
	if (currentLocale !== DEFAULT_LOCALE && currentPath.startsWith(`/${currentLocale}`)) {
		basePath = currentPath.slice(`/${currentLocale}`.length) || '/';
	}

	return SUPPORTED_LOCALES.map((locale) => ({
		locale,
		url: localizedPath(basePath, locale)
	}));
}
