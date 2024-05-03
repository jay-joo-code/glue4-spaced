import db from '$root/src/db/drizzle.server';
import { userTable } from '$root/src/db/schema.server';
import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import { redirect, type ServerLoad } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load: ServerLoad = async ({ url, locals }) => {
  const fetchUser = async () => {
    if (!locals.user) {
      return redirect(302, protectedRouteRedirectUrl(url));
    }

    const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await pause(3000);

    const user = (await db.select().from(userTable).where(eq(userTable.id, locals.user.id))).at(0);
    return user;
  };

  return {
    userDetails: fetchUser()
  };
};
