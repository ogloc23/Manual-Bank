import AdminRepository from "../repositories/admin.repository";
import Charity from "../models/charity";
import BillPayment from "../models/billPayment";
import Deposit from "../models/deposit";
import Loan from "../models/loan";
import Transaction from "../models/transaction";
import Verification from "../models/verification";
import WireTransfer from "../models/wireTransfer";
import { hashValue } from "../utils/auth";
import { generateAccountNumber } from "../utils/generateAccountNumber";
import { createNotification } from "./notification.service";
import { logActivity } from "./activityLog.service";
import {
  UpdateUserStatusInput,
  VerifyUserInput,
  BalanceUpdateInput,
  CreateAdminInput,
} from "../types/admin.types";

const adminRepository = new AdminRepository();

export const getAllUsers = async () => {
  return adminRepository.findMany({});
};

export const getUserById = async (userId: string) => {
  const user = await adminRepository.findOne({
    _id: userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateUserStatus = async (
  input: UpdateUserStatusInput,
  adminId: string,
) => {
  const user = await adminRepository.findOne({
    _id: input.userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await adminRepository.update(
    {
      _id: input.userId,
    },
    {
      accountStatus: input.accountStatus,
    },
  );

  await logActivity(
    adminId,
    "Updated user account status",
    `accountStatus=${user.accountStatus}`,
    `accountStatus=${input.accountStatus}`,
  );

  return updatedUser;
};

export const verifyUser = async (input: VerifyUserInput, adminId: string) => {
  const user = await adminRepository.findOne({
    _id: input.userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await adminRepository.update(
    {
      _id: input.userId,
    },
    {
      kycStatus: input.kycStatus,
      isVerified: input.kycStatus === "VERIFIED",
    },
  );

  await logActivity(
    adminId,
    "Updated user KYC status",
    `kycStatus=${user.kycStatus}`,
    `kycStatus=${input.kycStatus}`,
  );

  return updatedUser;
};

const balanceTypeToFieldMap: Record<
  "PRIMARY_BALANCE" | "SECONDARY_BALANCE" | "TERTIARY_BALANCE",
  "primaryBalance" | "secondaryBalance" | "tertiaryBalance"
> = {
  PRIMARY_BALANCE: "primaryBalance",
  SECONDARY_BALANCE: "secondaryBalance",
  TERTIARY_BALANCE: "tertiaryBalance",
};

const assertBalanceField = (
  balanceType: string,
): "primaryBalance" | "secondaryBalance" | "tertiaryBalance" => {
  if (
    !Object.prototype.hasOwnProperty.call(balanceTypeToFieldMap, balanceType)
  ) {
    throw new Error(
      `Invalid balanceType: ${balanceType}. Must be PRIMARY_BALANCE, SECONDARY_BALANCE, or TERTIARY_BALANCE.`,
    );
  }

  return balanceTypeToFieldMap[
    balanceType as keyof typeof balanceTypeToFieldMap
  ];
};

export const creditUserBalance = async (
  input: BalanceUpdateInput,
  adminId: string,
) => {
  const user = await adminRepository.findOne({
    _id: input.userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const balanceField = assertBalanceField(input.balanceType);

  const updatedUser = await adminRepository.update(
    {
      _id: input.userId,
    },
    {
      $inc: {
        [balanceField]: input.amount,
        totalBalance: input.amount,
      },
    },
  );

  await logActivity(
    adminId,
    "Credited user balance",
    `${balanceField}=${user[balanceField]}`,
    `${balanceField}=${updatedUser![balanceField]}`,
  );

  return updatedUser;
};

export const debitUserBalance = async (
  input: BalanceUpdateInput,
  adminId: string,
) => {
  const user = await adminRepository.findOne({
    _id: input.userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const balanceField = assertBalanceField(input.balanceType);

  if (user[balanceField] < input.amount) {
    throw new Error(`Insufficient ${balanceField}`);
  }

  const updatedUser = await adminRepository.update(
    {
      _id: input.userId,
    },
    {
      $inc: {
        [balanceField]: -input.amount,
        totalBalance: -input.amount,
      },
    },
  );

  await logActivity(
    adminId,
    "Debited user balance",
    `${balanceField}=${user[balanceField]}`,
    `${balanceField}=${updatedUser![balanceField]}`,
  );

  return updatedUser;
};

export const approveLoan = async (loanId: string, adminId: string) => {
  const loan = await Loan.findById(loanId);

  if (!loan) {
    throw new Error("Loan not found");
  }

  if (loan.status !== "UNDER_REVIEW") {
    throw new Error("Loan cannot be approved");
  }

  const updatedLoan = await Loan.findByIdAndUpdate(
    loanId,
    {
      status: "APPROVED",
      repaymentStatus: "ACTIVE",
    },
    { new: true },
  );

  await adminRepository.update(
    {
      _id: loan.userId,
    },
    {
      $inc: {
        primaryBalance: loan.loanAmount,
        secondaryBalance: loan.loanAmount,
        totalBalance: loan.loanAmount * 2,
      },
    },
  );

  await logActivity(
    adminId,
    "Approved loan",
    `loanStatus=${loan.status}`,
    `loanStatus=APPROVED`,
  );

  return updatedLoan;
};

export const rejectLoan = async (
  loanId: string,
  remarks: string | undefined,
  adminId: string,
) => {
  const loan = await Loan.findById(loanId);

  if (!loan) {
    throw new Error("Loan not found");
  }

  if (loan.status !== "UNDER_REVIEW") {
    throw new Error("Loan cannot be rejected");
  }

  const updatedLoan = await Loan.findByIdAndUpdate(
    loanId,
    {
      status: "REJECTED",
    },
    { new: true },
  );

  await logActivity(
    adminId,
    "Rejected loan",
    `loanStatus=${loan.status}`,
    `loanStatus=REJECTED, remarks=${remarks || "none"}`,
  );

  return updatedLoan;
};

export const approveCharity = async (charityId: string, adminId: string) => {
  const charity = await Charity.findById(charityId);

  if (!charity) {
    throw new Error("Charity payment not found");
  }

  if (charity.status !== "PENDING") {
    throw new Error("Charity payment cannot be approved");
  }

  const updatedCharity = await Charity.findByIdAndUpdate(
    charityId,
    {
      status: "COMPLETED",
    },
    { new: true },
  );

  await adminRepository.update(
    {
      _id: charity.userId,
    },
    {
      $inc: {
        primaryBalance: -charity.amount,
        tertiaryBalance: -charity.amount,
        totalBalance: -charity.amount * 2,
        totalWithdrawals: charity.amount,
      },
    },
  );

  await Transaction.findOneAndUpdate(
    {
      reference: charity.reference,
    },
    {
      status: "COMPLETED",
      processedBy: charity.userId,
      processedAt: new Date(),
    },
  );

  await logActivity(
    adminId,
    "Approved charity payment",
    `charityStatus=${charity.status}`,
    `charityStatus=COMPLETED`,
  );

  return updatedCharity;
};

export const rejectCharity = async (
  charityId: string,
  remarks: string | undefined,
  adminId: string,
) => {
  const charity = await Charity.findById(charityId);

  if (!charity) {
    throw new Error("Charity payment not found");
  }

  if (charity.status !== "PENDING") {
    throw new Error("Charity payment cannot be rejected");
  }

  const updatedCharity = await Charity.findByIdAndUpdate(
    charityId,
    {
      status: "FAILED",
    },
    { new: true },
  );

  await adminRepository.update(
    {
      _id: charity.userId,
    },
    {
      $inc: {
        secondaryBalance: charity.amount,
        tertiaryBalance: -charity.amount,
      },
    },
  );

  await Transaction.findOneAndUpdate(
    {
      reference: charity.reference,
    },
    {
      status: "REJECTED",
      processedBy: charity.userId,
      processedAt: new Date(),
    },
  );

  await logActivity(
    adminId,
    "Rejected charity payment",
    `charityStatus=${charity.status}`,
    `charityStatus=FAILED, remarks=${remarks || "none"}`,
  );

  return updatedCharity;
};

export const approveBillPayment = async (
  billPaymentId: string,
  adminId: string,
) => {
  const billPayment = await BillPayment.findById(billPaymentId);

  if (!billPayment) {
    throw new Error("Bill payment not found");
  }

  if (billPayment.status !== "PENDING") {
    throw new Error("Bill payment cannot be approved");
  }

  const updatedBillPayment = await BillPayment.findByIdAndUpdate(
    billPaymentId,
    {
      status: "COMPLETED",
    },
    { new: true },
  );

  await adminRepository.update(
    {
      _id: billPayment.userId,
    },
    {
      $inc: {
        primaryBalance: -billPayment.amount,
        tertiaryBalance: -billPayment.amount,
        totalBalance: -billPayment.amount * 2,
        totalWithdrawals: billPayment.amount,
      },
    },
  );

  await Transaction.findOneAndUpdate(
    {
      reference: billPayment.reference,
    },
    {
      status: "COMPLETED",
      processedBy: billPayment.userId,
      processedAt: new Date(),
    },
  );

  await logActivity(
    adminId,
    "Approved bill payment",
    `billPaymentStatus=${billPayment.status}`,
    `billPaymentStatus=COMPLETED`,
  );

  return updatedBillPayment;
};

export const rejectBillPayment = async (
  billPaymentId: string,
  remarks: string | undefined,
  adminId: string,
) => {
  const billPayment = await BillPayment.findById(billPaymentId);

  if (!billPayment) {
    throw new Error("Bill payment not found");
  }

  if (billPayment.status !== "PENDING") {
    throw new Error("Bill payment cannot be rejected");
  }

  const updatedBillPayment = await BillPayment.findByIdAndUpdate(
    billPaymentId,
    {
      status: "FAILED",
    },
    { new: true },
  );

  await adminRepository.update(
    {
      _id: billPayment.userId,
    },
    {
      $inc: {
        secondaryBalance: billPayment.amount,
        tertiaryBalance: -billPayment.amount,
      },
    },
  );

  await Transaction.findOneAndUpdate(
    {
      reference: billPayment.reference,
    },
    {
      status: "REJECTED",
      processedBy: billPayment.userId,
      processedAt: new Date(),
    },
  );

  await logActivity(
    adminId,
    "Rejected bill payment",
    `billPaymentStatus=${billPayment.status}`,
    `billPaymentStatus=FAILED, remarks=${remarks || "none"}`,
  );

  return updatedBillPayment;
};

export const approveDeposit = async (depositId: string, adminId: string) => {
  const deposit = await Deposit.findById(depositId);

  if (!deposit) {
    throw new Error("Deposit not found");
  }

  if (deposit.status !== "PENDING") {
    throw new Error("Deposit cannot be approved");
  }

  const updatedDeposit = await Deposit.findByIdAndUpdate(
    depositId,
    { status: "APPROVED" },
    { new: true },
  );

  await adminRepository.update(
    { _id: deposit.userId },
    {
      $inc: {
        primaryBalance: deposit.amount,
        secondaryBalance: deposit.amount,
        tertiaryBalance: -deposit.amount,
        totalBalance: deposit.amount,
        totalDeposits: deposit.amount,
      },
    },
  );

  await Transaction.findOneAndUpdate(
    { reference: deposit.reference },
    {
      status: "COMPLETED",
      processedBy: deposit.userId,
      processedAt: new Date(),
    },
  );

  await createNotification(
    deposit.userId.toString(),
    "Deposit Approved",
    `Your deposit of ${deposit.amount} has been approved.`,
    "SUCCESS",
  );

  await logActivity(
    adminId,
    "Approved deposit",
    `depositStatus=${deposit.status}`,
    `depositStatus=APPROVED`,
  );

  return updatedDeposit;
};

export const rejectDeposit = async (
  depositId: string,
  remarks: string | undefined,
  adminId: string,
) => {
  const deposit = await Deposit.findById(depositId);

  if (!deposit) {
    throw new Error("Deposit not found");
  }

  if (deposit.status !== "PENDING") {
    throw new Error("Deposit cannot be rejected");
  }

  const updatedDeposit = await Deposit.findByIdAndUpdate(
    depositId,
    { status: "DECLINED" },
    { new: true },
  );

  await adminRepository.update(
    { _id: deposit.userId },
    {
      $inc: {
        tertiaryBalance: -deposit.amount,
        totalBalance: -deposit.amount,
      },
    },
  );

  await Transaction.findOneAndUpdate(
    { reference: deposit.reference },
    {
      status: "REJECTED",
      processedBy: deposit.userId,
      processedAt: new Date(),
      remarks,
    },
  );

  await createNotification(
    deposit.userId.toString(),
    "Deposit Rejected",
    `Your deposit of ${deposit.amount} was rejected.${remarks ? " Reason: " + remarks : ""}`,
    "ERROR",
  );

  await logActivity(
    adminId,
    "Rejected deposit",
    `depositStatus=${deposit.status}`,
    `depositStatus=DECLINED, remarks=${remarks || "none"}`,
  );

  return updatedDeposit;
};

export const approveWireTransfer = async (
  wireTransferId: string,
  adminId: string,
) => {
  const wireTransfer = await WireTransfer.findById(wireTransferId);

  if (!wireTransfer) {
    throw new Error("Wire transfer not found");
  }

  if (wireTransfer.status !== "PENDING") {
    throw new Error("Wire transfer cannot be approved");
  }

  const updatedWireTransfer = await WireTransfer.findByIdAndUpdate(
    wireTransferId,
    { status: "COMPLETED" },
    { new: true },
  );

  await adminRepository.update(
    { _id: wireTransfer.userId },
    {
      $inc: {
        primaryBalance: -wireTransfer.amount,
        tertiaryBalance: -wireTransfer.amount,
        totalBalance: -wireTransfer.amount * 2,
      },
    },
  );

  await Transaction.findOneAndUpdate(
    { reference: wireTransfer.reference },
    {
      status: "COMPLETED",
      processedBy: wireTransfer.userId,
      processedAt: new Date(),
    },
  );

  await createNotification(
    wireTransfer.userId.toString(),
    "Wire Transfer Approved",
    `Your wire transfer of ${wireTransfer.amount} has been approved.`,
    "SUCCESS",
  );

  await logActivity(
    adminId,
    "Approved wire transfer",
    `wireTransferStatus=${wireTransfer.status}`,
    `wireTransferStatus=COMPLETED`,
  );

  return updatedWireTransfer;
};

export const rejectWireTransfer = async (
  wireTransferId: string,
  remarks: string | undefined,
  adminId: string,
) => {
  const wireTransfer = await WireTransfer.findById(wireTransferId);

  if (!wireTransfer) {
    throw new Error("Wire transfer not found");
  }

  if (wireTransfer.status !== "PENDING") {
    throw new Error("Wire transfer cannot be rejected");
  }

  const updatedWireTransfer = await WireTransfer.findByIdAndUpdate(
    wireTransferId,
    { status: "FAILED" },
    { new: true },
  );

  await adminRepository.update(
    { _id: wireTransfer.userId },
    {
      $inc: {
        secondaryBalance: wireTransfer.amount,
        tertiaryBalance: -wireTransfer.amount,
      },
    },
  );

  await Transaction.findOneAndUpdate(
    { reference: wireTransfer.reference },
    {
      status: "REJECTED",
      processedBy: wireTransfer.userId,
      processedAt: new Date(),
      remarks,
    },
  );

  await createNotification(
    wireTransfer.userId.toString(),
    "Wire Transfer Rejected",
    `Your wire transfer of ${wireTransfer.amount} was rejected.${remarks ? ` Reason: ${remarks}` : ""}`,
    "ERROR",
  );

  await logActivity(
    adminId,
    "Rejected wire transfer",
    `wireTransferStatus=${wireTransfer.status}`,
    `wireTransferStatus=FAILED, remarks=${remarks || "none"}`,
  );

  return updatedWireTransfer;
};

export const approveVerification = async (
  verificationId: string,
  adminId: string,
) => {
  const verification = await Verification.findById(verificationId);

  if (!verification) {
    throw new Error("Verification request not found");
  }

  if (verification.status !== "PENDING") {
    throw new Error("Verification cannot be approved");
  }

  const updatedVerification = await Verification.findByIdAndUpdate(
    verificationId,
    {
      status: "VERIFIED",
    },
    { new: true },
  );

  await adminRepository.update(
    { _id: verification.userId },
    {
      kycStatus: "VERIFIED",
      isVerified: true,
    },
  );

  await createNotification(
    verification.userId.toString(),
    "KYC Approved",
    "Your verification request has been approved.",
    "SUCCESS",
  );

  await logActivity(
    adminId,
    "Approved verification request",
    `verificationStatus=${verification.status}`,
    `verificationStatus=VERIFIED`,
  );

  return updatedVerification;
};

export const rejectVerification = async (
  verificationId: string,
  remarks: string | undefined,
  adminId: string,
) => {
  const verification = await Verification.findById(verificationId);

  if (!verification) {
    throw new Error("Verification request not found");
  }

  if (verification.status !== "PENDING") {
    throw new Error("Verification cannot be rejected");
  }

  const updatedVerification = await Verification.findByIdAndUpdate(
    verificationId,
    {
      status: "REJECTED",
    },
    { new: true },
  );

  await adminRepository.update(
    { _id: verification.userId },
    {
      kycStatus: "REJECTED",
      isVerified: false,
    },
  );

  await createNotification(
    verification.userId.toString(),
    "KYC Rejected",
    `Your verification request was rejected.${remarks ? ` Reason: ${remarks}` : ""}`,
    "ERROR",
  );

  await logActivity(
    adminId,
    "Rejected verification request",
    `verificationStatus=${verification.status}`,
    `verificationStatus=REJECTED, remarks=${remarks || "none"}`,
  );

  return updatedVerification;
};

export const createAdmin = async (input: CreateAdminInput, adminId: string) => {
  const existingAdmin = await adminRepository.findOne({
    $or: [
      {
        email: input.email,
      },
      {
        username: input.username,
      },
    ],
  });

  if (existingAdmin) {
    throw new Error("Admin already exists");
  }

  const hashedPassword = await hashValue(input.password);
  const hashedPin = await hashValue("1234");

  const admin = await adminRepository.create({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    username: input.username,
    phoneNumber: input.phoneNumber,
    occupation: "Administrator",
    country: "United States",
    stateProvince: "New York",
    currencyProtocol: "USD",
    accountTier: "SOVEREIGN_PRIVATE_BANKING",
    accountNumber: generateAccountNumber(),
    password: hashedPassword,
    accessPin: hashedPin,
    role: "ADMIN",
    permissions: ["MANAGE_USERS"],
    isVerified: true,
    kycStatus: "VERIFIED",
    accountStatus: "ACTIVE",
  });

  await logActivity(
    adminId,
    "Created admin user",
    "",
    `username=${admin.username}`,
  );

  return admin;
};

export const deleteUser = async (userId: string, currentUserId: string) => {
  if (userId === currentUserId) {
    throw new Error("You cannot delete yourself");
  }

  const deletedUser = await adminRepository.delete({
    _id: userId,
  });

  if (!deletedUser) {
    throw new Error("User not found");
  }

  await logActivity(
    currentUserId,
    "Deleted user",
    `deletedUserId=${userId}`,
    "",
  );

  return {
    success: true,
    message: "User deleted successfully",
  };
};
