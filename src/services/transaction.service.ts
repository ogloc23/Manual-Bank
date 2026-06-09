import TransactionRepository from "../repositories/transaction.repository";
import AdminRepository from "../repositories/admin.repository";
import { toObjectId } from "../utils/toObjectId";
import { logActivity } from "./activityLog.service";

const transactionRepository = new TransactionRepository();

const userRepository = new AdminRepository();

const generateTransactionId = (): string => {
  return `TNX-${Date.now()}`;
};

const generateReference = (): string => {
  return `REF-${Date.now()}`;
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
) => {
  const transaction = await transactionRepository.findOne({
    transactionId,
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  if (transaction.status !== "PENDING") {
    throw new Error("Transaction already processed");
  }

  const updatedTransaction = await transactionRepository.update(
    {
      transactionId,
    },
    {
      status: "COMPLETED",
      processedBy: toObjectId(adminId),
      processedAt: new Date(),
    },
  );

  if (transaction.transactionType === "DEPOSIT") {
    await userRepository.update(
      {
        _id: transaction.userId,
      },
      {
        $inc: {
          primaryBalance: transaction.amount,
          secondaryBalance: transaction.amount,
          tertiaryBalance: -transaction.amount,
          totalBalance: transaction.amount,
          totalDeposits: transaction.amount,
        },
      },
    );
  }

  if (transaction.transactionType === "WIRE_TRANSFER") {
    await userRepository.update(
      {
        _id: transaction.userId,
      },
      {
        $inc: {
          primaryBalance: -transaction.amount,
          tertiaryBalance: -transaction.amount,
          totalBalance: -transaction.amount * 2,
          totalTransfers: transaction.amount,
        },
      },
    );
  }

  if (
    transaction.transactionType === "CHARITY" ||
    transaction.transactionType === "BILL_PAYMENT"
  ) {
    const amountAdjustment =
      transaction.transactionType === "CHARITY" ||
      transaction.transactionType === "BILL_PAYMENT"
        ? -transaction.amount
        : 0;

    await userRepository.update(
      {
        _id: transaction.userId,
      },
      {
        $inc: {
          primaryBalance: amountAdjustment,
          tertiaryBalance: -transaction.amount,
          totalBalance: amountAdjustment - transaction.amount,
          totalWithdrawals: transaction.amount,
        },
      },
    );
  }

  await logActivity(
    adminId,
    `Approved transaction ${transaction.transactionId}`,
    `status=PENDING`,
    `status=COMPLETED`,
  );

  return updatedTransaction;
};

export const rejectTransaction = async (
  transactionId: string,
  remarks: string | undefined,
  adminId: string,
) => {
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
