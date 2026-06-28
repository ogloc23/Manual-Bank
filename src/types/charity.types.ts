export interface CreateCharityInput {
  organizationName: string;
  amount: number;
  message?: string;
  accountType?: "PRIMARY_ACCOUNT" | "SECONDARY_ACCOUNT" | "TERTIARY_ACCOUNT";
}
