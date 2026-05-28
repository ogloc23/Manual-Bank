export const transactionTypeDefs = `#graphql
  type Transaction {
    id: ID!

    userId: ID!

    transactionType: String!
    amount: Float!

    currency: String

    reference: String!

    status: String!

    direction: String!

    description: String

    createdAt: String
    updatedAt: String
  }

  type Query {
    transactions: [Transaction!]!
    myTransactions: [Transaction!]!
    getTransaction(transactionId: ID!): Transaction
  }
`;