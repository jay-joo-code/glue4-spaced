import db from '$root/src/db/drizzle.server';
import { ridesTable } from '$root/src/db/schema.server';
import type { ServerLoad } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const ridesSchema = createInsertSchema(ridesTable);

export const load: ServerLoad = async ({}) => {
  const fetchRides = async () => {
    return await db.select().from(ridesTable).orderBy(desc(ridesTable.createdAt));
  };

  return {
    rides: fetchRides(),
    form: await superValidate(zod(ridesSchema))
  };
};
