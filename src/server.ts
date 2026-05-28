import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { connectDB } from "./config/db";
import resolvers from "./graphql/resolvers";
import { typeDefs } from "./graphql/schemas";
import { authMiddleware } from "./middlewares/authMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { createContext } from "./graphql/context";

const startServer = async () => {
  await connectDB();
  const app = express();

  app.use(
    cors({
      origin: true, // Allow all origins
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(authMiddleware);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: false,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => createContext({ req }),
    }),
  );

  app.use(errorMiddleware);

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
};

startServer();
