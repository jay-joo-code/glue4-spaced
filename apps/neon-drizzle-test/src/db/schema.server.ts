import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const todosTable = pgTable('todos', {
  id: uuid('id').defaultRandom().primaryKey(),
  text: text('text').notNull(),
  done: boolean('done').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export const userTable = pgTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  password: text('password').notNull()
});

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date'
  }).notNull()
});

export const ridesTable = pgTable('rides', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  origin: text('text').notNull(),
  destination: text('text').notNull(),
  price: integer('text').notNull(),
  datetime: timestamp('timestamp1', { withTimezone: true }).notNull()
});
