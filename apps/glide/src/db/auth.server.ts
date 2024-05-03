import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import db from './drizzle.server';
import { sessionTable, userTable } from './schema.server';
import { Google } from 'arctic';

export const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev
    }
  }
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
