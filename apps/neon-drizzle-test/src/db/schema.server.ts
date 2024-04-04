import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const todosTable = pgTable('todos', {
  id: uuid('id').defaultRandom().primaryKey(),
  text: text('text').notNull(),
  done: boolean('done').default(false).notNull()
});
