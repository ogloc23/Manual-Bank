import { getActivityLogs } from "../../services/activityLog.service";
import { requireAdmin } from "../../utils/guards";

interface GraphQLContext {
  user?: {
    id: string;
    role: string;
  };
}

export const activityLogResolvers = {
  Query: {
    activityLogs: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAdmin(context);

      return getActivityLogs();
    },
  },
};
