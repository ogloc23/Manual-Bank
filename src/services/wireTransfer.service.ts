import WireTransfer from "../models/wireTransfer";
import Transaction from "../models/transaction";
import AuthRepository from "../repositories/auth.repository";
import { createNotification } from "./notification.service";
import { toObjectId } from "../utils/toObjectId";
import { CreateWireTransferInput } from "../types/transaction.types";
import {
  AccountType,
  accountTypeToField,
  DEFAULT_ACCOUNT,
} from "../utils/accountType";

const userRepository = new AuthRepository();

const generateWireReference = (): string => `WT-${Date.now()}`;
const generateTransactionId = (): string => `TNX-${Date.now()}`;
const generateTransactionReference = (): string => `REF-${Date.now()}`;

export const getAllWireTransfers = async () => {
  return WireTransfer.find({});
};

export const getUserWireTransfers = async (userId: string) => {
  return WireTransfer.find({ userId });
};

export const createWireTransfer = async (
  userId: string,
  input: CreateWireTransferInput,
) => {
  const user = await userRepository.findOne({ _id: userId });

  if (!user) {
    throw new Error("User not found");
  }

  const accountType: AccountType =
    (input.accountType as AccountType) || DEFAULT_ACCOUNT;
  const accountField = accountTypeToField(accountType);

  if ((user as any)[accountField] < input.amount) {
    throw new Error("Insufficient balance for selected account");
  }

  const wireReference = generateWireReference();

  const wireTransfer = await WireTransfer.create({
    userId: toObjectId(userId),
    beneficiaryName: input.beneficiaryName,
    beneficiaryBank: input.beneficiaryBank,
    accountNumber: input.accountNumber,
    swiftCode: input.swiftCode || "",
    amount: input.amount,
    fee: 0,
    reason: input.reason || "",
    reference: wireReference,
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
    "Wire Transfer Requested",
    `Your transfer of ${input.amount} is pending approval.`,
    "INFO",
  );

  await Transaction.create({
    userId: toObjectId(userId),
    transactionId: generateTransactionId(),
    transactionType: "WIRE_TRANSFER",
    amount: input.amount,
    currency: "USD",
    reference: wireReference,
    accountType,
    status: "PENDING",
    direction: "DEBIT",
    description: input.reason || "Wire transfer request",
    recipientName: input.beneficiaryName,
    recipientBank: input.beneficiaryBank,
    recipientAccountNumber: input.accountNumber,
    createdBy: toObjectId(userId),
  });

  return wireTransfer;
};
