import { boolean, pgTable, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';

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

export const transactionTable = pgTable('transaction', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  amount: real('amount').notNull(),
  category: text('category'),
  categoryDetailed: text('category_detailed'),
  datetime: timestamp('datetime', { withTimezone: true }),
  usageDatetime: timestamp('usage_datetime', { withTimezone: true }),
  isChangedDatetime: boolean('is_changed_datetime').default(false),
  name: text('name').notNull(),
  merchantName: text('merchant_name').notNull(),
  merchantLogoUrl: text('logo_url'),
  isPending: boolean('is_pending').notNull()
});

export type InsertTransaction = typeof transactionTable.$inferInsert;
export type SelectTransaction = typeof transactionTable.$inferSelect;
