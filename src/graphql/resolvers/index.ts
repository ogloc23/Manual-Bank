import { authResolvers } from "./auth.resolver";
import { adminResolvers } from "./admin.resolver";

const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...adminResolvers.Query,
  },

  Mutation: {
    ...authResolvers.Mutation,
    ...adminResolvers.Mutation,
  },
};

export default resolvers;
