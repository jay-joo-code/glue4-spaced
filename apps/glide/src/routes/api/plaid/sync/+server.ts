import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PLAID_CLIENT_ID, PLAID_SECRET_SANDBOX } from '$env/static/private';
import db from '$root/src/db/drizzle.server';
import { itemTable, transactionTable, type InsertTransaction } from '$root/src/db/schema.server';
import { eq } from 'drizzle-orm';
import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import type { PlaidTransaction } from '$root/src/lib/types/plaid.type';
import { parse, parseISO } from 'date-fns';

export const POST: RequestHandler = async ({ fetch, locals, url }) => {
  if (!locals.user) return redirect(302, protectedRouteRedirectUrl(url));

  const items = await db.select().from(itemTable).where(eq(itemTable.userId, locals.user.id));

  const syncPromises = items.map(async (item) => {
    const response = await (
      await fetch('https://sandbox.plaid.com/transactions/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: PLAID_CLIENT_ID,
          secret: PLAID_SECRET_SANDBOX,
          access_token: item.accessToken,
          cursor: item.cursor ?? undefined,
          count: 10
        })
      })
    ).json();

    const transactions = response.added
      .map((transaction: PlaidTransaction): InsertTransaction | undefined => {
        if (transaction.amount && transaction.name && transaction.merchant_name && locals.user) {
          return {
            userId: locals.user.id,
            amount: String(transaction.amount),
            category: transaction.personal_finance_category?.primary,
            categoryDetailed: transaction.personal_finance_category?.detailed,
            datetime: transaction.authorized_datetime
              ? parseISO(transaction.authorized_datetime)
              : undefined,
            usageDatetime: transaction.authorized_datetime
              ? parseISO(transaction.authorized_datetime)
              : undefined,
            name: transaction.name,
            merchantName: transaction.merchant_name,
            merchantLogoUrl: transaction.logo_url,
            isPending: transaction.pending
          };
        }
      })
      .filter((transaction: InsertTransaction | undefined) => transaction);

    const savedTransactions = await db.insert(transactionTable).values(transactions).returning();

    await db
      .update(itemTable)
      .set({ cursor: response.next_cursor })
      .where(eq(itemTable.id, item.id));

    return savedTransactions;
  });

  const mergedResponses = await Promise.all(syncPromises);

  return json(mergedResponses);
};
