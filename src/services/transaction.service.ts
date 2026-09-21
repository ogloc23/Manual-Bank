import TransactionRepository from "../repositories/transaction.repository";
import AdminRepository from "../repositories/admin.repository";
import { toObjectId } from "../utils/toObjectId";
import {
  AccountType,
  accountTypeToField,
  DEFAULT_ACCOUNT,
} from "../utils/accountType";
import { logActivity } from "./activityLog.service";

const transactionRepository = new TransactionRepository();

const userRepository = new AdminRepository();

const getTargetAccountType = (
  transaction: { accountType?: string },
  override?: string,
): AccountType => {
  const requestedType = (override ??
    transaction.accountType ??
    DEFAULT_ACCOUNT) as AccountType;

  return ["PRIMARY_ACCOUNT", "SECONDARY_ACCOUNT", "TERTIARY_ACCOUNT"].includes(
    requestedType,
  )
    ? requestedType
    : DEFAULT_ACCOUNT;
};

const applyTransactionBalance = async (
  userId: string | { toString(): string },
  accountType: AccountType,
  transactionType: string,
  amount: number,
) => {
  const accountField = accountTypeToField(accountType);
  const amountDelta =
    transactionType === "DEPOSIT" || transactionType === "ADMIN_CREDIT"
      ? amount
      : -amount;

  const balanceUpdate: Record<string, number> = {
    [accountField]: amountDelta,
    totalBalance: amountDelta,
  };

  if (transactionType === "DEPOSIT") {
    balanceUpdate.totalDeposits = amount;
  }

  if (transactionType === "WIRE_TRANSFER") {
    balanceUpdate.totalTransfers = amount;
  }

  if (
    transactionType === "CHARITY" ||
    transactionType === "BILL_PAYMENT" ||
    transactionType === "WITHDRAWAL"
  ) {
    balanceUpdate.totalWithdrawals = amount;
  }

  await userRepository.update(
    { _id: toObjectId(String(userId)) },
    {
      $inc: balanceUpdate,
    },
  );
};

export const getTransactions = async () => {
  return transactionRepository.findMany({});
};

export const getMyTransactions = async (userId: string) => {
  return transactionRepository.findMany({
    userId,
  });
};

export const getTransaction = async (transactionId: string) => {
  const transaction = await transactionRepository.findOne({
    transactionId,
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return transaction;
};

export const approveTransaction = async (
  transactionId: string,
  adminId: string,
  accountTypeOverride?: AccountType,
) => {
  const admin = await userRepository.findOne({
    _id: adminId,
    role: { $in: ["ADMIN", "SUPER_ADMIN"] },
  });

  if (!admin) {
    throw new Error("Forbidden: only admins can approve transactions");
  }

  const transaction = await transactionRepository.findOne({
    transactionId,
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  if (transaction.status !== "PENDING") {
    throw new Error("Transaction already processed");
  }

  const accountType = getTargetAccountType(transaction, accountTypeOverride);
  const updatedTransaction = await transactionRepository.update(
    {
      transactionId,
    },
    {
      status: "COMPLETED",
      accountType,
      processedBy: toObjectId(adminId),
      processedAt: new Date(),
    },
  );

  if (
    [
      "DEPOSIT",
      "WIRE_TRANSFER",
      "CHARITY",
      "BILL_PAYMENT",
      "WITHDRAWAL",
      "ADMIN_CREDIT",
      "ADMIN_DEBIT",
    ].includes(transaction.transactionType)
  ) {
    await applyTransactionBalance(
      transaction.userId,
      accountType,
      transaction.transactionType,
      transaction.amount,
    );
  }

  await logActivity(
    adminId,
    `Approved transaction ${transaction.transactionId}`,
    `status=PENDING`,
    `status=COMPLETED, accountType=${accountType}`,
  );

  return updatedTransaction;
};

export const rejectTransaction = async (
  transactionId: string,
  remarks: string | undefined,
  adminId: string,
) => {
  const admin = await userRepository.findOne({
    _id: adminId,
    role: { $in: ["ADMIN", "SUPER_ADMIN"] },
  });

  if (!admin) {
    throw new Error("Forbidden: only admins can reject transactions");
  }

  const transaction = await transactionRepository.findOne({
    transactionId,
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  const updatedTransaction = await transactionRepository.update(
    {
      transactionId,
    },
    {
      status: "REJECTED",
      remarks,
      processedBy: toObjectId(adminId),
      processedAt: new Date(),
    },
  );

  await logActivity(
    adminId,
    `Rejected transaction ${transaction.transactionId}`,
    `status=PENDING`,
    `status=REJECTED, remarks=${remarks || "none"}`,
  );

  return updatedTransaction;
};
