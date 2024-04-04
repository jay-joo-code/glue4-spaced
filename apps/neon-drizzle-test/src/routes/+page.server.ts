import { fail, type ServerLoad } from '@sveltejs/kit';
import db from '$src/db/drizzle.server';
import { todosTable } from '$src/db/schema.server';
import type { Actions } from './$types';

export const load: ServerLoad = async ({}) => {
  const fetchTodos = async () => {
    const todos = await db.select().from(todosTable);
    return todos;
  };

  return {
    todos: fetchTodos()
  };
};

export const actions = {
  addTodo: async (event) => {
    const formData = await event.request.formData();
    const text = formData.get('text') as string;
    console.log('text', text);

    if (!text) {
      return fail(400, { message: 'Text is required' });
    }

    await db.insert(todosTable).values({
      text
    });

    return { message: 'Todo added successfully' };
  }
} satisfies Actions;
