import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { eventDecorator } from './eventDecorator';

export default fp(async function eventAutoHooks(fastify: FastifyInstance) {
  eventDecorator(fastify);
});
