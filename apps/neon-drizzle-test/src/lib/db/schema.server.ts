import { integer, text, boolean, pgTable } from 'drizzle-orm/pg-core';

export const todo = pgTable('todo', {
  id: integer('id').primaryKey(),
  text: text('text').notNull(),
  done: boolean('done').default(false).notNull()
});

export type Todo = typeof todo.$inferSelect;
export type NewTodo = typeof todo.$inferInsert;
