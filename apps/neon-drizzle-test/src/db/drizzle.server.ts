import { NEON_DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres(NEON_DATABASE_URL);
const db = drizzle(queryClient);

export default db;
