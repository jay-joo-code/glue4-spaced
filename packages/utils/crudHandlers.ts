import { error, json, redirect, type RequestHandler, type RequestEvent } from '@sveltejs/kit';
import { protectedRouteRedirectUrl } from '@glue/utils';
import { and, inArray, eq } from 'drizzle-orm';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { type GlueConfig } from '@glue/types';

export const createHandlerFactory = (
  db: PostgresJsDatabase<Record<string, never>>,
  glueConfig: GlueConfig
): RequestHandler => {
  const createHandler: RequestHandler = async ({ request, params, locals, url }) => {
    if (!locals.user) {
      return redirect(302, protectedRouteRedirectUrl(url));
    }

    const { table } = params;

    if (!glueConfig.endpointConfigs) {
      throw error(500, 'Endpoint configs not configured');
    }

    if (!table) {
      throw error(400, 'Table name is required');
    }

    const tableSchema = glueConfig.endpointConfigs[table].table;
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

  return createHandler;
};

export const updateHandlerFactory = (
  db: PostgresJsDatabase<Record<string, never>>,
  glueConfig: GlueConfig
): RequestHandler => {
  const updateHandler: RequestHandler = async ({ request, params, locals, url }) => {
    if (!locals.user) {
      return redirect(302, protectedRouteRedirectUrl(url));
    }

    const { table } = params;
    const ids = url.searchParams.getAll('id');

    if (!glueConfig.endpointConfigs) {
      throw error(500, 'Endpoint configs not configured');
    }

    if (!table) {
      throw error(400, 'Table name is required');
    }

    const tableSchema = glueConfig.endpointConfigs[table].table;
    const data = await request.json();

    if (!tableSchema) {
      throw error(400, 'Invalid table name');
    }

    try {
      const result = await db
        .update(tableSchema)
        .set(data)
        .where(and(inArray(tableSchema.id, ids), eq(tableSchema.userId, locals.user?.id)))
        .returning();

      if (!result.length) {
        throw error(404, 'Records not found or you do not have permission to update them');
      }
      return json(result);
    } catch (err) {
      throw error(500, 'Internal Server Error');
    }
  };

  return updateHandler;
};

export const deleteHandlerFactory = (
  db: PostgresJsDatabase<Record<string, never>>,
  glueConfig: GlueConfig
): RequestHandler => {
  const deleteHandler: RequestHandler = async ({ locals, url, params }) => {
    if (!locals.user) {
      return redirect(302, protectedRouteRedirectUrl(url));
    }

    if (!glueConfig.endpointConfigs) {
      throw error(500, 'Endpoint configs not configured');
    }

    const { table } = params;
    const ids = url.searchParams.getAll('id');

    if (!table) {
      throw error(400, 'Table name is required');
    }

    const tableSchema = glueConfig.endpointConfigs[table].table;

    if (!tableSchema) {
      throw error(400, 'Invalid table name');
    }

    try {
      const result = await db
        .delete(tableSchema)
        .where(and(inArray(tableSchema.id, ids), eq(tableSchema.userId, locals.user?.id)))
        .returning();

      if (!result.length) {
        throw error(404, 'Records not found or you do not have permission to delete them');
      }
      return json({ message: 'Records deleted successfully' });
    } catch (err) {
      throw error(500, 'Internal Server Error');
    }
  };

  return deleteHandler;
};
