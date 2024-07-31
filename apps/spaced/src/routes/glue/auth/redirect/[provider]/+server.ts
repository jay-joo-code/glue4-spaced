import { OAUTH_GOOGLE_CLIENT_ID, OAUTH_GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { lucia } from '$lib/glue/db/auth.server';
import db from '$lib/glue/db/drizzle.server';
import { userTable } from '$lib/glue/db/schema.server';
import { error } from '@sveltejs/kit';
import { Google, OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

interface OAuthUser {
  email: string;
}

export const GET: RequestHandler = async ({ url, params, cookies }) => {
  const { provider } = params;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies.get(`oauth_state_${provider}`) ?? null;
  const storedCodeVerifier = cookies.get(`code_verifier_${provider}`) ?? null;

  if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
    return error(400);
  }

  try {
    const params = new URLSearchParams(url.search);
    params.delete('code');
    params.delete('state');
    const REDIRECT_URL = `${url.origin}/auth/redirect/${provider}`;
    const google = new Google(OAUTH_GOOGLE_CLIENT_ID, OAUTH_GOOGLE_CLIENT_SECRET, REDIRECT_URL);
    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
    const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });
    const user: OAuthUser = await response.json();

    const existingUser = await (
      await db.select().from(userTable).where(eq(userTable.email, user.email)).limit(1)
    ).at(0);

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes
      });
    } else {
      const newUser = (
        await db
          .insert(userTable)
          .values({
            email: user.email
          })
          .returning()
      ).at(0);

      if (!newUser) throw new Error('Unable to create a new user');

      const session = await lucia.createSession(newUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/'
      }
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return error(400);
    }
    return error(500);
  }
};
