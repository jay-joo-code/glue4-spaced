import { currentUser, pb } from '$lib/glue/pocketbase';
import { BOOKING_EXPAND_STRING } from '$lib/util/constants';
import type { Load } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const load: Load = async ({ fetch, url }) => {
	const fetchBookings = async () => {
		const bookings = await pb.collection('bookings').getFullList(200, {
			filter: `driver = "${get(currentUser)?.id}" || requestor = "${get(currentUser)?.id}"`,
			expand: BOOKING_EXPAND_STRING,
			sort: '-updated',
			fetch: async (url) => fetch(url)
		});

		return bookings?.map((booking) => structuredClone(booking));
	};

	const fetchBooking = async () => {
		const bookingId = url.pathname?.split('/')[2];

		if (bookingId === 'list') return null;

		const booking = await pb.collection('bookings').getFirstListItem(`id = "${bookingId}"`, {
			expand: BOOKING_EXPAND_STRING,
			fetch: async (url) => fetch(url)
		});

		return structuredClone(booking);
	};

	return {
		bookings: fetchBookings(),
		booking: fetchBooking()
	};
};
