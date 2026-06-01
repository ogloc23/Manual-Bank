import { getNotifications } from "../../services/notification.service";
import { requireAuth } from "../../utils/guards";

interface GraphQLContext {
  user?: {
    id: string;
    role: string;
  };
}

export const notificationResolvers = {
  Query: {
    notifications: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return getNotifications(currentUser.id);
    },
  },
};
