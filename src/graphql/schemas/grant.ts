export const grantTypeDefs = `#graphql
  enum GrantType {
    SOVEREIGN_SME_GROWTH_GRANT
    GLOBAL_CIVIC_SOCIAL_INNOVATION_GRANT
    ENTERPRISE_TECH_SECURITY_ADVANCEMENTS_FUND
    REGIONAL_STABILIZATION_ECONOMIC_RECOVERY_GRANT
  }

  enum GrantStatus {
    PENDING
    UNDER_REVIEW
    APPROVED
    DISBURSED
    REJECTED
  }

  enum IndustrySector {
    TECHNOLOGY_PROTOCOLS
    FINANCIAL_SERVICES
    PUBLIC_INFRASTRUCTURE
    HEALTHCARE_WELLNESS
    RETAIL_DISTRIBUTION
    GENERAL_COMMERCE_OPERATIONS
  }

  type Grant {
    id: ID!
    grantId: String!
    userId: ID!
    grantType: GrantType!
    grantTitle: String!
    businessName: String!
    federalTaxId: String!
    industrySector: IndustrySector!
    amount: Float!
    purpose: String!
    status: GrantStatus!
    remarks: String
    processedBy: ID
    processedAt: String
    createdAt: String
    updatedAt: String
  }

  input CreateGrantInput {
    grantType: GrantType!
    businessName: String!
    federalTaxId: String!
    industrySector: IndustrySector!
    amount: Float!
    purpose: String!
  }

  extend type Query {
    grants: [Grant!]!
    myGrants: [Grant!]!
    getGrant(grantId: ID!): Grant
  }

  extend type Mutation {
    createGrant(input: CreateGrantInput!): Grant!
    reviewGrant(grantId: ID!): Grant!
    approveGrant(grantId: ID!): Grant!
    rejectGrant(grantId: ID!, remarks: String): Grant!
    disburseGrant(grantId: ID!): Grant!
  }
`;
