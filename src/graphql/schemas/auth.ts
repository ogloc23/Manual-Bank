export const authTypeDefs = `#graphql
  type AuthResponse {
    success: Boolean!
    message: String!
    token: String
    user: User
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    username: String!
    phoneNumber: String!
    occupation: String
    country: String!
    stateProvince: String
    currencyProtocol: String
    accountTier: String
    ssn: String
    password: String!
    confirmPassword: String!
    accessPin: String!
  }

  input LoginInput {
    emailOrUsername: String!
    password: String!
  }

  type Mutation {
    register(input: RegisterInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
  }
`;