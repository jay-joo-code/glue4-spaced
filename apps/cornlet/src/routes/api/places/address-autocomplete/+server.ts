import { placesAutocompleteHandler } from '@glue/utils';
import type { RequestHandler } from './$types';
import { GOOGLE_MAPS_API_KEY } from '$env/static/private';

export const GET: RequestHandler = async (event) => {
  return placesAutocompleteHandler({
    ...event,
    GOOGLE_MAPS_API_KEY
  });
};
