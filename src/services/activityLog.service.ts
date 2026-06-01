import ActivityLog from "../models/activityLog";
import { toObjectId } from "../utils/toObjectId";

export const getActivityLogs = async () => {
  return ActivityLog.find({}).sort({ createdAt: -1 });
};

export const logActivity = async (
  adminId: string,
  action: string,
  previousValue?: string,
  newValue?: string,
  ipAddress?: string,
) => {
  return ActivityLog.create({
    adminId: toObjectId(adminId),
    action,
    previousValue: previousValue || "",
    newValue: newValue || "",
    ipAddress: ipAddress || "",
  });
};
