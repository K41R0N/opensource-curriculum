import type { LayoutServerLoad } from './$types';
import { loadCurriculum } from '$lib/data/curriculum.server';

export const load: LayoutServerLoad = async () => {
	const clusters = loadCurriculum();
	return { clusters };
};
