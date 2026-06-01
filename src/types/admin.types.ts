export interface UpdateUserStatusInput {
  userId: string;
  accountStatus: "ACTIVE" | "SUSPENDED" | "BLOCKED";
}

export interface VerifyUserInput {
  userId: string;
  kycStatus: "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
}

export interface BalanceUpdateInput {
  userId: string;
  balanceType: "PRIMARY_BALANCE" | "SECONDARY_BALANCE" | "TERTIARY_BALANCE";
  amount: number;
}

export interface CreateAdminInput {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
}

export interface ApproveLoanInput {
  loanId: string;
}

export interface RejectLoanInput {
  loanId: string;
  remarks?: string;
}

export interface ApproveCharityInput {
  charityId: string;
}

export interface RejectCharityInput {
  charityId: string;
  remarks?: string;
}

export interface ApproveBillPaymentInput {
  billPaymentId: string;
}

export interface RejectBillPaymentInput {
  billPaymentId: string;
  remarks?: string;
}

export interface ApproveDepositInput {
  depositId: string;
}

export interface RejectDepositInput {
  depositId: string;
  remarks?: string;
}

export interface ApproveWireTransferInput {
  wireTransferId: string;
}

export interface RejectWireTransferInput {
  wireTransferId: string;
  remarks?: string;
}

export interface ApproveVerificationInput {
  verificationId: string;
}

export interface RejectVerificationInput {
  verificationId: string;
  remarks?: string;
}
