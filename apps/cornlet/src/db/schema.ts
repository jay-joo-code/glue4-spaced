import { boolean, date, pgEnum, pgTable, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { zod } from 'sveltekit-superforms/adapters';

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
  minsToOrg: real('mins_to_org').notNull(),
  propertyType: propertyTypeEnum('property_type').notNull(),
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
  isDeleted: boolean('is_deleted').default(false),
  photoUrls: text('photo_urls').array().notNull(),
  isRequireVerification: boolean('is_require_verification').default(false)
});

export type InsertListing = typeof listingTable.$inferInsert;
export type SelectListing = typeof listingTable.$inferInsert;

export const editListingSchema = createSelectSchema(listingTable, {
  bathrooms: (schema) => schema.bathrooms.step(0.5),
  propertyType: (schema) => schema.propertyType.default('studio')
});

export const editListingValidator = zod(editListingSchema);
