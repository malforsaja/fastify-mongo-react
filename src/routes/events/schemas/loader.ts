import fp from 'fastify-plugin';
import eventSchema from './event.json';
import listResponseSchema from './list-response.json';
import listQuerySchema from './list-query.json';
import createBodySchema from './create-body.json';
import createResponseSchema from './create-response.json';
import updateBodySchema from './update-body.json';
import readParamsSchema from './read-params.json';
import validationSchema from './validation-response.json';
import internalServerErrorSchema from './error-response.json';
import notFoundSchema from './not-found-error.json';
import { FastifyInstance } from 'fastify';

export default fp(async function schemaLoaderPlugin(fastify: FastifyInstance) {
  fastify.addSchema(eventSchema);
  fastify.addSchema(listResponseSchema);
  fastify.addSchema(listQuerySchema);
  fastify.addSchema(createBodySchema);
  fastify.addSchema(createResponseSchema);
  fastify.addSchema(updateBodySchema);
  fastify.addSchema(readParamsSchema);
  fastify.addSchema(validationSchema);
  fastify.addSchema(internalServerErrorSchema);
  fastify.addSchema(notFoundSchema);
});

