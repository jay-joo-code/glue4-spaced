import { dev } from '$app/environment';
import { NEON_DATABASE_URL_CACHED, NEON_DATABASE_URL_POOLED } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres(dev ? NEON_DATABASE_URL_POOLED : NEON_DATABASE_URL_CACHED);
const db = drizzle(queryClient);

export default db;
