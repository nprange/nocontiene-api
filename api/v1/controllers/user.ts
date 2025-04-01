import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import userService from '../services/user';
import {
  userSchema,
  getUserByUsernameParamsSchema,
  userInputSchema,
} from '../schemas/userSchema';

export const user: FastifyPluginAsyncZod = async app => {
  app.post(
    '/users',
    {
      schema: {
        tags: ['users'],
        description: 'Create an user',
        response: {
          201: userSchema,
        },
      },
    },
    async (request, response) => {
      const userInputValues = userInputSchema.parse(request.body);
      const createdUser = await userService.create(userInputValues);

      return response.status(201).send(createdUser);
    }
  );

  app.get(
    '/users/:username',
    {
      schema: {
        tags: ['users'],
        description: 'Get an user by username',
        params: getUserByUsernameParamsSchema,
        response: {
          200: userSchema,
        },
      },
    },
    async (request, response) => {
      const { username } = getUserByUsernameParamsSchema.parse(request.params);
      const userFound = await userService.findOneByUsername(username);

      return response.status(200).send(userFound);
    }
  );
};
