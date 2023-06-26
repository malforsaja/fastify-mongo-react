import fastify from 'fastify';
//import overview from 'fastify-overview';
import cors from '@fastify/cors'

import eventRoutesPlugin from 'routes/events/eventRoutesPlugin';
import config from 'plugins/config';
import mogndbPlugin from 'plugins/mongodb';
import eventAutohooksPlugin from 'routes/events/eventAutohooksPlugin';
import swagger from 'plugins/swagger';
import swaggerUI from 'plugins/swaggerUI';
import schemas from './routes/events/schemas/loader'
import routes from 'routes';

const server = fastify({
  ajv: {
    customOptions: {
      removeAdditional: "all",
      coerceTypes: true,
      useDefaults: true,
    }
  },
  logger: {
    level: process.env.LOG_LEVEL,
  },
});

await server.register(cors, { 
  origin: true,
})
//await server.register(overview);
await server.register(schemas);
await server.register(config);
await server.register(mogndbPlugin);
await server.register(swagger);
await server.register(swaggerUI);
await server.register(eventAutohooksPlugin);
await server.register(routes);
await server.register(eventRoutesPlugin);
await server.ready();

export default server;