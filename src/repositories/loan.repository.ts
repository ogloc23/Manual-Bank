import { QueryFilter, UpdateQuery, InferSchemaType } from "mongoose";

import Loan from "../models/loan";

type LoanDocument = InferSchemaType<typeof Loan.schema>;

class LoanRepository {
  private readonly model = Loan;

  create = (data: Partial<LoanDocument>) => this.model.create(data);

  findOne = (filter: QueryFilter<LoanDocument>) => this.model.findOne(filter);

  findMany = (filter: QueryFilter<LoanDocument>) => this.model.find(filter);

  update = (
    filter: QueryFilter<LoanDocument>,
    data: UpdateQuery<LoanDocument>,
  ) =>
    this.model.findOneAndUpdate(filter, data, {
      returnDocument: "after",
    });

  delete = (filter: QueryFilter<LoanDocument>) =>
    this.model.findOneAndDelete(filter);
}

export default LoanRepository;
