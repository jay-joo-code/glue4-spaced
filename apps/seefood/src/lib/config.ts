import type { ActionButton, FooterNav, Nav } from '@glue/types';
import type { AnyPgTable } from 'drizzle-orm/pg-core';

export const APP_NAME = 'Seefood';
export const PUBLIC_NAVS: Nav[] = [];
export const PRIVATE_NAVS: Nav[] = [];
export const AVATAR_NAVS: Nav[] = [];
export const FOOTER_NAVS: FooterNav[] = [];
export const ACTION_BUTTONS_AUTHED: ActionButton[] = [];
export const ACTION_BUTTONS_UNAUTHED: ActionButton[] = [];
export const IS_GOOGLE_AUTH_ONLY = true;
export const IS_BETA = true;
export const SENTRY_DSN_PUBLIC = '';
export const ADMIN_EMAIL = 'seefood.team.contact@gmail.com';

export const ENDPOINT_CONFIGS: Record<string, { table: AnyPgTable }> = {};
