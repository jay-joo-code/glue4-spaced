import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import { transactionTable, type InsertTransaction } from '$root/src/db/schema.server';
import db from '$root/src/db/drizzle.server';

export const POST: RequestHandler = async ({ request, url, locals }) => {
  if (!locals.user) return redirect(302, protectedRouteRedirectUrl(url));

  const parsedTransactions: Omit<InsertTransaction, 'userId'>[] = (await request.json())
    .parsedTransactions;

  const newTransactions: InsertTransaction[] = parsedTransactions.map((transaction) => {
    return {
      ...transaction,
      userId: locals.user?.id ?? '',
      date: transaction.date,
      usageDate: transaction.usageDate
    };
  });

  const transactions = await db
    .insert(transactionTable)
    .values(newTransactions)
    .onConflictDoNothing()
    .returning();

  return json({ transactions });
};
