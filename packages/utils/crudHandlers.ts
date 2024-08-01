import { type GlueEndpoints } from '@glue/types';
import { protectedRouteRedirectUrl } from '@glue/utils';
import { error, json, redirect, type RequestHandler } from '@sveltejs/kit';
import { and, eq, getTableColumns, inArray } from 'drizzle-orm';
import type { AnyPgTable } from 'drizzle-orm/pg-core';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

const deserializeRequestBody = async (request: Request, tableSchema: AnyPgTable) => {
  const columns = getTableColumns(tableSchema);
  const data: Record<string, any> = {};

  try {
    Object.entries(await request.json()).map(([column, value]) => {
      if (columns[column]?.dataType === 'date') {
        data[column] = new Date(value as string);
      } else {
        data[column] = value;
      }
    });
    return data;
  } catch (error) {
    return {};
  }
};

export const createHandlerFactory = (
  db: PostgresJsDatabase<Record<string, never>>,
  endpoints: GlueEndpoints
): RequestHandler => {
  const createHandler: RequestHandler = async ({ request, params, locals, url }) => {
    if (!locals.user) {
      return redirect(302, protectedRouteRedirectUrl(url));
    }

    const { table } = params;

    if (!endpoints) {
      throw error(500, 'Endpoint configs not configured');
    }

    if (!table) {
      throw error(400, 'Table name is required');
    }

    const tableSchema = endpoints[table].table;
    const requestBody = await deserializeRequestBody(request, tableSchema);

    if (!tableSchema) {
      throw error(400, 'Invalid table name');
    }

    try {
      const result = await db
        .insert(tableSchema)
        .values({ ...requestBody, userId: locals.user?.id });
      return json(result, { status: 201 });
    } catch (err) {
      console.log('err', err);
      throw error(500, 'Internal Server Error');
    }
  };

  return createHandler;
};

export const updateHandlerFactory = (
  db: PostgresJsDatabase<Record<string, never>>,
  endpoints: GlueEndpoints
): RequestHandler => {
  const updateHandler: RequestHandler = async ({ request, params, locals, url }) => {
    if (!locals.user) {
      return redirect(302, protectedRouteRedirectUrl(url));
    }

    const { table, id } = params;

    if (!endpoints) {
      throw error(500, 'Endpoint configs not configured');
    }

    if (!table) {
      throw error(400, 'Table name is required');
    }

    const tableSchema = endpoints[table].table;
    const requestBody = await deserializeRequestBody(request, tableSchema);

    if (!tableSchema) {
      throw error(400, 'Invalid table name');
    }

    if (requestBody.id) {
      throw error(400, 'id supplied to an update endpoint');
    }

    try {
      let result;

      if (id) {
        result = await db
          .update(tableSchema)
          .set(requestBody)
          .where(and(eq(tableSchema.id, id), eq(tableSchema.userId, locals.user?.id)))
          .returning();
      } else {
        // const result = await db
        //   .update(tableSchema)
        //   .set(requestBody)
        //   .where(and(inArray(tableSchema.id, ids), eq(tableSchema.userId, locals.user?.id)))
        //   .returning();
        throw error(500, 'Not implemented error');
      }

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
  endpoints: GlueEndpoints
): RequestHandler => {
  const deleteHandler: RequestHandler = async ({ request, locals, url, params }) => {
    if (!locals.user) {
      return redirect(302, protectedRouteRedirectUrl(url));
    }

    if (!endpoints) {
      throw error(500, 'Endpoint configs not configured');
    }

    const { table, id } = params;

    if (!table) {
      throw error(400, 'Table name is required');
    }

    const tableSchema = endpoints[table].table;

    if (!tableSchema) {
      throw error(400, 'Invalid table name');
    }

    try {
      let result;
      if (id) {
        console.log('condition');
        result = await db
          .delete(tableSchema)
          .where(and(eq(tableSchema.id, id), eq(tableSchema.userId, locals.user?.id)))
          .returning();
      } else {
        const requestBody = await deserializeRequestBody(request, tableSchema);

        if (!requestBody.ids) {
          throw error(400, 'ids required in request body');
        }

        const { ids } = requestBody;

        result = await db
          .delete(tableSchema)
          .where(and(inArray(tableSchema.id, ids), eq(tableSchema.userId, locals.user?.id)))
          .returning();
      }

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
