import {
  getProfile,
  updateProfile,
  changePassword,
  changeAccessPin,
  updateNotificationPreferences,
} from "../../services/profile.service";

import { requireAuth } from "../../utils/guards";

import {
  UpdateProfileInput,
  ChangePasswordInput,
  ChangeAccessPinInput,
  UpdateNotificationPreferencesInput,
} from "../../types/profile.types";

interface GraphQLContext {
  user?: {
    id: string;

    role: string;
  };
}

export const profileResolvers = {
  Query: {
    profile: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return getProfile(currentUser.id);
    },
  },

  Mutation: {
    updateProfile: async (
      _: unknown,
      args: {
        input: UpdateProfileInput;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return updateProfile(currentUser.id, args.input);
    },

    changePassword: async (
      _: unknown,
      args: {
        input: ChangePasswordInput;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return changePassword(currentUser.id, args.input);
    },

    changeAccessPin: async (
      _: unknown,
      args: {
        input: ChangeAccessPinInput;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return changeAccessPin(currentUser.id, args.input);
    },

    updateNotificationPreferences: async (
      _: unknown,
      args: {
        input: UpdateNotificationPreferencesInput;
      },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return updateNotificationPreferences(currentUser.id, args.input);
    },
  },
};
