import { authResolvers } from "./auth.resolver";
import { adminResolvers } from "./admin.resolver";
import { profileResolvers } from "./profile.resolver";
import { transactionResolvers } from "./transaction.resolver";
import { depositResolvers } from "./deposit.resolver";
import { wireTransferResolvers } from "./wireTransfer.resolver";
import { verificationResolvers } from "./verification.resolver";
import { notificationResolvers } from "./notification.resolver";
import { loanResolvers } from "./loan.resolver";
import { charityResolvers } from "./charity.resolver";
import { billPaymentResolvers } from "./billPayment.resolver";
import { grantResolvers } from "./grant.resolver";
import { activityLogResolvers } from "./activityLog.resolver";
import { GraphQLContext } from "../../types/context.types";

const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...adminResolvers.Query,
    ...profileResolvers.Query,
    ...transactionResolvers.Query,
    ...depositResolvers.Query,
    ...wireTransferResolvers.Query,
    ...verificationResolvers.Query,
    ...notificationResolvers.Query,
    ...loanResolvers.Query,
    ...charityResolvers.Query,
    ...billPaymentResolvers.Query,
    ...grantResolvers.Query,
    ...activityLogResolvers.Query,
  },

  Mutation: {
    ...authResolvers.Mutation,
    ...adminResolvers.Mutation,
    ...profileResolvers.Mutation,
    ...transactionResolvers.Mutation,
    ...depositResolvers.Mutation,
    ...wireTransferResolvers.Mutation,
    ...verificationResolvers.Mutation,
    ...loanResolvers.Mutation,
    ...charityResolvers.Mutation,
    ...billPaymentResolvers.Mutation,
    ...grantResolvers.Mutation,
  },

  User: {
    ssn: (
      user: {
        id?: string;
        _id?: { toString: () => string } | string;
        ssn?: string;
      },
      _: unknown,
      context: GraphQLContext,
    ) => {
      const currentUser = context?.user;

      if (!currentUser) {
        throw new Error("Unauthorized");
      }

      const userId =
        typeof user.id === "string"
          ? user.id
          : typeof user._id === "string"
            ? user._id
            : user._id?.toString();

      const isOwner = userId === currentUser.id;

      if (
        currentUser.role === "ADMIN" ||
        currentUser.role === "SUPER_ADMIN" ||
        isOwner
      ) {
        return user.ssn;
      }

      throw new Error("Forbidden");
    },
  },
};

export default resolvers;
