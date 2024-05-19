import db from '$root/src/db/drizzle.server';
import { listingTable } from '$root/src/db/schema';
import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import { fail, redirect, type Actions, type ServerLoad } from '@sveltejs/kit';
import { createInsertSchema } from 'drizzle-zod';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const insertListingSchema = createInsertSchema(listingTable, {
  bathrooms: (schema) => schema.bathrooms.step(0.5)
});

export const load: ServerLoad = async ({ url, locals }) => {
  if (!locals.user) {
    return redirect(302, protectedRouteRedirectUrl(url));
  }

  return {
    form: await superValidate(zod(insertListingSchema))
  };
};

export const actions = {
  insertListing: async ({ request }) => {
    const form = await superValidate(request, zod(insertListingSchema));

    if (!form.valid) return fail(400, { form });

    await db.insert(listingTable).values(form.data);
    return message(form, 'Form posted successfully!');
  }
} satisfies Actions;
