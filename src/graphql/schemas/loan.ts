export const loanTypeDefs = `#graphql
  type Loan {
    id: ID!

    userId: ID!

    loanAmount: Float!

    interestRate: Float

    durationMonths: Int!

    repaymentStatus: String

    status: String

    createdAt: String
    updatedAt: String
  }

  input CreateLoanInput {
    loanAmount: Float!
    durationMonths: Int!
  }

  type Query {
    loans: [Loan!]!
    myLoans: [Loan!]!
  }

  type Mutation {
    applyForLoan(input: CreateLoanInput!): Loan!
  }
`;