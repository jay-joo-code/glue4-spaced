import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { lucia } from '$root/src/db/auth.server';

export const GET: RequestHandler = async ({ cookies }) => {
  cookies.delete(lucia.sessionCookieName, { path: '/' });
  return redirect(302, '/');
};
