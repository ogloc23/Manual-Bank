import {
  createWireTransfer,
  getTransactions,
  getMyTransactions,
  getTransaction,
  approveTransaction,
  rejectTransaction,
} from "../../services/transaction.service";

import {
  requireAuth,
  requireAdmin,
} from "../../utils/guards";

import {
  CreateWireTransferInput,
} from "../../types/transaction.types";

interface GraphQLContext {
  user?: {
    id: string;
    role: string;
  };
}

export const transactionResolvers =
  {
    Query: {
      transactions: async (
        _: unknown,
        __: unknown,
        context: GraphQLContext,
      ) => {
        requireAdmin(context);

        return getTransactions();
      },

      myTransactions: async (
        _: unknown,
        __: unknown,
        context: GraphQLContext,
      ) => {
        const user =
          requireAuth(context);

        return getMyTransactions(
          user.id,
        );
      },

      getTransaction: async (
        _: unknown,
        args: {
          transactionId: string;
        },
        context: GraphQLContext,
      ) => {
        requireAuth(context);

        return getTransaction(
          args.transactionId,
        );
      },
    },

    Mutation: {
      createWireTransfer:
        async (
          _: unknown,
          args: {
            input: CreateWireTransferInput;
          },
          context: GraphQLContext,
        ) => {
          const user =
            requireAuth(
              context,
            );

          return createWireTransfer(
            user.id,
            args.input,
          );
        },

      approveTransaction:
        async (
          _: unknown,
          args: {
            transactionId: string;
          },
          context: GraphQLContext,
        ) => {
          const admin =
            requireAdmin(
              context,
            );

          return approveTransaction(
            args.transactionId,
            admin.id,
          );
        },

      rejectTransaction:
        async (
          _: unknown,
          args: {
            transactionId: string;
            remarks?: string;
          },
          context: GraphQLContext,
        ) => {
          requireAdmin(context);

          return rejectTransaction(
            args.transactionId,
            args.remarks,
          );
        },
    },
  };