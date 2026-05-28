import { QueryFilter, UpdateQuery, InferSchemaType } from "mongoose";

import User from "../models/user";

type UserDocument = InferSchemaType<typeof User.schema>;

class AdminRepository {
  private readonly model = User;

  create = (data: Partial<UserDocument>) => this.model.create(data);

  findOne = (filter: QueryFilter<UserDocument>) => this.model.findOne(filter);

  findMany = (filter: QueryFilter<UserDocument>) => this.model.find(filter);

  update = (
    filter: QueryFilter<UserDocument>,
    data: UpdateQuery<UserDocument>,
  ) =>
    this.model.findOneAndUpdate(filter, data, {
      returnDocument: "after",
    });

  delete = (filter: QueryFilter<UserDocument>) =>
    this.model.findOneAndDelete(filter);
}

export default AdminRepository;
