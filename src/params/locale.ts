import type { ParamMatcher } from '@sveltejs/kit';
import { SUPPORTED_LOCALES } from '$lib/i18n';

/**
 * Param matcher for locale routes
 * Only matches valid locale codes (en, es-CO)
 */
export const match: ParamMatcher = (param) => {
	return SUPPORTED_LOCALES.includes(param as typeof SUPPORTED_LOCALES[number]);
};
