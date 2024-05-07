import {
  boolean,
  date,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  type AnyPgColumn
} from 'drizzle-orm/pg-core';

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
  date: date('date'),
  usageDate: date('usage_date'),
  isChangedDate: boolean('is_changed_date').default(false),
  name: text('name').notNull(),
  merchantName: text('merchant_name'),
  merchantLogoUrl: text('logo_url'),
  isIgnore: boolean('is_ignore').default(false),
  source: text('source').notNull(),
  identifier: text('identifier').unique().notNull(), // immutable contact of date_name_amount
  isPendingRefund: boolean('is_pending_refund').default(false),
  displayName: text('display_name').notNull(),
  isRecurring: boolean('is_recurring').default(false),
  refundId: uuid('refund_id').references((): AnyPgColumn => transactionTable.id) // id of transaction receiving refund
});

export type InsertTransaction = typeof transactionTable.$inferInsert;
export type SelectTransaction = typeof transactionTable.$inferSelect;

export const recurringTable = pgTable('recurring', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  baseName: text('base_name').notNull(),
  baseAmount: real('base_amount').notNull()
});
