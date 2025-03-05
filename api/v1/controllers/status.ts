import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getHandler } from '../services/status';
import { statusSchema } from '../schemas/statusSchema';

export const status: FastifyPluginAsyncZod = async app => {
  app.get(
    '/status',
    {
      schema: {
        tags: ['application status'],
        description: 'Return the application status',
        response: {
          200: statusSchema,
        },
      },
    },
    async (request, response) => {
      const applicationStatus = await getHandler();

      return response.status(200).send(applicationStatus);
    }
  );
};
