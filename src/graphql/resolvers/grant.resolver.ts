import {
  getAllGrants,
  getUserGrants,
  getGrantById,
  createGrant,
  reviewGrant,
  approveGrant,
  rejectGrant,
  disburseGrant,
} from "../../services/grant.service";
import { requireAuth, requireAdmin } from "../../utils/guards";
import { CreateGrantInput } from "../../types/grant.types";

interface GraphQLContext {
  user?: {
    id: string;
    role: string;
  };
}

export const grantResolvers = {
  Query: {
    grants: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAdmin(context);

      return getAllGrants();
    },

    myGrants: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return getUserGrants(currentUser.id);
    },

    getGrant: async (
      _: unknown,
      args: {
        grantId: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);
      const grant = await getGrantById(args.grantId);

      if (
        currentUser.role !== "ADMIN" &&
        currentUser.role !== "SUPER_ADMIN" &&
        grant.userId.toString() !== currentUser.id
      ) {
        throw new Error("Forbidden");
      }

      return grant;
    },
  },

  Mutation: {
    createGrant: async (
      _: unknown,
      args: {
        input: CreateGrantInput;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return createGrant(currentUser.id, args.input);
    },

    reviewGrant: async (
      _: unknown,
      args: {
        grantId: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return reviewGrant(args.grantId, currentUser.id);
    },

    approveGrant: async (
      _: unknown,
      args: {
        grantId: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return approveGrant(args.grantId, currentUser.id);
    },

    rejectGrant: async (
      _: unknown,
      args: {
        grantId: string;
        remarks?: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return rejectGrant(args.grantId, args.remarks, currentUser.id);
    },

    disburseGrant: async (
      _: unknown,
      args: {
        grantId: string;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAdmin(context);

      return disburseGrant(args.grantId, currentUser.id);
    },
  },
};
