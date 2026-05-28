import AdminRepository from "../repositories/admin.repository";

import { hashValue } from "../utils/auth";

import { generateAccountNumber } from "../utils/generateAccountNumber";

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

export const updateUserStatus = async (input: UpdateUserStatusInput) => {
  const updatedUser = await adminRepository.update(
    {
      _id: input.userId,
    },
    {
      accountStatus: input.accountStatus,
    },
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

export const verifyUser = async (input: VerifyUserInput) => {
  const updatedUser = await adminRepository.update(
    {
      _id: input.userId,
    },
    {
      kycStatus: input.kycStatus,

      isVerified: input.kycStatus === "VERIFIED",
    },
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

export const creditUserBalance = async (input: BalanceUpdateInput) => {
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
      $inc: {
        accountBalance: input.amount,

        availableBalance: input.amount,

        totalDeposits: input.amount,
      },
    },
  );

  return updatedUser;
};

export const debitUserBalance = async (input: BalanceUpdateInput) => {
  const user = await adminRepository.findOne({
    _id: input.userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.availableBalance < input.amount) {
    throw new Error("Insufficient balance");
  }

  const updatedUser = await adminRepository.update(
    {
      _id: input.userId,
    },
    {
      $inc: {
        accountBalance: -input.amount,

        availableBalance: -input.amount,

        totalWithdrawals: input.amount,
      },
    },
  );

  return updatedUser;
};

export const createAdmin = async (input: CreateAdminInput) => {
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

  return {
    success: true,
    message: "User deleted successfully",
  };
};
