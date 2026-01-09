import type { PageServerLoad } from './$types';
import { loadHomePage } from '$lib/data/curriculum.server';
import { loadSiteSettings } from '$lib/config';

export const load: PageServerLoad = async () => {
	const homeContent = loadHomePage();
	const siteSettings = loadSiteSettings();

	return {
		home: homeContent,
		settings: siteSettings
	};
};
