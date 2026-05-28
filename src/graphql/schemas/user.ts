export const userTypeDefs = `#graphql
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    username: String!
    phoneNumber: String!
    occupation: String
    address: String
    country: String
    stateProvince: String
    city: String
    isVerified: Boolean!
    zipPostalCode: String
    profileImage: String
    currencyProtocol: String
    accountTier: String
    accountNumber: String
    accountBalance: Float
    availableBalance: Float
    pendingBalance: Float
    totalDeposits: Float
    totalWithdrawals: Float
    totalTransfers: Float
    accountStatus: String
    role: String
    kycStatus: String
    createdAt: String
    updatedAt: String
  }

  input UpdateProfileInput {
    firstName: String
    lastName: String
    userName: String
    phoneNumber: String
    occupation: String
    address: String
    country: String
    stateProvince: String
    city: String
    zipPostalCode: String
    profileImage: String
    currencyProtocol: String
  }

  type Query {
    me: User
    users: [User!]!
    getUser(userId: ID!): User
  }

  type Mutation {
    updateProfile(input: UpdateProfileInput!): User!
  }
`;