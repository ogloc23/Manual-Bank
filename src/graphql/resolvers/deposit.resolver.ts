import {
  getAllDeposits,
  getUserDeposits,
  createDeposit,
} from "../../services/deposit.service";
import { requireAuth, requireAdmin } from "../../utils/guards";
import { CreateDepositInput } from "../../types/transaction.types";

interface GraphQLContext {
  user?: {
    id: string;
    role: string;
  };
}

export const depositResolvers = {
  Query: {
    deposits: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAdmin(context);

      return getAllDeposits();
    },

    myDeposits: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return getUserDeposits(currentUser.id);
    },
  },

  Mutation: {
    createDeposit: async (
      _: unknown,
      args: {
        input: CreateDepositInput;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return createDeposit(currentUser.id, args.input);
    },
  },
};
