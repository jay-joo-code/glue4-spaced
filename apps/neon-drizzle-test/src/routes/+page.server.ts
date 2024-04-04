import type { ServerLoad } from '@sveltejs/kit';
import db from '$src/db/drizzle.server';
import { todo } from '$src/db/schema.server';

export const load: ServerLoad = async ({}) => {
  const fetchTodos = async () => {
    return await db.select().from(todo);
  };

  return {
    todos: fetchTodos()
  };
};
