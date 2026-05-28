import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  verifyUser,
  creditUserBalance,
  debitUserBalance,
  createAdmin,
  deleteUser,
} from "../../services/admin.service";

import { requireAdmin, requireSuperAdmin } from "../../utils/guards";

import {
  UpdateUserStatusInput,
  VerifyUserInput,
  BalanceUpdateInput,
  CreateAdminInput,
} from "../../types/admin.types";

interface GraphQLContext {
  user?: {
    id: string;

    role: string;
  };
}

export const adminResolvers = {
  Query: {
    users: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAdmin(context);

      return getAllUsers();
    },

    user: async (
      _: unknown,
      args: {
        userId: string;
      },
      context: GraphQLContext,
    ) => {
      requireAdmin(context);

      return getUserById(args.userId);
    },
  },

  Mutation: {
    updateUserStatus: async (
      _: unknown,
      args: {
        input: UpdateUserStatusInput;
      },
      context: GraphQLContext,
    ) => {
      requireAdmin(context);

      return updateUserStatus(args.input);
    },

    verifyUser: async (
      _: unknown,
      args: {
        input: VerifyUserInput;
      },
      context: GraphQLContext,
    ) => {
      requireAdmin(context);

      return verifyUser(args.input);
    },

    creditUserBalance: async (
      _: unknown,
      args: {
        input: BalanceUpdateInput;
      },
      context: GraphQLContext,
    ) => {
      requireAdmin(context);

      return creditUserBalance(args.input);
    },

    debitUserBalance: async (
      _: unknown,
      args: {
        input: BalanceUpdateInput;
      },
      context: GraphQLContext,
    ) => {
      requireAdmin(context);

      return debitUserBalance(args.input);
    },

    createAdmin: async (
      _: unknown,
      args: {
        input: CreateAdminInput;
      },
      context: GraphQLContext,
    ) => {
      requireSuperAdmin(context);

      return createAdmin(args.input);
    },

    deleteUser: async (
      _: unknown,
      args: {
        userId: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireSuperAdmin(context);

      return deleteUser(args.userId, currentUser.id);
    },
  },
};
