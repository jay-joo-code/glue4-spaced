import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: text('email')
});

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date'
  }).notNull()
});

export const itemTable = pgTable('item', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  institution: text('institution').notNull(),
  accessToken: text('access_token').notNull(),
  cursor: text('cursor'),
  plaidItemId: text('plaid_item_id').notNull()
});

export const flashcardTable = pgTable('flashcard', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),

  body: text('body'),
  due: timestamp('due', { precision: 6, withTimezone: true })
});

export type InsertFlashcard = typeof flashcardTable.$inferInsert;
export type SelectFlashcard = typeof flashcardTable.$inferSelect;
