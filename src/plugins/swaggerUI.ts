import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import fastifySwaggerUi from '@fastify/swagger-ui';

const swaggerPluginUI: FastifyPluginAsync = async (server) => {
  server.register(fastifySwaggerUi, {
    routePrefix: '/docs'
  })
}

export default fp(swaggerPluginUI);