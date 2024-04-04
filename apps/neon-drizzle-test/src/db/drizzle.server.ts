import { NEON_DATABASE_URL } from '$env/static/private';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(NEON_DATABASE_URL);
const db = drizzle(sql);

export default db;
