import { json, redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import db from '$root/src/db/drizzle.server';
import { listingTable } from '$root/src/db/schema';
import { and, eq } from 'drizzle-orm';

export const PUT: RequestHandler = async ({ request, url, params, locals }) => {
  if (!locals.user) {
    return redirect(302, protectedRouteRedirectUrl(url));
  }

  try {
    const requestBody = await request.json();
    const { listingId } = params;

    const [listing] = await db
      .update(listingTable)
      .set(requestBody)
      .where(and(eq(listingTable.id, listingId), eq(listingTable.userId, locals.user.id)))
      .returning();

    if (!listing) {
      throw error(404, 'Listing not found or you do not have permission to update it');
    }

    return json(listing);
  } catch (e) {
    console.error('Error updating listing:', e);
    throw error(500, 'Internal Server Error');
  }
};
