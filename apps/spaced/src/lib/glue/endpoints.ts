import { GlueEndpoints } from '@glue/types';
import { flashcardTable } from './db/schema.server';

const endpoints = {
  flashcard: {
    table: flashcardTable
  }
} satisfies GlueEndpoints;

export default endpoints;
