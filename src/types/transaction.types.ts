export interface CreateDepositInput {
  amount: number;

  paymentMethod?: string;

  proofOfPayment?: string;

  paymentLinkUsed?: string;
}

export interface CreateWireTransferInput {
  amount: number;

  beneficiaryName: string;

  beneficiaryBank: string;

  accountNumber: string;

  swiftCode?: string;

  reason?: string;
}

export interface ApproveTransactionInput {
  transactionId: string;
}

export interface RejectTransactionInput {
  transactionId: string;

  remarks?: string;
}
