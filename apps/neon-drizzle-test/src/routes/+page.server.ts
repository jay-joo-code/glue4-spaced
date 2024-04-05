import db from '$src/db/drizzle.server';
import { todosTable } from '$src/db/schema.server';
import { fail, type ServerLoad } from '@sveltejs/kit';
import { createInsertSchema } from 'drizzle-zod';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';
import { desc, like } from 'drizzle-orm';

const addTodoSchema = createInsertSchema(todosTable);

export const load: ServerLoad = async ({ url }) => {
  const fetchTodos = async () => {
    const searchQuery = url.searchParams.get('q');

    return await db
      .select()
      .from(todosTable)
      .where(searchQuery ? like(todosTable.text, `%${searchQuery}%`) : undefined)
      .orderBy(desc(todosTable.createdAt));
  };

  const addTodoForm = await superValidate(zod(addTodoSchema));

  return {
    todos: fetchTodos(),
    addTodoForm
  };
};

export const actions = {
  addTodo: async ({ request }) => {
    const form = await superValidate(request, zod(addTodoSchema));

    if (!form.valid) return fail(400, { form });

    await db.insert(todosTable).values(form.data);
    return message(form, 'Form posted successfully!');
  }
} satisfies Actions;
