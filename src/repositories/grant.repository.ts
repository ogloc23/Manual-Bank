import { QueryFilter, UpdateQuery, InferSchemaType } from "mongoose";

import Grant from "../models/grant";

type GrantDocument = InferSchemaType<typeof Grant.schema>;

class GrantRepository {
  private readonly model = Grant;

  create = (data: Partial<GrantDocument>) => this.model.create(data);

  findOne = (filter: QueryFilter<GrantDocument>) => this.model.findOne(filter);

  findMany = (filter: QueryFilter<GrantDocument>) => this.model.find(filter);

  update = (
    filter: QueryFilter<GrantDocument>,
    data: UpdateQuery<GrantDocument>,
  ) =>
    this.model.findOneAndUpdate(filter, data, {
      returnDocument: "after",
    });

  delete = (filter: QueryFilter<GrantDocument>) =>
    this.model.findOneAndDelete(filter);
}

export default GrantRepository;
