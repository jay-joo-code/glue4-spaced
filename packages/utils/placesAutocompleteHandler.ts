import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import { json, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

const placesAutocompleteHandler = async ({
  url,
  locals,
  fetch,
  GOOGLE_MAPS_API_KEY
}: RequestEvent & { GOOGLE_MAPS_API_KEY: string }) => {
  if (!locals.user) return redirect(302, protectedRouteRedirectUrl(url));
  const address = url.searchParams.get('address') ?? '';
  const query = Object.entries({
    input: address,
    key: GOOGLE_MAPS_API_KEY
  })
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  const requestUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${query}`;
  const response = await (await fetch(requestUrl)).json();
  return json(response);
};

export default placesAutocompleteHandler;
