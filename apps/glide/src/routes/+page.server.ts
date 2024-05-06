import { PLAID_CLIENT_ID, PLAID_SECRET_DEV } from '$env/static/private';
import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import { redirect, type Actions, type ServerLoad } from '@sveltejs/kit';
import { and, eq, isNotNull, lt } from 'drizzle-orm';
import db from '../db/drizzle.server';
import { itemTable, transactionTable } from '../db/schema.server';
import { groupTransactionsByWeek } from '../lib/util/transaction';

export const load: ServerLoad = async ({ url, locals }) => {
  if (!locals.user) return redirect(302, protectedRouteRedirectUrl(url));

  const fetchWeeklyExpenses = async () => {
    if (!locals.user) return;
    const expenses = await db
      .select()
      .from(transactionTable)
      .where(
        and(
          eq(transactionTable.userId, locals.user.id),
          lt(transactionTable.amount, 0),
          eq(transactionTable.isIgnore, false)
        )
      );

    const weeklyExpenses = groupTransactionsByWeek(expenses);
    return weeklyExpenses;
  };

  const fetchItems = async () => {
    if (!locals.user) return;

    const items = await db.select().from(itemTable).where(eq(itemTable.userId, locals.user.id));
    return items;
  };

  return {
    weeklyExpenses: fetchWeeklyExpenses(),
    items: fetchItems()
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
