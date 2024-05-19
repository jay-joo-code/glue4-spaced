import db from '$root/src/db/drizzle.server';
import { listingTable } from '$root/src/db/schema';
import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import { redirect, type ServerLoad } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load: ServerLoad = async ({ url, locals }) => {
  if (!locals.user) {
    return redirect(302, protectedRouteRedirectUrl(url));
  }

  const fetchMyListings = async () => {
    if (!locals.user) return;

    const myListings = await db
      .select()
      .from(listingTable)
      .where(eq(listingTable.userId, locals.user.id));
    return myListings;
  };

  return {
    myListings: fetchMyListings()
  };
};
