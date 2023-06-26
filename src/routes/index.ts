import { Type } from '@sinclair/typebox';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.get('/', {
   schema: {
      response: {
        200: Type.Object({
          statusCode: Type.Integer(),
          status: Type.String(),
        }),
      },
    },
  }, async function (req, res) {
    res.code(200);
    return {statusCode: 200, status: "up" }
  });
}

export default routes;