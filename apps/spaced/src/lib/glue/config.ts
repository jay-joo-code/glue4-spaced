import IconCar from '$lib/icons/glue/IconCar.svelte';
import type { IPrivateNav, IPublicNav } from '$lib/types/glue/nav.type';

export const APP_NAME = 'Spaced';
export const PUBLIC_NAVS: IPublicNav[] = [
  {
    path: '/signin',
    label: 'Sign in'
  }
];
export const PRIVATE_NAVS: IPrivateNav[] = [
  {
    path: '/private-route',
    label: 'Test private route',
    icon: IconCar
  }
];
export const IS_ENFORCE_CORNELL_EMAIL = false;
export const IS_BETA = true;
export const SENTRY_DSN_PUBLIC = '';

// used in terms and conditions
export const ADMIN_EMAIL = 'cornellsentiment@gmail.com';
export const PROD_DOMAIN = 'https://glue4-spaced.vercel.app/';
