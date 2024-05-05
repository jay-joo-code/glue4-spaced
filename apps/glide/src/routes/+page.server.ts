import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import { redirect, type ServerLoad } from '@sveltejs/kit';
import db from '../db/drizzle.server';
import { itemTable } from '../db/schema.server';
import { eq } from 'drizzle-orm';

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
