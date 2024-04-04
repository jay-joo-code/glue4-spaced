import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.server.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.NEON_DATABASE_URL!
  }
} satisfies Config;
