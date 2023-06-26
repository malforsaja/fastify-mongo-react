import Swagger from '@fastify/swagger'
import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

const swaggerPlugin: FastifyPluginAsync = async (server) => {
  server.register(Swagger, {
    swagger: {
      info: {
        title: 'App Documentation',
        description: 'Testing the Fastify swagger API',
        version: '1.0.0'
      },
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [{
        name: 'Events Endpoints',
      }]
    }
  })
}

export default fp(swaggerPlugin);