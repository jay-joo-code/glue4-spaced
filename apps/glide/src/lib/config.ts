import type { Nav } from '@glue/types';

export const APP_NAME = 'Glide';
export const PUBLIC_NAVS: Nav[] = [
  {
    label: 'Home',
    path: '/'
  },
  {
    label: 'Sign up',
    path: '/signup'
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
export const PRIVATE_NAVS: Nav[] = [
  {
    label: 'My reservations',
    path: '/profile/my-reservations'
  }
];
export const IS_GOOGLE_AUTH_ONLY = true;
export const IS_BETA = true;
export const SENTRY_DSN_PUBLIC = '';
// export const ADMIN_EMAIL = 'contact@revycarpool.com';
// export const PROD_DOMAIN = 'https://www.revycarpool.com';
