export const PLACES = [
	'ithaca',
	'new york city',
	'boston',
	'buffalo',
	'ohio',
	'syracuse',
	'syracuse airport',
	'washington dc',
	'philadelphia',
	'rochester',
	'chicago',
	'newark airport',
	'pittsburgh'
];

export const RIDE_EXPAND_STRING = 'origin,destination,driver,bookings(ride).requestor';
export const BOOKING_EXPAND_STRING =
	'ride,driver,requestor,ride.origin,ride.destination,ride.driver,ride.bookings(ride).requestor';
