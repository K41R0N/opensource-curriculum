import type { PageServerLoad } from './$types';
import { loadAboutPage } from '$lib/data/curriculum.server';

export const load: PageServerLoad = async () => {
	const aboutContent = await loadAboutPage();

	return {
		about: aboutContent
	};
};
