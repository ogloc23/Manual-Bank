import {
  QueryFilter,
  UpdateQuery,
  InferSchemaType,
} from "mongoose";

import Transaction from "../models/transaction";

type TransactionDocument =
  InferSchemaType<typeof Transaction.schema>;

class TransactionRepository {
  private readonly model = Transaction;

  create = (
    data: Partial<TransactionDocument>,
  ) => this.model.create(data);

  findOne = (
    filter: QueryFilter<TransactionDocument>,
  ) => this.model.findOne(filter);

  findMany = (
    filter: QueryFilter<TransactionDocument>,
  ) =>
    this.model
      .find(filter)
      .sort({ createdAt: -1 });

  update = (
    filter: QueryFilter<TransactionDocument>,
    data: UpdateQuery<TransactionDocument>,
  ) =>
    this.model.findOneAndUpdate(
      filter,
      data,
      {
        returnDocument: "after",
      },
    );

  delete = (
    filter: QueryFilter<TransactionDocument>,
  ) =>
    this.model.findOneAndDelete(
      filter,
    );
}

export default TransactionRepository;