import { sequence } from '@sveltejs/kit/hooks';
import { handleErrorWithSentry, sentryHandle } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';
import { dev } from '$app/environment';

Sentry.init({
	environment: dev ? 'dev' : 'production',
	dsn: 'https://f3985e6e5b0cdaab2b15f47dc9b3c56c@o4506677615460352.ingest.sentry.io/4506677617491968',
	tracesSampleRate: 1.0
});

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(sentryHandle());

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
