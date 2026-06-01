import {
  getAllWireTransfers,
  getUserWireTransfers,
  createWireTransfer,
} from "../../services/wireTransfer.service";
import { requireAuth, requireAdmin } from "../../utils/guards";
import { CreateWireTransferInput } from "../../types/transaction.types";

interface GraphQLContext {
  user?: {
    id: string;
    role: string;
  };
}

export const wireTransferResolvers = {
  Query: {
    wireTransfers: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAdmin(context);

      return getAllWireTransfers();
    },

    myWireTransfers: async (
      _: unknown,
      __: unknown,
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return getUserWireTransfers(currentUser.id);
    },
  },

  Mutation: {
    createWireTransfer: async (
      _: unknown,
      args: {
        input: CreateWireTransferInput;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return createWireTransfer(currentUser.id, args.input);
    },
  },
};
