export interface CreateBillPaymentInput {
  billType: string;
  provider: string;
  amount: number;
  accountType?: "PRIMARY_ACCOUNT" | "SECONDARY_ACCOUNT" | "TERTIARY_ACCOUNT";
}
