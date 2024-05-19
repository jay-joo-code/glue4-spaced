import db from '$root/src/db/drizzle.server';
import { listingTable } from '$root/src/db/schema';
import { type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({}) => {
  const fetchListings = async () => {
    const listings = await db.select().from(listingTable);
    return listings;
  };

  return {
    listings: fetchListings()
  };
};
