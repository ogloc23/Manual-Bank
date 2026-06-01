import Loan from "../models/loan";
import { createNotification } from "./notification.service";
import { toObjectId } from "../utils/toObjectId";
import { CreateLoanInput } from "../types/loan.types";

export const getAllLoans = async () => {
  return Loan.find({});
};

export const getUserLoans = async (userId: string) => {
  return Loan.find({ userId });
};

export const applyForLoan = async (userId: string, input: CreateLoanInput) => {
  const loan = await Loan.create({
    userId: toObjectId(userId),
    loanAmount: input.loanAmount,
    interestRate: input.interestRate ?? 5,
    durationMonths: input.durationMonths,
    repaymentStatus: "PENDING",
    status: "UNDER_REVIEW",
  });

  await createNotification(
    userId,
    "Loan Application Submitted",
    `Your loan request for ${input.loanAmount} is under review.`,
    "INFO",
  );

  return loan;
};
