import { pb } from '$root/src/lib/glue/pocketbase';
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ parent, params, fetch }) => {
	const fetchProject = async () => {
		return await pb.collection('projects').getOne(params?.projectId, {
			fetch,
			expand: 'pages(project)'
		});
	};

	return { project: fetchProject() };
};
