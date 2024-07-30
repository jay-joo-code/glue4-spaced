import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/glue/db/schema.server.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL_POOLED!
  }
} satisfies Config;
