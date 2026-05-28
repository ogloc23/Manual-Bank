export const depositTypeDefs = `#graphql
  type Deposit {
    id: ID!

    userId: ID!

    amount: Float!

    paymentMethod: String

    proofOfPayment: String

    reference: String

    status: String

    createdAt: String
    updatedAt: String
  }

  input CreateDepositInput {
    amount: Float!
    paymentMethod: String
    proofOfPayment: String
  }

  type Query {
    deposits: [Deposit!]!
    myDeposits: [Deposit!]!
  }

  type Mutation {
    createDeposit(input: CreateDepositInput!): Deposit!
  }
`;