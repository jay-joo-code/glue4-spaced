import { createGlueConfig } from '@glue/utils';
import { flashcardTable } from './db/schema.server';

const config = createGlueConfig({
  appName: 'Spaced',
  adminEmail: 'cornellsentiment@gmail.com',
  prodDomain: 'https://glue4-spaced.vercel.app/',

  endpointConfigs: {
    flashcard: {
      table: flashcardTable
    }
  }
});

export default config;
