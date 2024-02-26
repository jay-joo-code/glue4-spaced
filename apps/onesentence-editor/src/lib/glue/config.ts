import IconCar from '$lib/icons/glue/IconCar.svelte';
import IconDriverWheel from '$lib/icons/glue/IconDriverWheel.svelte';
import IconMessage from '$lib/icons/glue/IconMessage.svelte';
import type { IPublicNav, IPrivateNav } from '$lib/types/glue/nav.type';

export const APP_NAME = 'OneSentence';
export const PUBLIC_NAVS: IPublicNav[] = [
	{
		label: 'Home',
		path: '/'
	},
	{
		label: 'Terms and Conditions',
		path: '/terms-conditions'
	},
	{
		label: 'Privacy Policy',
		path: '/privacy-policy'
	}
];
export const PRIVATE_NAVS: IPrivateNav[] = [
	{
		label: 'My reservations',
		path: '/profile/my-reservations',
		icon: IconCar
	},
	{
		label: 'Messages',
		path: '/chatrooms/list',
		icon: IconMessage
	},
	{
		label: 'Driver dashboard',
		path: '/driver-dashboard',
		icon: IconDriverWheel
	}
];
export const IS_GOOGLE_AUTH_ONLY = true;
export const IS_ENFORCE_CORNELL_EMAIL = false;
export const IS_BETA = true;
export const SENTRY_DSN_PUBLIC = '';
export const ADMIN_EMAIL = 'contact@revycarpool.com';
export const PROD_DOMAIN = 'https://www.revycarpool.com';
