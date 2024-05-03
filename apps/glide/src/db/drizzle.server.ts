import { dev } from '$app/environment';
import { NEON_DATABASE_URL_POOLED } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres(NEON_DATABASE_URL_POOLED);
const db = drizzle(queryClient);

export default db;
