export type AccountTier =
  | "PREMIUM_SAVINGS_CHECKING"
  | "SOVEREIGN_PRIVATE_BANKING"
  | "CORPORATE_INFRASTRUCTURE";

export interface RegisterUserInput {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;

  occupation?: string;

  country: string;
  stateProvince?: string;

  currencyProtocol?: string;

  accountTier: AccountTier;

  password: string;
  confirmPassword: string;

  accessPin: string;
}

export interface LoginUserInput {
  emailOrUsername: string;
  password: string;
}