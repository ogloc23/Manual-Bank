export interface CreateDepositInput {
  amount: number;

  proofOfPayment?: string;

  paymentLinkUsed?: string;
}

export interface CreateWireTransferInput {
  amount: number;

  recipientName: string;

  recipientBank: string;

  recipientAccountNumber: string;

  description?: string;
}

export interface ApproveTransactionInput {
  transactionId: string;
}

export interface RejectTransactionInput {
  transactionId: string;

  remarks?: string;
}