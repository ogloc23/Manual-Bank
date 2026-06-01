import {
  getAllLoans,
  getUserLoans,
  applyForLoan,
} from "../../services/loan.service";
import { requireAuth, requireAdmin } from "../../utils/guards";
import { CreateLoanInput } from "../../types/loan.types";

interface GraphQLContext {
  user?: {
    id: string;
    role: string;
  };
}

export const loanResolvers = {
  Query: {
    loans: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAdmin(context);

      return getAllLoans();
    },

    myLoans: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return getUserLoans(currentUser.id);
    },
  },

  Mutation: {
    applyForLoan: async (
      _: unknown,
      args: {
        input: CreateLoanInput;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return applyForLoan(currentUser.id, args.input);
    },
  },
};
