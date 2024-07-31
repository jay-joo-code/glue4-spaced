import glueConfig from '$lib/glue/config';
import db from '$lib/glue/db/drizzle.server';
import {
  createHandlerFactory,
  deleteHandlerFactory,
  updateHandlerFactory
} from '@glue/utils/crudHandlers';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = createHandlerFactory(db, glueConfig);
export const PUT: RequestHandler = updateHandlerFactory(db, glueConfig);
export const DELETE: RequestHandler = deleteHandlerFactory(db, glueConfig);
