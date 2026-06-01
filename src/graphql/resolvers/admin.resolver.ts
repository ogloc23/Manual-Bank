import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  verifyUser,
  creditUserBalance,
  debitUserBalance,
  createAdmin,
  deleteUser,
  approveLoan,
  rejectLoan,
  approveCharity,
  rejectCharity,
  approveBillPayment,
  rejectBillPayment,
  approveDeposit,
  rejectDeposit,
  approveWireTransfer,
  rejectWireTransfer,
  approveVerification,
  rejectVerification,
} from "../../services/admin.service";

import { requireAdmin, requireSuperAdmin } from "../../utils/guards";

import {
  UpdateUserStatusInput,
  VerifyUserInput,
  BalanceUpdateInput,
  CreateAdminInput,
  ApproveLoanInput,
  RejectLoanInput,
  ApproveCharityInput,
  RejectCharityInput,
  ApproveBillPaymentInput,
  RejectBillPaymentInput,
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
      const currentUser = requireAdmin(context);

      return updateUserStatus(args.input, currentUser.id);
    },

    verifyUser: async (
      _: unknown,
      args: {
        input: VerifyUserInput;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return verifyUser(args.input, currentUser.id);
    },

    creditUserBalance: async (
      _: unknown,
      args: {
        input: BalanceUpdateInput;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return creditUserBalance(args.input, currentUser.id);
    },

    debitUserBalance: async (
      _: unknown,
      args: {
        input: BalanceUpdateInput;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return debitUserBalance(args.input, currentUser.id);
    },

    createAdmin: async (
      _: unknown,
      args: {
        input: CreateAdminInput;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireSuperAdmin(context);

      return createAdmin(args.input, currentUser.id);
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

    approveLoan: async (
      _: unknown,
      args: {
        loanId: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return approveLoan(args.loanId, currentUser.id);
    },

    rejectLoan: async (
      _: unknown,
      args: {
        loanId: string;
        remarks?: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return rejectLoan(args.loanId, args.remarks, currentUser.id);
    },

    approveCharity: async (
      _: unknown,
      args: {
        charityId: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return approveCharity(args.charityId, currentUser.id);
    },

    rejectCharity: async (
      _: unknown,
      args: {
        charityId: string;
        remarks?: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return rejectCharity(args.charityId, args.remarks, currentUser.id);
    },

    approveBillPayment: async (
      _: unknown,
      args: {
        billPaymentId: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return approveBillPayment(args.billPaymentId, currentUser.id);
    },

    rejectBillPayment: async (
      _: unknown,
      args: {
        billPaymentId: string;
        remarks?: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return rejectBillPayment(
        args.billPaymentId,
        args.remarks,
        currentUser.id,
      );
    },

    approveDeposit: async (
      _: unknown,
      args: {
        depositId: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return approveDeposit(args.depositId, currentUser.id);
    },

    rejectDeposit: async (
      _: unknown,
      args: {
        depositId: string;
        remarks?: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return rejectDeposit(args.depositId, args.remarks, currentUser.id);
    },

    approveWireTransfer: async (
      _: unknown,
      args: {
        wireTransferId: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return approveWireTransfer(args.wireTransferId, currentUser.id);
    },

    rejectWireTransfer: async (
      _: unknown,
      args: {
        wireTransferId: string;
        remarks?: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return rejectWireTransfer(
        args.wireTransferId,
        args.remarks,
        currentUser.id,
      );
    },

    approveVerification: async (
      _: unknown,
      args: {
        verificationId: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return approveVerification(args.verificationId, currentUser.id);
    },

    rejectVerification: async (
      _: unknown,
      args: {
        verificationId: string;
        remarks?: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return rejectVerification(
        args.verificationId,
        args.remarks,
        currentUser.id,
      );
    },
  },
};
