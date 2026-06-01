// export const transactionTypeDefs = `#graphql
//   type Transaction {
//     id: ID!

//     userId: ID!

//     transactionType: String!
//     amount: Float!

//     currency: String

//     reference: String!

//     status: String!

//     direction: String!

//     description: String

//     createdAt: String
//     updatedAt: String
//   }

//   type Query {
//     transactions: [Transaction!]!
//     myTransactions: [Transaction!]!
//     getTransaction(transactionId: String!): Transaction
//   }
// `;

export const transactionTypeDefs = `#graphql

  type Transaction {
    id: ID!

    userId: ID!

    transactionId: String!

    transactionType: String!

    amount: Float!

    fee: Float

    currency: String

    reference: String!

    status: String!

    direction: String!

    description: String

    recipientName: String

    recipientBank: String

    recipientAccountNumber: String

    proofOfPayment: String

    paymentLinkUsed: String

    remarks: String

    processedBy: ID

    processedAt: String

    createdAt: String

    updatedAt: String
  }

  input CreateDepositInput {
    amount: Float!

    proofOfPayment: String

    paymentLinkUsed: String
  }

  input CreateWireTransferInput {
    amount: Float!

    recipientName: String!

    recipientBank: String!

    recipientAccountNumber: String!

    description: String
  }

  extend type Query {
    transactions: [Transaction!]!

    myTransactions: [Transaction!]!

    getTransaction(
      transactionId: String!
    ): Transaction
  }

  extend type Mutation {
    approveTransaction(
      transactionId: String!
    ): Transaction

    rejectTransaction(
      transactionId: String!

      remarks: String
    ): Transaction
  }
`;
