import { GlueConfig } from '@glue/types';

const createGlueConfig = (config: GlueConfig) => {
  return {
    isBeta: true,
    ...config
  };
};

export default createGlueConfig;
