import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import db from '$root/src/db/drizzle.server';
import { transactionTable } from '$root/src/db/schema.server';
import { and, eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, url, params, locals }) => {
  if (!locals.user) return redirect(302, protectedRouteRedirectUrl(url));
  const { transactionId } = await request.json();

  const transaction = await db
    .update(transactionTable)
    .set({ isPendingRefund: true })
    .where(and(eq(transactionTable.userId, locals.user.id), eq(transactionTable.id, transactionId)))
    .returning();

  return json(transaction);
};
