import { QueryFilter, UpdateQuery, InferSchemaType } from "mongoose";

import WireTransfer from "../models/wireTransfer";

type WireTransferDocument = InferSchemaType<typeof WireTransfer.schema>;

class WireTransferRepository {
  private readonly model = WireTransfer;

  create = (data: Partial<WireTransferDocument>) => this.model.create(data);

  findOne = (filter: QueryFilter<WireTransferDocument>) =>
    this.model.findOne(filter);

  findMany = (filter: QueryFilter<WireTransferDocument>) =>
    this.model.find(filter);

  update = (
    filter: QueryFilter<WireTransferDocument>,
    data: UpdateQuery<WireTransferDocument>,
  ) =>
    this.model.findOneAndUpdate(filter, data, {
      returnDocument: "after",
    });

  delete = (filter: QueryFilter<WireTransferDocument>) =>
    this.model.findOneAndDelete(filter);
}

export default WireTransferRepository;
