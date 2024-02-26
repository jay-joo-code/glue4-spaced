import { currentUser, pb } from '$lib/glue/pocketbase';
import { BOOKING_EXPAND_STRING } from '$lib/util/constants';
import type { Load } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const load: Load = async ({ fetch }) => {
	const fetchMyBookings = async () => {
		const bookings = await pb.collection('bookings').getFullList(200, {
			filter: `requestor = "${get(currentUser)?.id}"`,
			expand: BOOKING_EXPAND_STRING,
			sort: '-updated',
			fetch: async (url) => fetch(url)
		});
		return bookings?.map((booking) => structuredClone(booking));
	};

	const fetchMyWaitlists = async () => {
		const waitlists = await pb.collection('waitlists').getFullList(200, {
			filter: `user = "${get(currentUser)?.id}"`,
			expand: 'origin,destination',
			sort: '-created',
			fetch: async (url) => fetch(url)
		});
		return waitlists?.map((booking) => structuredClone(booking));
	};

	return { myBookings: fetchMyBookings(), myWaitlists: fetchMyWaitlists() };
};
