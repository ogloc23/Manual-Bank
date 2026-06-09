import "dotenv/config";

import { connectDB } from "../config/db";

import User from "../models/user";

import { hashValue } from "../utils/auth";

const seedAdmin = async (): Promise<void> => {
  try {
    await connectDB();

    const existingSuperAdmin = await User.findOne({
      role: "SUPER_ADMIN",
    });

    if (existingSuperAdmin) {
      console.log("Super admin already exists");

      process.exit(0);
    }

    const hashedPassword = await hashValue("Admin@123");

    const hashedPin = await hashValue("1234");

    await User.create({
      // Core Identity
      firstName: "Super",

      lastName: "Admin",

      email: "superadmin@trustnova.com",

      username: "superadmin",

      phoneNumber: "+10000000000",

      occupation: "System Administrator",

      // Fiscal Location
      country: "United States",

      stateProvince: "New York",

      city: "New York",

      address: "TrustNova Headquarters",

      zipPostalCode: "10001",

      // Account Configuration
      currencyProtocol: "USD",

      accountTier: "SOVEREIGN_PRIVATE_BANKING",

      accountNumber: "0000000001",

      // Wallet Figures
      primaryBalance: 0,

      secondaryBalance: 0,

      tertiaryBalance: 0,

      totalBalance: 0,

      totalDeposits: 0,

      totalWithdrawals: 0,

      totalTransfers: 0,

      // Security
      password: hashedPassword,

      accessPin: hashedPin,

      // Access Control
      role: "SUPER_ADMIN",

      permissions: ["ALL_ACCESS"],

      // Verification
      isVerified: true,

      kycStatus: "VERIFIED",

      // Account State
      accountStatus: "ACTIVE",

      // Notification Preferences
      emailNotifications: true,

      smsNotifications: false,

      pushNotifications: true,
    });

    console.log("Super admin seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Super admin seeding failed:", error);

    process.exit(1);
  }
};

seedAdmin();
