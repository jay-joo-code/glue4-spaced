import db from '$lib/glue/db/drizzle.server';
import endpoints from '$lib/glue/endpoints';
import { createHandlerFactory, deleteHandlerFactory, updateHandlerFactory } from '@glue/utils';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = createHandlerFactory(db, endpoints);
export const PUT: RequestHandler = updateHandlerFactory(db, endpoints);
export const DELETE: RequestHandler = deleteHandlerFactory(db, endpoints);
