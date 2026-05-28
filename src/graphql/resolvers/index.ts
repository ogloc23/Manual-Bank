import { authResolvers } from "./auth.resolver";

const resolvers = {
  Query: {
    ...authResolvers.Query,
  },

  Mutation: {
    ...authResolvers.Mutation,
  },
};

export default resolvers;