export interface CreateDepositInput {
  amount: number;

  paymentMethod?: string;

  proofOfPayment?: string;

  paymentLinkUsed?: string;
  accountType?: "PRIMARY_ACCOUNT" | "SECONDARY_ACCOUNT" | "TERTIARY_ACCOUNT";
}

export interface CreateWireTransferInput {
  amount: number;

  beneficiaryName: string;

  beneficiaryBank: string;

  accountNumber: string;

  swiftCode?: string;

  reason?: string;
  accountType?: "PRIMARY_ACCOUNT" | "SECONDARY_ACCOUNT" | "TERTIARY_ACCOUNT";
}

export interface ApproveTransactionInput {
  transactionId: string;
  accountType?: "PRIMARY_ACCOUNT" | "SECONDARY_ACCOUNT" | "TERTIARY_ACCOUNT";
}

export interface RejectTransactionInput {
  transactionId: string;

  remarks?: string;
}
