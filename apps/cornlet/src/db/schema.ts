import { boolean, date, pgEnum, pgTable, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: text('email').unique(),
  avatarUrl: text('avatar_url'),
  firstName: text('first_name'),
  lastName: text('last_name')
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

export const propertyTypeEnum = pgEnum('property_type_enum', ['apt', 'house', 'studio']);

export const listingTable = pgTable('listing', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),

  address: text('address').notNull(),
  lat: real('lat').notNull(),
  lng: real('lng').notNull(),
  minsToCampus: real('mins_to_campus').notNull(),
  propertyType: propertyTypeEnum('property_type'),
  totalRooms: real('total_rooms').notNull(),
  availableRooms: real('available_rooms').notNull(),
  bathrooms: real('bathrooms').notNull(),
  femaleRoommates: real('female_roommates').notNull(),
  maleRoommates: real('male_roommates').notNull(),
  nonbinaryRoommates: real('nonbinary_roommates').notNull(),
  desc: text('desc'),
  start: date('start').notNull(),
  end: date('end').notNull(),
  price: real('price').notNull(),
  isActive: boolean('is_active').default(true),
  isSold: boolean('is_sold').default(false),
  isDeleted: boolean('is_deleted').default(false)
  // imgs: json("imgs").notNullable().default(pgJson.array([])),
  // thumbnailIdx: decimal("thumbnail_idx", { precision: 64, scale: 0 }).notNullable(),
  // views: decimal("views", { precision: 64, scale: 0 }).notNullable().default(0),
});

export type InsertListing = typeof listingTable.$inferInsert;
