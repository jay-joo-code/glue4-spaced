import { dev } from '$app/environment';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';
import db from './drizzle.server';
import { sessionTable, userTable } from './schema';

export const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev
    }
  },
  getUserAttributes: (attributes) => {
    return {
      avatarUrl: attributes.avatarUrl,
      firstName: attributes.firstName,
      lastName: attributes.lastName
    };
  }
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
  interface DatabaseUserAttributes {
    avatarUrl?: string;
    firstName?: string;
    lastName?: string;
  }
}
