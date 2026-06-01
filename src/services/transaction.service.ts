import TransactionRepository from "../repositories/transaction.repository";
import AdminRepository from "../repositories/admin.repository";
import { toObjectId } from "../utils/toObjectId";

import {
  CreateDepositInput,
  CreateWireTransferInput,
} from "../types/transaction.types";

const transactionRepository =
  new TransactionRepository();

const userRepository =
  new AdminRepository();

const generateTransactionId =
  (): string => {
    return `TNX-${Date.now()}`;
  };

const generateReference =
  (): string => {
    return `REF-${Date.now()}`;
  };

export const createDeposit =
  async (
    userId: string,
    input: CreateDepositInput,
  ) => {
    const transaction =
      await transactionRepository.create({
        userId: toObjectId(userId),

        transactionId:
          generateTransactionId(),

        transactionType:
          "DEPOSIT",

        amount: input.amount,

        currency: "USD",

        reference:
          generateReference(),

        status: "PENDING",

        direction: "CREDIT",

        proofOfPayment:
          input.proofOfPayment,

        paymentLinkUsed:
          input.paymentLinkUsed,
      });

    return transaction;
  };

export const createWireTransfer =
  async (
    userId: string,
    input: CreateWireTransferInput,
  ) => {
    const user =
      await userRepository.findOne({
        _id: userId,
      });

    if (!user) {
      throw new Error(
        "User not found",
      );
    }

    if (
      user.availableBalance <
      input.amount
    ) {
      throw new Error(
        "Insufficient balance",
      );
    }

    const transaction =
      await transactionRepository.create({
        userId: toObjectId(userId),

        transactionId:
          generateTransactionId(),

        transactionType:
          "WIRE_TRANSFER",

        amount: input.amount,

        currency:
          user.currencyProtocol,

        reference:
          generateReference(),

        status: "PENDING",

        direction: "DEBIT",

        recipientName:
          input.recipientName,

        recipientBank:
          input.recipientBank,

        recipientAccountNumber:
          input.recipientAccountNumber,

        description:
          input.description,
      });

    return transaction;
  };

export const getTransactions =
  async () => {
    return transactionRepository.findMany(
      {},
    );
  };

export const getMyTransactions =
  async (
    userId: string,
  ) => {
    return transactionRepository.findMany(
      {
        userId,
      },
    );
  };

export const getTransaction =
  async (
    transactionId: string,
  ) => {
    const transaction =
      await transactionRepository.findOne(
        {
          transactionId,
        },
      );

    if (!transaction) {
      throw new Error(
        "Transaction not found",
      );
    }

    return transaction;
  };

export const approveTransaction =
  async (
    transactionId: string,
    adminId: string,
  ) => {
    const transaction =
      await transactionRepository.findOne(
        {
          transactionId,
        },
      );

    if (!transaction) {
      throw new Error(
        "Transaction not found",
      );
    }

    if (
      transaction.status !==
      "PENDING"
    ) {
      throw new Error(
        "Transaction already processed",
      );
    }

    const updatedTransaction =
      await transactionRepository.update(
        {
          transactionId,
        },
        {
          status: "COMPLETED",

          processedBy:
            toObjectId(adminId),

          processedAt:
            new Date(),
        },
      );

    if (
      transaction.transactionType ===
      "DEPOSIT"
    ) {
      await userRepository.update(
        {
          _id:
            transaction.userId,
        },
        {
          $inc: {
            accountBalance:
              transaction.amount,

            availableBalance:
              transaction.amount,

            totalDeposits:
              transaction.amount,
          },
        },
      );
    }

    if (
      transaction.transactionType ===
      "WIRE_TRANSFER"
    ) {
      await userRepository.update(
        {
          _id:
            transaction.userId,
        },
        {
          $inc: {
            accountBalance:
              -transaction.amount,

            availableBalance:
              -transaction.amount,

            totalTransfers:
              transaction.amount,
          },
        },
      );
    }

    return updatedTransaction;
  };

export const rejectTransaction =
  async (
    transactionId: string,
    remarks?: string,
  ) => {
    const transaction =
      await transactionRepository.findOne(
        {
          transactionId,
        },
      );

    if (!transaction) {
      throw new Error(
        "Transaction not found",
      );
    }

    return transactionRepository.update(
      {
        transactionId,
      },
      {
        status: "REJECTED",

        remarks,
      },
    );
  };