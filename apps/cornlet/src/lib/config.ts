import type { ActionButton, FooterNav, Nav } from '@glue/types';

export const APP_NAME = 'Cornlet';
export const PUBLIC_NAVS: Nav[] = [];
export const PRIVATE_NAVS: Nav[] = [
  {
    label: 'My reservations',
    href: '/profile/my-reservations'
  }
];
export const FOOTER_NAVS: FooterNav[] = [
  {
    heading: 'Legal',
    nav: [
      {
        label: 'Terms and Conditions',
        href: '/terms-conditions'
      },
      {
        label: 'Privacy Policy',
        href: '/privacy-policy'
      }
    ]
  }
];
export const ACTION_BUTTONS_AUTHED: ActionButton[] = [
  {
    label: 'Sign out',
    href: '/logout',
    variant: 'ghost'
  }
];
export const ACTION_BUTTONS_UNAUTHED: ActionButton[] = [
  {
    label: 'Sign in',
    href: '/login',
    variant: 'ghost'
  }
];
export const IS_GOOGLE_AUTH_ONLY = true;
export const IS_BETA = true;
export const SENTRY_DSN_PUBLIC = '';
export const ADMIN_EMAIL = 'glide.contact.team@gmail.com';
// export const PROD_DOMAIN = 'https://www.revycarpool.com';
