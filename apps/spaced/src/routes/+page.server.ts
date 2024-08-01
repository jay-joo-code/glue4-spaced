import db from '$lib/glue/db/drizzle.server';
import { flashcardTable } from '$lib/glue/db/schema.server';
import { protectedRouteRedirectUrl } from '@glue/utils';
import { redirect, type ServerLoad } from '@sveltejs/kit';
import { and, asc, desc, eq, gt, lte } from 'drizzle-orm';

export const load: ServerLoad = async ({ url, locals }) => {
  if (!locals.user) {
    return redirect(302, protectedRouteRedirectUrl(url));
  }

  const fetchTodayFlashcards = async () => {
    if (!locals.user) return [];

    const flashcards = await db
      .select()
      .from(flashcardTable)
      .where(and(eq(flashcardTable.userId, locals.user.id), lte(flashcardTable.due, new Date())))
      .orderBy(desc(flashcardTable.due))
      .limit(5);

    return flashcards;
  };

  const fetchUpcomingFlashcards = async () => {
    if (!locals.user) return [];

    const flashcards = await db
      .select()
      .from(flashcardTable)
      .where(and(eq(flashcardTable.userId, locals.user.id), gt(flashcardTable.due, new Date())))
      .orderBy(asc(flashcardTable.due))
      .limit(4);

    return flashcards;
  };

  return {
    todayFlashcards: await fetchTodayFlashcards(),
    upcomingFlashcards: await fetchUpcomingFlashcards()
  };
};
