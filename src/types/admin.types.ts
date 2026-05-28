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
