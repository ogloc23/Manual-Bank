import {
  getVerifications,
  getMyVerification,
  submitVerification,
} from "../../services/verification.service";
import { requireAuth, requireAdmin } from "../../utils/guards";
import { CreateVerificationInput } from "../../types/verification.types";

interface GraphQLContext {
  user?: {
    id: string;
    role: string;
  };
}

export const verificationResolvers = {
  Query: {
    verifications: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAdmin(context);

      return getVerifications();
    },

    myVerification: async (
      _: unknown,
      __: unknown,
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return getMyVerification(currentUser.id);
    },
  },

  Mutation: {
    submitVerification: async (
      _: unknown,
      args: {
        input: CreateVerificationInput;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return submitVerification(currentUser.id, args.input);
    },
  },
};
