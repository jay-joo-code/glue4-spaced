import { currentUser, pb } from '$lib/glue/pocketbase';
import type { Load } from '@sveltejs/kit';

export const ssr = false;

export const load: Load = async ({}) => {
	// sync pocketbase auth state
	if (!pb.authStore.isValid) {
		currentUser.set(null);
	}

	return {};
};
