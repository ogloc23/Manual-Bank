import { QueryFilter, UpdateQuery, InferSchemaType } from "mongoose";

import BillPayment from "../models/billPayment";

type BillPaymentDocument = InferSchemaType<typeof BillPayment.schema>;

class BillPaymentRepository {
  private readonly model = BillPayment;

  create = (data: Partial<BillPaymentDocument>) => this.model.create(data);

  findOne = (filter: QueryFilter<BillPaymentDocument>) =>
    this.model.findOne(filter);

  findMany = (filter: QueryFilter<BillPaymentDocument>) =>
    this.model.find(filter);

  update = (
    filter: QueryFilter<BillPaymentDocument>,
    data: UpdateQuery<BillPaymentDocument>,
  ) =>
    this.model.findOneAndUpdate(filter, data, {
      returnDocument: "after",
    });

  delete = (filter: QueryFilter<BillPaymentDocument>) =>
    this.model.findOneAndDelete(filter);
}

export default BillPaymentRepository;
