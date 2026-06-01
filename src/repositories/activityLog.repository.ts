import { QueryFilter, UpdateQuery, InferSchemaType } from "mongoose";

import ActivityLog from "../models/activityLog";

type ActivityLogDocument = InferSchemaType<typeof ActivityLog.schema>;

class ActivityLogRepository {
  private readonly model = ActivityLog;

  create = (data: Partial<ActivityLogDocument>) => this.model.create(data);

  findOne = (filter: QueryFilter<ActivityLogDocument>) =>
    this.model.findOne(filter);

  findMany = (filter: QueryFilter<ActivityLogDocument>) =>
    this.model.find(filter);

  update = (
    filter: QueryFilter<ActivityLogDocument>,
    data: UpdateQuery<ActivityLogDocument>,
  ) =>
    this.model.findOneAndUpdate(filter, data, {
      returnDocument: "after",
    });

  delete = (filter: QueryFilter<ActivityLogDocument>) =>
    this.model.findOneAndDelete(filter);
}

export default ActivityLogRepository;
