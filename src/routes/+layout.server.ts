import type { LayoutServerLoad } from './$types';
import { loadCurriculum } from '$lib/data/curriculum.server';
import { loadSiteSettings } from '$lib/config';

export const load: LayoutServerLoad = async () => {
	const clusters = loadCurriculum();
	const settings = loadSiteSettings();
	return { clusters, settings };
};
