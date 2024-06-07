import db from '$root/src/db/drizzle.server';
import { listingTable, userTable } from '$root/src/db/schema';
import { type ServerLoad } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load: ServerLoad = async ({ params }) => {
  const fetchListing = async () => {
    if (!params.listingId) return null;

    const result = (
      await db
        .select()
        .from(listingTable)
        .where(eq(listingTable.id, params.listingId))
        .leftJoin(userTable, eq(listingTable.userId, userTable.id))
    ).at(0);

    if (!result || !result.user) return null;

    return {
      ...result.listing,
      host: {
        firstName: result.user.firstName,
        avatarUrl: result.user.avatarUrl
      }
    };
  };

  return {
    listing: fetchListing()
  };
};
