import { currentUser, pb } from '$lib/glue/pocketbase';
import type { Load } from '@sveltejs/kit';

export const ssr = false;

export const load: Load = async ({ fetch }) => {
	// sync pocketbase auth state
	if (!pb.authStore.isValid) {
		currentUser.set(null);
	}

	const fetchLocations = async () => {
		return await pb.collection('locations').getFullList(200, {
			fetch: async (url) => fetch(url),
			sort: 'name'
		});
	};

	return { locations: fetchLocations() };
};
