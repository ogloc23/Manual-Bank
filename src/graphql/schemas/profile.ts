export const profileTypeDefs = `#graphql

  input UpdateProfileInput {
    firstName: String

    lastName: String

    phoneNumber: String

    occupation: String

    address: String

    country: String

    stateProvince: String

    city: String

    zipPostalCode: String

    dateOfBirth: String

    profileImage: String

    ssn: String
  }

  input ChangePasswordInput {
    currentPassword: String!

    newPassword: String!

    confirmPassword: String!
  }

  input ChangeAccessPinInput {
    currentPin: String!

    newPin: String!

    confirmPin: String!
  }

  input UpdateNotificationPreferencesInput {
    emailNotifications: Boolean

    smsNotifications: Boolean

    pushNotifications: Boolean
  }

  extend type Query {
    profile: User
  }

  extend type Mutation {
    updateProfile(
      input: UpdateProfileInput!
    ): User

    changePassword(
      input: ChangePasswordInput!
    ): User

    changeAccessPin(
      input: ChangeAccessPinInput!
    ): User

    updateNotificationPreferences(
      input: UpdateNotificationPreferencesInput!
    ): User
  }
`;
