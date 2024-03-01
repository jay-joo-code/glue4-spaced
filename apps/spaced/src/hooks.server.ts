import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_SENTRY_DSN
} from '$env/static/public';
import { PRIVATE_NAVS } from '$lib/glue/config';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

Sentry.init({
	dsn: dev ? undefined : PUBLIC_SENTRY_DSN,
	tracesSampleRate: 1.0
});

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	// private path protection
	const privatePaths = PRIVATE_NAVS.map((nav) => nav.path);
	const session = await event.locals.getSession();
	if (privatePaths?.includes(event.url.pathname)) {
		if (!session) {
			if (!event.url.searchParams.get('redirectTo')) {
				event.url.searchParams.set('redirectTo', event.url.pathname + event.url.search);
			}
			throw redirect(307, `/signin?${event.url.searchParams.toString()}`);
		}
	}

	return resolve(event, {
		/**
		 * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
		 *
		 * https://github.com/sveltejs/kit/issues/8061
		 */
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
});

export const handleError = Sentry.handleErrorWithSentry();
