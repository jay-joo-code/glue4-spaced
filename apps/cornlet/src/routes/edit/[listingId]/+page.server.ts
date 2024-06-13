import db from '$root/src/db/drizzle.server';
import { listingTable } from '$root/src/db/schema';
import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import { fail, redirect, type Actions, type ServerLoad } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const editListingSchema = createSelectSchema(listingTable, {
  bathrooms: (schema) => schema.bathrooms.step(0.5),
  propertyType: (schema) => schema.propertyType.default('studio')
});

export const load: ServerLoad = async ({ url, locals, params }) => {
  if (!locals.user) {
    return redirect(302, protectedRouteRedirectUrl(url));
  }

  const fetchForm = async () => {
    if (params.listingId) {
      const listing = (
        await db.select().from(listingTable).where(eq(listingTable.id, params.listingId))
      ).at(0);
      if (listing) {
        return await superValidate(listing, zod(editListingSchema));
      }
    }
  };

  return {
    form: await fetchForm()
  };
};

// export const actions = {
//   insertListing: async ({ request }) => {
//     const form = await superValidate(request, zod(editListingSchema));

//     if (!form.valid) return fail(400, { form });

//     await db.insert(listingTable).values(form.data);
//     return message(form, 'Form posted successfully!');
//   }
// } satisfies Actions;
