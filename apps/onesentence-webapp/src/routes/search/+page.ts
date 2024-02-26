import { pb } from '$lib/glue/pocketbase';
import { RIDE_EXPAND_STRING } from '$lib/util/constants';
import type { Load } from '@sveltejs/kit';
import { add, endOfDay, format, parse, parseISO, startOfDay, sub } from 'date-fns';

export const load: Load = async ({ url, fetch }) => {
	const originId = url.searchParams.get('origin');
	const destinationId = url.searchParams.get('destination');
	const queryDateString = url.searchParams.get('date');
	const queryDate = queryDateString ? new Date(queryDateString) : new Date();
	const queryDateStart = startOfDay(queryDate).toISOString().replace('T', ' ');
	const queryDateEnd = endOfDay(queryDate).toISOString().replace('T', ' ');
	const nearbyDateStart = startOfDay(sub(queryDate, { days: 2 }))
		.toISOString()
		.replace('T', ' ');
	const nearbyDateEnd = endOfDay(add(queryDate, { days: 2 }))
		.toISOString()
		.replace('T', ' ');

	const fetchRides = async () => {
		const rides = (
			await pb.collection('rides').getFullList(200, {
				filter: `origin = "${originId}" && destination = "${destinationId}" && datetime >= "${queryDateStart}" && datetime <= "${queryDateEnd}"`,
				expand: RIDE_EXPAND_STRING,
				fetch: async (url) => fetch(url)
			})
		)?.map((record) => structuredClone(record));
		return rides;
	};

	const fetchNearbyRideStats = async () => {
		const nearbyRides = await pb.collection('rides').getFullList(200, {
			filter: `origin = "${originId}" && destination = "${destinationId}" && datetime >= "${nearbyDateStart}" && datetime <= "${nearbyDateEnd}"`,
			expand: 'origin,destination,driver',
			sort: '-datetime',
			fetch: async (url) => fetch(url)
		});

		const stats: Record<string, number | null> = {};
		const twoDaysBeforeQueryDate = sub(queryDate, { days: 2 });

		for (let i = 0; i < 5; i++) {
			const date = add(twoDaysBeforeQueryDate, { days: i });
			stats[format(date, 'yyyy-MM-dd')] = null;
		}

		for (const ride of nearbyRides) {
			const datestamp = format(parseISO(ride.datetime), 'yyyy-MM-dd');
			if (stats[datestamp]) {
				stats[datestamp] = Math.min(stats[datestamp] as number, ride.price);
			} else {
				stats[datestamp] = ride.price;
			}
		}

		return Object.entries(stats).map(([datestamp, minPrice]) => [
			parse(datestamp, 'yyyy-MM-dd', new Date()),
			minPrice
		]);
	};

	const fetchWaitlist = async () => {
		const oneMonthAgo = sub(new Date(), { months: 1 });
		const waitlist = (
			await pb.collection('waitlists').getFullList(200, {
				filter: `origin="${originId}" && destination="${destinationId}" && date > "${oneMonthAgo?.toISOString()}"`,
				sort: 'date',
				expand: 'user',
				fetch: async (url) => fetch(url)
			})
		).map((record) => structuredClone(record));
		return waitlist;
	};

	const fetchOtherRides = async () => {
		const rides = (
			await pb.collection('rides').getFullList(200, {
				filter: `origin = "${originId}" && destination = "${destinationId}" && datetime >= "${new Date().toISOString()}"`,
				expand: RIDE_EXPAND_STRING,
				fetch: async (url) => fetch(url),
				sort: 'datetime'
			})
		)?.map((record) => structuredClone(record));
		return rides;
	};

	return {
		rides: fetchRides(),
		waitlist: fetchWaitlist(),
		queryDate,
		nearbyRideStats: fetchNearbyRideStats(),
		originId,
		destinationId,
		otherRides: fetchOtherRides()
	};
};
