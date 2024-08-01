import { GlueEndpoints } from '@glue/types';
import { categoryTable, flashcardTable } from './db/schema.server';

const endpoints = {
  flashcard: {
    table: flashcardTable
  },
  category: {
    table: categoryTable
  }
} satisfies GlueEndpoints;

export default endpoints;
