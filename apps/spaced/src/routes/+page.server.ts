import db from '$lib/glue/db/drizzle.server';
import { categoryTable, flashcardTable } from '$lib/glue/db/schema.server';
import { protectedRouteRedirectUrl } from '@glue/utils';
import { redirect, type ServerLoad } from '@sveltejs/kit';
import { and, desc, eq, ilike, lte, sql } from 'drizzle-orm';

export const load: ServerLoad = async ({ url, locals }) => {
  if (!locals.user) {
    throw redirect(302, protectedRouteRedirectUrl(url));
  }

  const fetchFlashcards = async () => {
    if (!locals.user) return [];
    const query = url.searchParams.get('search');
    const categoryId = url.searchParams.get('category');
    const categoryCondition = categoryId ? [eq(flashcardTable.categoryId, categoryId)] : [];

    if (query) {
      const keywords = query.split(' ');
      const conditions = keywords.map((keyword) => ilike(flashcardTable.body, `%${keyword}%`));
      return await db
        .select()
        .from(flashcardTable)
        .where(and(eq(flashcardTable.userId, locals.user.id), ...categoryCondition, ...conditions))
        .orderBy(desc(flashcardTable.due));
    } else {
      return await db
        .select()
        .from(flashcardTable)
        .where(
          and(
            eq(flashcardTable.userId, locals.user.id),
            ...categoryCondition,
            lte(flashcardTable.due, new Date())
          )
        )
        .orderBy(desc(flashcardTable.due))
        .limit(5);
    }
  };

  const fetchCategories = async () => {
    if (!locals.user) return [];

    const categories = await db
      .select()
      .from(categoryTable)
      .where(eq(categoryTable.userId, locals.user.id));

    const counts = await db
      .select({
        categoryId: flashcardTable.categoryId,
        count: sql<number>`cast(count(${flashcardTable.id}) as int)`
      })
      .from(flashcardTable)
      .where(lte(flashcardTable.due, new Date()))
      .groupBy(flashcardTable.categoryId);

    const categoryCount: Record<string, number> = {};

    for (const count of counts) {
      if (count.categoryId) {
        categoryCount[count.categoryId] = count.count;
      }
    }

    return categories.map((category) => ({
      ...category,
      count: categoryCount[category.id] || 0
    }));
  };

  return {
    lazy: {
      flashcards: fetchFlashcards(),
      categories: fetchCategories()
    }
  };
};
