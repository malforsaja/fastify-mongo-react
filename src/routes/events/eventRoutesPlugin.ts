import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Type } from "@sinclair/typebox";
import { Event } from './eventDecorator';

import { ObjectId } from 'mongodb';

export default function eventRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions, done: () => void) {
  fastify.get('/events', {
    schema: {
      querystring: fastify.getSchema('schema:event:list:query'),
      response: {
        200: fastify.getSchema('schema:event:list:response'),
        400: fastify.getSchema('schema:common:validation-error'),
        500: fastify.getSchema('schema:common:internal-server-error'),
      }
    }
  }, async (request, reply) => {
    try {
      const { title, skip, limit } = request.query as unknown as { title: string, skip: number, limit: number };
      const events = await fastify.mongoDataSource.listEvents({ filter: { title }, skip, limit })
      reply.code(200)
      return { data: events, totalCount: events.length }
    } catch (error) {
      reply.status(500).send({
        error: 'InternalServerError',
        message: 'Something went wrong while fetching the events.',
      });
    }
  });

  fastify.post<{ Body: Event }>('/events', {
    schema: {
      body: fastify.getSchema('schema:event:create:body'),
      response: {
        201: fastify.getSchema('schema:event:create:response'),
        400: fastify.getSchema('schema:common:validation-error'),
        500: fastify.getSchema('schema:common:internal-server-error'),
      }
    }
  }, async (request, reply) => {
    try {
      const { title, notes, startTime, endTime } = request.body;
      if (!title || !startTime || !endTime) {
        return reply.status(400).send({
          error: 'ValidationError',
          message: 'The request body is missing required fields.',
        });
      }
      const isEventOverlaping = await fastify.mongoDataSource.isEventOverlap(request.body);
      if (isEventOverlaping) {
        return reply.status(400).send({
          error: 'EventOverlapError',
          message: 'The new event overlaps with existing events.',
        });
      }
      const event = await fastify.mongoDataSource.createEvent({
        title,
        notes,
        startTime,
        endTime
      });
      reply.code(201);
      return event;
    } catch (error) {
      reply.status(500).send({
        error: 'InternalServerErrror',
        message: 'An error occurred while creating the event.',
      });
    }
  });

  fastify.get<{ Params: { id: string } }>('/events/:id', {
    schema: {
      params: fastify.getSchema('schema:event:read:params'),
      response: {
        200: fastify.getSchema('schema:event'),
        400: fastify.getSchema('schema:common:validation-error'),
        404: fastify.getSchema('schema:event:not-found-error'),
        500: fastify.getSchema('schema:common:internal-server-error'),
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      if (!ObjectId.isValid(id)) {
        return reply.status(400).send({
          error: 'ValidationError',
          message: 'The request params is invalid.',
        });
      }
      const event = await fastify.mongoDataSource.readEvent(id);
      if (!event) {
        return reply.status(404).send({
          error: 'EventNotFoundError',
          message: 'The event with the given id was not found.',
        });
      }
      return event;
    } catch (error) {
      return reply.status(500).send({
        error: 'InternalServerErrror',
        message: 'An error occurred while fetching the event.',
      });
    }
  });

  fastify.put<{ Params: { id: string }; Body: Event }>('/events/:id', {
    schema: {
      params: fastify.getSchema('schema:event:read:params'),
      body: fastify.getSchema('schema:event:update:body'),
      response: {
        200: Type.Object({
          acknowledged: Type.Boolean(),
          modifiedCount: Type.Number(),
        }),
        400: fastify.getSchema('schema:common:validation-error'),
        500: fastify.getSchema('schema:common:internal-server-error'),
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      if (!ObjectId.isValid(id)) {
        return reply.status(400).send({
          error: 'ValidationError',
          message: 'The request params is invalid.',
        });
      }

      const { title, notes, startTime, endTime } = request.body;
      
      if (!title || !startTime || !endTime) {
        return reply.status(400).send({
          error: 'ValidationError',
          message: 'The request body is missing required fields.',
        });
      }
      const isEventOverlaping = await fastify.mongoDataSource.isEventOverlap(request.body, id);
      if (isEventOverlaping) {
        return reply.status(400).send({
          error: 'EventOverlapError',
          message: 'The event overlaps with existing events.',
        });
      }
      const updatedEvent = await fastify.mongoDataSource.updateEvent(id, {
        title,
        notes,
        startTime,
        endTime
      });
      
      return updatedEvent;
    } catch (error) {
      return reply.status(500).send({
        error: 'InternalServerErrror',
        message: 'An error occurred while updating the event.',
      });
    }
  });

  fastify.delete<{ Params: { id: string } }>('/events/:id', {
    schema: {
      params: fastify.getSchema('schema:event:read:params'),
      response: {
        200: Type.Object({
          acknowledged: Type.Boolean(),
          deletedCount: Type.Number(),
        }),
        400: fastify.getSchema('schema:common:validation-error'),
        500: fastify.getSchema('schema:common:internal-server-error'),
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      if (!ObjectId.isValid(id)) {
        return reply.status(400).send({
          error: 'ValidationError',
          message: 'The request params is invalid.',
        });
      }
      const deletedEvent = await fastify.mongoDataSource.deleteEvent(id);      
      return deletedEvent;
    } catch (error) {
      return reply.status(500).send({
        error: 'InternalServerErrror',
        message: 'An error occurred while deleting the event.',
      });
    }
  });
  done();
}
