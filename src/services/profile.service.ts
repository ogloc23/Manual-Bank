import ProfileRepository from "../repositories/profile.repository";

import { compareHash, hashValue } from "../utils/auth";

import { validatePassword, validatePin, validateSSN } from "../utils/validators";

import {
  UpdateProfileInput,
  ChangePasswordInput,
  ChangeAccessPinInput,
  UpdateNotificationPreferencesInput,
} from "../types/profile.types";

const profileRepository = new ProfileRepository();

export const getProfile = async (userId: string) => {
  const user = await profileRepository.findOne({
    _id: userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateProfile = async (
  userId: string,
  input: UpdateProfileInput,
) => {
  const sanitizedInput: Partial<UpdateProfileInput> = { ...input };

  if (input.ssn !== undefined) {
    sanitizedInput.ssn = input.ssn?.trim();
  }

  if (sanitizedInput.ssn && !validateSSN(sanitizedInput.ssn)) {
    throw new Error("SSN must be either 9 digits or formatted as XXX-XX-XXXX");
  }

  const updatedUser = await profileRepository.update(
    {
      _id: userId,
    },
    sanitizedInput,
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

export const changePassword = async (
  userId: string,
  input: ChangePasswordInput,
) => {
  const user = await profileRepository.findOne({
    _id: userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordCorrect = await compareHash(
    input.currentPassword,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new Error("Current password is incorrect");
  }

  if (input.newPassword !== input.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  if (!validatePassword(input.newPassword)) {
    throw new Error("Password must be at least 6 characters");
  }

  const hashedPassword = await hashValue(input.newPassword);

  const updatedUser = await profileRepository.update(
    {
      _id: userId,
    },
    {
      password: hashedPassword,
    },
  );

  return updatedUser;
};

export const changeAccessPin = async (
  userId: string,
  input: ChangeAccessPinInput,
) => {
  const user = await profileRepository.findOne({
    _id: userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPinCorrect = await compareHash(input.currentPin, user.accessPin);

  if (!isPinCorrect) {
    throw new Error("Current PIN is incorrect");
  }

  if (input.newPin !== input.confirmPin) {
    throw new Error("PINs do not match");
  }

  if (!validatePin(input.newPin)) {
    throw new Error("PIN must be exactly 4 digits");
  }

  const hashedPin = await hashValue(input.newPin);

  const updatedUser = await profileRepository.update(
    {
      _id: userId,
    },
    {
      accessPin: hashedPin,
    },
  );

  return updatedUser;
};

export const updateNotificationPreferences = async (
  userId: string,
  input: UpdateNotificationPreferencesInput,
) => {
  const updatedUser = await profileRepository.update(
    {
      _id: userId,
    },
    input,
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};
