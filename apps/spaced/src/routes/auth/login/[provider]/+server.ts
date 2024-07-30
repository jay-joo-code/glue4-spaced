import { OAUTH_GOOGLE_CLIENT_ID, OAUTH_GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { generateCodeVerifier, generateState, Google } from 'arctic';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';

export const GET: RequestHandler = async ({ url, params, cookies }) => {
  const { provider } = params;

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const REDIRECT_URL = `${url.origin}/auth/redirect/${provider}`;

  // TODO: handle different providers
  const google = new Google(OAUTH_GOOGLE_CLIENT_ID, OAUTH_GOOGLE_CLIENT_SECRET, REDIRECT_URL);
  const authUrl = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ['profile', 'email']
  });

  cookies.set(`oauth_state_${provider}`, state, {
    path: '/',
    secure: !dev,
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
    sameSite: 'lax'
  });

  cookies.set(`code_verifier_${provider}`, codeVerifier, {
    path: '/',
    secure: !dev,
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
    sameSite: 'lax'
  });

  throw redirect(302, authUrl.toString());
};
