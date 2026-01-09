import type { PageServerLoad } from './$types';
import { loadFullLesson } from '$lib/data/curriculum.server';

export const load: PageServerLoad = async ({ params }) => {
	const { cluster, lesson } = params;

	return loadFullLesson(cluster, lesson);
};
