import { currentUser, pb } from '$lib/glue/pocketbase';
import { RIDE_EXPAND_STRING } from '$lib/util/constants';
import type { Load } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const load: Load = async ({ fetch }) => {
	const fetchMyDrives = async () => {
		const rides = await pb.collection('rides').getFullList(200, {
			filter: `driver = "${get(currentUser)?.id}"`,
			expand: RIDE_EXPAND_STRING,
			sort: '-created',
			fetch: async (url) => fetch(url)
		});
		return rides?.map((booking) => structuredClone(booking));
	};

	return {
		myDrives: fetchMyDrives()
	};
};
