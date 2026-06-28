import BillPayment from "../models/billPayment";
import Transaction from "../models/transaction";
import AuthRepository from "../repositories/auth.repository";
import { createNotification } from "./notification.service";
import { toObjectId } from "../utils/toObjectId";
import { CreateBillPaymentInput } from "../types/billPayment.types";
import {
  AccountType,
  accountTypeToField,
  DEFAULT_ACCOUNT,
} from "../utils/accountType";

const userRepository = new AuthRepository();

const generateReference = (): string => `BILL-${Date.now()}`;
const generateTransactionId = (): string => `TNX-${Date.now()}`;
const generateTransactionReference = (): string => `REF-${Date.now()}`;

export const getAllBillPayments = async () => {
  return BillPayment.find({});
};

export const getUserBillPayments = async (userId: string) => {
  return BillPayment.find({ userId });
};

export const payBill = async (
  userId: string,
  input: CreateBillPaymentInput,
) => {
  const user = await userRepository.findOne({ _id: userId });

  if (!user) {
    throw new Error("User not found");
  }

  const accountType: AccountType =
    (input.accountType as AccountType) || DEFAULT_ACCOUNT;
  const accountField = accountTypeToField(accountType);

  if ((user as any)[accountField] < input.amount) {
    throw new Error("Insufficient balance to pay bill");
  }

  const billPayment = await BillPayment.create({
    userId: toObjectId(userId),
    billType: input.billType,
    provider: input.provider,
    amount: input.amount,
    reference: generateReference(),
    accountType,
    status: "PENDING",
  });

  await userRepository.update(
    { _id: userId },
    {
      $inc: {
        [accountField]: -input.amount,
        tertiaryBalance: input.amount,
      },
    },
  );

  await createNotification(
    userId,
    "Bill Payment Requested",
    `Your bill payment for ${input.provider} is pending approval.`,
    "INFO",
  );

  await Transaction.create({
    userId: toObjectId(userId),
    transactionId: generateTransactionId(),
    transactionType: "BILL_PAYMENT",
    amount: input.amount,
    currency: "USD",
    reference: generateTransactionReference(),
    status: "PENDING",
    direction: "DEBIT",
    description: `Bill payment to ${input.provider}`,
    createdBy: toObjectId(userId),
  });

  return billPayment;
};
