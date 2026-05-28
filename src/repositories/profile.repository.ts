import { QueryFilter, UpdateQuery, InferSchemaType } from "mongoose";

import User from "../models/user";

type UserDocument = InferSchemaType<typeof User.schema>;

class ProfileRepository {
  private readonly model = User;

  findOne = (filter: QueryFilter<UserDocument>) => this.model.findOne(filter);

  update = (
    filter: QueryFilter<UserDocument>,
    data: UpdateQuery<UserDocument>,
  ) =>
    this.model.findOneAndUpdate(filter, data, {
      returnDocument: "after",
    });
}

export default ProfileRepository;
