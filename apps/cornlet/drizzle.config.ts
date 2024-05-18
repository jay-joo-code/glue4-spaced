import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.server.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.NEON_DATABASE_URL_POOLED!
  }
} satisfies Config;
