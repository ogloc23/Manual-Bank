import WireTransfer from "../models/wireTransfer";
import Transaction from "../models/transaction";
import AuthRepository from "../repositories/auth.repository";
import { createNotification } from "./notification.service";
import { toObjectId } from "../utils/toObjectId";
import { CreateWireTransferInput } from "../types/transaction.types";

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

  if (user.secondaryBalance < input.amount) {
    throw new Error("Insufficient secondary balance");
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
    status: "PENDING",
  });

  await userRepository.update(
    { _id: userId },
    {
      $inc: {
        secondaryBalance: -input.amount,
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
