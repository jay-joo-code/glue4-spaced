import { json, redirect, RequestHandler } from '@sveltejs/kit';
import { protectedRouteRedirectUrl } from '@glue/utils';
import db from '$lib/glue/db/drizzle.server';
import { flashcardTable } from '$lib/glue/db/schema.server';

export const POST: RequestHandler = async ({ request, url, locals }) => {
  if (!locals.user) return redirect(302, protectedRouteRedirectUrl(url));
  const { flashcards } = await request.json();
  const userId = 'af053c71-3436-4b52-9433-f5221226d266';
  const parsedFlashcards = flashcards.map((flashcard) => ({
    userId,
    createdAt: new Date(flashcard.createdAt),

    body: flashcard.body,
    due: new Date(flashcard.due)
  }));
  console.log('flashcards.length', parsedFlashcards[0]);

  // const savedFlashcards = await db.insert(flashcardTable).values(parsedFlashcards).returning();
  // console.log('savedFlashcards', savedFlashcards.length);

  return json([]);
};
