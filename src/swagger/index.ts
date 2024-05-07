import { usersExamples } from './users-docs';
import { betsExamples } from './bets-docs';
import swaggerAutogen from 'swagger-autogen';

import { coinsSchemas, coinsExamples } from './coins-docs';

const outputFile = './swagger_output.json';
const endpointsFiles = ['src/routes/index.ts'];

const baseUrl = (process.env.APP_API_URL || '').replace(/^https?:\/\//i, '');

const doc = {
  info: {
    version: '1.0.0',
    title: 'API',
    description: 'System documentation',
  },
  host: baseUrl,
  schemes: ['http', 'https'],
  tags: [
    {
      name: 'Coins',
      description: 'Relates the coin endpoints with token information',
    },
    {
      name: 'Bets',
      description: 'Relates the betting endpoints',
    },
    {
      name: 'Users',
      description: 'Relates the user endpoints',
    },
    {
      name: 'Comments',
      description: 'Relates the comment endpoints',
    },
  ],
  components: {
    schemas: {
      ...coinsSchemas,
    },
    examples: {
      ...coinsExamples,
      ...betsExamples,
      ...usersExamples,
    },
  },
};

swaggerAutogen({ openapi: '3.0.0', language: 'pt-BR' })(
  outputFile,
  endpointsFiles,
  doc,
);
