import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import express from "express";
import http from "http";
import fs from "fs";
import expressPlaygroud from "graphql-playground-middleware-express";

import { resolvers } from "./graphql/resolvers.js";
const typeDefs = fs.readFileSync("./graphql/typeDefs.graphql", "utf-8");

import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

// Connection URL
const url = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017`;

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);

  try {
    // Connect DB
    const mongoDbClient = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const mongoDB = await connectDB(mongoDbClient);

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageGraphQLPlayground(),
      ],
      context: {
        db: mongoDB,
      },
    });

    await server.start();
    server.applyMiddleware({
      app,

      // By default, apollo-server hosts its GraphQL endpoint at the server root.
      // However, *other* Apollo Server packages host it at
      // /graphql. Optionally provide this to match apollo-server.
      path: "/graphql",
    });

    app.get("/", (req, res) => res.send("Welcome to PhotoSharing API"));
    app.get("/playground", expressPlaygroud.default({ endpoint: "/graphql" }));

    await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  } catch (error) {
    console.error(error);
  }
}

startApolloServer(typeDefs, resolvers);
