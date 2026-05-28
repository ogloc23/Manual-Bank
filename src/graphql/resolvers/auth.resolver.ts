import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../../services/auth.service";
import { RegisterUserInput, LoginUserInput } from "../../types/auth.types";
import { GraphQLContext } from "../../types/context.types";

export const authResolvers = {
  Query: {
    me: async (
      _: unknown,
      __: unknown,
      context: GraphQLContext,
    ) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      return getCurrentUser(context.user.id);
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      args: {
        input: RegisterUserInput;
      },
    ) => {
      return registerUser(args.input);
    },

    login: async (
      _: unknown,
      args: {
        input: LoginUserInput;
      },
    ) => {
      return loginUser(args.input);
    },
  },
};
