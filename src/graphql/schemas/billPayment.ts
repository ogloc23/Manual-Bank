export const billPaymentTypeDefs = `#graphql
  type BillPayment {
    id: ID!

    userId: ID!

    billType: String!
    provider: String!

    amount: Float!

    reference: String

    status: String

    createdAt: String
    updatedAt: String
  }

  input CreateBillPaymentInput {
    billType: String!
    provider: String!
    amount: Float!
    accountType: String
  }

  type Query {
    billPayments: [BillPayment!]!
    myBillPayments: [BillPayment!]!
  }

  type Mutation {
    payBill(input: CreateBillPaymentInput!): BillPayment!
  }
`;
