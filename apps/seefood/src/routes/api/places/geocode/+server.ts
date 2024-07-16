import { placesGeocodeHandler } from '@glue/utils';
import type { RequestHandler } from './$types';
import { GOOGLE_MAPS_API_KEY } from '$env/static/private';

export const GET: RequestHandler = async (event) => {
  return placesGeocodeHandler({
    ...event,
    GOOGLE_MAPS_API_KEY
  });
};
