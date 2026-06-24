import AuthRepository from "../repositories/auth.repository";
import { generateToken, hashValue, compareHash } from "../utils/auth";
import { generateAccountNumber } from "../utils/generateAccountNumber";
import { validatePassword, validatePin, validateSSN } from "../utils/validators";
import { RegisterUserInput, LoginUserInput } from "../types/auth.types";

const authRepository = new AuthRepository();

export const registerUser = async (input: RegisterUserInput) => {
  const {
    firstName,
    lastName,
    email,
    username,
    phoneNumber,
    occupation,
    country,
    stateProvince,
    currencyProtocol,
    accountTier,
    ssn,
    password,
    confirmPassword,
    accessPin,
  } = input;

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  if (!validatePassword(password)) {
    throw new Error("Password must be at least 6 characters");
  }

  if (!validatePin(accessPin)) {
    throw new Error("PIN must be exactly 4 digits");
  }

  if (ssn && !validateSSN(ssn)) {
    throw new Error("SSN must be either 9 digits or formatted as XXX-XX-XXXX");
  }

  const existingEmail = await authRepository.findOne({
    email,
  });

  if (existingEmail) {
    throw new Error("Email already exists");
  }

  const existingUsername = await authRepository.findOne({
    username,
  });

  if (existingUsername) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await hashValue(password);

  const hashedPin = await hashValue(accessPin);

  const user = await authRepository.create({
    firstName,
    lastName,
    email,
    username,
    phoneNumber,
    occupation,
    country,
    stateProvince,
    currencyProtocol,
    accountTier,
    password: hashedPassword,
    accessPin: hashedPin,
    accountNumber: generateAccountNumber(),
    ssn: ssn?.trim() ?? "",
    role: "USER",
    permissions: [],
    isVerified: false,
    kycStatus: "PENDING",
    accountStatus: "ACTIVE",
    isOnline: false,
  });

  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    success: true,
    message: "Account created successfully",
    token,
    user,
  };
};

export const loginUser = async (input: LoginUserInput) => {
  const user = await authRepository.findOne({
    $or: [
      {
        email: input.emailOrUsername,
      },
      {
        username: input.emailOrUsername,
      },
    ],
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.accountStatus !== "ACTIVE") {
    throw new Error("Account is not active");
  }

  const isPasswordCorrect = await compareHash(input.password, user.password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }

  await authRepository.update(
    { _id: user._id },
    {
      lastLogin: new Date(),
      isOnline: true,
    },
  );

  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    success: true,
    message: "Login successful",
    token,
    user,
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await authRepository.findOne({
    _id: userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
