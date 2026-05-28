export const notificationTypeDefs = `#graphql
  type Notification {
    id: ID!

    title: String!
    message: String!

    type: String!

    isRead: Boolean!

    createdAt: String
    updatedAt: String
  }

  type Query {
    notifications: [Notification!]!
  }
`;