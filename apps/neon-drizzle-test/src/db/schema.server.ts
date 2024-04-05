import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const todosTable = pgTable('todos', {
  id: uuid('id').defaultRandom().primaryKey(),
  text: text('text').notNull(),
  done: boolean('done').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});
