import Deposit from "../models/deposit";
import Transaction from "../models/transaction";
import AuthRepository from "../repositories/auth.repository";
import { createNotification } from "./notification.service";
import { toObjectId } from "../utils/toObjectId";
import { CreateDepositInput } from "../types/transaction.types";

const userRepository = new AuthRepository();

const generateDepositReference = (): string => `DEP-${Date.now()}`;
const generateTransactionId = (): string => `TNX-${Date.now()}`;
const generateTransactionReference = (): string => `REF-${Date.now()}`;

export const getAllDeposits = async () => {
  return Deposit.find({});
};

export const getUserDeposits = async (userId: string) => {
  return Deposit.find({ userId });
};

export const createDeposit = async (
  userId: string,
  input: CreateDepositInput,
) => {
  const depositReference = generateDepositReference();

  const deposit = await Deposit.create({
    userId: toObjectId(userId),
    amount: input.amount,
    paymentMethod: input.paymentMethod || "BANK_TRANSFER",
    proofOfPayment: input.proofOfPayment || "",
    reference: depositReference,
    status: "PENDING",
  });

  await createNotification(
    userId,
    "Deposit Submitted",
    `Your deposit of ${input.amount} has been submitted and is pending approval.`,
    "INFO",
  );

  await Transaction.create({
    userId: toObjectId(userId),
    transactionId: generateTransactionId(),
    transactionType: "DEPOSIT",
    amount: input.amount,
    currency: "USD",
    reference: depositReference,
    status: "PENDING",
    direction: "CREDIT",
    description: "Deposit request",
    proofOfPayment: input.proofOfPayment || "",
    createdBy: toObjectId(userId),
  });

  return deposit;
};
