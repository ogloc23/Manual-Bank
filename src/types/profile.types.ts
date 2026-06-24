export interface UpdateProfileInput {
  firstName?: string;

  lastName?: string;

  phoneNumber?: string;

  occupation?: string;

  address?: string;

  country?: string;

  stateProvince?: string;

  city?: string;

  zipPostalCode?: string;

  dateOfBirth?: string;

  profileImage?: string;

  ssn?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;

  newPassword: string;

  confirmPassword: string;
}

export interface ChangeAccessPinInput {
  currentPin: string;

  newPin: string;

  confirmPin: string;
}

export interface UpdateNotificationPreferencesInput {
  emailNotifications?: boolean;

  smsNotifications?: boolean;

  pushNotifications?: boolean;
}
