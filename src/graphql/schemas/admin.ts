export const adminTypeDefs = `#graphql

  type AdminActionResponse {
    success: Boolean!
    message: String!
  }

  input UpdateUserStatusInput {
    userId: ID!

    accountStatus: String!
  }

  input VerifyUserInput {
    userId: ID!

    kycStatus: String!
  }

  enum BalanceType {
    PRIMARY_BALANCE
    SECONDARY_BALANCE
    TERTIARY_BALANCE
  }

  input BalanceUpdateInput {
    userId: ID!
    balanceType: BalanceType!
    amount: Float!
  }

  input CreateAdminInput {
    firstName: String!

    lastName: String!

    email: String!

    username: String!

    password: String!

    phoneNumber: String!
  }

  input ApproveDepositInput {
    depositId: ID!
  }

  input RejectDepositInput {
    depositId: ID!
    remarks: String
  }

  input ApproveWireTransferInput {
    wireTransferId: ID!
  }

  input RejectWireTransferInput {
    wireTransferId: ID!
    remarks: String
  }

  input ApproveVerificationInput {
    verificationId: ID!
  }

  input RejectVerificationInput {
    verificationId: ID!
    remarks: String
  }

  extend type Query {
    users: [User]

    user(userId: ID!): User
  }

  extend type Mutation {
    updateUserStatus(
      input: UpdateUserStatusInput!
    ): User

    verifyUser(
      input: VerifyUserInput!
    ): User

    creditUserBalance(
      input: BalanceUpdateInput!
    ): User

    debitUserBalance(
      input: BalanceUpdateInput!
    ): User

    createAdmin(
      input: CreateAdminInput!
    ): User

    deleteUser(
      userId: ID!
    ): AdminActionResponse

    approveLoan(
      loanId: ID!
    ): Loan

    rejectLoan(
      loanId: ID!
      remarks: String
    ): Loan

    approveCharity(
      charityId: ID!
    ): Charity

    rejectCharity(
      charityId: ID!
      remarks: String
    ): Charity

    approveBillPayment(
      billPaymentId: ID!
    ): BillPayment

    rejectBillPayment(
      billPaymentId: ID!
      remarks: String
    ): BillPayment

    approveDeposit(
      depositId: ID!
    ): Deposit

    rejectDeposit(
      depositId: ID!
      remarks: String
    ): Deposit

    approveWireTransfer(
      wireTransferId: ID!
    ): WireTransfer

    rejectWireTransfer(
      wireTransferId: ID!
      remarks: String
    ): WireTransfer

    approveVerification(
      verificationId: ID!
    ): Verification

    rejectVerification(
      verificationId: ID!
      remarks: String
    ): Verification
  }
`;
