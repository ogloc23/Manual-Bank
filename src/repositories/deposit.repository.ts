import { QueryFilter, UpdateQuery, InferSchemaType } from "mongoose";

import Deposit from "../models/deposit";

type DepositDocument = InferSchemaType<typeof Deposit.schema>;

class DepositRepository {
  private readonly model = Deposit;

  create = (data: Partial<DepositDocument>) => this.model.create(data);

  findOne = (filter: QueryFilter<DepositDocument>) =>
    this.model.findOne(filter);

  findMany = (filter: QueryFilter<DepositDocument>) => this.model.find(filter);

  update = (
    filter: QueryFilter<DepositDocument>,
    data: UpdateQuery<DepositDocument>,
  ) =>
    this.model.findOneAndUpdate(filter, data, {
      returnDocument: "after",
    });

  delete = (filter: QueryFilter<DepositDocument>) =>
    this.model.findOneAndDelete(filter);
}

export default DepositRepository;
