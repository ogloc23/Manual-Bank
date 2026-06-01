import { QueryFilter, UpdateQuery, InferSchemaType } from "mongoose";

import Notification from "../models/notification";

type NotificationDocument = InferSchemaType<typeof Notification.schema>;

class NotificationRepository {
  private readonly model = Notification;

  create = (data: Partial<NotificationDocument>) => this.model.create(data);

  findOne = (filter: QueryFilter<NotificationDocument>) =>
    this.model.findOne(filter);

  findMany = (filter: QueryFilter<NotificationDocument>) =>
    this.model.find(filter);

  update = (
    filter: QueryFilter<NotificationDocument>,
    data: UpdateQuery<NotificationDocument>,
  ) =>
    this.model.findOneAndUpdate(filter, data, {
      returnDocument: "after",
    });

  delete = (filter: QueryFilter<NotificationDocument>) =>
    this.model.findOneAndDelete(filter);
}

export default NotificationRepository;
