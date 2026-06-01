import {
  getAllBillPayments,
  getUserBillPayments,
  payBill,
} from "../../services/billPayment.service";
import { requireAuth, requireAdmin } from "../../utils/guards";
import { CreateBillPaymentInput } from "../../types/billPayment.types";

interface GraphQLContext {
  user?: {
    id: string;
    role: string;
  };
}

export const billPaymentResolvers = {
  Query: {
    billPayments: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAdmin(context);

      return getAllBillPayments();
    },

    myBillPayments: async (
      _: unknown,
      __: unknown,
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return getUserBillPayments(currentUser.id);
    },
  },

  Mutation: {
    payBill: async (
      _: unknown,
      args: {
        input: CreateBillPaymentInput;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return payBill(currentUser.id, args.input);
    },
  },
};
