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

  input BalanceUpdateInput {
    userId: ID!

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
  }
`;
