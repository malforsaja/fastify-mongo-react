import fp from "fastify-plugin";
import mongodb from "@fastify/mongodb";
import { FastifyPluginAsync } from "fastify";

const mongodbPlugin: FastifyPluginAsync = async (server) => {
  server.register(mongodb, {
    forceClose: true,
    url: process.env.MONGO_URL
  })
}

export default fp(mongodbPlugin, {
  dependencies: ['application-config']
});