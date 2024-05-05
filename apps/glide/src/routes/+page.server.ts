import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import { redirect, type Actions, type ServerLoad } from '@sveltejs/kit';
import db from '../db/drizzle.server';
import { itemTable } from '../db/schema.server';
import { eq } from 'drizzle-orm';
import { APP_NAME } from '../lib/config';
import { PLAID_CLIENT_ID, PLAID_SECRET_SANDBOX } from '$env/static/private';

export const load: ServerLoad = async ({ url, locals }) => {
  if (!locals.user) {
    return redirect(302, protectedRouteRedirectUrl(url));
  }

  const fetchExpenses = async () => {
    if (!locals.user) return;
  };

  const fetchItems = async () => {
    if (!locals.user) return;

    const items = await db.select().from(itemTable).where(eq(itemTable.userId, locals.user.id));
    return items;
  };

  return {
    expenses: fetchExpenses(),
    items: fetchItems()
  };
};

export const actions = {
  createPlaidToken: async ({ fetch, locals, url }) => {
    if (!locals.user) return;

    const TOKEN_CREATE_URL = 'https://sandbox.plaid.com/link/token/create';
    const response = await fetch(TOKEN_CREATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET_SANDBOX,
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
