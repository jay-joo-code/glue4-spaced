import db from '$root/src/db/drizzle.server';
import { protectedRouteRedirectUrl } from '$root/src/lib/util/auth';
import { ENDPOINT_CONFIGS } from '$root/src/lib/config';
import { error, json, redirect, type RequestHandler } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, params, locals, url }) => {
  if (!locals.user) {
    return redirect(302, protectedRouteRedirectUrl(url));
  }

  const { table } = params;

  if (!table) {
    throw error(400, 'Table name is required');
  }

  const tableSchema = ENDPOINT_CONFIGS[table].table;
  const data = await request.json();

  if (!tableSchema) {
    throw error(400, 'Invalid table name');
  }

  try {
    const result = await db.insert(tableSchema).values({ ...data, userId: locals.user?.id });
    return json(result, { status: 201 });
  } catch (err) {
    throw error(500, 'Internal Server Error');
  }
};

export const PUT: RequestHandler = async ({ request, params, locals, url }) => {
  if (!locals.user) {
    return redirect(302, protectedRouteRedirectUrl(url));
  }

  const { table, id } = params;

  if (!table) {
    throw error(400, 'Table name is required');
  }

  const tableSchema = ENDPOINT_CONFIGS[table].table;
  const data = await request.json();

  if (!tableSchema) {
    throw error(400, 'Invalid table name');
  }

  try {
    const [result] = await db
      .update(tableSchema)
      .set(data)
      .where(and(eq(tableSchema.id, id), eq(tableSchema.userId, locals.user?.id)))
      .returning();

    if (!result) {
      throw error(404, 'Record not found or you do not have permission to update it');
    }
    return json(result);
  } catch (err) {
    throw error(500, 'Internal Server Error');
  }
};

export const DELETE: RequestHandler = async ({ params, locals, url }) => {
  if (!locals.user) {
    return redirect(302, protectedRouteRedirectUrl(url));
  }

  const { table, id } = params;

  if (!table) {
    throw error(400, 'Table name is required');
  }

  const tableSchema = ENDPOINT_CONFIGS[table].table;

  if (!tableSchema) {
    throw error(400, 'Invalid table name');
  }

  try {
    const [result] = await db
      .delete(tableSchema)
      .where(and(eq(tableSchema.id, id), eq(tableSchema.userId, locals.user?.id)))
      .returning();

    if (!result) {
      throw error(404, 'Record not found or you do not have permission to delete it');
    }
    return json({ message: 'Record deleted successfully' });
  } catch (err) {
    throw error(500, 'Internal Server Error');
  }
};
