import {
  getAllCharities,
  getUserCharities,
  createCharity,
} from "../../services/charity.service";
import { requireAuth, requireAdmin } from "../../utils/guards";
import { CreateCharityInput } from "../../types/charity.types";

interface GraphQLContext {
  user?: {
    id: string;
    role: string;
  };
}

export const charityResolvers = {
  Query: {
    charities: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAdmin(context);

      return getAllCharities();
    },

    myCharities: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return getUserCharities(currentUser.id);
    },
  },

  Mutation: {
    createCharity: async (
      _: unknown,
      args: {
        input: CreateCharityInput;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return createCharity(currentUser.id, args.input);
    },
  },
};
