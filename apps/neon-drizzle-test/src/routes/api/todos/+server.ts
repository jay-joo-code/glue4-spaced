import db from '$root/src/db/drizzle.server';
import { todosTable } from '$root/src/db/schema.server';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request }) => {
  const { todoId } = await request.json();
  const result = await db.delete(todosTable).where(eq(todosTable.id, todoId)).returning();
  return json(result);
};

export const PUT: RequestHandler = async ({ request }) => {
  const { id, text } = await request.json();
  const result = await db.update(todosTable).set({ text }).where(eq(todosTable.id, id)).returning();
  return json(result);
};
