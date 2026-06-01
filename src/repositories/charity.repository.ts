import { QueryFilter, UpdateQuery, InferSchemaType } from "mongoose";

import Charity from "../models/charity";

type CharityDocument = InferSchemaType<typeof Charity.schema>;

class CharityRepository {
  private readonly model = Charity;

  create = (data: Partial<CharityDocument>) => this.model.create(data);

  findOne = (filter: QueryFilter<CharityDocument>) =>
    this.model.findOne(filter);

  findMany = (filter: QueryFilter<CharityDocument>) => this.model.find(filter);

  update = (
    filter: QueryFilter<CharityDocument>,
    data: UpdateQuery<CharityDocument>,
  ) =>
    this.model.findOneAndUpdate(filter, data, {
      returnDocument: "after",
    });

  delete = (filter: QueryFilter<CharityDocument>) =>
    this.model.findOneAndDelete(filter);
}

export default CharityRepository;
