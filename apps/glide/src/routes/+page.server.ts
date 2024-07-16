import { PLAID_CLIENT_ID, PLAID_SECRET_DEV } from '$env/static/private';
import { aggregateRefunds, groupTransactionsByWeek } from '$lib/util/transaction';
import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import db from '$src/db/drizzle.server';
import { itemTable, transactionTable } from '$src/db/schema.server';
import { redirect, type Actions, type ServerLoad } from '@sveltejs/kit';
import { and, desc, eq, gt, gte, isNull, lt } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export const load: ServerLoad = async ({ url, locals }) => {
  if (!locals.user) return redirect(302, protectedRouteRedirectUrl(url));

  const fetchWeeklyExpenses = async () => {
    if (!locals.user) return;

    const refund = alias(transactionTable, 'refund');
    const expenses = await db
      .select()
      .from(transactionTable)
      .where(
        and(
          eq(transactionTable.userId, locals.user.id),
          lt(transactionTable.amount, 0),
          eq(transactionTable.isIgnore, false),
          eq(transactionTable.isPendingRefund, false),
          eq(transactionTable.isRecurring, false),
          isNull(transactionTable.refundId),
          gte(transactionTable.usageDate, '2024-04-08') // date to start tracking from
        )
      )
      .leftJoin(refund, eq(transactionTable.id, refund.refundId))
      .orderBy(desc(transactionTable.usageDate));

    const expensesWithRefunds = aggregateRefunds(expenses);
    const weeklyExpenses = groupTransactionsByWeek(expensesWithRefunds);
    return weeklyExpenses;
  };

  const fetchItems = async () => {
    if (!locals.user) return;

    const items = await db.select().from(itemTable).where(eq(itemTable.userId, locals.user.id));
    return items;
  };

  const fetchRefundCandidates = async () => {
    if (!locals.user) return;

    const refundCandidates = await db
      .select()
      .from(transactionTable)
      .where(
        and(
          eq(transactionTable.userId, locals.user.id),
          gt(transactionTable.amount, 0),
          isNull(transactionTable.refundId),
          eq(transactionTable.isIgnore, false),
          gte(transactionTable.usageDate, '2024-04-08') // date to start tracking from)
        )
      )
      .orderBy(desc(transactionTable.usageDate))
      .limit(50);

    return refundCandidates;
  };

  const fetchPendingRefunds = async () => {
    if (!locals.user) return;

    const pendingRefunds = await db
      .select()
      .from(transactionTable)
      .where(
        and(
          eq(transactionTable.userId, locals.user.id),
          lt(transactionTable.amount, 0),
          isNull(transactionTable.refundId),
          eq(transactionTable.isIgnore, false),
          eq(transactionTable.isPendingRefund, true)
        )
      )
      .orderBy(desc(transactionTable.usageDate))
      .limit(50);

    return pendingRefunds;
  };

  const fetchDateUnsetTransactions = async () => {
    if (!locals.user) return;

    const pendingRefunds = await db
      .select()
      .from(transactionTable)
      .where(
        and(
          eq(transactionTable.userId, locals.user.id),
          eq(transactionTable.isIgnore, false),
          isNull(transactionTable.refundId),
          isNull(transactionTable.usageDate)
        )
      )
      .orderBy(desc(transactionTable.date))
      .limit(50);

    return pendingRefunds;
  };

  const fetchRecentlyIgnoredExpenses = async () => {
    if (!locals.user) return;

    const expenses = await db
      .select()
      .from(transactionTable)
      .where(and(eq(transactionTable.userId, locals.user.id), eq(transactionTable.isIgnore, true)))
      .orderBy(desc(transactionTable.updatedAt))
      .limit(6);

    return expenses;
  };

  return {
    weeklyExpenses: fetchWeeklyExpenses(),
    items: fetchItems(),
    refundCandidates: fetchRefundCandidates(),
    pendingRefunds: fetchPendingRefunds(),
    dateUnsetTransactions: fetchDateUnsetTransactions(),
    recentlyIgnoredExpenses: fetchRecentlyIgnoredExpenses()
  };
};

export const actions = {
  createPlaidToken: async ({ fetch, locals }) => {
    if (!locals.user) return;

    const TOKEN_CREATE_URL = 'https://development.plaid.com/link/token/create';
    const response = await fetch(TOKEN_CREATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET_DEV,
        user: {
          client_user_id: locals.user.id
        },
        client_name: 'Personal Finance App',
        products: ['transactions'],
        transactions: {
          days_requested: 730
        },
        country_codes: ['US'],
        language: 'en',
        account_filters: {
          depository: {
            account_subtypes: ['checking', 'savings']
          },
          credit: {
            account_subtypes: ['credit card']
          }
        }
      })
    });
    return await response.json();
  }
} satisfies Actions;
