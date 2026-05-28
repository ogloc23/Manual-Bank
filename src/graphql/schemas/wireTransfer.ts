export const wireTransferTypeDefs = `#graphql
  type WireTransfer {
    id: ID!

    userId: ID!

    beneficiaryName: String!
    beneficiaryBank: String!
    accountNumber: String!

    swiftCode: String

    amount: Float!

    fee: Float

    reason: String

    reference: String

    status: String

    createdAt: String
    updatedAt: String
  }

  input CreateWireTransferInput {
    beneficiaryName: String!
    beneficiaryBank: String!
    accountNumber: String!
    swiftCode: String
    amount: Float!
    reason: String
  }

  type Query {
    wireTransfers: [WireTransfer!]!
    myWireTransfers: [WireTransfer!]!
  }

  type Mutation {
    createWireTransfer(
      input: CreateWireTransferInput!
    ): WireTransfer!
  }
`;