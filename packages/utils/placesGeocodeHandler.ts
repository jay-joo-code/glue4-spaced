import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import { json, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import queryString from 'query-string';

const placesAutocompleteHandler = async ({
  url,
  locals,
  fetch,
  GOOGLE_MAPS_API_KEY
}: RequestEvent & { GOOGLE_MAPS_API_KEY: string }) => {
  if (!locals.user) return redirect(302, protectedRouteRedirectUrl(url));
  const address = url.searchParams.get('address') ?? '';
  const query = queryString.stringify({
    address,
    key: GOOGLE_MAPS_API_KEY
  });
  const requestUrl = `https://maps.googleapis.com/maps/api/geocode/json?${query}`;
  const response = await (await fetch(requestUrl)).json();
  return json(response);
};

export default placesAutocompleteHandler;
