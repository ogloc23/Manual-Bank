import { QueryFilter, UpdateQuery, InferSchemaType } from "mongoose";

import Verification from "../models/verification";

type VerificationDocument = InferSchemaType<typeof Verification.schema>;

class VerificationRepository {
  private readonly model = Verification;

  create = (data: Partial<VerificationDocument>) => this.model.create(data);

  findOne = (filter: QueryFilter<VerificationDocument>) =>
    this.model.findOne(filter);

  findMany = (filter: QueryFilter<VerificationDocument>) =>
    this.model.find(filter);

  update = (
    filter: QueryFilter<VerificationDocument>,
    data: UpdateQuery<VerificationDocument>,
  ) =>
    this.model.findOneAndUpdate(filter, data, {
      returnDocument: "after",
    });

  delete = (filter: QueryFilter<VerificationDocument>) =>
    this.model.findOneAndDelete(filter);
}

export default VerificationRepository;
