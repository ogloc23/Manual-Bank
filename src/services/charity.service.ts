import Charity from "../models/charity";
import Transaction from "../models/transaction";
import AuthRepository from "../repositories/auth.repository";
import { createNotification } from "./notification.service";
import { toObjectId } from "../utils/toObjectId";
import { CreateCharityInput } from "../types/charity.types";

const userRepository = new AuthRepository();

const generateReference = (): string => `CHR-${Date.now()}`;
const generateTransactionId = (): string => `TNX-${Date.now()}`;
const generateTransactionReference = (): string => `REF-${Date.now()}`;

export const getAllCharities = async () => {
  return Charity.find({});
};

export const getUserCharities = async (userId: string) => {
  return Charity.find({ userId });
};

export const createCharity = async (
  userId: string,
  input: CreateCharityInput,
) => {
  const user = await userRepository.findOne({ _id: userId });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.secondaryBalance < input.amount) {
    throw new Error("Insufficient balance for charity payment");
  }

  const charity = await Charity.create({
    userId: toObjectId(userId),
    organizationName: input.organizationName,
    amount: input.amount,
    message: input.message || "",
    reference: generateReference(),
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
    "Charity Payment Requested",
    `Your charity payment of ${input.amount} is pending approval.`,
    "INFO",
  );

  await Transaction.create({
    userId: toObjectId(userId),
    transactionId: generateTransactionId(),
    transactionType: "CHARITY",
    amount: input.amount,
    currency: "USD",
    reference: generateTransactionReference(),
    status: "PENDING",
    direction: "DEBIT",
    description: `Charity donation to ${input.organizationName}`,
    createdBy: toObjectId(userId),
  });

  return charity;
};
