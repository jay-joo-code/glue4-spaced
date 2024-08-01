import db from '$lib/glue/db/drizzle.server';
import { flashcardTable } from '$lib/glue/db/schema.server';
import { protectedRouteRedirectUrl } from '@glue/utils';
import { redirect, type ServerLoad } from '@sveltejs/kit';
import { and, desc, eq, ilike, lte, or } from 'drizzle-orm';

export const load: ServerLoad = async ({ url, locals, params }) => {
  if (!locals.user) {
    throw redirect(302, protectedRouteRedirectUrl(url));
  }

  const fetchFlashcards = async () => {
    if (!locals.user) return [];
    const query = url.searchParams.get('search');

    if (query) {
      const keywords = query.split(' ');
      const conditions = keywords.map((keyword) => ilike(flashcardTable.body, `%${keyword}%`));
      return await db
        .select()
        .from(flashcardTable)
        .where(and(eq(flashcardTable.userId, locals.user.id), ...conditions))
        .orderBy(desc(flashcardTable.due));
    } else {
      return await db
        .select()
        .from(flashcardTable)
        .where(and(eq(flashcardTable.userId, locals.user.id), lte(flashcardTable.due, new Date())))
        .orderBy(desc(flashcardTable.due))
        .limit(5);
    }
  };

  return {
    flashcards: await fetchFlashcards()
  };
};
