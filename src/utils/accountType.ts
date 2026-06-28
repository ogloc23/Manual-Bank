export type AccountType =
  | "PRIMARY_ACCOUNT"
  | "SECONDARY_ACCOUNT"
  | "TERTIARY_ACCOUNT";

export const accountTypeToField = (accountType: AccountType) => {
  switch (accountType) {
    case "PRIMARY_ACCOUNT":
      return "primaryBalance";
    case "SECONDARY_ACCOUNT":
      return "secondaryBalance";
    case "TERTIARY_ACCOUNT":
      return "tertiaryBalance";
    default:
      return "primaryBalance";
  }
};

export const DEFAULT_ACCOUNT: AccountType = "PRIMARY_ACCOUNT";
