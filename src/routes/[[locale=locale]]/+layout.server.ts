import type { LayoutServerLoad } from './$types';
import { loadCurriculum } from '$lib/data/curriculum.server';
import { getLocaleFromParams, type Locale } from '$lib/i18n';

export const load: LayoutServerLoad = async ({ params }) => {
	const locale: Locale = getLocaleFromParams(params);
	const clusters = loadCurriculum(locale);
	return { clusters, locale };
};
