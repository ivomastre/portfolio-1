/* eslint-disable no-console */
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import http from "http";

import App from "./app";
import { NODE_ENV, PORT } from "./config/env";
import createConnection from "./database";

async function setup() {
  const app = new App().express;
  const httpServer = http.createServer(app);

  const schema = await buildSchema({
    resolvers: [__dirname + "/resolvers/**/*.ts"],
  });

  const apolloServer = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await createConnection();

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  httpServer.listen({ port: PORT }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
  });
}

setup();
