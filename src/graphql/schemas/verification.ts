export const verificationTypeDefs = `#graphql
  type Verification {
    id: ID!

    userId: ID!

    identityType: String!
    identityNumber: String!

    identityDocument: String!

    selfieImage: String

    status: String

    createdAt: String
    updatedAt: String
  }

  input CreateVerificationInput {
    identityType: String!
    identityNumber: String!
    identityDocument: String!
    selfieImage: String
  }

  type Query {
    verifications: [Verification!]!
    myVerification: Verification
  }

  type Mutation {
    submitVerification(
      input: CreateVerificationInput!
    ): Verification!
  }
`;