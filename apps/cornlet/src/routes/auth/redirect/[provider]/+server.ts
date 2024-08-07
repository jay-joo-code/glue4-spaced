import { OAUTH_GOOGLE_CLIENT_ID, OAUTH_GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { lucia } from '$root/src/db/auth.server';
import db from '$root/src/db/drizzle.server';
import { userTable } from '$root/src/db/schema';
import { error } from '@sveltejs/kit';
import { Google, OAuth2RequestError } from 'arctic';
import type { RequestHandler } from './$types';

interface OAuthUserGoogle {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export const GET: RequestHandler = async ({ url, params, cookies }) => {
  const { provider } = params;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies.get(`oauth_state_${provider}`) ?? null;
  const storedCodeVerifier = cookies.get(`code_verifier_${provider}`) ?? null;
  const redirectTo = cookies.get(`oauth_redirect_to_${provider}`) ?? '/';

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
    const googleUser: OAuthUserGoogle = await response.json();

    const user = await (
      await db
        .insert(userTable)
        .values({
          email: googleUser.email,
          avatarUrl: googleUser.picture,
          firstName: googleUser.given_name,
          lastName: googleUser.family_name
        })
        .onConflictDoUpdate({
          target: userTable.email,
          set: {
            avatarUrl: googleUser.picture,
            firstName: googleUser.given_name,
            lastName: googleUser.family_name
          }
        })
        .returning()
    ).at(0);

    if (!user) throw new Error('Unable to create a new user');

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectTo
      }
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return error(400);
    }
    return error(500);
  }
};
