export const charityTypeDefs = `#graphql
  type Charity {
    id: ID!

    userId: ID!

    organizationName: String!

    amount: Float!

    message: String

    reference: String

    status: String

    createdAt: String
    updatedAt: String
  }

  input CreateCharityInput {
    organizationName: String!
    amount: Float!
    message: String
    accountType: String
  }

  type Query {
    charities: [Charity!]!
    myCharities: [Charity!]!
  }

  type Mutation {
    createCharity(input: CreateCharityInput!): Charity!
  }
`;
