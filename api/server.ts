import fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { fastifyCors } from '@fastify/cors';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import v1Routes from './v1/routes';
import {
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  ServiceError,
  ValidationError,
} from 'infra/errors';

const routeRegistry = new Map<string, Set<string>>();
const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: '*',
});

app.addHook('onRoute', routeOptions => {
  const url = routeOptions.url;
  const methods = Array.isArray(routeOptions.method)
    ? routeOptions.method.map(m => m.toUpperCase())
    : [routeOptions.method.toUpperCase()];

  if (!routeRegistry.has(url)) {
    routeRegistry.set(url, new Set());
  }
  for (const method of methods) {
    routeRegistry.get(url)?.add(method);
  }
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler((error, request, response) => {
  if (
    error instanceof MethodNotAllowedError ||
    error instanceof NotFoundError ||
    error instanceof ServiceError ||
    error instanceof ValidationError
  ) {
    return response.status(error.statusCode).send(error.toJSON());
  }

  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.error(publicErrorObject);

  response.status(publicErrorObject.statusCode).send(publicErrorObject);
});

app.setNotFoundHandler((request, response) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);
  let publicErrorObject: MethodNotAllowedError | NotFoundError;

  if (pathname && routeRegistry.has(pathname)) {
    publicErrorObject = new MethodNotAllowedError();
  } else {
    publicErrorObject = new NotFoundError({});
  }

  response.status(publicErrorObject.statusCode).send(publicErrorObject);
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Nocontiene',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(v1Routes, { prefix: '/api/v1' });

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Http server running on port 3333.');
  });
