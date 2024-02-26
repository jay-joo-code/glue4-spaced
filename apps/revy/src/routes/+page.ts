import type { Load } from '@sveltejs/kit';
import { pb } from '$lib/glue/pocketbase';
import { RIDE_EXPAND_STRING } from '$lib/util/constants';
import { format } from 'date-fns';

export const ssr = false;

export const load: Load = async ({ fetch }) => {
	const fetchRides = async () => {
		const PAGE_SIZE = 40;
		const nowDateTimeString = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
		const ridesList = await pb.collection('rides').getList(1, PAGE_SIZE, {
			filter: `datetime >= "${nowDateTimeString}"`,
			expand: RIDE_EXPAND_STRING,
			sort: 'datetime',
			fetch: async (url) => fetch(url)
		});
		return ridesList?.items?.map((record) => structuredClone(record));
	};

	return {
		lazy: {
			rides: fetchRides()
		}
	};
};
