import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import db from '$root/src/db/drizzle.server';
import { listingTable } from '$root/src/db/schema';
import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ request, url, params, locals }) => {
  if (!locals.user) return redirect(302, protectedRouteRedirectUrl(url));

  try {
    const requestBody = await request.json();
    const { listingId } = params;
    console.log('requestBody, listingId', requestBody, listingId);

    const listing = await db
      .update(listingTable)
      .set(requestBody)
      .where(and(eq(listingTable.id, listingId), eq(listingTable.userId, locals.user.id)))
      .returning();

    return json(listing);
  } catch (e) {
    error(500);
  }
};
