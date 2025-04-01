import type { FastifyPluginAsync } from 'fastify';
import { status } from '../controllers/status';
import { user } from '../controllers/user';

const v1Routes: FastifyPluginAsync = async app => {
  app.register(status);
  app.register(user);
};

export default v1Routes;
