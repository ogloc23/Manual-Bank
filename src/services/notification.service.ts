import Notification from "../models/notification";
import { toObjectId } from "../utils/toObjectId";

export const getNotifications = async (userId: string) => {
  return Notification.find({ userId }).sort({ createdAt: -1 });
};

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR" = "INFO",
) => {
  return Notification.create({
    userId: toObjectId(userId),
    title,
    message,
    type,
    isRead: false,
  });
};
