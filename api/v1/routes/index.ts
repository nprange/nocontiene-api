import type { FastifyPluginAsync } from 'fastify';
import { status } from '../controllers/status';

const v1Routes: FastifyPluginAsync = async app => {
  app.register(status);
};

export default v1Routes;
