import { FastifyInstance } from 'fastify';
import { Collection, ObjectId } from 'mongodb';

export type Event = {
  _id?: ObjectId;
  id?: string;
  title: string;
  notes?: string;
  startTime: Date;
  endTime: Date;
  createdAt?: Date;
}

type DeleteEventResponse = {
  acknowledged: boolean,
  modifiedCount: number,
}

type UpdateEventResponse = {
  acknowledged: boolean,
  deletedCount: number,
}

interface MongoDataSource {
  isEventOverlap(event: Event, id?: string): Promise<boolean>;
  listEvents({ 
    filter,
    skip,
    limit,
   }: {
    filter?: { title: string };
    skip?: number;
    limit?: number;
   }): Promise<Event[]>;
  createEvent(event: {
    id?: string;
    title: string;
    notes?: string;
    startTime: Date;
    endTime: Date;
  }): Promise<{ id: string }>;
  readEvent(id: string): Promise<Event>;
  updateEvent(id: string, newEvent: Event): Promise<UpdateEventResponse>;
  deleteEvent(id: string): Promise<DeleteEventResponse>;
}

declare module 'fastify' {
  interface FastifyInstance {
    mongoDataSource: MongoDataSource;
  }
}

export function eventDecorator(fastify: FastifyInstance) {
  const events = fastify.mongo?.db?.collection('events') as Collection<Event>;

  fastify.decorate('mongoDataSource', {
    async isEventOverlap(event: Event, id: string): Promise<boolean> {
      const { startTime, endTime } = event;
      console.log('event', event);
        
      const overlappingEvent = await events.findOne({
        id: { $ne: id },
        $or: [
          {
            startTime: { $gte: startTime, $lt: endTime },
          },
          {
            endTime: { $gt: startTime, $lte: endTime },
          },
          {
            startTime: { $lte: startTime },
            endTime: { $gte: endTime },
          },
        ],
      });
      console.log('overlappingEvent', overlappingEvent);
      
      return !!overlappingEvent;
    },
    async listEvents({
      filter = {} as any,
      projection = {},
      skip = 0,
      limit = 50
    } = {}) {
      if (filter.title) {
        filter.title = new RegExp(filter.title, 'i');
      } else {
        delete filter.title;
      }
      return events.find(filter, {
        projection: { ...projection, _id: 0 },
        limit,
        skip
      }).toArray();
    },

    async createEvent({ title, notes, startTime, endTime }: Event) {
      const _id = new fastify.mongo.ObjectId();
      const { insertedId } = await events.insertOne({
        _id,
        id: _id.toString(),
        title,
        notes,
        startTime,
        endTime,
        createdAt: new Date()
      });
      return { id: insertedId };
    },

    async readEvent(id: ObjectId, projection = {}) {
      if (!ObjectId.isValid(id)) {
        return {
          statusCode: 400,
          code: 'CHECK_ERR_VALIDATION',
          error: 'Bad Request',
          message: 'id must be of type ObjectId'
        };
      }
      const event = await events.findOne(
        { _id: new fastify.mongo.ObjectId(id) },
        { projection: { ...projection, _id: 0 } }
      );
      return event;
    },

    async updateEvent(id: ObjectId, newEvent: Event) {
      return events.updateOne(
        { _id: new fastify.mongo.ObjectId(id) },
        {
          $set: {
            ...newEvent,
            modifiedAt: new Date()
          }
        }
      );
    },

    async deleteEvent(id: ObjectId) {
      return events.deleteOne({ _id: new fastify.mongo.ObjectId(id) });
    }
  });
}
