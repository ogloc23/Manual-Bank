import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Core Identity
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    occupation: {
      type: String,
    },

    profileImage: {
      type: String,
      default: "",
    },

    dateOfBirth: {
      type: Date,
    },

    // Fiscal Location
    address: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      required: true,
    },

    stateProvince: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    zipPostalCode: {
      type: String,
      default: "",
    },

    // Account Configuration
    currencyProtocol: {
      type: String,
      default: "USD",
    },

    accountTier: {
      type: String,
      enum: [
        "PREMIUM_SAVINGS_CHECKING",
        "SOVEREIGN_PRIVATE_BANKING",
        "CORPORATE_INFRASTRUCTURE",
      ],
      default: "PREMIUM_SAVINGS_CHECKING",
    },

    accountNumber: {
      type: String,
      unique: true,
    },

    // Wallet Figures
    primaryBalance: {
      type: Number,
      default: 0,
    },

    secondaryBalance: {
      type: Number,
      default: 0,
    },

    tertiaryBalance: {
      type: Number,
      default: 0,
    },

    ssn: {
      type: String,
      default: "",
    },

    totalBalance: {
      type: Number,
      default: 0,
    },

    totalDeposits: {
      type: Number,
      default: 0,
    },

    totalWithdrawals: {
      type: Number,
      default: 0,
    },

    totalTransfers: {
      type: Number,
      default: 0,
    },

    // Security
    password: {
      type: String,
      required: true,
    },

    accessPin: {
      type: String,
      required: true,
    },

    lastLogin: {
      type: Date,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    // Access Control
    role: {
      type: String,
      enum: ["USER", "ADMIN", "SUPER_ADMIN"],
      default: "USER",
    },

    permissions: {
      type: [String],
      default: [],
    },

    // Verification
    kycStatus: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },

    // Virtual Account
    virtualAccountNumber: {
      type: String,
      default: "",
    },

    virtualAccountName: {
      type: String,
      default: "",
    },

    virtualBankName: {
      type: String,
      default: "",
    },

    paymentProvider: {
      type: String,
      enum: ["MONNIFY", "PAYSTACK", "FLUTTERWAVE"],
    },

    // Account State
    accountStatus: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "BLOCKED"],
      default: "ACTIVE",
    },

    // Notification Preferences
    emailNotifications: {
      type: Boolean,
      default: true,
    },

    smsNotifications: {
      type: Boolean,
      default: false,
    },

    pushNotifications: {
      type: Boolean,
      default: true,
    },

    refreshToken: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", UserSchema);
