import { boolean, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

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
  cursor: text('cursor')
});

export const categoryTable = pgTable('category', {
  id: uuid('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  name: text('name').notNull()
});

export const transactionTable = pgTable('transaction', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  amount: numeric('amount').notNull(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categoryTable.id),
  datetime: timestamp('datetime', { withTimezone: true }).notNull(),
  authorizedDatetime: timestamp('authorized_datetime', { withTimezone: true }).notNull(),
  usageDatetime: timestamp('usage_datetime', { withTimezone: true }).notNull(),
  name: text('name').notNull(),
  rawName: text('raw_name').notNull(),
  merchantName: text('merchant_name').notNull(),
  merchantEntityId: text('merchant_entity_id').notNull(),
  merchantLogoUrl: text('logo_url').notNull(),
  merchantWebsite: text('merchant_website').notNull(),
  isPending: boolean('is_pending').notNull()
});
