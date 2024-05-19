import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import { redirect, type ServerLoad } from '@sveltejs/kit';
import db from '$root/src/db/drizzle.server';
import { listingTable } from '$root/src/db/schema';

export const load: ServerLoad = async ({ url, locals }) => {
  if (!locals.user) {
    return redirect(302, protectedRouteRedirectUrl(url));
  }

  const fetchListings = async () => {
    if (!locals.user) return;

    const listings = await db.select().from(listingTable);
    return listings;
  };

  return {
    listings: fetchListings()
  };
};
