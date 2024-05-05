import { PLAID_CLIENT_ID, PLAID_SECRET_SANDBOX } from '$env/static/private';
import db from '$root/src/db/drizzle.server';
import { itemTable } from '$root/src/db/schema.server';
import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch, locals, url }) => {
  if (!locals.user) return redirect(302, protectedRouteRedirectUrl(url));

  const { public_token, institution } = await request.json();

  const response = await (
    await fetch('https://sandbox.plaid.com/item/public_token/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET_SANDBOX,
        public_token
      })
    })
  ).json();

  console.log('response', response);

  const item = await db.insert(itemTable).values({
    userId: locals.user.id,
    institution,
    accessToken: response.access_token,
    plaidItemId: response.item_id
  });

  return json(item);
};
