export const activityLogTypeDefs = `#graphql
  type ActivityLog {
    id: ID!

    adminId: ID!

    action: String!

    previousValue: String

    newValue: String

    ipAddress: String

    createdAt: String
    updatedAt: String
  }

  type Query {
    activityLogs: [ActivityLog!]!
  }
`;