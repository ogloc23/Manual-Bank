import { authResolvers } from "./auth.resolver";
import { adminResolvers } from "./admin.resolver";
import { profileResolvers } from "./profile.resolver";

const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...adminResolvers.Query,
    ...profileResolvers.Query,
  },

  Mutation: {
    ...authResolvers.Mutation,
    ...adminResolvers.Mutation,
    ...profileResolvers.Mutation,
  },
};

export default resolvers;
