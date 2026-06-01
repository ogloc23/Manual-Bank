import Verification from "../models/verification";
import { createNotification } from "./notification.service";
import { toObjectId } from "../utils/toObjectId";
import { CreateVerificationInput } from "../types/verification.types";

export const getVerifications = async () => {
  return Verification.find({});
};

export const getMyVerification = async (userId: string) => {
  return Verification.findOne({ userId });
};

export const submitVerification = async (
  userId: string,
  input: CreateVerificationInput,
) => {
  const existing = await Verification.findOne({ userId });

  if (existing && existing.status === "PENDING") {
    throw new Error("A verification request is already pending");
  }

  const verification = await Verification.create({
    userId: toObjectId(userId),
    identityType: input.identityType,
    identityNumber: input.identityNumber,
    identityDocument: input.identityDocument,
    selfieImage: input.selfieImage || "",
    status: "PENDING",
  });

  await createNotification(
    userId,
    "KYC Submitted",
    "Your identity documents have been submitted and are under review.",
    "INFO",
  );

  return verification;
};
