import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$root/src/db/drizzle.server';
import { itemTable } from '$root/src/db/schema.server';
import { and, eq } from 'drizzle-orm';
import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';

export const DELETE: RequestHandler = async ({ request, locals, url }) => {
  if (!locals.user) return redirect(302, protectedRouteRedirectUrl(url));

  const { itemId } = await request.json();

  await db
    .delete(itemTable)
    .where(and(eq(itemTable.userId, locals.user.id), eq(itemTable.id, itemId)));

  return json({});
};
